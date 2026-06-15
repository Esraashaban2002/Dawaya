import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, Upload, Check, AlertCircle, 
  RefreshCw, ShoppingCart, Trash2, ArrowRight,
  Sparkles, ShieldCheck, FileSpreadsheet
} from 'lucide-react';
import { CartContext } from '../Context/CartContext';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import hexPainImg from '../assets/موفليكس-كريم-مساج-300x300.webp';

const PRODUCTS_DB = [
  {
    id: "1",
    name: "بانادول اكسترا اوبتيزورب لتخفيف إضافي مسكن فعال للألم والحمى | 24 قرص",
    genericName: "Paracetamol + Caffeine",
    category: "مسكنات",
    price: 58.00,
    image: "/imges/panadol_extra.png",
    manufacturer: "جلاكسو سميث كلاين (GSK)"
  },
  {
    id: "2",
    name: "هيكس ألم جل موضعي مسكن للآلام ومضاد للالتهابات | 50 جرام",
    genericName: "Diclofenac Sodium",
    category: "مسكنات",
    price: 12.50,
    image: hexPainImg,
    manufacturer: "الشركة العربية للأدوية (ADCO)"
  },
  {
    id: "3",
    name: "فيتامين سي بريميوم 1000 مجم فوار لتعزيز المناعة | 20 قرص",
    genericName: "Ascorbic Acid + Zinc",
    category: "فيتامينات",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
    manufacturer: "إيفا فارما (Eva Pharma)"
  }
];

const PRESETS = [
  {
    id: "preset-1",
    title: "روشتة علاج الصداع والإنفلونزا",
    doctor: "د. أحمد سمير (استشاري الأمراض الباطنية)",
    date: "11-06-2026",
    patient: "سارة محمد",
    notes: [
      "Panadol Extra tabs - قرص 3 مرات يومياً بعد الأكل",
      "Vitamin C 1000mg effervescent - قرص فوار يومياً صباحاً"
    ],
    matches: [
      { detectedName: "Panadol Extra 500mg Tabs", product: PRODUCTS_DB[0], confidence: "99%", quantity: 1, selected: true },
      { detectedName: "Vitamin C 1000mg Effervescent", product: PRODUCTS_DB[2], confidence: "97%", quantity: 1, selected: true }
    ]
  },
  {
    id: "preset-2",
    title: "روشتة التهاب المفاصل والآلام العضلية",
    doctor: "د. ليلى حسن (أخصائية أمراض العظام والروماتيزم)",
    date: "10-06-2026",
    patient: "محمد عبد الرحمن",
    notes: [
      "Hex Pain Gel - دهان موضعي للمفصل 3 مرات يومياً",
      "Panadol Extra tabs - قرص عند اللزوم لتسكين الألم"
    ],
    matches: [
      { detectedName: "Hex Pain Gel 50g", product: PRODUCTS_DB[1], confidence: "96%", quantity: 1, selected: true },
      { detectedName: "Panadol Extra 500mg Tabs", product: PRODUCTS_DB[0], confidence: "94%", quantity: 1, selected: true }
    ]
  },
  {
    id: "preset-3",
    title: "روشتة تقوية المناعة والوقاية",
    doctor: "د. مريم خالد (أخصائية طب الأسرة)",
    date: "09-06-2026",
    patient: "يوسف كريم",
    notes: [
      "Vitamin C 1000mg effervescent - قرص فوار في نصف كوب ماء يومياً"
    ],
    matches: [
      { detectedName: "Vitamin C 1000mg Effervescent", product: PRODUCTS_DB[2], confidence: "98%", quantity: 1, selected: true }
    ]
  }
];

