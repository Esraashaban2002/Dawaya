import React, { useState, useRef, useMemo } from "react";
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight, Star,
  MapPin, Clock, Phone, MessageSquare, Info, X, Share2,
  CheckCircle, Globe, Award, ShieldCheck, Check, Eye, Compass, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = "";

const predefinedLocations = [
  { name: "الدقي، الجيزة", lat: 30.0384, lng: 31.2101 },
  { name: "التجمع الخامس، القاهرة الجديدة", lat: 30.0285, lng: 31.4913 },
  { name: "مدينة نصر، القاهرة", lat: 30.0612, lng: 31.3301 },
  { name: "المعادي، القاهرة", lat: 29.9602, lng: 31.2569 },
  { name: "حلوان، القاهرة", lat: 29.8414, lng: 31.3004 },
  { name: "الشروق، القاهرة", lat: 30.1261, lng: 31.6298 },
  { name: "الرحاب، القاهرة", lat: 30.0635, lng: 31.4918 },
  { name: "مدينتي، القاهرة", lat: 30.0825, lng: 31.6507 },
  { name: "عين شمس، القاهرة", lat: 30.1311, lng: 31.3308 },
  { name: "المطرية، القاهرة", lat: 30.1214, lng: 31.3128 },
  { name: "الزمالك، القاهرة", lat: 30.0626, lng: 31.2197 },
  { name: "العبور، القاهرة", lat: 30.2288, lng: 31.4754 },
  { name: "شبرا، القاهرة", lat: 30.0865, lng: 31.2451 },
  { name: "المهندسين، الجيزة", lat: 30.0545, lng: 31.2008 },
  { name: "فيصل، الجيزة", lat: 30.0131, lng: 31.2024 },
  { name: "الهرم، الجيزة", lat: 29.9928, lng: 31.1703 },
  { name: "حدائق الأهرام، الجيزة", lat: 29.9685, lng: 31.1227 },
  { name: "الشيخ زايد، الجيزة", lat: 30.0138, lng: 30.9756 },
  { name: "أكتوبر، الجيزة", lat: 29.9720, lng: 30.9440 },
  { name: "أكتوبر الجديدة، الجيزة", lat: 29.9387, lng: 30.8874 }
];

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Pharmacy() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState({
    openNow: false,
    delivery: false,
    is24h: false,
    parking: false,
    onlyNearby: true
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const modalTravelTime = useMemo(() => {
    if (!selectedPharmacy) return null;
    const dist = selectedPharmacy.distance;
    const formattedDistance = dist < 1.0 
      ? `${Math.round(dist * 1000)}m` 
      : `${dist.toFixed(1)} KM`;

    const travelTimeText = dist < 1.0
      ? ` مشياً: ${Math.round(dist * 15)} دقيقة`
      : ` بالسيارة: ${Math.round(dist * 4)} دقيقة`;

    return {
      formattedDistance,
      travelTimeText
    };
  }, [selectedPharmacy]);

  const [toastMessage, setToastMessage] = useState(null);
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
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(() => {
    return localStorage.getItem("dawaya_location_confirmed") === "true";
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

  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const fetchPharmacies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://dawaya-back-end.vercel.app/api/pharmacies");
        if (response.ok) {
          const resJson = await response.json();
          if (isMounted) {
            if (resJson.success && resJson.data && Array.isArray(resJson.data.data)) {
              setPharmacies(resJson.data.data);
            } else if (Array.isArray(resJson.data)) {
              setPharmacies(resJson.data);
            } else if (Array.isArray(resJson)) {
              setPharmacies(resJson);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchPharmacies();
    return () => {
      isMounted = false;
    };
  }, []);

  const partnersCarouselRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const hasMatchingPharmacy = pharmacies.some(p => 
      p.name.includes(searchQuery.trim()) || p.address.includes(searchQuery.trim())
    );

    if (!hasMatchingPharmacy) {

      navigate(`/products?search=${searchQuery.trim()}`);
    }
  };

  const handleFilterToggle = (key) => {
    setSelectedServices(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const processedPharmacies = useMemo(() => {
    const sortedList = pharmacies.map(p => {

      let lat = p.lat !== undefined ? parseFloat(p.lat) : undefined;
      let lng = p.lng !== undefined ? parseFloat(p.lng) : undefined;
      if ((lat === undefined || isNaN(lat) || lng === undefined || isNaN(lng)) && p.mapLink) {
        const match = p.mapLink.match(/[?&]q=([\d.-]+),([\d.-]+)/);
        if (match) {
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
        }
      }

      if (lat === undefined || isNaN(lat) || lng === undefined || isNaN(lng)) {
        const addressCoordinates = {
          "الدقي": { lat: 30.0384, lng: 31.2101 },
          "التجمع": { lat: 30.0285, lng: 31.4913 },
          "مدينة نصر": { lat: 30.0612, lng: 31.3301 },
          "المعادي": { lat: 29.9602, lng: 31.2569 },
          "حلوان": { lat: 29.8414, lng: 31.3004 },
          "الشروق": { lat: 30.1261, lng: 31.6298 },
          "الرحاب": { lat: 30.0635, lng: 31.4918 },
          "مدينتي": { lat: 30.0825, lng: 31.6507 },
          "عين شمس": { lat: 30.1311, lng: 31.3308 },
          "المطرية": { lat: 30.1214, lng: 31.3128 },
          "الزمالك": { lat: 30.0626, lng: 31.2197 },
          "العبور": { lat: 30.2288, lng: 31.4754 },
          "شبرا": { lat: 30.0865, lng: 31.2451 },
          "المهندسين": { lat: 30.0545, lng: 31.2008 },
          "فيصل": { lat: 30.0131, lng: 31.2024 },
          "الهرم": { lat: 29.9928, lng: 31.1703 },
          "حدائق الأهرام": { lat: 29.9685, lng: 31.1227 },
          "الشيخ زايد": { lat: 30.0138, lng: 30.9756 },
          "أكتوبر": { lat: 29.9720, lng: 30.9440 },
          "أكتوبر الجديدة": { lat: 29.9387, lng: 30.8874 }
        };

        if (p.address) {
          const matchedKey = Object.keys(addressCoordinates).find(key => 
            p.address.includes(key) || key.includes(p.address)
          );
          if (matchedKey) {
            lat = addressCoordinates[matchedKey].lat;
            lng = addressCoordinates[matchedKey].lng;
          }
        }
      }

      if (lat === undefined || isNaN(lat)) lat = 30.0444; 
      if (lng === undefined || isNaN(lng)) lng = 31.2357; 

      const dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, lat, lng);
      const isOpen = p.status ? p.status === "مفتوح الآن" : (p.isOpen !== undefined ? p.isOpen : true);
      const hasParking = p.services ? p.services.includes("Parking") : (p.hasParking !== undefined ? p.hasParking : false);
      const is24h = p.services ? p.services.includes("24h") : (p.is24h !== undefined ? p.is24h : false);
      const hasDelivery = p.services ? p.services.includes("Delivery") : (p.hasDelivery !== undefined ? p.hasDelivery : false);
      return {
        ...p,
        lat,
        lng,
        distance: dist,
        isOpen,
        hasParking,
        is24h,
        hasDelivery
      };
    }).sort((a, b) => {
      const diff = a.distance - b.distance;
      return isNaN(diff) ? 0 : diff;
    });

    console.log("Processed Pharmacies (sorted):", sortedList.map(p => ({ name: p.name, distance: p.distance })));
    return sortedList;
  }, [pharmacies, userLocation]);

  const filteredPharmacies = useMemo(() => {
    return processedPharmacies.filter(pharmacy => {

      const matchesSearch = 
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.about.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedServices.openNow && !pharmacy.isOpen) return false;
      if (selectedServices.delivery && !pharmacy.hasDelivery) return false;
      if (selectedServices.is24h && !pharmacy.is24h) return false;
      if (selectedServices.parking && !pharmacy.hasParking) return false;

      if (selectedServices.onlyNearby && pharmacy.distance > 20) {
        const hasAnyNearby = processedPharmacies.some(p => p.distance <= 20);
        if (hasAnyNearby) {
          return false;
        }
      }

      return true;
    });
  }, [processedPharmacies, searchQuery, selectedServices]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const detectMyLocation = () => {
    if (navigator.geolocation) {
      triggerToast("جاري تحديد موقعك الحالي...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (lat < 22.0 || lat > 31.9 || lng < 24.0 || lng > 37.0) {
            triggerToast("موقعك الحالي خارج حدود جمهورية مصر العربية. يرجى اختيار موقع يدوي داخل مصر.");
            return;
          }

          let name = "موقعي الحالي";

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`
            );
            if (response.ok) {
              const data = await response.json();
              const addr = data.address;
              let displayName = "";
              if (addr) {
                const parts = [];
                if (addr.suburb || addr.neighbourhood) {
                  parts.push(addr.suburb || addr.neighbourhood);
                } else if (addr.road || addr.street) {
                  parts.push(addr.road || addr.street);
                }
                if (addr.city || addr.town || addr.village) {
                  parts.push(addr.city || addr.town || addr.village);
                } else if (addr.state) {
                  parts.push(addr.state);
                }
                displayName = parts.join("، ");
              }
              if (!displayName) {
                displayName = data.display_name.split(",").slice(0, 2).join("، ");
              }
              if (displayName) {
                name = displayName;
              }
            }
          } catch (e) {
            console.error("Reverse geocoding failed in detectMyLocation", e);
          }

          const newLoc = { lat, lng, name };
          setUserLocation(newLoc);
          setIsLocationConfirmed(true);
          localStorage.setItem("dawaya_user_location", JSON.stringify(newLoc));
          localStorage.setItem("dawaya_location_confirmed", "true");
          triggerToast(`تم تحديد موقعك الحالي بنجاح: ${name}`);
        },
        (error) => {
          console.error(error);
          triggerToast("تعذر تحديد موقعك. يرجى اختيار منطقة من القائمة.");
        }
      );
    } else {
      triggerToast("متصفحك لا يدعم تحديد الموقع التلقائي.");
    }
  };

  const handleLocationSelect = (value) => {
    if (value === "detect") {
      detectMyLocation();
      return;
    }
    if (value === "map") {
      setIsMapModalOpen(true);
      return;
    }
    const selected = predefinedLocations.find(loc => loc.name === value);
    if (selected) {
      setUserLocation(selected);
      setIsLocationConfirmed(true);
      localStorage.setItem("dawaya_user_location", JSON.stringify(selected));
      localStorage.setItem("dawaya_location_confirmed", "true");
      triggerToast(`تم تحويل الموقع إلى: ${selected.name}`);
    }
  };

  const scrollPartners = (direction) => {
    const container = partnersCarouselRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -250 : 250;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfdfe] text-slate-800 font-sans pb-24 selection:bg-[#1ab5ea]/20 selection:text-[#1ab5ea]">

      {!isLocationConfirmed && (
        <div 
          onClick={() => setIsMapModalOpen(true)}
          className="bg-[#d97706] hover:bg-[#b45309] text-white text-xs md:text-sm font-black py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors sticky top-0 z-40 select-none text-center shadow-md leading-relaxed"
        >
          <MapPin className="w-4 h-4 fill-white text-[#d97706] shrink-0" />
          <span>تحديد الموقع معطل. اضغط هنا لتفعيله قبل اختيار المنتجات</span>
        </div>
      )}

      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-[#1ab5ea]/12 via-[#1ab5ea]/4 to-transparent text-center px-4">

        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-10 left-10 w-2 h-2 bg-[#1ab5ea] rounded-full animate-ping duration-1000" />
          <div className="absolute top-20 right-1/4 w-3 h-3 bg-[#0ea5e9]/30 rounded-full animate-pulse duration-1000" />
          <div className="absolute bottom-10 left-1/3 w-2.5 h-2.5 bg-[#1ab5ea]/50 rounded-full animate-pulse duration-700" />
          <div className="absolute top-1/2 right-12 w-2 h-2 bg-[#1ab5ea] rounded-full animate-ping duration-1000" />
        </div>

        <div className="max-w-[800px] mx-auto relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-4xl font-black text-[#1e293b] mb-3 leading-snug tracking-arabic"
          >
            ابحث عن صيدليتك أو دواءك بسهولة
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 text-xs md:text-sm font-bold mb-8 md:mb-10 max-w-[500px] mx-auto leading-relaxed"
          >
            منصتك الذكية للوصول إلى كافة الخدمات الطبية ومستحضرات التجميل والأدوية في منطقتك
          </motion.p>

          <motion.form 
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-slate-100 p-2 rounded-2xl md:rounded-3xl shadow-xl shadow-[#1ab5ea]/5 flex flex-col md:flex-row items-center max-w-[750px] mx-auto mb-6 gap-2 md:gap-0"
          >
            <div className="relative flex-grow flex items-center w-full md:border-l md:border-slate-100 md:pl-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن صيدلية..."
                className="w-full bg-transparent border-none py-3 px-4 pr-12 text-xs md:text-sm text-slate-800 placeholder-slate-400 outline-none font-bold text-right"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#1ab5ea]" />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto px-4 py-2 shrink-0 justify-center md:justify-start">

              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="hover:scale-110 transition-transform cursor-pointer text-emerald-500 hover:text-emerald-600 shrink-0 p-1.5 hover:bg-slate-50 rounded-xl flex items-center justify-center border border-transparent hover:border-slate-100"
                title="تحديد من الخريطة"
              >
                <MapPin className="w-5 h-5 text-[#10B981]" />
              </button>

              <div className="flex items-center gap-1 relative">
                <span className="text-[10px] text-slate-400 font-extrabold whitespace-nowrap">موقعك:</span>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-[#1ab5ea] rounded-xl py-1.5 px-3 text-xs font-black text-slate-700 outline-none text-right cursor-pointer max-w-[170px] md:max-w-[200px] truncate flex items-center gap-1.5 select-none"
                  >
                    <span className="truncate text-right flex-grow">
                      {userLocation.name === "موقعي الحالي" ? " موقعي الحالي تلقائياً" : `${userLocation.name || "اختر موقعك..."}`}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>

                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl z-50 min-w-[220px] max-h-64 overflow-y-auto py-1 divide-y divide-slate-50 text-right font-bold text-xs"
                        >

                          <button
                            type="button"
                            onClick={() => {
                              handleLocationSelect("detect");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-right px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Compass className="w-4 h-4 text-[#1ab5ea]" />
                            <span>تحديد موقعي تلقائياً (GPS)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleLocationSelect("map");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-right px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <span>تحديد من الخريطة تفاعلياً...</span>
                          </button>

                          <div className="py-1">
                            {predefinedLocations.map((loc) => (
                              <button
                                key={loc.name}
                                type="button"
                                onClick={() => {
                                  handleLocationSelect(loc.name);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full text-right px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer ${
                                  userLocation.name === loc.name ? "text-[#1ab5ea] bg-[#1ab5ea]/5 font-black" : "text-slate-600"
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>{loc.name.split("،")[0]}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#1ab5ea] hover:bg-[#159ccb] text-white py-3 px-6 rounded-xl md:rounded-2xl transition-all font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#1ab5ea]/10 w-full md:w-auto shrink-0 cursor-pointer"
            >
              <span>البحث</span>
            </button>
          </motion.form>

          <div className="flex justify-center gap-6 text-[10px] md:text-xs font-bold text-slate-500 mt-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#1ab5ea]" /> صيدليات معتمدة</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#0ea5e9]" /> خدمة على مدار الساعة</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-500" /> رعاية صحية مبتكرة</span>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 mt-4">

        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-8">
          <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5 ml-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1ab5ea]" />
            تصفية النتائج:
          </span>

          <button
            onClick={() => handleFilterToggle("onlyNearby")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
              selectedServices.onlyNearby
                ? "bg-[#1ab5ea] text-white border-transparent shadow-sm shadow-[#1ab5ea]/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#1ab5ea]/30 hover:bg-slate-50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${selectedServices.onlyNearby ? "bg-white" : "bg-[#1ab5ea]"}`} />
            <span> قريبة مني (تغطية موقعي)</span>
          </button>

          <button
            onClick={() => handleFilterToggle("openNow")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
              selectedServices.openNow
                ? "bg-[#1ab5ea] text-white border-transparent shadow-sm shadow-[#1ab5ea]/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#1ab5ea]/30 hover:bg-slate-50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${selectedServices.openNow ? "bg-white" : "bg-emerald-500"}`} />
            <span>مفتوح الآن</span>
          </button>

          <button
            onClick={() => handleFilterToggle("delivery")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
              selectedServices.delivery
                ? "bg-[#1ab5ea] text-white border-transparent shadow-sm shadow-[#1ab5ea]/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#1ab5ea]/30 hover:bg-slate-50"
            }`}
          >
            <span> خدمة توصيل</span>
          </button>

          <button
            onClick={() => handleFilterToggle("is24h")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
              selectedServices.is24h
                ? "bg-[#1ab5ea] text-white border-transparent shadow-sm shadow-[#1ab5ea]/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#1ab5ea]/30 hover:bg-slate-50"
            }`}
          >
            <span> طوال 24 ساعة</span>
          </button>

          <button
            onClick={() => handleFilterToggle("parking")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
              selectedServices.parking
                ? "bg-[#1ab5ea] text-white border-transparent shadow-sm shadow-[#1ab5ea]/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#1ab5ea]/30 hover:bg-slate-50"
            }`}
          >
            <span> موقف سيارات</span>
          </button>

          {(selectedServices.openNow || selectedServices.delivery || selectedServices.is24h || selectedServices.parking || !selectedServices.onlyNearby || searchQuery) && (
            <button
              onClick={() => {
                setSelectedServices({ openNow: false, delivery: false, is24h: false, parking: false, onlyNearby: true });
                setSearchQuery("");
              }}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold mr-2 border-b border-dashed border-slate-300 hover:border-slate-500 pb-0.5"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col gap-1 text-right">
            <h2 className="text-base font-black text-[#1e293b] flex items-center gap-2">
              <span className="w-1.5 h-4.5 rounded-full bg-gradient-to-b from-[#1ab5ea] to-[#0ea5e9]" />
              لوحة الصيدليات القريبة منك
            </h2>
            <p className="text-[11px] text-slate-400 font-bold">مرتبة حسب الأقرب إلى موقعك الحالي ({userLocation.name})</p>
          </div>
          <span className="text-xs text-[#1ab5ea] bg-[#1ab5ea]/5 border border-[#1ab5ea]/10 py-1.5 px-3.5 rounded-xl font-extrabold self-start sm:self-auto">عرض {filteredPharmacies.length} صيدلية قريبة</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#1ab5ea] animate-spin" />
            <span className="text-xs font-bold text-slate-500">جاري تحميل الصيدليات من الخادم...</span>
          </div>
        ) : filteredPharmacies.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-2">لا توجد صيدليات متوفرة</h3>
            <p className="text-xs text-slate-500 leading-relaxed">لم نجد أي صيدلية تطابق فلاتر الخدمة أو اسم البحث المدخل.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPharmacies.map(pharmacy => (
              <PharmacyCard
                key={pharmacy.id || pharmacy._id}
                pharmacy={pharmacy}
                onViewDetails={() => setSelectedPharmacy(pharmacy)}
              />
            ))}
          </div>
        )}
      </section>

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
                    <img src={selectedPharmacy.image || selectedPharmacy.logo} alt={selectedPharmacy.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 bg-white/95 px-3 py-1 rounded-xl shadow-sm leading-snug">
                      {selectedPharmacy.name}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-12 flex-grow">

                <div className="flex items-center gap-3 mb-4 text-[10px] font-black">
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
                  <h3 className="text-xs font-black text-slate-900 mb-1.5">حول الصيدلية:</h3>
                  <p className="text-xs text-slate-500 leading-relaxed text-right">{selectedPharmacy.about}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3.5 mb-6">
                  <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                    <MapPin className="w-4 h-4 text-[#1ab5ea]" />
                    <span>{selectedPharmacy.address}</span>
                  </div>

                  {modalTravelTime && (
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                      <Clock className="w-4 h-4 text-[#1ab5ea]" />
                      <span>{modalTravelTime.travelTimeText} (المسافة: {modalTravelTime.formattedDistance})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                    <Phone className="w-4 h-4 text-[#1ab5ea]" />
                    <span>الخط الساخن: {selectedPharmacy.phone}</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {selectedPharmacy.hasDelivery && (
                      <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-xl"> خدمة توصيل للمنزل</span>
                    )}
                    {selectedPharmacy.hasParking && (
                      <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-xl"> موقف سيارات خاص</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <a
                    href={`https://wa.me/${selectedPharmacy.whatsapp || (selectedPharmacy.phone && selectedPharmacy.phone.startsWith("0") ? "20" + selectedPharmacy.phone.slice(1) : selectedPharmacy.phone) || ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] text-xs"
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>طلب بالواتساب</span>
                  </a>

                  <button
                    onClick={() => {
                      triggerToast("تم نسخ الهاتف الساخن!");
                      navigator.clipboard.writeText(selectedPharmacy.phone);
                    }}
                    className="flex-1 bg-[#1ab5ea] hover:bg-[#159ccb] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#1ab5ea]/10 active:scale-[0.98] text-xs"
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

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-6 z-50 bg-slate-900/95 text-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800 text-xs font-bold"
          >
            <div className="w-5 h-5 rounded-full bg-[#1ab5ea] flex items-center justify-center text-white text-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export function PharmacyCard({ pharmacy, onViewDetails }) {

  const distance = pharmacy.distance;
  const isNearby = distance < 1.0;

  const formattedDistance = distance < 1.0 
    ? `${Math.round(distance * 1000)}m` 
    : `${distance.toFixed(1)} KM`;

  const travelTimeText = distance < 1.0
    ? ` مشياً: ${Math.round(distance * 15)} دقيقة`
    : ` بالسيارة: ${Math.round(distance * 4)} دقيقة`;

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`bg-white border border-slate-100 hover:border-[#1ab5ea]/30 rounded-[24px] p-5 flex flex-col justify-between h-[330px] transition-all duration-300 relative group ${
        isNearby 
          ? "shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.06)]" 
          : "shadow-md shadow-slate-100/40 hover:shadow-xl hover:shadow-slate-200/40"
      }`}
    >

      <div className="flex flex-col items-center justify-center pt-2 mb-4 relative">

        {isNearby && (
          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black px-2.5 py-0.5 rounded-full absolute -top-1.5 shadow-sm shadow-emerald-500/5 animate-pulse z-10">
             الأقرب إليك
          </span>
        )}

        <div className="relative">

          {isNearby && (
            <div className="absolute -inset-1 rounded-full bg-emerald-400/20 animate-ping blur-sm" />
          )}

          <div 
            className={`w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border transition-all duration-300 relative overflow-hidden ${
              isNearby 
                ? "border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-4 ring-emerald-500/5 scale-105 group-hover:scale-110" 
                : "border-slate-100 shadow-inner group-hover:scale-105"
            }`}
          >
            <img 
              src={pharmacy.image || pharmacy.logo} 
              alt={pharmacy.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=صيدلية";
              }}
            />
          </div>

          <span dir="ltr" className={`absolute -top-1.5 -right-2 px-2.5 py-0.5 rounded-full text-[9px] font-black shadow-md flex items-center gap-0.5 z-10 border text-white ${
            isNearby 
              ? "bg-emerald-500 border-emerald-400" 
              : "bg-[#1ab5ea] border-[#1ab5ea]/40"
          }`}>
            <MapPin className="w-2.5 h-2.5 fill-current" />
            <span>{formattedDistance}</span>
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-extrabold mt-2.5 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
          {travelTimeText}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-3">

        <div className="flex-grow min-w-0 flex flex-col gap-1 text-right">
          <h3 className="text-sm md:text-base font-black text-[#1e293b] leading-snug group-hover:text-[#1ab5ea] transition-colors truncate">
            {pharmacy.name}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#1ab5ea] shrink-0" />
            <span className="truncate">{pharmacy.address}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${pharmacy.isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span className={`text-[10px] font-black ${pharmacy.isOpen ? "text-emerald-500" : "text-rose-500"}`}>
              {pharmacy.isOpen ? "مفتوح الآن" : "مغلق حالياً"}
            </span>
          </div>
        </div>

        <div dir="ltr" className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 py-1.5 px-3 rounded-full text-xs font-black shrink-0 shadow-sm shadow-amber-500/5">
          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
          <span>{pharmacy.rating}</span>
        </div>
      </div>

      <div>

        <button
          onClick={onViewDetails}
          className="w-full bg-[#f0faff] hover:bg-[#1ab5ea] hover:text-white border border-[#1ab5ea]/30 text-[#1ab5ea] font-bold py-2.5 rounded-full text-center text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:shadow-[#1ab5ea]/15 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Eye className="w-4 h-4 shrink-0" />
          <span>عرض التفاصيل</span>
        </button>
      </div>
    </motion.div>
  );
}

export function MapModal({ initialLocation, onConfirm, onClose }) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedLoc, setSelectedLoc] = useState(initialLocation);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialLocation.name);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCoordsChange = React.useCallback(async (lat, lng) => {
    setSelectedLoc((prev) => ({ ...prev, lat, lng }));
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      if (response.ok) {
        const data = await response.json();
        const addr = data.address;
        let displayName = "";
        if (addr) {
          const parts = [];
          if (addr.suburb || addr.neighbourhood) {
            parts.push(addr.suburb || addr.neighbourhood);
          } else if (addr.road || addr.street) {
            parts.push(addr.road || addr.street);
          }

          if (addr.city || addr.town || addr.village) {
            parts.push(addr.city || addr.town || addr.village);
          } else if (addr.state) {
            parts.push(addr.state);
          }

          displayName = parts.join("، ");
        }
        if (!displayName) {
          displayName =
            data.display_name.split(",").slice(0, 2).join("، ") ||
            "موقع مخصص من الخريطة";
        }
        setSelectedLoc({ lat, lng, name: displayName });
        setSearchQuery(displayName);
      }
    } catch (error) {
      console.error("Geocoding failed", error);
      setSelectedLoc({ lat, lng, name: "موقع مخصص من الخريطة" });
      setSearchQuery("موقع مخصص من الخريطة");
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (latitude < 22.0 || latitude > 31.9 || longitude < 24.0 || longitude > 37.0) {
            alert("موقعك الحالي خارج حدود جمهورية مصر العربية. يرجى اختيار موقع داخل مصر.");
            return;
          }

          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          }
          await handleCoordsChange(latitude, longitude);
        },
        (error) => {
          console.error("GPS detection failed inside MapModal:", error);
          alert("تعذر تحديد موقعك الحالي عبر الـ GPS. يرجى تفعيل إذن الوصول للموقع في متصفحك.");
        }
      );
    } else {
      alert("متصفحك لا يدعم تحديد الموقع التلقائي.");
    }
  };

  React.useEffect(() => {
    let isMounted = true;
    const loadLeaflet = () => {
      if (window.L) {
        if (isMounted) setLeafletLoaded(true);
        return;
      }

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.onload = () => {
          if (isMounted) setLeafletLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        const checkL = setInterval(() => {
          if (window.L) {
            clearInterval(checkL);
            if (isMounted) setLeafletLoaded(true);
          }
        }, 100);
      }
    };

    loadLeaflet();
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = window.L;

    const egyptSouthWest = L.latLng(22.0, 24.0);
    const egyptNorthEast = L.latLng(31.9, 37.0);
    const egyptBounds = L.latLngBounds(egyptSouthWest, egyptNorthEast);

    let initLat = selectedLoc.lat;
    let initLng = selectedLoc.lng;
    if (initLat < 22.0 || initLat > 31.9 || initLng < 24.0 || initLng > 37.0) {
      initLat = 30.0444; 
      initLng = 31.2357; 
    }

    const map = L.map(mapContainerRef.current, {
      center: [initLat, initLng],
      zoom: 14,
      zoomControl: false,
      maxBounds: egyptBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 6,
    });

    mapRef.current = map;
    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(
      "https://{s}.google.com/vt/lyrs=m&hl=ar&x={x}&y={y}&z={z}",
      {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
        maxZoom: 20,
      }
    ).addTo(map);

    const customIcon = L.divIcon({
      html: `<div class="flex items-center justify-center">
        <div class="relative flex items-center justify-center">
          <!-- Outer transparent green circle -->
          <div class="absolute w-12 h-12 rounded-full bg-emerald-400/20 border border-emerald-400/30"></div>
          <!-- Inner green pin with white center dot -->
          <div class="w-6 h-6 rounded-full bg-[#10B981] border-2 border-white shadow-md flex items-center justify-center relative z-10">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>`,
      className: "custom-leaflet-icon",
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const marker = L.marker([initLat, initLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      handleCoordsChange(pos.lat, pos.lng);
    });

    map.on("click", (e) => {
      marker.setLatLng(e.latlng);
      handleCoordsChange(e.latlng.lat, e.latlng.lng);
    });

    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    return () => {
      map.remove();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [leafletLoaded, handleCoordsChange]);

  React.useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    if (searchQuery === selectedLoc.name) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            searchQuery.trim()
          )}&accept-language=ar&limit=5&countrycodes=eg`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedLoc.name]);

  const handleMapSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          searchQuery.trim()
        )}&accept-language=ar&limit=5&countrycodes=eg`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        if (data.length > 0) {
          selectSearchResult(data[0]);
        }
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (lat < 22.0 || lat > 31.9 || lng < 24.0 || lng > 37.0) {
      alert("الموقع المحدد خارج حدود مصر. يرجى اختيار موقع داخل مصر.");
      return;
    }

    if (mapRef.current) {
      if (result.boundingbox) {
        const L = window.L;
        const bbox = result.boundingbox;
        const southWest = L.latLng(parseFloat(bbox[0]), parseFloat(bbox[2]));
        const northEast = L.latLng(parseFloat(bbox[1]), parseFloat(bbox[3]));

        const clampedSW = L.latLng(
          Math.max(22.0, southWest.lat),
          Math.max(24.0, southWest.lng)
        );
        const clampedNE = L.latLng(
          Math.min(31.9, northEast.lat),
          Math.min(37.0, northEast.lng)
        );
        mapRef.current.fitBounds(L.latLngBounds(clampedSW, clampedNE));
      } else {
        mapRef.current.setView([lat, lng], 15);
      }
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    let displayName = result.display_name.split(",").slice(0, 2).join("، ");
    setSelectedLoc({ lat, lng, name: displayName });
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        .custom-leaflet-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          font-family: 'Cairo', sans-serif !important;
        }
        .leaflet-container :focus {
          outline: none !important;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(0,0,0,0.1) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          border-radius: 12px !important;
          overflow: hidden;
          margin-bottom: 24px !important;
          margin-right: 16px !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background-color: white !important;
          color: #334155 !important;
          border: none !important;
        }
        .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
          background-color: #f1f5f9 !important;
          color: #1ab5ea !important;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-[650px] h-[80vh] md:h-[75vh] rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-100 flex flex-col"
      >

        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors text-slate-500 border border-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-sm md:text-base font-black text-slate-800">
            اختر موقع التوصيل
          </h3>
          <div className="w-8 h-8" /> 
        </div>

        <div className="bg-[#fef3c7] border-b border-[#fde68a] text-[#78350f] px-4 py-3 flex items-start gap-2.5 text-xs font-bold text-right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="leading-relaxed">لأفضل تجربة، تحتاج لتحديد موقعك لنعرض لك المنتجات المتاحة بالقرب منك</span>
        </div>

        <div className="flex-grow relative flex flex-col min-h-0">

          <div className="absolute top-4 right-4 left-4 z-[9999] max-w-md">
            <form onSubmit={handleMapSearch} className="relative shadow-md rounded-xl overflow-hidden border border-slate-100 bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="اكتب عنوانك بالكامل"
                className="w-full bg-white text-xs text-slate-800 placeholder-slate-400 outline-none font-bold py-3 pr-10 pl-14 text-right border-none"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1ab5ea] hover:bg-[#159ccb] text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {isSearching ? "بحث..." : "ابحث"}
              </button>
            </form>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl z-[10000] max-h-48 overflow-y-auto divide-y divide-slate-50 text-right font-bold text-xs"
                >
                  {searchResults.map((res, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSearchResult(res)}
                      className="w-full text-right py-2.5 px-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between text-slate-700"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#1ab5ea] shrink-0" />
                      <span className="truncate pr-2">{res.display_name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!leafletLoaded && (
            <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-[300] gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#1ab5ea] animate-spin" />
              <span className="text-xs font-bold text-slate-500">جاري تحميل خريطة الموقع...</span>
            </div>
          )}

          <div ref={mapContainerRef} className="w-full h-full min-h-[250px] bg-slate-50 flex-grow" />

          {leafletLoaded && (
            <button
              type="button"
              onClick={handleLocateMe}
              className="absolute bottom-20 left-4 z-[9999] w-12 h-12 bg-white hover:bg-slate-50 text-slate-700 rounded-full shadow-lg border border-slate-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="تحديد موقعي الحالي بدقة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#1ab5ea]">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="1" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="23" />
                <line x1="1" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="23" y2="12" />
              </svg>
            </button>
          )}

          <div className="bg-white border-t border-slate-100 p-4 relative z-[400] flex items-center justify-between gap-4">

            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-slate-50 border-2 border-slate-700 text-slate-700 rounded-xl px-7 py-2.5 font-black text-xs transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <div className="hidden sm:flex flex-col text-right max-w-xs truncate pl-2">
              <span className="text-[10px] text-slate-400 font-extrabold block"> العنوان المختار:</span>
              <span className="text-xs font-black text-slate-700 truncate">
                {isGeocoding ? "جاري تحديد العنوان..." : selectedLoc.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onConfirm(selectedLoc)}
              disabled={isGeocoding}
              className={`rounded-xl px-7 py-2.5 font-black text-xs transition-all cursor-pointer ${
                isGeocoding 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                  : "bg-[#1ab5ea] hover:bg-[#159ccb] text-white shadow-md shadow-[#1ab5ea]/15"
              }`}
            >
              تأكيد الموقع
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
