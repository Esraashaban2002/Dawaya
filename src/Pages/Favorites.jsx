import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Trash2, ArrowRight, 
  ShoppingBag, Check, AlertCircle 
} from 'lucide-react';
import { FavoritesContext } from '../Context/FavoritesContext';
import { CartContext } from '../Context/CartContext';
import { UserContext } from '../Context/UserContext';

export default function Favorites() {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);
  const { cartItems, addToCart, removeFromCart, setShowLoginModal } = useContext(CartContext);
  const { userLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    if (!userLogin) {
      setShowLoginModal(true);
      return;
    }
    const isAdded = cartItems.some((cItem) => String(cItem.id) === String(item.id));
    if (isAdded) {
      removeFromCart(item.id);
      triggerToast(`تم إزالة ${item.name.substring(0, 20)}... من سلة المشتريات.`, 'info');
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        genericName: item.genericName || "",
        category: item.category || "",
        description: item.description || "",
        price: item.price,
        quantity: item.quantity || 150,
        requiresPrescription: item.requiresPrescription || false,
        image: item.image,
        manufacturer: item.manufacturer || ""
      }, 1);
      triggerToast(`تم إضافة ${item.name.substring(0, 20)}... إلى سلة المشتريات بنجاح!`, 'success');
    }
  };

  return (
    <div className="cart-page">
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Navigation Breadcrumb */}
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span className="separator">/</span>
          <span className="current">المفضلة</span>
        </nav>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="cart-items-card animate-fade-in" style={{ padding: '48px 32px' }}>
            <div className="cart-empty-state">
              <div className="empty-icon-wrapper" style={{ background: '#ffebee', color: '#e53935' }}>
                <Heart size={42} fill="#e53935" />
              </div>
              <h2 className="empty-title">قائمة المفضلة فارغة</h2>
              <p className="empty-desc">
                لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد. تصفح المنتجات وأضف ما يعجبك هنا للرجوع إليه لاحقاً.
              </p>
              <Link to="/" className="checkout-btn" style={{ maxWidth: '240px', marginTop: '12px', textDecoration: 'none' }}>
                <ArrowRight size={18} />
                <span>العودة للرئيسية</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Favorites Grid Layout */
          <div className="cart-items-card animate-fade-in">
            <h1 className="cart-title" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px' }}>
              قائمة المنتجات المفضلة ({favorites.length})
            </h1>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '24px',
              marginTop: '16px'
            }}>
              {favorites.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1.5px solid #e8edf2',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(item.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: '5',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      transition: 'color 0.2s'
                    }}
                    title="إزالة من المفضلة"
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#e53935'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; }}
                  >
                    <Trash2 size={16} />
                  </button>

                  <div>
                    {/* Product Image */}
                    <div style={{ 
                      height: '170px', 
                      background: '#f0f4f8', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: '12px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Product Specs */}
                    <div style={{ padding: '16px 16px 8px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        color: 'var(--color-text-muted)', 
                        fontWeight: '700',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        {item.brand || 'عام'}
                      </span>
                      <h3 style={{ 
                        fontSize: '13px', 
                        fontWeight: '700', 
                        color: 'var(--color-text-main)', 
                        margin: '0 0 8px',
                        lineHeight: '1.4',
                        height: '38px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {item.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          color: 'var(--color-primary)', 
                          fontWeight: '800', 
                          fontSize: '15px' 
                        }}>
                          {item.price} جنيه
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add To Cart CTA */}
                  <div style={{ padding: '0 16px 16px' }}>
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className={`add-to-cart-btn ${cartItems.some((cItem) => String(cItem.id) === String(item.id)) ? 'added' : ''}`}
                    >
                      {cartItems.some((cItem) => String(cItem.id) === String(item.id)) ? (
                        <>
                          <Trash2 size={15} />
                          <span>إزالة من السلة</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={15} />
                          <span>أضف للسلة</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`product-toast-notification ${toast.type} animate-fade-in`}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: '999',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
