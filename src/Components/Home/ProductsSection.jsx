import React, { useState, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaChevronRight, FaChevronLeft, FaHeart, FaTrash ,FaArrowLeft} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { FavoritesContext } from '../../Context/FavoritesContext';
import { UserContext } from '../../Context/UserContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const { cartItems, addToCart, removeFromCart, setShowLoginModal } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { userLogin } = useContext(UserContext);

  const handleCartToggle = (product) => {
    if (!userLogin) {
      setShowLoginModal(true);
      return;
    }
    const isAdded = cartItems.some((item) => String(item.id) === String(product._id));
    if (isAdded) {
      removeFromCart(product._id);
      setToastMessage("تم إزالة المنتج من سلة المشتريات.");
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        brand: product.manufacturer || product.genericName || 'عام',
        image: product.images?.[0]
      }, 1);
      setToastMessage("تم إضافة المنتج إلى سلة المشتريات بنجاح!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleFavoriteToggle = (product) => {
    if (!userLogin) {
      setShowLoginModal(true);
      return;
    }
    toggleFavorite({
      id: product._id,
      name: product.name,
      price: product.price,
      brand: product.manufacturer || product.genericName || 'عام',
      image: product.images?.[0]
    });
  };

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
    <section id="products-section" className="py-24 bg-gradient-to-br from-blue-50 to-white">
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
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{ nextEl: '.next-btn', prevEl: '.prev-btn' }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{ delay: 5000 }}
            breakpoints={{ 
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 25 },
              1024: { slidesPerView: 4, spaceBetween: 30 }
            }}
            className="pb-14"
          >
            {products.map(product => (
              <SwiperSlide key={product._id}>
                <motion.div 
                  whileHover={{ y: -10 }} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                      <img 
                        src={product.images?.[0]} 
                        alt={product.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400';
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFavoriteToggle(product);
                        }}
                        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-red-500 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
                      >
                        <FaHeart className={isFavorite(product._id) ? "text-red-500 fill-current" : "text-gray-400"} />
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  
                  <div className="p-5">
                    <Link to={`/product/${product._id}`} className="hover:text-blue-600 transition-colors block mb-2">
                      <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(4)].map((_, i) => <FaStar key={i} className="h-3.5 w-3.5 fill-current" />)}
                        <FaStar className="h-3.5 w-3.5 text-gray-300" />
                      </div>
                      <span className="text-xs text-gray-400">(128)</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mb-4">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                        <span className="text-sm text-gray-500 mr-1">ج.م</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleCartToggle(product)}
                      className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
                        cartItems.some((item) => String(item.id) === String(product._id))
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {cartItems.some((item) => String(item.id) === String(product._id)) ? (
                        <>
                          <FaTrash className="h-4 w-4" />
                          <span>إزالة من السلة</span>
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="h-4 w-4" />
                          <span>أضف إلى السلة</span>
                        </>
                      )}
                    </button>
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

        {}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="group bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 px-8 py-3 rounded-full font-semibold text-lg inline-flex items-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105">
            <span>عرض جميع المنتجات</span>
            <FaArrowLeft className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {toastMessage && (
        <div className="product-toast-notification success animate-fade-in" style={{ background: toastMessage.includes('إزالة') ? '#ef4444' : '', borderColor: toastMessage.includes('إزالة') ? '#dc2626' : '' }}>
          {toastMessage.includes('إزالة') ? <FaTrash size={16} /> : <FaShoppingCart size={16} />}
          <span>{toastMessage}</span>
        </div>
      )}

      <style jsx>{`
        .swiper-pagination-bullet {
          background: #3B82F6 !important;
          opacity: 0.4 !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s !important;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default ProductsSection;