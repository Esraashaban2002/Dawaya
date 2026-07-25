import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

const translations = {
  ar: {
    // General & Brand
    appName: "دوايا",
    topBanner: "احنا معاك ف بيتك احنا دواك.. دوايا",
    searchPlaceholder: "إبحث باسم الدواء...",
    welcomeMsg: "مرحباً،",
    guestUser: "مستخدم",
    currency: "جنيه",

    // Navbar Navigation
    navHome: "الرئيسية",
    navProducts: "المنتجات",
    navPharmacies: "الصيدليات",
    navScanPrescription: "مسح روشتة",
    navPrescriptionHistory: "روشتاتي السابقة",
    navReminders: "تذكير المواعيد",
    navCart: "السلة",
    navFavorites: "المفضلة",
    navLogin: "دخول",
    navRegister: "إنشاء حساب",
    navLogout: "تسجيل الخروج",
    navProfile: "الملف الشخصي",
    navDashboard: "لوحة التحكم",

    // Hero Section
    uploadPrescriptionTitle: "رفع الروشتة",
    uploadPrescriptionDesc: "قم بمسح وإرسال روشتة الطبية بسرعة لصرفها بشكل موثوق",
    chooseFileBtn: "اختر ملف",
    whatsappRemindersTitle: "تذكيرات واتساب",
    whatsappRemindersDesc: "احصل على تذكيرات تفاعلية للجرعات وتحديثات الطلبات مباشرة على واتساب",
    activateNowBtn: "تفعيل الآن",
    heroTitle1: "نمكن الصيدليات من النمو الرقمي",
    heroSubtitle1: "حلول رقمية ذكية لزيادة المبيعات",
    heroTitle2: "توصيلات سريعة",
    heroSubtitle2: "وصل طلبك في أقل من ساعة",
    heroTitle3: "نوفر نواقص الأدوية",
    heroSubtitle3: "منصة ذكية لتأمين احتياجات صيدليتك",
    heroTitle4: "صيدليتك الذكية",
    heroSubtitle4: "إدارة متكاملة للمخزون والطلبات",
    orderNowBtn: "اطلب الآن",
    learnMoreBtn: "اعرف المزيد",

    // Cart Page
    cartPageTitle: "عربة التسوق",
    cartEmpty: "عربة التسوق فارغة",
    cartEmptyDesc: "يبدو أنك لم تقم بإضافة أي منتجات بعد. ابدأ بالتسوق الآن.",
    backToProducts: "العودة للمنتجات",
    clearCart: "تفريغ العربة",
    subtotal: "المجموع الفرعي",
    deliveryFee: "رسوم التوصيل",
    tax: "ضريبة (5%)",
    total: "الإجمالي الكلي",
    proceedToCheckout: "إتمام الشراء",
    items: "منتجات",

    // Favorites Page
    favoritesTitle: "المفضلة",
    favoritesEmpty: "قائمة المفضلة فارغة",
    favoritesEmptyDesc: "لم تقم بإضافة أي منتجات إلى المفضلة بعد.",
    backToHome: "العودة للرئيسية",
    removeFromFavorites: "إزالة من المفضلة",
    addToCart: "أضف للسلة",

    // Prescription Page
    prescriptionTitle: "مسح الروشتة الطبية وتوفير العلاج",
    prescriptionDesc: "ارفع صورة روشتة طبيبك، وسيقوم نظامنا الذكي بقراءة المكونات ومطابقتها فوراً مع الأدوية في صيدليتنا.",
    myPrescriptions: "روشتاتي السابقة",
    startScan: "إبدأ مسح وقراءة الروشتة",
    uploadPrescription: "رفع الروشتة",
    scanPrescription: "مسح الروشتة",

    // Prescription History
    prescriptionHistoryTitle: "روشتاتي السابقة (سجل الروشتات)",
    prescriptionHistoryDesc: "استعرض جميع الروشتات الطبية التي قمت بمسحها سابقاً وأعد طلب الأدوية بسهولة.",
    newPrescription: "روشتة جديدة",
    reorder: "إعادة الطلب",
    viewPrescription: "عرض الروشتة",
    deletePrescription: "حذف الروشتة",
    noPrescriptions: "لا توجد روشتات محفوظة",
    noPrescriptionsDesc: "لم تقم بمسح أي روشتات بعد. ابدأ بمسح أول روشتة الآن!",
    doctorName: "اسم الطبيب",
    patientName: "اسم المريض",
    date: "التاريخ",
    medications: "الأدوية المكتشفة",
    scannedImage: "صورة الروشتة",

    // Checkout
    home: "الرئيسية",
    checkout: "إتمام الطلب",

    // Chatbot
    chatTitle: "المساعد الطبي لـ دوايا",
    chatSubtitle: "استشر الذكاء الاصطناعي أو تواصل مع صيدلي",
    chatWelcome: "أهلاً بك في دوايا! كيف يمكنني مساعدتك اليوم بخصوص الأدوية والروشتات؟",
    chatAskPlaceholder: "اكتب استفسارك عن أي دواء هنا...",
    contactPharmacistBtn: "تحدث مع صيدلي مباشر 👨‍⚕️",
    chatPharmacistAlert: "جاري تحويلك لصيدلي متخصص عبر واتساب...",
    quickPills: [
      "كيف أستخدم بندول؟",
      "هل يوجد بديل لأوجمنتين؟",
      "تواصل مع صيدلي مباشر"
    ],

    // Common
    loading: "جاري التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    confirm: "تأكيد",
    success: "نجاح",
    error: "خطأ",
    homeBreadcrumb: "الرئيسية",
  },

  en: {
    // General & Brand
    appName: "Dawaya",
    topBanner: "We are with you at home, your healthcare partner.. Dawaya",
    searchPlaceholder: "Search for medicines...",
    welcomeMsg: "Welcome,",
    guestUser: "User",
    currency: "EGP",

    // Navbar Navigation
    navHome: "Home",
    navProducts: "Products",
    navPharmacies: "Pharmacies",
    navScanPrescription: "Scan Prescription",
    navPrescriptionHistory: "Prescription History",
    navReminders: "Reminders",
    navCart: "Cart",
    navFavorites: "Favorites",
    navLogin: "Sign In",
    navRegister: "Register",
    navLogout: "Sign Out",
    navProfile: "Profile",
    navDashboard: "Dashboard",

    // Hero Section
    uploadPrescriptionTitle: "Upload Prescription",
    uploadPrescriptionDesc: "Scan & send your medical prescription for fast, reliable fulfillment",
    chooseFileBtn: "Choose File",
    whatsappRemindersTitle: "WhatsApp Reminders",
    whatsappRemindersDesc: "Get interactive dose reminders and order updates directly on WhatsApp",
    activateNowBtn: "Activate Now",
    heroTitle1: "Empowering Pharmacies for Digital Growth",
    heroSubtitle1: "Smart digital solutions to boost sales & inventory",
    heroTitle2: "Fast Deliveries",
    heroSubtitle2: "Get your medicines delivered in under an hour",
    heroTitle3: "Hard-to-find Medications",
    heroSubtitle3: "Smart platform to secure your healthcare needs",
    heroTitle4: "Your Smart Pharmacy",
    heroSubtitle4: "Comprehensive inventory & order management",
    orderNowBtn: "Order Now",
    learnMoreBtn: "Learn More",

    // Cart Page
    cartPageTitle: "Shopping Cart",
    cartEmpty: "Your cart is empty",
    cartEmptyDesc: "You haven't added any products yet. Start shopping now.",
    backToProducts: "Back to Products",
    clearCart: "Clear Cart",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    tax: "Tax (5%)",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
    items: "items",

    // Favorites Page
    favoritesTitle: "Favorites",
    favoritesEmpty: "Your favorites list is empty",
    favoritesEmptyDesc: "You haven't added any products to your favorites yet.",
    backToHome: "Back to Home",
    removeFromFavorites: "Remove from Favorites",
    addToCart: "Add to Cart",

    // Prescription Page
    prescriptionTitle: "Scan Medical Prescription & Find Medicines",
    prescriptionDesc: "Upload your prescription image and our AI system will instantly read and match medicines from our pharmacy.",
    myPrescriptions: "My Prescriptions",
    startScan: "Start Scanning Prescription",
    uploadPrescription: "Upload Prescription",
    scanPrescription: "Scan Prescription",

    // Prescription History
    prescriptionHistoryTitle: "Prescription History",
    prescriptionHistoryDesc: "Browse all your previously scanned prescriptions and reorder medicines easily.",
    newPrescription: "New Prescription",
    reorder: "Reorder",
    viewPrescription: "View Prescription",
    deletePrescription: "Delete Prescription",
    noPrescriptions: "No saved prescriptions",
    noPrescriptionsDesc: "You haven't scanned any prescriptions yet. Scan your first one now!",
    doctorName: "Doctor Name",
    patientName: "Patient Name",
    date: "Date",
    medications: "Detected Medications",
    scannedImage: "Prescription Photo",

    // Checkout
    home: "Home",
    checkout: "Checkout",

    // Chatbot
    chatTitle: "Dawaya Medical AI Assistant",
    chatSubtitle: "Ask AI or consult a live pharmacist",
    chatWelcome: "Welcome to Dawaya! How can I help you today regarding medicines and prescriptions?",
    chatAskPlaceholder: "Type your query about any medicine here...",
    contactPharmacistBtn: "Talk to Live Pharmacist 👨‍⚕️",
    chatPharmacistAlert: "Connecting you with a licensed pharmacist via WhatsApp...",
    quickPills: [
      "How to use Panadol?",
      "Any alternative to Augmentin?",
      "Contact a Live Pharmacist"
    ],

    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirm: "Confirm",
    success: "Success",
    error: "Error",
    homeBreadcrumb: "Home",
  }
};

export default function LanguageContextProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('dawaya_lang') || 'ar';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (language === 'en') {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    } else {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    }
    localStorage.setItem('dawaya_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key) => {
    const langDict = translations[language] || translations.ar;
    return langDict[key] !== undefined ? langDict[key] : (translations.ar[key] || key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
