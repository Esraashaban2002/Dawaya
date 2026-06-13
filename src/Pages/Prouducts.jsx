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

// Fetch list of medicines
const fetchMedicines = async ({ queryKey }) => {
  const [_key, { search, category, page, limit }] = queryKey;
  let url = `https://dawaya-back-end.vercel.app/api/medicines?page=${page}&limit=${limit}`;
  if (search) url += `&search=${search}`;
  if (category) url += `&category=${category}`;

  const { data } = await axios.get(url);
  return data.data; // returns { total, page, pages, data: [...] }
};

// Fetch single medicine details
const fetchMedicineDetails = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  if (!id) return null;
  const { data } = await axios.get(`https://dawaya-back-end.vercel.app/api/medicines/${id}`);
  return data.data; // returns the single medicine object
};

// Main categories tree matching Chefaa with all subcategories
const initialCategories = [
  { 
    name: "الأدوية", 
    icon: "💊",
    hasDropdown: false,
    subcategories: [
      { name: "حسب الحالة الصحية", apiValue: "" },
      { name: "مسكنات", apiValue: "مسكنات" },
      { name: "مضادات حيوية", apiValue: "مضادات حيوية" },
      { name: "أدوية مزمنة", apiValue: "أدوية مزمنة" },
      { name: "أخرى", apiValue: "أخرى" },
      { name: "أدوية الكحة والزكام", apiValue: "أخرى" },
      { name: "قطرات العين والأذن", apiValue: "أخرى" },
      { name: "أدوية الأطفال", apiValue: "أخرى" },
      { name: "أدوية المعدة والقولون", apiValue: "أخرى" },
      { name: "أدوية الجلدية", apiValue: "أخرى" },
      { name: "الحساسية", apiValue: "أخرى" }
    ]
  },
  { 
    name: "العناية بالشعر", 
    icon: "💇‍♀️",
    hasDropdown: false,
    subcategories: [
      { name: "شامبو وبلسم", apiValue: "أخرى" },
      { name: "ترطيب وعلاج الشعر", apiValue: "أخرى" },
      { name: "اجهزة تصفيف الشعر", apiValue: "أخرى" },
      { name: "صبغات الشعر", apiValue: "أخرى" }
    ]
  },
  { 
    name: "العناية بالبشرة", 
    icon: "🧴",
    hasDropdown: true,
    dropdownItems: ["الغسول", "الترطيب", "السيروم", "الماسك", "الوقاية من الشمس", "أجهزة البشرة", "العناية بالعيون"],
    subcategories: [
      { name: "الغسول", apiValue: "أخرى" },
      { name: "الترطيب", apiValue: "أخرى" },
      { name: "السيروم", apiValue: "أخرى" },
      { name: "الماسك", apiValue: "أخرى" },
      { name: "الوقاية من الشمس", apiValue: "أخرى" },
      { name: "أجهزة البشرة", apiValue: "أخرى" },
      { name: "العناية بالعيون", apiValue: "أخرى" }
    ]
  },
  { 
    name: "العناية اليومية", 
    icon: "🧼",
    hasDropdown: false,
    subcategories: [
      { name: "العناية بالجسم و الاستحمام", apiValue: "أخرى" },
      { name: "العناية بالفم و الاسنان", apiValue: "أخرى" },
      { name: "العناية النسائية", apiValue: "أخرى" },
      { name: "العناية الرجالية", apiValue: "أخرى" },
      { name: "الحماية", apiValue: "أخرى" },
      { name: "الاعشاب الطبيعية و الفيتامينات", apiValue: "أخرى" }
    ]
  },
  { 
    name: "الام والطفل", 
    icon: "👶",
    hasDropdown: false,
    subcategories: [
      { name: "الحفاضات و مستحضرات التغيير", apiValue: "أخرى" },
      { name: "العناية بالام", apiValue: "أخرى" },
      { name: "طعام الاطفال و مستلزماته", apiValue: "أخرى" },
      { name: "مستلزمات الرضاعة الطبيعية", apiValue: "أخرى" },
      { name: "الاستحمام", apiValue: "أخرى" }
    ]
  },
  { 
    name: "المكياج و الاكسسوارات", 
    icon: "💄",
    hasDropdown: false,
    subcategories: [
      { name: "الوجه", apiValue: "أخرى" },
      { name: "العيون", apiValue: "أخرى" },
      { name: "الرموش", apiValue: "أخرى" },
      { name: "الشفاه", apiValue: "أخرى" },
      { name: "الاظافر", apiValue: "أخرى" }
    ]
  },
  { 
    name: "المستلزمات الطبية", 
    icon: "🩺",
    hasDropdown: false,
    subcategories: [
      { name: "ادارة الالم", apiValue: "أخرى" },
      { name: "اجهزة مساعدات التنفس", apiValue: "أخرى" },
      { name: "الاسعافات الاولية", apiValue: "أخرى" },
      { name: "العناية بالسكري", apiValue: "أخرى" },
      { name: "ادارة الوزن", apiValue: "أخرى" },
      { name: "كمامات", apiValue: "أخرى" },
      { name: "التبول اللاإرادي", apiValue: "أخرى" },
      { name: "اجهزة مراقبه الصحة", apiValue: "أخرى" }
    ]
  },
  { 
    name: "الفيتامينات والمكملات", 
    icon: "💊",
    hasDropdown: false,
    subcategories: [
      { name: "الفيتامينات والمعادن", apiValue: "فيتامينات" },
      { name: "المكملات الغذائية", apiValue: "فيتامينات" },
      { name: "التخسيس", apiValue: "فيتامينات" }
    ]
  }
];

