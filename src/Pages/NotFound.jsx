// src/pages/NotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowRight, FaStore } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className=" flex items-center justify-center px-4 my-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="mb-6">
          <h1 className="text-4xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            404
          </h1>
        </div>

        {/* النص */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            عفواً! الصفحة غير متوفرة
          </h2>
          <p className="text-gray-500 text-sm">
            يبدو أنك تبحث عن شيء غير موجود
          </p>
        </div>

        {/* روابط سريعة
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <Link to="/" className="text-blue-600 hover:underline">الرئيسية</Link>
            <span className="text-gray-300">•</span>
            <Link to="/products" className="text-blue-600 hover:underline">المنتجات</Link>
            <span className="text-gray-300">•</span>
            <Link to="/contact" className="text-blue-600 hover:underline">اتصل بنا</Link>
          </div>
        </div> */}

        {/* أزرار */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            <FaHome className="h-3.5 w-3.5" />
            <span>الرئيسية</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300"
          >
            <FaArrowRight className="h-3.5 w-3.5" />
            <span>رجوع</span>
          </button>
        </div>

        {/* عبارة */}
        <p className="text-gray-400 text-xs mt-6">
          🫀 نهتم بصحتك
        </p>
      </motion.div>
    </section>
  );
};

export default NotFound;