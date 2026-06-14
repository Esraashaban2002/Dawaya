import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight, ShoppingCart,
  Heart, X, Pill, Stethoscope, AlertCircle, Share2, Activity,
  ChevronDown, ChevronUp, MessageCircle, Check, Loader2, GripVertical
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Local static data for medicines (100 products)
const localMedicines = [
  {
    "id": 1,
    "name": "بروفين 400 مجم",
    "genericName": "Ibuprofen",
    "category": "مسكنات",
    "description": "وصف مختصر لدواء 1",
    "price": 20,
    "quantity": 50,
    "requiresPrescription": false,
    "image": "https://media.zid.store/0a395ab0-f830-43d1-a748-253eb7272793/1f387de7-72b5-4a52-95d5-c7b3e9d6754a.jpg",
    "manufacturer": "فاركو"
  },
  {
    "id": 2,
    "name": "بانادول أدفانس",
    "genericName": "Paracetamol",
    "category": "مضادات حيوية",
    "description": "وصف مختصر لدواء 2",
    "price": 23,
    "quantity": 57,
    "requiresPrescription": true,
    "image": "https://i-cf65.ch-static.com/content/dam/cf-consumer-healthcare/panadol-reskin/ar_AE/adult/Panadol%20Advance%20455x455.jpg?auto=format",
    "manufacturer": "إيبيكو"
  },
  {
    "id": 3,
    "name": "كتافلام 50 مجم",
    "genericName": "Diclofenac",
    "category": "أدوية البرد",
    "description": "وصف مختصر لدواء 3",
    "price": 26,
    "quantity": 64,
    "requiresPrescription": false,
    "image": "https://ozone-pharmacy.com/media/mf_webp/jpg/media/catalog/product/cache/0daeb07bb1d294c1f281fab47369d56a/P/r/ProductImage_150610_2.webp",
    "manufacturer": "أمون"
  },
  {
    "id": 4,
    "name": "أوجمنتين 1 جم",
    "genericName": "Amoxicillin + Clavulanate",
    "category": "الحساسية",
    "description": "وصف مختصر لدواء 4",
    "price": 29,
    "quantity": 71,
    "requiresPrescription": false,
    "image": "https://cdn.salla.sa/VqEPxq/6a98eb05-eec5-4030-9710-ad7d996bc690-1000x1000-JXYZt5fFDtM8zuBDj72m7lE4xvGgDQfsdtSmlhXZ.png",
    "manufacturer": "سيجما"
  },
  {
    "id": 5,
    "name": "أموكسيل 500 مجم",
    "genericName": "Amoxicillin",
    "category": "الجهاز الهضمي",
    "description": "وصف مختصر لدواء 5",
    "price": 32,
    "quantity": 78,
    "requiresPrescription": false,
    "image": "https://cdn.salla.sa/VqEPxq/f1cfc174-9849-4e57-b37f-d65cf9bef4a9-1000x1000-NUdVBV3S9gmFNVSH8hQY01UJzYPqItoAKwcyzO2Q.jpg",
    "manufacturer": "ممفيس"
  },
  {
    "id": 6,
    "name": "كونجستال",
    "genericName": "Paracetamol + Pseudoephedrine",
    "category": "ضغط الدم",
    "description": "وصف مختصر لدواء 6",
    "price": 35,
    "quantity": 85,
    "requiresPrescription": true,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlG3kzZIwls0f7r6MMAlYvgrAP1Ud2AzkskA&s",
    "manufacturer": "أكتوبر فارما"
  },
  {
    "id": 7,
    "name": "أنتينال",
    "genericName": "Nifuroxazide",
    "category": "السكري",
    "description": "وصف مختصر لدواء 7",
    "price": 38,
    "quantity": 92,
    "requiresPrescription": true,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTULVOxL5WxeiR5elDMuw_DmqL2i2tVy1K1IQ&s",
    "manufacturer": "ميرك"
  },
  {
    "id": 8,
    "name": "إيموديوم",
    "genericName": "Loperamide",
    "category": "فيتامينات",
    "description": "وصف مختصر لدواء 8",
    "price": 41,
    "quantity": 99,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCPIXml8IgKB9CJbve3h2kpYl4o6B75BC6LQ&s",
    "manufacturer": "فايزر"
  },
  {
    "id": 9,
    "name": "جاست ريج",
    "genericName": "Trimebutine",
    "category": "القلب والأوعية",
    "description": "وصف مختصر لدواء 9",
    "price": 44,
    "quantity": 106,
    "requiresPrescription": true,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGOhcbDWBxOeXpIYixkhhs2zeRZKG0cvquAQ&s",
    "manufacturer": "سانوفي"
  },
  {
    "id": 10,
    "name": "زيرتك",
    "genericName": "Cetirizine",
    "category": "الربو",
    "description": "وصف مختصر لدواء 10",
    "price": 47,
    "quantity": 113,
    "requiresPrescription": true,
    "image": "https://www.bloompharmacy.com/cdn/shop/products/zyrtec-10-mg-20-tablets-382069_600x600_crop_center.jpg?v=1687731891",
    "manufacturer": "جلاكسو سميث كلاين"
  },
  {
    "id": 11,
    "name": "بانادول إكسترا",
    "genericName": "Paracetamol",
    "category": "مسكنات",
    "description": "مسكن قوي للآلام وخافض للحرارة",
    "price": 50,
    "quantity": 120,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdv-u4L-4kXdW8Q0XR8DDTx68Z7DHywPUyAw&s",
    "manufacturer": "جلاكسو سميث كلاين"
  },
  {
    "id": 12,
    "name": "أميوكسيسين",
    "genericName": "Amoxicillin",
    "category": "مضادات حيوية",
    "description": "مضاد حيوي واسع الطيف لعلاج العدوى البكتيرية",
    "price": 53,
    "quantity": 127,
    "requiresPrescription": true,
    "image": "https://barakat-pharma.com/wp-content/uploads/2019/09/all_0057_Amoxicillin-Arabic.jpg",
    "manufacturer": "إيبيكو"
  },
  {
    "id": 13,
    "name": "كومتركس",
    "genericName": "Paracetamol + Phenylephrine",
    "category": "أدوية البرد",
    "description": "دواء شامل لأعراض البرد والإنفلونزا",
    "price": 56,
    "quantity": 134,
    "requiresPrescription": false,
    "image": "https://dwaprices.com/upload/1634211164.jpg",
    "manufacturer": "أمون"
  },
  {
    "id": 14,
    "name": "زيرتك",
    "genericName": "Cetirizine",
    "category": "الحساسية",
    "description": "مضاد للحساسية وحكة الجلد والأرتيكاريا",
    "price": 59,
    "quantity": 141,
    "requiresPrescription": false,
    "image": "https://www.bloompharmacy.com/cdn/shop/products/zyrtec-10-mg-20-tablets-382069_600x600_crop_center.jpg?v=1687731891",
    "manufacturer": "سيجما"
  },
  {
    "id": 15,
    "name": "جافيسكون",
    "genericName": "Alginic Acid + Sodium Bicarbonate",
    "category": "الجهاز الهضمي",
    "description": "دواء فعال لحموضة المعدة والارتجاع المريئي",
    "price": 62,
    "quantity": 148,
    "requiresPrescription": false,
    "image": "https://cdn.chefaa.com/filters:format(webp)/public/uploads/products/gaviscon-peppermint-24-liquid-sachets-10ml-ldzp-11648820436.png",
    "manufacturer": "ممفيس"
  },
  {
    "id": 16,
    "name": "تينول",
    "genericName": "Atenolol",
    "category": "ضغط الدم",
    "description": "دواء لخفض ضغط الدم العالي",
    "price": 65,
    "quantity": 155,
    "requiresPrescription": true,
    "image": "https://cdn.altibbi.com/cdn/cache/large/image/2020/09/28/4ccbecc426afc963e844902455f71cd2.jpg.webp",
    "manufacturer": "أكتوبر فارما"
  },
  {
    "id": 17,
    "name": "أماريل",
    "genericName": "Glimepiride",
    "category": "السكري",
    "description": "دواء لتنظيم نسبة السكر في الدم",
    "price": 68,
    "quantity": 162,
    "requiresPrescription": true,
    "image": "https://almasrypharmacy.com/media/catalog/product/cache/u/n/unnamed_4_.png",
    "manufacturer": "ميرك"
  },
  {
    "id": 18,
    "name": "سنتروم",
    "genericName": "Multi-Vitamin & Minerals",
    "category": "فيتامينات",
    "description": "مكمل غذائي شامل من الفيتامينات والمعادن",
    "price": 71,
    "quantity": 169,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRDaipW_EG4aCHiIdJ8pId85ig3EGZ8FqXqh-6ECDf6ODGNnJRwf3-GRjMqqHSe2PhzSYc7tvSBuxD-mhDGRi119mIlkoty191RChmCmPFQeCL_X0fl35IRTYrvR5jbXaNNlIvoSA&usqp=CAc",
    "manufacturer": "فايزر"
  },
  {
    "id": 19,
    "name": "أسبرين",
    "genericName": "Acetylsalicylic Acid",
    "category": "القلب والأوعية",
    "description": "مضاد للتجلط ومسكن للآلام",
    "price": 74,
    "quantity": 176,
    "requiresPrescription": true,
    "image": "https://www.aspirin.me/sites/g/files/vrxlpx24711/files/2022-03/prod-packshot-aspirin-protect-ar2%20%281%29.png",
    "manufacturer": "سانوفي"
  },
  {
    "id": 20,
    "name": "فينتولين",
    "genericName": "Salbutamol",
    "category": "الربو",
    "description": "استنشاق لتوسيع الشعب الهوائية",
    "price": 77,
    "quantity": 183,
    "requiresPrescription": true,
    "image": "https://doctormpharmacy.com/cdn/shop/files/121931.jpg?v=1755356251",
    "manufacturer": "جلاكسو سميث كلاين"
  },
  {
    "id": 21,
    "name": "ديكلوفيناك",
    "genericName": "Diclofenac",
    "category": "مسكنات",
    "description": "مسكن قوي ومضاد للالتهاب",
    "price": 80,
    "quantity": 190,
    "requiresPrescription": false,
    "image": "https://cdn.altibbi.com/cdn/cache/large/image/2021/08/23/9c2d7741b73691f447d285a5a14b296a.webp",
    "manufacturer": "فاركو"
  },
  {
    "id": 22,
    "name": "إريثرومايسين",
    "genericName": "Erythromycin",
    "category": "مضادات حيوية",
    "description": "مضاد حيوي ماكروليدي للعدوى البكتيرية",
    "price": 83,
    "quantity": 197,
    "requiresPrescription": true,
    "image": "https://scontent.fcai19-3.fna.fbcdn.net/v/t39.30808-6/528257151_1323127649821413_4962218174622745807_n.jpg?stp=dst-jpg_tt6&cstp=mx960x540&ctp=s960x540&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Xtzsk3v2M7cQ7kNvwFnaqQt&_nc_oc=AdoE0YOQx12IVGTRTZvvFv0kYQoxugumEHPO12RWOS7S8LQ9A2omiCRE5P6ABID85Hw&_nc_zt=23&_nc_ht=scontent.fcai19-3.fna&_nc_gid=TSa8x8CQ0RxtiCjKTj1t3g&_nc_ss=7a289&oh=00_Af_n_x8Xv668XqVyEaENbrC-swB3-Gk8U_NwSVy_1qHa8A&oe=6A32EB31",
    "manufacturer": "إيبيكو"
  },
  {
    "id": 23,
    "name": "كونجيستال",
    "genericName": "Diphenhydramine + Phenylephrine",
    "category": "أدوية البرد",
    "description": "دواء فعال لأعراض البرد والاحتقان",
    "price": 86,
    "quantity": 204,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkY8POdYocyledHhulzwJXTtj0nqO4gAC9Uw&s",
    "manufacturer": "أمون"
  },
  {
    "id": 24,
    "name": "تيلفاست",
    "genericName": "Fexofenadine",
    "category": "الحساسية",
    "description": "مضاد حساسية حديث بدون نعاس",
    "price": 89,
    "quantity": 211,
    "requiresPrescription": false,
    "image": "https://images.matjrah.online/2744/image/catalog/productimage/054b4da9af96018642665b98290ff61f8-550x550.jpg",
    "manufacturer": "سيجما"
  },
  {
    "id": 25,
    "name": "رينمارك",
    "genericName": "Metoclopramide",
    "category": "الجهاز الهضمي",
    "description": "دواء لتحسين حركة الجهاز الهضمي",
    "price": 92,
    "quantity": 218,
    "requiresPrescription": false,
    "image": "https://m.media-amazon.com/images/I/71UjDJJSmhL.jpg",
    "manufacturer": "ممفيس"
  },
  {
    "id": 26,
    "name": "دوميتل",
    "genericName": "Lisinopril",
    "category": "ضغط الدم",
    "description": "مثبط ACE لخفض ضغط الدم",
    "price": 95,
    "quantity": 225,
    "requiresPrescription": true,
    "image": "https://cdn.altibbi.com/cdn/cache/large/image/2021/05/30/82a9c302ecee12fdc672a4e1d6551c5d.webp",
    "manufacturer": "أكتوبر فارما"
  },
  {
    "id": 27,
    "name": "جليبنكلاميد",
    "genericName": "Glibenclamide",
    "category": "السكري",
    "description": "دواء لتنظيم السكري من النوع الثاني",
    "price": 98,
    "quantity": 232,
    "requiresPrescription": true,
    "image": "https://www.sehatok.com/sites/default/files/styles/large_16_9/public/2023-12/%D8%AF%D9%88%D8%A7%D9%86%D9%8A%D9%84%20%28%D8%AC%D9%84%D9%8A%D9%86%D9%83%D9%84%D8%A7%D9%85%D9%8A%D8%AF%29.png?h=b986b931&itok=RkCz8DHB",
    "manufacturer": "ميرك"
  },
  {
    "id": 28,
    "name": "فيتامين د3",
    "genericName": "Cholecalciferol",
    "category": "فيتامينات",
    "description": "فيتامين د لتقوية العظام والمناعة",
    "price": 101,
    "quantity": 239,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8CX0bom8R4vN25zrpnK630xD8pz4XCy1gYw&s",
    "manufacturer": "فايزر"
  },
  {
    "id": 29,
    "name": "أنجيوتال",
    "genericName": "Isosorbide Dinitrate",
    "category": "القلب والأوعية",
    "description": "دواء لعلاج الذبحة الصدرية",
    "price": 104,
    "quantity": 246,
    "requiresPrescription": true,
    "image": "https://www.albayan.ae/assets/archives/images/2018/10/17/3385584.jpg",
    "manufacturer": "سانوفي"
  },
  {
    "id": 30,
    "name": "سيريتايد",
    "genericName": "Salmeterol + Fluticasone",
    "category": "الربو",
    "description": "استنشاق مركب لعلاج الربو المزمن",
    "price": 107,
    "quantity": 253,
    "requiresPrescription": true,
    "image": "https://kuludonline.com/cdn/shop/files/26742_grande.jpg?v=1746793265",
    "manufacturer": "جلاكسو سميث كلاين"
  },
  {
    "id": 31,
    "name": "إيبوبروفين",
    "genericName": "Ibuprofen",
    "category": "مسكنات",
    "description": "مسكن قوي ومضاد للالتهاب",
    "price": 110,
    "quantity": 260,
    "requiresPrescription": false,
    "image": "https://media.gemini.media/img/large/2022/6/16/2022_6_16_14_22_7_800.jpg",
    "manufacturer": "فاركو"
  },
  {
    "id": 32,
    "name": "أموكسيسيلين كلافيولانات",
    "genericName": "Amoxicillin + Clavulanic Acid",
    "category": "مضادات حيوية",
    "description": "مضاد حيوي محسّن للعدوى المقاومة",
    "price": 113,
    "quantity": 267,
    "requiresPrescription": true,
    "image": "https://cdn.altibbi.com/cdn/cache/large/image/2021/10/02/6877616c0fae147679c04114f2dcbc87.jpg.webp",
    "manufacturer": "إيبيكو"
  },
  {
    "id": 33,
    "name": "نوفاليس",
    "genericName": "Chlorphenamine + Paracetamol",
    "category": "أدوية البرد",
    "description": "دواء شامل لأعراض البرد",
    "price": 116,
    "quantity": 274,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYFThhFf1Yj5jz7FLMCYh1zt_ke8xWU6cO1w&s",
    "manufacturer": "أمون"
  },
  {
    "id": 34,
    "name": "دسلين",
    "genericName": "Loratadine",
    "category": "الحساسية",
    "description": "مضاد حساسية طويل المفعول",
    "price": 119,
    "quantity": 281,
    "requiresPrescription": false,
    "image": "https://tse2.mm.bing.net/th/id/OIP.J92eb3TND30WUdKENAvNKAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "manufacturer": "سيجما"
  },
  {
    "id": 35,
    "name": "أوميبرازول",
    "genericName": "Omeprazole",
    "category": "الجهاز الهضمي",
    "description": "دواء لتقليل حموضة المعدة",
    "price": 122,
    "quantity": 288,
    "requiresPrescription": false,
    "image": "https://i5.walmartimages.com/seo/Omeprazole-Delayed-Release-Tablets-20mg-Acid-Reducer-42-Count_6d1bf2ff-4c49-40a1-a0ed-8bc3c737b64f.9d8856e9c1a4e8186ab2c8128030483a.jpeg",
    "manufacturer": "ممفيس"
  },
  {
    "id": 36,
    "name": "كابوتين",
    "genericName": "Captopril",
    "category": "ضغط الدم",
    "description": "مثبط ACE لخفض ضغط الدم السريع",
    "price": 125,
    "quantity": 295,
    "requiresPrescription": true,
    "image": "https://tse4.mm.bing.net/th/id/OIP.V-K_6CAocliYTO-KB_JCpQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "manufacturer": "أكتوبر فارما"
  },
  {
    "id": 37,
    "name": "ميتفورمين",
    "genericName": "Metformin",
    "category": "السكري",
    "description": "الخيار الأول لعلاج السكري من النوع الثاني",
    "price": 128,
    "quantity": 52,
    "requiresPrescription": true,
    "image": "https://altabeb.com/wp-content/uploads/2019/01/prod_photo20160503121208-1024x637.jpg",
    "manufacturer": "ميرك"
  },
  {
    "id": 38,
    "name": "كالسيوم فيتامين د",
    "genericName": "Calcium + Vitamin D3",
    "category": "فيتامينات",
    "description": "مكمل لصحة العظام والأسنان",
    "price": 131,
    "quantity": 59,
    "requiresPrescription": false,
    "image": "https://tse1.mm.bing.net/th/id/OIP.VOmx3VBviShbQ8P4mign6wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "manufacturer": "فايزر"
  },
  {
    "id": 39,
    "name": "أتينول كوفين",
    "genericName": "Atenolol + Nifedipine",
    "category": "القلب والأوعية",
    "description": "دواء مركب لضغط الدم والقلب",
    "price": 134,
    "quantity": 66,
    "requiresPrescription": true,
    "image": "https://tse4.mm.bing.net/th/id/OIP.V-K_6CAocliYTO-KB_JCpQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "manufacturer": "سانوفي"
  },
  {
    "id": 40,
    "name": "فورموتيرول",
    "genericName": "Formoterol",
    "category": "الربو",
    "description": "منبسط قصبي طويل المفعول",
    "price": 137,
    "quantity": 73,
    "requiresPrescription": true,
    "image": "https://www.sehatok.com/sites/default/files/styles/hp_main_slider_large/public/2023-09/%D9%81%D9%88%D8%B1%D8%A7%D8%AF%D9%8A%D9%84%20(%D9%81%D9%88%D8%B1%D9%85%D9%88%D8%AA%D9%8A%D8%B1%D9%88%D9%84).png?h=6c2b0a87&itok=9ovkCdVj",
    "manufacturer": "جلاكسو سميث كلاين"
  },
  {
    "id": 41,
    "name": "نابروكسين",
    "genericName": "Naproxen",
    "category": "مسكنات",
    "description": "مسكن قوي وفعال للالتهابات",
    "price": 140,
    "quantity": 80,
    "requiresPrescription": false,
    "image": "https://th.bing.com/th/id/R.07cc6dbc107e8aacf5ad95590e0e0157?rik=%2fVhF%2bKSRMSoxbw&riu=http%3a%2f%2fchefaa.com%2fblog%2fwp-content%2fuploads%2f2022%2f05%2f%d9%86%d8%a7%d8%a8%d8%b1%d9%88%d9%83%d8%b3%d9%8a%d9%86-naproxen-e1652963562360-300x156.png&ehk=oMlQg414WeXBZg4g9mT%2b%2fZVHeopVwJN7bemQxB3s1yE%3d&risl=&pid=ImgRaw&r=0",
    "manufacturer": "فاركو"
  },
  {
    "id": 42,
    "name": "أزيثرومايسين",
    "genericName": "Azithromycin",
    "category": "مضادات حيوية",
    "description": "مضاد حيوي ماكروليدي عريض الطيف",
    "price": 143,
    "quantity": 87,
    "requiresPrescription": true,
    "image": "https://tse3.mm.bing.net/th/id/OIP.xB2L0_uUGxSNSkrx_7ajYAHaD-?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "manufacturer": "إيبيكو"
  },
  {
    "id": 43,
    "name": "سيتريزين ديهيدروكلوريد",
    "genericName": "Cetirizine HCl",
    "category": "أدوية البرد",
    "description": "مضاد حساسية لأعراض البرد",
    "price": 146,
    "quantity": 94,
    "requiresPrescription": false,
    "image": "https://cdn.altibbi.com/cdn/cache/large/image/2023/11/30/432c3553ae19691ac798e91837d144fd.jpg.webp",
    "manufacturer": "أمون"
  },
  {
    "id": 44,
    "name": "ديسلوراتادين",
    "genericName": "Desloratadine",
    "category": "الحساسية",
    "description": "مضاد حساسية قوي وسريع المفعول",
    "price": 149,
    "quantity": 101,
    "requiresPrescription": false,
    "image": "https://www.rosheta.com/upload/447502f784f069347df4805018ebd8eb8efc0eabd09d384b8853c4df8828f98d.webp",
    "manufacturer": "سيجما"
  },
  {
    "id": 45,
    "name": "دومبيريدون",
    "genericName": "Domperidone",
    "category": "الجهاز الهضمي",
    "description": "دواء لتحسين حركة المعدة والأمعاء",
    "price": 152,
    "quantity": 108,
    "requiresPrescription": false,
    "image": "https://www.rosheta.com/upload/c_img/c3a1156aeff870de52b83198320e0d74.jpg",
    "manufacturer": "ممفيس"
  },
  {
    "id": 46,
    "name": "ماكس برس",
    "genericName": "Nifedipine",
    "category": "ضغط الدم",
    "description": "حاصرات قنوات الكالسيوم لخفض الضغط",
    "price": 155,
    "quantity": 115,
    "requiresPrescription": true,
    "image": "https://tse4.mm.bing.net/th/id/OIP.ilvzd2iy7YAwIEpU4e2CPQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "manufacturer": "أكتوبر فارما"
  },
  {
    "id": 47,
    "name": "إنسولين NPH",
    "genericName": "Insulin NPH",
    "category": "السكري",
    "description": "إنسولين متوسط المفعول لعلاج السكري",
    "price": 158,
    "quantity": 122,
    "requiresPrescription": true,
    "image": "https://tse3.mm.bing.net/th/id/OIP.jalYvVwCigupfWp7WTDUnAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "manufacturer": "ميرك"
  },
  {
    "id": 48,
    "name": "فيتامين B المركب",
    "genericName": "B-Complex Vitamins",
    "category": "فيتامينات",
    "description": "مجموعة فيتامينات B للطاقة والصحة",
    "price": 161,
    "quantity": 129,
    "requiresPrescription": false,
    "image": "https://egyptvitamins.com/wp-content/uploads/2023/03/61Dt8NimkXL._AC_SL1500_-600x600.jpg",
    "manufacturer": "فايزر"
  },
  {
    "id": 49,
    "name": "إنالابريل",
    "genericName": "Enalapril",
    "category": "القلب والأوعية",
    "description": "مثبط ACE لعلاج قصور القلب",
    "price": 164,
    "quantity": 136,
    "requiresPrescription": true,
    "image": "https://mosbatesabz.com/mag/wp-content/uploads/2024/03/Enalapril-1.jpg",
    "manufacturer": "سانوفي"
  },
  {
    "id": 50,
    "name": "بوديزونيد",
    "genericName": "Budesonide",
    "category": "الربو",
    "description": "كورتيكوستيرويد استنشاقي للربو",
    "price": 167,
    "quantity": 143,
    "requiresPrescription": true,
    "image": "https://mosbatesabz.com/mag/wp-content/uploads/2018/01/%D8%B9%D9%88%D8%A7%D8%B1%D8%B6-%D8%AC%D8%A7%D9%86%D8%A8%DB%8C-%D8%AF%D8%A7%D8%B1%D9%88%DB%8C-%D8%A8%D9%88%D8%AF%D8%B2%D9%88%D9%86%D8%A7%DB%8C%D8%AF-budesonide.jpg",
    "manufacturer": "جلاكسو سميث كلاين"
  },
  {
    "id": 51,
    "name": "أسيتامينوفين 500",
    "genericName": "Acetaminophen 500mg",
    "category": "مسكنات",
    "description": "مسكن فعال وخافض للحرارة",
    "price": 170,
    "quantity": 150,
    "requiresPrescription": false,
    "image": "https://dwaprices.com/upload/1674905336.jpg",
    "manufacturer": "فاركو"
  },
  {
    "id": 52,
    "name": "CeraVe Foaming Cleanser",
    "genericName": "Foaming Facial Cleanser",
    "category": "الغسول",
    "description": "غسول رغوي للبشرة العادية والدهنية يساعد على تنظيف البشرة دون الإخلال بالحاجز الطبيعي لها.",
    "price": 650,
    "quantity": 35,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSIspCdZRyrCYvlUyjcrBwGwgZIT0wtxJkIBWQkEGm-zHTGbhgd_1p5hdIsCHEtYnjvs2SnIU60ojYgpppNx2z7oF2y6lIPrux4nnNeZtuusOB92FrWpEenpx9ajw68bjs2tiaWjqY&usqp=CAc",
    "manufacturer": "CeraVe"
  },
  {
    "id": 53,
    "name": "La Roche Posay Effaclar Gel",
    "genericName": "Purifying Foaming Gel",
    "category": "الغسول",
    "description": "غسول للبشرة الدهنية والحساسة يساعد على إزالة الزيوت والشوائب.",
    "price": 720,
    "quantity": 28,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT7MHyzjG7rYaXW3frrzdT8OeozYRHq2sXRXQqCebTBISouHy8rjPGQqKWdODU-xrnwzzCWHjB48H58-ddeOJVyjyBn7r69RvkpDQtNCen_kZW05u7JMQ09uWQEmcbhIPKRRc5_wyQ&usqp=CAc",
    "manufacturer": "La Roche-Posay"
  },
  {
    "id": 54,
    "name": "The Ordinary Niacinamide 10% + Zinc 1%",
    "genericName": "Niacinamide Serum",
    "category": "السيروم",
    "description": "سيروم يساعد على تقليل إفراز الدهون وتحسين مظهر المسام.",
    "price": 850,
    "quantity": 18,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR8YHaa41VD4379eB6ibLrv9uKkIEKn0gxPzUYkPiq4FZJ2fYVazktTtqaYkCVP2En10KcX0J5XeOgAhsDWDKhO8qsoTJevlnWGYiGiNxIKMkGhyNM4tSQ2YdTq4wMveotdFLJTfkg&usqp=CAc",
    "manufacturer": "The Ordinary"
  },
  {
    "id": 55,
    "name": "Vichy Dercos Anti-Dandruff Shampoo",
    "genericName": "Anti Dandruff Shampoo",
    "category": "شامبو وبلسم",
    "description": "شامبو لعلاج القشرة مناسب لفروة الرأس الحساسة.",
    "price": 580,
    "quantity": 40,
    "requiresPrescription": false,
    "image": "https://f.nooncdn.com/p/pzsku/Z76C9D61E82659995635DZ/45/_/1779344991/7e305ba1-2624-4534-9f9c-fc066211defd.jpg?width=480",
    "manufacturer": "Vichy"
  },
  {
    "id": 56,
    "name": "Centrum Multivitamin",
    "genericName": "Multivitamin Supplement",
    "category": "الفيتامينات والمكملات",
    "description": "مكمل غذائي يحتوي على مجموعة متكاملة من الفيتامينات والمعادن.",
    "price": 420,
    "quantity": 55,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTJ5cp1sW73XU_iy1lb_q_2rDP5j1NqVpFP_kllXOjtY3mQrlhRCIIXS7ECotZN1GacTsOFT-IYqbBWHAbGSMIyB27r5abecPb2xKIJWmQOOLKINOaHFw-7khd5rzS1E8w0MV7t5DA&usqp=CAc",
    "manufacturer": "Centrum"
  },
  {
    "id": 57,
    "name": "CeraVe Moisturizing Cream",
    "genericName": "Moisturizing Cream",
    "category": "الترطيب",
    "description": "كريم مرطب للوجه والجسم للبشرة الجافة.",
    "price": 690,
    "quantity": 30,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ8DF1FNO4yhHtN7q3Bc1_4PR8O8gu6K6cqiTNQnKsrPH_QViu4UR7Zv766dhUKbEuw_32cABxKxmJ1-Y1LKl6_BwlERBDiGcqqj1w_Qf1CeUS395IhZrZYZa0RQZu-asob86M-Fr6b&usqp=CAc",
    "manufacturer": "CeraVe"
  },
  {
    "id": 58,
    "name": "Neutrogena Hydro Boost Water Gel",
    "genericName": "Water Gel Moisturizer",
    "category": "الترطيب",
    "description": "جل مرطب غني بحمض الهيالورونيك.",
    "price": 520,
    "quantity": 24,
    "requiresPrescription": false,
    "image": "https://erosstore.co/cdn/shop/files/nyotrogyna-gl-mayy-mrtb-neutrogena-hydro-boost-water-gel-moisturizer-3464559.jpg?v=1777644312&width=1000",
    "manufacturer": "Neutrogena"
  },
  {
    "id": 59,
    "name": "Bepanthen Cream",
    "genericName": "Dexpanthenol Cream",
    "category": "الترطيب",
    "description": "كريم مرطب ومهدئ للبشرة الحساسة.",
    "price": 145,
    "quantity": 60,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTrEW4BrDRGO3GH6sNYIyjybdKozfyANAbtE5o6T3Ps-9IputaAvIcIb71TzRqZ-18Z7_zIUJhokqFObdn07FeTvGmWFiYkiv28bRC_K5yiRmJJVVk9sAzXdIDp18taxojHOtB_oJRuA5M&usqp=CAc",
    "manufacturer": "Bayer"
  },
  {
    "id": 60,
    "name": "La Roche Posay Anthelios SPF50+",
    "genericName": "Sunscreen",
    "category": "الوقاية من الشمس",
    "description": "واقي شمس واسع الطيف للبشرة الحساسة.",
    "price": 890,
    "quantity": 18,
    "requiresPrescription": false,
    "image": "https://alfouadpharmacies.com/cdn/shop/files/Group_2_9.webp?v=1781088238&width=1600",
    "manufacturer": "La Roche-Posay"
  },
  {
    "id": 61,
    "name": "Bioderma Photoderm Max SPF50+",
    "genericName": "Sunscreen",
    "category": "الوقاية من الشمس",
    "description": "واقي شمس للحماية العالية من الأشعة فوق البنفسجية.",
    "price": 780,
    "quantity": 20,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSR9o-0pqePgRT1RaA6sZNHGnyEKHKqEUAW_y2i7-9uCL78wq756QVqKmULku9-FbjRMlJw1hKfOILhyYqbeqRqFy8w_40qzifPNO5N8UEpG3D2KNYE086s3OVuhzAd71RneTng8Q&usqp=CAc",
    "manufacturer": "Bioderma"
  },
  {
    "id": 62,
    "name": "ISDIN Fusion Water SPF50",
    "genericName": "Sunscreen",
    "category": "الوقاية من الشمس",
    "description": "واقي شمس خفيف سريع الامتصاص.",
    "price": 950,
    "quantity": 15,
    "requiresPrescription": false,
    "image": "https://m.media-amazon.com/images/I/81l2Tgu38EL._AC_SL1500_.jpg",
    "manufacturer": "ISDIN"
  },
  {
    "id": 63,
    "name": "Vichy Liftactiv Vitamin C Serum",
    "genericName": "Vitamin C Serum",
    "category": "السيروم",
    "description": "سيروم مضاد للأكسدة لتوحيد لون البشرة.",
    "price": 1150,
    "quantity": 14,
    "requiresPrescription": false,
    "image": "https://www.lojaglamourosa.com/resources/medias/shop/products/shop-rt-01318-01-liftactiv-vitamin-c-serum---20ml--1.jpg",
    "manufacturer": "Vichy"
  },
  {
    "id": 64,
    "name": "The Ordinary Hyaluronic Acid 2% + B5",
    "genericName": "Hyaluronic Acid Serum",
    "category": "السيروم",
    "description": "سيروم لترطيب البشرة بعمق.",
    "price": 790,
    "quantity": 25,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSYYprFZlQ12F0ikNzxonw186M_LkWLh8yX29bNt5RjTPYr4Au0y01fwRhOqAkFN_nMg-lgOeHUt3qn4q2enupO3r0irFwAkVWZ0gMmGOTCVl_y59V3-9OoCJaftUCTlmZMn4GBA2A&usqp=CAc",
    "manufacturer": "The Ordinary"
  },
  {
    "id": 65,
    "name": "COSRX Snail Mucin Essence",
    "genericName": "Snail Essence",
    "category": "السيروم",
    "description": "إيسنس لإصلاح وترطيب البشرة.",
    "price": 920,
    "quantity": 12,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR73mqOfzxURtvMolwaJ6xWal1_LeoyaAkfW968DeBvVYrwdwTLNywAmnDQRp6grQ_IQRwusp1XQNstfkrCibRoI_ZhGfDXs4eDsdWBIPMzPj3UaELRSVUQK6jzYVYclIW9NfKTfw&usqp=CAc",
    "manufacturer": "COSRX"
  },
  {
    "id": 66,
    "name": "Pantene Pro-V Hair Fall Control",
    "genericName": "Hair Shampoo",
    "category": "شامبو وبلسم",
    "description": "شامبو لتقليل تساقط الشعر.",
    "price": 180,
    "quantity": 50,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRPTuU6CbF14C6L7kD9pFCaquUcyBS7AujRw-tH5Dug7HIH0opzP5vRy1C6ntU3eDIINR8tXZ4ec8TonjAA5L-ajPrJ2fBI2DwA-N6N8s_egFvmOuFtBMyYKtJdKWAqTL3Mi0Isvjg&usqp=CAc",
    "manufacturer": "Pantene"
  },
  {
    "id": 67,
    "name": "Head & Shoulders Classic Clean",
    "genericName": "Anti Dandruff Shampoo",
    "category": "شامبو وبلسم",
    "description": "شامبو فعال ضد القشرة.",
    "price": 175,
    "quantity": 45,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ8MpgmAWHmEd7l_-PZSOVKb8mxq7MT2n24WZLIIFgLvPyqrbMZ5CF_XyK__VMtfos_9NBAyVqWYSxNOB_o3NHo4cJiW-p6Vb5o03HepWwJWAsFr-TcvrRoGdm5WP2hDyFdJIlf7S0&usqp=CAc",
    "manufacturer": "P&G"
  },
  {
    "id": 68,
    "name": "L'Oreal Elvive Hyaluron Moisture",
    "genericName": "Hair Shampoo",
    "category": "شامبو وبلسم",
    "description": "شامبو لترطيب الشعر الجاف.",
    "price": 220,
    "quantity": 40,
    "requiresPrescription": false,
    "image": "https://alfouadpharmacies.com/cdn/shop/files/Loreal-Elvive-Hyaluron-Moisture-Hair-Cream-200ML.webp?v=1754298094",
    "manufacturer": "L'Oreal"
  },
  {
    "id": 69,
    "name": "L'Oreal Extraordinary Oil",
    "genericName": "Hair Oil",
    "category": "ترطيب وعلاج الشعر",
    "description": "زيت مغذي للشعر الجاف والمتقصف.",
    "price": 350,
    "quantity": 22,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQYdOa8ttOq_TlXxiRMo3vXJe7D0O3XvzHRF-D0aoDQelk7GscvGifZBLpokhcKt8BFjbZ8vOH3SUxRh0hs0Muo1sfJ8Lx3jd5bb0YLnoqrVqYDdRIJxq9paDRaMkFpUNywRlwS_S4&usqp=CAc",
    "manufacturer": "L'Oreal"
  },
  {
    "id": 70,
    "name": "Mielle Rosemary Mint Oil",
    "genericName": "Hair Oil",
    "category": "ترطيب وعلاج الشعر",
    "description": "زيت لتقوية بصيلات الشعر.",
    "price": 890,
    "quantity": 10,
    "requiresPrescription": false,
    "image": "https://m.media-amazon.com/images/I/812+NN-pXCL._AC_UF350,350_QL80_.jpg",
    "manufacturer": "Mielle"
  },
  {
    "id": 71,
    "name": "Kerastase Genesis Serum",
    "genericName": "Hair Serum",
    "category": "ترطيب وعلاج الشعر",
    "description": "سيروم لتقليل تساقط الشعر.",
    "price": 1800,
    "quantity": 8,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTU1C2lZwabf-ZUVr9rXwY94foOj19nzV6imBuvBQMQUMyLye5iImC0n4VJ9Bqj9_HRp2uJNfMtD3YXpTN90RYRyBZ0S3uwX59SeKuiS8dhy7TayvimnU8NiVmttAN9HEhGy3fTtS0&usqp=CAc",
    "manufacturer": "Kerastase"
  },
  {
    "id": 72,
    "name": "Sofi",
    "genericName": "Sanitary Pads",
    "category": "العناية النسائية",
    "description": "فوط صحية للاستخدام اليومي.",
    "price": 95,
    "quantity": 80,
    "requiresPrescription": false,
    "image": "https://omaleen.com/wp-content/uploads/2024/05/Sofy-Musk-All.jpg",
    "manufacturer": "P&G"
  },
  {
    "id": 73,
    "name": "Femfresh Intimate Wash",
    "genericName": "Intimate Wash",
    "category": "العناية النسائية",
    "description": "غسول للمناطق الحساسة.",
    "price": 210,
    "quantity": 30,
    "requiresPrescription": false,
    "image": "https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/77/6565331/1.jpg?5207",
    "manufacturer": "Femfresh"
  },
  {
    "id": 74,
    "name": "Gillette Fusion Shaving Gel",
    "genericName": "Shaving Gel",
    "category": "العناية الرجالية",
    "description": "جل حلاقة يمنح انزلاقاً سلساً.",
    "price": 230,
    "quantity": 35,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ-Hm69rnWpUZpKkoaVqwN9T0XC8Oi5L3v8z3yFqLLzhsAYBMP8xhL19pQPVOFuDgiYynKUYF3pIinCPzkjU6fhLDlcy4QyAHnOdUky3ugnX83dpoda7yLcPsVXH08p443rMoD_DSk&usqp=CAc",
    "manufacturer": "Gillette"
  },
  {
    "id": 75,
    "name": "Nivea Men Sensitive",
    "genericName": "After Shave Balm",
    "category": "العناية الرجالية",
    "description": "بلسم مهدئ بعد الحلاقة.",
    "price": 260,
    "quantity": 25,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSvvQ6yb-HeOU1BEN778oF6gaZ-cdxH2S_CYc5gXSLGLNNIksQoZSN0V-DLum32EbRqcziTx3W6fpf0M0wAcgvDqgZW7Jt1-_Lc5uPfA0uc7h7ahbG55wBqgUSwklsId2aSpiFCvYmwlyM&usqp=CAc",
    "manufacturer": "Nivea"
  },
  {
    "id": 76,
    "name": "Dettol Hand Sanitizer",
    "genericName": "Hand Sanitizer",
    "category": "الحماية",
    "description": "مطهر لليدين يقضي على 99.9% من الجراثيم.",
    "price": 85,
    "quantity": 75,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQvjh9i_GU5Dax15HoF6UjmoJ3bdL2SKZlcw5zxITQk-URcbnqDmJ4_4HL_yhwfLCD694EVlj0QoD-e5LN-NIlFm0h9O3adQbzyPGvOXlsUlDAvh1O0wtXErz6icMDs5-z_zcxbMw&usqp=CAc",
    "manufacturer": "Dettol"
  },
  {
    "id": 77,
    "name": "Fine Face Mask",
    "genericName": "Medical Mask",
    "category": "الحماية",
    "description": "كمامات طبية للاستخدام اليومي.",
    "price": 60,
    "quantity": 120,
    "requiresPrescription": false,
    "image": "https://dkud4u09qff41.cloudfront.net/Products/1977cc95-fe16-4c18-9d9b-3435cb797e80.jpeg",
    "manufacturer": "Fine"
  },
  {
    "id": 78,
    "name": "Centrum Multivitamin",
    "genericName": "Multivitamin Supplement",
    "category": "الفيتامينات والمكملات",
    "description": "مكمل غذائي يحتوي على مجموعة متكاملة من الفيتامينات والمعادن.",
    "price": 420,
    "quantity": 35,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRcApMIXs6zQRRzSjbAx1PUbeJSffvKvj5Kq1CJXOV-YBUmdgnNK5HGhMebMXTMjhi6-WZISyc2GZ25m91LPm30GXe-ZctIfKw8WBLOeX3SeRFN4xH8wv2FuUijkLKChyVdcIP_4g&usqp=CAc",
    "manufacturer": "Centrum"
  },
  {
    "id": 79,
    "name": "Omega 3 Plus",
    "genericName": "Omega 3 Supplement",
    "category": "الفيتامينات والمكملات",
    "description": "مكمل غذائي لدعم صحة القلب والمفاصل.",
    "price": 290,
    "quantity": 40,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRHhpNEeaoyykFHFpUg-i2fFtknxotkDV4fiOfzsvRg6VyF9d5m84xrdFVooncvydDbzRxnAhMiAdHNIlZvNbYLpYAXlbaSPy_8F1TDOW9CduIKx4Gu3wnPH0gZGsAuAu2dKvFM5c4&usqp=CAc",
    "manufacturer": "Mepaco"
  },
  {
    "id": 80,
    "name": "C Retard",
    "genericName": "Vitamin C",
    "category": "الفيتامينات والمكملات",
    "description": "فيتامين سي لدعم المناعة.",
    "price": 110,
    "quantity": 60,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSupIevn15bMKt5WlAN_dmaOt0lhA4Zg6OBovu2ghjR-PLNqIzX6qwyZps2gJ8DrydafGdiOrONOeb3f7DCe7PVg7sBjFv_46R1-YGTNJZGYwmgowxzQImYU0-aWXRIwA&usqp=CAc",
    "manufacturer": "CID"
  },
  {
    "id": 81,
    "name": "Davalindi D3",
    "genericName": "Vitamin D3",
    "category": "الفيتامينات والمكملات",
    "description": "مكمل فيتامين د3 لدعم صحة العظام.",
    "price": 145,
    "quantity": 50,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQFB4S7sHIqU1okMh19W90_u1naiiWBp-l1mNpzAvNml-_mtguXXBDdA-SX5Tad01-N3zglpKp3xkrth6g9ePdJD92yWQBcXjeW8jYbXzPEUEMft5axCsMacKtVs4VOgWY-2mURwA&usqp=CAc",
    "manufacturer": "Eva Pharma"
  },
  {
    "id": 82,
    "name": "Dove Deeply Nourishing Body Wash",
    "genericName": "Body Wash",
    "category": "العناية بالجسم والاستحمام",
    "description": "غسول جسم مرطب للاستخدام اليومي.",
    "price": 190,
    "quantity": 40,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQHMRQDVufafaeiLl-YfvDWl3cWpxvwTkZTpmZxZAM3IkWC4pacX3_q0l-EnwD_qg447wXgMjnCArs_vDlFkT7c0ESvrkLuo_bRhxhg1V6apAGLNY3y9goaRjEVUQYcT7-Q-hQvGLw&usqp=CAc",
    "manufacturer": "Dove"
  },
  {
    "id": 83,
    "name": "Nivea Creme Soft Shower Gel",
    "genericName": "Shower Gel",
    "category": "العناية بالجسم والاستحمام",
    "description": "جل استحمام غني بالترطيب.",
    "price": 175,
    "quantity": 35,
    "requiresPrescription": false,
    "image": "https://i.makeup.cy/u/uz/uzcmp2sgn4bq.jpg",
    "manufacturer": "Nivea"
  },
  {
    "id": 84,
    "name": "Johnson's Body Wash",
    "genericName": "Body Wash",
    "category": "العناية بالجسم والاستحمام",
    "description": "غسول جسم لطيف للبشرة الحساسة.",
    "price": 150,
    "quantity": 45,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSSOaXdkyUneqlz4U1ifJ7UTg0cFetDjkwJsA-UN9kKlnPu2ByUKU_pcCGZmlYpSxiKX256YykftgRq7t4BI5LvJTXOY2IujcVwwJxiZENWAoPJ8cbzPYXcpypwArivD5bVRVZ6BGM&usqp=CAc",
    "manufacturer": "Johnson's"
  },
  {
    "id": 85,
    "name": "Colgate Total",
    "genericName": "Toothpaste",
    "category": "العناية بالفم والأسنان",
    "description": "معجون أسنان للحماية الكاملة.",
    "price": 95,
    "quantity": 80,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTD0D775Up-YM7hwUd_8qdN8IfQCrGdNXWSGmOpFjx8ayHIp6xwa94FfvywzqB9XToZA0rkAjFY1KVkRIvVw75hLhcIJPllrvpNHm51KMk6WJDwa0bAbtkOFnzt6g1Iowwsbf8EtOGn2g&usqp=CAc",
    "manufacturer": "Colgate"
  },
  {
    "id": 86,
    "name": "Sensodyne Repair & Protect",
    "genericName": "Toothpaste",
    "category": "العناية بالفم والأسنان",
    "description": "معجون أسنان للأسنان الحساسة.",
    "price": 130,
    "quantity": 55,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSit-ERCQQjq_lRT2HLf1gRdA7asjCB66HPrdoJYnybeSMmUKxjiQhN1GL6391SXGh0e8UjnGh1wttk1w9SbwuaM5TIJSOUOOaPAHGsyffWGFag6ijqwiDotQy6n_SIc2CJpA26kw&usqp=CAc",
    "manufacturer": "Sensodyne"
  },
  {
    "id": 87,
    "name": "Listerine Cool Mint",
    "genericName": "Mouthwash",
    "category": "العناية بالفم والأسنان",
    "description": "غسول فم يمنح انتعاشاً وحماية من البكتيريا.",
    "price": 180,
    "quantity": 42,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT3iwetHtkPr6lhGuHf3uohnELyb6IvA6Hp4mylZCkaTgC61cJk5YasU4Q9wkR-U3VEVYl5X-iL9P1H1K96KbF9n3l9O2-LU_6Lj3_GOAUNtPfAuR8Crtd7ywWnvcc&usqp=CAc",
    "manufacturer": "Listerine"
  },
  {
    "id": 88,
    "name": "Foreo Luna Mini 3",
    "genericName": "Facial Cleansing Device",
    "category": "أجهزة البشرة",
    "description": "جهاز ذكي لتنظيف البشرة بعمق.",
    "price": 5200,
    "quantity": 5,
    "requiresPrescription": false,
    "image": "https://m.media-amazon.com/images/I/81mLGQws9nL._AC_UF350,350_QL80_.jpg",
    "manufacturer": "Foreo"
  },
  {
    "id": 89,
    "name": "Beurer FC45",
    "genericName": "Facial Brush",
    "category": "أجهزة البشرة",
    "description": "فرشاة كهربائية لتنظيف البشرة.",
    "price": 1450,
    "quantity": 8,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSQpydLmz3trNuZJRsi8aomDryh0DlbO3fnD7ZhPZxdRLdiNl82GzPl68yv_be2Trz93kpqn-5E7Lqb4FebX7A9wdYz278ccGNoKZYoOpMEceFn5VGwHU1N&usqp=CAc",
    "manufacturer": "Beurer"
  },
  {
    "id": 90,
    "name": "Philips Hair Dryer BHD300",
    "genericName": "Hair Dryer",
    "category": "أجهزة تصفيف الشعر",
    "description": "مجفف شعر احترافي للاستخدام المنزلي.",
    "price": 1250,
    "quantity": 10,
    "requiresPrescription": false,
    "image": "https://essential.mv/cdn/shop/files/PhilipsHairDryerBHD3003.webp?v=1684549354&width=1445",
    "manufacturer": "Philips"
  },
  {
    "id": 91,
    "name": "Philips Straightener BHS375",
    "genericName": "Hair Straightener",
    "category": "أجهزة تصفيف الشعر",
    "description": "مكواة شعر سيراميك لفرد الشعر بسهولة.",
    "price": 1100,
    "quantity": 12,
    "requiresPrescription": false,
    "image": "https://drahmedelezaby.com/wp-content/uploads/2022/07/71Ei8l8yh2L._AC_SY450_.jpg",
    "manufacturer": "Philips"
  },
  {
    "id": 92,
    "name": "L'Oreal Excellence Creme",
    "genericName": "Hair Color",
    "category": "صبغات الشعر",
    "description": "صبغة شعر دائمة بتغطية كاملة للشيب.",
    "price": 320,
    "quantity": 25,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRn3aJ5KXONqvlXOMt-NwgG1IHDhDE09M3erfApDqQzdvWRAo26fEMz5NgMibz9psUs0yBVUg5Hl-BqESubKkGJXBMoMVeqEVJxn_TYAInjiDNKUz4IHy5FNaWBMaUUStRfmxmPXQ&usqp=CAc",
    "manufacturer": "L'Oreal"
  },
  {
    "id": 93,
    "name": "Garnier Color Naturals",
    "genericName": "Hair Color",
    "category": "صبغات الشعر",
    "description": "صبغة شعر مغذية بزيت الزيتون.",
    "price": 145,
    "quantity": 35,
    "requiresPrescription": false,
    "image": "https://m.media-amazon.com/images/I/61dGks1S9+L._AC_UF894,1000_QL80_.jpg",
    "manufacturer": "Garnier"
  },
  {
    "id": 94,
    "name": "Freeman Charcoal Mask",
    "genericName": "Face Mask",
    "category": "الماسكات",
    "description": "ماسك الفحم لتنقية وتنظيف المسام.",
    "price": 240,
    "quantity": 20,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSAbEq2ePE6zBuhPpTBmey5hNogG2hiC1R0MtFedX5dEufsY7Wl3tDMQJr-StZOG4jKnBdjB2YEiNk43bMyC0pwYQLWfF3PLthyG7dyN3-yGct3puNz6nv3ZVp14g-iO2RO8WaGPkIOt1o&usqp=CAc",
    "manufacturer": "Freeman"
  },
  {
    "id": 95,
    "name": "L'Oreal Pure Clay Mask",
    "genericName": "Clay Mask",
    "category": "الماسكات",
    "description": "ماسك طيني لتنظيف البشرة بعمق.",
    "price": 310,
    "quantity": 18,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSiXVtB7rfX3kQEkSLyIDJYmSnOWDs-FYiG6wFGFRRQ1uEdyEYS9oAZkGRAwJ2phYUF7I6nHAAQYlt20vYuejZrBE8baI2Tg6DywfkysUTeQobMTgJqG2W8LQ&usqp=CAc",
    "manufacturer": "L'Oreal"
  },
  {
    "id": 96,
    "name": "Neutrogena Hydro Boost Eye Cream",
    "genericName": "Eye Cream",
    "category": "العناية بالعيون",
    "description": "كريم مرطب لمنطقة تحت العين.",
    "price": 430,
    "quantity": 15,
    "requiresPrescription": false,
    "image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQoPAuLMxv6veTHThfDaFdRYQdxpWrX9S3ScZt_jSwCftcxlyoKHrYEvlxaZWLY6opYEYp9qQT6-qkiRDlR0IzZ8UUZJA8MVe5QKKJbhC5yaXGuWTtalBSontMYO5fNUXQTJlWGiw&usqp=CAc",
    "manufacturer": "Neutrogena"
  }
];

