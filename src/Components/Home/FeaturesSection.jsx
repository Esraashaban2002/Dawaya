// src/components/FeaturesSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaShieldAlt, FaClock, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    { icon: FaShieldAlt, title: 'آمن وموثوق', description: 'منتجات أصلية ومضمونة' },
    { icon: FaClock, title: 'توصيل سريع', description: 'في أقل من 30 دقيقة' },
    { icon: FaMoneyBillWave, title: 'أسعار منافسة', description: 'خصومات تصل إلى 50%' },
    { icon: FaHeadset, title: 'دعم فني', description: 'فريق متخصص على مدار الساعة' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">لماذا تختارنا؟</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            نقدم لك أفضل تجربة صحية
          </p>
        </motion.div>

        <div ref={ref} className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all duration-300"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;