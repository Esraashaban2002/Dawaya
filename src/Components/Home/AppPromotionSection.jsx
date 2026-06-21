import React from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaChartLine, FaTruck, FaArrowLeft } from 'react-icons/fa';

const AppPromotionSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-7xl">

        { }
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            شراكة موثوقة
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            كن شريكاً مع دوایا
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            انضم إلى شبكة دوایا وكن جزءاً من أكبر منصة رقمية للصيدليات في مصر
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          { }
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            { }
            <div className="relative flex justify-center">
              <div className="relative transform rotate-6 hover:rotate-3 transition-all duration-500">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-[3rem] blur-xl"></div>

                <div className="relative w-[300px] sm:w-[340px] h-[600px] sm:h-[640px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-gray-800">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-xl z-20"></div>

                  <div className="relative w-full h-full pt-8">
                    <img
                      src="/imges/center/Map.png"
                      alt="لوحة تحكم دوایا"
                      className="w-full h-full object-cover"
                    />

                    { }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    { }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    <div className="absolute bottom-24 left-2 right-2 bg-white rounded-xl p-3 shadow-xl mx-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-800">طلبات اليوم</span>
                        <span className="text-xs text-green-600">+23%</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">48</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          { }


          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-right flex flex-col justify-center"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900  mb-6" >
                نمي صيدليتك مع دوایا
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                تواصل مع آلاف العملاء المحليين من خلال لوحة إدارة صيدليات متطورة.
              </p>

              { }
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 justify-end bg-white/50 rounded-xl p-3 max-w-md mx-auto">
                  <span className="text-gray-700">لوحة تحكم متطورة</span>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaStore className="text-blue-600 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end bg-white/50 rounded-xl p-3 max-w-md mx-auto">
                  <span className="text-gray-700">تحليلات فورية للمبيعات</span>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaChartLine className="text-blue-600 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end bg-white/50 rounded-xl p-3 max-w-md mx-auto">
                  <span className="text-gray-700">إدارة المخزون ذكياً</span>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaTruck className="text-blue-600 text-sm" />
                  </div>
                </div>
              </div>

              { }
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  عرض المميزات
                </button>
                <button className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105">
                  ابدأ اليوم
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppPromotionSection;