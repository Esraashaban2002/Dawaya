import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FileText, Upload, Check, AlertCircle,
  RefreshCw, ShoppingCart, Trash2, ArrowRight,
  Sparkles, ShieldCheck, FileSpreadsheet
} from 'lucide-react';
import { CartContext } from '../Context/CartContext';
import { UserContext } from '../Context/UserContext';
import { savePrescription } from '../services/api';
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

const createPrescriptionSvgUrl = (doctor, patient, date, notes = []) => {
  const notesText = (notes || []).map((n, i) =>
    `<text x="450" y="${140 + i * 26}" fill="%23334155" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="end">• ${String(n).replace(/</g, '').replace(/>/g, '').replace(/"/g, "'")}</text>`
  ).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="340" viewBox="0 0 500 340" fill="none">
    <rect width="500" height="340" rx="16" fill="%23f8fafc"/>
    <rect x="15" y="15" width="470" height="310" rx="12" fill="white" stroke="%23cbd5e1" stroke-width="2"/>
    <text x="450" y="48" fill="%230f172a" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="end">${String(doctor).replace(/"/g, "'")}</text>
    <text x="450" y="68" fill="%2364748b" font-family="sans-serif" font-size="11" text-anchor="end">العيادة التخصصية - باطنة وقلب</text>
    <line x1="30" y1="80" x2="470" y2="80" stroke="%23e2e8f0" stroke-width="2"/>
    <text x="450" y="102" fill="%2364748b" font-family="sans-serif" font-size="11" text-anchor="end">المريض: ${String(patient).replace(/"/g, "'")} | التاريخ: ${date}</text>
    <text x="40" y="125" fill="%231ab5ea" font-family="sans-serif" font-size="26" font-weight="black">Rx</text>
    ${notesText}
    <line x1="30" y1="275" x2="470" y2="275" stroke="%23e2e8f0" stroke-width="1" stroke-dasharray="4"/>
    <text x="40" y="300" fill="%2394a3b8" font-family="sans-serif" font-size="10">التوقيع والخاتم الطبي المعترف به</text>
    <text x="450" y="300" fill="%231ab5ea" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="end">صرف من صيدليات دوايا المعتمدة</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PRESETS = [
  {
    id: "preset-1",
    title: "روشتة علاج الصداع والإنفلونزا",
    doctor: "د. أحمد سمير (استشاري الأمراض الباطنية)",
    date: "11-06-2026",
    patient: "سارة محمد",
    notes: [
      "Panadol Extra tabs - قرص 3 مرات يومياً بعد الأكل",
      "Vitamin C 1000mg effervescent - قرص فوار يومياً صباحاً",
      "Aspirin 81mg - قرص بعد الغداء يومياً"
    ],
    imageUrl: createPrescriptionSvgUrl(
      "د. أحمد سمير (استشاري الأمراض الباطنية)",
      "سارة محمد",
      "11-06-2026",
      ["Panadol Extra tabs - قرص 3 مرات يومياً بعد الأكل", "Vitamin C 1000mg effervescent - قرص فوار يومياً", "Aspirin 81mg - قرص بعد الغداء يومياً"]
    ),
    matches: [
      { detectedName: "Panadol Extra 500mg Tabs", product: PRODUCTS_DB[0], confidence: "99%", quantity: 1, selected: true },
      { detectedName: "Vitamin C 1000mg Effervescent", product: PRODUCTS_DB[2], confidence: "97%", quantity: 1, selected: true },
      { detectedName: "Aspirin 81mg", product: null, confidence: "0%", quantity: 1, selected: false }
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
    imageUrl: createPrescriptionSvgUrl(
      "د. ليلى حسن (أخصائية أمراض العظام والروماتيزم)",
      "محمد عبد الرحمن",
      "10-06-2026",
      ["Hex Pain Gel - دهان موضعي للمفصل 3 مرات يومياً", "Panadol Extra tabs - قرص عند اللزوم لتسكين الألم"]
    ),
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
    imageUrl: createPrescriptionSvgUrl(
      "د. مريم خالد (أخصائية طب الأسرة)",
      "يوسف كريم",
      "09-06-2026",
      ["Vitamin C 1000mg effervescent - قرص فوار في نصف كوب ماء يومياً"]
    ),
    matches: [
      { detectedName: "Vitamin C 1000mg Effervescent", product: PRODUCTS_DB[2], confidence: "98%", quantity: 1, selected: true }
    ]
  },
  {
    id: "preset-4",
    title: "روشتة غير متوفرة (بدون تطابق)",
    doctor: "د. خالد منصور (أخصائي الغدد الصماء)",
    date: "08-06-2026",
    patient: "منى علي",
    notes: [
      "Euthyrox 50mcg - قرص يومياً على الريق",
      "Glucophage 500mg - قرص بعد الغداء يومياً"
    ],
    imageUrl: createPrescriptionSvgUrl(
      "د. خالد منصور (أخصائي الغدد الصماء)",
      "منى علي",
      "08-06-2026",
      ["Euthyrox 50mcg - قرص يومياً على الريق", "Glucophage 500mg - قرص بعد الغداء يومياً"]
    ),
    matches: [
      { detectedName: "Euthyrox 50mcg", product: null, confidence: "0%", quantity: 1, selected: false },
      { detectedName: "Glucophage 500mg", product: null, confidence: "0%", quantity: 1, selected: false }
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

const DEFAULT_PRESCRIPTION_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" rx="16" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="260" rx="12" fill="white" stroke="%23e2e8f0" stroke-width="2"/><path d="M50 60h120M50 90h260M50 120h220M50 150h240M50 180h180" stroke="%23cbd5e1" stroke-width="6" stroke-linecap="round"/><text x="50" y="230" fill="%231ab5ea" font-family="sans-serif" font-size="28" font-weight="bold">Rx</text></svg>`;

const compressImageToBase64 = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve("");
  });
};

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
            const matchesToSet = activePreset.matches.map(m => ({ ...m }));
            setMatches(matchesToSet);
            triggerToast('اكتمل مسح الروشتة بنجاح وتمت مطابقة الأدوية!', 'success');

            // Save to Prescription History
            savePrescription({
              scannedImageUrl: activePreset.imageUrl || DEFAULT_PRESCRIPTION_IMAGE,
              doctorName: activePreset.doctor || "د. أحمد كمال",
              patientName: activePreset.patient || "مريض Dawaya",
              dateIssued: activePreset.date ? new Date(activePreset.date) : new Date(),
              medications: matchesToSet.map(m => ({
                productId: m.product ? (m.product._id || m.product.id) : null,
                name: m.detectedName || m.product?.name || "دواء غير مسمى",
                matchedName: m.product ? m.product.name : (m.detectedName || ""),
                dosageInstructions: "حسب إرشادات الطبيب",
                quantity: m.quantity || 1
              }))
            }).catch(e => console.error("Failed to save prescription history:", e));
          }, 400);
        }
      }, cumulativeTime);
    });
  };

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
      const persistentImage = await compressImageToBase64(imageFile);

      // Save to Prescription History immediately
      savePrescription({
        scannedImageUrl: persistentImage || previewUrl || DEFAULT_PRESCRIPTION_IMAGE,
        doctorName: "د. أحمد كمال",
        patientName: "مريض Dawaya",
        dateIssued: new Date().toISOString(),
        medications: matchedResults.map(m => ({
          productId: m.product ? (m.product._id || m.product.id) : null,
          name: m.detectedName || m.product?.name || "دواء غير مسمى",
          matchedName: m.product ? m.product.name : (m.detectedName || ""),
          dosageInstructions: "حسب إرشادات الطبيب",
          quantity: m.quantity || 1,
          price: m.product?.price || 45
        }))
      }).catch(e => console.error("Failed to save prescription history:", e));

      setTimeout(() => {
        setIsScanning(false);
        setScanFinished(true);
        setMatches(matchedResults);
        triggerToast('اكتمل مسح الروشتة بنجاح وحفظها في السجل!', 'success');
      }, 800);

    } catch (error) {
      console.error("OCR Error:", error);
      setIsScanning(false);
      setScanFinished(false);
      triggerToast('عذراً، فشل مسح وقراءة الروشتة. الرجاء التأكد من جودة الصورة.', 'error');
    }
  };

  const getProductEnglishAliases = (product) => {
    const aliases = [];
    const name = product.name.toLowerCase();
    
    if (name.includes("بانادول")) aliases.push("panadol");
    if (name.includes("أموكسيل") || name.includes("اموكسيل")) aliases.push("amoxil");
    if (name.includes("أوجمنتين") || name.includes("اوجمنتين")) aliases.push("augmentin");
    if (name.includes("بروفين")) aliases.push("brufen");
    if (name.includes("أسبرين") || name.includes("اسبرين")) aliases.push("aspirin");
    if (name.includes("سنتروم")) aliases.push("centrum");
    if (name.includes("أماريل") || name.includes("اماريل")) aliases.push("amaryl");
    if (name.includes("تينول")) aliases.push("tenol");
    if (name.includes("جافيسكون")) aliases.push("gaviscon");
    if (name.includes("زيرتك") || name.includes("زيرتيك")) aliases.push("zyrtec");
    if (name.includes("كومتركس") || name.includes("كوميتريكس") || name.includes("كونتركس") || name.includes("كونتريكس")) aliases.push("comtrex", "contrex");
    if (name.includes("جاست ريج")) aliases.push("just reg");
    if (name.includes("إيموديوم") || name.includes("ايموديوم")) aliases.push("imodium");
    if (name.includes("كونجستال") || name.includes("كونجيستال")) aliases.push("congestal");
    if (name.includes("كتافلام")) aliases.push("cataflam");
    if (name.includes("بوديزونيد")) aliases.push("budesonide");
    if (name.includes("نابروكسين")) aliases.push("naproxen");
    if (name.includes("أزيثرومايسين") || name.includes("ازيثرومايسين")) aliases.push("azithromycin");
    if (name.includes("سيتريزين")) aliases.push("cetirizine");
    if (name.includes("ديسلوراتادين")) aliases.push("desloratadine");
    if (name.includes("دومبيريدون")) aliases.push("domperidone");
    if (name.includes("نوفاليس")) aliases.push("novalges");
    if (name.includes("دسلين")) aliases.push("deceline");
    if (name.includes("كابوتين")) aliases.push("capoten");
    if (name.includes("ميتفورمين")) aliases.push("metformin");
    if (name.includes("فينتولين")) aliases.push("ventolin");
    if (name.includes("ديكلوفيناك")) aliases.push("diclofenac");
    if (name.includes("إريثرومايسين") || name.includes("اريثرومايسين")) aliases.push("erythromycin");
    if (name.includes("تيلفاست")) aliases.push("telfast");
    if (name.includes("رينمارك")) aliases.push("renmark");
    if (name.includes("دوميتل")) aliases.push("domitel");
    if (name.includes("جليبنكلاميد")) aliases.push("glibenclamide");
    if (name.includes("سيريتايد")) aliases.push("seretide");
    if (name.includes("أوميبرازول") || name.includes("اوميبرازول")) aliases.push("omeprazole");
    if (name.includes("يوتيروكس") || name.includes("ايوثيروكس")) aliases.push("euthyrox");
    if (name.includes("جلوكوفاج")) aliases.push("glucophage");
    
    if (product.genericName) {
      aliases.push(product.genericName.toLowerCase());
      const genericWords = product.genericName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['acid', 'sodium', 'potassium', 'chloride', 'hydrate'].includes(w));
      aliases.push(...genericWords);
    }
    
    const englishWordMatches = name.match(/[a-z0-9]+/g);
    if (englishWordMatches) {
      aliases.push(...englishWordMatches.filter(w => w.length > 2));
    }
    
    return Array.from(new Set(aliases));
  };

  const hasWord = (text, word) => {
    const escaped = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp('\\b' + escaped + '\\b', 'i').test(text);
  };

  const cleanDetectedName = (rawLine, fallbackProductName, matchedProduct) => {
    const prod = matchedProduct || {};
    const prodName = prod.name || fallbackProductName || "";
    
    if (!rawLine) return prodName;

    // Check for common English brand names in rawLine or genericName
    const brandPatterns = [
      { regex: /panadol(?:\s*extra|\s*actifast|\s*advance)?/i, name: "Panadol Extra" },
      { regex: /augmentin/i, name: "Augmentin" },
      { regex: /brufen/i, name: "Brufen" },
      { regex: /zyrtec/i, name: "Zyrtec" },
      { regex: /aspirin/i, name: "Aspirin" },
      { regex: /vitamin\s*c/i, name: "Vitamin C" },
      { regex: /amoxil/i, name: "Amoxil" },
      { regex: /cataflam/i, name: "Cataflam" },
      { regex: /congestal/i, name: "Congestal" },
      { regex: /comtrex|contrex/i, name: "Comtrex" },
      { regex: /euthyrox/i, name: "Euthyrox" },
      { regex: /glucophage/i, name: "Glucophage" }
    ];

    const matchedBrand = brandPatterns.find(p => p.regex.test(rawLine));
    
    // Extract dosage if present (e.g. 500mg, 1g, 400mg, 10mg)
    const dosageMatch = rawLine.match(/(\d+\s*(?:mg|g|mcg|ml|iu|gm)\b)/i) || (prodName.match(/(\d+\s*(?:مجم|جم|جرام|ملجم|ميكروجرام)\b)/i));
    let dosage = dosageMatch ? dosageMatch[1].replace(/\s+/, '') : '';
    if (dosage === '1جم' || dosage === '1جرام') dosage = '1g';
    if (dosage === '500مجم' || dosage === '500ملجم') dosage = '500mg';
    if (dosage === '400مجم') dosage = '400mg';
    if (dosage === '10مجم') dosage = '10mg';

    if (matchedBrand) {
      let cleanTitle = matchedBrand.name;
      if (dosage && !cleanTitle.toLowerCase().includes(dosage.toLowerCase())) {
        cleanTitle += ` ${dosage}`;
      }
      return cleanTitle;
    }

    // Check if matchedProduct name has English equivalent or brand
    if (prodName.includes("بانادول")) return dosage ? `Panadol Extra ${dosage}` : "Panadol Extra 500mg";
    if (prodName.includes("أوجمنتين") || prodName.includes("اوجمنتين")) return dosage ? `Augmentin ${dosage}` : "Augmentin 1g";
    if (prodName.includes("بروفين")) return dosage ? `Brufen ${dosage}` : "Brufen 400mg";
    if (prodName.includes("زيرتك") || prodName.includes("زيرتيك")) return dosage ? `Zyrtec ${dosage}` : "Zyrtec 10mg";

    let mainName = rawLine.split(/[-:(]/)[0].trim();
    mainName = mainName.replace(/[^\w\s\u0600-\u06FF.]/gi, '').trim();

    const words = mainName.split(/\s+/);
    const isGarbage = words.some(w => w.length > 10 && !/^\d+$/.test(w)) || words.length > 5;

    if (mainName.length < 3 || isGarbage) {
      return prodName;
    }

    return mainName;
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
      
      const aliases = getProductEnglishAliases(product);
      let bestAlias = null;
      let highestScore = 0;
      let matchedLine = "";
      
      aliases.forEach(alias => {
        if (hasWord(ocrTextLower, alias)) {
          let score = 65;
          
          lines.forEach(line => {
            const lineLower = line.toLowerCase();
            if (hasWord(lineLower, alias)) {
              let lineScore = 75;
              
              const numbersInName = product.name.match(/\d+/g);
              if (numbersInName) {
                let matchedNums = 0;
                numbersInName.forEach(num => {
                  if (lineLower.includes(num)) matchedNums++;
                });
                if (matchedNums > 0) {
                  lineScore += 15;
                }
              }
              
              if (lineScore > score) {
                score = lineScore;
                matchedLine = line;
              }
            }
          });
          
          if (score > highestScore) {
            highestScore = score;
            bestAlias = alias;
          }
        }
      });
      
      if (highestScore >= 70) {
        matched.push({
          detectedName: cleanDetectedName(matchedLine, product.name, product),
          product: product,
          confidence: `${Math.round(highestScore)}%`,
          score: highestScore,
          quantity: 1,
          selected: true
        });
        return;
      }
      
      if (prodNameLower.length > 4 && ocrTextLower.includes(prodNameLower)) {
        matched.push({
          detectedName: cleanDetectedName(product.name, product.name, product),
          product: product,
          confidence: "99%",
          score: 100,
          quantity: 1,
          selected: true
        });
        return;
      }
      
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
            detectedName: cleanDetectedName(bestLine, product.name, product),
            product: product,
            confidence: `${Math.round(score)}%`,
            score: score,
            quantity: 1,
            selected: true
          });
          return;
        }
      }
      
      if (product.genericName) {
        const genericWords = product.genericName.toLowerCase()
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
              detectedName: cleanDetectedName(bestLine, product.name, product),
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
      if (item.product && !seenIds.has(item.product.id)) {
        seenIds.add(item.product.id);
        uniqueMatches.push(item);
      }
    });
    
    const isDrugLine = (line) => {
      const lower = line.toLowerCase().trim();
      
      // Must contain letters
      if (!/[a-zA-Z]/.test(line)) return false;
      
      // Standard header markers to ignore completely
      const headerWords = [
        'dr', 'doctor', 'patient', 'date', 'rx', 'clinic', 'medical', 
        'prescription', 'hospital', 'name', 'age', 'gender', 'tel', 'phone', 'address', 'ref',
        'signature', 'stamp', 'years', 'yrs', 'weight', 'wt', 'diagnosis', 'history',
        'clinics', 'consultant', 'specialist', 'b.sc', 'm.d', 'ph.d', 'care', 'note', 'notes',
        'avoid', 'empty', 'stomach', 'course', 'sig'
      ];
      
      if (headerWords.some(word => lower === word || lower.startsWith(word + ':') || lower.startsWith(word + ' '))) {
        return false;
      }
      
      // Split the line into alphanumeric words
      const words = lower
        .split(/\s+/)
        .map(w => w.replace(/[^a-z0-9]/g, ''))
        .filter(w => w.length > 0);
        
      // Ignore words that are common instruction details
      const instructionWords = [
        'tablet', 'tablets', 'capsule', 'capsules', 'daily', 'times', 'every', 'hours', 'day', 'week', 'month',
        'sign', 'tab', 'tabs', 'caps', 'once', 'twice', 'three', 'hrs', 'dose', 'directions', 'instruction',
        'instructions', 'take', 'with', 'after', 'before', 'food', 'meals', 'meal'
      ];
      
      // Filter out header and instruction words
      const candidateWords = words.filter(w => !headerWords.includes(w) && !instructionWords.includes(w));
      
      if (candidateWords.length === 0) return false;
      
      // Check if we have at least one valid word of length >= 4, or containing a number, or matching a known alias
      const hasValidWord = candidateWords.some(word => {
        // Is it a number? (e.g. 500, 400)
        if (/^\d+$/.test(word)) return true;
        // Is it length >= 4?
        if (word.length >= 4) return true;
        // Is it a known alias from our transliteration (even if short)?
        const isKnown = allProducts.some(product => {
          const aliases = getProductEnglishAliases(product);
          return aliases.includes(word);
        });
        if (isKnown) return true;
        
        return false;
      });
      
      return hasValidWord;
    };

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

    const selectedMatches = matches.filter(m => m.selected && m.product);
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

  const selectedCount = matches.filter(m => m.selected && m.product).length;
  const totalPrice = matches.reduce((acc, m) => {
    if (m.selected && m.product) {
      return acc + (m.product.price * m.quantity);
    }
    return acc;
  }, 0);

  return (
    <div className="cart-page" style={{ background: '#f4f6f9', minHeight: '90vh', paddingBottom: '48px' }}>
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 16px' }}>
        
        {}
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span className="separator">/</span>
          <span className="current">رفع الروشتة ومسحها بالذكاء الاصطناعي</span>
        </nav>

        <div className="cart-items-card animate-fade-in p-4 sm:p-8">
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '28px' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="cart-title" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles style={{ color: 'var(--color-primary)' }} />
                مسح الروشتة الطبية وتوفير العلاج
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '6px' }}>
                ارفع صورة روشتة طبيبك، وسيقوم نظامنا الذكي بقراءة المكونات ومطابقتها فوراً مع الأدوية في صيدليتنا لتطلبها بضغطة زر واحدة.
              </p>
            </div>

            <Link
              to="/prescriptions-history"
              className="inline-flex items-center gap-2 bg-[#e0f7ff] hover:bg-[#cceeff] text-[#1ab5ea] border border-[#1ab5ea]/30 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
            >
              <FileText className="w-4 h-4 text-[#1ab5ea]" />
              <span>روشتاتي السابقة</span>
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            {}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-5">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                1. حدد مستند الروشتة
              </h3>

              {!previewUrl && !activePreset ? (
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="prescription-preview-wrapper" style={{ minHeight: '320px' }}>
                    {}
                    {isScanning && <div className="prescription-scan-line" />}
                    
                    {activePreset ? (
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
                        {}
                        <div 
                          className="flex flex-col sm:flex-row justify-between gap-3"
                          style={{ borderBottom: '2px double #3b82f6', paddingBottom: '12px', marginBottom: '16px' }}
                        >
                          <div>
                            <h4 style={{ margin: 0, fontWeight: 900, color: '#1e3a8a', fontSize: '16px' }}>{activePreset.doctor}</h4>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>عيادات الشفاء التخصصية - باطنة وقلب</span>
                          </div>
                          <div 
                            className="text-right sm:text-left"
                            style={{ fontSize: '11px', color: '#64748b' }}
                          >
                            <div>التاريخ: {activePreset.date}</div>
                            <div>المريض: {activePreset.patient}</div>
                          </div>
                        </div>

                        {}
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

                        {}
                        <div 
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                          style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '16px', fontSize: '11px', color: '#64748b' }}
                        >
                          <span>صرف من صيدليات دوايا المعتمدة</span>
                          <div style={{ textAlign: 'center' }} className="self-center sm:self-auto">
                            <div style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '13px', color: '#1e3a8a' }}>التوقيع والختم</div>
                            <div style={{ borderTop: '1px solid #94a3b8', width: '80px', marginTop: '4px', marginLeft: 'auto', marginRight: 'auto' }}></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={previewUrl} 
                        alt="Prescription preview" 
                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }}
                      />
                    )}
                  </div>

                  {}
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

              {}
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

            {}
            <div className="col-span-12 lg:col-span-6 border-t lg:border-t-0 lg:border-r border-slate-200 pt-8 lg:pt-0 lg:pr-8 flex flex-col gap-5">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                2. مسح وتحليل الروشتة
              </h3>

              {}
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

              {}
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

                  {}
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

              {}
              {scanFinished && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {matches.some(item => item.product !== null) ? (
                    <div style={{
                      background: '#e8f7f0', color: '#10b981', border: '1px solid #a3e635',
                      borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '13px', fontWeight: 800
                    }}>
                      <ShieldCheck size={18} />
                      <span>تم تحليل الروشتة بنجاح! تم العثور على أدوية مطابقة.</span>
                    </div>
                  ) : (
                    <div style={{
                      background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5',
                      borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '13px', fontWeight: 800
                    }}>
                      <AlertCircle size={18} />
                      <span>تم تحليل الروشتة بنجاح! لم يتم العثور على أدوية مطابقة.</span>
                    </div>
                  )}

                  {}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {matches.some(item => item.product !== null) ? (
                      <>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 700 }}>الأدوية المستخرجة والتطابقة المقترحة:</span>
                        {matches.filter(item => item.product !== null).map((item) => {
                          const originalIndex = matches.findIndex(m => m === item);
                          return (
                            <div key={originalIndex} className="matched-item-row">
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={item.selected}
                                  onChange={() => toggleSelectMatch(originalIndex)}
                                  disabled={!item.product}
                                  style={{ 
                                    width: '18px', 
                                    height: '18px', 
                                    cursor: item.product ? 'pointer' : 'not-allowed', 
                                    accentColor: 'var(--color-primary)', 
                                    marginTop: '4px',
                                    opacity: item.product ? 1 : 0.3
                                  }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div 
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2"
                                  >
                                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                                      {item.detectedName}
                                    </span>
                                    <span 
                                      className="match-badge shrink-0 w-fit"
                                    >
                                      نسبة التطابق {item.confidence}
                                    </span>
                                  </div>

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

                                    <div className="qty-stepper" style={{ height: '32px', borderRadius: '8px' }}>
                                      <button 
                                        className="qty-btn" 
                                        style={{ width: '28px' }}
                                        onClick={() => handleQtyChange(originalIndex, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || !item.selected}
                                      >
                                        -
                                      </button>
                                      <span className="qty-number" style={{ fontSize: '13px', minWidth: '20px' }}>{item.quantity}</span>
                                      <button 
                                        className="qty-btn" 
                                        style={{ width: '28px' }}
                                        onClick={() => handleQtyChange(originalIndex, item.quantity + 1)}
                                        disabled={!item.selected}
                                      >
                                        +
                                      </button>
                                    </div>

                                  </div>

                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div 
                        className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-6 text-center space-y-3 text-rose-900 shadow-sm"
                        dir="rtl"
                      >
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-sm text-rose-950">لم يتم العثور على أدوية مطابقة في قاعدة البيانات</h4>
                          <p className="text-xs text-rose-700 font-semibold leading-relaxed max-w-md mx-auto">
                            تأكد من وضوح صورة الروشتة ومقروئية الخط، أو يسعدنا مساعدتك عند التواصل المباشر مع الصيدلي.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {}
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

      {}
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