const initialCategories = [
  {
    "name": "كل المنتجات",
    "icon": "🛍️",
    "hasDropdown": false,
    "subcategories": []
  },
  {
    "name": "الأدوية",
    "icon": "💊",
    "hasDropdown": false,
    "subcategories": [
      {
        "name": "حسب الحالة الصحية",
        "apiValue": ""
      },
      {
        "name": "مسكنات",
        "apiValue": "مسكنات"
      },
      {
        "name": "مضادات حيوية",
        "apiValue": "مضادات حيوية"
      },
      {
        "name": "أدوية البرد",
        "apiValue": "أدوية البرد"
      },
      {
        "name": "الحساسية",
        "apiValue": "الحساسية"
      },
      {
        "name": "الجهاز الهضمي",
        "apiValue": "الجهاز الهضمي"
      },
      {
        "name": "ضغط الدم",
        "apiValue": "ضغط الدم"
      },
      {
        "name": "السكري",
        "apiValue": "السكري"
      },
      {
        "name": "فيتامينات",
        "apiValue": "فيتامينات"
      },
      {
        "name": "القلب والأوعية",
        "apiValue": "القلب والأوعية"
      },
      {
        "name": "الربو",
        "apiValue": "الربو"
      }
    ]
  },
  {
    "name": "العناية بالشعر",
    "icon": "💇‍♀️",
    "hasDropdown": false,
    "subcategories": [
      {
        "name": "جميع مستحضرات الشعر",
        "apiValue": ""
      },
      {
        "name": "شامبو وبلسم",
        "apiValue": "شامبو وبلسم"
      },
      {
        "name": "ترطيب وعلاج الشعر",
        "apiValue": "ترطيب وعلاج الشعر"
      },
      {
        "name": "اجهزة تصفيف الشعر",
        "apiValue": "أجهزة تصفيف الشعر"
      },
      {
        "name": "صبغات الشعر",
        "apiValue": "صبغات الشعر"
      }
    ]
  },
  {
    "name": "العناية بالبشرة",
    "icon": "🧴",
    "hasDropdown": true,
    "dropdownItems": [
      "الغسول",
      "الترطيب",
      "السيروم",
      "الماسك",
      "الوقاية من الشمس",
      "أجهزة البشرة",
      "العناية بالعيون"
    ],
    "subcategories": [
      {
        "name": "جميع مستحضرات البشرة",
        "apiValue": ""
      },
      {
        "name": "الغسول",
        "apiValue": "الغسول"
      },
      {
        "name": "الترطيب",
        "apiValue": "الترطيب"
      },
      {
        "name": "السيروم",
        "apiValue": "السيروم"
      },
      {
        "name": "الماسك",
        "apiValue": "الماسكات"
      },
      {
        "name": "الوقاية من الشمس",
        "apiValue": "الوقاية من الشمس"
      },
      {
        "name": "أجهزة البشرة",
        "apiValue": "أجهزة البشرة"
      },
      {
        "name": "العناية بالعيون",
        "apiValue": "العناية بالعيون"
      }
    ]
  },
  {
    "name": "العناية اليومية",
    "icon": "🧼",
    "hasDropdown": false,
    "subcategories": [
      {
        "name": "جميع منتجات العناية اليومية",
        "apiValue": ""
      },
      {
        "name": "العناية بالجسم و الاستحمام",
        "apiValue": "العناية بالجسم والاستحمام"
      },
      {
        "name": "العناية بالفم و الاسنان",
        "apiValue": "العناية بالفم والأسنان"
      },
      {
        "name": "العناية النسائية",
        "apiValue": "العناية النسائية"
      },
      {
        "name": "العناية الرجالية",
        "apiValue": "العناية الرجالية"
      },
      {
        "name": "الحماية",
        "apiValue": "الحماية"
      },
      {
        "name": "الاعشاب الطبيعية و الفيتامينات",
        "apiValue": "الفيتامينات والمكملات"
      }
    ]
  },
  {
    "name": "الام والطفل",
    "icon": "👶",
    "hasDropdown": false,
    "subcategories": [
      {
        "name": "عرض الكل",
        "apiValue": ""
      },
      {
        "name": "الحفاضات و مستحضرات التغيير",
        "apiValue": "الحفاضات و مستحضرات التغيير"
      },
      {
        "name": "العناية بالام",
        "apiValue": "العناية بالام"
      },
      {
        "name": "طعام الاطفال و مستلزماته",
        "apiValue": "طعام الاطفال و مستلزماته"
      },
      {
        "name": "مستلزمات الرضاعة الطبيعية",
        "apiValue": "مستلزمات الرضاعة الطبيعية"
      },
      {
        "name": "الاستحمام",
        "apiValue": "الاستحمام"
      }
    ]
  },
  {
    "name": "المكياج و الاكسسوارات",
    "icon": "💄",
    "hasDropdown": false,
    "subcategories": [
      {
        "name": "عرض الكل",
        "apiValue": ""
      },
      {
        "name": "الوجه",
        "apiValue": "الوجه"
      },
      {
        "name": "العيون",
        "apiValue": "العيون"
      },
      {
        "name": "الرموش",
        "apiValue": "الرموش"
      },
      {
        "name": "الشفاه",
        "apiValue": "الشفاه"
      },
      {
        "name": "الاظافر",
        "apiValue": "الاظافر"
      }
    ]
  },
  {
    "name": "المستلزمات الطبية",
    "icon": "🩺",
    "hasDropdown": false,
    "subcategories": [
      {
        "name": "عرض الكل",
        "apiValue": ""
      },
      {
        "name": "ادارة الالم",
        "apiValue": "ادارة الالم"
      },
      {
        "name": "اجهزة مساعدات التنفس",
        "apiValue": "اجهزة مساعدات التنفس"
      },
      {
        "name": "الاسعافات الاولية",
        "apiValue": "الاسعافات الاولية"
      },
      {
        "name": "العناية بالسكري",
        "apiValue": "العناية بالسكري"
      },
      {
        "name": "ادارة الوزن",
        "apiValue": "ادارة الوزن"
      },
      {
        "name": "كمامات",
        "apiValue": "كمامات"
      },
      {
        "name": "التبول اللاإرادي",
        "apiValue": "التبول اللاإرادي"
      },
      {
        "name": "اجهزة مراقبه الصحة",
        "apiValue": "اجهزة مراقبه الصحة"
      }
    ]
  },
  {
    "name": "الفيتامينات والمكملات",
    "icon": "💊",
    "hasDropdown": false,
    "subcategories": [
      {
        "name": "عرض الكل",
        "apiValue": ""
      },
      {
        "name": "الفيتامينات والمعادن",
        "apiValue": "الفيتامينات والمعادن"
      },
      {
        "name": "المكملات الغذائية",
        "apiValue": "المكملات الغذائية"
      },
      {
        "name": "التخسيس",
        "apiValue": "التخسيس"
      }
    ]
  }
];

