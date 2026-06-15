import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { value: '500+', label: 'صيدلية شريكة' },
    { value: '50k+', label: 'عميل سعيد' },
    { value: '24/7', label: 'دعم على مدار الساعة' },
    { value: '30min', label: 'توصيل سريع' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;