// No additional categories array needed since we use tree state

// Marketing banner slides matching uploaded images
const bannerSlides = [
  "/imges/banner_omega3.png",
  "/imges/banner_panadol.jpg",
  "/imges/banner_oplex.png",
  "/imges/banner_maalox.png"
];

export default function Prouducts() {
  const [activeMainCat, setActiveMainCat] = useState("الأدوية");
  const [activeSubCat, setActiveSubCat] = useState("حسب الحالة الصحية");
  const [categoryApiValue, setCategoryApiValue] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchParam);
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Matches the Chefaa grid size (8 items)
  const [sortBy, setSortBy] = useState("default");

  // Dynamic categories state for Drag & Drop
  const [categories, setCategories] = useState(initialCategories);
  const [expandedCats, setExpandedCats] = useState({ "الأدوية": true });
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

  // React Query for products list
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines", { search: searchParam, category: categoryApiValue, page, limit }],
    queryFn: fetchMedicines,
  });

  // React Query for single medicine details
  const { data: detailsData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["medicineDetails", selectedMedicine?._id],
    queryFn: fetchMedicineDetails,
    enabled: !!selectedMedicine?._id,
  });

  const apiData = data || { data: [], total: 0, page: 1, pages: 1 };
  const medicines = apiData.data || [];

  // Client-side Sorting
  const sortedMedicines = [...medicines].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

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
      setCategoryApiValue(firstSub ? firstSub.apiValue : "أخرى");
      setExpandedCats(prev => ({ ...prev, [catName]: true }));
    } else {
      setActiveSubCat(catName);
      setCategoryApiValue("أخرى");
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
    setActiveMainCat("الأدوية");
    setActiveSubCat("حسب الحالة الصحية");
    setCategoryApiValue("");
    setSortBy("default");
    setPage(1);
    setExpandedCats({ "الأدوية": true });
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

        {/* 2. Breadcrumbs & Search Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Link to="/" className="hover:text-[#009eb6] transition-colors">الرئيسية</Link>
            <span className="text-slate-300">/</span>
            <span
              onClick={() => handleMainCatChange("الأدوية")}
              className="hover:text-[#009eb6] cursor-pointer transition-colors"
            >
              {activeMainCat}
            </span>
            {activeSubCat !== activeMainCat && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-[#009eb6]">{activeSubCat}</span>
              </>
            )}
          </div>

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
                    className={`border rounded-xl transition-all duration-250 group ${
                      isDragged
                        ? "border-dashed border-[#f06a4f] bg-[#f06a4f]/5 opacity-60 scale-[0.97] shadow-inner"
                        : isSelected
                        ? "border-[#009eb6]/20 bg-gradient-to-r from-[#009eb6]/5 to-[#009eb6]/10 shadow-[0_4px_12px_-2px_rgba(0,158,182,0.05)]"
                        : "border-slate-100 hover:border-[#009eb6]/15 hover:bg-slate-50/50 bg-white"
                    }`}
                  >
                    {/* Main Category Header */}
                    <div className="flex items-center justify-between p-2.5">
                      {/* Drag Handle & Name */}
                      <div className="flex items-center gap-2.5 flex-grow min-w-0">
                        {/* Drag Handle */}
                        <div 
                          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#f06a4f] transition-colors p-1 rounded-lg hover:bg-slate-50 flex items-center justify-center"
                          title="اسحب لإعادة الترتيب"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Category Selectable Area */}
                        <button
                          onClick={() => handleMainCatChange(cat.name)}
                          className={`flex items-center gap-2 text-xs font-black text-right transition-colors truncate flex-grow ${
                            isSelected ? "text-[#009eb6]" : "text-slate-700 hover:text-slate-950"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm transition-all duration-300 ${
                            isSelected 
                              ? "bg-[#009eb6]/10 text-[#009eb6] scale-110" 
                              : "bg-slate-50 text-slate-500 group-hover:bg-[#009eb6]/5 group-hover:text-[#009eb6]"
                          }`}>
                            {cat.icon}
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </button>
                      </div>

                      {/* Expand/Collapse Chevron */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategoryExpand(cat.name);
                          }}
                          className="p-1.5 hover:bg-slate-100/80 rounded-lg text-slate-400 hover:text-[#009eb6] transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#009eb6]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subcategories (Collapsible list) */}
                    {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="mr-8 border-r border-[#009eb6]/15 pr-3.5 pb-3 mt-0.5 flex flex-col gap-1 animate-fadeIn">
                        {cat.subcategories.map((sub) => {
                          const isSubActive = activeSubCat === sub.name && isSelected;
                          return (
                            <button
                              key={sub.name}
                              onClick={() => handleSubCatChange(sub, cat.name)}
                              className={`w-full text-right text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-start gap-2.5 group relative ${
                                isSubActive
                                  ? "text-[#009eb6] bg-[#009eb6]/5 font-extrabold shadow-sm shadow-[#009eb6]/2"
                                  : "text-slate-500 hover:text-[#009eb6] hover:bg-slate-50/60"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                isSubActive 
                                  ? "bg-[#009eb6] scale-125 shadow-sm shadow-[#009eb6]/50" 
                                  : "bg-slate-300 group-hover:bg-[#009eb6]/50"
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
              /* Products Grid */
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {sortedMedicines.map((med) => (
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
                          <p className="text-[10px] text-slate-400 font-bold mb-1 truncate">
                            {med.manufacturer || med.genericName}
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
                      {Array.from({ length: apiData.pages }, (_, i) => i + 1).map((pNum) => (
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