const bannerSlides = [
  "/imges/banner_omega3.png",
  "/imges/banner_panadol.jpg",
  "/imges/banner_oplex.png",
  "/imges/banner_maalox.png"
];

export default function Prouducts() {
  const [activeMainCat, setActiveMainCat] = useState("كل المنتجات");
  const [activeSubCat, setActiveSubCat] = useState("الكل");
  const [categoryApiValue, setCategoryApiValue] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchParam);
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // Displays 12 cards per page as requested
  const [sortBy, setSortBy] = useState("default");

  // Dynamic categories state for Drag & Drop
  const [categories, setCategories] = useState(initialCategories);
  const [expandedCats, setExpandedCats] = useState({ "الأدوية": true, "كل المنتجات": true });
  const [draggedIndex, setDraggedIndex] = useState(null);

  const toggleCategoryExpand = (catName) => {
    setExpandedCats(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...categories];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    setCategories(reordered);
  };

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Marketing banner auto-slider state and effect
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Modals and Toasts
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPromo, setShowPromo] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentAllPage, setCurrentAllPage] = useState(0);

  // Client-side filtering, searching, paging
  const filteredMedicines = React.useMemo(() => {
    const norm = (str) => {
      if (!str) return "";
      return str
        .replace(/[أإآا]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/\s+/g, "")
        .trim();
    };

    const getProductMainCategory = (medCategory) => {
      if (!medCategory) return "";
      const normalized = norm(medCategory);

      const medicinesSub = [
        "مسكنات", "مضادات حيوية", "أدوية البرد", "الحساسية", "الجهاز الهضمي", 
        "ضغط الدم", "السكري", "فيتامينات", "القلب والأوعية", "الربو"
      ].map(norm);
      
      const haircareSub = [
        "شامبو وبلسم", "ترطيب وعلاج الشعر", "أجهزة تصفيف الشعر", "صبغات الشعر"
      ].map(norm);

      const skincareSub = [
        "الغسول", "الترطيب", "السيروم", "الماسك", "الماسكات", 
        "الوقاية من الشمس", "أجهزة البشرة", "العناية بالعيون"
      ].map(norm);

      const dailycareSub = [
        "العناية بالجسم والاستحمام", "العناية بالفم والأسنان", "العناية النسائية", 
        "العناية الرجالية", "الحماية"
      ].map(norm);

      const vitaminsSub = [
        "الفيتامينات والمكملات"
      ].map(norm);

      if (medicinesSub.includes(normalized)) return "الأدوية";
      if (haircareSub.includes(normalized)) return "العناية بالشعر";
      if (skincareSub.includes(normalized)) return "العناية بالبشرة";
      if (dailycareSub.includes(normalized)) return "العناية اليومية";
      if (vitaminsSub.includes(normalized)) return "الفيتامينات والمكملات";
      
      return "أخرى";
    };

    return localMedicines
      .map((med) => ({
        ...med,
        _id: med.id,
        images: [med.image],
      }))
      .filter((med) => {
        // 1. Main category vs Sub category filtering
        if (activeMainCat !== "كل المنتجات") {
          const medMainCat = getProductMainCategory(med.category);
          if (norm(medMainCat) !== norm(activeMainCat)) {
            return false;
          }

          // 2. Category filter
          if (categoryApiValue) {
            const normMedCat = norm(med.category);
            const normApiVal = norm(categoryApiValue);
            
            const isMaskMatch = (normMedCat.includes("ماسك") && normApiVal.includes("ماسك"));
            const isVitaminMatch = (normMedCat.includes("فيتامين") && normApiVal.includes("فيتامين"));
            
            if (normMedCat !== normApiVal && !isMaskMatch && !isVitaminMatch) {
              return false;
            }
          }
        }

        // 3. Search filter
        if (searchParam) {
          const query = searchParam.toLowerCase();
          const matchesName = med.name?.toLowerCase().includes(query);
          const matchesGeneric = med.genericName?.toLowerCase().includes(query);
          const matchesManufacturer = med.manufacturer?.toLowerCase().includes(query);
          if (!matchesName && !matchesGeneric && !matchesManufacturer) {
            return false;
          }
        }

        return true;
      });
  }, [activeMainCat, categoryApiValue, searchParam]);

  const sortedMedicines = React.useMemo(() => {
    const sorted = [...filteredMedicines];
    if (sortBy === "price-asc") return sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") return sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [filteredMedicines, sortBy]);

  // Pagination
  const paginatedMedicines = React.useMemo(() => {
    const startIndex = (page - 1) * limit;
    return sortedMedicines.slice(startIndex, startIndex + limit);
  }, [sortedMedicines, page, limit]);

  const totalItems = sortedMedicines.length;
  const totalPages = Math.ceil(totalItems / limit);

  const apiData = {
    data: paginatedMedicines,
    total: totalItems,
    page: page,
    pages: totalPages || 1,
  };
  const medicines = apiData.data;

  // Pagination group calculations (displays 8 pages at a time in the bar)
  const maxVisiblePages = 8;
  const currentGroup = Math.ceil(page / maxVisiblePages);
  const startPage = (currentGroup - 1) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, apiData.pages);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const isLoading = false;
  const isError = false;
  const refetch = () => {};

  const detailsData = null;
  const isLoadingDetails = false;

  // Handle main horizontal category change
  const handleMainCatChange = (catName) => {
    setActiveMainCat(catName);
    setPage(1);
    setSearchInput("");
    setSearchParams((prev) => {
      prev.delete("search");
      return prev;
    });

    const selectedCatObj = categories.find(c => c.name === catName);
    if (selectedCatObj) {
      // Set to first subcategory if available
      const firstSub = selectedCatObj.subcategories?.[0];
      setActiveSubCat(firstSub ? firstSub.name : catName);
      setCategoryApiValue(firstSub ? firstSub.apiValue : "");
      setExpandedCats(prev => ({ ...prev, [catName]: true }));
    } else {
      setActiveSubCat(catName);
      setCategoryApiValue("");
    }
  };

  // Handle sidebar subcategory change
  const handleSubCatChange = (subCat, parentCatName) => {
    setActiveMainCat(parentCatName);
    setActiveSubCat(subCat.name);
    setCategoryApiValue(subCat.apiValue);
    setPage(1);
    setSearchInput("");
    setSearchParams((prev) => {
      prev.delete("search");
      return prev;
    });
    setIsSidebarOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (searchInput) {
        prev.set("search", searchInput);
      } else {
        prev.delete("search");
      }
      return prev;
    });
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchParams({});
    setActiveMainCat("كل المنتجات");
    setActiveSubCat("الكل");
    setCategoryApiValue("");
    setSortBy("default");
    setPage(1);
    setExpandedCats({ "الأدوية": true, "كل المنتجات": true });
  };

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setActiveImageIndex(0);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Combine list product basic data and fetched full details
  const activeDetails = detailsData || selectedMedicine;

  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfdfe] text-slate-800 font-sans pb-24 selection:bg-[#009eb6]/20 selection:text-[#009eb6]">

      <div className="max-w-[1200px] mx-auto px-4 py-6">

        {/* 2. Search Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">
          {/* Search bar inside page matching premium layout */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-[350px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                const val = e.target.value;
                setSearchInput(val);
                setSearchParams((prev) => {
                  if (val) {
                    prev.set("search", val);
                  } else {
                    prev.delete("search");
                  }
                  return prev;
                });
                setPage(1);
              }}
              placeholder="ابحث عن دواء أو مستحضر..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#009eb6] focus:bg-white focus:ring-4 focus:ring-[#009eb6]/10 rounded-xl py-2 px-4 pr-10 text-xs font-bold transition-all outline-none"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchParams((prev) => {
                    prev.delete("search");
                    return prev;
                  });
                  setPage(1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Responsive Mobile Filters Button */}
        <div className="lg:hidden flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#009eb6]" />
            <span>تصفح الأقسام ({activeMainCat})</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[#009eb6]/20"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر من الأقل للأعلى</option>
            <option value="price-desc">السعر من الأعلى للأقل</option>
            <option value="name-asc">الاسم A-Z</option>
          </select>
        </div>

        {/* 4. Two-Column Layout */}
        <div className="grid grid-cols-12 gap-8 items-start">

          {/* Right Sidebar: Categories Column */}
          <aside className={`col-span-12 lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-md shadow-[#009eb6]/3 sticky top-20 z-20 transition-all ${isSidebarOpen ? "fixed inset-0 z-50 overflow-y-auto block pt-20" : "hidden lg:block"
            }`}>
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 left-6 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            )}

            <h3 className="text-[15px] font-black pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#009eb6] to-[#f06a4f]" />
                <span className="text-[#102542] font-black">الأقسام</span>
              </span>
              <span className="text-[10px] text-white bg-gradient-to-r from-[#009eb6] to-[#009eb6]/80 px-2.5 py-0.5 rounded-full font-bold shadow-sm shadow-[#009eb6]/10">
                {activeMainCat}
              </span>
            </h3>

            {/* List of Main Categories (Sidebar collapsible style with Drag & Drop) */}
            <div className="flex flex-col gap-2">
              {categories.map((cat, index) => {
                const isSelected = activeMainCat === cat.name;
                const isExpanded = !!expandedCats[cat.name];
                const isDragged = draggedIndex === index;

                return (
                  <motion.div
                    layout
                    key={cat.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`transition-all duration-200 group/item relative rounded-xl ${
                      isDragged
                        ? "bg-[#f06a4f]/5 opacity-60 scale-[0.98]"
                        : isSelected
                        ? "bg-[#009eb6]/5 text-[#009eb6]"
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-950"
                    }`}
                  >
                    {/* Main Category Header */}
                    <div className="flex items-center justify-between py-2 px-3">
                      {/* Active Indicator Line & Selectable Title */}
                      <div className="flex items-center gap-2.5 flex-grow min-w-0">
                        {/* Active indicator badge */}
                        <span className={`w-1 h-5 rounded-full transition-all duration-300 ${
                          isSelected 
                            ? "bg-[#009eb6] scale-110" 
                            : "bg-transparent group-hover/item:bg-slate-300"
                        }`} />

                        {/* Category Name Button */}
                        <button
                          onClick={() => handleMainCatChange(cat.name)}
                          className={`text-xs font-black text-right transition-colors truncate flex-grow py-1 ${
                            isSelected ? "text-[#009eb6]" : "text-slate-700"
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                        </button>
                      </div>

                      {/* Controls: Drag Handle & Expand Chevron */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Drag Handle (subtle, visible on hover) */}
                        <div 
                          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#f06a4f] transition-opacity opacity-0 group-hover/item:opacity-100 p-1 rounded hover:bg-slate-100 flex items-center justify-center"
                          title="اسحب لإعادة الترتيب"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>

                        {/* Expand/Collapse Chevron */}
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategoryExpand(cat.name);
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#009eb6] transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#009eb6]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subcategories (Collapsible list) */}
                    {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="mr-6 border-r border-[#009eb6]/15 pr-3 pb-2 mt-0.5 flex flex-col gap-0.5 animate-fadeIn">
                        {cat.subcategories.map((sub) => {
                          const isSubActive = activeSubCat === sub.name && isSelected;
                          return (
                            <button
                              key={sub.name}
                              onClick={() => handleSubCatChange(sub, cat.name)}
                              className={`w-full text-right text-[11px] font-bold py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-start gap-2.5 group/sub relative ${
                                isSubActive
                                  ? "text-[#009eb6] bg-[#009eb6]/5 font-extrabold"
                                  : "text-slate-500 hover:text-[#009eb6] hover:bg-slate-100/50"
                              }`}
                            >
                              <span className={`w-1 h-1 rounded-full transition-all duration-300 ${
                                isSubActive 
                                  ? "bg-[#009eb6] scale-125" 
                                  : "bg-slate-300 group-hover/sub:bg-[#009eb6]/50"
                              }`} />
                              <span>{sub.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </aside>

          {/* Left Column: Products Column */}
          <main className="col-span-12 lg:col-span-9">

            {/* 3. Marketing Banner Slider / Carousel */}
            <div className="relative overflow-hidden rounded-3xl w-full aspect-[3.2/1] h-auto shadow-md mb-8 group border border-slate-100 bg-slate-50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={bannerSlides[currentSlide]}
                  alt={`marketing-banner-${currentSlide}`}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="w-full h-full object-fill"
                />
              </AnimatePresence>

              {/* Navigation Arrows (visible on hover) */}
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" dir="ltr">
                {bannerSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? "bg-white w-4" : "bg-white/40"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Sort Bar */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
              <div className="text-slate-500 text-xs font-bold">
                عرض <span className="text-slate-800 font-extrabold">{(page - 1) * limit + 1} - {Math.min(page * limit, apiData.total)}</span> من أصل <span className="text-slate-800 font-extrabold">{apiData.total}</span> دواء
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-bold">ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-[#10b981] rounded-xl py-1.5 px-3 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="default">الترتيب الافتراضي</option>
                  <option value="price-asc">السعر من الأقل للأعلى</option>
                  <option value="price-desc">السعر من الأعلى للأقل</option>
                  <option value="name-asc">الاسم A-Z</option>
                </select>
              </div>
            </div>

            {/* Content States */}
            {isLoading ? (
              /* Skeleton Loader */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(limit)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 animate-pulse flex flex-col justify-between h-[310px]">
                    <div>
                      <div className="w-1/2 h-4 bg-slate-100 rounded mb-4"></div>
                      <div className="w-full h-32 bg-slate-50 rounded-xl mb-4"></div>
                      <div className="w-3/4 h-4 bg-slate-100 rounded mb-2"></div>
                      <div className="w-1/2 h-3.5 bg-slate-100 rounded mb-4"></div>
                    </div>
                    <div className="h-9 bg-slate-100 rounded-xl w-full"></div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              /* Error State */
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-12 text-center flex flex-col items-center max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                <h3 className="text-sm font-black text-slate-800 mb-1">عذراً، تعذر تحميل البيانات</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">تحقق من اتصالك بالإنترنت أو أعد المحاولة لاحقاً.</p>
                <button onClick={() => refetch()} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-rose-500/20">
                  إعادة المحاولة
                </button>
              </div>
            ) : sortedMedicines.length === 0 ? (
              /* Empty State */
              <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center flex flex-col items-center max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <Search className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-black text-slate-800 mb-2">لا توجد أدوية متوفرة</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">لم نجد أي منتجات تطابق القسم المحدد أو كلمة البحث.</p>
                <button onClick={handleReset} className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/10">
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              /* Products Display */
              <>
                {categoryApiValue === "" && !searchParam ? (
                  /* Default View: Horizontal Carousel of Grids (12 Cards Per slide) + Category Sliders */
                  <>
                    {/* 1. All Products Section (Page-by-page Horizontal Grid Carousel) */}
                    <div className="relative group/all-slider flex flex-col mb-12">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-black text-[#102542] flex items-center gap-2">
                          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#10b981] to-[#059669]" />
                          جميع المنتجات
                        </h3>
                      </div>

                      <div className="relative flex items-center w-full">
                        {/* Left scroll arrow */}
                        <button
                          type="button"
                          onClick={() => {
                            const container = document.getElementById('all-products-carousel');
                            if (container) {
                              container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
                            }
                          }}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover/all-slider:opacity-100 z-10 border border-slate-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Right scroll arrow */}
                        <button
                          type="button"
                          onClick={() => {
                            const container = document.getElementById('all-products-carousel');
                            if (container) {
                              container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
                            }
                          }}
                          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover/all-slider:opacity-100 z-10 border border-slate-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Scroll Container of Grids */}
                        <div
                          id="all-products-carousel"
                          className="flex overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory w-full"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          onScroll={(e) => {
                            const container = e.currentTarget;
                            const pageIdx = Math.round(Math.abs(container.scrollLeft) / container.clientWidth);
                            setCurrentAllPage(pageIdx);
                          }}
                        >
                          {(() => {
                            const chunks = [];
                            for (let i = 0; i < sortedMedicines.length; i += 12) {
                              chunks.push(sortedMedicines.slice(i, i + 12));
                            }
                            return chunks.map((chunk, chunkIdx) => (
                              <div
                                key={chunkIdx}
                                className="snap-start shrink-0 w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-1"
                              >
                                {chunk.map((med) => (
                                  <div
                                    key={med._id}
                                    className="bg-white border border-slate-100 hover:border-[#10b981]/30 rounded-2xl p-3 md:p-4 flex flex-col justify-between h-[340px] hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
                                    onClick={() => openModal(med)}
                                  >
                                    {med.requiresPrescription && (
                                      <span className="absolute top-3 right-3 bg-red-50 text-red-500 text-[9px] font-black px-2 py-1 rounded-lg border border-red-100 z-10 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                        يلزم وصفة
                                      </span>
                                    )}

                                    <div className="w-full h-32 md:h-36 bg-slate-50/50 rounded-xl mb-3 flex items-center justify-center p-2 overflow-hidden group-hover:bg-slate-50 transition-colors">
                                      <img
                                        src={med.images && med.images[0] ? med.images[0] : "https://via.placeholder.com/400x400?text=No+Image"}
                                        alt={med.name}
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>

                                    <div className="text-right flex-grow flex flex-col justify-between">
                                      <div>
                                        <h4 className="text-xs md:text-sm font-black text-slate-800 line-clamp-2 h-9 leading-snug group-hover:text-[#10b981] transition-colors mb-1">
                                          {med.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-bold mb-1 truncate" title={med.genericName}>
                                          {med.genericName} {med.manufacturer ? `| ${med.manufacturer}` : ""}
                                        </p>
                                      </div>

                                      <div className="flex items-baseline justify-start gap-1 mb-3">
                                        <span className="text-[15px] font-black text-slate-900">{med.price}</span>
                                        <span className="text-[10px] text-slate-500 font-bold">جنيه</span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        triggerToast(`تم إضافة ${med.name} إلى السلة بنجاح!`);
                                      }}
                                      className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2 rounded-xl text-center text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#10b981]/10 active:scale-95"
                                    >
                                      <ShoppingCart className="w-3.5 h-3.5" />
                                      <span>أضف إلى العربة</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Dot indicators acting as the slider navigation at the bottom */}
                      <div className="flex items-center justify-center gap-2.5 mt-4" dir="ltr">
                        {(() => {
                          const pageCount = Math.ceil(sortedMedicines.length / 12);
                          return Array.from({ length: pageCount }).map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const container = document.getElementById('all-products-carousel');
                                if (container) {
                                  container.scrollTo({ left: -idx * container.clientWidth, behavior: 'smooth' });
                                  setCurrentAllPage(idx);
                                }
                              }}
                              className={`h-2.5 rounded-full transition-all duration-300 ${
                                currentAllPage === idx
                                  ? "bg-[#10b981] w-6 shadow-sm"
                                  : "bg-slate-200 hover:bg-slate-300 w-2"
                              }`}
                            />
                          ));
                        })()}
                      </div>
                    </div>

                  </>
                ) : (
                  /* Standard Grid View */
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                      {medicines.map((med) => (
                        <motion.div
                          key={med._id}
                          className="bg-white border border-slate-100 hover:border-[#10b981]/30 rounded-2xl p-3 md:p-4 flex flex-col justify-between h-[340px] hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
                          onClick={() => openModal(med)}
                        >
                          {/* Requires Prescription Tag */}
                          {med.requiresPrescription && (
                            <span className="absolute top-3 right-3 bg-red-50 text-red-500 text-[9px] font-black px-2 py-1 rounded-lg border border-red-100 z-10 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-red-500"></span>
                              يلزم وصفة
                            </span>
                          )}

                          {/* Product Image */}
                          <div className="w-full h-32 md:h-36 bg-slate-50/50 rounded-xl mb-3 flex items-center justify-center p-2 overflow-hidden group-hover:bg-slate-50 transition-colors">
                            <img
                              src={med.images && med.images[0] ? med.images[0] : "https://via.placeholder.com/400x400?text=No+Image"}
                              alt={med.name}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Info & Price */}
                          <div className="text-right flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs md:text-sm font-black text-slate-800 line-clamp-2 h-9 leading-snug group-hover:text-[#10b981] transition-colors mb-1">
                                {med.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold mb-1 truncate" title={med.genericName}>
                                {med.genericName} {med.manufacturer ? `| ${med.manufacturer}` : ""}
                              </p>
                            </div>

                            <div className="flex items-baseline justify-start gap-1 mb-3">
                              <span className="text-[15px] font-black text-slate-900">{med.price}</span>
                              <span className="text-[10px] text-slate-500 font-bold">جنيه</span>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerToast(`تم إضافة ${med.name} إلى السلة بنجاح!`);
                            }}
                            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2 rounded-xl text-center text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#10b981]/10 active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>أضف إلى العربة</span>
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* 5. Numbered Pagination Bar */}
                    {apiData.pages > 1 && (
                      <div className="flex items-center justify-center gap-2.5 mt-12 bg-white border border-slate-100 py-3 px-6 rounded-2xl shadow-sm max-w-md mx-auto" dir="ltr">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-100 text-slate-600 hover:border-[#10b981] hover:text-[#10b981] disabled:opacity-40 disabled:pointer-events-none transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5">
                          {visiblePages.map((pNum) => (
                            <button
                              key={pNum}
                              onClick={() => setPage(pNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all ${page === pNum
                                  ? "bg-[#10b981] text-white shadow-md shadow-[#10b981]/20"
                                  : "border border-slate-100 text-slate-600 hover:border-[#10b981] hover:text-[#10b981]"
                                }`}
                            >
                              {pNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setPage(p => Math.min(apiData.pages, p + 1))}
                          disabled={page === apiData.pages}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-100 text-slate-600 hover:border-[#10b981] hover:text-[#10b981] disabled:opacity-40 disabled:pointer-events-none transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* 6. Bottom Promo Announcement Bar */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#005aab] text-white py-3 px-6 text-center text-xs md:text-sm font-black shadow-lg flex items-center justify-between"
          >
            <div className="mx-auto flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">عرض لفترة محدودة</span>
              <span>خصم إضافي 15% على أول طلب لك باستخدام كود الكوبون:</span>
              <span className="bg-yellow-400 text-slate-950 font-bold px-2 py-0.5 rounded border border-yellow-300">CH10</span>
            </div>
            <button
              onClick={() => setShowPromo(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Floating Chat FAB Button */}
      <button
        onClick={() => triggerToast("خدمة الاستشارات الطبية الفورية متاحة على مدار الساعة عبر واتساب.")}
        className="fixed bottom-16 right-6 z-40 w-12 h-12 bg-[#10b981] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        title="استشر الصيدلي"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-6 z-50 bg-slate-900/95 text-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800 text-xs font-bold"
          >
            <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-white text-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Detailed Modal with /api/medicines/{id} fetch */}
      <AnimatePresence>
        {selectedMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedicine(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 flex flex-col md:flex-row border border-slate-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMedicine(null)}
                className="absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors text-slate-500"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Images Column */}
              <div className="w-full md:w-[45%] bg-slate-50 p-6 flex flex-col justify-between border-l border-slate-100">
                <div className="flex-grow flex items-center justify-center relative rounded-2xl bg-white border border-slate-100 min-h-[200px] overflow-hidden mb-4 p-4">
                  <img
                    src={activeDetails?.images && activeDetails.images[activeImageIndex] ? activeDetails.images[activeImageIndex] : "https://via.placeholder.com/600x600?text=No+Image"}
                    alt={activeDetails?.name}
                    className="max-h-56 max-w-full object-contain"
                  />

                  {activeDetails?.requiresPrescription && (
                    <div className="absolute top-3 right-3 bg-red-50 text-red-500 text-[9px] font-black px-2.5 py-1 rounded-lg border border-red-100 shadow-sm flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500"></span>
                      يلزم وصفة
                    </div>
                  )}
                </div>

                {/* Thumbnail selector */}
                {activeDetails?.images && activeDetails.images.length > 1 && (
                  <div className="flex gap-2.5 justify-center overflow-x-auto py-1">
                    {activeDetails.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-12 rounded-lg border-2 overflow-hidden bg-white p-1 transition-all ${activeImageIndex === idx ? 'border-[#10b981]' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Content Column */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between">

                {/* Meta details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#10b981]/10 text-[#10b981] text-[10px] font-black px-2.5 py-1 rounded-full">
                      {activeDetails?.category || "أخرى"}
                    </span>
                    {activeDetails?.manufacturer && (
                      <span className="text-slate-400 text-xs font-bold">{activeDetails.manufacturer}</span>
                    )}
                  </div>

                  <h2 className="text-lg md:text-xl font-black text-slate-900 mb-1 leading-snug">
                    {activeDetails?.name}
                  </h2>

                  {activeDetails?.genericName && (
                    <p className="text-xs text-slate-400 font-bold mb-4">
                      المادة الفعالة: {activeDetails.genericName}
                    </p>
                  )}

                  {/* Description loader or content */}
                  <div className="border-t border-slate-100 pt-4 mb-6">
                    <h3 className="text-xs font-black text-slate-900 mb-2">تفاصيل المنتج:</h3>

                    {isLoadingDetails ? (
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold py-2">
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-[#10b981]" />
                        <span>جاري تحميل باقي التفاصيل...</span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 leading-relaxed text-right">
                        {activeDetails?.description || "لا يوجد وصف متوفر لهذا المنتج حالياً."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div>
                  <div className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-bold">السعر النهائي:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">{activeDetails?.price}</span>
                      <span className="text-xs text-slate-500 font-bold">جنيه مصري</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        triggerToast(`تم إضافة ${activeDetails?.name} إلى السلة بنجاح!`);
                        setSelectedMedicine(null);
                      }}
                      className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#10b981]/10 active:scale-95 text-xs"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>إضافة للسلة</span>
                    </button>
                    <button
                      onClick={() => triggerToast("تم الإضافة إلى المفضلة")}
                      className="w-11 h-11 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all border border-slate-100"
                    >
                      <Heart className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
