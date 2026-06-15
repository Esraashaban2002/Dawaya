import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, Store, ShieldCheck, Plus, Minus, 
  Share2, Heart, ShoppingCart, Check, ChevronLeft, Trash2
} from 'lucide-react';
import { CartContext } from '../../Context/CartContext';
import { FavoritesContext } from '../../Context/FavoritesContext';

const PRODUCTS_DB = {
  "1": {
    id: "1",
    name: "بانادول اكسترا اوبتيزورب لتخفيف إضافي مسكن فعال للألم والحمى | 24 قرص",
    brand: "بانادول",
    price: 58,
    deliveryTime: "خلال 30-60 دقيقة",
    sellerName: "أقرب صيدلية",
    images: [
      "/imges/panadol_extra.png",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80",
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80"
    ],
    features: [
      "بانادول إكسترا أوبتيزورب مفعول أسرع للألم مقارنة بالباراسيتامول العادي",
      "مناسب لجميع أعراض آلام الجسم، بما في ذلك الصداع وآلام الجسم وآلام الظهر وآلام العضلات والروماتيزم وآلام الدورة الشهرية",
      "لطيف على المعدة عند استخدامه حسب الإرشادات"
    ],
    qa: [
      {
        q: "ما هي أقراص بانادول اكسترا panadol extra ؟",
        a: "تم تصميم أقراص بانادول إكسترا لتخفيف أنواع متعددة من الألم: الصداع، آلام الدورة الشهرية، آلام العضلات، آلام الأسنان والحمى."
      },
      {
        q: "لماذا أقراص بانادول اكسترا ؟",
        a: "مع تركيبة مزدوجة تحتوي على الباراسيتامول والكافيين لمفعول مسكن مضاعف."
      },
      {
        q: "دواعي استعمال بانادول اكسترا",
        a: "أقراص بانادول اكسترا مخصصة للأشخاص الذين يحتاجون إلى تخفيف الألم، وهي مناسبة أيضاً لأولئك الذين يتناولون معظم الأدوية الأخرى وكذلك كبار السن."
      },
      {
        q: "المنتجات المتاحة من بانادول اكسترا",
        a: "يمكن العثور على بانادول اكسترا في عبوات من 24 قرصاً. من الجيد أن تكون في متناول اليد لتخفيف الألم بشكل فعال."
      },
      {
        q: "كيف سيفيدك بانادول اكسترا ؟",
        a: "الباراسيتامول والكافيين معاً يعملان كمسكن قوي للألم، عند الاستخدام حسب الإرشادات. يمكن تناوله على معدة فارغة ومن غير أن يسبب تهيج المعدة. التهيج هو نسبة إلى التأثير على الذين يعانون أو معرضون لخطر الإصابة بمرض قرحة المعدة أو نزيف الجهاز اله الجهاز الهضمي عند الاستخدام حسب الإرشادات."
      },
      {
        q: "سعر بانادول اكسترا panadol extra",
        a: "سعر بانادول اكسترا هو 58 جنيه لعبوة تحتوي على 24 قرص. وسعر شريط بانادول اكسترا هو 17 جنيه. *سعر بانادول الأحمر قد يتغير تبعاً لتغير سعره في الصيدليات."
      }
    ],
    specifications: [
      { key: "العلامة التجارية", value: "بانادول (Panadol)" },
      { key: "العبوة", value: "24 قرص (علبة كرتون)" },
      { key: "المادة الفعالة", value: "باراسيتامول 500 مجم + كافيين 65 مجم" },
      { key: "شكل الجرعة", value: "أقراص مغلفة (Tablets)" },
      { key: "الفئة العمرية", value: "البالغون والأطفال بعمر 12 سنة فما فوق" },
      { key: "تعليمات التخزين", value: "يُحفظ في درجة حرارة أقل من 30 درجة مئوية بعيداً عن الرطوبة" },
      { key: "الشركة المصنعة", value: "جلاكسو سميث كلاين (GSK)" }
    ]
  },
  "2": {
    id: "2",
    name: "هيكس ألم جل موضعي مسكن للآلام ومضاد للالتهابات | 50 جرام",
    brand: "هيكس ألم",
    price: 12.5,
    deliveryTime: "خلال 30-60 دقيقة",
    sellerName: "أقرب صيدلية",
    images: [
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80"
    ],
    features: [
      "مفعول سريع لتخفيف آلام المفاصل والعضلات والظهر",
      "يحتوي على مواد فعالة سريعة الامتصاص عبر الجلد",
      "مناسب لعلاج التهابات الأوتار والتواء المفاصل والكدمات"
    ],
    qa: [
      {
        q: "ما هو هيكس ألم منظور ؟",
        a: "هو جل موضعي سريع الامتصاص يستخدم لتخفيف آلام المفاصل، العضلات، الظهر والتهاب الأوتار."
      },
      {
        q: "كيفية استخدام هيكس ألم ؟",
        a: "توضع كمية مناسبة من الجل على مكان الألم مع التدليك الخفيف 3 إلى 4 مرات يومياً."
      }
    ],
    specifications: [
      { key: "العلامة التجارية", value: "هيكس ألم (Hex Pain)" },
      { key: "العبوة", value: "أنبوب جل 50 جرام (علبة كرتون)" },
      { key: "المادة الفعالة", value: "ديكلوفيناك الصوديوم 1%" },
      { key: "شكل الجرعة", value: "جل موضعي (Topical Gel)" },
      { key: "الفئة العمرية", value: "البالغون والأطفال بعمر 12 سنة فما فوق" },
      { key: "تعليمات التخزين", value: "يُحفظ في درجة حرارة أقل من 30 درجة مئوية بعيداً عن أشعة الشمس المباشرة" },
      { key: "الشركة المصنعة", value: "الشركة العربية للأدوية (ADCO)" }
    ]
  },
  "3": {
    id: "3",
    name: "فيتامين سي بريميوم 1000 مجم فوار لتعزيز المناعة | 20 قرص",
    brand: "فيتامين سي بريميوم",
    price: 24.99,
    deliveryTime: "خلال 30-60 دقيقة",
    sellerName: "أقرب صيدلية",
    images: [
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80"
    ],
    features: [
      "جرعة عالية من فيتامين سي (1000 مجم) لتعزيز صحة الجهاز المناعي",
      "يحتوي على الزنك ومضادات الأكسدة الإضافية لحماية الخلايا",
      "أقراص فوارة بنكهة البرتقال الطبيعية سريعة الذوبان والامتصاص",
      "يساعد في تقليل التعب والإرهاق ودعم نضارة البشرة وإنتاج الكولاجين"
    ],
    qa: [
      {
        q: "ما هي دواعي استعمال فيتامين سي بريميوم ؟",
        a: "تعزيز جهاز المناعة، الوقاية من نزلات البرد والأنفلونزا، زيادة امتصاص الحديد، وحماية الخلايا من الإجهاد التأكسدي."
      },
      {
        q: "ما هي الجرعة اليومية الموصى بها ؟",
        a: "قرص واحد فوار يذاب في نصف كوب من الماء يومياً للبالغين."
      }
    ],
    specifications: [
      { key: "العلامة التجارية", value: "بريميوم (Premium)" },
      { key: "العبوة", value: "أنبوب يحتوي على 20 قرصاً فواراً" },
      { key: "المادة الفعالة", value: "فيتامين سي 1000 مجم + زنك 10 مجم" },
      { key: "شكل الجرعة", value: "أقراص فوارة (Effervescent Tablets)" },
      { key: "الفئة العمرية", value: "البالغون والأطفال فوق 12 سنة" },
      { key: "تعليمات التخزين", value: "يُحفظ في مكان بارد وجاف ويُغلق الأنبوب جيداً بعد الاستخدام" },
      { key: "الشركة المصنعة", value: "إيفا فارما (Eva Pharma)" }
    ]
  }
};

