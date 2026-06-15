import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100 border border-slate-100 max-w-md w-full text-center flex flex-col items-center gap-6"
      >
        {/* Animated Icon Circle */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-rose-100/50 rounded-full animate-ping opacity-75 duration-1000" style={{ animationDuration: "3s" }} />
          <div className="relative w-20 h-20 bg-gradient-to-br from-rose-50 to-rose-100/80 text-rose-500 rounded-full flex items-center justify-center border border-rose-200 shadow-inner">
            <FileQuestion className="w-10 h-10" />
          </div>
        </div>

        {/* 404 & Title */}
        <div className="flex flex-col gap-2">
          <span className="text-4xl font-extrabold text-rose-500 tracking-wider">404</span>
          <h1 className="text-xl font-black text-slate-800">الصفحة غير موجودة</h1>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير متوفرة حالياً، ربما تم نقلها أو حذفها نهائياً. يرجى التحقق من الرابط أو العودة للرئيسية.
        </p>

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
    </div>
  );
}
