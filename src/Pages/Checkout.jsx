import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, CreditCard, Copy, Check, Upload, AlertCircle,
  ShoppingBag, Truck, CheckCircle2, Smartphone, Wallet, Building, ArrowLeft, Loader2
} from 'lucide-react';
import { CartContext } from '../Context/CartContext';
import { UserContext } from '../Context/UserContext';
import { api } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const { userLogin } = useContext(UserContext);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('vodafone');
  const [senderInfo, setSenderInfo] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  // Copy status indicators
  const [copiedField, setCopiedField] = useState(null); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile();
        let apiUser = data?.user || data?.data?.user || data?.data || data;
        if (apiUser) {
          setFullName(apiUser.username || '');
          setPhone(apiUser.phone || '');
        }
      } catch (err) {
        const localEmail = localStorage.getItem("dawaya_current_email") || '';
        const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
        const localUser = users.find(u => u.email.toLowerCase() === localEmail.toLowerCase());
        if (localUser) {
          setFullName(localUser.username || '');
          setPhone(localUser.phone || '');
        }
      }
    };
    loadProfile();
  }, [userLogin]);

  const subtotal = Math.round((cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + Number.EPSILON) * 100) / 100;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const tax = Math.round(subtotal * 0.05); 
  const total = Math.round((subtotal + deliveryFee + tax + Number.EPSILON) * 100) / 100;

  useEffect(() => {
    if (cartItems.length === 0 && !showSuccessModal && !isSubmitting) {
      navigate('/cart');
    }
  }, [cartItems, showSuccessModal, isSubmitting, navigate]);

  const handleCopy = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، العنوان).');
      return;
    }

    if (paymentMethod !== 'cod' && !senderInfo.trim()) {
      alert(
        paymentMethod === 'vodafone'
          ? 'يرجى إدخال رقم الهاتف المحول منه.'
          : paymentMethod === 'instapay'
            ? 'يرجى إدخال اسم الحساب المحول منه.'
            : 'يرجى إدخال اسم صاحب الحساب المحول منه.'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `DWY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderDate = new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const orderData = {
        id: orderId,
        date: orderDate,
        items: [...cartItems],
        subtotal,
        deliveryFee,
        tax,
        total,
        shippingInfo: {
          fullName,
          phone,
          city,
          address,
          notes
        },
        payment: {
          method: paymentMethod,
          senderInfo: paymentMethod === 'cod' ? null : senderInfo,
          receiptAttached: !!receiptFile
        },
        status: paymentMethod === 'cod' ? 'preparing' : 'pending_verification'
      };

      const userEmail = localStorage.getItem("dawaya_current_email") || 'anonymous';
      const allOrders = JSON.parse(localStorage.getItem('dawaya_orders') || '[]');
      allOrders.unshift({ ...orderData, userEmail });
      localStorage.setItem('dawaya_orders', JSON.stringify(allOrders));

      setCreatedOrder(orderData);
      setIsSubmitting(false);
      setShowSuccessModal(true);

      clearCart();
    }, 2500);
  };

  const getPaymentMethodNameAr = (method) => {
    switch (method) {
      case 'vodafone': return 'فودافون كاش';
      case 'instapay': return 'إنستا باي (Instapay)';
      case 'bank': return 'تحويل بنكي';
      case 'cod': return 'الدفع عند الاستلام';
      default: return '';
    }
  };

  return (
    <div className="checkout-page animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '90vh', padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 16px' }}>

        {}
        <nav className="breadcrumbs" aria-label="breadcrumb" style={{ display: 'flex', gap: '8px', marginBottom: '24px', fontSize: '13px' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>الرئيسية</Link>
          <span className="separator" style={{ color: 'var(--color-text-light)' }}>/</span>
          <Link to="/cart" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>عربة التسوق</Link>
          <span className="separator" style={{ color: 'var(--color-text-light)' }}>/</span>
          <span className="current" style={{ color: 'var(--color-text-main)', fontWeight: '700' }}>إتمام عملية الشراء</span>
        </nav>

        <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-text-main)', marginBottom: '32px' }}>
          إتمام الطلب والدفع
        </h1>

        <div className="checkout-grid grid grid-cols-1 lg:grid-cols-12 gap-8">

          {}
          <form onSubmit={handleSubmit} className="col-span-12 lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {}
            <div className="checkout-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(241,245,249,0.8)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
                <Truck size={20} style={{ color: 'var(--color-brand)' }} />
                <span>معلومات التوصيل</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">الاسم الكامل *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px', padding: '12px' }}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك بالكامل"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">رقم الهاتف للتواصل *</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ direction: 'ltr', textAlign: 'left', borderRadius: '12px', padding: '12px' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">المدينة / المحافظة *</label>
                    <select
                      className="form-input"
                      style={{ borderRadius: '12px', padding: '12px', height: '48px', appearance: 'none', background: 'url("data:image/svg+xml;utf8,<svg fill=\'%2364748b\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat left 12px center #ffffff' }}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    >
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="القليوبية">القليوبية</option>
                      <option value="الغربية">الغربية</option>
                      <option value="المنوفية">المنوفية</option>
                      <option value="الدقهلية">الدقهلية</option>
                      <option value="البحيرة">البحيرة</option>
                    </select>
                  </div>
                  <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                    <label className="form-label">العنوان بالتفصيل *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px', padding: '12px' }}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="رقم الشارع، رقم العمارة، الطابق، رقم الشقة"
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">ملاحظات إضافية للمندوب (اختياري)</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    style={{ borderRadius: '12px', padding: '12px', resize: 'vertical', minHeight: '60px' }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي ملاحظات بخصوص موعد التسليم أو علامة مميزة للعنوان"
                  />
                </div>

              </div>
            </div>

            {}
            <div className="checkout-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(241,245,249,0.8)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
                <CreditCard size={20} style={{ color: 'var(--color-brand)' }} />
                <span>طريقة الدفع</span>
              </h2>

              {}
              <div className="payment-selectors-grid grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

                {}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('vodafone'); setSenderInfo(''); setReceiptFile(null); setReceiptPreview(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '16px',
                    border: paymentMethod === 'vodafone' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: paymentMethod === 'vodafone' ? 'var(--color-primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'right'
                  }}
                >
                  <Smartphone size={22} style={{ color: paymentMethod === 'vodafone' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>فودافون كاش</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>محفظة هاتف إلكترونية</span>
                  </div>
                </button>

                {}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('instapay'); setSenderInfo(''); setReceiptFile(null); setReceiptPreview(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '16px',
                    border: paymentMethod === 'instapay' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: paymentMethod === 'instapay' ? 'var(--color-primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'right'
                  }}
                >
                  <Wallet size={22} style={{ color: paymentMethod === 'instapay' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>إنستا باي</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>تحويل فوري عبر التطبيق</span>
                  </div>
                </button>

                {}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('bank'); setSenderInfo(''); setReceiptFile(null); setReceiptPreview(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '16px',
                    border: paymentMethod === 'bank' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: paymentMethod === 'bank' ? 'var(--color-primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'right'
                  }}
                >
                  <Building size={22} style={{ color: paymentMethod === 'bank' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>تحويل بنكي</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }} >  حساب CIB / بنك مصر / البنك الأهلى المصرى</span>
                  </div>
                </button>

                {}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('cod'); setSenderInfo(''); setReceiptFile(null); setReceiptPreview(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '16px',
                    border: paymentMethod === 'cod' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: paymentMethod === 'cod' ? 'var(--color-primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'right'
                  }}
                >
                  <Truck size={22} style={{ color: paymentMethod === 'cod' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>الدفع عند الاستلام</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>نقداً عند وصول المندوب</span>
                  </div>
                </button>

              </div>

              {}
              <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)' }}>

                {paymentMethod === 'vodafone' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>مطلوب مسبقاً</span>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>قم بتحويل مبلغ <span style={{ color: 'var(--color-primary)' }}>{total} جنيه</span> إلى رقم محفظتنا:</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '12px 18px', borderRadius: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: '900', color: 'var(--color-text-main)' }}>01023456789</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('01023456789', 'vodafone_num')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-primary-light)', border: 'none', color: 'var(--color-primary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                      >
                        {copiedField === 'vodafone_num' ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedField === 'vodafone_num' ? 'تم النسخ' : 'نسخ الرقم'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ marginBottom: '6px' }}>رقم المحفظة التي قمت بالتحويل منها *</label>
                        <input
                          type="tel"
                          className="form-input"
                          style={{ direction: 'ltr', textAlign: 'left', borderRadius: '12px', padding: '10px' }}
                          value={senderInfo}
                          onChange={(e) => setSenderInfo(e.target.value)}
                          placeholder="01xxxxxxxxx"
                          required
                        />
                      </div>

                      {}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ marginBottom: '6px' }}>صورة إيصال / لقطة شاشة التحويل (اختياري)</label>
                        <div style={{ position: 'relative', height: '42px', overflow: 'hidden' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                          />
                          <button
                            type="button"
                            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px dashed var(--color-primary)', backgroundColor: '#ffffff', borderRadius: '12px', color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700' }}
                          >
                            <Upload size={14} />
                            <span>{receiptFile ? receiptFile.name.substring(0, 15) + '...' : 'إرفاق إيصال الدفع'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {receiptPreview && (
                      <div style={{ marginTop: '8px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '6px', backgroundColor: '#ffffff', width: '120px' }}>
                        <img src={receiptPreview} alt="Receipt Preview" style={{ width: '100%', height: '80px', objectFit: 'contain', borderRadius: '8px' }} />
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'instapay' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>مطلوب مسبقاً</span>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>حول مبلغ <span style={{ color: 'var(--color-primary)' }}>{total} جنيه</span> لعنوان إنستا باي (IPA):</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '12px 18px', borderRadius: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '950', color: 'var(--color-text-main)' }}>dawaya@instapay</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('dawaya@instapay', 'instapay_address')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-primary-light)', border: 'none', color: 'var(--color-primary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                      >
                        {copiedField === 'instapay_address' ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedField === 'instapay_address' ? 'تم النسخ' : 'نسخ العنوان'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ marginBottom: '6px' }}>اسم الحساب المحوّل منه (Instapay Name) *</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ borderRadius: '12px', padding: '10px' }}
                          value={senderInfo}
                          onChange={(e) => setSenderInfo(e.target.value)}
                          placeholder="أدخل اسمك في تطبيق إنستا باي"
                          required
                        />
                      </div>

                      {}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ marginBottom: '6px' }}>إرفاق إيصال التحويل (اختياري)</label>
                        <div style={{ position: 'relative', height: '42px', overflow: 'hidden' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                          />
                          <button
                            type="button"
                            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px dashed var(--color-primary)', backgroundColor: '#ffffff', borderRadius: '12px', color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700' }}
                          >
                            <Upload size={14} />
                            <span>{receiptFile ? receiptFile.name.substring(0, 15) + '...' : 'إرفاق لقطة الشاشة'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {receiptPreview && (
                      <div style={{ marginTop: '8px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '6px', backgroundColor: '#ffffff', width: '120px' }}>
                        <img src={receiptPreview} alt="Receipt Preview" style={{ width: '100%', height: '80px', objectFit: 'contain', borderRadius: '8px' }} />
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>مطلوب مسبقاً</span>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>حول مبلغ <span style={{ color: 'var(--color-primary)' }}>{total} جنيه</span> إلى بيانات الحساب البنكي التالي:</p>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>البنك:</span>
                        <span style={{ color: 'var(--color-text-main)', fontWeight: '800' }}>البنك التجاري الدولي (CIB)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>اسم المستفيد:</span>
                        <span style={{ color: 'var(--color-text-main)', fontWeight: '800' }}>شركة داوايا للخدمات الطبية</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>رقم الحساب:</span>
                          <span style={{ fontFamily: 'monospace', color: 'var(--color-text-main)', fontWeight: '800' }}>100029384756</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('100029384756', 'bank_acc')}
                          style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedField === 'bank_acc' ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedField === 'bank_acc' ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>الآيبان IBAN:</span>
                          <span style={{ fontFamily: 'monospace', color: 'var(--color-text-main)', fontWeight: '800' }}>EG1200030000100029384756</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('EG1200030000100029384756', 'bank_iban')}
                          style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedField === 'bank_iban' ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedField === 'bank_iban' ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ marginBottom: '6px' }}>اسم المرسل بالكامل (صاحب الحساب المحول منه) *</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ borderRadius: '12px', padding: '10px' }}
                          value={senderInfo}
                          onChange={(e) => setSenderInfo(e.target.value)}
                          placeholder="الاسم الثلاثي أو الرباعي للمحوّل"
                          required
                        />
                      </div>

                      {}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ marginBottom: '6px' }}>إرفاق صورة إيصال التحويل البنكي (اختياري)</label>
                        <div style={{ position: 'relative', height: '42px', overflow: 'hidden' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                          />
                          <button
                            type="button"
                            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px dashed var(--color-primary)', backgroundColor: '#ffffff', borderRadius: '12px', color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700' }}
                          >
                            <Upload size={14} />
                            <span>{receiptFile ? receiptFile.name.substring(0, 15) + '...' : 'إرفاق الإيصال'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {receiptPreview && (
                      <div style={{ marginTop: '8px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '6px', backgroundColor: '#ffffff', width: '120px' }}>
                        <img src={receiptPreview} alt="Receipt Preview" style={{ width: '100%', height: '80px', objectFit: 'contain', borderRadius: '8px' }} />
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--color-primary)', display: 'flex', flexShrink: 0 }}>
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '800', color: 'var(--color-text-main)' }}>الدفع عند الاستلام</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                        سيتم دفع إجمالي المبلغ نقداً (كاش) عند تسلم الطلب من مندوب التوصيل. يرجى تجهيز المبلغ المحدد لتسهيل وتسريع عملية الاستلام.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </form>

          {}
          <div className="col-span-12 lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div className="checkout-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(241,245,249,0.8)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                ملخص الطلب
              </h2>

              {}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', paddingLeft: '4px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400';
                      }}
                      style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '4px' }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-main)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <span>الكمية: {item.quantity}</span>
                        <span style={{ fontWeight: '700' }}>{item.price * item.quantity} جنيه</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  <span>المجموع الفرعي:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{subtotal} جنيه</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  <span>مصاريف التوصيل:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{deliveryFee} جنيه</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  <span>ضريبة القيمة المضافة (5%):</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{tax} جنيه</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', color: 'var(--color-text-main)', borderTop: '1px dashed var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                  <span>الإجمالي الكلي:</span>
                  <span style={{ color: 'var(--color-primary)' }}>{total} جنيه</span>
                </div>
              </div>

              {}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '11px', fontWeight: '700', marginBottom: '20px' }}>
                <ShieldCheck size={16} />
                <span>جميع المعاملات تتم بطريقة آمنة ومحمية بالكامل</span>
              </div>

              {}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="checkout-btn"
                style={{ width: '100%', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>جاري معالجة الطلب...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>تأكيد الطلب ودفع</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div >

      </div >

      {}
      {
        showSuccessModal && createdOrder && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} className="animate-fade-in">
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '540px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.8)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'scaleUp 0.3s ease-out' }}>

              {}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <CheckCircle2 size={42} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-text-main)', margin: '0 0 8px 0' }}>شكراً لك! تم تسجيل طلبك بنجاح</h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>تم استلام تفاصيل الطلب والدفع، وجاري معالجة طلبك الآن.</p>
              </div>

              {}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>رقم الطلب:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '800', color: 'var(--color-text-main)' }}>{createdOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>تاريخ الطلب:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{createdOrder.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>طريقة الدفع:</span>
                  <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{getPaymentMethodNameAr(createdOrder.payment.method)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>عنوان التوصيل:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }} className="text-truncate" title={`${createdOrder.shippingInfo.city}، ${createdOrder.shippingInfo.address}`}>{createdOrder.shippingInfo.city}، {createdOrder.shippingInfo.address}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingTop: '4px', fontWeight: '900' }}>
                  <span style={{ color: 'var(--color-text-main)' }}>الإجمالي المدفوع:</span>
                  <span style={{ color: 'var(--color-primary)' }}>{createdOrder.total} جنيه</span>
                </div>
              </div>

              {}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-main)' }}>حالة الطلب:</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '8px', padding: '0 8px' }}>
                  {}
                  <div style={{ position: 'absolute', top: '10px', left: '20px', right: '20px', height: '2px', backgroundColor: '#e2e8f0', zIndex: 1 }} />

                  {}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }}>✓</div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-main)' }}>تم الطلب</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: createdOrder.payment.method === 'cod' ? 'var(--color-primary)' : '#e2e8f0', border: createdOrder.payment.method === 'cod' ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: createdOrder.payment.method === 'cod' ? '#ffffff' : 'var(--color-text-muted)', fontSize: '10px', fontWeight: 'bold' }}>
                      {createdOrder.payment.method === 'cod' ? '✓' : '2'}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: createdOrder.payment.method === 'cod' ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                      {createdOrder.payment.method === 'cod' ? 'مقبول تلقائياً' : 'تأكيد الدفع'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '10px', fontWeight: 'bold' }}>3</div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-muted)' }}>التجهيز</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '10px', fontWeight: 'bold' }}>4</div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-muted)' }}>التوصيل</span>
                  </div>
                </div>
              </div>

              {}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/profile');
                  }}
                  className="checkout-btn"
                  style={{ width: '100%' }}
                >
                  <span>تتبع الطلب في حسابي</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                  }}
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-text-main)',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-action-bg"
                >
                  <span>الرئيسية</span>
                  <ArrowLeft size={16} />
                </button>
              </div>

            </div>
          </div>
        )
      }
    </div >
  );
}