export default function ProductDetails() {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (PRODUCTS_DB[id]) {
      setProductData(PRODUCTS_DB[id]);
      setLoading(false);
    } else {
      setLoading(true);
      fetch(`https://dawaya-back-end.vercel.app/api/medicines/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Product not found");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.data) {
            const apiProd = data.data;
            setProductData({
              id: apiProd._id,
              name: apiProd.name,
              brand: apiProd.manufacturer || apiProd.genericName || 'عام',
              price: apiProd.price,
              deliveryTime: "خلال 30-60 دقيقة",
              sellerName: "أقرب صيدلية",
              images: apiProd.images && apiProd.images.length > 0 
                ? apiProd.images 
                : ["https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80"],
              features: [apiProd.description || 'لا يوجد وصف متاح للمنتج حالياً.'],
              qa: [
                {
                  q: "ما هو هذا المنتج ؟",
                  a: apiProd.description || 'لا توجد تفاصيل إضافية عن هذا المنتج حالياً.'
                }
              ],
              specifications: [
                { key: "العلامة التجارية", value: apiProd.manufacturer || "عام" },
                { key: "الاسم العلمي", value: apiProd.genericName || "غير محدد" },
                { key: "الفئة", value: apiProd.category || "غير محدد" },
                { key: "يتطلب وصفة طبية", value: apiProd.requiresPrescription ? "نعم" : "لا" }
              ]
            });
          } else {
            setProductData(PRODUCTS_DB["1"]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch product details:", err);
          setProductData(PRODUCTS_DB["1"]);
          setLoading(false);
        });
    }
  }, [id]);

  const PRODUCT_DATA = productData || PRODUCTS_DB["1"];
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs'
  const [toastMessage, setToastMessage] = useState(null);
  const [showShareToast, setShowShareToast] = useState(false);

  // Reset active image when product ID or productData changes
  useEffect(() => {
    if (PRODUCT_DATA && PRODUCT_DATA.images && PRODUCT_DATA.images.length > 0) {
      setActiveImage(PRODUCT_DATA.images[0]);
    }
  }, [id, productData]);

  // Sync details page quantity stepper with cartItems
  useEffect(() => {
    if (!PRODUCT_DATA) return;
    const existing = cartItems.find((item) => String(item.id) === String(PRODUCT_DATA.id));
    if (existing) {
      setQuantity(existing.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItems, PRODUCT_DATA]);

  const handleQtyChange = (val) => {
    if (!PRODUCT_DATA) return;
    if (val < 1) return;
    setQuantity(val);

    // Automatically sync with cart and update navbar count if already added
    const existing = cartItems.find((item) => String(item.id) === String(PRODUCT_DATA.id));
    if (existing) {
      addToCart({
        id: PRODUCT_DATA.id,
        name: PRODUCT_DATA.name,
        price: PRODUCT_DATA.price,
        brand: PRODUCT_DATA.brand,
        image: PRODUCT_DATA.images[0]
      }, val);
    }
  };

  const handleAddToCart = () => {
    if (!PRODUCT_DATA) return;
    const isAdded = cartItems.some((item) => String(item.id) === String(PRODUCT_DATA.id));
    if (isAdded) {
      removeFromCart(PRODUCT_DATA.id);
      setToastMessage("تم إزالة المنتج من سلة المشتريات.");
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      addToCart({
        id: PRODUCT_DATA.id,
        name: PRODUCT_DATA.name,
        price: PRODUCT_DATA.price,
        brand: PRODUCT_DATA.brand,
        image: PRODUCT_DATA.images[0]
      }, quantity);
      setToastMessage(`تم إضافة ${quantity} من المنتج إلى سلة المشتريات بنجاح!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  if (loading || !productData) {
    return (
      <div className="product-details-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span className="separator">/</span>
          <Link to="/#products-section">الأدوية</Link>
          <span className="separator">/</span>
          <span className="current">مسكنات الألم</span>
          <span className="separator">/</span>
          <span className="current text-truncate">{PRODUCT_DATA.name}</span>
        </nav>

        {/* Main Product Card */}
        <div className="product-main-card animate-fade-in">
          
          {/* Right/Center: Media Gallery */}
          <div className="product-gallery">
            {/* Thumbnails list (Vertical, on the right in RTL) */}
            <div className="product-thumbnails">
              {PRODUCT_DATA.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail-wrapper ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${PRODUCT_DATA.name} thumbnail ${index}`} />
                </div>
              ))}
            </div>

            {/* Main Preview (Center) */}
            <div className="product-main-preview">
              <img src={activeImage} alt={PRODUCT_DATA.name} />
            </div>
          </div>

          {/* Left: Product Options & Purchase details */}
          <div className="product-options">
            
            {/* Brand Link and Share Row */}
            <div className="product-header-actions">
              <Link to="/#products-section" className="product-brand-link">
                مشاهدة كل منتجات {PRODUCT_DATA.brand}
              </Link>
              <div className="actions-buttons">
                <button 
                  onClick={handleShare} 
                  className="action-icon-btn" 
                  title="مشاركة المنتج"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={() => toggleFavorite({
                    id: String(PRODUCT_DATA.id),
                    name: PRODUCT_DATA.name,
                    price: PRODUCT_DATA.price,
                    brand: PRODUCT_DATA.brand,
                    image: PRODUCT_DATA.images[0]
                  })} 
                  className={`action-icon-btn ${isFavorite(PRODUCT_DATA.id) ? 'wishlisted' : ''}`}
                  title="إضافة للمفضلة"
                >
                  <Heart 
                    size={18} 
                    fill={isFavorite(PRODUCT_DATA.id) ? "var(--color-danger)" : "none"} 
                    color={isFavorite(PRODUCT_DATA.id) ? "var(--color-danger)" : "currentColor"}
                  />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="product-title-text">{PRODUCT_DATA.name}</h1>

            {/* Price */}
            <div className="product-price-tag">
              <span className="price-label">السعر:</span>
              <span className="price-value">{PRODUCT_DATA.price} جنيه</span>
            </div>


            {/* Interactive Buy & Quantity Row */}
            <div className="product-purchase-row">
              {/* Quantity Stepper */}
              <div className="qty-stepper">
                <button 
                  className="qty-btn"
                  onClick={() => handleQtyChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => handleQtyChange(quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add To Cart Button */}
              <button 
                onClick={handleAddToCart}
                className={`add-to-cart-btn ${cartItems.some((item) => String(item.id) === String(PRODUCT_DATA.id)) ? 'added' : ''}`}
              >
                {cartItems.some((item) => String(item.id) === String(PRODUCT_DATA.id)) ? (
                  <>
                    <Trash2 size={18} />
                    <span>إزالة من العربة</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>أضف إلى العربة</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Description & Specifications Tabs Container */}
        <div className="product-details-tabs-card">
          
          {/* Tabs Navigation Header */}
          <div className="tabs-header-nav">
            <button 
              className={`tab-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              نظرة عامة
            </button>
            <button 
              className={`tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              المواصفات
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="tabs-content-body">
            
            {/* 1. Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-pane animate-fade-in">
                
                {/* Product Features */}
                <section className="details-section">
                  <h2 className="section-heading">مميزات المنتج</h2>
                  <ul className="features-list-bullets">
                    {PRODUCT_DATA.features.map((feat, index) => (
                      <li key={index}>{feat}</li>
                    ))}
                  </ul>
                </section>

                {/* About this Product Q&A Accordion */}
                <section className="details-section">
                  <h2 className="section-heading">عن هذا المنتج</h2>
                  <div className="qa-accordion-list">
                    {PRODUCT_DATA.qa.map((item, index) => (
                      <div key={index} className="qa-item-block">
                        <h3 className="qa-question">{item.q}</h3>
                        <p className="qa-answer">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* 2. Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="tab-pane animate-fade-in">
                <section className="details-section">
                  <h2 className="section-heading">المواصفات الفنية</h2>
                  <div className="specs-table-container">
                    <table className="specs-table">
                      <tbody>
                        {PRODUCT_DATA.specifications.map((spec, index) => (
                          <tr key={index}>
                            <td className="spec-key">{spec.key}</td>
                            <td className="spec-value">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Cart Feedback Toast */}
      {toastMessage && (
        <div className="product-toast-notification success animate-fade-in" style={{ background: toastMessage.includes('إزالة') ? '#ef4444' : '', borderColor: toastMessage.includes('إزالة') ? '#dc2626' : '' }}>
          {toastMessage.includes('إزالة') ? <Trash2 size={16} /> : <Check size={16} />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Share clipboard Toast */}
      {showShareToast && (
        <div className="product-toast-notification info animate-fade-in">
          <Check size={16} />
          <span>تم نسخ رابط المنتج إلى الحافظة!</span>
        </div>
      )}
    </div>
  );
}
