import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaChevronRight, FaChevronLeft, FaArrowLeft } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = useLocation().pathname;

  useEffect(() => {
    fetch('https://dawaya-back-end.vercel.app/api/medicines')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">أفضل المنتجات</h2>
        <div className="mt-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">أفضل المنتجات</h2>
          <p className="text-gray-500 text-lg">اكتشف المنتجات الأكثر مبيعاً</p>
        </motion.div>

        <div className="relative px-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{ nextEl: '.next-btn', prevEl: '.prev-btn' }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 25 },
              1024: { slidesPerView: 4, spaceBetween: 30 }
            }}
            className="pb-0"
          >
            {products.map(product => (
              <SwiperSlide key={product._id}>
                <motion.div 
                  whileHover={{ y: -10 }} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                    <img 
                      src={product.images?.[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(4)].map((_, i) => <FaStar key={i} className="h-3.5 w-3.5 fill-current" />)}
                        <FaStar className="h-3.5 w-3.5 text-gray-300" />
                      </div>
                      <span className="text-xs text-gray-400">(128)</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                        <span className="text-sm text-gray-500 mr-1">ج.م</span>
                      </div>
                      <button className="bg-blue-600 p-2.5 rounded-xl text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                        <FaShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="prev-btn absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all text-blue-600 hidden lg:flex items-center justify-center w-12 h-12 hover:bg-blue-600 hover:text-white group">
            <FaChevronLeft className="h-5 w-5 group-hover:scale-110 transition" />
          </button>
          <button className="next-btn absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all text-blue-600 hidden lg:flex items-center justify-center w-12 h-12 hover:bg-blue-600 hover:text-white group">
            <FaChevronRight className="h-5 w-5 group-hover:scale-110 transition" />
          </button>
        </div>

        {/* زر عرض جميع المنتجات */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/products"
            className={`inline-flex items-center gap-2 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:shadow-xl transform hover:scale-105 ${
              pathname === "/products" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <span>عرض جميع المنتجات</span>
            <FaArrowLeft className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;