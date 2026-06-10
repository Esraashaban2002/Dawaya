import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { FavoritesContext } from "../Context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Trash2, ShoppingCart } from "lucide-react";

// ─── ROUTES ──────────────────────────────────────────────────
const ROUTES = {
  home:             "/",
  products:         "/products",
  pharmacies:       "/pharmacies",
  about:            "/about",
  login:            "/login",
  register:         "/regester",
  cart:             "/cart",
  offers:           "/offers",
  categories:       "/categories",
  contact:          "/contact",
  driver:           "/driver",
  partner:          "/partner",
  prescription:     "/prescription",   // رفع الروشتة
  reminders:        "/reminders",      // التذكير بالدواء
  whatsapp:         "/whatsapp",       // استشارة واتساب
  declarations:     "/declarations",   // التصريحات والحساب
};

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85",
    title: "نواقص الأدوية\nتوصيل خلال فتره وجيزة",
    subtitle: "احصل على أدويتك في أسرع وقت مع ضمان الجودة والأصالة من أفضل الصيدليات المعتمدة",
    cta1: { label: "اطلب الآن", route: ROUTES.products },
    cta2: { label: "تعرف أكثر", route: ROUTES.about },
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&q=85",
    title: "توصيل لبابك\nفي 90 دقيقة",
    subtitle: "شبكة واسعة من الصيدليات تضمن وصول دوائك بسرعة وأمان إلى أي مكان في المدينة",
    cta1: { label: "اطلب الآن", route: ROUTES.products },
    cta2: { label: "شاهد الصيدليات", route: ROUTES.pharmacies },
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1400&q=85",
    title: "استشارة طبيب\nمتخصص الآن",
    subtitle: "فريق من أفضل الأطباء والصيادلة المعتمدين متاحون 24/7 للإجابة على استفساراتك",
    cta1: { label: "احجز استشارة", route: ROUTES.contact },
    cta2: { label: "من نحن", route: ROUTES.about },
  },
];

// ─── Categories (من الصورة) ──────────────────────────────────
const categories = [
  { label: "الأدوية",           icon: "💊", route: ROUTES.categories },
  { label: "عناية بالطفل",     icon: "🍼", route: ROUTES.categories },
  { label: "عناية شخصية",      icon: "🧴", route: ROUTES.categories },
  { label: "التجهيزات",        icon: "🩺", route: ROUTES.categories },
  { label: "الفيتامينات",      icon: "💉", route: ROUTES.categories },
  { label: "المستحضرات الطبية",icon: "🏥", route: ROUTES.categories },
];

// ─── Products ────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "بانادول اكسترا اوبتيزورب لتخفيف إضافي مسكن فعال للألم والحمى | 24 قرص",
    genericName: "Paracetamol + Caffeine",
    category: "مسكنات",
    description: "مسكن فعال وسريع للألم وخافض للحرارة، لطيف على المعدة.",
    price: 58.00,
    quantity: 150,
    requiresPrescription: false,
    image: "/imges/panadol_extra.png",
    manufacturer: "جلاكسو سميث كلاين (GSK)",
    oldPrice: "70.00 جنيه",
    tag: "الأكثر مبيعاً",
    route: "/product/1",
  },
  {
    id: 2,
    name: "هيكس ألم جل موضعي مسكن للآلام ومضاد للالتهابات | 50 جرام",
    genericName: "Diclofenac Sodium",
    category: "مسكنات",
    description: "جل موضعي سريع الامتصاص لتخفيف آلام المفاصل والعضلات والظهر.",
    price: 12.50,
    quantity: 80,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
    manufacturer: "الشركة العربية للأدوية (ADCO)",
    oldPrice: null,
    tag: null,
    route: "/product/2",
  },
  {
    id: 3,
    name: "فيتامين سي بريميوم 1000 مجم فوار لتعزيز المناعة | 20 قرص",
    genericName: "Ascorbic Acid + Zinc",
    category: "الفيتامينات",
    description: "أقراص فوارة بنكهة البرتقال لتعزيز صحة الجهاز المناعي ونضارة البشرة.",
    price: 24.99,
    quantity: 120,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
    manufacturer: "إيفا فارما (Eva Pharma)",
    oldPrice: "30.00 جنيه",
    tag: "جديد",
    route: "/product/3",
  },
];