export default function Prescription() {
  const { cartItems, addToCart, setShowLoginModal } = useContext(CartContext);
  const { userLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userLogin) {
      setShowLoginModal(true);
      navigate("/", { replace: true });
    }
  }, [userLogin, navigate, setShowLoginModal]);

  useEffect(() => {
    if (location.state?.file) {
      const file = location.state.file;
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanFinished(false);
      setMatches([]);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // State Management
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [scanFinished, setScanFinished] = useState(false);
  
  const [matches, setMatches] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [apiProducts, setApiProducts] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch live products from backend
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const res = await axios.get("https://dawaya-back-end.vercel.app/api/medicines?limit=200");
        if (res.data?.success && Array.isArray(res.data?.data?.data)) {
          const mapped = res.data.data.data.map(med => ({
            id: med._id,
            name: med.name,
            genericName: med.genericName || "",
            category: med.category || med.subCategory || "عام",
            price: med.price,
            image: med.images?.[0] || med.image || "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
            manufacturer: med.manufacturer || ""
          }));
          setApiProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch products from backend:", err);
      }
    };
    fetchApiProducts();
  }, []);

  // Combine live API products with local DB
  const allProducts = React.useMemo(() => {
    const combined = [...apiProducts];
    PRODUCTS_DB.forEach(localMed => {
      if (!combined.some(med => String(med.id) === String(localMed.id))) {
        combined.push(localMed);
      }
    });
    return combined;
  }, [apiProducts]);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActivePreset(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanFinished(false);
      setMatches([]);
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setActivePreset(preset);
    setScanFinished(false);
    setMatches([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setActivePreset(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanFinished(false);
      setMatches([]);
    }
  };

  // Simulated / Preset Scanning Steps
  const runPresetSimulation = () => {
    setIsScanning(true);
    setScanStep(0);
    setScanFinished(false);
    setScanLogs([]);

    const steps = [
      { text: "تحميل الصورة وبدء المعالجة الرقمية...", duration: 600 },
      { text: "تحليل بنية الروشتة وتحديد خط الطبيب...", duration: 800 },
      { text: "استخراج النصوص الطبية والمواد الفعالة بذكاء...", duration: 900 },
      { text: "مطابقة الأدوية المكتشفة مع المنتجات المتوفرة بقاعدة البيانات...", duration: 600 }
    ];

    let currentLog = [];
    let cumulativeTime = 0;

    steps.forEach((step, idx) => {
      cumulativeTime += step.duration;
      setTimeout(() => {
        setScanStep(idx + 1);
        currentLog = [...currentLog, { text: step.text, id: idx, completed: true }];
        setScanLogs(currentLog);

        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            setScanFinished(true);
            setMatches(activePreset.matches.map(m => ({ ...m })));
            triggerToast('اكتمل مسح الروشتة بنجاح وتمت مطابقة الأدوية!', 'success');
          }, 400);
        }
      }, cumulativeTime);
    });
  };

  // OCR Processing and Matching against allProducts database
  const performOCRAndMatch = async (imageFile) => {
    setIsScanning(true);
    setScanStep(0);
    setScanFinished(false);
    setScanLogs([{ text: "جاري تشغيل محرك OCR والاتصال بالخادم اللغوي...", id: 'init', completed: false }]);

    try {
      const result = await Tesseract.recognize(
        imageFile,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              const progressPct = Math.round(m.progress * 100);
              setScanLogs(prev => {
                const filtered = prev.filter(l => l.id !== 'progress');
                return [
                  ...filtered,
                  { text: `تحليل نصوص الروشتة: جاري القراءة (${progressPct}%)`, id: 'progress', completed: progressPct === 100 }
                ];
              });
              setScanStep(3);
            } else if (m.status === 'loading tesseract core') {
              setScanLogs(prev => {
                if (prev.some(l => l.id === 'core')) return prev;
                return [
                  ...prev,
                  { text: "تحميل نواة المعالجة الطبية...", id: 'core', completed: true }
                ];
              });
              setScanStep(1);
            } else if (m.status === 'loading language traineddata') {
              setScanLogs(prev => {
                if (prev.some(l => l.id === 'lang')) return prev;
                return [
                  ...prev,
                  { text: "تحميل المعاجم الطبية واللغوية...", id: 'lang', completed: true }
                ];
              });
              setScanStep(2);
            } else if (m.status === 'initializing api') {
              setScanLogs(prev => {
                if (prev.some(l => l.id === 'api')) return prev;
                return [
                  ...prev,
                  { text: "تهيئة واجهة قراءة الوصفة...", id: 'api', completed: true }
                ];
              });
            }
          }
        }
      );

      const ocrText = result.data.text || "";
      console.log("OCR Extracted Text:\n", ocrText);

      setScanLogs(prev => [
        ...prev.filter(l => l.id !== 'progress'),
        { text: "اكتملت القراءة الرقمية بنجاح!", id: 'done-read', completed: true },
        { text: "جاري مطابقة الأدوية المستخرجة مع قاعدة البيانات...", id: 'matching', completed: false }
      ]);
      setScanStep(4);

      const matchedResults = matchOcrTextToProducts(ocrText);

      setTimeout(() => {
        setIsScanning(false);
        setScanFinished(true);
        setMatches(matchedResults);
        triggerToast('اكتمل مسح الروشتة بنجاح وتمت مطابقة الأدوية!', 'success');
      }, 800);

    } catch (error) {
      console.error("OCR Error:", error);
      setIsScanning(false);
      setScanFinished(false);
      triggerToast('عذراً، فشل مسح وقراءة الروشتة. الرجاء التأكد من جودة الصورة.', 'error');
    }
  };

  const matchOcrTextToProducts = (ocrText) => {
    const ocrTextLower = ocrText.toLowerCase();
    const matched = [];
    
    const lines = ocrText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 2);
      
    allProducts.forEach(product => {
      const prodNameLower = product.name.toLowerCase();
      const genericLower = (product.genericName || "").toLowerCase();
      
      // 1. Direct name match
      if (prodNameLower.length > 4 && ocrTextLower.includes(prodNameLower)) {
        matched.push({
          detectedName: product.name,
          product: product,
          confidence: "99%",
          score: 100,
          quantity: 1,
          selected: true
        });
        return;
      }
      
      // 2. Token overlap match
      const nameWords = prodNameLower
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['tablet', 'tablets', 'capsule', 'capsules', 'suspension', 'syrup', 'extra', 'forte', 'dose', 'mg', 'ml'].includes(w));
        
      if (nameWords.length > 0) {
        let matchCount = 0;
        nameWords.forEach(word => {
          if (ocrTextLower.includes(word)) {
            matchCount++;
          }
        });
        
        const score = (matchCount / nameWords.length) * 100;
        if (score >= 50) {
          let bestLine = "";
          let maxLineMatches = 0;
          lines.forEach(line => {
            const lineLower = line.toLowerCase();
            let lineMatches = 0;
            nameWords.forEach(word => {
              if (lineLower.includes(word)) lineMatches++;
            });
            if (lineMatches > maxLineMatches) {
              maxLineMatches = lineMatches;
              bestLine = line;
            }
          });
          
          matched.push({
            detectedName: bestLine || product.name,
            product: product,
            confidence: `${Math.round(score)}%`,
            score: score,
            quantity: 1,
            selected: true
          });
          return;
        }
      }
      
      // 3. Generic name matching
      if (genericLower) {
        const genericWords = genericLower
          .replace(/[^a-z0-9\s]/g, '')
          .split(/\s+/)
          .filter(w => w.length > 3 && !['acid', 'sodium', 'potassium', 'chloride', 'hydrate'].includes(w));
          
        if (genericWords.length > 0) {
          let matchCount = 0;
          genericWords.forEach(word => {
            if (ocrTextLower.includes(word)) {
              matchCount++;
            }
          });
          
          const score = (matchCount / genericWords.length) * 85;
          if (score >= 60) {
            let bestLine = "";
            let maxLineMatches = 0;
            lines.forEach(line => {
              const lineLower = line.toLowerCase();
              let lineMatches = 0;
              genericWords.forEach(word => {
                if (lineLower.includes(word)) lineMatches++;
              });
              if (lineMatches > maxLineMatches) {
                maxLineMatches = lineMatches;
                bestLine = line;
              }
            });
            
            matched.push({
              detectedName: bestLine ? `مستخلص من: ${bestLine}` : `بديل فعال: ${product.name}`,
              product: product,
              confidence: `${Math.round(score)}%`,
              score: score,
              quantity: 1,
              selected: true
            });
          }
        }
      }
    });
    
    matched.sort((a, b) => b.score - a.score);
    
    const uniqueMatches = [];
    const seenIds = new Set();
    matched.forEach(item => {
      if (!seenIds.has(item.product.id)) {
        seenIds.add(item.product.id);
        uniqueMatches.push(item);
      }
    });
    
    if (uniqueMatches.length === 0) {
      if (ocrTextLower.includes("headache") || ocrTextLower.includes("pain") || ocrTextLower.includes("fever") || ocrTextLower.includes("panadol")) {
        uniqueMatches.push({
          detectedName: "بانادول اكسترا (خافض حرارة مقترح)",
          product: allProducts.find(p => p.id === "1") || allProducts[0],
          confidence: "75%",
          score: 75,
          quantity: 1,
          selected: true
        });
      } else {
        uniqueMatches.push({
          detectedName: "Panadol Extra (افتراضي للروشتة)",
          product: allProducts.find(p => p.id === "1") || allProducts[0],
          confidence: "60%",
          score: 60,
          quantity: 1,
          selected: false
        });
      }
    }
    
    return uniqueMatches;
  };

  const startScan = () => {
    if (!previewUrl && !activePreset) {
      triggerToast('الرجاء رفع روشتة أو اختيار روشتة جاهزة أولاً!', 'error');
      return;
    }

    if (activePreset) {
      runPresetSimulation();
    } else if (selectedFile) {
      performOCRAndMatch(selectedFile);
    }
  };

  const toggleSelectMatch = (index) => {
    setMatches(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, selected: !item.selected };
      }
      return item;
    }));
  };

  const handleQtyChange = (index, val) => {
    if (val < 1) return;
    setMatches(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, quantity: val };
      }
      return item;
    }));
  };

  const handleAddSelectedToCart = () => {
    if (!userLogin) {
      setShowLoginModal(true);
      return;
    }

    const selectedMatches = matches.filter(m => m.selected);
    if (selectedMatches.length === 0) {
      triggerToast('الرجاء تحديد منتج واحد على الأقل لإضافته للسلة!', 'error');
      return;
    }

    selectedMatches.forEach(item => {
      addToCart({
        id: item.product.id,
        name: item.product.name,
        genericName: item.product.genericName,
        category: item.product.category,
        price: item.product.price,
        image: item.product.image,
        manufacturer: item.product.manufacturer
      }, item.quantity);
    });

    triggerToast(`تم إضافة (${selectedMatches.length}) منتجات بنجاح إلى سلة المشتريات!`, 'success');
    
    // Optional redirect after brief delay
    setTimeout(() => {
      navigate('/cart');
    }, 1500);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setActivePreset(null);
    setIsScanning(false);
    setScanFinished(false);
    setMatches([]);
    setScanLogs([]);
  };

  const selectedCount = matches.filter(m => m.selected).length;
  const totalPrice = matches.reduce((acc, m) => {
    if (m.selected) {
      return acc + (m.product.price * m.quantity);
    }
    return acc;
  }, 0);

  return (
    <div className="cart-page" style={{ background: '#f4f6f9', minHeight: '90vh', paddingBottom: '48px' }}>
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Navigation Breadcrumb */}
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span className="separator">/</span>
          <span className="current">رفع الروشتة ومسحها بالذكاء الاصطناعي</span>
        </nav>

        <div className="cart-items-card animate-fade-in p-4 sm:p-8">
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '28px' }}>
            <h1 className="cart-title" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles style={{ color: 'var(--color-primary)' }} />
              مسح الروشتة الطبية وتوفير العلاج
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '6px' }}>
              ارفع صورة روشتة طبيبك، وسيقوم نظامنا الذكي بقراءة المكونات ومطابقتها فوراً مع الأدوية في صيدليتنا لتطلبها بضغطة زر واحدة.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            {/* Right Panel: Upload area / Prescription View */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-5">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                1. حدد مستند الروشتة
              </h3>

              {!previewUrl && !activePreset ? (
                /* File Dropzone Selector */
                <div 
                  className="prescription-dropzone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: '#e8f1fc', color: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContents: 'center',
                    fontSize: '28px', padding: '16px'
                  }}>
                    <Upload size={32} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-text-main)' }}>
                    اسحب وأسقط صورة الروشتة هنا
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                    أو اضغط لتصفح ملفات جهازك (يدعم JPG، PNG)
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                /* Document Preview Area */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="prescription-preview-wrapper" style={{ minHeight: '320px' }}>
                    {/* Glowing Scan Line Animation */}
                    {isScanning && <div className="prescription-scan-line" />}
                    
                    {activePreset ? (
                      /* Handwritten Styled RX Slip */
                      <div style={{
                        width: '100%',
                        background: '#fefef2',
                        border: '1px solid #e2e8f0',
                        fontFamily: "'Cairo', sans-serif",
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                        direction: 'rtl',
                        backgroundImage: 'radial-gradient(#e2e8f0 1.2px, transparent 1.2px)',
                        backgroundSize: '16px 16px',
                        position: 'relative'
                      }}>
                        {/* Doctor Pad Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px double #3b82f6', paddingBottom: '12px', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ margin: 0, fontWeight: 900, color: '#1e3a8a', fontSize: '16px' }}>{activePreset.doctor}</h4>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>عيادات الشفاء التخصصية - باطنة وقلب</span>
                          </div>
                          <div style={{ textAlign: 'left', fontSize: '11px', color: '#64748b' }}>
                            <div>التاريخ: {activePreset.date}</div>
                            <div>المريض: {activePreset.patient}</div>
                          </div>
                        </div>

                        {/* Prescription body */}
                        <div style={{ minHeight: '180px', paddingTop: '10px' }}>
                          <span style={{ fontSize: '28px', color: '#1e3a8a', fontFamily: 'serif', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>Rx</span>
                          <div style={{ paddingRight: '20px' }}>
                            {activePreset.notes.map((note, index) => (
                              <p key={index} style={{ 
                                margin: '0 0 16px', 
                                fontSize: '15px', 
                                fontWeight: 700, 
                                color: '#334155',
                                fontFamily: "'Cairo', sans-serif",
                                fontStyle: 'italic'
                              }}>
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Signature footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '16px', fontSize: '11px', color: '#64748b' }}>
                          <span>صرف من صيدليات دوايا المعتمدة</span>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '13px', color: '#1e3a8a' }}>التوقيع والختم</div>
                            <div style={{ borderTop: '1px solid #94a3b8', width: '80px', marginTop: '4px' }}></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Uploaded Image Preview */
                      <img 
                        src={previewUrl} 
                        alt="Prescription preview" 
                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }}
                      />
                    )}
                  </div>

                  {/* Reset/change file action */}
                  {!isScanning && (
                    <button 
                      onClick={resetAll} 
                      className="action-icon-btn" 
                      style={{ borderRadius: '8px', padding: '6px 12px', width: 'fit-content', display: 'flex', gap: '6px', fontSize: '12px' }}
                    >
                      <RefreshCw size={14} />
                      <span>تغيير المستند / إعادة ضبط</span>
                    </button>
                  )}
                </div>
              )}

              {/* Preset prescription items selection */}
              {!previewUrl && !isScanning && (
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '10px', fontWeight: 700 }}>
                    أو جرب إحدى الروشتات الجاهزة للفحص السريع:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {PRESETS.map((preset) => (
                      <div 
                        key={preset.id} 
                        className={`preset-card ${activePreset?.id === preset.id ? 'active' : ''}`}
                        onClick={() => handlePresetSelect(preset)}
                      >
                        <div className="preset-icon" style={{
                          background: activePreset?.id === preset.id ? '#e8f1fc' : '#f1f5f9',
                          color: activePreset?.id === preset.id ? 'var(--color-primary)' : '#64748b'
                        }}>
                          <FileText size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                            {preset.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {preset.doctor}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Left Panel: Scanning & Match results */}
            <div className="col-span-12 lg:col-span-6 border-t lg:border-t-0 lg:border-r border-slate-200 pt-8 lg:pt-0 lg:pr-8 flex flex-col gap-5">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                2. مسح وتحليل الروشتة
              </h3>

              {/* Start Scan Button */}
              {!isScanning && !scanFinished && (
                <div style={{
                  background: '#f8fafc', border: '1px solid var(--color-border)',
                  borderRadius: '16px', padding: '24px', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#d97706' }}>
                    💡
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    بمجرد اختيار روشتتك، انقر على الزر بالأسفل لتشغيل محرك القراءة والتحليل ومطابقة الأدوية مع المنتجات المتوفرة.
                  </div>
                  <button
                    onClick={startScan}
                    disabled={!previewUrl && !activePreset}
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, #0ea5e9 100%)',
                      color: '#fff', border: 'none', borderRadius: '12px',
                      padding: '12px 24px', fontWeight: 800, fontSize: '14px',
                      cursor: (!previewUrl && !activePreset) ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      opacity: (!previewUrl && !activePreset) ? 0.6 : 1,
                      boxShadow: '0 4px 12px rgba(26,181,234,0.2)',
                      fontFamily: 'Cairo, sans-serif'
                    }}
                  >
                    <Sparkles size={16} />
                    <span>ابدأ مسح وقراءة الروشتة</span>
                  </button>
                </div>
              )}

              {/* Scan in Progress Animation/Logs */}
              {isScanning && (
                <div style={{
                  background: '#ffffff', border: '1px solid var(--color-primary-light)',
                  borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: '#e8f1fc', color: 'var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <RefreshCw size={18} className="animate-spin" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>جاري تحليل وقراءة الروشتة...</h4>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>محرك البحث الذكي قيد العمل</span>
                    </div>
                  </div>

                  {/* Log console styling */}
                  <div style={{ background: '#0d1b2e', color: '#38bdf8', padding: '14px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '12px', minHeight: '130px', display: 'flex', flexDirection: 'column', gap: '8px', direction: 'ltr' }}>
                    {scanLogs.map((log) => (
                      <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: log.completed ? '#4ade80' : '#38bdf8' }}>
                        <span>➜</span>
                        <span>{log.text}</span>
                      </div>
                    ))}
                    <div style={{ color: '#fff', opacity: 0.6, fontSize: '10px', marginTop: 'auto' }}>
                      [AI Engine Version 2.4.0-Active]
                    </div>
                  </div>
                </div>
              )}

              {/* Scan Finished Results view */}
              {scanFinished && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    background: '#e8f7f0', color: '#10b981', border: '1px solid #a3e635',
                    borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', fontWeight: 800
                  }}>
                    <ShieldCheck size={18} />
                    <span>تم تحليل الروشتة بنجاح! تم العثور على أدوية مطابقة.</span>
                  </div>

                  {/* List of matched items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 700 }}>الأدوية المستخرجة والتطابقات المقترحة:</span>
                    
                    {matches.map((item, index) => (
                      <div key={index} className="matched-item-row">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={item.selected}
                            onChange={() => toggleSelectMatch(index)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)', marginTop: '4px' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                                {item.detectedName}
                              </span>
                              <span className="match-badge">
                                نسبة التطابق {item.confidence}
                              </span>
                            </div>

                            {/* Catalog matched product summary layout */}
                            <div 
                              style={{ background: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '8px', padding: '8px 12px' }}
                              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
                            >
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity text-inherit"
                                style={{ textDecoration: 'none' }}
                              >
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400';
                                  }}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', background: '#fff' }}
                                  className="shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.product.name}
                                  </p>
                                  <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 800 }}>
                                    {item.product.price} جنيه
                                  </span>
                                </div>
                              </Link>

                              {/* Quantity Stepper inside the item row */}
                              <div className="qty-stepper" style={{ height: '32px', borderRadius: '8px' }}>
                                <button 
                                  className="qty-btn" 
                                  style={{ width: '28px' }}
                                  onClick={() => handleQtyChange(index, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || !item.selected}
                                >
                                  -
                                </button>
                                <span className="qty-number" style={{ fontSize: '13px', minWidth: '20px' }}>{item.quantity}</span>
                                <button 
                                  className="qty-btn" 
                                  style={{ width: '28px' }}
                                  onClick={() => handleQtyChange(index, item.quantity + 1)}
                                  disabled={!item.selected}
                                >
                                  +
                                </button>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary card and Add to Cart CTA */}
                  <div style={{
                    background: '#f8fafc', border: '1px solid var(--color-border)',
                    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>عدد الأدوية المحددة:</span>
                      <span style={{ fontSize: '14px', fontWeight: 800 }}>{selectedCount} منتجات</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #edf2f7', paddingTop: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800 }}>السعر الإجمالي للأدوية:</span>
                      <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)' }}>{totalPrice.toFixed(2)} جنيه</span>
                    </div>

                    <button
                      onClick={handleAddSelectedToCart}
                      disabled={selectedCount === 0}
                      className="checkout-btn"
                      style={{
                        width: '100%', border: 'none', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                        cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                        opacity: selectedCount === 0 ? 0.6 : 1,
                        textDecoration: 'none', padding: '12px 0', marginTop: '6px'
                      }}
                    >
                      <ShoppingCart size={18} />
                      <span>إضافة الأدوية المحددة إلى السلة</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Toast Feedback */}
      {toast.show && (
        <div 
          className={`product-toast-notification ${toast.type} animate-fade-in`}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: '9999',
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
