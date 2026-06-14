import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, ShoppingBag, 
  ArrowRight, ShieldCheck, CreditCard 
} from 'lucide-react';
import { CartContext } from '../Context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  // Calculations
  const subtotal = Math.round((cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + Number.EPSILON) * 100) / 100;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = Math.round((subtotal + deliveryFee + tax + Number.EPSILON) * 100) / 100;

  return (
    <div className="cart-page">
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Navigation Breadcrumb */}
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span className="separator">/</span>
          <span className="current">عربة التسوق</span>
        </nav>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="cart-items-card animate-fade-in">
            <div className="cart-empty-state">
              <div className="empty-icon-wrapper">
                <ShoppingBag size={42} />
              </div>
              <h2 className="empty-title">عربة التسوق فارغة</h2>
              <p className="empty-desc">
                يبدو أنك لم تقم بإضافة أي منتجات إلى عربة التسوق الخاصة بك بعد. ابدأ بالتسوق الآن واكتشف أفضل العروض الطبية.
              </p>
              <Link to="/#products-section" className="checkout-btn" style={{ maxWidth: '240px', marginTop: '12px', textDecoration: 'none' }}>
                <ArrowRight size={18} />
                <span>العودة للمنتجات</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Grid Layout */
          <div className="cart-grid animate-fade-in">
            
            {/* Right: Items List */}
            <div className="cart-items-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px' }}>
                <h1 className="cart-title" style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
                  عربة التسوق ({cartItems.length} منتجات)
                </h1>
                <button 
                  onClick={clearCart}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  تفريغ العربة
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row animate-fade-in">
                    
                    {/* Image */}
                    <div className="cart-item-image">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="cart-item-details">
                      <Link to={`/product/${item.id}`} className="cart-item-name">
                        {item.name}
                      </Link>
                      <span className="cart-item-brand">العلامة التجارية: {item.brand}</span>
                      <span className="cart-item-price-unit">{item.price} جنيه للوحدة</span>
                    </div>

                    {/* Stepper */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className="qty-stepper" style={{ height: '36px' }}>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{ width: '32px' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-number" style={{ fontSize: '14px', minWidth: '24px' }}>{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ width: '32px' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="cart-item-price-total">
                      {item.price * item.quantity} جنيه
                    </div>

                    {/* Actions */}
                    <div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-remove-btn"
                        title="حذف المنتج"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Bottom Actions Row */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/#products-section" className="continue-shopping-link">
                  <ArrowRight size={16} />
                  <span>مواصلة التسوق</span>
                </Link>
              </div>

            </div>

            {/* Left: Summary Panel */}
            <div className="cart-summary-card">
              <h2 className="summary-title">ملخص الطلب</h2>

              <div className="summary-row">
                <span>المجموع الفرعي ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} وحدات):</span>
                <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{subtotal} جنيه</span>
              </div>

              <div className="summary-row">
                <span>مصاريف التوصيل:</span>
                <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{deliveryFee} جنيه</span>
              </div>

              <div className="summary-row">
                <span>ضريبة القيمة المضافة (5%):</span>
                <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{tax} جنيه</span>
              </div>

              <div className="summary-row total">
                <span>إجمالي الحساب:</span>
                <span style={{ color: 'var(--color-primary)' }}>{total} جنيه</span>
              </div>


              <Link to="/checkout" className="checkout-btn" style={{ marginTop: '8px', textDecoration: 'none' }}>
                <CreditCard size={18} />
                <span>إتمام عملية الشراء</span>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
