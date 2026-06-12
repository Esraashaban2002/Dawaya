// src/components/ServicesSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaTruck, FaPills, FaClipboardList, FaHeadset } from 'react-icons/fa';

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const services = [
    { icon: FaTruck, title: 'توصيل سريع', description: 'توصيل مجاني خلال 30 دقيقة' },
    { icon: FaPills, title: 'أدوية أصلية', description: 'جميع الأدوية أصلية ومصرح بها' },
    { icon: FaClipboardList, title: 'استشارات طبية', description: 'استشارات مجانية مع صيادلة مؤهلين' },
    { icon: FaHeadset, title: 'دعم على مدار الساعة', description: 'فريق دعم جاهز لمساعدتك 24/7' },
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
            نقدم مجموعة متكاملة من الخدمات الصحية
          </p>
        </motion.div>

        <div ref={ref} className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group rounded-2xl bg-white p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;