// ─── Pharmacies scroller ──────────────────────────────────────
const pharmacies = [
  { name: "ميدفارم",  logo: "🏪" },
  { name: "دوا كير",  logo: "💚" },
  { name: "فارما بلس",logo: "➕" },
  { name: "هيلث هاب",logo: "🌿" },
  { name: "ميدي ستور",logo: "🔵" },
  { name: "الشفاء",  logo: "☪️" },
  { name: "النهدي",  logo: "🟢" },
  { name: "رعاية",   logo: "❤️" },
];

const stats = [
  { value: "+45",  label: "صيدلية معتمدة" },
  { value: "24/7", label: "دعم فني متخصص" },
  { value: "+12k", label: "منتج طبي"       },
  { value: "+500", label: "مشاركة مباشرة"  },
];

// ═══════════════════════════════════════════════════════════════
//  Shared style
// ═══════════════════════════════════════════════════════════════
const font = "'Tajawal', 'Cairo', sans-serif";
const blue = "#1976d2";
const dark = "#0d1b2e";

// ═══════════════════════════════════════════════════════════════
//  CountdownTimer
// ═══════════════════════════════════════════════════════════════
function CountdownTimer() {
  const [t, setT] = useState({ h: 0, m: 49, s: 1 });
  useEffect(() => {
    const iv = setInterval(() => {
      setT((p) => {
        let { h, m, s } = p;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 0, m: 49, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", direction: "ltr" }}>
      {[{ v: pad(t.h), l: "س" }, { v: pad(t.m), l: "د" }, { v: pad(t.s), l: "ث" }].map((item, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{
            background: dark, color: "#fff", fontWeight: 700,
            fontSize: 18, borderRadius: 6, padding: "3px 8px", minWidth: 36,
            fontFamily: "monospace",
          }}>{item.v}</div>
          <div style={{ fontSize: 9, color: "#888", marginTop: 2 }}>{item.l}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PharmacyScroller
// ═══════════════════════════════════════════════════════════════
function PharmacyScroller() {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    const step = () => {
      pos -= 0.55;
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  const doubled = [...pharmacies, ...pharmacies];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div ref={ref} style={{ display: "flex", gap: 16, width: "max-content", padding: "8px 0" }}>
        {doubled.map((p, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 6, padding: "14px 22px", background: "#fff",
            borderRadius: 12, border: "1px solid #e8edf2", minWidth: 90,
          }}>
            <span style={{ fontSize: 28 }}>{p.logo}</span>
            <span style={{ fontSize: 11, color: "#444", fontWeight: 600, fontFamily: font }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ProductCard Component
// ═══════════════════════════════════════════════════════════════
function ProductCard({ p, cartItems, addToCart, removeFromCart, isFavorite, toggleFavorite, navigate, font, dark, blue }) {
  const [hov, setHov] = useState(false);
  const isAdded = cartItems.some((item) => item.id === String(p.id));

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate(p.route)}
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1.5px solid #e8edf2",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        transform: hov ? "translateY(-8px)" : "none",
        transition: "all 0.3s ease",
        boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      {p.tag && (
        <div style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 2,
          background: "#e53935",
          color: "#fff",
          fontSize: 10,
          fontWeight: 800,
          padding: "3px 10px",
          borderRadius: 20,
        }}>{p.tag}</div>
      )}
      {/* Heart Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite({
            id: String(p.id),
            name: p.name,
            genericName: p.genericName,
            category: p.category,
            description: p.description,
            price: p.price,
            quantity: p.quantity,
            requiresPrescription: p.requiresPrescription,
            image: p.image,
            manufacturer: p.manufacturer
          });
        }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: 34,
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "transform 0.2s ease, background 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {isFavorite(p.id) ? (
          <FaHeart style={{ color: "#e53935", fontSize: 16 }} />
        ) : (
          <FaRegHeart style={{ color: "#7f8c8d", fontSize: 16 }} />
        )}
      </button>
      <div style={{ height: 190, overflow: "hidden", background: "#f0f4f8" }}>
        <img
          src={p.image}
          alt={p.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hov ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />
      </div>
      <div style={{ padding: "16px 16px 20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          <p style={{
            margin: "0 0 8px",
            fontWeight: 700,
            fontSize: 14,
            color: dark,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "40px"
          }}>{p.name}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ color: blue, fontWeight: 800, fontSize: 17 }}>{p.price} جنيه</span>
            {p.oldPrice && (
              <span style={{ color: "#aab0bc", fontSize: 12, textDecoration: "line-through" }}>{p.oldPrice}</span>
            )}
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isAdded) {
              removeFromCart(String(p.id));
            } else {
              addToCart({
                id: String(p.id),
                name: p.name,
                genericName: p.genericName,
                category: p.category,
                description: p.description,
                price: p.price,
                quantity: p.quantity,
                requiresPrescription: p.requiresPrescription,
                image: p.image,
                manufacturer: p.manufacturer
              }, 1);
            }
          }}
          className={`add-to-cart-btn ${isAdded ? "added" : ""}`}
        >
          {isAdded ? (
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
  );
}

// ═══════════════════════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);

  const goTo = (i) => {
    if (i === slide) return;
    setFading(true);
    setTimeout(() => { setSlide(i); setFading(false); }, 420);
  };

  useEffect(() => {
    const iv = setInterval(() => goTo((slide + 1) % heroSlides.length), 5000);
    return () => clearInterval(iv);
  }, [slide]);

  const current = heroSlides[slide];

  return (
    <div dir="rtl" style={{ fontFamily: font, background: "#f4f6f9", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════
          HERO + RIGHT CARDS SECTION
          (مطابق للصورة: صورة على اليسار + كارتين على اليمين)
      ══════════════════════════════════════ */}
      <section style={{
        background: "#fff", padding: "28px 40px 0",
        display: "grid", gridTemplateColumns: "280px 1fr",
        gap: 24, maxWidth: 1160, margin: "0 auto",
        alignItems: "start",
      }}>

        {/* ── Right panel: كارتين + زر ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>

          {/* كارد رفع الروشتة */}
          <div
            onClick={() => navigate(ROUTES.prescription)}
            style={{
              background: "#f8fbff", border: "1.5px solid #e0eaf6",
              borderRadius: 16, padding: "18px 20px", cursor: "pointer",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(25,118,210,0.13)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: dark, marginBottom: 4 }}>
                  رفع الروشتة
                </div>
                <div style={{ fontSize: 12, color: "#637381", lineHeight: 1.6 }}>
                  ارفع روشتتك وسيتم توصيل أدويتك وصرف الوصفات الطبية من أقرب صيدلية معتمدة
                </div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#e8f1fc", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0, marginRight: 12,
              }}>📋</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(ROUTES.prescription); }}
              style={{
                width: "100%", padding: "9px 0",
                background: blue, color: "#fff",
                border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: font,
              }}
            >
              ارفع الروشتة الآن
            </button>
          </div>

          {/* كارد التذكير بالدواء */}
          <div
            onClick={() => navigate(ROUTES.reminders)}
            style={{
              background: "#f8fbff", border: "1.5px solid #e0eaf6",
              borderRadius: 16, padding: "18px 20px", cursor: "pointer",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(25,118,210,0.13)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: dark, marginBottom: 4 }}>
                  تذكير بالدواء
                </div>
                <div style={{ fontSize: 12, color: "#637381", lineHeight: 1.6 }}>
                  ضبّط تذكيرات لمواعيد أدويتك واستقبل إشعارات عبر واتساب أو التطبيق
                </div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#e8f1fc", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0, marginRight: 12,
              }}>🔔</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(ROUTES.reminders); }}
                style={{
                  flex: 1, padding: "8px 0",
                  background: blue, color: "#fff",
                  border: "none", borderRadius: 10,
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                  fontFamily: font,
                }}
              >
                إضافة تذكير
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(ROUTES.whatsapp); }}
                style={{
                  flex: 1, padding: "8px 0",
                  background: "#25D366", color: "#fff",
                  border: "none", borderRadius: 10,
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                  fontFamily: font, display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 4,
                }}
              >
                <span style={{ fontSize: 14 }}>💬</span> واتساب
              </button>
            </div>
          </div>

          {/* كارد التصريحات والحساب */}
          <div
            onClick={() => navigate(ROUTES.declarations)}
            style={{
              background: "#f8fbff", border: "1.5px solid #e0eaf6",
              borderRadius: 16, padding: "16px 20px", cursor: "pointer",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(25,118,210,0.13)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#e8f1fc", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>📊</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: dark }}>التصريحات والحساب</div>
                <div style={{ fontSize: 11, color: "#637381" }}>تابع مصروفاتك الدوائية</div>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(ROUTES.declarations); }}
              style={{
                width: "100%", padding: "9px 0",
                background: dark, color: "#fff",
                border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: font,
              }}
            >
              تفعيل الخدمة الآن
            </button>
          </div>
        </div>

        {/* ── Left panel: Hero Slider ── */}
        <div style={{
          borderRadius: 20, overflow: "hidden",
          position: "relative", height: 380,
          background: "#0d1b2e",
        }}>
          {/* Slide image */}
          <img
            src={current.image}
            alt="hero"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", objectFit: "cover",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.42s ease",
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(8,20,48,0.78) 0%, rgba(8,20,48,0.35) 60%, transparent 100%)",
          }} />

          {/* Text content */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", flexDirection: "column",
            justifyContent: "center", padding: "0 40px",
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}>
            <h1 style={{
              color: "#fff", fontSize: 38, fontWeight: 900,
              margin: "0 0 14px", lineHeight: 1.3,
              whiteSpace: "pre-line", textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}>
              {current.title}
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.82)", fontSize: 14,
              lineHeight: 1.75, margin: "0 0 24px", maxWidth: 440,
            }}>
              {current.subtitle}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => navigate(current.cta1.route)}
                style={{
                  background: blue, color: "#fff",
                  border: "none", padding: "10px 26px", borderRadius: 10,
                  fontWeight: 800, fontSize: 14, cursor: "pointer",
                  fontFamily: font, boxShadow: "0 4px 16px rgba(25,118,210,0.4)",
                }}
              >{current.cta1.label}</button>
              <button
                onClick={() => navigate(current.cta2.route)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(6px)",
                  color: "#fff", border: "1px solid rgba(255,255,255,0.35)",
                  padding: "10px 26px", borderRadius: 10,
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                  fontFamily: font,
                }}
              >{current.cta2.label}</button>
            </div>
          </div>

          {/* Dots only — no arrows */}
          <div style={{
            position: "absolute", bottom: 18, right: "50%",
            transform: "translateX(50%)", zIndex: 3,
            display: "flex", gap: 8, alignItems: "center",
          }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === slide ? 28 : 8, height: 8,
                  borderRadius: 4, border: "none", cursor: "pointer",
                  background: i === slide ? "#fff" : "rgba(255,255,255,0.45)",
                  transition: "all 0.3s ease", padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section style={{ background: "#fff", borderTop: "1px solid #edf0f4", borderBottom: "1px solid #edf0f4", marginTop: 0 }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto", padding: "24px 40px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center",
              borderLeft: i < 3 ? "1px solid #edf0f4" : "none",
            }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: dark }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#8492a6", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "40px 40px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <span style={{ fontSize: 11, color: "#8492a6" }}>تسوّق حسب الفئة</span>
              <h2 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: dark }}>
                فئات الرعاية الصحية
              </h2>
            </div>
            <Link to={ROUTES.categories} style={{ fontSize: 13, color: blue, fontWeight: 700, textDecoration: "none" }}>
              ← عرض جميع الفئات
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14 }}>
            {categories.map((cat, i) => {
              const [hov, setHov] = useState(false);
              return (
                <div
                  key={i}
                  onClick={() => navigate(cat.route)}
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  style={{
                    background: hov ? dark : "#f4f6f9",
                    borderRadius: 16, padding: "22px 10px",
                    textAlign: "center", cursor: "pointer",
                    border: `1.5px solid ${hov ? dark : "#e8edf2"}`,
                    transform: hov ? "translateY(-5px)" : "none",
                    transition: "all 0.28s ease",
                    boxShadow: hov ? "0 10px 28px rgba(13,27,46,0.18)" : "none",
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{cat.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: hov ? "#60aaff" : "#3d4b60" }}>
                    {cat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FLASH DEALS
      ══════════════════════════════════════ */}
      <section style={{ background: "#f4f6f9", padding: "48px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: dark }}>
              عروض حصرية لفترة محدودة
            </h2>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <CountdownTimer />
              <Link to={ROUTES.offers} style={{ fontSize: 13, color: blue, fontWeight: 700, textDecoration: "none" }}>
                ← كل العروض
              </Link>
            </div>
          </div>

          {/* Prev / Next arrows (للـ products) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#fff", border: "1px solid #dde3ec",
              cursor: "pointer", fontSize: 16, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>‹</button>
            <button style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#fff", border: "1px solid #dde3ec",
              cursor: "pointer", fontSize: 16, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>›</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                cartItems={cartItems}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                navigate={navigate}
                font={font}
                dark={dark}
                blue={blue}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PHARMACY SCROLLER
      ══════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "48px 0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 11, color: "#8492a6" }}>شركاؤنا الموثوقون</span>
              <h2 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: dark }}>
                نعمل مع أفضل الصيدليات المعتمدة
              </h2>
            </div>
            <Link to={ROUTES.pharmacies} style={{ fontSize: 13, color: blue, fontWeight: 700, textDecoration: "none" }}>
              ← كل الصيدليات
            </Link>
          </div>
        </div>
        <PharmacyScroller />
      </section>

      {/* ══════════════════════════════════════
          WHY DAWAYA
      ══════════════════════════════════════ */}
      <section style={{ background: "#f4f6f9", padding: "56px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 900, color: dark, marginBottom: 44 }}>
            لماذا يثق بنا الملايين
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.35fr", gap: 24 }}>

            {/* Left 2 trust cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "💳", title: "مدفوعات آمنة", desc: "نضمن حماية بياناتك المالية بأحدث تقنيات التشفير والأمان الإلكتروني" },
                { icon: "✅", title: "صيدليات معتمدة", desc: "نظام صارم للتحقق من جودة المنتجات والمصادر لضمان أعلى معايير السلامة" },
              ].map((t, i) => {
                const [hov, setHov] = useState(false);
                return (
                  <div key={i}
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                      background: "#fff", borderRadius: 18, padding: "24px",
                      border: "1.5px solid #e8edf2",
                      boxShadow: hov ? "0 8px 28px rgba(25,118,210,0.1)" : "none",
                      transform: hov ? "translateY(-3px)" : "none",
                      transition: "all 0.25s",
                    }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12,
                        background: "#eaf1fc", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                      }}>{t.icon}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: dark, marginBottom: 6 }}>{t.title}</div>
                        <div style={{ fontSize: 12, color: "#637381", lineHeight: 1.7 }}>{t.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* استشارات */}
              {(() => {
                const [hov, setHov] = useState(false);
                return (
                  <div
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                      background: "#fff", borderRadius: 18, padding: "24px",
                      border: "1.5px solid #e8edf2",
                      boxShadow: hov ? "0 8px 28px rgba(25,118,210,0.1)" : "none",
                      transform: hov ? "translateY(-3px)" : "none",
                      transition: "all 0.25s",
                    }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12,
                        background: "#eaf1fc", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                      }}>🕐</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: dark, marginBottom: 6 }}>استشارات 24/7</div>
                        <div style={{ fontSize: 12, color: "#637381", lineHeight: 1.7, marginBottom: 10 }}>
                          تواصل مع صيادلة متخصصين في أي وقت ومن أي مكان مجاناً
                        </div>
                        <button
                          onClick={() => navigate(ROUTES.contact)}
                          style={{
                            background: blue, color: "#fff",
                            border: "none", padding: "7px 18px", borderRadius: 8,
                            fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: font,
                          }}
                        >تحدث معنا الآن ←</button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Middle empty column — placeholder for spacing */}
            <div />

            {/* Right: توصيل فائق السرعة (dark card كما في الصورة) */}
            <div style={{
              background: dark, borderRadius: 20, padding: "36px 32px",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 44, marginBottom: 16 }}>🚀</div>
                <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: "0 0 14px" }}>
                  توصيل فائق السرعة
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.85, margin: "0 0 24px" }}>
                  احصل على أدويتك في أقل من 90 دقيقة في أي مكان. شبكتنا تضم أكثر من 45 صيدلية معتمدة تغطي جميع المناطق.
                </p>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: blue, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>👤</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>أكثر من 500k مستخدم</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>يثقون في دوايا يومياً</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(ROUTES.products)}
                  style={{
                    width: "100%", background: blue, color: "#fff",
                    border: "none", padding: "12px 0", borderRadius: 12,
                    fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: font,
                  }}
                >اطلب الآن</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DRIVER / PARTNER CTA
      ══════════════════════════════════════ */}
      <section style={{ background: dark, padding: "60px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48,
            alignItems: "center",
          }}>
            {/* Text */}
            <div>
              {/* Tab pills */}
              <div style={{
                display: "inline-flex", gap: 8, marginBottom: 28,
                background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: 6,
              }}>
                {[
                  { label: "السائق",    route: ROUTES.driver },
                  { label: "الصيدلية", route: ROUTES.partner },
                ].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(tab.route)}
                    style={{
                      background: i === 0 ? blue : "transparent",
                      color: i === 0 ? "#fff" : "rgba(255,255,255,0.55)",
                      border: "none", padding: "8px 20px", borderRadius: 8,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: font,
                      transition: "all 0.2s",
                    }}
                  >{tab.label}</button>
                ))}
              </div>

              <h2 style={{ color: "#fff", fontSize: 34, fontWeight: 900, margin: "0 0 16px", lineHeight: 1.3 }}>
                كن شريكًا لتوصيل دواءًا.{"\n"}اكسب واعمل بمرونة.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.85, margin: "0 0 32px" }}>
                انضم إلى شبكة الموصلين الأسرع نموًا في المنطقة وابدأ في كسب المال فورًا مع جدول عمل مرن يناسبك.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => navigate(ROUTES.driver)} style={{
                  background: blue, color: "#fff", border: "none",
                  padding: "12px 28px", borderRadius: 12, fontWeight: 800, fontSize: 15,
                  cursor: "pointer", fontFamily: font,
                }}>سجّل جوّالك الآن</button>
                <button onClick={() => navigate(ROUTES.about)} style={{
                  background: "transparent", color: "rgba(255,255,255,0.8)",
                  border: "1.5px solid rgba(255,255,255,0.25)", padding: "12px 28px",
                  borderRadius: 12, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: font,
                }}>طوع المزيد</button>
              </div>
            </div>

            {/* Visual panel */}
            <div style={{
              background: "linear-gradient(135deg, #1565c0, #1976d2, #42a5f5)",
              borderRadius: 20, padding: "40px 32px",
              textAlign: "center", minHeight: 300,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20,
            }}>
              <div style={{ fontSize: 72 }}>📊</div>
              <div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#fff" }}>+5,000</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, marginTop: 6 }}>شريك مسجّل بالفعل</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.18)", borderRadius: 14,
                padding: "14px 30px", width: "100%",
              }}>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>متوسط الدخل الشهري</div>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 28, marginTop: 4 }}>8,500 ج.م</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════ */}
      <section style={{ background: blue, padding: "44px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: "0 0 10px" }}>
            ابدأ تجربتك مع دوايا الآن
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, margin: "0 0 26px" }}>
            انضم لأكثر من 500,000 مستخدم يثقون في دوايا لصحتهم اليومية
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => navigate(ROUTES.register)} style={{
              background: "#fff", color: blue, border: "none",
              padding: "13px 32px", borderRadius: 12, fontWeight: 800,
              fontSize: 15, cursor: "pointer", fontFamily: font,
            }}>سجّل معانا مجاناً</button>
            <button onClick={() => navigate(ROUTES.login)} style={{
              background: "transparent", color: "#fff",
              border: "2px solid rgba(255,255,255,0.55)", padding: "13px 32px",
              borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: font,
            }}>تسجيل الدخول</button>
          </div>
        </div>
      </section>

    </div>
  );
}
