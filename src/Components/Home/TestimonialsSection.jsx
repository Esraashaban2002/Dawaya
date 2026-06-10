// src/components/Home/TestimonialsSection.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaQuoteRight, FaStar, FaUserCircle } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestimonialsSection = () => {
  // تعريف البيانات هنا مباشرة
  const testimonials = [
    {
      name: "أحمد محمد",
      role: "عميل",
      text: "خدمة ممتازة وسريعة جداً. الطلب وصل في أقل من نصف ساعة. أنصح الجميع بتجربة هذه المنصة.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "سارة خالد",
      role: "عميلة",
      text: "منتج أصلي وأسعار منافسة. فريق الدعم متعاون جداً وساعدني في اختيار الدواء المناسب.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      name: "محمد علي",
      role: "عميل",
      text: "تجربة رائعة وسهلة. التطبيق سهل الاستخدام والدفع آمن. شكراً لكم.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">آراء عملائنا</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">ماذا يقول عملاؤنا عنا</p>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000 }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div whileHover={{ y: -5 }} className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`h-3 w-3 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <FaQuoteRight className="h-8 w-8 text-blue-200 mb-3" />
                <p className="text-gray-600 leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;