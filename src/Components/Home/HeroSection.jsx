import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: "https://www.kin.es/wp-content/uploads/2025/04/Cabeceras_BlogFarmacias.jpg", // نمو رقمي
      title: "نمكن الصيدليات من النمو الرقمي",
      subtitle: "حلول رقمية ذكية لزيادة المبيعات"
    },
    {
      image: "/imges/HeroImage/DriveFast.png", // توصيل سريع
      title: "توصيلات سريعة",
      subtitle: "وصل طلبك في أقل من ساعة"
    },
    {
      image: "/imges/HeroImage/Medicine.png", // نواقص الأدوية
      title: "نوفر نواقص الأدوية",
      subtitle: "منصة ذكية لتأمين احتياجات صيدليتك"
    },
   
    {
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=600&fit=crop", // صيدلية حديثة
      title: "صيدليتك الذكية",
      subtitle: "إدارة متكاملة للمخزون والطلبات"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/*  Small cards */}
          <div className="order-2 lg:order-1 lg:w-[38%] flex flex-col gap-6">
            <div 
              onClick={() => navigate('/prescription')}
              className="bg-white rounded-[30px] p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-50 p-4 rounded-2xl mb-6 group-hover:scale-110 transition duration-300">
                  <FaCloudUploadAlt className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">رفع الروشتة</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">قم بمسح وإرسال روشتة الطبية بسرعة لصرفها بشكل موثوق</p>
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md cursor-pointer inline-block"
                >
                  اختر ملف
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        navigate('/prescription', { state: { file } });
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div 
              onClick={() => navigate('/reminders')}
              className="bg-white rounded-[30px] p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-50 p-4 rounded-2xl mb-6 group-hover:scale-110 transition duration-300">
                  <FaWhatsapp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition">تذكيرات واتساب</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">احصل على تذكيرات تفاعلية للجرعات وتحديثات الطلبات مباشرة على واتساب</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/reminders');
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-all duration-300 shadow-md"
                >
                  تفعيل الآن
                </button>
              </div>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="order-1 lg:order-2 lg:w-[62%]">
            <div className="relative rounded-[30px] overflow-hidden shadow-2xl" style={{ minHeight: '560px', height: '100%' }}>
              
              {/* Background Image Slider */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].title}
                    className="w-full h-full object-Contain object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Content */}
              <div className="absolute inset-0 z-10 flex flex-col items-end justify-center px-8 md:px-12 lg:px-10">
                <div className="max-w-md text-right w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                        {slides[currentIndex].title}
                      </h2>
                      <p className="text-white/90 text-base md:text-lg leading-relaxed">
                        {slides[currentIndex].subtitle}
                      </p>
                       <div className="flex flex-wrap gap-4 justify-end pt-6">
                        <button 
                          onClick={() => navigate('/#products-section')}
                          className="px-8 py-3.5 bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-full font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          اطلب الآن
                        </button>
                        <button 
                          onClick={() => navigate('/about')}
                          className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-sm border-2 border-white/40 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                        >
                          اعرف المزيد
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex 
                        ? 'w-10 h-2 bg-white' 
                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;