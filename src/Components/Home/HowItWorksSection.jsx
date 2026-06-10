// src/components/HowItWorksSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaSearch, FaClipboardList, FaTruck, FaSmile } from 'react-icons/fa';

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const steps = [
    { icon: FaSearch, title: 'ابحث عن منتجك', description: 'ابحث عن الدواء أو المنتج الذي تحتاجه' },
    { icon: FaClipboardList, title: 'أضف للسلة', description: 'أضف المنتجات إلى سلة التسوق' },
    { icon: FaTruck, title: 'أكمل الدفع', description: 'اختر طريقة الدفع وأكمل الطلب' },
    { icon: FaSmile, title: 'استلم طلبك', description: 'استلم طلبك في أسرع وقت' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">كيف يعمل؟</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            أربع خطوات بسيطة لطلب أدويتك
          </p>
        </motion.div>

        <div ref={ref} className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-10 hidden w-4/5 -translate-x-1/2 text-2xl text-gray-300 md:block">
                    →
                  </div>
                )}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <IconComponent className="h-10 w-10" />
                </div>
                <div className="mt-4 text-xl font-semibold text-gray-900">
                  {step.title}
                </div>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;