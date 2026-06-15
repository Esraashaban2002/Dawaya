// src/components/CTASection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            استعد لصحة أفضل
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            انضم إلى آلاف العملاء الذين يثقون بنا
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-3 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              سجل الآن
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-transparent text-white rounded-full font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              اتصل بنا
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;