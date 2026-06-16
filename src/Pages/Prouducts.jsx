import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight, ShoppingCart,
  Heart, X, Pill, Stethoscope, AlertCircle, Share2, Activity,
  ChevronDown, ChevronUp, MessageCircle, Check, Loader2, GripVertical,
  MapPin, Star, Clock, Phone, MessageSquare, Award, ShieldCheck
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PharmacyCard, MapModal } from "./pharmacies";
const localPharmacies = [

];

const initialCategories = [
  {
    "name": "كل المنتجات",
    "hasDropdown": false,
    "subcategories": []
  },
  {
    "name": "الأدوية",
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
  const [limit] = useState(12); 
  const [sortBy, setSortBy] = useState("default");

  const [categories, setCategories] = useState(initialCategories);
  const [expandedCats, setExpandedCats] = useState({ "الأدوية": true, "كل المنتجات": true });
  const [draggedIndex, setDraggedIndex] = useState(null);

  const toggleCategoryExpand = (catName) => {
    setExpandedCats(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

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

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPromo, setShowPromo] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentAllPage, setCurrentAllPage] = useState(0);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(() => {
    return localStorage.getItem("dawaya_location_confirmed") === "true";
  });
  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem("dawaya_user_location");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user location:", e);
      }
    }
    return {
      lat: 30.0384,
      lng: 31.2101,
      name: "الدقي، الجيزة"
    };
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("dawaya_user_location");
      if (saved) {
        try {
          setUserLocation(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
      setIsLocationConfirmed(localStorage.getItem("dawaya_location_confirmed") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await axios.get("https://dawaya-back-end.vercel.app/api/medicines?limit=200");
      return res.data;
    }
  });

  const apiMedicines = apiResponse?.data?.data || [];

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
        "العناية الرجالية", "الحماية", "الفيتامينات والمكملات"
      ].map(norm);

      if (medicinesSub.includes(normalized)) return "الأدوية";
      if (haircareSub.includes(normalized)) return "العناية بالشعر";
      if (skincareSub.includes(normalized)) return "العناية بالبشرة";
      if (dailycareSub.includes(normalized)) return "العناية اليومية";

      return "أخرى";
    };

    return apiMedicines
      .map((med) => ({
        ...med,
        id: med._id,
        _id: med._id,
        category: med.subCategory || med.category || "",
        image: med.images && med.images[0] ? med.images[0] : (med.image || "https://via.placeholder.com/400x400?text=No+Image"),
        images: med.images && med.images.length > 0 ? med.images : [med.image || "https://via.placeholder.com/400x400?text=No+Image"]
      }))
      .filter((med) => {

        if (activeMainCat !== "كل المنتجات") {
          const medMainCat = getProductMainCategory(med.category);
          if (norm(medMainCat) !== norm(activeMainCat)) {
            return false;
          }

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
  }, [activeMainCat, categoryApiValue, searchParam, apiMedicines]);

  const sortedMedicines = React.useMemo(() => {
    const sorted = [...filteredMedicines];
    if (sortBy === "price-asc") return sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") return sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [filteredMedicines, sortBy]);

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

  const maxVisiblePages = 8;
  const currentGroup = Math.ceil(page / maxVisiblePages);
  const startPage = (currentGroup - 1) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, apiData.pages);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const detailsData = null;
  const isLoadingDetails = false;

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

      const firstSub = selectedCatObj.subcategories?.[0];
      setActiveSubCat(firstSub ? firstSub.name : catName);
      setCategoryApiValue(firstSub ? firstSub.apiValue : "");
      setExpandedCats(prev => ({ ...prev, [catName]: true }));
    } else {
      setActiveSubCat(catName);
      setCategoryApiValue("");
    }
  };

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

  const renderCategoriesList = () => {
    return (
      <>
        <h3 className="text-xl font-black pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#1ab5ea] to-[#0ea5e9]" />
            <span className="text-[#1e293b] font-black">الأقسام</span>
          </span>
          <span className="text-sm text-white bg-gradient-to-r from-[#1ab5ea] to-[#1ab5ea]/80 px-3 py-1 rounded-full font-bold shadow-sm shadow-[#1ab5ea]/10">
            {activeMainCat}
          </span>
        </h3>

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
                    ? "bg-[#0ea5e9]/5 opacity-60 scale-[0.98]"
                    : isSelected
                    ? "bg-[#1ab5ea]/5 text-[#1ab5ea]"
                    : "hover:bg-slate-50 text-slate-700 hover:text-slate-950"
                }`}
              >

                <div className="flex items-center justify-between py-2 px-3">

                  <div className="flex items-center gap-2.5 flex-grow min-w-0">

                    <span className={`w-1 h-5 rounded-full transition-all duration-300 ${
                      isSelected 
                        ? "bg-[#1ab5ea] scale-110" 
                        : "bg-transparent group-hover/item:bg-slate-300"
                    }`} />

                    <button
                      onClick={() => handleMainCatChange(cat.name)}
                      className={`text-base font-black text-right transition-colors truncate flex-grow py-1.5 ${
                        isSelected ? "text-[#1ab5ea]" : "text-slate-700"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">

                    <div 
                      className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#0ea5e9] transition-opacity opacity-0 group-hover/item:opacity-100 p-1 rounded hover:bg-slate-100 flex items-center justify-center"
                      title="اسحب لإعادة الترتيب"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>

                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryExpand(cat.name);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#1ab5ea] transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[#1ab5ea]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="mr-6 border-r border-[#1ab5ea]/15 pr-3 pb-2 mt-0.5 flex flex-col gap-0.5 animate-fadeIn">
                    {cat.subcategories.map((sub) => {
                      const isSubActive = activeSubCat === sub.name && isSelected;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => handleSubCatChange(sub, cat.name)}
                          className={`w-full text-right text-sm font-bold py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-start gap-2.5 group/sub relative ${
                            isSubActive
                              ? "text-[#1ab5ea] bg-[#1ab5ea]/5 font-extrabold"
                              : "text-slate-500 hover:text-[#1ab5ea] hover:bg-slate-100/50"
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full transition-all duration-300 ${
                            isSubActive 
                              ? "bg-[#1ab5ea] scale-125" 
                              : "bg-slate-300 group-hover/sub:bg-[#1ab5ea]/50"
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
      </>
    );
  };

  const activeDetails = detailsData || selectedMedicine;

  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfdfe] text-slate-800 font-sans pb-24 selection:bg-[#1ab5ea]/20 selection:text-[#1ab5ea]">



      <div className="w-full py-6">

        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-[400px]">
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
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#1ab5ea] focus:bg-white focus:ring-4 focus:ring-[#1ab5ea]/10 rounded-2xl py-3.5 px-5 pr-12 text-base font-bold transition-all outline-none"
            />
            <Search className="absolute right-4.5 top-1/2 -translate-y-1/2 w-5.5 h-5.5 text-slate-400" />
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

        <div className="lg:hidden flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-700 shadow-sm w-full sm:w-auto"
          >
            <SlidersHorizontal className="w-5 h-5 text-[#1ab5ea]" />
            <span>تصفح الأقسام ({activeMainCat})</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-base font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[#1ab5ea]/20 w-full sm:w-auto text-center"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر من الأقل للأعلى</option>
            <option value="price-desc">السعر من الأعلى للأقل</option>
            <option value="name-asc">الاسم A-Z</option>
          </select>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">

          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-md shadow-[#1ab5ea]/3 sticky top-20 z-20">
            {renderCategoriesList()}
          </aside>

          <AnimatePresence>
            {isSidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50">

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                />

                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.25 }}
                  className="fixed top-0 right-0 bottom-0 w-full max-w-[280px] h-full bg-white shadow-2xl p-5 overflow-y-auto flex flex-col z-50"
                >

                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 left-4 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors z-20"
                  >
                    <X className="w-5 h-5 text-slate-700" />
                  </button>

                  <div className="mt-8 flex-grow">
                    {renderCategoriesList()}
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          <main className="col-span-12 lg:col-span-9 min-w-0">

            <div className="relative overflow-hidden rounded-3xl w-full aspect-[2.8/1] sm:aspect-[3.2/1] h-auto shadow-md mb-8 group border border-slate-100 bg-slate-50">
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

            {isLoading ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
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

              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-12 text-center flex flex-col items-center max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                <h3 className="text-sm font-black text-slate-800 mb-1">عذراً، تعذر تحميل البيانات</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">تحقق من اتصالك بالإنترنت أو أعد المحاولة لاحقاً.</p>
                <button onClick={() => refetch()} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-rose-500/20">
                  إعادة المحاولة
                </button>
              </div>
            ) : sortedMedicines.length === 0 ? (

              <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center flex flex-col items-center max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <Search className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-black text-slate-800 mb-2">لا توجد أدوية متوفرة</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">لم نجد أي منتجات تطابق القسم المحدد أو كلمة البحث.</p>
                <button onClick={handleReset} className="bg-[#1ab5ea] hover:bg-[#159ccb] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-[#1ab5ea]/15">
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (

              <>
                {categoryApiValue === "" && !searchParam ? (

                  <>

                    <div className="relative group/all-slider flex flex-col mb-12">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-black text-[#1e293b] flex items-center gap-2">
                          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#1ab5ea] to-[#0ea5e9]" />
                          جميع المنتجات
                        </h3>
                      </div>

                      <div className="relative flex items-center w-full overflow-hidden">

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
                                className="snap-start shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 px-1"
                              >
                                {chunk.map((med) => (
                                  <div
                                    key={med._id}
                                    className="bg-white border border-slate-100 hover:border-[#1ab5ea]/30 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between h-[330px] sm:h-[405px] hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
                                    onClick={() => openModal(med)}
                                  >
                                    {med.requiresPrescription && (
                                      <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-50 text-red-500 text-[10px] sm:text-xs font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-red-100 z-10 flex items-center gap-0.5 sm:gap-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                        يلزم وصفة
                                      </span>
                                    )}

                                    <div className="w-full h-24 sm:h-32 md:h-36 bg-slate-50/50 rounded-xl mb-2 sm:mb-3 flex items-center justify-center p-2 overflow-hidden group-hover:bg-slate-50 transition-colors">
                                      <img
                                        src={med.images && med.images[0] ? med.images[0] : "https://via.placeholder.com/400x400?text=No+Image"}
                                        alt={med.name}
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>

                                    <div className="text-right flex-grow flex flex-col justify-between">
                                      <div>
                                        <h4 className="text-xs sm:text-base font-black text-slate-800 line-clamp-2 h-8 sm:h-12 leading-snug group-hover:text-[#1ab5ea] transition-colors mb-1">
                                          {med.name}
                                        </h4>
                                        <p className="text-[10px] sm:text-xs text-slate-400 font-bold mb-1 truncate" title={med.genericName}>
                                          {med.genericName} {med.manufacturer ? `| ${med.manufacturer}` : ""}
                                        </p>
                                      </div>

                                      <div className="flex items-baseline justify-start gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                                        <span className="text-sm sm:text-lg font-black text-slate-900">{med.price}</span>
                                        <span className="text-[10px] sm:text-xs text-slate-500 font-bold">جنيه</span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        triggerToast(`تم إضافة ${med.name} إلى السلة بنجاح!`);
                                      }}
                                      className="w-full bg-[#1ab5ea] hover:bg-[#159ccb] text-white font-bold py-2 sm:py-2.5 rounded-xl text-center text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 shadow-sm shadow-[#1ab5ea]/15 active:scale-95"
                                    >
                                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      <span>أضف إلى العربة</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

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
                                  ? "bg-[#1ab5ea] w-6 shadow-sm"
                                  : "bg-slate-200 hover:bg-slate-300 w-2"
                              }`}
                            />
                          ));
                        })()}
                      </div>
                    </div>

                  </>
                ) : (

                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
                    >
                      {medicines.map((med) => (
                        <motion.div
                          key={med._id}
                          className="bg-white border border-slate-100 hover:border-[#1ab5ea]/30 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between h-[330px] sm:h-[405px] hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
                          onClick={() => openModal(med)}
                        >

                          {med.requiresPrescription && (
                            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-50 text-red-500 text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-red-100 z-10 flex items-center gap-0.5 sm:gap-1">
                              <span className="w-1 h-1 rounded-full bg-red-500"></span>
                              يلزم وصفة
                            </span>
                          )}

                          <div className="w-full h-24 sm:h-32 md:h-36 bg-slate-50/50 rounded-xl mb-2 sm:mb-3 flex items-center justify-center p-2 overflow-hidden group-hover:bg-slate-50 transition-colors">
                            <img
                              src={med.images && med.images[0] ? med.images[0] : "https://via.placeholder.com/400x400?text=No+Image"}
                              alt={med.name}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="text-right flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs sm:text-base font-black text-slate-800 line-clamp-2 h-8 sm:h-12 leading-snug group-hover:text-[#1ab5ea] transition-colors mb-1">
                                {med.name}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-slate-400 font-bold mb-1 truncate" title={med.genericName}>
                                {med.genericName} {med.manufacturer ? `| ${med.manufacturer}` : ""}
                              </p>
                            </div>

                            <div className="flex items-baseline justify-start gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                              <span className="text-sm sm:text-lg font-black text-slate-900">{med.price}</span>
                              <span className="text-[10px] sm:text-xs text-slate-500 font-bold">جنيه</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerToast(`تم إضافة ${med.name} إلى السلة بنجاح!`);
                            }}
                            className="w-full bg-[#1ab5ea] hover:bg-[#159ccb] text-white font-bold py-2 sm:py-2.5 rounded-xl text-center text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#1ab5ea]/15 active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>أضف إلى العربة</span>
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>

                    {apiData.pages > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-12 bg-white border border-slate-100 py-3.5 px-6 rounded-2xl shadow-sm max-w-lg mx-auto" dir="ltr">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-100 text-slate-600 hover:border-[#1ab5ea] hover:text-[#1ab5ea] disabled:opacity-40 disabled:pointer-events-none transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                          {visiblePages.map((pNum) => (
                            <button
                              key={pNum}
                              onClick={() => setPage(pNum)}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg text-base font-black transition-all ${page === pNum
                                  ? "bg-[#1ab5ea] text-white shadow-md shadow-[#1ab5ea]/20"
                                  : "border border-slate-100 text-slate-600 hover:border-[#1ab5ea] hover:text-[#1ab5ea]"
                                }`}
                            >
                              {pNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setPage(p => Math.min(apiData.pages, p + 1))}
                          disabled={page === apiData.pages}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-100 text-slate-600 hover:border-[#1ab5ea] hover:text-[#1ab5ea] disabled:opacity-40 disabled:pointer-events-none transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
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

      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#159ccb] text-white py-4 px-6 text-center text-sm md:text-base font-black shadow-lg flex items-center justify-between"
          >
            <div className="mx-auto flex flex-col sm:flex-row items-center gap-2 text-center">
              <span className="bg-white/20 px-2.5 py-0.5 rounded text-xs">عرض لفترة محدودة</span>
              <span>خصم إضافي 15% على أول طلب لك باستخدام كود الكوبون:</span>
              <span className="bg-yellow-400 text-slate-950 font-bold px-2.5 py-0.5 rounded border border-yellow-300 font-sans">CH10</span>
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

      <button
        onClick={() => triggerToast("خدمة الاستشارات الطبية الفورية متاحة على مدار الساعة عبر واتساب.")}
        className="fixed bottom-16 right-6 z-40 w-12 h-12 bg-[#1ab5ea] hover:bg-[#159ccb] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        title="استشر الصيدلي"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-6 z-50 bg-slate-900/95 text-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800 text-sm font-bold"
          >
            <div className="w-5 h-5 rounded-full bg-[#1ab5ea] flex items-center justify-center text-white text-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 flex flex-col border border-slate-100"
            >

              <button
                onClick={() => setSelectedMedicine(null)}
                className="absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors text-slate-500"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex flex-col md:flex-row flex-grow">

                <div className="w-full md:w-[45%] bg-slate-50 p-6 flex flex-col justify-between border-l border-slate-100">
                  <div className="flex-grow flex items-center justify-center relative rounded-2xl bg-white border border-slate-100 min-h-[200px] overflow-hidden mb-4 p-4">
                    <img
                      src={activeDetails?.images && activeDetails.images[activeImageIndex] ? activeDetails.images[activeImageIndex] : "https://via.placeholder.com/400x400?text=No+Image"}
                      alt={activeDetails?.name}
                      className="max-h-56 max-w-full object-contain"
                    />

                    {activeDetails?.requiresPrescription && (
                      <div className="absolute top-3 right-3 bg-red-50 text-red-500 text-xs font-black px-2.5 py-1 rounded-lg border border-red-100 shadow-sm flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                        يلزم وصفة
                      </div>
                    )}
                  </div>

                  {activeDetails?.images && activeDetails.images.length > 1 && (
                    <div className="flex gap-2.5 justify-center overflow-x-auto py-1">
                      {activeDetails.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-12 h-12 rounded-lg border-2 overflow-hidden bg-white p-1 transition-all ${activeImageIndex === idx ? 'border-[#1ab5ea]' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between">

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#1ab5ea]/10 text-[#1ab5ea] text-xs font-black px-2.5 py-1 rounded-full">
                        {activeDetails?.category || "أخرى"}
                      </span>
                      {activeDetails?.manufacturer && (
                        <span className="text-slate-400 text-sm font-bold">{activeDetails.manufacturer}</span>
                      )}
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1 leading-snug">
                      {activeDetails?.name}
                    </h2>

                    {activeDetails?.genericName && (
                      <p className="text-sm text-slate-400 font-bold mb-4">
                        المادة الفعالة: {activeDetails.genericName}
                      </p>
                    )}

                    <div className="border-t border-slate-100 pt-4 mb-6">
                      <h3 className="text-sm font-black text-slate-900 mb-2">تفاصيل المنتج:</h3>

                      {isLoadingDetails ? (
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold py-2">
                          <Loader2 className="w-4.5 h-4.5 animate-spin text-[#1ab5ea]" />
                          <span>جاري تحميل باقي التفاصيل...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 leading-relaxed text-right">
                          {activeDetails?.description || "لا يوجد وصف متوفر لهذا المنتج حالياً."}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100 flex justify-between items-center">
                      <span className="text-slate-400 text-sm font-bold">السعر النهائي:</span>
                      <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">{activeDetails?.price}</span>
                        <span className="text-sm text-slate-500 font-bold">جنيه مصري</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          triggerToast(`تم إضافة ${activeDetails?.name} إلى السلة بنجاح!`);
                          setSelectedMedicine(null);
                        }}
                        className="flex-1 bg-[#1ab5ea] hover:bg-[#159ccb] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#1ab5ea]/15 active:scale-95 text-sm"
                      >
                        <ShoppingCart className="w-4.5 h-4.5" />
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
              </div>

              <div className="w-full border-t border-slate-100 p-6 md:p-8 bg-slate-50/50">
                <h3 className="text-sm font-black text-[#1e293b] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#1ab5ea] to-[#0ea5e9]" />
                  الصيدليات المتاحة التي يتوفر بها هذا الدواء
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localPharmacies.slice(0, 2).map((pharmacy) => (
                    <PharmacyCard
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      onViewDetails={() => setSelectedPharmacy(pharmacy)}
                    />
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPharmacy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPharmacy(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-[500px] overflow-hidden rounded-3xl shadow-2xl relative z-10 border border-slate-100 flex flex-col"
            >

              <button
                onClick={() => setSelectedPharmacy(null)}
                className="absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="h-28 bg-gradient-to-l from-[#1ab5ea] to-[#1ab5ea]/80 p-6 flex items-end">
                <div className="flex items-center gap-3 relative z-10 translate-y-8">
                  <div className="w-16 h-16 bg-white border-2 border-white rounded-2xl p-2 flex items-center justify-center overflow-hidden shadow-md">
                    <img src={selectedPharmacy.logo} alt={selectedPharmacy.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 bg-white/95 px-3 py-1 rounded-xl shadow-sm leading-snug">
                      {selectedPharmacy.name}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-12 flex-grow">

                <div className="flex items-center gap-3 mb-4 text-xs font-black">
                  <span className={`px-2.5 py-1 rounded-lg ${selectedPharmacy.isOpen ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {selectedPharmacy.isOpen ? "مفتوح الآن" : "مغلق حالياً"}
                  </span>
                  {selectedPharmacy.is24h && (
                    <span className="bg-[#1ab5ea]/10 text-[#1ab5ea] px-2.5 py-1 rounded-lg">شغال 24 ساعة</span>
                  )}
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg">
                    {selectedPharmacy.rating} <Star className="w-3 h-3 fill-current" />
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-black text-slate-900 mb-1.5">حول الصيدلية:</h3>
                  <p className="text-sm text-slate-500 leading-relaxed text-right">{selectedPharmacy.about}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3.5 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                    <MapPin className="w-4.5 h-4.5 text-[#1ab5ea]" />
                    <span>{selectedPharmacy.address}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                    <Phone className="w-4.5 h-4.5 text-[#1ab5ea]" />
                    <span>الخط الساخن: {selectedPharmacy.phone}</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {selectedPharmacy.hasDelivery && (
                      <span className="text-xs bg-slate-50 border border-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-xl"> خدمة توصيل للمنزل</span>
                    )}
                    {selectedPharmacy.hasParking && (
                      <span className="text-xs bg-slate-50 border border-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-xl"> موقف سيارات خاص</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <a
                    href={`https://wa.me/${selectedPharmacy.whatsapp || (selectedPharmacy.phone && selectedPharmacy.phone.startsWith("0") ? "20" + selectedPharmacy.phone.slice(1) : selectedPharmacy.phone) || ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] text-sm"
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>طلب بالواتساب</span>
                  </a>

                  <button
                    onClick={() => {
                      triggerToast("تم نسخ الهاتف الساخن!");
                      navigator.clipboard.writeText(selectedPharmacy.phone);
                    }}
                    className="flex-1 bg-[#1ab5ea] hover:bg-[#159ccb] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#1ab5ea]/10 active:scale-[0.98] text-sm"
                  >
                    <Phone className="w-4.5 h-4.5" />
                    <span>اتصال بالدعم</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMapModalOpen && (
          <MapModal
            initialLocation={userLocation}
            onConfirm={(location) => {
              setUserLocation(location);
              setIsLocationConfirmed(true);
              setIsMapModalOpen(false);
              localStorage.setItem("dawaya_user_location", JSON.stringify(location));
              localStorage.setItem("dawaya_location_confirmed", "true");
              triggerToast(`تم تحديث موقعك إلى: ${location.name}`);
            }}
            onClose={() => setIsMapModalOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
