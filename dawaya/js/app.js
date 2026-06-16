// Dawaya Healthcare Marketplace - Frontend Application Controller & Router

const LOGO_SVG_MARK = `
<svg class="logo-svg" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 8px rgba(15, 98, 254, 0.25));">
  <defs>
    <linearGradient id="brand-logo-gradient" x1="30" y1="190" x2="190" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0a369d" />
      <stop offset="50%" stop-color="#0f62fe" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <path d="M 85,60 C 85,45 95,35 110,35 C 125,35 135,45 135,60 C 135,75 145,85 160,85 C 175,85 185,95 185,110 C 185,125 175,135 160,135 C 145,135 135,145 135,160 C 135,175 125,185 110,185 C 95,185 85,175 85,160 C 85,145 75,135 60,135 C 45,135 35,125 35,110 C 35,95 45,85 60,85 C 75,85 85,75 85,60 Z" stroke="url(#brand-logo-gradient)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <polygon points="35,169 49,177 49,193 35,201 21,193 21,177" fill="url(#brand-logo-gradient)" />
  <circle cx="35" cy="185" r="4.5" fill="#ffffff" />
  <path d="M 50,170 L 95,125 C 103,117 115,117 123,125 C 131,133 131,145 123,153 L 110,140" stroke="url(#brand-logo-gradient)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <path d="M 170,50 L 125,95 C 117,103 105,103 97,95 C 89,87 89,75 97,67 L 110,80" stroke="url(#brand-logo-gradient)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <polygon points="185,19 199,27 199,43 185,51 171,43 171,27" fill="url(#brand-logo-gradient)" />
  <path d="M 179,41 L 191,29 M 184,29 L 191,29 L 191,36" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>        
`;
const renderMedicineImage = (imgSrc, styleStr = "") => {
  if (imgSrc && (imgSrc.startsWith("images/") || imgSrc.endsWith(".png") || imgSrc.endsWith(".jpg"))) {
    return `<img src="${imgSrc}" alt="Medicine Image" style="${styleStr}" />`;
  }
  return imgSrc; // Return original emoji
};

document.addEventListener("DOMContentLoaded", () => {
  // --- CORE STATE ---
  const state = {
    theme: "light",
    language: "en", // en, ar
    activeRole: "public", // public, patient, pharmacy, admin
    activeScreen: "landing", // public: landing, about, contact, login, register, forgot-pw | patient: home, search, details, upload, cart, orders, reminders, favorites, profile, settings | pharmacy: home, inventory, orders, analytics, profile | admin: overview, approvals, users, pharmacies, system
    cart: [], // items: { medicineId, quantity, pharmacyId, unitPrice }
    selectedPharmacyId: "pharm-1", // chosen comparison pharmacy
    reminders: [...MOCK_INITIAL_REMINDERS],
    orders: [...MOCK_INITIAL_ORDERS],
    pharmacies: [...INITIAL_PHARMACIES],
    medicines: [...INITIAL_MEDICINES],
    tickets: [...MOCK_SUPPORT_TICKETS],
    currentUser: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phone: "+201011122233",
      address: "Apartment 14, 5th Floor, 10 Zamalek Towers, Cairo",
      age: 28,
      gender: "Male",
      password: "Password@123",
      avatar: "👤"
    },
    activePharmacySession: "pharm-1", // current logged-in pharmacy ID for pharmacy view
    currentHeroSlide: 0,
    searchQuery: "",
    platformCommission: 4.5,
    loyaltyPoints: 450,
    cashback: 75.00,
    activeCoupon: null,
    insuranceCard: "",
    insuranceProvider: "",
    activeConsultations: [],
    activeLabBookings: [],
    activeCoupons: [
      { code: "WELCOME10", discount: 10 },
      { code: "HEALTHY15", discount: 15 }
    ],
    staff: [
      { id: "staff-1", name: "Dr. Hisham Zaki", role: "Manager", permissions: { dispenseRx: true, packOrders: true, editBilling: true } },
      { id: "staff-2", name: "Amr Nabil", role: "Pharmacist", permissions: { dispenseRx: true, packOrders: true, editBilling: false } },
      { id: "staff-3", name: "Mariam Sherif", role: "Packer", permissions: { dispenseRx: false, packOrders: true, editBilling: false } }
    ]
  };

  // --- TRANSLATION MAPS ---
  const TRANSLATIONS = {
    en: {
      brand_name: "Dawaya",
      brand_subtitle: "System for Pharmacy Network",
      home: "Home",
      about_us: "About Us",
      contact: "Contact Support",
      sign_in: "Sign In",
      register_pharmacy: "Register Pharmacy",
      search_placeholder: "Search for medicine, brand, ingredients...",
      search_btn: "Search",
      filter_all: "All Categories",
      filter_product: "Product Name",
      filter_pharmacy: "Pharmacy Name",
      filter_ingredient: "Active Ingredients",
      filter_category: "Category",
      cart: "Cart",
      logout: "Logout",
      welcome_back: "Welcome back",
      role_patient: "Patient",
      role_pharmacy: "Pharmacy Panel",
      role_admin: "Admin Dashboard",
      today_is: "Today is",

      // Hero Promo Slider
      hero_badge: "🏥 Modern Smart Pharmacy Marketplace",
      hero_title: "Find Medicines & Compare Prices Instantly",
      hero_subtitle: "Dawaya aggregates licensed local pharmacies to deliver prescriptions, monitor prices, and schedule automated medication updates on WhatsApp.",
      hero_search_hint: "Try searching for",
      fast_delivery: "Fast Delivery",
      under_30: "Under 30 Minutes Avg.",

      // How it works
      how_it_works: "How Dawaya Works",
      how_it_works_sub: "Three simple steps to order medications securely and manage reminders.",
      step1_title: "1. Search & Compare",
      step1_desc: "Type in your required medicine or supplement. Instantly view real-time prices from licensed pharmacies in your zone.",
      step2_title: "2. OCR Rx Upload",
      step2_desc: "Upload a photo of your doctor's prescription. Our optical scanning system detects medications automatically and loads price reviews.",
      step3_title: "3. WhatsApp Reminders",
      step3_desc: "Receive automatic medication schedules directly on your phone. Stay healthy and confirm intake statuses instantly.",

      // WhatsApp Reminder Showcase
      whatsapp_badge: "Exclusive Feature Showcase",
      whatsapp_title: "WhatsApp Automated Reminders System",
      whatsapp_desc: "Our state-of-the-art notifications integration ensures that no patient misses a dosage. Set up complex recurring frequencies in under 30 seconds.",
      whatsapp_bullet1_title: "Simple Intake Controls",
      whatsapp_bullet1_desc: "Reply to the chat with quick integers to record history instantly without opening the app.",
      whatsapp_bullet2_title: "Dynamic Dosage Customizations",
      whatsapp_bullet2_desc: "Supports arbitrary recurring cycles, liquid strengths, tablet cuts, and precise hour triggers.",
      whatsapp_try_btn: "Try Reminders Feature Now",

      // Testimonials
      testimonials_title: "What Our Community Says",
      testimonials_sub: "Reviewed by registered doctors, patients, and pharmacy operators.",
      testimonials_coming_soon: "Coming Soon",

      // FAQs
      faqs_title: "Frequently Asked Questions",
      faqs_sub: "Find answers to common questions about using the Dawaya marketplace.",

      // Contact Us
      contact_title: "Contact Dawaya Support",
      contact_sub: "Have technical questions, price discrepancy concerns, or billing queries? Send us a ticket.",
      name_label: "Full Name",
      email_label: "Email Address",
      subject_label: "Issue Subject",
      message_label: "Message Details",
      submit_inquiry: "Submit Inquiry",
      contact_office: "Headquarters Office",
      contact_channels: "Support Channels",

      // Login
      login_title: "Welcome Back",
      login_sub: "Please select a profile role to login instantly",
      login_role_label: "Login Profile Role",
      password_label: "Password",
      forgot_password: "Forgot Password?",
      enter_dashboard: "Enter Dashboard",
      no_account: "Don't have a pharmacy or user profile yet?",
      register_now: "Register Now",
      forgot_pw_title: "Forgot Password",
      forgot_pw_sub: "Enter your email address and we’ll send you an OTP code to reset your password.",
      email_placeholder: "Enter your email",
      send_otp: "Send OTP",
      back_to_login: "Back to Login",
      otp_sent_success: "OTP code sent to your email",
      please_enter_valid_email: "Please enter a valid email address",
      sending_otp_loading: "Sending...",

      // Register
      reg_title: "Create Dawaya Profile",
      reg_sub: "Register your medical profile or apply as a retail pharmacy partner",
      reg_patient_tab: "Register Patient",
      reg_pharm_tab: "Register Pharmacy",
      whatsapp_label: "WhatsApp Number (For medication reminders)",
      address_label: "Street Address (For diagnostics mapping)",
      complete_reg: "Complete Registration",
      reg_pharm_name_label: "Registered Pharmacy Name",
      reg_pharm_address_label: "Store Street Address",
      reg_pharm_license_label: "Ministry of Health License ID Number",
      reg_pharm_upload_label: "Upload Ministry of Health License Document (Mock Upload)",
      click_to_simulate: "Click to simulate file attachment",
      apply_pharm_setup: "Apply Pharmacy Setup",
      already_registered: "Already registered?",
      login_here: "Log In",

      // Footer
      footer_desc: "The complete modern healthcare marketplace connecting patients with licensed retail pharmacies for price checking, prescription scanning, and WhatsApp reminder schedules.",
      footer_roles: "Marketplace Roles",
      footer_pages: "Public Pages",
      footer_regulatory: "Regulatory Authority",
      footer_regulatory_desc: "Dawaya works exclusively with Ministry of Health authorized retail pharmacists. Licensed credentials are fully validated before databases are propagated.",
      footer_copyright: "Dawaya Healthcare Marketplace Platform. All rights reserved.",

      // Other UI keys
      please_enter_search: "Please enter a medicine name to search",
      browse_medicines: "Browse Medicines",
      rx_required: "Rx Required",
      otc: "OTC",
      compare_order: "Compare & Order",
      starting_from: "Starting from",
      add_to_cart: "Add to Cart 🛒",
      in_stock: "In Stock",
      out_of_stock: "Out of Stock",
      low_stock: "Low Stock",
      delivery: "Delivery",
      active_formula: "Active Formula",
      therapeutic_group: "Therapeutic Group",
      warnings_precautions: "Warnings & Precautions",
      compare_purchase: "Compare Prices & Purchase Options",
      availability_prices: "Availability & Prices",
      cart_empty: "Your Cart is Empty",
      cart_desc: "Add medications from the search or prescription OCR scanning page.",
      medications_list: "Medications List",
      billing_summary: "Billing Summary",
      subtotal: "Medicines Subtotal",
      grand_total: "Grand Total",
      delivery_address: "Delivery Address",
      proceed_checkout: "Proceed to Checkout 🚀",
      shipping_payment: "Confirm Shipping & Payment",
      shipping_coords: "1. Shipping Coordinates",
      payment_method: "2. Payment Method",
      cash_delivery: "Cash on Delivery",
      pay_at_door: "Pay cash or card at door",
      credit_online: "Credit Card Online",
      visa_secured: "Visa / Mastercard secured",
      place_order: "Place Order",
      order_details: "Order Details",
      order_placed_success: "Order placed successfully! Pharmacy notified.",
      order_tracker: "Order Tracker",
      current_status: "Current Status",
      tracking_progress: "Tracking Progress Bar",
      realtime_route: "Real-time Delivery Route (Simulation)",
      active_supply_warning: "Some medications in your region are running in low supply. Compare pricing channels to secure packages.",
      wh_reminders: "WhatsApp Reminders",
      ocr_presc: "OCR Prescription Scanners",
      partner_pharmacies: "Partner Pharmacies & Brands",
      medical_categories: "Browse Medical Categories",
      why_us: "Why Choose Dawaya?",
      accreditation_title: "Pharmacy Partnership Program",
      accreditation_desc: "Partner with Dawaya. Accredit your retail storefront, digitize inventories, and receive massive delivery allocations.",
      active_patients: "Active Patients",
      licensed_pharmacies: "Licensed Pharmacies",
      ontime_delivery: "On-Time Delivery",
      reminders_sent: "Reminders Dispatched",
      coming_soon: "Coming Soon",
      explore_dashboard: "Explore Dashboard",

      // Patient dashboard translations
      how_assist_today: "How can we assist your health today?",
      select_automated_tool: "Select an automated tool below to check prices or manage compliance.",
      search_medications: "Search Medications",
      compare_localized_prices: "Compare localized price aggregates",
      ocr_rx_uploader: "OCR Rx Uploader",
      scan_prescription_notes: "Scan doctor prescription notes",
      active_placed_orders: "Active Placed Orders",
      no_active_orders: "You have no active orders currently running. Check the Search panel to purchase items.",
      dosage_compliance: "Dosage Compliance",
      configure_reminders: "Configure Reminders",
      active: "ACTIVE",
      track_status: "Track Status",
      aggregate_pricing_dir: "Aggregate Medicines Pricing Directory",
      search_filter_desc: "Search and filter down localized inventories in real-time. CHEAPEST pharmacy options are marked automatically.",
      patient_search_placeholder: "Type generic ingredient or medicine name (e.g. Claritin, Panadol)...",
      all_fields: "All Fields",
      product_name: "Product Name",
      active_ingredients: "Active Ingredients",
      pharmacy_stock: "Pharmacy Stock",
      search_icon_btn: "Search 🔍",
      enter_query: "Enter Medication query",
      compare_catalog_desc: "Compare catalog options, dosage warnings, and checkout immediately.",
      optical_ocr_scanner: "Optical prescription OCR Scanner",
      ocr_scanner_desc: "Upload a doctor prescription note image. The system utilizes machine learning parsing algorithms to recognize medications, match regional stock, and compare pricing aggregators in 3 seconds.",
      upload_prescription_image: "Upload Prescription Image",
      supports_formats: "Supports PNG, JPG, or PDF prescription operating documents",
      select_image_file: "Select Image File",
      my_placed_orders: "My Placed Pharmacy Orders",
      orders_desc: "View historic transaction logs, tracking parameters, and delivery dispatch rider coordinates.",
      grand_total_label: "Grand Total",
      track_progress: "Track Progress 🛵",
      no_orders_recorded: "No orders have been recorded yet.",
      whatsapp_scheduler: "WhatsApp Compliance Scheduler",
      whatsapp_scheduler_desc: "Configure recurring dosage periods. The system pings automatic daily alerts directly to your phone number.",
      medication_title: "Medication Title",
      dosage_instructions: "Dosage Instructions",
      daily_reminder_time: "Daily Reminder Time",
      activate_whatsapp_reminder: "Activate WhatsApp Reminder 📱",
      active_schedules: "Active Medication Schedules",
      phone_header_title: "Dawaya Medication Reminders",
      phone_header_sub: "Official Automated Sync Channel",
      phone_input_placeholder: "Enter response (e.g. 1 to confirm Intake)...",
      my_favorite_pharmacies: "My Favorite Pharmacies",
      favorites_desc: "Quickly browse operating hours, coverage zones, and ratings parameters for retail pharmacy partners in Cairo.",
      accredited_partner: "Accredited Partner",
      avg_delivery_fee: "Avg Delivery Fee",
      my_personal_profile: "My Personal Profile",
      profile_desc: "Configure shipping coordinates and personal medication guidelines.",
      profile_active_since: "Patient profile active since 2025",
      whatsapp_number: "WhatsApp Number"
    },
    ar: {
      brand_name: "دوايا",
      brand_subtitle: "نظام شبكة الصيدليات",
      home: "الرئيسية",
      about_us: "من نحن",
      contact: "اتصل بالدعم",
      sign_in: "تسجيل الدخول",
      register_pharmacy: "تسجيل صيدلية",
      search_placeholder: "ابحث عن دواء، صيدلية، مادة فعالة...",
      search_btn: "بحث",
      filter_all: "جميع الفئات",
      filter_product: "اسم المنتج",
      filter_pharmacy: "اسم الصيدلية",
      filter_ingredient: "المادة الفعالة",
      filter_category: "الفئة",
      cart: "العربة",
      logout: "خروج",
      welcome_back: "مرحباً بك مجدداً",
      role_patient: "مريض",
      role_pharmacy: "لوحة الصيدلية",
      role_admin: "لوحة التحكم",
      today_is: "اليوم هو",

      // Hero Promo Slider
      hero_badge: "🏥 سوق الصيدليات الذكي والحديث",
      hero_title: "ابحث عن الأدوية وقارن الأسعار فوراً",
      hero_subtitle: "يجمع دوايا الصيدليات المحلية المرخصة لتوصيل الروشتات، ومراقبة الأسعار، وجدولة تنبيهات الأدوية التلقائية على الواتساب.",
      hero_search_hint: "جرب البحث عن",
      fast_delivery: "توصيل سريع",
      under_30: "أقل من 30 دقيقة كمتوسط.",

      // How it works
      how_it_works: "كيف يعمل دوايا",
      how_it_works_sub: "ثلاث خطوات بسيطة لطلب الأدوية بأمان وإدارة التنبيهات.",
      step1_title: "1. ابحث وقارن",
      step1_desc: "اكتب اسم الدواء أو المكمل المطلوب. شاهد فوراً مقارنة أسعار حية من الصيدليات المرخصة في منطقتك.",
      step2_title: "2. مسح الروشتة ذكياً",
      step2_desc: "ارفع صورة روشتة الطبيب. يقوم نظام المسح الضوئي لدينا بالتعرف على الأدوية تلقائياً وعرض مقارنات الأسعار.",
      step3_title: "3. تنبيهات الواتساب",
      step3_desc: "تلقى مواعيد الأدوية التلقائية مباشرة على هاتفك. حافظ على صحتك وأكد تناول الجرعات فوراً.",

      // WhatsApp Reminder Showcase
      whatsapp_badge: "استعراض الميزة الحصرية",
      whatsapp_title: "نظام تنبيهات الأدوية التلقائي عبر الواتساب",
      whatsapp_desc: "يضمن نظام التنبيهات المتطور لدينا ألا ينسى أي مريض جرعته اليومية. قم بجدولة أوقات الجرعات المتعددة في أقل من 30 ثانية.",
      whatsapp_bullet1_title: "تحكم بسيط في الجرعات",
      whatsapp_bullet1_desc: "رد على المحادثة بأرقام بسيطة لتسجيل أخذ الجرعة فوراً دون الحاجة لفتح التطبيق.",
      whatsapp_bullet2_title: "تخصيص كامل للمواعيد",
      whatsapp_bullet2_desc: "يدعم دورات تكرار مخصصة، جرعات شراب، تقسيم الأقراص، ومواعيد دقيقة بالدقائق.",
      whatsapp_try_btn: "جرب ميزة التنبيهات الآن",

      // Testimonials
      testimonials_title: "ماذا يقول مجتمعنا",
      testimonials_sub: "مراجعات من أطباء مرخصين، ومرضى، ومدراء صيدليات.",
      testimonials_coming_soon: "قريباً",

      // FAQs
      faqs_title: "الأسئلة الشائعة",
      faqs_sub: "اعثر على إجابات للأسئلة الشائعة حول استخدام منصة دوايا.",

      // Contact Us
      contact_title: "اتصل بدعم دوايا",
      contact_sub: "لديك استفسارات تقنية، شكاوى حول اختلاف الأسعار، أو أسئلة مالية؟ أرسل لنا تذكرة دعم.",
      name_label: "الاسم الكامل",
      email_label: "البريد الإلكتروني",
      subject_label: "موضوع الشكوى",
      message_label: "تفاصيل الرسالة",
      submit_inquiry: "إرسال الطلب",
      contact_office: "المقر الرئيسي",
      contact_channels: "قنوات الدعم",

      // Login
      login_title: "مرحباً بك مجدداً",
      login_sub: "يرجى تحديد حساب الدخول للدخول فوراً",
      login_role_label: "نوع حساب الدخول",
      password_label: "كلمة المرور",
      forgot_password: "نسيت كلمة المرور؟",
      enter_dashboard: "دخول لوحة التحكم",
      no_account: "ليس لديك حساب صيدلية أو حساب مستخدم بعد؟",
      register_now: "سجل الآن",
      forgot_pw_title: "نسيت كلمة المرور",
      forgot_pw_sub: "أدخل بريدك الإلكتروني وسنرسل لك رمز OTP لإعادة تعيين كلمة المرور.",
      email_placeholder: "أدخل بريدك الإلكتروني",
      send_otp: "إرسال رمز OTP",
      back_to_login: "العودة لتسجيل الدخول",
      otp_sent_success: "تم إرسال رمز OTP إلى بريدك الإلكتروني",
      please_enter_valid_email: "يرجى إدخال بريد إلكتروني صحيح",
      sending_otp_loading: "جاري الإرسال...",

      // Register
      reg_title: "إنشاء حساب دوايا",
      reg_sub: "سجل حسابك الطبي كمرض أو تقدم بطلب شراكة لصيدليتك",
      reg_patient_tab: "تسجيل مريض",
      reg_pharm_tab: "تسجيل صيدلية",
      whatsapp_label: "رقم الواتساب (لتلقي تنبيهات الأدوية)",
      address_label: "عنوان الشارع (لتحديد موقع التوصيل)",
      complete_reg: "إتمام التسجيل",
      reg_pharm_name_label: "اسم الصيدلية المسجل",
      reg_pharm_address_label: "عنوان الصيدلية بالتفصيل",
      reg_pharm_license_label: "رقم رخصة وزارة الصحة",
      reg_pharm_upload_label: "ارفاق مستند رخصة التشغيل (تحميل تجريبي)",
      click_to_simulate: "انقر لمحاكاة إرفاق ملف الترخيص",
      apply_pharm_setup: "تقديم طلب إنشاء الصيدلية",
      already_registered: "مسجل بالفعل؟",
      login_here: "تسجيل الدخول",

      // Footer
      footer_desc: "منصة الرعاية الصحية المتكاملة التي تربط المرضى بالصيدليات المرخصة للتحقق من الأسعار، ومسح الروشتات، وجدولة تنبيهات الأدوية عبر الواتساب.",
      footer_roles: "حسابات المنصة",
      footer_pages: "الصفحات العامة",
      footer_regulatory: "الجهة الرقابية والترخيص",
      footer_regulatory_desc: "تعمل دوايا حصرياً مع الصيادلة المرخصين من قبل وزارة الصحة. ويتم التحقق من بيانات التراخيص بدقة قبل نشر قوائم الأدوية.",
      footer_copyright: "جميع الحقوق محفوظة لمنصة دوايا وسوق الرعاية الصحية الذكي.",

      // Other UI keys
      please_enter_search: "يرجى إدخال اسم الدواء للبحث",
      browse_medicines: "تصفح الأدوية",
      rx_required: "روشتة مطلوبة",
      otc: "متاح بدون روشتة",
      compare_order: "قارن واطلب",
      starting_from: "يبدأ من",
      add_to_cart: "أضف للعربة 🛒",
      in_stock: "متوفر",
      out_of_stock: "غير متوفر",
      low_stock: "مخزون منخفض",
      delivery: "التوصيل",
      active_formula: "التركيبة الفعالة",
      therapeutic_group: "المجموعة العلاجية",
      warnings_precautions: "تحذيرات واحتياطات",
      compare_purchase: "قارن الأسعار وخيارات الشراء",
      availability_prices: "التوفر والأسعار",
      cart_empty: "عربة التسوق فارغة",
      cart_desc: "أضف أدوية من صفحة البحث أو صفحة مسح الروشتة الضوئي.",
      medications_list: "قائمة الأدوية المطلوبة",
      billing_summary: "ملخص الفاتورة",
      subtotal: "إجمالي الأدوية subtotal",
      grand_total: "الإجمالي الكلي",
      delivery_address: "عنوان التوصيل",
      proceed_checkout: "متابعة إتمام الطلب 🚀",
      shipping_payment: "تأكيد الشحن وطريقة الدفع",
      shipping_coords: "1. إحداثيات الشحن",
      payment_method: "2. طريقة الدفع",
      cash_delivery: "الدفع عند الاستلام",
      pay_at_door: "ادفع نقداً أو بالفيزا عند الباب",
      credit_online: "بطاقة ائتمانية أونلاين",
      visa_secured: "الدفع آمن ببطاقات فيزا وماستركارد",
      place_order: "تأكيد وإرسال الطلب",
      order_details: "تفاصيل الطلب",
      order_placed_success: "تم إرسال طلبك بنجاح! تم إخطار الصيدلية.",
      order_tracker: "تتبع حالة الطلب",
      current_status: "الحالة الحالية",
      tracking_progress: "مؤشر تقدم التوصيل",
      realtime_route: "خريطة التتبع الحية (محاكاة)",
      active_supply_warning: "بعض الأدوية في منطقتك تواجه نقصاً في المعروض حالياً. يرجى مقارنة الأسعار وحجز عبواتك.",
      wh_reminders: "تنبيهات الواتساب",
      ocr_presc: "مسح الروشتات ذكياً",
      partner_pharmacies: "شركاؤنا من الصيدليات والبراندات",
      medical_categories: "تصفح الفئات الطبية",
      why_us: "لماذا تختار دوايا؟",
      accreditation_title: "برنامج اعتماد الصيدليات الشريكة",
      accreditation_desc: "كن شريكاً لدوايا. اعتمد واجهتك التجارية، ورقمن مخازنك، واحصل على تدفقات طلبات هائلة.",
      active_patients: "المرضى النشطين",
      licensed_pharmacies: "صيدليات معتمدة",
      ontime_delivery: "التوصيل في الموعد",
      reminders_sent: "تنبيهات مرسلة",
      coming_soon: "قريباً",
      explore_dashboard: "استكشف لوحة التحكم",

      // Patient dashboard translations (Arabic)
      how_assist_today: "كيف يمكننا مساعدتك صحياً اليوم؟",
      select_automated_tool: "اختر أداة تلقائية أدناه لمقارنة الأسعار أو إدارة الالتزام بالجرعات.",
      search_medications: "البحث عن الأدوية",
      compare_localized_prices: "قارن أسعار الأدوية المحلية",
      ocr_rx_uploader: "مسح الروشتة ضوئياً",
      scan_prescription_notes: "امسح روشتة الطبيب تلقائياً",
      active_placed_orders: "الطلبات النشطة الحالية",
      no_active_orders: "ليس لديك طلبات نشطة حالياً. يرجى البحث عن الأدوية لشرائها.",
      dosage_compliance: "الالتزام بمواعيد الجرعات",
      configure_reminders: "تهيئة التنبيهات المخصصة",
      active: "نشط",
      track_status: "تتبع الطلب",
      aggregate_pricing_dir: "دليل مقارنة أسعار الأدوية",
      search_filter_desc: "ابحث وقارن بين مخازن الصيدليات المحلية في الوقت الفعلي. يتم تحديد الخيار الأرخص تلقائياً.",
      patient_search_placeholder: "اكتب الاسم العلمي أو التجاري للدواء (مثال: كلاريتين، بنادول)...",
      all_fields: "جميع الحقول",
      product_name: "اسم المنتج",
      active_ingredients: "المادة الفعالة",
      pharmacy_stock: "مخزون الصيدلية",
      search_icon_btn: "بحث 🔍",
      enter_query: "أدخل كلمة البحث",
      compare_catalog_desc: "قارن بين خيارات الأدوية، والجرعات والتحذيرات، وتابع الشراء فوراً.",
      optical_ocr_scanner: "مسح الروشتة ضوئياً بالذكاء الاصطناعي",
      ocr_scanner_desc: "ارفع صورة روشتة طبيب. يستخدم النظام خوارزميات التعلم الآلي للتعرف على الأدوية ومطابقة المخزون والأسعار في 3 ثوانٍ.",
      upload_prescription_image: "تحميل صورة الروشتة",
      supports_formats: "يدعم صيغ PNG أو JPG أو مستندات PDF للروشتة",
      select_image_file: "اختر ملف الصورة",
      my_placed_orders: "طلبات الصيدلية الخاصة بي",
      orders_desc: "شاهد سجل المعاملات التاريخي، معايير التتبع، وإحداثيات مندوب التوصيل.",
      grand_total_label: "الإجمالي الكلي",
      track_progress: "تتبع التقدم 🛵",
      no_orders_recorded: "لم يتم تسجيل أي طلبات بعد.",
      whatsapp_scheduler: "مجدول الجرعات عبر الواتساب",
      whatsapp_scheduler_desc: "قم بتهيئة فترات الجرعات المتكررة. يرسل النظام تنبيهات يومية تلقائية مباشرة إلى رقم هاتفك.",
      medication_title: "اسم الدواء",
      dosage_instructions: "تعليمات الجرعة",
      daily_reminder_time: "وقت التنبيه اليومي",
      activate_whatsapp_reminder: "تفعيل التنبيه عبر الواتساب 📱",
      active_schedules: "مواعيد الجرعات النشطة",
      phone_header_title: "تنبيهات أدوية دوايا",
      phone_header_sub: "قناة التزامن التلقائي الرسمية",
      phone_input_placeholder: "أدخل الرد (مثال: 1 لتأكيد تناول الجرعة)...",
      my_favorite_pharmacies: "صيدلياتي المفضلة",
      favorites_desc: "تصفح بسرعة ساعات العمل ونطاقات التغطية والتقييمات للصيدليات الشريكة في القاهرة.",
      accredited_partner: "شريك معتمد",
      avg_delivery_fee: "متوسط رسوم التوصيل",
      my_personal_profile: "ملفي الشخصي",
      profile_desc: "تعديل إحداثيات الشحن وتوجيهات الأدوية الشخصية.",
      profile_active_since: "الملف الشخصي للمريض نشط منذ 2025",
      whatsapp_number: "رقم الواتساب"
    }
  };

  // Translation helper function
  function t(key) {
    const lang = state.language || "en";
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS["en"] && TRANSLATIONS["en"][key]) {
      return TRANSLATIONS["en"][key];
    }
    return key;
  }

  // --- SELECTORS ---
  const appRoot = document.body;
  const roleButtons = document.querySelectorAll(".role-btn");
  const publicNavbar = document.querySelector(".public-navbar");
  const topUtilityBar = document.querySelector(".top-utility-bar");
  const mainAppContainer = document.getElementById("main-app-container");
  const themeCheckbox = document.getElementById("theme-toggle-checkbox");
  const toastContainer = document.getElementById("toast-container");

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let svgIcon = "";
    if (type === "success") {
      svgIcon = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    } else if (type === "danger") {
      svgIcon = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-danger)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    } else if (type === "warning") {
      svgIcon = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-warning)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
    } else {
      svgIcon = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-info)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      <div class="toast-icon-wrapper">${svgIcon}</div>
      <span class="text-sm font-semibold">${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("exiting");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- THEME SWAPPER ---
  themeCheckbox.addEventListener("change", () => {
    state.theme = themeCheckbox.checked ? "dark" : "light";
    appRoot.setAttribute("data-theme", state.theme);
    showToast(`Switched to ${state.theme} mode`, "info");
    // Redraw charts if relevant
    if (state.activeRole === "pharmacy" && state.activeScreen === "home") renderPharmacyCharts();
    if (state.activeRole === "admin" && state.activeScreen === "overview") renderAdminCharts();

    // Sync navbar theme state if rendered
    if (state.activeRole === "public") {
      renderNavbar();
    }
  });

  // --- ELDERLY ACCESSIBILITY MODE ---
  const elderlyCheckbox = document.getElementById("elderly-toggle-checkbox");
  if (elderlyCheckbox) {
    elderlyCheckbox.addEventListener("change", () => {
      const isElderly = elderlyCheckbox.checked;
      document.documentElement.classList.toggle("elderly-mode", isElderly);
      showToast(isElderly ? "Elderly Accessibility Mode Enabled" : "Accessibility Mode Disabled", "warning");
      // Optional: Refresh layout if we want, but styling handles the layout magnifier and high contrast automatically!
    });
  }

  // --- ROLE AND NAVIGATION ROUTER ---
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      switchRole(role);
    });
  });

  function renderSkeleton(screenName) {
    if (state.activeRole === "public") {
      // Shimmering public skeleton
      mainAppContainer.innerHTML = `
        <div class="shimmer-container">
          <div class="skeleton-hero-banner" style="margin-top: 24px;"></div>
          <div class="skeleton-grid-cards">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>
        </div>
      `;
    } else {
      // Make sure dashboard layout is rendered
      let dashboardContainer = document.querySelector(".dashboard-container");
      if (!dashboardContainer) {
        mainAppContainer.innerHTML = "";
        const layout = document.createElement("div");
        layout.className = `dashboard-container role-${state.activeRole}`;
        layout.innerHTML = getSidebarHTML() + `
          <main class="dashboard-content">
            ${getDashboardTopbarHTML()}
            <div id="dashboard-screen-body"></div>
          </main>
        `;
        mainAppContainer.appendChild(layout);
        bindDashboardEvents();
        dashboardContainer = layout;
      }

      // Select screen-body
      const screenBody = document.getElementById("dashboard-screen-body");
      if (screenBody) {
        if (screenName === "home" || screenName === "overview") {
          // Dashboard overview skeleton (metric cards + line chart box)
          screenBody.innerHTML = `
            <div class="shimmer-container">
              <div class="skeleton-header">
                <div>
                  <div class="skeleton-title"></div>
                  <div class="skeleton-subtitle"></div>
                </div>
              </div>
              <div class="skeleton-grid-cards">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
              </div>
              <div class="skeleton-chart-box"></div>
            </div>
          `;
        } else {
          // Lists / tables skeleton
          screenBody.innerHTML = `
            <div class="shimmer-container">
              <div class="skeleton-header">
                <div>
                  <div class="skeleton-title"></div>
                  <div class="skeleton-subtitle"></div>
                </div>
              </div>
              <div class="skeleton-table-box">
                <div class="skeleton-row" style="width: 100%; height: 30px; margin-bottom: 10px;"></div>
                <div class="skeleton-row" style="width: 90%;"></div>
                <div class="skeleton-row" style="width: 85%;"></div>
                <div class="skeleton-row" style="width: 95%;"></div>
                <div class="skeleton-row" style="width: 70%;"></div>
                <div class="skeleton-row" style="width: 80%;"></div>
              </div>
            </div>
          `;
        }
      }
    }
  }

  function switchRole(role) {
    state.activeRole = role;

    // Update role selectors UI
    roleButtons.forEach(b => {
      if (b.dataset.role === role) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    // Default screens per role
    if (role === "public") {
      publicNavbar.style.display = "flex";
      state.activeScreen = "landing";
    } else if (role === "patient") {
      publicNavbar.style.display = "none";
      state.activeScreen = "home";
    } else if (role === "pharmacy") {
      publicNavbar.style.display = "none";
      state.activeScreen = "home";
    } else if (role === "admin") {
      publicNavbar.style.display = "none";
      state.activeScreen = "overview";
    }

    renderSkeleton(state.activeScreen);

    setTimeout(() => {
      renderAppLayout();
      showToast(`Logged in as ${role.toUpperCase()}`, "success");

      // Sync navbar theme state if public
      if (role === "public") {
        renderNavbar();
      } else {
        if (role === "pharmacy" && state.activeScreen === "home") renderPharmacyCharts();
        if (role === "admin" && state.activeScreen === "overview") renderAdminCharts();
      }
    }, 450);
  }

  // Dynamic Routing
  window.navigateTo = function (screenName) {
    state.activeScreen = screenName;
    renderAppLayout();
    window.scrollTo(0, 0);
  };

  // --- SCREEN RENDERING CONTROLLERS ---
  function renderAppLayout() {
    // Clear viewport
    mainAppContainer.innerHTML = "";

    // Toggle simulation utility bar visibility for Forgot Password page
    if (state.activeRole === "public" && state.activeScreen === "forgot-pw") {
      if (topUtilityBar) topUtilityBar.style.display = "none";
    } else {
      if (topUtilityBar) topUtilityBar.style.display = "flex";
    }

    if (state.activeRole === "public") {
      renderPublicLayout();
    } else {
      renderDashboardLayout();
    }
  }

  // --- PUBLIC LAYOUT ---
  function renderPublicLayout() {
    if (state.activeScreen === "forgot-pw") {
      publicNavbar.style.display = "none";
    } else {
      publicNavbar.style.display = "flex";
      renderNavbar();
    }

    let mainContent = "";
    switch (state.activeScreen) {
      case "landing":
        mainContent = getLandingPageHTML();
        break;
      case "about":
        // Direct integration inside landing page - scroll or direct template
        mainContent = getAboutPageHTML();
        break;
      case "contact":
        mainContent = getContactPageHTML();
        break;
      case "login":
        mainContent = getLoginPageHTML();
        break;
      case "register":
        mainContent = getRegisterPageHTML();
        break;
      case "forgot-pw":
        mainContent = getForgotPwPageHTML();
        break;
      default:
        mainContent = getLandingPageHTML();
    }

    if (state.activeScreen === "forgot-pw") {
      mainAppContainer.innerHTML = mainContent;
    } else {
      mainAppContainer.innerHTML = mainContent + getFooterHTML();
    }
    bindPublicEvents();
  }

  // --- PUBLIC DYNAMIC NAVBAR ---
  function renderNavbar() {
    const isAr = state.language === "ar";
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadgeHTML = cartCount > 0 ? `<span class="nav-cart-badge">${cartCount}</span>` : "";

    const activeLanding = state.activeScreen === "landing" ? "active" : "";
    const activeAbout = state.activeScreen === "about" ? "active" : "";
    const activeContact = state.activeScreen === "contact" ? "active" : "";

    // Generate voice search overlay dynamically if it doesn't exist
    if (!document.getElementById("voice-search-overlay")) {
      const voiceDiv = document.createElement("div");
      voiceDiv.id = "voice-search-overlay";
      voiceDiv.className = "voice-overlay";
      voiceDiv.innerHTML = `
        <div class="voice-card">
          <div class="voice-mic-glow">🎙️</div>
          <div>
            <h3 class="text-xl font-bold" id="voice-status-text">${isAr ? "جاري الاستماع..." : "Listening..."}</h3>
            <p class="text-sm" style="color: var(--text-muted); margin-top:8px;">${isAr ? "قل اسم الدواء الآن" : "Say the name of the medicine now"}</p>
          </div>
          <div class="voice-wave">
            <div class="voice-wave-bar"></div>
            <div class="voice-wave-bar"></div>
            <div class="voice-wave-bar"></div>
            <div class="voice-wave-bar"></div>
            <div class="voice-wave-bar"></div>
          </div>
        </div>
      `;
      document.body.appendChild(voiceDiv);
    }

    publicNavbar.innerHTML = `
      <div class="container nav-container">
        <a href="#" class="logo-link" onclick="navigateTo('landing')">
          <div class="logo-icon">
            ${LOGO_SVG_MARK}
          </div>
          <div class="logo-text-container">
            <span class="logo-brand-title">${t("brand_name")}</span>
            <span class="logo-brand-subtitle">${t("brand_subtitle")}</span>
          </div>
        </a>

        <!-- Centered modern Search Bar -->
        <div class="nav-search-container">
          <div class="nav-search-bar">
            <select class="nav-search-filter-select" id="nav-search-filter">
              <option value="all">${t("filter_all")}</option>
              <option value="name">${t("filter_product")}</option>
              <option value="pharmacy">${t("filter_pharmacy")}</option>
              <option value="generic">${t("filter_ingredient")}</option>
            </select>
            <input type="text" id="nav-search-input" placeholder="${t("search_placeholder")}" value="${state.searchQuery || ''}" autocomplete="off">
            <button class="nav-mic-btn" id="nav-mic-btn" title="Simulate Voice Search" style="background:transparent; cursor:pointer; font-size:1.15rem; padding: 0 8px; transition: var(--transition);">🎙️</button>
            <button class="nav-search-btn" id="nav-search-btn">🔍</button>
          </div>
          
          <!-- Popover suggestion dropdown -->
          <div class="search-suggestions" id="nav-search-suggestions">
            <div class="suggestion-header">🔥 ${isAr ? "الأكثر بحثاً" : "Trending Searches"}</div>
            <div class="suggestion-item" data-val="Panadol Extra"><span class="suggestion-icon">⚡</span> Panadol Extra</div>
            <div class="suggestion-item" data-val="Glucophage 850mg"><span class="suggestion-icon">⚡</span> Glucophage 850mg</div>
            <div class="suggestion-item" data-val="Concor 5mg"><span class="suggestion-icon">⚡</span> Concor 5mg</div>
            <div class="suggestion-item" data-val="Vitamin C"><span class="suggestion-icon">⚡</span> Vitamin C (C-Retard)</div>
          </div>
        </div>

        <ul class="nav-menu">
          <li><a href="#" class="nav-link ${activeLanding}" onclick="navigateTo('landing')">${t("home")}</a></li>
          <li><a href="#" class="nav-link ${activeAbout}" onclick="navigateTo('about')">${t("about_us")}</a></li>
          <li><a href="#" class="nav-link ${activeContact}" onclick="navigateTo('contact')">${t("contact")}</a></li>
        </ul>

        <div class="nav-buttons">
          <!-- Cart Icon -->
          <div class="nav-cart-btn" onclick="navigateToCartFromNavbar()">
            🛒
            ${cartBadgeHTML}
          </div>

          <!-- Language Selector Switcher -->
          <button class="lang-toggle-btn" id="nav-lang-toggle">
            🌐 ${isAr ? "English" : "العربية"}
          </button>

          <button class="btn btn-outline btn-sm" onclick="navigateTo('login')">${t("sign_in")}</button>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('register')">${t("register_pharmacy")} 🏥</button>
        </div>
      </div>
    `;

    // Sticky Scroll Handler binding
    if (window.scrollY > 50) {
      publicNavbar.classList.add("scrolled");
    } else {
      publicNavbar.classList.remove("scrolled");
    }

    // Bind event listeners
    const langBtn = document.getElementById("nav-lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        state.language = state.language === "ar" ? "en" : "ar";
        document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
        renderAppLayout();
        showToast(state.language === "ar" ? "تم التحويل إلى اللغة العربية" : "Switched to English", "info");
      });
    }

    const navSearchBtn = document.getElementById("nav-search-btn");
    const navSearchInput = document.getElementById("nav-search-input");
    const navSearchFilter = document.getElementById("nav-search-filter");

    const executeSearch = () => {
      const query = navSearchInput.value.trim();
      const filterType = navSearchFilter.value;
      if (query) {
        state.searchQuery = query;
        switchRole("patient");
        state.activeScreen = "search";
        renderAppLayout();

        // Trigger search instantly in patient view
        const searchInputEl = document.getElementById("patient-search-input");
        if (searchInputEl) {
          searchInputEl.value = query;
          triggerPatientSearch(query, filterType);
        }
      } else {
        showToast(t("please_enter_search"), "warning");
      }
    };

    if (navSearchBtn && navSearchInput) {
      navSearchBtn.addEventListener("click", executeSearch);
      navSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") executeSearch();
      });
    }

    // Bind Suggestions Dropdown Events
    const suggestionsDropdown = document.getElementById("nav-search-suggestions");
    if (navSearchInput && suggestionsDropdown) {
      navSearchInput.addEventListener("focus", () => {
        suggestionsDropdown.classList.add("active");
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-search-container")) {
          suggestionsDropdown.classList.remove("active");
        }
      });
      suggestionsDropdown.querySelectorAll(".suggestion-item").forEach(item => {
        item.addEventListener("click", () => {
          navSearchInput.value = item.dataset.val;
          suggestionsDropdown.classList.remove("active");
          executeSearch();
        });
      });
    }

    // Bind Voice Microphone Search simulation
    const micBtn = document.getElementById("nav-mic-btn");
    const voiceOverlay = document.getElementById("voice-search-overlay");
    const voiceStatusText = document.getElementById("voice-status-text");

    if (micBtn && voiceOverlay) {
      micBtn.addEventListener("click", () => {
        voiceOverlay.classList.add("active");
        if (voiceStatusText) {
          voiceStatusText.textContent = isAr ? "جاري الاستماع..." : "Listening...";
        }

        setTimeout(() => {
          if (voiceStatusText) {
            voiceStatusText.textContent = isAr ? "تم التعرف: Panadol Extra" : "Recognized: Panadol Extra";
          }
          setTimeout(() => {
            voiceOverlay.classList.remove("active");
            if (navSearchInput) {
              navSearchInput.value = "Panadol Extra";
              executeSearch();
            }
          }, 1000);
        }, 2200);
      });
    }
  }

  // Sticky Scroll Window Listener
  window.addEventListener("scroll", () => {
    if (state.activeRole === "public" && publicNavbar) {
      if (window.scrollY > 50) {
        publicNavbar.classList.add("scrolled");
      } else {
        publicNavbar.classList.remove("scrolled");
      }
    }
  });

  window.navigateToCartFromNavbar = function () {
    switchRole("patient");
    state.activeScreen = "cart";
    renderAppLayout();
    renderCartPage();
  };

  // --- DASHBOARD LAYOUTS ---
  function renderDashboardLayout() {
    const layout = document.createElement("div");
    layout.className = `dashboard-container role-${state.activeRole}`;

    // Get sidebar HTML based on role
    const sidebarHTML = getSidebarHTML();
    // Get screen HTML based on role and screen
    const contentHTML = getDashboardContentHTML();

    layout.innerHTML = sidebarHTML + `
      <main class="dashboard-content">
        ${getDashboardTopbarHTML()}
        <div id="dashboard-screen-body">${contentHTML}</div>
      </main>
    `;

    mainAppContainer.appendChild(layout);
    bindDashboardEvents();
  }

  // --- SIDEBAR DESIGN ---
  function getSidebarHTML() {
    let menuItems = [];
    let roleBadge = "";
    let userName = state.currentUser.name;
    let userAvatar = "👤";

    if (state.activeRole === "patient") {
      userAvatar = state.currentUser.avatar || "👤";
      roleBadge = `<span class="sidebar-role-badge role-patient-badge">${t("role_patient")}</span>`;
      menuItems = [
        { label: "Overview", icon: "📊", screen: "home" },
        { label: "Search Medicines", icon: "🔍", screen: "search" },
        { label: "Upload Prescription", icon: "📤", screen: "upload" },
        { label: "My Orders", icon: "📦", screen: "orders" },
        { label: "Reminders & WhatsApp", icon: "💬", screen: "reminders" },
        { label: "Favorite Pharmacies", icon: "⭐️", screen: "favorites" },
        { label: "Design System Showcase", icon: "🎨", screen: "design-system" },
        { label: "Profile", icon: "👤", screen: "profile" }
      ];
    } else if (state.activeRole === "pharmacy") {
      const pharm = state.pharmacies.find(p => p.id === state.activePharmacySession) || state.pharmacies[0];
      userName = pharm.name;
      userAvatar = "🏥";
      roleBadge = `<span class="sidebar-role-badge role-pharmacy-badge">${t("role_pharmacy")}</span>`;
      menuItems = [
        { label: "Overview Home", icon: "📈", screen: "home" },
        { label: "Inventory Manager", icon: "💊", screen: "inventory" },
        { label: "Orders Management", icon: "📥", screen: "orders" },
        { label: "Reports & Analytics", icon: "📊", screen: "analytics" },
        { label: "Pharmacy Profile", icon: "⚙️", screen: "profile" }
      ];
    } else if (state.activeRole === "admin") {
      userName = "Super Admin";
      userAvatar = "🔑";
      roleBadge = `<span class="sidebar-role-badge role-admin-badge">${t("role_admin")}</span>`;
      menuItems = [
        { label: "Overview Analytics", icon: "🛡️", screen: "overview" },
        { label: "Pharmacy Approvals", icon: "✔️", screen: "approvals" },
        { label: "Users List", icon: "👥", screen: "users" },
        { label: "Pharmacies Database", icon: "🏢", screen: "pharmacies" },
        { label: "System settings", icon: "⚙️", screen: "system" }
      ];
    }

    let menuHTML = "";
    menuItems.forEach(item => {
      const activeClass = state.activeScreen === item.screen ? "active" : "";
      menuHTML += `
        <li>
          <a href="#" class="sidebar-item-link ${activeClass}" onclick="navigateTo('${item.screen}')">
            <span>${item.icon}</span>
            <span>${item.label}</span>
          </a>
        </li>
      `;
    });

    return `
      <aside class="dashboard-sidebar">
        <div class="sidebar-header" style="display: flex; align-items: center; gap: 12px;">
          <div class="logo-icon">
            ${LOGO_SVG_MARK}
          </div>
          <div class="logo-text-container">
            <h2 class="logo-brand-title" style="font-size: 1.3rem; margin: 0; line-height: 1;">${t("brand_name")}</h2>
            <div class="logo-brand-subtitle" style="font-size: 0.45rem; margin-top: 2px;">${t("brand_subtitle")}</div>
            <div style="margin-top: 4px;">${roleBadge}</div>
          </div>
        </div>
        <ul class="sidebar-menu">
          ${menuHTML}
        </ul>
        <div class="sidebar-footer">
          <div class="user-profile-summary">
            <div class="user-profile-avatar">${userAvatar}</div>
            <div class="profile-text">
              <p class="font-semibold text-sm" style="line-height:1.2;">${userName}</p>
              <p class="text-xs" style="color: var(--text-light); word-break: break-all;">${state.currentUser.email}</p>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  // --- DASHBOARD TOP BAR ---
  function getDashboardTopbarHTML() {
    let title = "Dashboard";
    if (state.activeRole === "patient") {
      title = `${t("welcome_back")}, ${state.currentUser.name.split(" ")[0]}!`;
    } else if (state.activeRole === "pharmacy") {
      const pharm = state.pharmacies.find(p => p.id === state.activePharmacySession) || state.pharmacies[0];
      title = `${pharm.name} Dashboard`;
    } else if (state.activeRole === "admin") {
      title = "Dawaya Control Panel";
    }

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="text-2xl font-bold">${title}</h1>
          <p class="text-xs" style="color: var(--text-light);">${t("today_is")} ${new Date().toLocaleDateString(state.language === 'ar' ? 'ar-EG' : undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div class="topbar-actions">
          <div class="notification-bell" onclick="showNotificationCenter()">
            🔔
            <span class="notification-dot"></span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="navigateToPublic()">${t("logout")}</button>
        </div>
      </div>
    `;
  }

  window.navigateToPublic = function () {
    switchRole("public");
  };

  window.showNotificationCenter = function () {
    showToast("You have 3 unread healthcare notifications.", "info");
  };

  // --- DASHBOARD ROUTER MATCHES ---
  function getDashboardContentHTML() {
    if (state.activeRole === "patient") {
      switch (state.activeScreen) {
        case "home": return getPatientHomeHTML();
        case "search": return getPatientSearchHTML();
        case "details": return getPatientDetailsHTML();
        case "upload": return getPatientUploadHTML();
        case "orders": return getPatientOrdersHTML();
        case "reminders": return getPatientRemindersHTML();
        case "favorites": return getPatientFavoritesHTML();
        case "profile": return getPatientProfileHTML();
        case "design-system": return getDesignSystemHTML();
        default: return getPatientHomeHTML();
      }
    } else if (state.activeRole === "pharmacy") {
      switch (state.activeScreen) {
        case "home": return getPharmacyHomeHTML();
        case "inventory": return getPharmacyInventoryHTML();
        case "orders": return getPharmacyOrdersHTML();
        case "analytics": return getPharmacyAnalyticsHTML();
        case "profile": return getPharmacyProfileHTML();
        default: return getPharmacyHomeHTML();
      }
    } else if (state.activeRole === "admin") {
      switch (state.activeScreen) {
        case "overview": return getAdminOverviewHTML();
        case "approvals": return getAdminApprovalsHTML();
        case "users": return getAdminUsersHTML();
        case "pharmacies": return getAdminPharmaciesHTML();
        case "system": return getAdminSystemHTML();
        default: return getAdminOverviewHTML();
      }
    }
  }

  // --- BIND INTERACTION EVENTS ---
  function bindPublicEvents() {
    // 1. Hero Promo Slider cycling
    startHeroCarousel();

    // 2. Landing page search interaction
    const mainSearchBtn = document.getElementById("main-search-btn");
    const mainSearchInput = document.getElementById("main-search-input");
    if (mainSearchBtn && mainSearchInput) {
      mainSearchBtn.addEventListener("click", () => {
        const query = mainSearchInput.value.trim();
        if (query) {
          state.searchQuery = query;
          switchRole("patient");
          state.activeScreen = "search";
          renderAppLayout();

          // Trigger search instantly in patient view
          const searchInput = document.getElementById("patient-search-input");
          if (searchInput) {
            searchInput.value = query;
            triggerPatientSearch(query);
          }
        } else {
          showToast(t("please_enter_search"), "warning");
        }
      });
    }

    // 3. Auth Flow Toggles
    const authLoginForm = document.getElementById("login-submit-form");
    if (authLoginForm) {
      authLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const roleSelect = document.getElementById("login-role-select").value;
        switchRole(roleSelect);
      });
    }

    // 4. Pharmacy Register Submission (dynamic flow)
    const registerForm = document.getElementById("pharmacy-register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("reg-pharm-name").value;
        const address = document.getElementById("reg-pharm-address").value;
        const license = document.getElementById("reg-pharm-license").value;

        const newPharm = {
          id: `pharm-${state.pharmacies.length + 1}`,
          name: name,
          address: address,
          phone: "+20100000000",
          rating: 0.0,
          reviews: 0,
          deliveryFee: 15.00,
          deliveryTime: "30-50 mins",
          workingHours: "9:00 AM - 10:00 PM",
          deliveryZones: "All Zones",
          status: "Pending Approval", // Key state variable
          licenseNo: license,
          joinedDate: new Date().toISOString().split("T")[0]
        };

        state.pharmacies.push(newPharm);
        showToast("Registration submitted! Dawaya Admin team will review your operating license.", "success");
        navigateTo("login");
      });
    }

    // 5. Forgot Password Submit
    const forgotForm = document.getElementById("forgot-pw-form");
    if (forgotForm) {
      forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById("forgot-email-input");
        const submitBtn = document.getElementById("forgot-submit-btn");
        if (!emailInput || !submitBtn) return;
        
        const btnTextSpan = submitBtn.querySelector(".btn-text");
        const btnSpinnerSpan = submitBtn.querySelector(".btn-spinner");
        const emailVal = emailInput.value.trim();
        
        // Manual validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          showToast(t("please_enter_valid_email"), "danger");
          emailInput.focus();
          return;
        }
        
        // Set loading state
        submitBtn.disabled = true;
        if (btnSpinnerSpan) btnSpinnerSpan.style.display = "inline-block";
        if (btnTextSpan) btnTextSpan.textContent = t("sending_otp_loading");
        
        // Make Axios request
        axios.post('/api/auth/forgetpassword', { email: emailVal })
          .then(res => {
            showToast(t("otp_sent_success"), "success");
            forgotForm.reset();
            setTimeout(() => {
              navigateTo("login");
            }, 2500);
          })
          .catch(err => {
            console.error("Forgot password request failed:", err);
            let errorMessage = err.message;
            if (err.response && err.response.data && err.response.data.message) {
              errorMessage = err.response.data.message;
            }
            showToast(`Error: ${errorMessage}`, "danger");
          })
          .finally(() => {
            // Restore normal button state
            submitBtn.disabled = false;
            if (btnSpinnerSpan) btnSpinnerSpan.style.display = "none";
            if (btnTextSpan) btnTextSpan.textContent = t("send_otp");
          });
      });
    }

    // FAQ Accordion binds
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(q => {
      q.addEventListener("click", () => {
        const parent = q.parentElement;
        parent.classList.toggle("active");
        const ans = q.nextElementSibling;
        if (parent.classList.contains("active")) {
          ans.style.maxHeight = ans.scrollHeight + "px";
        } else {
          ans.style.maxHeight = "0";
        }
      });
    });
  }

  function startHeroCarousel() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".carousel-dot");
    if (!slides.length) return;

    let index = 0;
    const cycle = () => {
      slides.forEach((s, idx) => {
        if (idx === index) {
          s.classList.add("active");
          if (dots[idx]) dots[idx].classList.add("active");
        } else {
          s.classList.remove("active");
          if (dots[idx]) dots[idx].classList.remove("active");
        }
      });
      index = (index + 1) % slides.length;
    };
    cycle();

    if (window.heroCarouselInterval) clearInterval(window.heroCarouselInterval);
    window.heroCarouselInterval = setInterval(cycle, 5000);
  }

  function bindDashboardEvents() {
    // Redraw charts based on screen sizes/role loads
    if (state.activeRole === "pharmacy" && state.activeScreen === "home") {
      renderPharmacyCharts();
    }
    if (state.activeRole === "admin" && state.activeScreen === "overview") {
      renderAdminCharts();
    }
    if (state.activeRole === "patient" && state.activeScreen === "reminders") {
      renderPhoneMessages();
    }
  }

  // --- WORKFLOW: PATIENT MEDICINE SEARCH ---
  window.triggerPatientSearch = function (query, filterType = "all") {
    const searchResultsContainer = document.getElementById("search-results-grid");
    if (!searchResultsContainer) return;

    // Trigger Skeleton Loaders
    searchResultsContainer.innerHTML = Array(3).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-loader skeleton-bar" style="width: 40%; height: 24px;"></div>
        <div class="skeleton-loader skeleton-bar" style="width: 80%;"></div>
        <div class="skeleton-loader skeleton-bar" style="width: 60%;"></div>
        <div class="skeleton-loader skeleton-bar" style="width: 100%; height: 40px; margin-top:20px;"></div>
      </div>
    `).join("");

    setTimeout(() => {
      let filtered = state.medicines;

      if (filterType === "name") {
        filtered = state.medicines.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
      } else if (filterType === "generic") {
        filtered = state.medicines.filter(m => m.genericName.toLowerCase().includes(query.toLowerCase()));
      } else if (filterType === "pharmacy") {
        // Find medicines stocked by pharmacies whose names contain the query
        const matchingPharmIds = state.pharmacies
          .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
          .map(p => p.id);
        filtered = state.medicines.filter(m =>
          Object.keys(m.prices).some(pId => matchingPharmIds.includes(pId))
        );
      } else {
        // all categories
        filtered = state.medicines.filter(med =>
          med.name.toLowerCase().includes(query.toLowerCase()) ||
          med.genericName.toLowerCase().includes(query.toLowerCase()) ||
          med.category.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (filtered.length === 0) {
        searchResultsContainer.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🔍</div>
            <h3 class="font-bold text-xl">${t("no_medicines")}</h3>
            <p style="color: var(--text-muted);">Try searching for "Panadol", "Amoxil", "Glucophage", or check spelling.</p>
          </div>
        `;
        return;
      }

      searchResultsContainer.innerHTML = filtered.map(med => {
        const pricesList = Object.entries(med.prices).map(([pharmId, price]) => {
          const pharm = state.pharmacies.find(p => p.id === pharmId);
          if (!pharm || pharm.status !== "Active") return "";
          return `
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 4px 0; border-bottom: 1px dashed var(--border-color);">
              <span>${pharm.name}</span>
              <strong style="color: var(--primary);">${price.toFixed(2)} EGP</strong>
            </div>
          `;
        }).join("");

        // Find cheapest price
        const activePrices = Object.entries(med.prices)
          .filter(([pId]) => {
            const ph = state.pharmacies.find(p => p.id === pId);
            return ph && ph.status === "Active";
          })
          .map(([_, price]) => price);

        const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : 0;

        return `
         <div class="card med-card" style="display: flex; flex-direction: column; justify-content: space-between;">
  <div>
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      
      <div class="med-card-image-container"
        style="width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; background: var(--input-bg); border-radius: 12px; overflow: hidden; padding: 4px; box-shadow: var(--shadow-sm);">
        
        ${renderMedicineImage(
          med.image,
          "max-width: 100%; max-height: 100%; object-fit: contain;"
        )}
      </div>

      ${med.prescriptionRequired
            ? `<span class="badge badge-danger">${t("rx_required")}</span>`
            : `<span class="badge badge-success" style="font-size:0.65rem;">OTC</span>`
          }
    </div>

    <h3 class="font-bold text-lg" style="margin-bottom: 4px;">
      ${med.name}
    </h3>

    <p class="text-xs" style="color: var(--text-light); margin-bottom: 8px;">
      ${med.genericName} • ${med.dosage}
    </p>

    <p class="text-sm"
      style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.4;">
      ${med.description.substring(0, 85)}...
    </p>

    <div
      style="background-color: var(--input-bg); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 16px;">
      
      <p class="text-xs font-semibold"
        style="margin-bottom: 8px; color: var(--text-muted);">
        ${t("availability_prices")}:
      </p>

      ${pricesList ||
          `<p class="text-xs" style="color: var(--color-danger);">
          Temporarily unavailable in nearby active pharmacies
        </p>`
          }
    </div>
  </div>

  <div>
    <div
      style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      
      <div>
        <p class="text-xs"
          style="color: var(--text-light); margin-bottom: 2px;">
          ${t("starting_from")}
        </p>

        <p class="font-bold text-xl"
          style="color: var(--text-main); font-family: var(--font-display);">
          
          ${minPrice > 0 ? minPrice.toFixed(2) + " EGP" : "N/A"}
        </p>
      </div>

      <button
        class="btn btn-secondary btn-sm"
        onclick="viewMedicineDetails('${med.id}')">
        ${t("compare_order")}
      </button>
    </div>
  </div>
</div>
        `;
      }).join("");
    }, 800);
  };

  window.viewMedicineDetails = function (medId) {
    state.activeScreen = "details";
    renderAppLayout();

    const container = document.getElementById("med-details-view");
    if (!container) return;

    const med = state.medicines.find(m => m.id === medId);
    if (!med) return;

    // Filter available pharmacies
    const pharmaciesGridHTML = Object.entries(med.prices).map(([pId, price]) => {
      const pharm = state.pharmacies.find(p => p.id === pId);
      if (!pharm || pharm.status !== "Active") return "";

      const inStock = med.stock[pId] > 0;
      const stockBadge = inStock
        ? (med.stock[pId] <= 5 ? `<span class="badge badge-warning">${t("low_stock")} (${med.stock[pId]})</span>` : `<span class="badge badge-success">${t("in_stock")}</span>`)
        : `<span class="badge badge-danger">${t("out_of_stock")}</span>`;

      return `
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; margin-bottom: 12px; hover: transform none;">
          <div>
            <h4 class="font-semibold text-md">${pharm.name}</h4>
            <p class="text-xs" style="color: var(--text-light); margin-bottom: 4px;">📍 ${pharm.address} • 🛵 ${t("delivery")} ${pharm.deliveryTime}</p>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="color: var(--color-warning);">⭐ ${pharm.rating}</span>
              ${stockBadge}
            </div>
          </div>
          
          <div style="text-align: right; display: flex; align-items: center; gap: 20px;">
            <div>
              <p class="text-xs" style="color: var(--text-light);">${t("delivery")}: ${pharm.deliveryFee.toFixed(2)} EGP</p>
              <p class="font-bold text-lg" style="color: var(--primary);">${price.toFixed(2)} EGP</p>
            </div>
            <button class="btn btn-primary btn-sm" ${!inStock ? 'disabled' : ''} onclick="addToCart('${med.id}', '${pharm.id}', ${price})">
              ${t("add_to_cart")}
            </button>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 24px;">
        <a href="#" style="color: var(--primary); font-weight:500;" onclick="navigateTo('search')">← Back to Search</a>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px; margin-bottom: 40px;">
        <!-- Left details box -->
        <div class="card" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px;">
          <div class="med-details-image-container" style="width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; background: var(--input-bg); border-radius: var(--radius-md); overflow: hidden; padding: 12px; margin-bottom: 20px; box-shadow: var(--shadow-md);">
            ${renderMedicineImage(med.image, "max-width: 100%; max-height: 100%; object-fit: contain;")}
          </div>
          <h2 class="text-2xl font-bold" style="margin-bottom: 6px;">${med.name}</h2>
          <p class="text-sm" style="color: var(--text-light); margin-bottom: 12px;">${med.genericName} • ${med.dosage}</p>
          ${med.prescriptionRequired ? `<span class="badge badge-danger" style="margin-bottom: 20px;">${t("rx_required")} (Rx)</span>` : `<span class="badge badge-success" style="margin-bottom: 20px;">${t("otc")}</span>`}
          
          <div style="text-align: left; width: 100%; border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 10px;">
            <p class="text-xs font-semibold" style="color: var(--text-muted); margin-bottom: 6px;">${t("active_formula")}</p>
            <p class="text-sm" style="margin-bottom: 16px;">${med.genericName}</p>
            
            <p class="text-xs font-semibold" style="color: var(--text-muted); margin-bottom: 6px;">${t("therapeutic_group")}</p>
            <p class="text-sm" style="margin-bottom: 16px;">${med.category}</p>
          </div>
        </div>

        <!-- Right comparison & description box -->
        <div>
          <div class="card" style="margin-bottom: 24px;">
            <h3 class="font-bold text-lg" style="margin-bottom: 12px;">Product Information</h3>
            <p class="text-sm" style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${med.description}</p>
            
            <div style="background-color: var(--color-danger-light); border-radius: var(--radius-sm); padding: 14px; border-left: 4px solid var(--color-danger);">
              <h4 class="text-sm font-semibold" style="color: var(--color-danger); margin-bottom: 4px;">⚠️ ${t("warnings_precautions")}:</h4>
              <p class="text-xs" style="color: var(--text-muted); margin: 0; line-height: 1.4;">${med.warnings}</p>
            </div>
          </div>

          <h3 class="font-bold text-lg" style="margin-bottom: 16px;">${t("compare_purchase")}</h3>
          <div id="pharmacies-comparison-list">
            ${pharmaciesGridHTML || `<p style="color: var(--color-danger); font-weight:500;">No local pharmacies have stock available for this medicine.</p>`}
          </div>
        </div>
      </div>
    `;
  };

  // --- ECOSYSTEM ACTIONS ---
  window.applyPlatformCoupon = function (code) {
    if (!code) {
      showToast("Please enter a coupon code.", "warning");
      return;
    }
    const match = state.activeCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (match) {
      state.activeCoupon = match;
      showToast(`Coupon ${match.code} applied successfully!`, "success");
      navigateTo("home");
    } else {
      showToast("Invalid or expired coupon code.", "danger");
    }
  };

  window.removePlatformCoupon = function () {
    state.activeCoupon = null;
    showToast("Coupon removed.", "info");
    navigateTo("home");
  };

  window.bookTelemedAppointment = function (doctor) {
    const time = "Tomorrow at 4:30 PM";
    state.activeConsultations.push({ doctor, time });
    showToast(`Successfully scheduled e-consultation with ${doctor}!`, "success");
    navigateTo("home");
  };

  window.bookLabVisit = function (packageStr) {
    const parts = packageStr.split(":");
    const lab = parts[0];
    const pkg = parts[1] || "Full Screening Panel";
    const date = "May 25, 2026 (08:00 AM)";
    state.activeLabBookings.push({ lab, package: pkg, date });
    showToast(`Home blood collection scheduled with ${lab}!`, "success");
    navigateTo("home");
  };

  window.syncInsuranceCard = function (cardNo, provider) {
    if (!cardNo) {
      showToast("Please enter your insurance card number.", "warning");
      return;
    }
    showToast("Connecting to Ministry of Health public authority databases...", "info");
    setTimeout(() => {
      state.insuranceCard = cardNo;
      state.insuranceProvider = provider;
      showToast(`Insurance synchronized successfully with ${provider}!`, "success");
      navigateTo("home");
    }, 1200);
  };

  window.disconnectInsurance = function () {
    state.insuranceCard = "";
    state.insuranceProvider = "";
    showToast("Insurance profile disconnected.", "info");
    navigateTo("home");
  };

  // --- CART MANAGEMENT ---
  window.addToCart = function (medId, pharmId, price) {
    const med = state.medicines.find(m => m.id === medId);
    if (!med) return;

    // Simple rule: cart can only hold items from one pharmacy to ensure standard checkout
    const distinctPharms = [...new Set(state.cart.map(i => i.pharmacyId))];
    if (distinctPharms.length > 0 && distinctPharms[0] !== pharmId) {
      if (confirm("Your cart contains medications from a different pharmacy. Empty cart and add this item?")) {
        state.cart = [];
      } else {
        return;
      }
    }

    const existing = state.cart.find(i => i.medicineId === medId && i.pharmacyId === pharmId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        medicineId: medId,
        pharmacyId: pharmId,
        unitPrice: price,
        quantity: 1
      });
    }

    showToast(`Added ${med.name} to Cart`, "success");
    updatePatientCartUI();
  };

  window.removeFromCart = function (medId) {
    state.cart = state.cart.filter(item => item.medicineId !== medId);
    showToast("Removed item from cart", "warning");
    updatePatientCartUI();
  };

  window.adjustQuantity = function (medId, amount) {
    const item = state.cart.find(i => i.medicineId === medId);
    if (item) {
      item.quantity += amount;
      if (item.quantity <= 0) {
        removeFromCart(medId);
      } else {
        updatePatientCartUI();
      }
    }
  };

  function updatePatientCartUI() {
    const cartBubble = document.getElementById("cart-bubble-count");
    if (cartBubble) {
      const count = state.cart.reduce((acc, i) => acc + i.quantity, 0);
      cartBubble.textContent = count;
      cartBubble.style.display = count > 0 ? "flex" : "none";
    }

    // Refresh navbar to update badge
    if (state.activeRole === "public") {
      renderNavbar();
    }

    // If active view is cart page, re-render
    if (state.activeScreen === "cart") {
      renderCartPage();
    }
  }

  // --- WORKFLOW: PRESCRIPTION SCANNING OCR ---
  window.triggerPrescriptionUpload = function (files) {
    const dropzone = document.getElementById("prescription-drop-area");
    const resultsContainer = document.getElementById("ocr-extracted-preview");
    if (!dropzone || !resultsContainer) return;

    dropzone.innerHTML = `
      <div style="padding: 24px; text-align: center;">
        <span style="font-size: 3rem; display: block; margin-bottom: 12px; animation: bounce 1s infinite alternate;">📄</span>
        <h4 class="font-semibold text-md" style="margin-bottom: 4px;">Uploading Prescription Image...</h4>
        <p class="text-xs" style="color: var(--text-light);">Initiating Dawaya Intelligent OCR Reader</p>
      </div>
    `;

    window.PrescriptionOCREngine.startScan(dropzone, resultsContainer, (medIds) => {
      // Completed scanning callback
      showToast("OCR Parsing Finished. Matching pharmacies.", "success");

      // Auto redirect to medicine comparison filtering these medicines
      state.activeScreen = "search";
      renderAppLayout();

      const searchInput = document.getElementById("patient-search-input");
      if (searchInput) {
        searchInput.value = "Prescription Results";
      }

      // Filter view to display only these medications
      const searchResultsContainer = document.getElementById("search-results-grid");
      if (searchResultsContainer) {
        searchResultsContainer.innerHTML = Array(3).fill(0).map(() => `
          <div class="skeleton-card">
            <div class="skeleton-loader skeleton-bar" style="width: 40%; height: 24px;"></div>
            <div class="skeleton-loader skeleton-bar" style="width: 80%;"></div>
            <div class="skeleton-loader skeleton-bar" style="width: 100%; height: 40px; margin-top:20px;"></div>
          </div>
        `).join("");

        setTimeout(() => {
          const filtered = state.medicines.filter(m => medIds.includes(m.id));
          searchResultsContainer.innerHTML = filtered.map(med => {
            const minPrice = Math.min(...Object.values(med.prices));
            return `
              <div class="card med-card" style="border: 2px solid var(--primary); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div class="med-card-image-container" style="width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; background: var(--input-bg); border-radius: 12px; overflow: hidden; padding: 4px; box-shadow: var(--shadow-sm);">
                      ${renderMedicineImage(med.image, "max-width: 100%; max-height: 100%; object-fit: contain;")}
                    </div>
                    <span class="badge badge-info">OCR Detected</span>
                  </div>
                  <h3 class="font-bold text-lg" style="margin-bottom: 4px;">${med.name}</h3>
                  <p class="text-xs" style="color: var(--text-light); margin-bottom: 8px;">${med.genericName} • ${med.dosage}</p>
                  
                  <div style="background-color: var(--primary-light); border-radius: var(--radius-sm); padding: 10px; margin-bottom: 16px;">
                    <p class="text-xs" style="color: var(--text-muted); margin:0;">Matched prescription item exactly. Required Box quantity: 1</p>
                  </div>
                </div>
                
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div>
                      <p class="text-xs" style="color: var(--text-light); margin-bottom: 2px;">${t("starting_from")}</p>
                      <p class="font-bold text-xl" style="color: var(--text-main); font-family: var(--font-display);">${minPrice.toFixed(2)} EGP</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="viewMedicineDetails('${med.id}')">Compare Prices</button>
                  </div>
                </div>
              </div>
            `;
          }).join("");
        }, 600);
      }
    });
  };

  // --- WORKFLOW: WHATSAPP REMINDER SCHEDULER ---
  window.saveMedicationReminder = function (e) {
    if (e) e.preventDefault();

    const name = document.getElementById("rem-name").value;
    const dosage = document.getElementById("rem-dosage").value;
    const schedule = document.getElementById("rem-time").value;

    const newRem = {
      id: `rem-${state.reminders.length + 1}`,
      name: name,
      dosage: dosage,
      schedule: formatTime(schedule),
      days: ["Daily"],
      status: "Active",
      history: []
    };

    state.reminders.push(newRem);
    showToast(`WhatsApp medication reminder configured for ${name}!`, "success");

    // Simulate WhatsApp Message trigger inside phone mock frame
    const phoneChat = document.getElementById("phone-chat-screen-body");
    if (phoneChat) {
      const bubble = document.createElement("div");
      bubble.className = "phone-msg-bubble";
      bubble.innerHTML = `
        🤖 <strong>Dawaya Reminder Engine</strong><br>
        Hi ${state.currentUser.name.split(" ")[0]}! Your automated WhatsApp medication scheduler is activated.<br><br>
        💊 <strong>Med:</strong> ${name}<br>
        🕒 <strong>Dosage:</strong> ${dosage}<br>
        📅 <strong>Time:</strong> Daily at ${formatTime(schedule)}<br><br>
        Reply <strong>1</strong> to confirm intakes.
        <span class="msg-time">Just Now</span>
      `;
      phoneChat.appendChild(bubble);
      phoneChat.scrollTop = phoneChat.scrollHeight;
    }

    renderRemindersList();
    document.getElementById("reminder-modal-form").reset();
  };

  function formatTime(timeStr) {
    if (!timeStr) return "08:00 AM";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  }

  function renderRemindersList() {
    const listContainer = document.getElementById("reminders-dashboard-list");
    if (!listContainer) return;

    listContainer.innerHTML = state.reminders.map(rem => {
      const historyRows = rem.history.map(h => `
        <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem; padding: 2px 8px; border-radius:var(--radius-full); background: var(--input-bg); margin-right:4px;">
          📅 ${h.date} - <strong style="color: ${h.status === 'Taken' ? 'var(--color-success)' : 'var(--color-danger)'};">${h.status}</strong>
        </span>
      `).join("");

      return `
        <div class="card" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; hover: transform none;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 1.5rem;">📱</span>
              <h4 class="font-bold text-md" style="margin: 0;">${rem.name}</h4>
              <span class="badge badge-success">WhatsApp Active</span>
            </div>
            <p class="text-sm" style="color: var(--text-muted); margin-bottom: 8px;">Dosage: <strong>${rem.dosage}</strong> • Scheduled for <strong>${rem.schedule} Daily</strong></p>
            <div>
              <p class="text-xs" style="color: var(--text-light); margin-bottom: 4px;">Intake History:</p>
              ${historyRows || `<p class="text-xs" style="color: var(--text-light);">No data logs recorded yet</p>`}
            </div>
          </div>
          
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="triggerIntakeRecord('${rem.id}', 'Taken')">Mark Taken ✅</button>
            <button class="btn btn-danger btn-sm" onclick="deleteReminder('${rem.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join("");
  }

  window.triggerIntakeRecord = function (remId, status) {
    const rem = state.reminders.find(r => r.id === remId);
    if (rem) {
      rem.history.unshift({
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        status: status,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      });
      showToast(`Logged intake for ${rem.name}`, "success");
      renderRemindersList();

      // Update Whatsapp Phone Preview Chat
      const phoneChat = document.getElementById("phone-chat-screen-body");
      if (phoneChat) {
        const bubbleUser = document.createElement("div");
        bubbleUser.className = "phone-msg-bubble sent";
        bubbleUser.innerHTML = `
          1
          <span class="msg-time">Just Now</span>
        `;
        const bubbleBot = document.createElement("div");
        bubbleBot.className = "phone-msg-bubble";
        bubbleBot.innerHTML = `
          🙌 Thanks, John! We have logged your intake of <strong>${rem.name}</strong> at ${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}. Keep up the healthy routine!
          <span class="msg-time">Just Now</span>
        `;
        phoneChat.appendChild(bubbleUser);
        setTimeout(() => {
          phoneChat.appendChild(bubbleBot);
          phoneChat.scrollTop = phoneChat.scrollHeight;
        }, 600);
      }
    }
  };

  window.deleteReminder = function (remId) {
    state.reminders = state.reminders.filter(r => r.id !== remId);
    showToast("Medication reminder canceled", "danger");
    renderRemindersList();
  };

  function renderPhoneMessages() {
    const chat = document.getElementById("phone-chat-screen-body");
    if (!chat) return;

    chat.innerHTML = `
      <div class="phone-msg-bubble">
        🤖 <strong>Dawaya Virtual Pharmacy</strong><br>
        Welcome John. Standard scheduling channel is set up. You will receive active dosage reminds here via SMS/WhatsApp simulations.
        <span class="msg-time">08:00 AM</span>
      </div>
      <div class="phone-msg-bubble">
        🔔 <strong>Medication Alert</strong><br>
        Hi John! It's time to take your <strong>Glucophage 850mg</strong>. 1 tablet after breakfast.<br><br>
        Reply <strong>1</strong> to mark as TAKEN or <strong>2</strong> to snooze.
        <span class="msg-time">08:30 AM</span>
      </div>
      <div class="phone-msg-bubble sent">
        1
        <span class="msg-time">08:32 AM</span>
      </div>
      <div class="phone-msg-bubble">
        🎉 Thank you! Intake recorded successfully at 08:32 AM.
        <span class="msg-time">08:32 AM</span>
      </div>
    `;
    chat.scrollTop = chat.scrollHeight;
  }

  // --- WORKFLOW: CHECKOUT & MULTI-ROLE ORDER PROPAGATION ---
  window.renderCartPage = function () {
    const cartBody = document.getElementById("cart-body-content");
    if (!cartBody) return;

    if (state.cart.length === 0) {
      cartBody.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3 class="font-bold text-xl">${t("cart_empty")}</h3>
          <p style="color: var(--text-muted);">${t("cart_desc")}</p>
          <button class="btn btn-primary" onclick="navigateTo('search')">${t("browse_medicines")}</button>
        </div>
      `;
      return;
    }

    const firstItem = state.cart[0];
    const pharmacy = state.pharmacies.find(p => p.id === firstItem.pharmacyId);

    let subtotal = 0;
    const itemsListHTML = state.cart.map(item => {
      const med = state.medicines.find(m => m.id === item.medicineId);
      const totalLine = item.unitPrice * item.quantity;
      subtotal += totalLine;

      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div class="cart-item-image-container" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: var(--input-bg); border-radius: 8px; overflow: hidden; padding: 2px;">
              ${renderMedicineImage(med.image, "max-width: 100%; max-height: 100%; object-fit: contain;")}
            </div>
            <div>
              <h4 class="font-bold text-sm" style="margin:0;">${med.name}</h4>
              <p class="text-xs" style="color: var(--text-light); margin:0;">Unit Cost: ${item.unitPrice.toFixed(2)} EGP</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-xs); background-color: var(--input-bg);">
              <button style="padding: 6px 12px; background:none; cursor:pointer;" onclick="adjustQuantity('${med.id}', -1)">-</button>
              <strong style="padding: 0 8px; font-size:0.9rem;">${item.quantity}</strong>
              <button style="padding: 6px 12px; background:none; cursor:pointer;" onclick="adjustQuantity('${med.id}', 1)">+</button>
            </div>
            
            <div style="text-align: right; min-width: 80px;">
              <strong style="color: var(--text-main); font-size:0.95rem;">${totalLine.toFixed(2)} EGP</strong>
            </div>
            
            <button style="background: none; color: var(--color-danger); cursor:pointer; font-size: 1.1rem;" onclick="removeFromCart('${med.id}')">🗑️</button>
          </div>
        </div>
      `;
    }).join("");

    const deliveryFee = pharmacy.deliveryFee;
    const finalTotal = subtotal + deliveryFee;

    cartBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: flex-start;">
        <!-- Left: Cart items -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
            <h3 class="font-bold text-lg" style="margin: 0;">${t("medications_list")}</h3>
            <span class="badge badge-info">Ordering from ${pharmacy.name}</span>
          </div>
          
          <div style="display:flex; flex-direction:column;">
            ${itemsListHTML}
          </div>
          
          <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button class="btn btn-outline" onclick="navigateTo('search')">← Keep Shopping</button>
            <button class="btn btn-danger" style="background-color: transparent; border: 1px solid var(--color-danger); color: var(--color-danger) !important;" onclick="clearCart()">Empty Cart</button>
          </div>
        </div>

        <!-- Right: Checkout billing summary -->
        <div class="card" style="position: sticky; top: 100px;">
          <h3 class="font-bold text-lg" style="margin-bottom: 16px;">${t("billing_summary")}</h3>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem;">
            <span style="color: var(--text-muted);">${t("subtotal")}:</span>
            <strong style="color: var(--text-main);">${subtotal.toFixed(2)} EGP</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.9rem;">
            <span style="color: var(--text-muted);">Standard Delivery:</span>
            <strong style="color: var(--text-main);">${deliveryFee.toFixed(2)} EGP</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between; border-top: 2px solid var(--border-color); padding-top: 16px; margin-bottom: 24px;">
            <span class="font-bold" style="font-size:1.1rem; color: var(--text-main);">${t("grand_total")}:</span>
            <strong style="font-size:1.2rem; color: var(--primary); font-family: var(--font-display);">${finalTotal.toFixed(2)} EGP</strong>
          </div>

          <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px; background: var(--input-bg); margin-bottom: 20px;">
            <p class="text-xs font-semibold" style="margin-bottom: 6px; color: var(--text-muted);">📍 ${t("delivery_address")}</p>
            <p class="text-xs" style="margin: 0; color: var(--text-main); line-height: 1.4;">${state.currentUser.address}</p>
          </div>

          <button class="btn btn-primary" style="width: 100%;" onclick="navigateTo('checkout')">${t("proceed_checkout")}</button>
        </div>
      </div>
    `;
  };

  window.clearCart = function () {
    state.cart = [];
    showToast("Cart cleared", "warning");
    updatePatientCartUI();
  };

  window.renderCheckoutPage = function () {
    const checkoutContainer = document.getElementById("checkout-form-content");
    if (!checkoutContainer) return;

    const firstItem = state.cart[0];
    const pharmacy = state.pharmacies.find(p => p.id === firstItem.pharmacyId);
    let subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const finalTotal = subtotal + pharmacy.deliveryFee;

    checkoutContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
        <div class="card">
          <h3 class="font-bold text-lg" style="margin-bottom: 20px; border-bottom:1px solid var(--border-color); padding-bottom: 12px;">${t("shipping_payment")}</h3>
          
          <form id="checkout-finalize-form" onsubmit="finalizeOrderPlacement(event, ${subtotal}, ${pharmacy.deliveryFee}, ${finalTotal}, '${pharmacy.id}', '${pharmacy.name}')">
            <h4 class="font-semibold text-md" style="margin-bottom: 12px;">${t("shipping_coords")}</h4>
            <div class="form-group">
              <label class="form-label">${t("name_label")}</label>
              <input type="text" class="form-control" value="${state.currentUser.name}" required id="chk-name">
            </div>
            
            <div class="form-group">
              <label class="form-label">Contact Number</label>
              <input type="text" class="form-control" value="${state.currentUser.phone}" required id="chk-phone">
            </div>
            
            <div class="form-group">
              <label class="form-label">Drop-off Street Address</label>
              <input type="text" class="form-control" value="${state.currentUser.address}" required id="chk-address">
            </div>

            <h4 class="font-semibold text-md" style="margin-top: 24px; margin-bottom: 12px;">${t("payment_method")}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <label class="card" style="padding: 16px; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="radio" name="payment-method" value="Cash on Delivery" checked style="width: 18px; height: 18px;">
                <div>
                  <span class="font-bold text-sm">${t("cash_delivery")}</span>
                  <p class="text-xs" style="color: var(--text-light); margin:0;">${t("pay_at_door")}</p>
                </div>
              </label>
              
              <label class="card" style="padding: 16px; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="radio" name="payment-method" value="Online Credit Card" style="width: 18px; height: 18px;">
                <div>
                  <span class="font-bold text-sm">${t("credit_online")}</span>
                  <p class="text-xs" style="color: var(--text-light); margin:0;">${t("visa_secured")}</p>
                </div>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">Place Order (${finalTotal.toFixed(2)} EGP)</button>
          </form>
        </div>

        <div class="card" style="align-self: flex-start;">
          <h3 class="font-bold text-md" style="margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">${t("order_details")}</h3>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${state.cart.map(item => {
      const med = state.medicines.find(m => m.id === item.medicineId);
      return `
                <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                  <span>${med.name} (x${item.quantity})</span>
                  <strong>${(item.unitPrice * item.quantity).toFixed(2)} EGP</strong>
                </div>
              `;
    }).join("")}
          </div>
        </div>
      </div>
    `;
  };

  window.finalizeOrderPlacement = function (e, subtotal, delivery, total, pharmacyId, pharmacyName) {
    if (e) e.preventDefault();

    const name = document.getElementById("chk-name").value;
    const phone = document.getElementById("chk-phone").value;
    const address = document.getElementById("chk-address").value;
    const payMethod = document.querySelector('input[name="payment-method"]:checked').value;

    const newOrder = {
      id: `DWY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      pharmacyId: pharmacyId,
      pharmacyName: pharmacyName,
      items: state.cart.map(item => {
        const med = state.medicines.find(m => m.id === item.medicineId);
        return {
          id: item.medicineId,
          name: med.name,
          quantity: item.quantity,
          price: item.unitPrice
        };
      }),
      subtotal: subtotal,
      deliveryFee: delivery,
      total: total,
      paymentMethod: payMethod,
      address: address,
      status: "Placed", // First tracking state
      patientName: name,
      patientPhone: phone
    };

    // Add to system orders list
    state.orders.unshift(newOrder);

    // Reset Cart
    state.cart = [];
    updatePatientCartUI();

    showToast(t("order_placed_success"), "success");
    navigateTo("orders");
  };

  window.viewOrderTracking = function (orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    // Display high-fidelity modal representing tracking flow
    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-box" style="max-width: 600px;">
        <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</span>
        <h3 class="font-bold text-xl" style="margin-bottom: 20px;">${t("order_tracker")}: ${order.id}</h3>
        
        <div style="background-color: var(--input-bg); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 24px; display: flex; justify-content: space-between;">
          <div>
            <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">Pharmacy Partner</p>
            <strong style="color:var(--text-main);">${order.pharmacyName}</strong>
          </div>
          <div>
            <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">Grand Total</p>
            <strong style="color:var(--primary); font-size:1.1rem;">${order.total.toFixed(2)} EGP</strong>
          </div>
          <div>
            <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">${t("current_status")}</p>
            <span class="badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${order.status.toUpperCase()}</span>
          </div>
        </div>

        <h4 class="font-semibold text-sm" style="margin-bottom: 16px; color: var(--text-muted);">${t("tracking_progress")}</h4>
        <div style="display:flex; justify-content:space-between; align-items:center; position:relative; margin-bottom:32px; padding:0 12px;">
          <!-- Progress line behind bubbles -->
          <div style="position:absolute; top: 12px; left: 16px; right: 16px; height: 4px; background-color: var(--border-color); z-index: 1;"></div>
          <div id="tracker-bar-fill" style="position:absolute; top: 12px; left: 16px; height: 4px; background-color: var(--primary); z-index: 2; width: 0%;"></div>

          <div style="text-align:center; z-index: 3;">
            <div class="tracker-dot" id="dot-placed" style="width: 28px; height: 28px; border-radius:50%; background-color: var(--border-color); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:700; margin:0 auto 8px auto;">1</div>
            <span class="text-xs font-semibold" style="color: var(--text-light);">Placed</span>
          </div>
          
          <div style="text-align:center; z-index: 3;">
            <div class="tracker-dot" id="dot-packing" style="width: 28px; height: 28px; border-radius:50%; background-color: var(--border-color); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:700; margin:0 auto 8px auto;">2</div>
            <span class="text-xs font-semibold" style="color: var(--text-light);">Packing</span>
          </div>
          
          <div style="text-align:center; z-index: 3;">
            <div class="tracker-dot" id="dot-dispatched" style="width: 28px; height: 28px; border-radius:50%; background-color: var(--border-color); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:700; margin:0 auto 8px auto;">3</div>
            <span class="text-xs font-semibold" style="color: var(--text-light);">Dispatched</span>
          </div>
          
          <div style="text-align:center; z-index: 3;">
            <div class="tracker-dot" id="dot-delivered" style="width: 28px; height: 28px; border-radius:50%; background-color: var(--border-color); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:700; margin:0 auto 8px auto;">4</div>
            <span class="text-xs font-semibold" style="color: var(--text-light);">Delivered</span>
          </div>
        </div>

        <!-- Simulated Delivery Map -->
        <h4 class="font-semibold text-sm" style="margin-bottom: 12px; color: var(--text-muted);">${t("realtime_route")}</h4>
        <div style="width: 100%; height: 180px; background-color: var(--primary-light); border-radius: var(--radius-sm); border:1px solid var(--border-color); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <!-- Map grids -->
          <div style="position:absolute; width:100%; height:100%; background: linear-gradient(rgba(15, 98, 254, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 98, 254, 0.05) 1px, transparent 1px); background-size: 20px 20px;"></div>
          <!-- Road path line -->
          <svg style="position:absolute; width:100%; height:100%; pointer-events:none;">
            <path d="M 50 140 Q 150 20 280 150 T 520 80" fill="none" stroke="var(--primary)" stroke-width="4" stroke-dasharray="8,5" />
          </svg>
          <!-- Pharmacy pin -->
          <div style="position:absolute; left: 45px; top: 110px; font-size:1.6rem; cursor:pointer;" title="${order.pharmacyName}">🏥</div>
          <!-- Customer pin -->
          <div style="position:absolute; right: 65px; top: 55px; font-size:1.6rem; cursor:pointer;" title="Zamalek drop-off">🏠</div>
          <!-- Delivery Rider -->
          <div id="map-rider-marker" style="position:absolute; left: 45px; top: 110px; font-size:1.4rem; transition: all 3s ease;">🛵</div>
          
          <div class="text-xs font-semibold" style="position:absolute; bottom:12px; left:12px; background:var(--bg-card); padding:4px 8px; border-radius:var(--radius-xs); box-shadow:var(--shadow-sm);">
            ${order.status === 'Delivered' ? 'Rider has reached your address!' : 'Rider is packaging items...'}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Apply active colors and transition progress bar
    setTimeout(() => {
      const barFill = modal.querySelector("#tracker-bar-fill");
      const dotPlaced = modal.querySelector("#dot-placed");
      const dotPacking = modal.querySelector("#dot-packing");
      const dotDispatched = modal.querySelector("#dot-dispatched");
      const dotDelivered = modal.querySelector("#dot-delivered");
      const riderMarker = modal.querySelector("#map-rider-marker");

      let width = "0%";
      dotPlaced.style.backgroundColor = "var(--primary)";

      if (order.status === "Placed") {
        width = "10%";
      } else if (order.status === "Packing") {
        width = "33%";
        dotPacking.style.backgroundColor = "var(--primary)";
        if (riderMarker) {
          riderMarker.style.left = "130px";
          riderMarker.style.top = "60px";
        }
      } else if (order.status === "Dispatched") {
        width = "66%";
        dotPacking.style.backgroundColor = "var(--primary)";
        dotDispatched.style.backgroundColor = "var(--primary)";
        if (riderMarker) {
          riderMarker.style.left = "280px";
          riderMarker.style.top = "130px";
        }
      } else if (order.status === "Delivered") {
        width = "100%";
        dotPacking.style.backgroundColor = "var(--primary)";
        dotDispatched.style.backgroundColor = "var(--primary)";
        dotDelivered.style.backgroundColor = "var(--primary)";
        if (riderMarker) {
          riderMarker.style.left = "480px";
          riderMarker.style.top = "70px";
        }
      }

      if (barFill) barFill.style.width = width;
    }, 200);
  };

  // --- WORKFLOW: PHARMACY INVENTORY & STOCK CRUD ---
  window.triggerPharmacyMedicineModal = function (medId = null) {
    const med = state.medicines.find(m => m.id === medId);
    const title = med ? `Edit Stock: ${med.name}` : "Add New Medication";
    const editSessionId = state.activePharmacySession;

    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-box">
        <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</span>
        <h3 class="font-bold text-xl" style="margin-bottom: 20px;">${title}</h3>
        
        <form id="pharmacy-med-modal-form" onsubmit="savePharmacyMedicineChanges(event, '${medId}')">
          <div class="form-group">
            <label class="form-label">Medicine Title</label>
            <input type="text" class="form-control" value="${med ? med.name : ''}" required id="pmed-name" ${med ? 'disabled' : ''}>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Pricing (EGP)</label>
              <input type="number" step="0.01" class="form-control" value="${med ? (med.prices[editSessionId] || 0) : ''}" required id="pmed-price">
            </div>
            
            <div class="form-group">
              <label class="form-label">Active Stock Count</label>
              <input type="number" class="form-control" value="${med ? (med.stock[editSessionId] || 0) : ''}" required id="pmed-stock">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Product Category</label>
            <select class="form-control" id="pmed-category" ${med ? 'disabled' : ''}>
              <option value="OTC / Pain Relief">OTC / Pain Relief</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Chronic / Cholesterol">Chronic / Cholesterol</option>
              <option value="Chronic / Diabetes">Chronic / Diabetes</option>
              <option value="Respiratory">Respiratory</option>
              <option value="Allergies / OTC">Allergies / OTC</option>
              <option value="Vitamins & Supplements">Vitamins & Supplements</option>
            </select>
          </div>

          <button type="submit" class="btn btn-accent" style="width:100%; margin-top: 10px;">Save Stock Details</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    if (med && document.getElementById("pmed-category")) {
      document.getElementById("pmed-category").value = med.category;
    }
  };

  window.savePharmacyMedicineChanges = function (e, medId) {
    if (e) e.preventDefault();

    const price = parseFloat(document.getElementById("pmed-price").value);
    const stock = parseInt(document.getElementById("pmed-stock").value);
    const editSessionId = state.activePharmacySession;

    if (medId && medId !== 'null' && medId !== 'undefined') {
      // Editing existing medicine
      const med = state.medicines.find(m => m.id === medId);
      if (med) {
        med.prices[editSessionId] = price;
        med.stock[editSessionId] = stock;
        showToast(`Stock updated for ${med.name}`, "success");
      }
    } else {
      // Add new stock entry
      const name = document.getElementById("pmed-name").value;
      const cat = document.getElementById("pmed-category").value;

      const newMed = {
        id: `med-${state.medicines.length + 1}`,
        name: name,
        genericName: "Generic Compound",
        category: cat,
        image: "💊",
        dosage: "1 Unit",
        description: "New pharmacological stock entry configured locally.",
        prescriptionRequired: cat.includes("Antibiotics") || cat.includes("Chronic"),
        warnings: "Take as directed by pharmacist",
        prices: {
          [editSessionId]: price
        },
        stock: {
          [editSessionId]: stock
        }
      };

      state.medicines.push(newMed);
      showToast(`Added ${name} to Inventory Database`, "success");
    }

    document.querySelector(".modal-overlay.active").remove();
    if (state.activeScreen === "inventory") {
      renderPharmacyInventory();
    }
  };

  // --- WORKFLOW: ADMIN APPROVAL VERIFICATION ---
  window.triggerVerifyPharmacyModal = function (pharmId) {
    const pharm = state.pharmacies.find(p => p.id === pharmId);
    if (!pharm) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-box" style="max-width: 550px;">
        <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</span>
        <h3 class="font-bold text-xl" style="margin-bottom: 20px;">Review Operating Credentials</h3>
        
        <div style="display:flex; flex-direction:column; gap:16px; margin-bottom: 24px;">
          <div>
            <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">Applicant Pharmacy Partner</p>
            <h4 class="font-bold text-md" style="margin:0; color:var(--text-main);">${pharm.name}</h4>
            <p class="text-xs" style="color:var(--text-muted);">📍 ${pharm.address}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">License ID</p>
              <strong style="font-family:var(--font-display);">${pharm.licenseNo}</strong>
            </div>
            <div>
              <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">Request Date</p>
              <strong>${pharm.joinedDate}</strong>
            </div>
          </div>

          <!-- Document mock display -->
          <div style="border: 1px dashed var(--primary); border-radius: var(--radius-sm); padding:16px; background-color:var(--primary-light); text-align:center;">
            <span style="font-size: 2.2rem; display:block; margin-bottom:6px;">📜</span>
            <p class="text-xs font-semibold" style="margin:0; color:var(--primary);">Ministry of Health License File Verified</p>
            <p class="text-xs" style="color:var(--text-muted); margin:0;">MOH_Operating_Permit_Signed_2025.pdf (3.4 MB)</p>
          </div>
        </div>

        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button class="btn btn-outline btn-sm" onclick="rejectPharmacyLicense('${pharm.id}')">Reject Application</button>
          <button class="btn btn-primary btn-sm" onclick="approvePharmacyLicense('${pharm.id}')">Approve & Publish Active</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.approvePharmacyLicense = function (pharmId) {
    const pharm = state.pharmacies.find(p => p.id === pharmId);
    if (pharm) {
      pharm.status = "Active";
      showToast(`${pharm.name} approved! All nearby patients can now order.`, "success");
    }
    document.querySelector(".modal-overlay.active").remove();
    if (state.activeScreen === "approvals") {
      renderAdminApprovals();
    }
  };

  window.rejectPharmacyLicense = function (pharmId) {
    const pharm = state.pharmacies.find(p => p.id === pharmId);
    if (pharm) {
      pharm.status = "Rejected";
      showToast(`${pharm.name} license rejected. Notification dispatched.`, "danger");
    }
    document.querySelector(".modal-overlay.active").remove();
    if (state.activeScreen === "approvals") {
      renderAdminApprovals();
    }
  };

  // --- CHART RENDERING SYSTEM (SVG/CSS VECTOR BASED) ---
  function renderPharmacyCharts() {
    const revenueChart = document.getElementById("pharmacy-revenue-chart");
    if (!revenueChart) return;

    revenueChart.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 500 240">
        <defs>
          <linearGradient id="pharmacy-revenue-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- Grid horizontal lines -->
        <line class="chart-grid" x1="40" y1="40" x2="480" y2="40" />
        <line class="chart-grid" x1="40" y1="90" x2="480" y2="90" />
        <line class="chart-grid" x1="40" y1="140" x2="480" y2="140" />
        <line class="chart-grid" x1="40" y1="190" x2="480" y2="190" />
        
        <!-- Y axis numbers -->
        <text class="chart-label" x="10" y="44">15k</text>
        <text class="chart-label" x="10" y="94">10k</text>
        <text class="chart-label" x="10" y="144">5k</text>
        <text class="chart-label" x="10" y="194">0k</text>

        <!-- X axis text labels -->
        <text class="chart-label" x="65" y="215">Mon</text>
        <text class="chart-label" x="135" y="215">Tue</text>
        <text class="chart-label" x="205" y="215">Wed</text>
        <text class="chart-label" x="275" y="215">Thu</text>
        <text class="chart-label" x="345" y="215">Fri</text>
        <text class="chart-label" x="415" y="215">Sat</text>

        <!-- Gradient Area Fill -->
        <path class="chart-area" d="M 70 180 L 140 130 L 210 150 L 280 80 L 350 110 L 420 50 L 420 190 L 70 190 Z" fill="url(#pharmacy-revenue-grad)" />

        <!-- Line paths -->
        <path class="chart-line" d="M 70 180 L 140 130 L 210 150 L 280 80 L 350 110 L 420 50" />
        
        <!-- Hover dots -->
        <circle class="chart-point" cx="70" cy="180" title="Mon: 2,000 EGP" />
        <circle class="chart-point" cx="140" cy="130" title="Tue: 6,000 EGP" />
        <circle class="chart-point" cx="210" cy="150" title="Wed: 4,500 EGP" />
        <circle class="chart-point" cx="280" cy="80" title="Thu: 11,000 EGP" />
        <circle class="chart-point" cx="350" cy="110" title="Fri: 8,000 EGP" />
        <circle class="chart-point" cx="420" cy="50" title="Sat: 14,000 EGP" />
      </svg>
    `;
  }

  function renderAdminCharts() {
    const adminChart = document.getElementById("admin-global-chart");
    if (!adminChart) return;

    adminChart.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 500 240">
        <defs>
          <linearGradient id="admin-revenue-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="admin-accent-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- Grid horizontal lines -->
        <line class="chart-grid" x1="40" y1="40" x2="480" y2="40" />
        <line class="chart-grid" x1="40" y1="90" x2="480" y2="90" />
        <line class="chart-grid" x1="40" y1="140" x2="480" y2="140" />
        <line class="chart-grid" x1="40" y1="190" x2="480" y2="190" />
        
        <!-- Y axis numbers -->
        <text class="chart-label" x="10" y="44">100k</text>
        <text class="chart-label" x="10" y="94">60k</text>
        <text class="chart-label" x="10" y="144">30k</text>
        <text class="chart-label" x="10" y="194">0k</text>

        <!-- X axis text labels -->
        <text class="chart-label" x="70" y="215">Jan</text>
        <text class="chart-label" x="150" y="215">Feb</text>
        <text class="chart-label" x="230" y="215">Mar</text>
        <text class="chart-label" x="310" y="215">Apr</text>
        <text class="chart-label" x="390" y="215">May</text>

        <!-- Area fills -->
        <path class="chart-area" d="M 80 170 L 160 140 L 240 100 L 320 80 L 400 45 L 400 190 L 80 190 Z" fill="url(#admin-revenue-grad)" />
        <path class="chart-area" d="M 80 185 L 160 160 L 240 140 L 320 120 L 400 95 L 400 190 L 80 190 Z" fill="url(#admin-accent-grad)" />

        <!-- Double lines comparison: Global revenue (Blue) vs Pharmacies registrations (Teal) -->
        <path class="chart-line" d="M 80 170 L 160 140 L 240 100 L 320 80 L 400 45" />
        <path class="chart-accent-line" d="M 80 185 L 160 160 L 240 140 L 320 120 L 400 95" />

        <circle class="chart-point" cx="80" cy="170" />
        <circle class="chart-point" cx="160" cy="140" />
        <circle class="chart-point" cx="240" cy="100" />
        <circle class="chart-point" cx="320" cy="80" />
        <circle class="chart-point" cx="400" cy="45" />

        <circle class="chart-point" cx="80" cy="185" style="stroke: var(--accent);" />
        <circle class="chart-point" cx="160" cy="160" style="stroke: var(--accent);" />
        <circle class="chart-point" cx="240" cy="140" style="stroke: var(--accent);" />
        <circle class="chart-point" cx="320" cy="120" style="stroke: var(--accent);" />
        <circle class="chart-point" cx="400" cy="95" style="stroke: var(--accent);" />
      </svg>
    `;
  }

  // --- SUBCOMPONENT RENDERING METHODS ---
  // --- PUBLIC PAGES TEMPLATES ---
  function getLandingPageHTML() {
    // Section 1: Hero Carousel Banners (Auto Cycles)
    const carouselBannersHTML = `
      <div class="hero-carousel-container">
        <!-- Slide 1 -->
        <div class="hero-slide active" style="background: linear-gradient(135deg, rgba(15, 98, 254, 0.05), rgba(0, 186, 181, 0.05)); padding: 40px; display: flex; flex-direction: column; justify-content: center; height: 100%;">
          <div style="margin-bottom: 16px;">
            <span class="badge badge-info" style="text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-size: 0.72rem; box-shadow: 0 4px 12px rgba(15, 98, 254, 0.15); border: 1px solid rgba(15, 98, 254, 0.25);">🏥 ${t("hero_badge")}</span>
          </div>
          <h1 class="text-4xl" style="line-height: 1.15; font-size: 2.8rem; margin-bottom: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-display); background: linear-gradient(135deg, var(--text-main) 30%, var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${t("hero_title")}</h1>
          <p class="text-lg" style="color: var(--text-muted); margin-bottom: 32px; max-width: 520px; line-height: 1.6; font-size: 0.95rem;">${t("hero_subtitle")}</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-primary" onclick="switchRole('patient'); navigateTo('search');" style="box-shadow: var(--shadow-glow-blue); font-weight: 600;">Explore Medicines →</button>
            <button class="btn btn-outline" onclick="switchRole('patient'); navigateTo('upload');" style="font-weight: 600;">Scan Prescription</button>
          </div>
        </div>

        <!-- Slide 2 -->
        <div class="hero-slide" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(15, 98, 254, 0.05)); padding: 40px; display: flex; flex-direction: column; justify-content: center; height: 100%;">
          <div style="margin-bottom: 16px;">
            <span class="badge badge-success" style="text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-size: 0.72rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.25);">🛡️ Ministry of Health Verified</span>
          </div>
          <h1 class="text-4xl" style="line-height: 1.15; font-size: 2.8rem; margin-bottom: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-display); background: linear-gradient(135deg, var(--text-main) 30%, var(--color-success)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Accredited & Safe Pharmacy Grid</h1>
          <p class="text-lg" style="color: var(--text-muted); margin-bottom: 32px; max-width: 520px; line-height: 1.6; font-size: 0.95rem;">Dawaya partners exclusively with fully licensed local pharmacists. Our strict verification standard guarantees genuine ingredients and accurate medicine dosages.</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-success" onclick="switchRole('pharmacy'); navigateTo('home');" style="box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); font-weight: 600; color: #fff;">Pharmacy Portal</button>
            <button class="btn btn-outline" onclick="navigateTo('about');" style="font-weight: 600;">Learn Security Policies</button>
          </div>
        </div>

        <!-- Slide 3 -->
        <div class="hero-slide" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(0, 186, 181, 0.05)); padding: 40px; display: flex; flex-direction: column; justify-content: center; height: 100%;">
          <div style="margin-bottom: 16px;">
            <span class="badge badge-warning" style="text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-size: 0.72rem; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.25);">🤖 OCR AI Scanner Integration</span>
          </div>
          <h1 class="text-4xl" style="line-height: 1.15; font-size: 2.8rem; margin-bottom: 16px; font-weight: 800; color: var(--text-main); font-family: var(--font-display); background: linear-gradient(135deg, var(--text-main) 30%, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Scan Handwritten Recipes Instantly</h1>
          <p class="text-lg" style="color: var(--text-muted); margin-bottom: 32px; max-width: 520px; line-height: 1.6; font-size: 0.95rem;">Unsure about doctor scripts? Take a snapshot. Our machine learning scanner parses handwriting, detects compounds, and fetches pricing from local networks in seconds.</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-accent" onclick="switchRole('patient'); navigateTo('upload');" style="box-shadow: 0 4px 14px rgba(0, 186, 181, 0.25); font-weight: 600; color: #fff;">Try OCR Reader 📸</button>
            <button class="btn btn-outline" onclick="switchRole('patient'); navigateTo('search');" style="font-weight: 600;">Browse Catalog</button>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div class="carousel-dots-wrapper">
          <span class="carousel-dot active"></span>
          <span class="carousel-dot"></span>
          <span class="carousel-dot"></span>
        </div>
      </div>
    `;

    // Section 2: Hero Side Widget (WhatsApp log mock, active delivery areas, drag uploads)
    const heroSideWidgetHTML = `
      <div class="card hero-side-panel-widget" style="padding: 28px; border: 1px solid var(--border-color); backdrop-filter: var(--glass-blur); background: rgba(var(--bg-card-rgb), 0.7); box-shadow: var(--shadow-lg); border-radius: var(--radius-md); position: relative; overflow: hidden;">
        <!-- Glowing background visual effect -->
        <div style="position: absolute; top: -50px; right: -50px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(15, 98, 254, 0.15) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; position: relative; z-index: 1;">
          <h3 class="font-bold text-sm" style="margin:0; display:flex; align-items:center; gap:8px; font-family: var(--font-display); letter-spacing: 0.3px;">
            <span class="whatsapp-badge-pulse" style="width:10px; height:10px; background-color:#25d366; border-radius:50%; display:inline-block; box-shadow: 0 0 10px #25d366;"></span>
            ${t("wh_reminders")} Live
          </h3>
          <span class="badge badge-success" style="font-size:0.65rem; padding: 3px 10px; font-weight:700; border-radius: 20px;">SYSTEM: ONLINE</span>
        </div>

        <!-- Whatsapp mock reminder queue -->
        <div style="background-color: var(--input-bg); border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding: 16px; margin-bottom: 20px; font-size: 0.82rem; position: relative; z-index: 1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
          <p style="margin:0 0 10px 0; color: var(--text-muted); font-weight:700; display:flex; align-items:center; gap:6px;">
            <span>📅</span> Daily Schedule (Patient John):
          </p>
          <div style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom:1px dashed var(--border-color);">
            <span style="font-weight: 500; color: var(--text-main);">💊 Glucophage 850mg</span>
            <strong style="color:var(--primary); background: rgba(15,98,254,0.08); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">08:30 AM</strong>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0;">
            <span style="font-weight: 500; color: var(--text-main);">💊 Lipitor 10mg</span>
            <strong style="color:var(--primary); background: rgba(15,98,254,0.08); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">10:00 PM</strong>
          </div>
        </div>

        <!-- Quick OCR Upload Shortcut -->
        <div class="ocr-upload-zone" style="border: 2px dashed var(--primary); background-color: rgba(15, 98, 254, 0.03); border-radius: var(--radius-sm); padding: 20px; text-align:center; cursor:pointer; transition: var(--transition); position: relative; z-index: 1;" onclick="switchRole('patient'); navigateTo('upload');" onmouseover="this.style.backgroundColor='rgba(15, 98, 254, 0.06)'" onmouseout="this.style.backgroundColor='rgba(15, 98, 254, 0.03)'">
          <div class="ocr-icon-glow" style="font-size: 2.2rem; display:inline-block; margin-bottom:8px; animation: float 3s infinite alternate;">📤</div>
          <h4 class="font-bold text-xs" style="margin: 0 0 4px 0; color: var(--primary); font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.5px;">${t("ocr_presc")}</h4>
          <p class="text-xs" style="color: var(--text-muted); margin:0; line-height: 1.3;">Snapshot uploads read scripts, search ingredients, and aggregate inventories instantly.</p>
        </div>

        <!-- Active Delivery Zones Widget -->
        <div style="margin-top:20px; padding-top:16px; border-top: 1px solid var(--border-color); display:flex; align-items:flex-start; gap:12px; font-size:0.78rem; position: relative; z-index: 1;">
          <span style="font-size: 1.4rem;">📍</span>
          <div>
            <strong style="color: var(--text-main); font-weight: 700; display: block; margin-bottom: 2px;">Covered Delivery Zones:</strong>
            <p class="text-xs" style="color: var(--text-muted); margin:0; line-height: 1.4;">Zamalek, Maadi, Downtown, Heliopolis, New Cairo Hubs.</p>
          </div>
        </div>
      </div>
    `;

    // Section 3: About Us with Milestones & Timeline
    const aboutSectionHTML = `
      <section style="padding: 100px 0; background: var(--bg-card); border-top: 1px solid var(--border-color); overflow: hidden; position: relative;">
        <!-- Atmospheric glowing circle -->
        <div style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(0, 186, 181, 0.05) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>
        
        <div class="container" style="position: relative; z-index: 1;">
          <div style="text-align: center; margin-bottom: 60px;">
            <span class="badge badge-info" style="margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">🧬 Our Mission & Integrity</span>
            <h2 class="text-3xl font-bold" style="margin-bottom: 16px; font-family: var(--font-display); font-size: 2.4rem;">Pioneering Smart Cairo Healthcare</h2>
            <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto; font-size: 1rem; line-height: 1.6;">Dawaya is a mission-driven digital pharmacy marketplace engineered to democratize medicine procurement through strict price audit transparency, AI prescription assistance, and automated patient compliance.</p>
          </div>

          <!-- Milestones Timeline Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; position: relative;">
            <!-- Milestone 1 -->
            <div class="card timeline-card" style="padding: 30px; position: relative; z-index: 1;">
              <div style="position: absolute; top: -16px; left: 30px; background: linear-gradient(135deg, var(--primary), #0056e0); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-display); box-shadow: 0 4px 10px rgba(15, 98, 254, 0.3);">1</div>
              <h4 class="font-bold text-sm" style="margin: 10px 0 8px 0; font-family: var(--font-display); color: var(--text-main); font-size: 1.1rem;">The Dawaya Genesis</h4>
              <p class="text-xs" style="color: var(--text-muted); line-height: 1.6;">Founded with the objective of eliminating pricing asymmetric differences in local retail drugs. Designed a prototype database mapping 10,000+ local pharmacy inventory logs.</p>
            </div>

            <!-- Milestone 2 -->
            <div class="card timeline-card" style="padding: 30px; position: relative; z-index: 1;">
              <div style="position: absolute; top: -16px; left: 30px; background: linear-gradient(135deg, var(--accent), #00a49f); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-display); box-shadow: 0 4px 10px rgba(0, 186, 181, 0.3);">2</div>
              <h4 class="font-bold text-sm" style="margin: 10px 0 8px 0; font-family: var(--font-display); color: var(--text-main); font-size: 1.1rem;">AI OCR Handwritings Reader</h4>
              <p class="text-xs" style="color: var(--text-muted); line-height: 1.6;">Launched our intelligent OCR engine with specialized models trained in Arabic/English handwritten recipe structures, bringing fast diagnostic analysis to users.</p>
            </div>

            <!-- Milestone 3 -->
            <div class="card timeline-card" style="padding: 30px; position: relative; z-index: 1;">
              <div style="position: absolute; top: -16px; left: 30px; background: linear-gradient(135deg, var(--color-success), #0d9488); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-display); box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);">3</div>
              <h4 class="font-bold text-sm" style="margin: 10px 0 8px 0; font-family: var(--font-display); color: var(--text-main); font-size: 1.1rem;">Cairo Smart Grid Expansion</h4>
              <p class="text-xs" style="color: var(--text-muted); line-height: 1.6;">Integrated a direct MOH validation grid. Dawaya now operates across Cairo with automated delivery tracking routes and daily clinical dosage reminders.</p>
            </div>
          </div>
        </div>
      </section>
    `;

    // Section 4: Browse Categories Grid
    const categoriesHTML = `
      <section style="padding: 100px 0; background: var(--bg-app); border-top: 1px solid var(--border-color); position: relative;">
        <!-- Glowing background visual effect -->
        <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(15, 98, 254, 0.04) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>
        
        <div class="container" style="position: relative; z-index: 1;">
          <div style="text-align: center; margin-bottom: 60px;">
            <span class="badge badge-success" style="margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">🛍️ Curated Classifications</span>
            <h2 class="text-3xl font-bold" style="margin-bottom: 16px; font-family: var(--font-display); font-size: 2.4rem;">${t("medical_categories")}</h2>
            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto; font-size: 1rem; line-height: 1.5;">Select a medical domain card below to view inventory, price comparisons, and stocks immediately.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px;">
            <!-- Category 1 -->
            <div class="category-grid-card" onclick="switchRole('patient'); navigateTo('search'); triggerPatientSearch('OTC');">
              <span style="font-size: 3.2rem; display:block; margin-bottom:14px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">💊</span>
              <h4 class="font-bold text-sm" style="margin:0; color:var(--text-main); font-family: var(--font-display); font-size: 1.05rem;">OTC / Pain Relief</h4>
              <p class="text-xs" style="color:var(--text-light); margin-top:6px; line-height: 1.4;">Paracetamol & General Medications</p>
            </div>
            
            <!-- Category 2 -->
            <div class="category-grid-card" onclick="switchRole('patient'); navigateTo('search'); triggerPatientSearch('Antibiotics');">
              <span style="font-size: 3.2rem; display:block; margin-bottom:14px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🧬</span>
              <h4 class="font-bold text-sm" style="margin:0; color:var(--text-main); font-family: var(--font-display); font-size: 1.05rem;">Antibiotics</h4>
              <p class="text-xs" style="color:var(--text-light); margin-top:6px; line-height: 1.4;">Broad-Spectrum compounds</p>
            </div>

            <!-- Category 3 -->
            <div class="category-grid-card" onclick="switchRole('patient'); navigateTo('search'); triggerPatientSearch('Cholesterol');">
              <span style="font-size: 3.2rem; display:block; margin-bottom:14px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">❤️</span>
              <h4 class="font-bold text-sm" style="margin:0; color:var(--text-main); font-family: var(--font-display); font-size: 1.05rem;">Cholesterol</h4>
              <p class="text-xs" style="color:var(--text-light); margin-top:6px; line-height: 1.4;">Statins & Chronic Heart Care</p>
            </div>

            <!-- Category 4 -->
            <div class="category-grid-card" onclick="switchRole('patient'); navigateTo('search'); triggerPatientSearch('Diabetes');">
              <span style="font-size: 3.2rem; display:block; margin-bottom:14px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🩸</span>
              <h4 class="font-bold text-sm" style="margin:0; color:var(--text-main); font-family: var(--font-display); font-size: 1.05rem;">Diabetes Care</h4>
              <p class="text-xs" style="color:var(--text-light); margin-top:6px; line-height: 1.4;">Glycemic Control & Insulin</p>
            </div>

            <!-- Category 5 -->
            <div class="category-grid-card" onclick="switchRole('patient'); navigateTo('search'); triggerPatientSearch('Respiratory');">
              <span style="font-size: 3.2rem; display:block; margin-bottom:14px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">💨</span>
              <h4 class="font-bold text-sm" style="margin:0; color:var(--text-main); font-family: var(--font-display); font-size: 1.05rem;">Respiratory</h4>
              <p class="text-xs" style="color:var(--text-light); margin-top:6px; line-height: 1.4;">Reliever Inhalers & COPD Care</p>
            </div>

            <!-- Category 6 -->
            <div class="category-grid-card" onclick="switchRole('patient'); navigateTo('search'); triggerPatientSearch('Vitamin');">
              <span style="font-size: 3.2rem; display:block; margin-bottom:14px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🍊</span>
              <h4 class="font-bold text-sm" style="margin:0; color:var(--text-main); font-family: var(--font-display); font-size: 1.05rem;">Vitamins</h4>
              <p class="text-xs" style="color:var(--text-light); margin-top:6px; line-height: 1.4;">Immune system and vital boosters</p>
            </div>
          </div>
        </div>
      </section>
    `;

    // Section 5: Infinite Scrolling Partner Pharmacies Brand Marquee
    const brandsHTML = `
      <section style="padding: 60px 0; background: var(--bg-card); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); overflow:hidden;">
        <div class="container" style="margin-bottom: 24px; text-align: center;">
          <h3 class="font-bold text-xs" style="color: var(--text-muted); text-transform:uppercase; letter-spacing:1.5px; font-family: var(--font-display);">${t("partner_pharmacies")}</h3>
        </div>

        <div class="marquee-container">
          <div class="marquee-content">
            <!-- Set 1 -->
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">El Ezaby Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.8 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Metro Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.6 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Seif Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.7 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Dawaya Express</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.9 Rating • Speed Rider</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Care Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.5 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Image Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.6 Rating • MOH Licensed</p>
              </div>
            </div>

            <!-- Duplicate Set for loop -->
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">El Ezaby Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.8 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Metro Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.6 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Seif Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.7 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Dawaya Express</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.9 Rating • Speed Rider</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Care Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.5 Rating • MOH Licensed</p>
              </div>
            </div>
            <div class="marquee-card">
              <span style="font-size: 2.2rem;">🏥</span>
              <div>
                <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Image Pharmacy</h4>
                <p class="text-xs" style="color: var(--color-success); margin:0; font-weight:700;">⭐ 4.6 Rating • MOH Licensed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Section 6: Products Catalog (Featured, Most Selling, New Arrivals) - EXACTLY 5 per row in CSS
    const featuredProductsList = state.medicines.slice(0, 5).map(med => {
      const activePrices = Object.values(med.prices);
      const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : 15.00;

      return `
        <div class="product-card-modern">
          <div class="product-image-container" style="display: flex; align-items: center; justify-content: center; height: 120px; overflow: hidden; background: var(--input-bg); border-radius: var(--radius-sm); margin-bottom: 12px; padding: 8px;">
            ${renderMedicineImage(med.image, "max-width: 100%; max-height: 100%; object-fit: contain;")}
            <div class="product-card-wishlist" onclick="switchRole('patient'); showToast('${med.name} added to favorites', 'success'); event.stopPropagation();">❤️</div>
          </div>
          
          <div style="flex-grow: 1; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="product-card-rating">⭐ 4.7</span>
              ${med.prescriptionRequired
          ? `<span class="badge badge-danger" style="font-size:0.6rem; padding: 2px 8px; font-weight:700;">Rx Required</span>`
          : `<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 8px; font-weight:700;">OTC Safe</span>`}
            </div>
            
            <h4 class="product-card-title">${med.name}</h4>
            <p class="text-xs" style="color: var(--text-light); margin:0 0 8px 0; font-weight: 600;">${med.genericName}</p>
            <p class="product-card-desc" style="height: 50px; overflow:hidden;">${med.description}</p>
            
            <div class="product-card-pricing-row">
              <div>
                <span class="product-price-label">${t("starting_from")}</span>
                <div class="product-price-value">${minPrice.toFixed(2)} EGP</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="switchRole('patient'); viewMedicineDetails('${med.id}')" style="padding: 6px 12px; font-size:0.75rem; font-weight:600;">Compare</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    const catalogHTML = `
      <section style="padding: 100px 0; background: var(--bg-card); border-top:1px solid var(--border-color); position: relative;">
        <!-- Glowing background visual effect -->
        <div style="position: absolute; bottom: -100px; right: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(15, 98, 254, 0.04) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>
        
        <div class="container" style="position: relative; z-index: 1;">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:48px; flex-wrap: wrap; gap: 20px;">
            <div>
              <span class="badge badge-success" style="margin-bottom:8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🏥 REAL-TIME STOCKS</span>
              <h2 class="text-3xl font-bold" style="margin:0; font-family: var(--font-display); font-size: 2.2rem;">Featured Smart Medical Grid</h2>
            </div>
            <button class="btn btn-outline" onclick="switchRole('patient'); navigateTo('search');" style="font-weight:600;">${t("explore_dashboard")} →</button>
          </div>

          <!-- Desktop row with exactly 5 items -->
          <div class="products-grid-5cols">
            ${featuredProductsList}
          </div>
        </div>
      </section>
    `;

    // Section 7: Pharmacy Accreditation Form alongside Cairo Digital Live Delivery Map
    const pharmacyAccreditationAndMapHTML = `
      <section style="padding: 100px 0; background: var(--bg-app); border-top:1px solid var(--border-color); position: relative;">
        <div class="container" style="max-width: 1120px; position: relative; z-index: 1;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:60px; align-items:center;">
            
            <!-- Left Column: Cairo Coverage interactive map -->
            <div>
              <span class="badge badge-success" style="margin-bottom:12px; font-weight:700;">🛵 LIVE COURIER MOCK</span>
              <h2 class="text-3xl font-bold" style="margin-bottom:16px; font-family: var(--font-display); font-size: 2.2rem;">Cairo Digital Coverage</h2>
              <p class="text-md" style="color:var(--text-muted); line-height: 1.6; margin-bottom:24px;">Our live courier tracking system dynamically aggregates drug inventories from local licensed hubs. Orders are picked up, scanned, and delivered in record speeds.</p>
              
              <!-- High-fidelity simulated delivery coordinates map -->
              <div style="width: 100%; height: 320px; background-color: var(--bg-card); border-radius: var(--radius-md); border:1px solid var(--border-color); position:relative; overflow:hidden; box-shadow: var(--shadow-md); display:flex; align-items:center; justify-content:center;">
                <!-- Map grids -->
                <div style="position:absolute; width:100%; height:100%; background: linear-gradient(rgba(15, 98, 254, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 98, 254, 0.04) 1px, transparent 1px); background-size: 20px 20px;"></div>
                
                <!-- Map Cairo outline simulated circles -->
                <div style="position:absolute; width:100px; height:100px; border-radius:50%; border:2px dashed rgba(15,98,254,0.15); animation: pulse-glow-blue 3s infinite; left: 20px; top: 30px;"></div>
                <div style="position:absolute; width:140px; height:140px; border-radius:50%; border:2px dashed rgba(0,186,181,0.15); animation: pulse-glow-blue 4s infinite; right: 40px; bottom: 30px;"></div>
                
                <!-- Paths and connections -->
                <svg style="position:absolute; width:100%; height:100%; pointer-events:none;">
                  <path d="M 40 230 L 150 120 L 260 210 L 380 90" fill="none" stroke="var(--primary)" stroke-width="3" stroke-dasharray="6,4" style="stroke-linecap: round;" />
                  <path d="M 150 120 L 300 60" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4,4" style="stroke-linecap: round; opacity: 0.6;" />
                </svg>
                
                <!-- Pulsing Node markers -->
                <div style="position:absolute; left: 35px; top: 220px; display:flex; flex-direction:column; align-items:center;">
                  <div style="font-size:1.6rem; animation: float 3s infinite alternate;">🏥</div>
                  <span style="background:var(--primary); color:white; font-size:0.6rem; padding: 2px 6px; border-radius:4px; font-weight:700; box-shadow: 0 2px 4px rgba(0,0,0,0.15); margin-top:2px;">ZAMALEK HUB</span>
                </div>
                
                <div style="position:absolute; left: 140px; top: 105px; display:flex; flex-direction:column; align-items:center;">
                  <div style="font-size:1.6rem; animation: float 3.5s infinite alternate;">🏥</div>
                  <span style="background:var(--accent); color:white; font-size:0.6rem; padding: 2px 6px; border-radius:4px; font-weight:700; box-shadow: 0 2px 4px rgba(0,0,0,0.15); margin-top:2px;">HELIOPOLIS HUB</span>
                </div>
                
                <div style="position:absolute; right: 100px; bottom: 85px; display:flex; flex-direction:column; align-items:center;">
                  <div style="font-size:1.6rem; animation: float 2.8s infinite alternate;">🏠</div>
                  <span style="background:var(--color-success); color:white; font-size:0.6rem; padding: 2px 6px; border-radius:4px; font-weight:700; box-shadow: 0 2px 4px rgba(0,0,0,0.15); margin-top:2px;">PATIENT HOME</span>
                </div>
                
                <!-- Moving courier rider -->
                <div style="position:absolute; left: 90px; top: 165px; font-size:1.5rem; animation: float 2.5s infinite alternate; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));">🛵</div>
                
                <div class="text-xs font-semibold" style="position:absolute; bottom:12px; left:12px; background:var(--bg-card); border:1px solid var(--border-color); padding:4px 8px; border-radius:var(--radius-xs); box-shadow:var(--shadow-sm); font-size:0.7rem; color:var(--text-main);">
                  🟢 <strong>Dawaya Express</strong> active routes: Zamalek - Maadi - Heliopolis
                </div>
              </div>
            </div>

            <!-- Right Column: Redesigned Quick Apply Form -->
            <div class="card" style="box-shadow:var(--shadow-lg); padding: 36px; border: 1px solid var(--border-color); background: var(--bg-card); position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
              
              <h3 class="font-bold text-lg" style="margin-bottom:8px; font-family: var(--font-display); font-size: 1.4rem;">${t("accreditation_title")}</h3>
              <p class="text-xs" style="color:var(--text-muted); margin-bottom:24px; line-height: 1.4;">Aggregate your medicine stock, publish digital catalogs, receive secure prescription orders, and expand your local neighborhood client base.</p>
              
              <form id="pharmacy-quick-apply-form" onsubmit="event.preventDefault(); showToast('Accreditation registration token has been dispatched successfully.', 'success'); this.reset();">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label" style="font-weight:700; color: var(--text-main); font-size: 0.78rem;">Pharmacy Legal Title</label>
                  <input type="text" class="form-control" required placeholder="E.g., Seif Pharmacy Zamalek Branch" style="padding: 12px; font-size: 0.85rem;">
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label" style="font-weight:700; color: var(--text-main); font-size: 0.78rem;">Ministry of Health Operating ID</label>
                  <input type="text" class="form-control" required placeholder="LIC-XXXXXX-EGY" style="padding: 12px; font-size: 0.85rem;">
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                  <label class="form-label" style="font-weight:700; color: var(--text-main); font-size: 0.78rem;">Manager Mobile Contact</label>
                  <input type="text" class="form-control" required placeholder="+201xxxxxxxx" style="padding: 12px; font-size: 0.85rem;">
                </div>
                
                <button type="submit" class="btn btn-accent" style="width:100%; padding: 14px; font-weight:700; color:#fff; text-shadow: 0 1px 2px rgba(0,0,0,0.1); text-transform:uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(0, 186, 181, 0.25);">Apply For Accreditation 🚀</button>
              </form>
            </div>
            
          </div>
        </div>
      </section>
    `;

    // Section 8: Why Choose Us
    const whyChooseUsHTML = `
      <section style="padding: 100px 0; background: var(--bg-card); border-top: 1px solid var(--border-color); position: relative;">
        <!-- Glowing background visual effect -->
        <div style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(0, 186, 181, 0.03) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>
        
        <div class="container" style="position: relative; z-index: 1;">
          <div style="text-align: center; margin-bottom: 60px;">
            <span class="badge badge-info" style="margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">⚡ Key Capabilities</span>
            <h2 class="text-3xl font-bold" style="margin-bottom: 16px; font-family: var(--font-display); font-size: 2.4rem;">${t("why_us")}</h2>
            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto; font-size: 1rem; line-height: 1.5;">How Dawaya brings premium technological solutions into localized healthcare compliance.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 32px;">
            <!-- Column 1 -->
            <div class="card" style="padding: 30px; text-align:left; border-top: 4px solid var(--primary); transition: var(--transition); box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='var(--shadow-lg)';" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)';">
              <span style="font-size:2.4rem; display:block; margin-bottom:16px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🛵</span>
              <h4 class="font-bold text-sm" style="margin-bottom:10px; color:var(--text-main); font-family: var(--font-display); font-size: 1.15rem;">Express Delivery Guarantee</h4>
              <p class="text-xs" style="color:var(--text-muted); line-height: 1.6; font-size: 0.8rem;">Dawaya Express riders aggregate medications from verified hubs and deliver to your doorstep inside active Cairo neighborhoods in under 30 minutes.</p>
            </div>
            
            <!-- Column 2 -->
            <div class="card" style="padding: 30px; text-align:left; border-top: 4px solid var(--accent); transition: var(--transition); box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='var(--shadow-lg)';" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)';">
              <span style="font-size:2.4rem; display:block; margin-bottom:16px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">💰</span>
              <h4 class="font-bold text-sm" style="margin-bottom:10px; color:var(--text-main); font-family: var(--font-display); font-size: 1.15rem;">Transparent Price Compare</h4>
              <p class="text-xs" style="color:var(--text-muted); line-height: 1.6; font-size: 0.8rem;">Save up to 25% on chronic prescriptions by auditing unit pricing lists from multiple local retail pharmacy vendors in Cairo instantly.</p>
            </div>

            <!-- Column 3 -->
            <div class="card" style="padding: 30px; text-align:left; border-top: 4px solid var(--color-success); transition: var(--transition); box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='var(--shadow-lg)';" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)';">
              <span style="font-size:2.4rem; display:block; margin-bottom:16px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">📱</span>
              <h4 class="font-bold text-sm" style="margin-bottom:10px; color:var(--text-main); font-family: var(--font-display); font-size: 1.15rem;">WhatsApp Auto Reminders</h4>
              <p class="text-xs" style="color:var(--text-muted); line-height: 1.6; font-size: 0.8rem;">Stay in perfect clinical sync. Receive automated daily intake notifications and refill alerts straight to your personal WhatsApp chat queue.</p>
            </div>

            <!-- Column 4 -->
            <div class="card" style="padding: 30px; text-align:left; border-top: 4px solid #7c3aed; transition: var(--transition); box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='var(--shadow-lg)';" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)';">
              <span style="font-size:2.4rem; display:block; margin-bottom:16px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🔍</span>
              <h4 class="font-bold text-sm" style="margin-bottom:10px; color:var(--text-main); font-family: var(--font-display); font-size: 1.15rem;">AI prescription Scanners</h4>
              <p class="text-xs" style="color:var(--text-muted); line-height: 1.6; font-size: 0.8rem;">Our highly sophisticated intelligent OCR engine recognizes messy physician handwritings, matching active drug ingredients to verified stocks.</p>
            </div>
          </div>
        </div>
      </section>
    `;

    // Section 9: Statistics Counters
    const statisticsHTML = `
      <section style="background: linear-gradient(135deg, #070b13 0%, #111a2e 100%); padding: 80px 0; color: #fff; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
        <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center;">
          <div>
            <h2 class="text-4xl font-bold" style="font-family: var(--font-display); font-size:3.5rem; margin-bottom:8px; background: linear-gradient(90deg, #fff, var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:800;">50k+</h2>
            <p class="text-xs font-semibold" style="color: var(--text-light); text-transform:uppercase; letter-spacing:1px;">${t("active_patients")}</p>
          </div>
          <div>
            <h2 class="text-4xl font-bold" style="font-family: var(--font-display); font-size:3.5rem; margin-bottom:8px; background: linear-gradient(90deg, #fff, var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:800;">120+</h2>
            <p class="text-xs font-semibold" style="color: var(--text-light); text-transform:uppercase; letter-spacing:1px;">${t("licensed_pharmacies")}</p>
          </div>
          <div>
            <h2 class="text-4xl font-bold" style="font-family: var(--font-display); font-size:3.5rem; margin-bottom:8px; background: linear-gradient(90deg, #fff, var(--color-success)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:800;">99.8%</h2>
            <p class="text-xs font-semibold" style="color: var(--text-light); text-transform:uppercase; letter-spacing:1px;">${t("ontime_delivery")}</p>
          </div>
          <div>
            <h2 class="text-4xl font-bold" style="font-family: var(--font-display); font-size:3.5rem; margin-bottom:8px; background: linear-gradient(90deg, #fff, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:800;">1.2M+</h2>
            <p class="text-xs font-semibold" style="color: var(--text-light); text-transform:uppercase; letter-spacing:1px;">${t("reminders_sent")}</p>
          </div>
        </div>
      </section>
    `;

    // Section 10: Testimonials Slider
    const testimonialCards = MOCK_TESTIMONIALS.map(t => `
      <div class="card" style="flex: 1; min-width: 320px; background-color: var(--bg-card); position:relative; padding: 32px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
        <span class="testimonials-quotes" style="position:absolute; top:8px; right:24px; font-size:5rem; color: rgba(15, 98, 254, 0.06); font-family:serif; font-weight:800;">“</span>
        <span style="font-size: 2.5rem; display:block; margin-bottom: 16px;">${t.avatar}</span>
        <p style="font-style: italic; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px; line-height:1.6;">"${t.text}"</p>
        <h4 class="font-bold text-sm" style="margin: 0; color: var(--text-main); font-family: var(--font-display); font-size: 1.05rem;">${t.name}</h4>
        <span class="text-xs" style="color: var(--text-light); font-weight:600;">${t.role}</span>
      </div>
    `).join("");

    const testimonialsHTML = `
      <section style="padding: 100px 0; background: var(--bg-card); border-bottom: 1px solid var(--border-color);">
        <div class="container">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 60px; flex-wrap: wrap; gap: 20px;">
            <div>
              <span class="badge badge-info" style="margin-bottom:8px; font-weight: 700;">⭐ USER TESTIMONIALS</span>
              <h2 class="text-3xl font-bold" style="margin:0; font-family: var(--font-display); font-size: 2.2rem;">${t("testimonials_title")}</h2>
            </div>
            <p style="color: var(--text-muted); max-width: 420px; margin:0; font-size:0.9rem; line-height:1.5;">Endorsed by accredited Cairo clinicians, chronic disease patients, and technology directors.</p>
          </div>
          
          <div style="display: flex; gap: 28px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none;">
            ${testimonialCards}
          </div>
        </div>
      </section>
    `;

    // Section 11: Contact Us Form
    const contactHTML = `
      <section style="padding: 100px 0; background: var(--bg-app); position: relative;">
        <!-- Glowing background visual effect -->
        <div style="position: absolute; top: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(15, 98, 254, 0.03) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>
        
        <div class="container" style="max-width: 1080px; position: relative; z-index: 1;">
          <div style="text-align: center; margin-bottom: 60px;">
            <span class="badge badge-success" style="margin-bottom:12px; font-weight:700;">📧 GET IN TOUCH</span>
            <h2 class="text-3xl font-bold" style="margin-bottom:12px; font-family: var(--font-display); font-size: 2.4rem;">${t("contact_title")}</h2>
            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto; font-size: 1rem; line-height: 1.5;">Have inquiries regarding pharmacy compliance, price discrepancies, or API setups?</p>
          </div>

          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:48px; align-items:flex-start;">
            <!-- Message Request Ticket Form -->
            <div class="card" style="box-shadow: var(--shadow-md); padding: 36px; border: 1px solid var(--border-color); background: var(--bg-card); border-radius: var(--radius-md);">
              <form onsubmit="event.preventDefault(); showToast('Your support ticket has been registered. Ref TCK-' + Math.floor(100 + Math.random()*900), 'success'); this.reset();">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label" style="font-weight:700; color: var(--text-main); font-size:0.78rem;">${t("name_label")}</label>
                  <input type="text" class="form-control" required placeholder="E.g., John Doe" style="padding: 12px; font-size:0.85rem;">
                </div>
                
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label" style="font-weight:700; color: var(--text-main); font-size:0.78rem;">${t("email_label")}</label>
                  <input type="email" class="form-control" required placeholder="E.g., john.doe@gmail.com" style="padding: 12px; font-size:0.85rem;">
                </div>
                
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label" style="font-weight:700; color: var(--text-main); font-size:0.78rem;">${t("subject_label")}</label>
                  <input type="text" class="form-control" required placeholder="Order inquiry, Pharmacy setup..." style="padding: 12px; font-size:0.85rem;">
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                  <label class="form-label" style="font-weight:700; color: var(--text-main); font-size:0.78rem;">${t("message_label")}</label>
                  <textarea class="form-control" rows="4" required placeholder="Describe your issue in detail..." style="padding: 12px; font-size:0.85rem; line-height: 1.5;"></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%; padding:14px; font-weight:700; box-shadow: var(--shadow-glow-blue);">${t("submit_inquiry")}</button>
              </form>
            </div>

            <!-- Coverage details & contact channels -->
            <div style="display:flex; flex-direction:column; gap: 20px;">
              <h3 class="font-bold text-lg" style="font-family: var(--font-display); font-size:1.3rem; margin: 0 0 10px 0; color: var(--text-main);">Maadi Digital HQ Offices</h3>
              
              <div class="card" style="padding:24px; border:1px solid var(--border-color); background: var(--bg-card);">
                <h4 class="font-bold text-sm" style="margin:0 0 6px 0; font-family: var(--font-display); color: var(--primary); display:flex; align-items:center; gap:8px;">
                  <span>📍</span> ${t("contact_office")}
                </h4>
                <p class="text-xs" style="color:var(--text-muted); line-height:1.5; font-size:0.8rem;">Digital Innovation Hub, Building 4A, Road 250, Maadi, Cairo, Egypt</p>
              </div>
              
              <div class="card" style="padding:24px; border:1px solid var(--border-color); background: var(--bg-card);">
                <h4 class="font-bold text-sm" style="margin:0 0 6px 0; font-family: var(--font-display); color: var(--accent); display:flex; align-items:center; gap:8px;">
                  <span>✉️</span> ${t("contact_channels")}
                </h4>
                <p class="text-xs" style="color:var(--text-muted); line-height:1.5; font-size:0.8rem;">General Desk Support: support@dawaya.com<br>MOH Pharmacy Verifications: compliance@dawaya.com</p>
              </div>
              
              <div class="card" style="padding:24px; border:1px solid var(--border-color); background: var(--bg-card); display:flex; gap:16px; align-items:center;">
                <span style="font-size:2.2rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">📞</span>
                <div>
                  <h4 class="font-bold text-xs" style="margin:0; color:var(--text-main); font-family: var(--font-display);">Accredited Support Line</h4>
                  <p class="text-xs" style="color: var(--text-light); margin:0;">+20 2 2768 9900 (Open 24/7)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Pulsing Floating WhatsApp support bubble
    const floatingHelpBubbleHTML = `
      <div class="floating-whatsapp-bubble-anchor" onclick="switchRole('patient'); navigateTo('reminders'); showToast('Connecting to Dawaya Medication reminders chat log...', 'info');" title="Simulate WhatsApp Support Intake">
        💬
        <span class="floating-whatsapp-badge-pulse"></span>
      </div>
    `;

    return `
      <!-- Hero promotional carousel section -->
      <header style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--accent-light) 100%); padding: 80px 0 100px 0; border-bottom: 1px solid var(--border-color); overflow:hidden; position: relative;">
        <!-- Futuristic background decorative grids -->
        <div style="position: absolute; inset: 0; background: linear-gradient(rgba(15, 98, 254, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 98, 254, 0.03) 1px, transparent 1px); background-size: 30px 30px; pointer-events: none; z-index: 0;"></div>
        
        <div class="container" style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: center; position: relative; z-index: 1;">
          ${carouselBannersHTML}
          ${heroSideWidgetHTML}
        </div>
      </header>

      <!-- Why Choose Us Grid -->
      ${whyChooseUsHTML}

      <!-- About Us Milestones Section -->
      ${aboutSectionHTML}

      <!-- Categories Section Grid -->
      ${categoriesHTML}

      <!-- Partners Brands Infinite Marquee -->
      ${brandsHTML}

      <!-- Products Catalog (Featured Marketplace) -->
      ${catalogHTML}

      <!-- Cairo Live Coverage Map & Pharmacy Accreditation Request -->
      ${pharmacyAccreditationAndMapHTML}

      <!-- Numerical Stats Counter -->
      ${statisticsHTML}

      <!-- Testimonials -->
      ${testimonialsHTML}

      <!-- Contact Us Form & Offices -->
      ${contactHTML}

      <!-- WhatsApp Help Bubble -->
      ${floatingHelpBubbleHTML}
    `;
  }

  function getAboutPageHTML() {
    return `
      <section style="padding: 100px 0; background: var(--bg-card); position: relative; overflow: hidden;">
        <!-- Glowing background visual effect -->
        <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(15, 98, 254, 0.05) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>
        
        <div class="container" style="max-width: 800px; text-align: center; position: relative; z-index: 1;">
          <span class="badge badge-info" style="margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">🧬 Clinical Integrity</span>
          <h1 class="text-4xl font-bold" style="margin-bottom: 24px; font-family: var(--font-display); font-size: 3rem; background: linear-gradient(135deg, var(--text-main) 30%, var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">About Dawaya</h1>
          <p class="text-lg" style="color:var(--text-muted); line-height: 1.8; margin-bottom:40px; font-size: 1.05rem;">Dawaya is a mission-driven digital pharmacy marketplace that bridges the gap between local pharmacies and medical patients. Our system promotes price transparency, medication compliance, and swift diagnostic deliveries.</p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-top:40px;">
            <div class="card" style="text-align:left; padding: 32px; border: 1px solid var(--border-color); background: var(--bg-app);">
              <h3 class="font-bold text-lg" style="color:var(--primary); margin-bottom:12px; font-family: var(--font-display); font-size: 1.25rem; display:flex; align-items:center; gap:8px;">
                <span>🎯</span> Our Vision
              </h3>
              <p class="text-sm" style="color:var(--text-muted); line-height: 1.6; font-size: 0.85rem;">To build a borderless digital ecosystem where all citizens, regardless of location or budget, can source affordable therapeutics efficiently and maintain medication compliance.</p>
            </div>
            <div class="card" style="text-align:left; padding: 32px; border: 1px solid var(--border-color); background: var(--bg-app);">
              <h3 class="font-bold text-lg" style="color:var(--accent); margin-bottom:12px; font-family: var(--font-display); font-size: 1.25rem; display:flex; align-items:center; gap:8px;">
                <span>🛡️</span> Our Partners
              </h3>
              <p class="text-sm" style="color:var(--text-muted); line-height: 1.6; font-size: 0.85rem;">We operate exclusively with licensed pharmacies approved by the Ministry of Health, validating operating license certifications before publishing lists.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function getContactPageHTML() {
    return `
      <section style="padding: 80px 0; background: var(--bg-app);">
        <div class="container" style="max-width: 900px;">
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:40px; align-items:flex-start;">
            <div class="card">
              <h2 class="text-2xl font-bold" style="margin-bottom: 16px;">Contact Dawaya Support</h2>
              <p class="text-sm" style="color:var(--text-muted); margin-bottom:24px;">Have technical questions, price discrepancy concerns, or billing queries? Send us a ticket.</p>
              
              <form onsubmit="event.preventDefault(); showToast('Your support ticket has been registered. Ref TCK-' + Math.floor(100 + Math.random()*900), 'success'); this.reset();">
                <div class="form-group">
                  <label class="form-label">${t("name_label")}</label>
                  <input type="text" class="form-control" required placeholder="John Doe">
                </div>
                
                <div class="form-group">
                  <label class="form-label">${t("email_label")}</label>
                  <input type="email" class="form-control" required placeholder="john@example.com">
                </div>
                
                <div class="form-group">
                  <label class="form-label">Issue Subject</label>
                  <input type="text" class="form-control" required placeholder="Order inquiry, Pharmacy setup...">
                </div>

                <div class="form-group">
                  <label class="form-label">Message Details</label>
                  <textarea class="form-control" rows="4" required placeholder="Describe your issue in details..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%;">Submit Inquiry</button>
              </form>
            </div>

            <div>
              <h3 class="font-bold text-lg" style="margin-bottom:16px;">Contact Coordinate Points</h3>
              <div class="card" style="margin-bottom:16px;">
                <h4 class="font-bold text-sm" style="margin-bottom:6px;">📍 Headquarters Office</h4>
                <p class="text-xs" style="color:var(--text-muted);">Digital Innovation Hub, Building 4A, Maadi, Cairo, Egypt</p>
              </div>
              <div class="card" style="margin-bottom:16px;">
                <h4 class="font-bold text-sm" style="margin-bottom:6px;">✉️ Support Channels</h4>
                <p class="text-xs" style="color:var(--text-muted);">General: support@dawaya.com<br>Press: media@dawaya.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function getLoginPageHTML() {
    return `
      <section style="padding: 80px 0; background: var(--bg-app); display:flex; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
          <div style="text-align:center; margin-bottom:24px; display:flex; flex-direction:column; align-items:center; gap:8px;">
            <div class="logo-icon" style="width: 54px; height: 54px;">
              ${LOGO_SVG_MARK}
            </div>
            <div class="logo-text-container" style="align-items: center;">
              <span class="logo-brand-title" style="font-size: 1.8rem; margin: 0;">${t("brand_name")}</span>
              <span class="logo-brand-subtitle" style="font-size: 0.6rem; margin-top: 3px;">${t("brand_subtitle")}</span>
            </div>
            <h2 class="text-2xl font-bold" style="margin-top: 12px;">${t("login_title")}</h2>
            <p class="text-xs" style="color:var(--text-muted);">${t("login_sub")}</p>
          </div>
          
          <form id="login-submit-form">
            <div class="form-group">
              <label class="form-label">${t("login_role_label")}</label>
              <select class="form-control" id="login-role-select">
                <option value="patient">Normal User / Patient View</option>
                <option value="pharmacy">Pharmacy Partner Dashboard</option>
                <option value="admin">System Super Admin Dashboard</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">${t("email_label")}</label>
              <input type="email" class="form-control" required placeholder="user@dawaya.com" value="user@dawaya.com">
            </div>

            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label class="form-label">${t("password_label")}</label>
                <a href="#" class="text-xs" style="color:var(--primary);" onclick="navigateTo('forgot-pw')">${t("forgot_password")}</a>
              </div>
              <input type="password" class="form-control" required placeholder="••••••••" value="password">
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">${t("enter_dashboard")} 🔑</button>
          </form>

          <p class="text-xs" style="text-align:center; margin-top:20px; color:var(--text-muted);">${t("no_account")} <a href="#" style="color:var(--primary); font-weight:600;" onclick="navigateTo('register')">${t("register_now")}</a></p>
        </div>
      </section>
    `;
  }

  function getRegisterPageHTML() {
    return `
      <section style="padding: 80px 0; background: var(--bg-app); display:flex; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:500px; box-shadow:var(--shadow-lg);">
          <div style="text-align:center; margin-bottom:24px;">
            <h2 class="text-2xl font-bold">${t("reg_title")}</h2>
            <p class="text-xs" style="color:var(--text-muted);">${t("reg_sub")}</p>
          </div>

          <!-- Tab Selection buttons -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; background:var(--input-bg); padding:4px; border-radius:var(--radius-sm);">
            <button class="btn btn-sm btn-primary" id="reg-tab-user" onclick="toggleRegisterTabs('user')" type="button">${t("reg_patient_tab")}</button>
            <button class="btn btn-sm btn-outline" id="reg-tab-pharmacy" onclick="toggleRegisterTabs('pharmacy')" type="button" style="border:none;">${t("reg_pharm_tab")}</button>
          </div>

          <!-- USER REGISTRATION FORM -->
          <form id="patient-register-form" onsubmit="event.preventDefault(); showToast('User registration complete! Please log in.', 'success'); navigateTo('login');">
            <div class="form-group">
              <label class="form-label">${t("name_label")}</label>
              <input type="text" class="form-control" required placeholder="John Doe">
            </div>
            
            <div class="form-group">
              <label class="form-label">${t("whatsapp_label")}</label>
              <input type="text" class="form-control" required placeholder="+201xxxxxxxxx">
            </div>

            <div class="form-group">
              <label class="form-label">${t("email_label")}</label>
              <input type="email" class="form-control" required placeholder="john@example.com">
            </div>

            <div class="form-group">
              <label class="form-label">${t("address_label")}</label>
              <input type="text" class="form-control" required placeholder="Apartment, building, neighborhood, City">
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">${t("complete_reg")}</button>
          </form>

          <!-- PHARMACY REGISTRATION FORM -->
          <form id="pharmacy-register-form" style="display:none;">
            <div class="form-group">
              <label class="form-label">${t("reg_pharm_name_label")}</label>
              <input type="text" class="form-control" required placeholder="Metro Pharmacy Main Branch" id="reg-pharm-name">
            </div>

            <div class="form-group">
              <label class="form-label">${t("reg_pharm_address_label")}</label>
              <input type="text" class="form-control" required placeholder="42 Tahrir Square, Cairo" id="reg-pharm-address">
            </div>

            <div class="form-group">
              <label class="form-label">${t("reg_pharm_license_label")}</label>
              <input type="text" class="form-control" required placeholder="LIC-XXXXXX-EGY" id="reg-pharm-license">
            </div>

            <div class="form-group">
              <label class="form-label">${t("reg_pharm_upload_label")}</label>
              <div style="border: 2px dashed var(--border-color); border-radius: var(--radius-sm); padding:20px; text-align:center; cursor:pointer;" onclick="showToast('Permit file MOH_License.pdf attached.', 'info')">
                <span style="font-size:2rem; display:block;">📄</span>
                <span class="text-xs" style="color:var(--text-muted);">${t("click_to_simulate")}</span>
              </div>
            </div>

            <button type="submit" class="btn btn-accent" style="width:100%; margin-top:10px;">${t("apply_pharm_setup")} 🚀</button>
          </form>

          <p class="text-xs" style="text-align:center; margin-top:20px; color:var(--text-muted);">${t("already_registered")} <a href="#" style="color:var(--primary); font-weight:600;" onclick="navigateTo('login')">${t("login_here")}</a></p>
        </div>
      </section>
    `;
  }

  window.toggleRegisterTabs = function (role) {
    const userTab = document.getElementById("reg-tab-user");
    const pharmTab = document.getElementById("reg-tab-pharmacy");
    const userForm = document.getElementById("patient-register-form");
    const pharmForm = document.getElementById("pharmacy-register-form");

    if (role === "user") {
      userTab.className = "btn btn-sm btn-primary";
      pharmTab.className = "btn btn-sm btn-outline";
      pharmTab.style.border = "none";
      userForm.style.display = "block";
      pharmForm.style.display = "none";
    } else {
      userTab.className = "btn btn-sm btn-outline";
      userTab.style.border = "none";
      pharmTab.className = "btn btn-sm btn-primary";
      userForm.style.display = "none";
      pharmForm.style.display = "block";
    }
  };

  function getForgotPwPageHTML() {
    return `
      <section style="min-height: 100vh; padding: 40px 20px; background: var(--bg-app); display:flex; align-items:center; justify-content:center; box-sizing:border-box;">
        <div class="card" style="width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
          <div style="text-align:center; margin-bottom:24px; display:flex; flex-direction:column; align-items:center; gap:8px;">
            <div class="logo-icon" style="width: 54px; height: 54px;">
              ${LOGO_SVG_MARK}
            </div>
            <div class="logo-text-container" style="align-items: center;">
              <span class="logo-brand-title" style="font-size: 1.8rem; margin: 0;">${t("brand_name")}</span>
              <span class="logo-brand-subtitle" style="font-size: 0.6rem; margin-top: 3px;">${t("brand_subtitle")}</span>
            </div>
            <h2 class="text-2xl font-bold" style="margin-top: 12px;">${t("forgot_pw_title")}</h2>
            <p class="text-xs" style="color:var(--text-muted);">${t("forgot_pw_sub")}</p>
          </div>
          
          <form id="forgot-pw-form">
            <div class="form-group">
              <label class="form-label">${t("email_label")}</label>
              <div class="email-input-wrapper">
                <input type="email" class="form-control" id="forgot-email-input" required placeholder="${t("email_placeholder")}">
                <span class="email-input-icon">✉️</span>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary" id="forgot-submit-btn" style="width:100%; margin-top:10px;">
              <span class="btn-text">${t("send_otp")}</span>
              <span class="btn-spinner" style="display:none; margin-left: 8px;">⏳</span>
            </button>
          </form>
          
          <p class="text-xs" style="text-align:center; margin-top:20px; color:var(--text-muted);"><a href="#" style="color:var(--primary); font-weight:600;" onclick="navigateTo('login')">${t("back_to_login")}</a></p>
        </div>
      </section>
    `;
  }

  function getFooterHTML() {
    return `
      <footer class="public-footer" style="background: linear-gradient(135deg, #070b13 0%, #111a2e 100%); border-top: 1px solid var(--border-color); padding: 80px 0 40px 0; color: #fff; font-family: var(--font-body);">
        <div class="container">
          <div class="footer-grid" style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 60px;">
            
            <div class="footer-brand">
              <a href="#" class="logo-link" style="text-decoration: none; color: #fff;">
                <div class="logo-icon" style="width: 36px; height: 36px;">
                  ${LOGO_SVG_MARK}
                </div>
                <div class="logo-text-container">
                  <span class="logo-brand-title" style="color: #ffffff; font-size: 1.4rem; font-weight: 800; text-transform: uppercase; line-height: 1;">${t("brand_name")}</span>
                  <span class="logo-brand-subtitle" style="color: var(--accent); font-size: 0.48rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; line-height: 1.2;">${t("brand_subtitle")}</span>
                </div>
              </a>
              <p class="text-sm" style="max-width: 300px; line-height: 1.6; color: #a3a3a3; margin-top: 18px; font-size: 0.85rem;">${t("footer_desc")}</p>
              
              <!-- Social links -->
              <div class="footer-socials" style="display: flex; gap: 12px; margin-top: 20px;">
                <a href="#" class="social-icon" style="background: rgba(255,255,255,0.05); color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; text-decoration: none; border: 1px solid rgba(255,255,255,0.08); transition: var(--transition);" onmouseover="this.style.background='var(--primary)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.08)';">FB</a>
                <a href="#" class="social-icon" style="background: rgba(255,255,255,0.05); color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; text-decoration: none; border: 1px solid rgba(255,255,255,0.08); transition: var(--transition);" onmouseover="this.style.background='var(--accent)'; this.style.borderColor='var(--accent)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.08)';">TW</a>
                <a href="#" class="social-icon" style="background: rgba(255,255,255,0.05); color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; text-decoration: none; border: 1px solid rgba(255,255,255,0.08); transition: var(--transition);" onmouseover="this.style.background='var(--primary)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.08)';">LN</a>
              </div>
            </div>
            
            <div>
              <h4 class="footer-title" style="color: #fff; font-family: var(--font-display); font-size: 0.95rem; margin-bottom: 20px; font-weight:700; text-transform: uppercase; letter-spacing: 0.5px;">${t("footer_roles")}</h4>
              <ul class="footer-links" style="list-style: none; padding: 0; margin: 0; display:flex; flex-direction:column; gap:12px;">
                <li><a href="#" class="footer-link-item" onclick="switchRole('patient')" style="color: #a3a3a3; text-decoration: none; font-size: 0.85rem; transition: var(--transition);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='#a3a3a3'">Patient Portal</a></li>
                <li><a href="#" class="footer-link-item" onclick="switchRole('pharmacy')" style="color: #a3a3a3; text-decoration: none; font-size: 0.85rem; transition: var(--transition);" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='#a3a3a3'">Pharmacy Dashboard</a></li>
                <li><a href="#" class="footer-link-item" onclick="switchRole('admin')" style="color: #a3a3a3; text-decoration: none; font-size: 0.85rem; transition: var(--transition);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='#a3a3a3'">Super Admin Portal</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title" style="color: #fff; font-family: var(--font-display); font-size: 0.95rem; margin-bottom: 20px; font-weight:700; text-transform: uppercase; letter-spacing: 0.5px;">${t("footer_pages")}</h4>
              <ul class="footer-links" style="list-style: none; padding: 0; margin: 0; display:flex; flex-direction:column; gap:12px;">
                <li><a href="#" class="footer-link-item" onclick="navigateTo('about')" style="color: #a3a3a3; text-decoration: none; font-size: 0.85rem; transition: var(--transition);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='#a3a3a3'">${t("about_us")}</a></li>
                <li><a href="#" class="footer-link-item" onclick="navigateTo('contact')" style="color: #a3a3a3; text-decoration: none; font-size: 0.85rem; transition: var(--transition);" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='#a3a3a3'">${t("contact")}</a></li>
                <li><a href="#" class="footer-link-item" onclick="navigateTo('login')" style="color: #a3a3a3; text-decoration: none; font-size: 0.85rem; transition: var(--transition);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='#a3a3a3'">${t("sign_in")}</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-title" style="color: #fff; font-family: var(--font-display); font-size: 0.95rem; margin-bottom: 20px; font-weight:700; text-transform: uppercase; letter-spacing: 0.5px;">${t("footer_regulatory")}</h4>
              <p class="text-xs" style="line-height:1.6; color: #a3a3a3; font-size: 0.8rem; margin-bottom: 16px;">${t("footer_regulatory_desc")}</p>
              
              <!-- MOH Stamps visual tag -->
              <div style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); border-radius: var(--radius-xs); padding: 8px 12px; display:inline-flex; align-items:center; gap:8px;">
                <span style="font-size:1.1rem;">🛡️</span>
                <span style="font-size:0.68rem; color: #10b981; font-weight:700; letter-spacing: 0.3px;">MOH COMPLIANCE VERIFIED</span>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <p style="color: #a3a3a3; font-size: 0.8rem; margin: 0;">&copy; ${new Date().getFullYear()} ${t("footer_copyright")}</p>
            <div style="display: flex; gap: 20px; align-items: center;">
              <!-- App store badges simulated in css/html -->
              <div style="background: #000; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xs); padding: 4px 10px; display:flex; align-items:center; gap:6px; cursor:pointer;" onclick="showToast('App Store download page simulation initialized.', 'info');">
                <span style="font-size: 1.15rem;">🍎</span>
                <div style="text-align: left;">
                  <span style="font-size: 0.5rem; color: #a3a3a3; display:block; line-height: 1;">Download on the</span>
                  <span style="font-size: 0.72rem; color: #fff; font-weight: 700; display:block; line-height: 1; margin-top:2px;">App Store</span>
                </div>
              </div>
              <div style="background: #000; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xs); padding: 4px 10px; display:flex; align-items:center; gap:6px; cursor:pointer;" onclick="showToast('Google Play download page simulation initialized.', 'info');">
                <span style="font-size: 1.15rem;">🤖</span>
                <div style="text-align: left;">
                  <span style="font-size: 0.5rem; color: #a3a3a3; display:block; line-height: 1;">GET IT ON</span>
                  <span style="font-size: 0.72rem; color: #fff; font-weight: 700; display:block; line-height: 1; margin-top:2px;">Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // --- USER SIDE DASHBOARD PAGES ---
  function getPatientHomeHTML() {
    const activeOrdersHTML = state.orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").map(o => `
      <div style="background-color: var(--input-bg); border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; transition: var(--transition);" class="active-order-row">
        <div>
          <h4 class="font-bold text-sm" style="margin:0; color: var(--text-main);">${state.language === 'ar' ? 'الطلب' : 'Order'} ${o.id}</h4>
          <p class="text-xs" style="color:var(--text-muted); margin:4px 0 0 0;">${o.pharmacyName} • ${o.items.length} ${state.language === 'ar' ? 'أصناف' : 'items'}</p>
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          <span class="badge ${o.status === 'Dispatched' ? 'badge-info' : 'badge-warning'}">${o.status.toUpperCase()}</span>
          <button class="btn btn-secondary btn-sm" onclick="viewOrderTracking('${o.id}')">${t("track_status")} 🛵</button>
        </div>
      </div>
    `).join("");

    const lowStockWarning = state.medicines.some(m => Object.values(m.stock).some(s => s <= 5 && s > 0))
      ? `<div style="background-color: var(--color-warning-light); border-left: 4px solid var(--color-warning); border-radius:var(--radius-sm); padding: 14px; margin-bottom: 24px; box-shadow: var(--shadow-sm);">
           <p class="text-xs font-semibold" style="margin: 0; color:var(--text-main); display:flex; align-items:center; gap:8px;">
             <span>⚠️</span> <span>${t("active_supply_warning")}</span>
           </p>
         </div>`
      : "";

    // -- DYNAMIC LOYALTY CARD HTML --
    const loyaltyHTML = `
      <div class="card patient-loyalty-card" style="background: linear-gradient(135deg, rgba(15, 98, 254, 0.08) 0%, rgba(0, 186, 181, 0.08) 100%); border: 1.5px solid var(--primary); border-radius: var(--radius-md); padding: 24px; box-shadow: var(--shadow-md); position: relative; overflow: hidden; margin-top: 10px;">
        <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(15, 98, 254, 0.15) 0%, transparent 70%); pointer-events: none;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
          <h3 class="font-bold text-md" style="margin:0; display:flex; align-items:center; gap:8px; font-family: var(--font-display);">
            <span>🏆</span> <span>${state.language === 'ar' ? 'نادي دوايا الصحي' : 'Dawaya Health Club'}</span>
          </h3>
          <span class="badge badge-success" style="font-size:0.65rem; font-weight:700;">PRO</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="text-align: center; border-right: 1px solid var(--border-color);">
            <span style="font-size: 0.72rem; color: var(--text-light); display: block; text-transform: uppercase; letter-spacing: 0.5px;">${state.language === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</span>
            <strong style="font-size: 1.5rem; color: var(--primary); font-family: var(--font-display); display: block; margin-top: 4px;">${state.loyaltyPoints}</strong>
          </div>
          <div style="text-align: center;">
            <span style="font-size: 0.72rem; color: var(--text-light); display: block; text-transform: uppercase; letter-spacing: 0.5px;">${state.language === 'ar' ? 'رصيد الكاش باك' : 'Cashback Balance'}</span>
            <strong style="font-size: 1.5rem; color: var(--accent); font-family: var(--font-display); display: block; margin-top: 4px;">${state.cashback.toFixed(2)} EGP</strong>
          </div>
        </div>

        <div style="margin-top: 16px; border-top: 1px dashed var(--border-color); padding-top: 16px;">
          ${state.activeCoupon ? `
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-sm); padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.7rem; color: var(--text-light); display:block; text-transform: uppercase;">${state.language === 'ar' ? 'الكوبون النشط' : 'Active Coupon'}</span>
                <strong style="font-size: 0.95rem; color: #10b981; font-family: var(--font-display);">${state.activeCoupon.code} (${state.activeCoupon.discount}% Off)</strong>
              </div>
              <button class="btn btn-sm btn-outline" onclick="window.removePlatformCoupon()" style="padding: 4px 8px; font-size: 0.7rem; border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">${state.language === 'ar' ? 'إزالة' : 'Remove'}</button>
            </div>
          ` : `
            <label class="form-label" style="font-size: 0.75rem; font-weight:600; color: var(--text-muted); display: block; margin-bottom: 6px;">${state.language === 'ar' ? 'تطبيق رمز الخصم' : 'Apply Campaign Promo Code'}</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="loyalty-coupon-input" class="form-control" placeholder="E.g., WELCOME10" style="padding: 8px 12px; font-size: 0.8rem; background: var(--input-bg); color: var(--text-main); border: 1px solid var(--border-color); border-radius: var(--radius-sm); flex-grow: 1; text-transform: uppercase;">
              <button class="btn btn-accent btn-sm" onclick="window.applyPlatformCoupon(document.getElementById('loyalty-coupon-input').value)" style="padding: 8px 16px; font-size: 0.8rem; font-weight:700;">${state.language === 'ar' ? 'تطبيق' : 'Apply'}</button>
            </div>
          `}
        </div>
      </div>
    `;

    // -- DYNAMIC INSURANCE GATEWAY HTML --
    const insuranceHTML = `
      <div class="card patient-insurance-card" style="margin-top: 24px; border-left: 4px solid var(--primary); background: var(--bg-card); box-shadow: var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <h3 class="font-bold text-md" style="margin:0; display:flex; align-items:center; gap:8px; font-family: var(--font-display);">
            <span>💳</span> <span>${state.language === 'ar' ? 'بوابة التأمين الصحي ومطابقة MOH' : 'National Health Insurance & MoH Gateway'}</span>
          </h3>
          <span style="background: rgba(15, 98, 254, 0.06); border: 1px solid rgba(15, 98, 254, 0.2); border-radius: var(--radius-xs); padding: 4px 8px; font-size: 0.65rem; color: var(--primary); font-weight: 700;">MOH SYNC</span>
        </div>
        
        ${state.insuranceCard ? `
          <div style="background: var(--input-bg); border-radius: var(--radius-sm); padding: 16px; border: 1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom: 12px;">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-light); display:block; text-transform: uppercase;">${state.language === 'ar' ? 'جهة التأمين' : 'Insurance Provider'}</span>
                <strong style="font-size: 1.05rem; color: var(--text-main); font-family: var(--font-display);">${state.insuranceProvider}</strong>
              </div>
              <span class="badge badge-success" style="font-size: 0.65rem;">✓ Active MoH Eligibility</span>
            </div>
            
            <div style="margin-bottom: 16px;">
              <span style="font-size: 0.72rem; color: var(--text-light); display:block; text-transform: uppercase;">${state.language === 'ar' ? 'رقم بطاقة التأمين' : 'Card Member ID'}</span>
              <strong style="font-size: 1.1rem; color: var(--text-main); font-family: monospace; letter-spacing:1px;">${state.insuranceCard}</strong>
            </div>
            
            <button class="btn btn-sm btn-outline" onclick="window.disconnectInsurance()" style="width: 100%; border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">${state.language === 'ar' ? 'قطع اتصال التأمين' : 'Disconnect Insurance Profile'}</button>
          </div>
        ` : `
          <p class="text-xs" style="color: var(--text-muted); margin-bottom: 16px; line-height: 1.5;">${state.language === 'ar' ? 'اربط بطاقة التأمين الصحي الخاصة بك للمطالبة بخصومات الوصفات الطبية المؤهلة ومحاكاة التحقق من الأهلية لدى وزارة الصحة المصرية.' : 'Synchronize your national health insurance card to claim eligible drug copays and trigger automatic eligibility validation with Egypt\'s Ministry of Health (MoH).'}</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 12px; margin-bottom: 16px;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">${state.language === 'ar' ? 'الشبكة التأمينية' : 'Provider Network'}</label>
              <select id="ins-provider-select" class="form-control" style="padding: 8px; font-size: 0.8rem; background: var(--input-bg); border-radius: var(--radius-sm); border: 1px solid var(--border-color); color:var(--text-main); width:100%;">
                <option value="AXA Egypt / MOH Care">AXA Egypt</option>
                <option value="Misr Insurance Co.">Misr Insurance</option>
                <option value="MetLife Egypt / GIG">MetLife Egypt</option>
                <option value="Bupa Egypt Medical">Bupa Global</option>
              </select>
            </div>
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">${state.language === 'ar' ? 'رقم بطاقة التأمين' : 'Insurance Card No.'}</label>
              <input type="text" id="ins-card-input" class="form-control" placeholder="E.g., INS-8812-EGY" style="padding: 8px; font-size: 0.8rem; background: var(--input-bg); color: var(--text-main); border: 1px solid var(--border-color); border-radius: var(--radius-sm); width: 100%;">
            </div>
          </div>
          
          <button class="btn btn-primary btn-sm" onclick="window.syncInsuranceCard(document.getElementById('ins-card-input').value, document.getElementById('ins-provider-select').value)" style="width: 100%; font-weight:700;">${state.language === 'ar' ? 'تزامن رقم التأمين 💳' : 'Synchronize Health ID 💳'}</button>
        `}
      </div>
    `;

    // -- DYNAMIC ECOSYSTEM SERVICES HTML --
    let consultationsListHTML = "";
    if (state.activeConsultations && state.activeConsultations.length > 0) {
      consultationsListHTML = state.activeConsultations.map(c => `
        <div style="background: rgba(15, 98, 254, 0.05); border: 1px solid rgba(15, 98, 254, 0.15); border-radius: var(--radius-sm); padding: 12px; font-size: 0.82rem; margin-bottom: 8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:var(--text-main); display:block;">🩺 Video Call: ${c.doctor}</strong>
            <span style="font-size: 0.72rem; color: var(--text-light);">🕒 ${c.time}</span>
          </div>
          <span class="badge badge-success" style="font-size:0.6rem;">BOOKED</span>
        </div>
      `).join("");
    }

    let labBookingsListHTML = "";
    if (state.activeLabBookings && state.activeLabBookings.length > 0) {
      labBookingsListHTML = state.activeLabBookings.map(l => `
        <div style="background: rgba(0, 186, 181, 0.05); border: 1px solid rgba(0, 186, 181, 0.15); border-radius: var(--radius-sm); padding: 12px; font-size: 0.82rem; margin-bottom: 8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:var(--text-main); display:block;">🧪 Home Collection: ${l.lab}</strong>
            <span style="font-size: 0.72rem; color: var(--text-light); display:block;">📦 ${l.package}</span>
            <span style="font-size: 0.72rem; color: var(--text-light);">🕒 Scheduled: ${l.date}</span>
          </div>
          <span class="badge badge-success" style="font-size:0.6rem;">CONFIRMED</span>
        </div>
      `).join("");
    }

    const ecosystemHTML = `
      <div class="card patient-ecosystem-card" style="margin-top: 24px;">
        <h3 class="font-bold text-lg" style="margin-bottom: 16px; display:flex; align-items:center; gap:8px; font-family: var(--font-display);">
          <span>🏥</span> <span>${state.language === 'ar' ? 'بوابة الرعاية الطبية الرقمية' : 'Integrated Digital Healthcare Services'}</span>
        </h3>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;" class="ecosystem-portals-grid">
          
          <!-- Telemedicine Portal -->
          <div style="border-right: 1px solid var(--border-color); padding-right: 16px;">
            <h4 class="font-bold text-sm" style="color: var(--primary); margin-bottom: 8px; display:flex; align-items:center; gap:4px; font-family: var(--font-display);">
              <span>🩺</span> <span>${state.language === 'ar' ? 'استشارات الفيديو' : 'E-Consultation'}</span>
            </h4>
            <p class="text-xs" style="color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">${state.language === 'ar' ? 'تحدث مع طبيب معتمد في غضون دقائق واطلب وصفتك الطبية مباشرة.' : 'Consult online with certified doctors to instantly issue valid prescriptions in Dawaya.'}</p>
            
            <div class="form-group" style="margin-bottom: 12px;">
              <select id="telemed-doc-select" class="form-control" style="padding: 8px; font-size: 0.78rem; background: var(--input-bg); border-radius: var(--radius-sm); border: 1px solid var(--border-color); width: 100%; color:var(--text-main);">
                <option value="Dr. Ahmed Mansour (General Physician)">Dr. Ahmed Mansour (GP)</option>
                <option value="Dr. Laila Hegazi (Pediatrician)">Dr. Laila Hegazi (Pedia)</option>
                <option value="Dr. Tarek Osman (Cardiologist)">Dr. Tarek Osman (Cardio)</option>
              </select>
            </div>
            
            <button class="btn btn-primary btn-sm" onclick="window.bookTelemedAppointment(document.getElementById('telemed-doc-select').value)" style="width: 100%; font-size: 0.78rem;">${state.language === 'ar' ? 'حجز مكالمة فيديو' : 'Book Video Call'}</button>
          </div>

          <!-- Labs Diagnostics Portal -->
          <div>
            <h4 class="font-bold text-sm" style="color: var(--accent); margin-bottom: 8px; display:flex; align-items:center; gap:4px; font-family: var(--font-display);">
              <span>🧪</span> <span>${state.language === 'ar' ? 'حجز التحاليل المنزلية' : 'Lab Diagnostics'}</span>
            </h4>
            <p class="text-xs" style="color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">${state.language === 'ar' ? 'احجز عينات دم منزلية بأسعار مخفضة من المعامل الشريكة.' : 'Schedule fully-sterile home blood collection from leading labs at group discount copays.'}</p>
            
            <div class="form-group" style="margin-bottom: 12px;">
              <select id="lab-pkg-select" class="form-control" style="padding: 8px; font-size: 0.78rem; background: var(--input-bg); border-radius: var(--radius-sm); border: 1px solid var(--border-color); width: 100%; color:var(--text-main);">
                <option value="Al Borg Labs: Comprehensive CBC Panel (550 EGP)">Al Borg Labs: CBC Panel</option>
                <option value="Alfa Laboratories: Full Vitamin D Panel (720 EGP)">Alfa Laboratories: Vitamin D</option>
                <option value="Cairo Lab: Lipid Profile & Liver Screen (480 EGP)">Cairo Lab: Lipid Screen</option>
              </select>
            </div>
            
            <button class="btn btn-accent btn-sm" onclick="window.bookLabVisit(document.getElementById('lab-pkg-select').value)" style="width: 100%; font-size: 0.78rem;">${state.language === 'ar' ? 'حجز زيارة منزلية' : 'Book Home Visit'}</button>
          </div>
        </div>

        <!-- Active bookings output lists -->
        ${(consultationsListHTML || labBookingsListHTML) ? `
          <div style="margin-top: 20px; border-top: 1px dashed var(--border-color); padding-top: 16px;">
            <h4 class="font-bold text-xs" style="color:var(--text-muted); text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">${state.language === 'ar' ? 'مواعيدك القادمة' : 'Your Scheduled Services'}</h4>
            ${consultationsListHTML}
            ${labBookingsListHTML}
          </div>
        ` : ""}
      </div>
    `;

    return `
      ${lowStockWarning}

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 32px;" class="patient-home-grid">
        <!-- Left panel options -->
        <div>
          <div class="card" style="margin-bottom: 24px; position:relative; overflow:hidden;">
            <div style="position:relative; z-index:2;">
              <h2 class="text-xl font-bold" style="margin-bottom: 8px;">${t("how_assist_today")}</h2>
              <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${t("select_automated_tool")}</p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;" class="patient-tools-grid">
                <div class="card patient-tool-card" style="padding: 24px; cursor: pointer; text-align: center; border: 1.5px dashed var(--primary); background-color: var(--primary-light); transition: var(--transition);" onclick="navigateTo('search')">
                  <span style="font-size: 2.5rem; display:block; margin-bottom:12px;">🔍</span>
                  <h4 class="font-bold text-md" style="margin:0; color: var(--primary);">${t("search_medications")}</h4>
                  <p class="text-xs" style="color: var(--text-muted); margin-top:6px;">${t("compare_localized_prices")}</p>
                </div>

                <div class="card patient-tool-card" style="padding: 24px; cursor: pointer; text-align: center; border: 1.5px dashed var(--accent); background-color: var(--accent-light); transition: var(--transition);" onclick="navigateTo('upload')">
                  <span style="font-size: 2.5rem; display:block; margin-bottom:12px;">📤</span>
                  <h4 class="font-bold text-md" style="margin:0; color: var(--accent);">${t("ocr_rx_uploader")}</h4>
                  <p class="text-xs" style="color: var(--text-muted); margin-top:6px;">${t("scan_prescription_notes")}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card" style="margin-bottom: 24px;">
            <h3 class="font-bold text-lg" style="margin-bottom:20px; display:flex; align-items:center; gap:8px;">
              <span>📦</span> <span>${t("active_placed_orders")}</span>
            </h3>
            ${activeOrdersHTML || `<p class="text-sm" style="color:var(--text-light); margin:0;">${t("no_active_orders")}</p>`}
          </div>

          ${insuranceHTML}

          ${ecosystemHTML}
        </div>

        <!-- Right: WhatsApp compliance & Loyalty center -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div class="card" style="background-color: var(--bg-card); display:flex; flex-direction:column; gap:20px; border-left:4px solid var(--whatsapp-color); justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 class="font-bold text-md" style="margin:0; display:flex; align-items:center; gap:6px;">
                  <span style="color:var(--whatsapp-color);">💬</span> <span>${t("dosage_compliance")}</span>
                </h3>
                <span class="badge" style="background-color:rgba(37, 211, 102, 0.1); color:var(--whatsapp-color); border: 1px solid rgba(37, 211, 102, 0.2); font-size: 0.7rem; font-weight:700;">${t("active")}</span>
              </div>
              
              <div style="display:flex; flex-direction:column; gap:12px;">
                ${state.reminders.map(rem => `
                  <div style="padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--input-bg); font-size: 0.82rem; transition: var(--transition);" class="compliance-reminder-item">
                    <strong style="color: var(--text-main); font-size:0.88rem; display:block; margin-bottom:4px;">${rem.name}</strong>
                    <p class="text-xs" style="color:var(--text-muted); margin:0; display:flex; align-items:center; gap:4px;">
                      <span>🕒</span> <span>${rem.schedule} • ${state.language === 'ar' ? 'جرعة يومية' : 'Daily Dosage'}</span>
                    </p>
                  </div>
                `).join("")}
              </div>
            </div>

            <button class="btn btn-whatsapp btn-sm" style="width:100%; margin-top:20px;" onclick="navigateTo('reminders')">${t("configure_reminders")}</button>
          </div>

          ${loyaltyHTML}
        </div>
      </div>
    `;
  }

  function getPatientSearchHTML() {
    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 8px;">${t("aggregate_pricing_dir")}</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${t("search_filter_desc")}</p>
        
        <!-- Large Search bar widget -->
        <div style="display: flex; gap: 12px; background: var(--bg-card); border-radius: var(--radius-md); padding: 16px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); margin-bottom: 32px; flex-wrap: wrap;">
          <input type="text" placeholder="${t("patient_search_placeholder")}" style="flex-grow: 1; padding: 12px 20px; background: var(--input-bg); color: var(--text-main); font-size: 0.95rem; border-radius: var(--radius-sm); border:1px solid var(--border-color);" id="patient-search-input" value="${state.searchQuery || ''}">
          
          <select id="patient-search-filter" class="form-control" style="max-width:200px; padding: 12px 20px; background-color: var(--input-bg); border-radius: var(--radius-sm);">
            <option value="all">${t("all_fields")}</option>
            <option value="name">${t("product_name")}</option>
            <option value="generic">${t("active_ingredients")}</option>
            <option value="pharmacy">${t("pharmacy_stock")}</option>
          </select>

          <button class="btn btn-primary" onclick="triggerPatientSearch(document.getElementById('patient-search-input').value.trim(), document.getElementById('patient-search-filter').value)">${t("search_icon_btn")}</button>
        </div>

        <div id="search-results-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
          <!-- Empty state by default -->
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🔍</div>
            <h3 class="font-bold text-xl">${t("enter_query")}</h3>
            <p style="color: var(--text-muted);">${t("compare_catalog_desc")}</p>
          </div>
        </div>
      </div>
    `;
  }

  function getPatientDetailsHTML() {
    return `<div id="med-details-view" class="med-details-wrapper"></div>`;
  }

  function getPatientUploadHTML() {
    return `
      <div style="margin-bottom: 32px; max-width: 800px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 8px;">${t("optical_ocr_scanner")}</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${t("ocr_scanner_desc")}</p>
        
        <div class="card" style="padding: 40px; text-align: center; border: 2px dashed var(--primary); background-color: var(--primary-light); cursor:pointer; margin-bottom: 32px; transition: var(--transition);" id="prescription-drop-area" onclick="triggerPrescriptionUpload()">
          <span style="font-size: 4.5rem; display: block; margin-bottom: 16px;">📄</span>
          <h3 class="font-bold text-xl" style="color: var(--primary); margin-bottom: 8px;">${t("upload_prescription_image")}</h3>
          <p class="text-sm" style="color: var(--text-muted); margin-bottom: 20px;">${t("supports_formats")}</p>
          <button class="btn btn-primary">${t("select_image_file")}</button>
        </div>

        <div id="ocr-extracted-preview"></div>
      </div>
    `;
  }

  function getPatientOrdersHTML() {
    const ordersList = state.orders.map(o => {
      const itemsList = o.items.map(item => `${item.name} (x${item.quantity})`).join(", ");

      let statusColor = "badge-info";
      if (o.status === "Delivered") statusColor = "badge-success";
      if (o.status === "Packing") statusColor = "badge-warning";
      if (o.status === "Dispatched") statusColor = "badge-warning";

      return `
        <div class="card" style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; hover: transform none;">
          <div>
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:6px;">
              <h4 class="font-bold text-md" style="margin:0; color:var(--text-main);">${state.language === 'ar' ? 'الطلب' : 'Order'} ${o.id}</h4>
              <span class="badge ${statusColor}">${o.status.toUpperCase()}</span>
            </div>
            <p class="text-xs" style="color:var(--text-light); margin-bottom:6px;">${state.language === 'ar' ? 'تم الطلب في' : 'Placed on'} ${o.date} • ${state.language === 'ar' ? 'طلب من' : 'Ordering from'} <strong>${o.pharmacyName}</strong></p>
            <p class="text-sm" style="color:var(--text-muted); margin:0;">${state.language === 'ar' ? 'الأدوية' : 'Medications'}: <strong>${itemsList}</strong></p>
          </div>

          <div style="text-align:right; display:flex; align-items:center; gap:20px;">
            <div>
              <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">${t("grand_total_label")}</p>
              <strong style="color:var(--primary); font-size:1.15rem; font-family:var(--font-display);">${o.total.toFixed(2)} EGP</strong>
            </div>
            <button class="btn btn-outline btn-sm" onclick="viewOrderTracking('${o.id}')">${t("track_progress")}</button>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 8px;">${t("my_placed_orders")}</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${t("orders_desc")}</p>
        
        <div style="display:flex; flex-direction:column;">
          ${ordersList || `<p class="text-sm" style="color:var(--text-light);">${t("no_orders_recorded")}</p>`}
        </div>
      </div>
    `;
  }

  function getPatientRemindersHTML() {
    return `
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; margin-bottom: 32px;" class="patient-reminders-layout">
        <!-- Left: reminder management form and list -->
        <div>
          <div class="card" style="margin-bottom: 24px;">
            <h2 class="text-xl font-bold" style="margin-bottom: 6px;">${t("whatsapp_scheduler")}</h2>
            <p class="text-sm" style="color: var(--text-muted); margin-bottom: 20px;">${t("whatsapp_scheduler_desc")}</p>
            
            <form id="reminder-modal-form" onsubmit="saveMedicationReminder(event)">
              <div class="form-group">
                <label class="form-label">${t("medication_title")}</label>
                <input type="text" class="form-control" required placeholder="E.g., Glucophage 850mg" id="rem-name">
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">${t("dosage_instructions")}</label>
                  <input type="text" class="form-control" required placeholder="E.g., 1 tablet after meals" id="rem-dosage">
                </div>
                
                <div class="form-group">
                  <label class="form-label">${t("daily_reminder_time")}</label>
                  <input type="time" class="form-control" required id="rem-time" value="08:30">
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">${t("activate_whatsapp_reminder")}</button>
            </form>
          </div>

          <h3 class="font-bold text-lg" style="margin-bottom: 16px;">${t("active_schedules")}</h3>
          <div id="reminders-dashboard-list"></div>
        </div>

        <!-- Right: Mock smartphone frame for live WhatsApp reminders verification -->
        <div>
          <div class="mock-phone-frame" style="box-shadow: var(--shadow-md);">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <div class="phone-header">
                <div class="phone-avatar">💬</div>
                <div>
                  <p style="margin: 0; font-size: 0.85rem;">${t("phone_header_title")}</p>
                  <p style="margin: 0; font-size: 0.6rem; color: #a8d3cd;">${t("phone_header_sub")}</p>
                </div>
              </div>
              
              <div class="phone-chat-body" id="phone-chat-screen-body"></div>
              
              <div class="phone-footer-input">
                <input type="text" class="phone-input-bar" style="border:none; outline:none; background:none; font-size:0.8rem; width:100%; color:var(--text-main);" placeholder="${t("phone_input_placeholder")}" id="phone-virtual-input" onkeydown="if(event.key === 'Enter') { const v = this.value; if(v){ const chat = document.getElementById('phone-chat-screen-body'); const bubble = document.createElement('div'); bubble.className = 'phone-msg-bubble sent'; bubble.innerHTML = v + '<span class=\\'msg-time\\'>' + (state.language === 'ar' ? 'الآن' : 'Just Now') + '</span>'; chat.appendChild(bubble); chat.scrollTop = chat.scrollHeight; this.value = ''; showToast(state.language === 'ar' ? 'محاكاة إرسال الرد' : 'Simulating message reply', 'info'); } }">
                <div class="phone-send-btn" onclick="const input = document.getElementById('phone-virtual-input'); const v = input.value; if(v){ const chat = document.getElementById('phone-chat-screen-body'); const bubble = document.createElement('div'); bubble.className = 'phone-msg-bubble sent'; bubble.innerHTML = v + '<span class=\\'msg-time\\'>' + (state.language === 'ar' ? 'الآن' : 'Just Now') + '</span>'; chat.appendChild(bubble); chat.scrollTop = chat.scrollHeight; input.value = ''; }">➔</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getPatientFavoritesHTML() {
    const pharmaciesList = state.pharmacies.filter(p => p.status === "Active").map(p => `
      <div class="card" style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; hover: transform none;">
        <div style="display:flex; gap:16px; align-items:center;">
          <span style="font-size:2.5rem;">🏥</span>
          <div>
            <h4 class="font-bold text-md" style="margin:0; color:var(--text-main);">${p.name}</h4>
            <p class="text-xs" style="color:var(--text-muted); margin:2px 0 6px 0;">📍 ${p.address}</p>
            <div style="display:flex; gap:12px; align-items:center;">
              <span style="color:var(--color-warning); font-weight:600; font-size:0.75rem;">⭐ ${p.rating} (${p.reviews} ${state.language === 'ar' ? 'تقييمات' : 'reviews'})</span>
              <span class="badge badge-success" style="font-size:0.65rem;">${t("accredited_partner")}</span>
            </div>
          </div>
        </div>

        <div style="text-align:right;">
          <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">${t("avg_delivery_fee")}</p>
          <strong style="color:var(--primary); font-size:1.1rem;">${p.deliveryFee.toFixed(2)} EGP</strong>
        </div>
      </div>
    `).join("");

    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 8px;">${t("my_favorite_pharmacies")}</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${t("favorites_desc")}</p>
        
        <div style="display:flex; flex-direction:column;">
          ${pharmaciesList}
        </div>
      </div>
    `;
  }

  function getPatientProfileHTML() {
    return `
      <div style="margin-bottom: 32px; max-width: 600px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 8px;">${t("my_personal_profile")}</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${t("profile_desc")}</p>
        
        <div class="card" style="box-shadow:var(--shadow-sm);">
          <div style="display:flex; align-items:center; gap:20px; border-bottom:1px solid var(--border-color); padding-bottom:20px; margin-bottom:24px;">
            <span style="font-size:4rem; background-color:var(--primary-light); width:80px; height:80px; display:flex; align-items:center; justify-content:center; border-radius:50%;">👤</span>
            <div>
              <h3 class="font-bold text-lg" style="margin:0; color:var(--text-main);">${state.currentUser.name}</h3>
              <p class="text-xs" style="color:var(--text-light); margin-top:2px;">${t("profile_active_since")}</p>
            </div>
          </div>

          <form onsubmit="event.preventDefault(); showToast(state.language === 'ar' ? 'تم تحديث بيانات الملف الشخصي!' : 'Profile coordinates updated!', 'success');">
            <div class="form-group">
              <label class="form-label">${t("name_label")}</label>
              <input type="text" class="form-control" value="${state.currentUser.name}" required id="profile-name">
            </div>
            
            <div class="form-group">
              <label class="form-label">${t("email_label")}</label>
              <input type="email" class="form-control" value="${state.currentUser.email}" required id="profile-email">
            </div>

            <div class="form-group">
              <label class="form-label">${t("whatsapp_number")}</label>
              <input type="text" class="form-control" value="${state.currentUser.phone}" required id="profile-phone">
            </div>

            <div class="form-group">
              <label class="form-label">${t("address_label")}</label>
              <input type="text" class="form-control" value="${state.currentUser.address}" required id="profile-address">
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">${state.language === 'ar' ? 'حفظ بيانات الملف الشخصي' : 'Save Profile Coordinates'}</button>
          </form>
        </div>
      </div>
    `;
  }

  // --- PHARMACY DASHBOARD PAGES ---
  function getPharmacyHomeHTML() {
    const pharm = state.pharmacies.find(p => p.id === state.activePharmacySession) || state.pharmacies[0];
    const totalOrders = state.orders.filter(o => o.pharmacyId === pharm.id).length;
    const pendingOrders = state.orders.filter(o => o.pharmacyId === pharm.id && o.status !== "Delivered").length;
    const revenue = state.orders.filter(o => o.pharmacyId === pharm.id).reduce((sum, o) => sum + o.subtotal, 0);

    return `
      <!-- Metrics overview -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon-box" style="background-color: var(--primary-light); color: var(--primary);">📦</div>
          <div class="metric-details">
            <span class="metric-label">Total Orders Fulfilled</span>
            <span class="metric-value">${totalOrders}</span>
            <div class="metric-trend trend-up">
              <span>↑ 8%</span> <span style="color: var(--text-light);">this week</span>
            </div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon-box" style="background-color: var(--color-warning-light); color: var(--color-warning);">⏳</div>
          <div class="metric-details">
            <span class="metric-label">Active Placed Orders</span>
            <span class="metric-value">${pendingOrders}</span>
            <div class="metric-trend trend-down">
              <span>↓ 2%</span> <span style="color: var(--text-light);">vs yesterday</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box" style="background-color: var(--color-success-light); color: var(--color-success);">💰</div>
          <div class="metric-details">
            <span class="metric-label">Store Net Revenue</span>
            <span class="metric-value">${revenue.toFixed(2)} EGP</span>
            <div class="metric-trend trend-up">
              <span>↑ 14%</span> <span style="color: var(--text-light);">this week</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick store coordinates card -->
      <div class="card" style="margin-top: 24px; padding: 24px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <span style="font-size: 3rem; background: var(--primary-light); width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">🏥</span>
          <div>
            <h3 class="font-bold text-lg" style="margin: 0; color: var(--text-main);${state.language === 'ar' ? ' font-family: Cairo;' : ''}">${pharm.name}</h3>
            <p class="text-sm" style="color: var(--text-muted); margin: 4px 0 0 0;">📍 ${pharm.address}</p>
            <p class="text-xs" style="color: var(--text-light); margin: 4px 0 0 0;"><strong>Delivery Coverage:</strong> <span style="color: var(--text-main); font-weight: 500;">${pharm.deliveryZones}</span></p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="navigateTo('profile')" style="width: 100%; margin-top: 20px;">Configure Store Details</button>
        </div>
      </div>
    `;
  }

  function getPharmacyInventoryHTML() {
    return `
      <div style="margin-bottom: 32px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 24px;">
          <div>
            <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">Medicine Stock & Inventory SaaS Hub</h2>
            <p class="text-sm" style="color: var(--text-muted);">Adjust stock units, edit localized pricing values, track batch expiries, and verify barcode catalog matching.</p>
          </div>
          <button class="btn btn-accent btn-sm" onclick="triggerPharmacyMedicineModal()">+ Add New Stock</button>
        </div>

        <!-- Barcode catalog scanner simulator input -->
        <div class="card" style="margin-bottom: 24px; padding: 16px; background: var(--bg-card); display: flex; align-items: center; gap: 16px; border: 1.5px dashed var(--primary);">
          <span style="font-size: 1.5rem;">🚨</span>
          <div style="flex-grow: 1;">
            <strong style="font-size: 0.88rem; color: var(--text-main); display:block; margin-bottom:4px;">Barcode Catalog Scanner Simulator</strong>
            <input type="text" id="barcode-scanner-simulator" class="form-control" placeholder="Scan or type barcode UPC (e.g. 622100234567, 622400567890) to simulate quick hardware lookup..." style="padding: 10px 14px; font-size: 0.85rem; background: var(--input-bg); color: var(--text-main); border: 1px solid var(--border-color); border-radius: var(--radius-sm); width: 100%;" oninput="window.simulateBarcodeScan(this.value)">
          </div>
        </div>

        <div class="card" style="padding:0; overflow:hidden;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Medicine / Category</th>
                <th>Dosage Strength</th>
                <th>SKU Barcode</th>
                <th>Batch / Expiry</th>
                <th>Pricing (EGP)</th>
                <th>Active Stock</th>
                <th>Prescription Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="pharmacy-inventory-table-body"></tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.simulateBarcodeScan = function (val) {
    const trimmed = val.trim();
    if (trimmed.length < 6) return;
    const med = state.medicines.find(m => m.barcode === trimmed);
    if (med) {
      showToast(`[SCANNER SUCCESS] Detected: ${med.name} | Batch: ${med.batchNo}`, "success");
      window.triggerPharmacyMedicineModal(med.id);

      const input = document.getElementById("barcode-scanner-simulator");
      if (input) input.value = "";
    }
  };

  window.renderPharmacyInventory = function () {
    const tableBody = document.getElementById("pharmacy-inventory-table-body");
    if (!tableBody) return;

    const editSessionId = state.activePharmacySession;

    tableBody.innerHTML = state.medicines.map(med => {
      const priceVal = med.prices[editSessionId] || 0;
      const stockVal = med.stock[editSessionId] || 0;

      const inStockText = stockVal > 0
        ? (stockVal <= 5 ? `<span class="badge badge-warning">${t("low_stock")} (${stockVal})</span>` : `<span class="badge badge-success">${t("in_stock")} (${stockVal})</span>`)
        : `<span class="badge badge-danger">${t("out_of_stock")}</span>`;

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="table-item-image-container" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--input-bg); border-radius: 6px; overflow: hidden; padding: 2px; flex-shrink: 0;">
                ${renderMedicineImage(med.image, "max-width: 100%; max-height: 100%; object-fit: contain;")}
              </div>
              <div>
                <strong style="color:var(--text-main); font-size:0.9rem;">${med.name}</strong>
                <p class="text-xs" style="color:var(--text-light); margin:0;">${med.category}</p>
              </div>
            </div>
          </td>
          <td class="text-xs" style="color:var(--text-muted); font-weight:600;">${med.dosage}</td>
          <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">${med.barcode}</td>
          <td>
            <strong style="font-size: 0.78rem; display:block; color: var(--text-main);">${med.batchNo}</strong>
            <span style="font-size: 0.7rem; color: var(--color-warning);">EXP ${med.expiryDate}</span>
          </td>
          <td><strong style="color:var(--primary); font-size:0.9rem;">${priceVal.toFixed(2)} EGP</strong></td>
          <td>${inStockText}</td>
          <td>
  ${med.prescriptionRequired
          ? `<span class="badge badge-danger" style="font-size:0.65rem;">Rx Required</span>`
          : `<span class="badge badge-success" style="font-size:0.65rem;">OTC</span>`
        }
</td>

<td style="text-align:right;">
  <button
    class="btn btn-outline btn-sm"
    onclick="triggerPharmacyMedicineModal('${med.id}')"
    style="padding:5px 10px; font-size:0.75rem;">
    Adjust Stock
  </button>
</td>
        </tr>
      `;
    }).join("");
  };

  function getPharmacyOrdersHTML() {
    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">Orders Dispatch Pipeline</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">Manage pending deliveries, pack active boxes, and dispatch Dawaya Express riders.</p>
        
        <div style="display:flex; flex-direction:column;" id="pharmacy-orders-pipeline-list"></div>
      </div>
    `;
  }

  window.renderPharmacyOrders = function () {
    const list = document.getElementById("pharmacy-orders-pipeline-list");
    if (!list) return;

    const sessionPharmId = state.activePharmacySession;
    const storeOrders = state.orders.filter(o => o.pharmacyId === sessionPharmId);

    if (storeOrders.length === 0) {
      list.innerHTML = `<p class="text-sm" style="color:var(--text-light);">No localized orders have been placed in your queue yet.</p>`;
      return;
    }

    list.innerHTML = storeOrders.map(o => {
      const itemsList = o.items.map(i => `${i.name} (x${i.quantity})`).join(", ");

      let actionsHTML = "";
      if (o.status === "Placed") {
        actionsHTML = `<button class="btn btn-accent btn-sm" onclick="updateStoreOrderStatus('${o.id}', 'Packing')">Accept & Start Packing</button>`;
      } else if (o.status === "Packing") {
        actionsHTML = `<button class="btn btn-primary btn-sm" onclick="updateStoreOrderStatus('${o.id}', 'Dispatched')">Dispatch Rider 🛵</button>`;
      } else if (o.status === "Dispatched") {
        actionsHTML = `<button class="btn btn-whatsapp btn-sm" onclick="updateStoreOrderStatus('${o.id}', 'Delivered')">Confirm Delivery ✅</button>`;
      } else {
        actionsHTML = `<span class="badge badge-success">Fulfilled</span>`;
      }

      return `
        <div class="card" style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; hover: transform none;">
          <div>
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:4px;">
              <h4 class="font-bold text-md" style="margin:0; color:var(--text-main);">Order ${o.id}</h4>
              <span class="badge ${o.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${o.status.toUpperCase()}</span>
            </div>
            <p class="text-xs" style="color:var(--text-light); margin-bottom:6px;">Placed by <strong>${o.patientName}</strong> (${o.patientPhone}) • Drop-off: <strong>${o.address}</strong></p>
            <p class="text-sm" style="color:var(--text-muted); margin:0;">Items: <strong>${itemsList}</strong></p>
          </div>

          <div style="display:flex; align-items:center; gap:24px;">
            <div style="text-align:right;">
              <p class="text-xs" style="color:var(--text-light); margin-bottom:2px;">Net Value</p>
              <strong style="color:var(--primary); font-size:1.1rem; font-family:var(--font-display);">${o.subtotal.toFixed(2)} EGP</strong>
            </div>
            ${actionsHTML}
          </div>
        </div>
      `;
    }).join("");
  };

  window.updateStoreOrderStatus = function (orderId, newStatus) {
    const o = state.orders.find(ord => ord.id === orderId);
    if (o) {
      o.status = newStatus;
      showToast(`Order ${orderId} updated to: ${newStatus}`, "success");
      renderPharmacyOrders();
    }
  };

  window.toggleStaffPermission = function (staffId, permissionKey) {
    const member = state.staff.find(s => s.id === staffId);
    if (member) {
      member.permissions[permissionKey] = !member.permissions[permissionKey];
      showToast(`Permission '${permissionKey}' updated for ${member.name}`, "success");
      navigateTo('profile');
    }
  };

  window.addNewStaffMember = function (event) {
    event.preventDefault();
    const nameInput = document.getElementById("new-staff-name");
    const roleSelect = document.getElementById("new-staff-role");
    if (!nameInput || !roleSelect) return;

    const name = nameInput.value.trim();
    const role = roleSelect.value;
    if (!name) return;

    const newId = `staff-${Date.now()}`;
    const newMember = {
      id: newId,
      name: name,
      role: role,
      permissions: {
        dispenseRx: role === "Manager" || role === "Pharmacist",
        packOrders: true,
        editBilling: role === "Manager"
      }
    };

    state.staff.push(newMember);
    showToast(`New staff member '${name}' registered successfully!`, "success");
    navigateTo('profile');
  };

  function getPharmacyAnalyticsHTML() {
    return `
      <div style="margin-bottom: 32px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
          <div>
            <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">SaaS Store Performance & AI Analytics</h2>
            <p class="text-sm" style="color: var(--text-muted);">${state.language === 'ar' ? 'مراقبة مقاييس الصيدلية المتقدمة، وتوقعات الطلب الذكي.' : 'Monitor your pharmacy\'s dynamic metrics, smart demand forecasts, and subscription tier.'}</p>
          </div>
          <span class="badge badge-success" style="font-size:0.75rem; padding: 6px 12px;">MOH Accredited Partner</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;" class="analytics-panels-grid">
          <!-- Left Panel: AI Demand Forecasting & Stock Expiries -->
          <div class="card" style="border-left: 4px solid var(--accent); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 class="font-bold text-md" style="margin-bottom: 16px; display:flex; align-items:center; gap:8px;">
                <span>🧠</span> <span>${state.language === 'ar' ? 'توقعات الطلب الذكي والتنبيهات' : 'AI Demand Prediction & Alerts'}</span>
              </h3>
              <p class="text-sm" style="color: var(--text-muted); line-height: 1.5; margin-bottom: 20px;">
                ${state.language === 'ar' ? 'تحلل النماذج الإحصائية لدينا أنماط الطقس في القاهرة ومعدلات مبيعات الأدوية الموسمية بالحي.' : 'Our machine learning models analyze local Cairo weather patterns, clinical epidemiological feeds, and historical neighborhood checkout velocities.'}
              </p>
              
              <div style="display:flex; flex-direction:column; gap:12px; margin-bottom: 20px;">
                <!-- Weather Trigger Alert -->
                <div style="background: rgba(0, 186, 181, 0.06); border: 1.5px solid rgba(0, 186, 181, 0.2); border-radius: var(--radius-sm); padding: 12px; display:flex; gap:12px; align-items:start;">
                  <span style="font-size: 1.25rem;">🌪️</span>
                  <div>
                    <strong style="font-size: 0.82rem; color: var(--text-main); display:block; margin-bottom: 2px;">Cairo Asthma Storm Warning</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted); display:block; line-height: 1.4;">Sandstorm expected in Heliopolis/Zamalek this weekend. Predicted Ventolin demand surge: <strong style="color: var(--accent);">+45%</strong>. Ensure inhaler inventory buffers.</span>
                  </div>
                </div>

                <!-- Expiry Tracker Alert -->
                <div style="background: rgba(239, 68, 68, 0.06); border: 1.5px solid rgba(239, 68, 68, 0.2); border-radius: var(--radius-sm); padding: 12px; display:flex; gap:12px; align-items:start;">
                  <span style="font-size: 1.25rem;">⏳</span>
                  <div>
                    <strong style="font-size: 0.82rem; color: #ef4444; display:block; margin-bottom: 2px;">Stock Batch Expiry Warning</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted); display:block; line-height: 1.4;">Batch <strong style="color: var(--text-main);">B771-08</strong> of Amoxil 500mg (8 units) is expiring on <strong style="color: #ef4444;">2027-06-30</strong>. Recommend discount campaign bundle setup.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button class="btn btn-outline btn-sm" onclick="navigateTo('inventory')" style="width: 100%;">${state.language === 'ar' ? 'تعديل مخزون الأدوية' : 'Adjust Inventory Stock'}</button>
          </div>

          <!-- Right Panel: SaaS Subscription Profile & Listing Boost -->
          <div class="card" style="border-left: 4px solid var(--primary); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom: 16px;">
                <h3 class="font-bold text-md" style="margin:0; display:flex; align-items:center; gap:8px;">
                  <span>💎</span> <span>SaaS Subscription Manager</span>
                </h3>
                <span class="badge badge-success" style="font-size: 0.65rem;">PRO TIER</span>
              </div>
              <p class="text-sm" style="color: var(--text-muted); line-height: 1.5; margin-bottom: 20px;">
                Your premium SaaS subscription enables Cairo branch listing boosts, advanced demand triggers, and full staff permission directory tools.
              </p>

              <div style="background: var(--input-bg); border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding: 14px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                <div style="display:flex; justify-content:space-between;">
                  <span style="color: var(--text-muted);">Billing Frequency:</span>
                  <strong style="color: var(--text-main);">450.00 EGP / Month</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="color: var(--text-muted);">Next Auto-Renewal:</span>
                  <strong style="color: var(--text-main);">June 15, 2026</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="color: var(--text-muted);">Payment Method:</span>
                  <strong style="color: var(--primary);">Visa (Ending in *8904)</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="color: var(--text-muted);">Active Branch Boosts:</span>
                  <strong style="color: var(--accent); font-family: var(--font-display);">Zamalek, Dokki Districts</strong>
                </div>
              </div>
            </div>
            
            <button class="btn btn-primary btn-sm" onclick="showToast('SaaS Subscription details and payment gateway loaded.', 'success');" style="width: 100%;">Manage SaaS Billing Plan</button>
          </div>
        </div>
        
        <!-- Live performance table log -->
        <div class="card">
          <h3 class="font-semibold text-sm" style="color:var(--text-light); margin-bottom:16px; text-transform:uppercase; letter-spacing:0.5px;">Accreditation & Quality Parameters</h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;" class="quality-grid">
            <div style="background: var(--input-bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <span style="font-size: 0.7rem; color: var(--text-muted); display: block; text-transform: uppercase;">Average Dispatch Time</span>
              <strong style="font-size: 1.1rem; color: var(--text-main); display: block; margin-top: 4px;">22 Minutes</strong>
            </div>
            <div style="background: var(--input-bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <span style="font-size: 0.7rem; color: var(--text-muted); display: block; text-transform: uppercase;">Order Accuracy Rate</span>
              <strong style="font-size: 1.1rem; color: var(--text-main); display: block; margin-top: 4px;">99.4%</strong>
            </div>
            <div style="background: var(--input-bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <span style="font-size: 0.7rem; color: var(--text-muted); display: block; text-transform: uppercase;">Customer Rating</span>
              <strong style="font-size: 1.1rem; color: var(--color-warning); display: block; margin-top: 4px;">⭐ 4.8 / 5.0</strong>
            </div>
            <div style="background: var(--input-bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <span style="font-size: 0.7rem; color: var(--text-muted); display: block; text-transform: uppercase;">System License ID</span>
              <strong style="font-size: 0.85rem; color: var(--text-main); display: block; margin-top: 6px; font-family: monospace;">LIC-88290-EZE</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getPharmacyProfileHTML() {
    const pharm = state.pharmacies.find(p => p.id === state.activePharmacySession) || state.pharmacies[0];

    const staffRows = state.staff.map(s => {
      return `
        <tr>
          <td><strong style="color:var(--text-main); font-size:0.9rem;">${s.name}</strong></td>
          <td><span class="badge ${s.role === 'Manager' ? 'badge-primary' : (s.role === 'Pharmacist' ? 'badge-success' : 'badge-info')}" style="font-size:0.7rem;">${s.role}</span></td>
          <td style="text-align: center;">
            <input type="checkbox" ${s.permissions.dispenseRx ? 'checked' : ''} onchange="window.toggleStaffPermission('${s.id}', 'dispenseRx')">
          </td>
          <td style="text-align: center;">
            <input type="checkbox" ${s.permissions.packOrders ? 'checked' : ''} onchange="window.toggleStaffPermission('${s.id}', 'packOrders')">
          </td>
          <td style="text-align: center;">
            <input type="checkbox" ${s.permissions.editBilling ? 'checked' : ''} onchange="window.toggleStaffPermission('${s.id}', 'editBilling')">
          </td>
        </tr>
      `;
    }).join("");

    return `
      <div style="margin-bottom: 32px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 32px;" class="pharmacy-profile-grid">
        <!-- Left: configurations form -->
        <div>
          <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">${state.language === 'ar' ? 'إعدادات الصيدلية' : 'Store Configurations'}</h2>
          <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${state.language === 'ar' ? 'تعديل رسوم التوصيل ونطاقات التغطية الجغرافية.' : 'Configure delivery charges and covered coordinates.'}</p>
          
          <div class="card">
            <form onsubmit="event.preventDefault(); showToast('Pharmacy configurations updated!', 'success');">
              <div class="form-group">
                <label class="form-label">Store Legal Name</label>
                <input type="text" class="form-control" value="${pharm.name}" required id="p-setup-name">
              </div>

              <div class="form-group">
                <label class="form-label">Drop-off Street Address</label>
                <input type="text" class="form-control" value="${pharm.address}" required id="p-setup-address">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Standard Delivery Charge (EGP)</label>
                  <input type="number" step="0.01" class="form-control" value="${pharm.deliveryFee}" required id="p-setup-fee">
                </div>

                <div class="form-group">
                  <label class="form-label">Estimated Dispatch Time</label>
                  <input type="text" class="form-control" value="${pharm.deliveryTime}" required id="p-setup-time">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Covered Delivery Districts</label>
                <input type="text" class="form-control" value="${pharm.deliveryZones}" required id="p-setup-zones">
              </div>

              <button type="submit" class="btn btn-accent" style="width:100%; margin-top:10px;">Save Store coordinates</button>
            </form>
          </div>
        </div>

        <!-- Right: Staff Access Roles Directory -->
        <div>
          <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">${state.language === 'ar' ? 'إدارة طاقم العمل والصلاحيات' : 'SaaS Staff Directory & Access'}</h2>
          <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">${state.language === 'ar' ? 'إسناد صلاحيات الصرف، التغليف، وتعديل الفواتير لصيادلة الفروع.' : 'Manage functional roles and toggle security privileges for store operators.'}</p>
          
          <div class="card" style="padding:0; overflow:hidden; margin-bottom: 24px;">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Functional Role</th>
                  <th style="text-align:center;">Dispense Rx</th>
                  <th style="text-align:center;">Pack Orders</th>
                  <th style="text-align:center;">Edit Billing</th>
                </tr>
              </thead>
              <tbody>
                ${staffRows}
              </tbody>
            </table>
          </div>

          <div class="card">
            <h3 class="font-bold text-md" style="margin-bottom: 16px; display:flex; align-items:center; gap:6px;">
              <span>👤</span> <span>${state.language === 'ar' ? 'إضافة موظف جديد' : 'Register New Staff Member'}</span>
            </h3>
            <form onsubmit="window.addNewStaffMember(event)">
              <div class="form-group">
                <label class="form-label">${state.language === 'ar' ? 'اسم الموظف' : 'Employee Full Name'}</label>
                <input type="text" id="new-staff-name" class="form-control" placeholder="E.g., Dr. Yasmin Tarek" required>
              </div>
              <div class="form-group">
                <label class="form-label">${state.language === 'ar' ? 'الدور الوظيفي' : 'Functional Role'}</label>
                <select id="new-staff-role" class="form-control" style="background-color: var(--input-bg);">
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Packer">Packer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <button type="submit" class="btn btn-accent btn-sm" style="width: 100%; margin-top: 10px;">${state.language === 'ar' ? 'إضافة الموظف للفريق 🚀' : 'Add Employee to Registry 🚀'}</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // --- ADMIN DASHBOARD PAGES ---
  window.updatePlatformCommission = function (val) {
    state.platformCommission = parseFloat(val);

    // Dynamically update the slider label
    const percentLabel = document.getElementById("commission-percentage-label");
    if (percentLabel) {
      percentLabel.innerText = `${state.platformCommission.toFixed(1)}%`;
    }

    // Dynamically update the platform net earnings metric card value
    const globalTurnover = state.orders.reduce((sum, o) => sum + o.total, 0);
    const netEarnings = globalTurnover * (state.platformCommission / 100);

    const earningsVal = document.getElementById("net-earnings-value");
    if (earningsVal) {
      earningsVal.innerText = `${netEarnings.toFixed(2)} EGP`;
    }

    const commissionMetricVal = document.getElementById("commission-metric-value");
    if (commissionMetricVal) {
      commissionMetricVal.innerText = `${state.platformCommission.toFixed(1)}%`;
    }
  };

  function getAdminOverviewHTML() {
    const pendingPharmCount = state.pharmacies.filter(p => p.status === "Pending Approval").length;
    const activePharmCount = state.pharmacies.filter(p => p.status === "Active").length;
    const totalUsers = 1204;
    const globalTurnover = state.orders.reduce((sum, o) => sum + o.total, 0);
    const netEarnings = globalTurnover * (state.platformCommission / 100);

    return `
      <!-- Admin metrics cards -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
        <div class="metric-card">
          <div class="metric-icon-box" style="background-color: var(--primary-light); color: var(--primary);">👥</div>
          <div class="metric-details">
            <span class="metric-label">Active Platform Users</span>
            <span class="metric-value">${totalUsers}</span>
            <div class="metric-trend trend-up">
              <span>↑ 12%</span> <span style="color: var(--text-light);">this month</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box" style="background-color: var(--accent-light); color: var(--accent);">🏥</div>
          <div class="metric-details">
            <span class="metric-label">Active Pharmacies</span>
            <span class="metric-value">${activePharmCount}</span>
            <div class="metric-trend trend-up">
              <span>↑ 4 new</span> <span style="color: var(--text-light);">this week</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box" style="background-color: var(--color-warning-light); color: var(--color-warning);">⚠️</div>
          <div class="metric-details">
            <span class="metric-label">Awaiting MOH Approvals</span>
            <span class="metric-value">${pendingPharmCount}</span>
            <div class="metric-trend trend-down">
              <span>⚠️ Action req.</span> <span style="color: var(--text-light);">license review</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box" style="background-color: var(--color-success-light); color: var(--color-success);">📈</div>
          <div class="metric-details">
            <span class="metric-label">Total Platform Turnover</span>
            <span class="metric-value">${globalTurnover.toFixed(2)} EGP</span>
            <div class="metric-trend trend-up">
              <span>↑ 22%</span> <span style="color: var(--text-light);">average margin</span>
            </div>
          </div>
        </div>

        <div class="metric-card" style="border: 1.5px solid var(--accent); background: linear-gradient(135deg, rgba(0, 186, 181, 0.04) 0%, transparent 100%);">
          <div class="metric-icon-box" style="background-color: var(--accent-light); color: var(--accent);">💎</div>
          <div class="metric-details">
            <span class="metric-label">Net Platform Earnings</span>
            <span class="metric-value" id="net-earnings-value">${netEarnings.toFixed(2)} EGP</span>
            <div class="metric-trend trend-up" style="color: var(--accent);">
              <span>● ${state.platformCommission.toFixed(1)}%</span> <span style="color: var(--text-light);">current commission</span>
            </div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 32px; margin-bottom: 32px;">
        <!-- Left: Range slider control and system statuses -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h3 class="font-bold text-lg" style="margin-bottom: 12px; display:flex; align-items:center; gap:8px;">
              <span>⚙️</span> <span>Platform Commission Control Panel</span>
            </h3>
            <p class="text-sm" style="color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">
              Adjust the marketplace transactional commission rate dynamically. All changes propagate to regional pharmacy settlements instantly and recalculate platform net earnings in real-time.
            </p>

            <div style="background: var(--input-bg); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 20px; margin-bottom: 20px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                <strong style="font-size: 0.88rem; color: var(--text-main);">Transactional Fee Rate</strong>
                <span id="commission-percentage-label" style="font-size: 1.25rem; font-family: var(--font-display); color: var(--primary); font-weight:800;">${state.platformCommission.toFixed(1)}%</span>
              </div>
              <input type="range" class="form-range" min="1.0" max="15.0" step="0.5" value="${state.platformCommission}" oninput="window.updatePlatformCommission(this.value)" style="width: 100%; accent-color: var(--primary); cursor: pointer;">
              <div style="display:flex; justify-content:space-between; font-size: 0.72rem; color: var(--text-light); margin-top: 6px;">
                <span>1.0% (SaaS Base)</span>
                <span>7.5% (Average)</span>
                <span>15.0% (Cap Limit)</span>
              </div>
            </div>
          </div>
          
          <div style="display:flex; gap:16px;">
            <div style="flex:1; background: var(--input-bg); border-radius: var(--radius-sm); border:1px solid var(--border-color); padding: 12px; text-align:center;">
              <span style="font-size: 0.68rem; color: var(--text-muted); display:block; text-transform:uppercase;">Platform Fee Rate</span>
              <strong id="commission-metric-value" style="font-size: 1.2rem; color: var(--text-main); display:block; margin-top:4px;">${state.platformCommission.toFixed(1)}%</strong>
            </div>
            <div style="flex:1; background: var(--input-bg); border-radius: var(--radius-sm); border:1px solid var(--border-color); padding: 12px; text-align:center;">
              <span style="font-size: 0.68rem; color: var(--text-muted); display:block; text-transform:uppercase;">Settlement Frequency</span>
              <strong style="font-size: 1.1rem; color: var(--text-main); display:block; margin-top:6px;">Weekly Auto</strong>
            </div>
          </div>
        </div>

        <!-- Right: Pending approvals alerts -->
        <div class="card" style="border-left: 4px solid var(--color-warning); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h3 class="font-bold text-md" style="margin-bottom: 16px;">Pending approvals queue</h3>
            <p class="text-sm" style="color:var(--text-muted); line-height:1.6; margin-bottom:20px;">
              You have <strong style="color: var(--color-warning);">${pendingPharmCount}</strong> retail pharmacies waiting for operating permit validations. Verify documents against the Ministry of Health database.
            </p>
          </div>
          <button class="btn btn-warning btn-sm" style="width:100%; font-weight:700;" onclick="navigateTo('approvals')">Review License Permits</button>
        </div>
      </div>
    `;
  }

  function getAdminApprovalsHTML() {
    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">Accreditation Requests Pipeline</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">Validate operating credentials against Ministry of Health public parameters before publishing active databases.</p>
        
        <div style="display:flex; flex-direction:column;" id="admin-approvals-pipeline-list"></div>
      </div>
    `;
  }

  window.renderAdminApprovals = function () {
    const list = document.getElementById("admin-approvals-pipeline-list");
    if (!list) return;

    const pending = state.pharmacies.filter(p => p.status === "Pending Approval");

    if (pending.length === 0) {
      list.innerHTML = `<p class="text-sm" style="color:var(--text-light);">No pending accreditation requests are active in the queues.</p>`;
      return;
    }

    list.innerHTML = pending.map(p => `
      <div class="card" style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; hover: transform none;">
        <div>
          <div style="display:flex; gap:10px; align-items:center; margin-bottom:4px;">
            <h4 class="font-bold text-md" style="margin:0; color:var(--text-main);">${p.name}</h4>
            <span class="badge badge-warning" style="font-size:0.65rem;">Awaiting MOH Review</span>
          </div>
          <p class="text-xs" style="color:var(--text-muted); margin:0;">📍 Location: <strong>${p.address}</strong> • License Permit ID: <strong>${p.licenseNo}</strong></p>
        </div>

        <button class="btn btn-primary btn-sm" onclick="triggerVerifyPharmacyModal('${p.id}')">Review License File</button>
      </div>
    `).join("");
  };

  function getAdminUsersHTML() {
    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">Registered Patients Database</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">Search and coordinate patient drop-off street coordinates.</p>
        
        <div class="card" style="padding:0; overflow:hidden;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Contact Coordinate</th>
                <th>Drop-off Street Address</th>
                <th>Age / Gender</th>
                <th>MOH Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>John Doe</strong></td>
                <td>+201011122233</td>
                <td>Apartment 14, 5th Floor, 10 Zamalek Towers, Cairo</td>
                <td>28 / Male</td>
                <td><span class="badge badge-success">ACTIVE</span></td>
              </tr>
              <tr>
                <td><strong>Amira Younes</strong></td>
                <td>+201298765432</td>
                <td>12 El Obour Buildings, Heliopolis</td>
                <td>34 / Female</td>
                <td><span class="badge badge-success">ACTIVE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function getAdminPharmaciesHTML() {
    const list = state.pharmacies.map(p => {
      let statusColor = "badge-success";
      if (p.status === "Pending Approval") statusColor = "badge-warning";
      if (p.status === "Rejected") statusColor = "badge-danger";

      return `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.licenseNo}</td>
          <td>📍 ${p.address}</td>
          <td>⭐ ${p.rating} (${p.reviews} reviews)</td>
          <td><span class="badge ${statusColor}">${p.status.toUpperCase()}</span></td>
        </tr>
      `;
    }).join("");

    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">Accredited Pharmacy Registrations</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">Browse active Cairo regional marketplace databases.</p>
        
        <div class="card" style="padding:0; overflow:hidden;">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Pharmacy Title</th>
                <th>MOH License</th>
                <th>Location Details</th>
                <th>Platform Reviews</th>
                <th>System Status</th>
              </tr>
            </thead>
            <tbody>
              ${list}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.createAdminCoupon = function (event) {
    event.preventDefault();
    const codeInput = document.getElementById("admin-coupon-code");
    const discountInput = document.getElementById("admin-coupon-discount");
    if (!codeInput || !discountInput) return;

    const code = codeInput.value.trim().toUpperCase();
    const discount = parseInt(discountInput.value, 10);

    if (!code) {
      showToast(state.language === 'ar' ? 'يرجى إدخال كود الخصم!' : 'Please enter a valid coupon code!', 'danger');
      return;
    }

    if (isNaN(discount) || discount < 1 || discount > 100) {
      showToast(state.language === 'ar' ? 'يجب أن تكون نسبة الخصم بين 1 و 100!' : 'Discount percentage must be between 1 and 100!', 'danger');
      return;
    }

    // Check if code already exists
    if (state.activeCoupons.some(c => c.code === code)) {
      showToast(state.language === 'ar' ? 'هذا الكود موجود بالفعل!' : 'This coupon code already exists!', 'danger');
      return;
    }

    state.activeCoupons.push({ code, discount });
    showToast(state.language === 'ar' ? `تم تفعيل كود الخصم ${code} بنجاح!` : `Coupon campaign ${code} created successfully!`, 'success');

    navigateTo('system');
  };

  window.deleteAdminCoupon = function (code) {
    state.activeCoupons = state.activeCoupons.filter(c => c.code !== code);
    showToast(state.language === 'ar' ? 'تم حذف كود الخصم بنجاح!' : 'Coupon code deleted successfully!', 'success');

    navigateTo('system');
  };

  function getAdminSystemHTML() {
    const isAr = state.language === 'ar';

    // Generate rows for the active coupons
    const couponRows = state.activeCoupons.map(c => {
      return `
        <tr>
          <td><strong style="color:var(--text-main); font-family:var(--font-display); font-size:0.92rem; letter-spacing:0.5px;">${c.code}</strong></td>
          <td><strong style="color:var(--primary); font-size:0.92rem;">${c.discount}%</strong></td>
          <td><span class="badge badge-success" style="font-size:0.65rem;">${isAr ? 'حملة نشطة' : 'ACTIVE CAMPAIGN'}</span></td>
          <td style="text-align:right;">
            <button class="btn btn-danger btn-sm" onclick="window.deleteAdminCoupon('${c.code}')" style="padding:4px 8px; font-size:0.72rem; font-weight:700;">
              ${isAr ? 'حذف 🗑️' : 'Delete 🗑️'}
            </button>
          </td>
        </tr>
      `;
    }).join("");

    return `
      <div style="margin-bottom: 32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom: 4px;">
          ${isAr ? 'إعدادات النظام وأكواد الخصم' : 'System Configurations & Promotions'}
        </h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom: 24px;">
          ${isAr ? 'إدارة أكواد الخصم النشطة وتفعيل حملات ترويجية جديدة ومراقبة تشخيصات النظام.' : 'Manage system-wide campaign coupons, active discount registries, and monitor platform health metrics.'}
        </p>

        <!-- System Diagnostics Health Summary Banner -->
        <div class="card" style="margin-bottom: 32px; padding: 20px; background: linear-gradient(135deg, rgba(15, 98, 254, 0.03) 0%, transparent 100%);">
          <h3 class="font-bold text-sm" style="color: var(--text-light); text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> <span>${isAr ? 'مؤشرات تشخيص النظام' : 'Core System Health & Diagnostics'}</span>
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            <div style="background: var(--input-bg); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: var(--radius-sm); text-align: left;">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block; text-transform: uppercase; margin-bottom: 4px;">🔌 WhatsApp Cron Job</span>
              <span class="badge badge-success" style="font-size: 0.65rem;">${isAr ? 'نشط ويعمل' : 'ACTIVE CYCLE'}</span>
            </div>
            <div style="background: var(--input-bg); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: var(--radius-sm); text-align: left;">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block; text-transform: uppercase; margin-bottom: 4px;">📈 Platform Fee Commission</span>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${state.platformCommission.toFixed(1)}% per order</strong>
            </div>
            <div style="background: var(--input-bg); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: var(--radius-sm); text-align: left;">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block; text-transform: uppercase; margin-bottom: 4px;">📜 Ministry of Health API</span>
              <strong style="color: var(--accent); font-size: 0.85rem;">${isAr ? 'متصل (تحديث 04:00 ص)' : 'CONNECTED (Sync 04:00 AM)'}</strong>
            </div>
            <div style="background: var(--input-bg); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: var(--radius-sm); text-align: left;">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block; text-transform: uppercase; margin-bottom: 4px;">📦 Express Delivery Riders</span>
              <strong style="color: var(--text-main); font-size: 0.95rem;">85 Active Couriers</strong>
            </div>
          </div>
        </div>

        <!-- Double Column Layout -->
        <div class="admin-system-grid">
          
          <!-- Left Column: Coupon Promotions Registry Table -->
          <div>
            <h3 class="font-bold text-lg" style="margin-bottom: 4px; display:flex; align-items:center; gap:8px;">
              <span>🎟️</span> <span>${isAr ? 'سجل أكواد الخصم النشطة' : 'Coupon Promotions Registry'}</span>
            </h3>
            <p class="text-xs" style="color: var(--text-muted); margin-bottom: 16px;">
              ${isAr ? 'قائمة الأكواد الفعالة حالياً للعملاء على المنصة.' : 'Active promotional databases available for clinical cart checkouts.'}
            </p>
            
            <div class="card" style="padding:0; overflow:hidden;">
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>${isAr ? 'كود الخصم' : 'Promo Code'}</th>
                    <th>${isAr ? 'نسبة الخصم' : 'Discount'}</th>
                    <th>${isAr ? 'حالة الحملة' : 'Campaign Status'}</th>
                    <th style="text-align:right;">${isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${couponRows.length > 0 ? couponRows : `
                    <tr>
                      <td colspan="4" style="text-align:center; padding: 24px; color: var(--text-light); font-size: 0.85rem;">
                        ${isAr ? 'لا توجد أكواد خصم نشطة حالياً.' : 'No active campaign coupons in the registry.'}
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right Column: Interactive Coupon Campaign Generator Form -->
          <div>
            <div class="card" style="border-left: 4px solid var(--accent);">
              <h3 class="font-bold text-lg" style="margin-bottom: 4px; display:flex; align-items:center; gap:8px;">
                <span>⚡</span> <span>${isAr ? 'إنشاء كود خصم جديد' : 'Coupon Campaign Generator'}</span>
              </h3>
              <p class="text-xs" style="color: var(--text-muted); margin-bottom: 20px;">
                ${isAr ? 'أضف كوداً جديداً وحدد نسبة الخصم لتنشيطه فوراً للعملاء.' : 'Activate immediate platform discount promotions for Cairo patients.'}
              </p>
              
              <form onsubmit="window.createAdminCoupon(event)">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label" style="font-size: 0.8rem; font-weight: 600;">
                    ${isAr ? 'كود الخصم الجديد' : 'Coupon Code'}
                  </label>
                  <input type="text" id="admin-coupon-code" class="form-control" placeholder="E.g., CAIRO20" required style="text-transform: uppercase;">
                </div>
                
                <div class="form-group" style="margin-bottom: 20px;">
                  <label class="form-label" style="font-size: 0.8rem; font-weight: 600;">
                    ${isAr ? 'نسبة الخصم (%)' : 'Discount Percentage (%)'}
                  </label>
                  <input type="number" id="admin-coupon-discount" class="form-control" placeholder="E.g., 20" min="1" max="100" required>
                </div>
                
                <button type="submit" class="btn btn-accent" style="width:100%; font-weight:700;">
                  ${isAr ? 'تفعيل حملة الخصم 🚀' : 'Create Coupon Campaign 🚀'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  function getDesignSystemHTML() {
    return `
      <div style="margin-bottom:32px;">
        <h2 class="text-2xl font-bold" style="margin-bottom:4px;">Premium Visual System Showcase</h2>
        <p class="text-sm" style="color: var(--text-muted); margin-bottom:24px;">Overview of the premium CSS visual components built for the DawayaHealthcare aggregate platform.</p>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 32px;">
          <!-- Left: Colors & Typography -->
          <div>
            <div class="card" style="margin-bottom:32px;">
              <h3 class="font-bold text-lg" style="margin-bottom:16px;">Core Spacing & Radius Tokens</h3>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:0.85rem;">
                <div style="background-color: var(--input-bg); border-radius: var(--radius-sm); padding:12px; border:1.5px solid var(--border-color);">
                  <strong>Small Corners</strong><br>
                  radius-sm: 12px
                </div>
                <div style="background-color: var(--input-bg); border-radius: var(--radius-md); padding:12px; border:1.5px solid var(--border-color);">
                  <strong>Medium Cards</strong><br>
                  radius-md: 20px
                </div>
              </div>
            </div>

            <div class="card">
              <h3 class="font-bold text-lg" style="margin-bottom:16px;">Premium Color Palette</h3>
              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.82rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-radius:var(--radius-sm); background-color: var(--primary); color:#fff;">
                  <strong>Medical Tech Blue</strong>
                  <span>#0f62fe</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-radius:var(--radius-sm); background-color: var(--accent); color:#fff;">
                  <strong>Premium Teal Accent</strong>
                  <span>#00bab5</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Buttons & components -->
          <div>
            <div class="card" style="margin-bottom:32px;">
              <h3 class="font-bold text-lg" style="margin-bottom:16px;">Standard Buttons Matrix</h3>
              <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <button class="btn btn-primary">Primary CTA</button>
                <button class="btn btn-secondary">Secondary Btn</button>
                <button class="btn btn-accent">Accent Teal</button>
                <button class="btn btn-outline">Outline Border</button>
                <button class="btn btn-danger">Danger CTA</button>
                <button class="btn btn-whatsapp">WhatsApp Connect</button>
              </div>
            </div>

            <div class="card">
              <h3 class="font-bold text-lg" style="margin-bottom:16px;">Standard Status Badges</h3>
              <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <span class="badge badge-success">Accredited Active</span>
                <span class="badge badge-warning">Awaiting Packings</span>
                <span class="badge badge-danger">Application Rejected</span>
                <span class="badge badge-info">OCR File Scan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- INITIALIZE ROUTING ---
  switchRole("public");

  // Keep these subcomponent rendering events active on page switches
  window.navigateTo = function (screenName) {
    state.activeScreen = screenName;

    // Render the beautiful shimmering skeleton
    renderSkeleton(screenName);

    // Smooth transition timeout representing async SaaS data fetch
    setTimeout(() => {
      // Render the actual layout
      renderAppLayout();

      // Auto populate custom screen views on dynamic rendering
      if (state.activeRole === "pharmacy" && screenName === "inventory") {
        renderPharmacyInventory();
      }
      if (state.activeRole === "pharmacy" && screenName === "orders") {
        renderPharmacyOrders();
      }
      if (state.activeRole === "admin" && screenName === "approvals") {
        renderAdminApprovals();
      }
      if (state.activeRole === "patient" && screenName === "reminders") {
        renderRemindersList();
        renderPhoneMessages();
      }
      if (state.activeRole === "patient" && screenName === "cart") {
        renderCartPage();
      }
      if (state.activeRole === "patient" && screenName === "checkout") {
        renderCheckoutPage();
      }
    }, 450);

    window.scrollTo(0, 0);
  };

  // --- DYNAMIC INTERACTIVE BUTTON RIPPLE EFFECT ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn, .role-btn, .nav-link, .sidebar-item-link");
    if (!btn) return;

    // Spawn ripple span
    const ripple = document.createElement("span");
    ripple.className = "btn-ripple";

    // Position the ripple relative to the button boundaries
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);

    // Auto-remove ripple element after animation finishes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // --- AI CHATBOT LOGIC ---
  const chatbotToggle = document.getElementById("ai-chatbot-toggle");
  const chatbotWindow = document.getElementById("ai-chatbot-window");
  const chatbotClose = document.getElementById("ai-chatbot-close");
  const chatbotSend = document.getElementById("ai-chatbot-send");
  const chatbotInput = document.getElementById("ai-chatbot-input");
  const chatbotMessages = document.getElementById("ai-chatbot-messages");

  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener("click", () => {
      chatbotWindow.classList.add("active");
    });
  }

  if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener("click", () => {
      chatbotWindow.classList.remove("active");
    });
  }

  const appendBotMessage = (htmlContent) => {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble bot";
    bubble.innerHTML = htmlContent;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const appendUserMessage = (text) => {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble user";
    bubble.textContent = text;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const processChatbotInput = (text) => {
    const q = text.toLowerCase().trim();
    let reply = "";

    // Check for medicine matches or keywords
    if (q.includes("paracetamol") || q.includes("panadol") || q.includes("pain reliever") || q.includes("مسكن")) {
      reply = `
        <strong>💊 Panadol Extra (Paracetamol 500mg / Caffeine 65mg)</strong><br>
        Effective for tough pain relief, migraines, and muscle aches. Gentle on the stomach.<br><br>
        <strong>Cheapest Price:</strong> <span style="color:var(--color-success); font-weight:700;">15.00 EGP</span> (at Seif Pharmacy)<br>
        <strong>Egyptian Alternatives:</strong> Adol 500mg, Abimol 500mg, Paramol.<br><br>
        <button class="btn btn-primary btn-sm" onclick="window.addMedicationFromChat('med-1')" style="margin-top:4px; font-size:0.75rem; padding:4px 8px;">Add to Cart 🛒</button>
      `;
    } else if (q.includes("amoxil") || q.includes("amoxicillin") || q.includes("antibiotic") || q.includes("مضاد حيوي")) {
      reply = `
        <strong>💊 Amoxil 500mg (Amoxicillin Trihydrate)</strong><br>
        Broad-spectrum antibiotic for bacterial infections. <em>Requires prescription check (Rx).</em><br><br>
        <strong>Cheapest Price:</strong> <span style="color:var(--color-success); font-weight:700;">47.00 EGP</span> (at Seif Pharmacy)<br>
        <strong>Egyptian Alternatives:</strong> Flumox 500mg, Ibiamox 500mg.<br><br>
        <button class="btn btn-primary btn-sm" onclick="window.addMedicationFromChat('med-2')" style="margin-top:4px; font-size:0.75rem; padding:4px 8px;">Add Amoxil to Cart 🛒</button>
      `;
    } else if (q.includes("lipitor") || q.includes("atorvastatin") || q.includes("cholesterol") || q.includes("كوليسترول")) {
      reply = `
        <strong>💊 Lipitor 10mg (Atorvastatin Calcium)</strong><br>
        Used to prevent cardiovascular disease and lower abnormal lipids. <em>Requires prescription (Rx).</em><br><br>
        <strong>Cheapest Price:</strong> <span style="color:var(--color-success); font-weight:700;">119.00 EGP</span> (at Seif Pharmacy)<br>
        <strong>Egyptian Alternatives:</strong> Ator 10mg, Lipona 10mg, Atorstat (save up to 45%).<br><br>
        <button class="btn btn-primary btn-sm" onclick="window.addMedicationFromChat('med-3')" style="margin-top:4px; font-size:0.75rem; padding:4px 8px;">Add Lipitor to Cart 🛒</button>
      `;
    } else if (q.includes("glucophage") || q.includes("metformin") || q.includes("diabetes") || q.includes("سكر")) {
      reply = `
        <strong>💊 Glucophage 850mg (Metformin Hydrochloride)</strong><br>
        Essential chronic drug for type 2 diabetes glycemic control. <em>Requires prescription (Rx).</em><br><br>
        <strong>Cheapest Price:</strong> <span style="color:var(--color-success); font-weight:700;">34.50 EGP</span> (at Metro Pharmacy)<br>
        <strong>Egyptian Alternatives:</strong> Cidophage 850mg, Metformin Local.<br><br>
        <button class="btn btn-primary btn-sm" onclick="window.addMedicationFromChat('med-4')" style="margin-top:4px; font-size:0.75rem; padding:4px 8px;">Add Glucophage to Cart 🛒</button>
      `;
    } else if (q.includes("ventolin") || q.includes("asthma") || q.includes("حساسية صدر")) {
      reply = `
        <strong>💊 Ventolin Inhaler (Salbutamol Sulfate 100mcg)</strong><br>
        Fast-acting reliever inhaler for asthma and COPD. <em>Requires prescription (Rx).</em><br><br>
        <strong>Cheapest Price:</strong> <span style="color:var(--color-success); font-weight:700;">65.00 EGP</span> (at El Ezaby Pharmacy)<br>
        <strong>Egyptian Alternatives:</strong> Farcolin Inhaler.<br><br>
        <button class="btn btn-primary btn-sm" onclick="window.addMedicationFromChat('med-5')" style="margin-top:4px; font-size:0.75rem; padding:4px 8px;">Add Ventolin to Cart 🛒</button>
      `;
    } else if (q.includes("claritin") || q.includes("loratadine") || q.includes("allergy") || q.includes("حساسية")) {
      reply = `
        <strong>💊 Claritin 10mg (Loratadine)</strong><br>
        Non-drowsy 24-hour antihistamine allergy relief.<br><br>
        <strong>Cheapest Price:</strong> <span style="color:var(--color-success); font-weight:700;">28.00 EGP</span> (at Seif Pharmacy)<br>
        <strong>Egyptian Alternatives:</strong> Histaloc 10mg, Lorano 10mg.<br><br>
        <button class="btn btn-primary btn-sm" onclick="window.addMedicationFromChat('med-6')" style="margin-top:4px; font-size:0.75rem; padding:4px 8px;">Add Claritin to Cart 🛒</button>
      `;
    } else if (q.includes("elderly") || q.includes("tips") || q.includes("كبار") || q.includes("مسنين")) {
      reply = `
        👵 <strong>Dr. Dawaya's Elderly Care Guidelines:</strong><br>
        1. <strong>Accessibility Mode:</strong> Click the 👵 icon at the top to increase font sizes and switch to high-contrast colors.<br>
        2. <strong>Medication Scheduling:</strong> Navigate to the <strong>Reminders & WhatsApp</strong> dashboard to setup free automated WhatsApp dose notifications.<br>
        3. <strong>Generic Alternatives:</strong> Ask me about generic alternatives for diabetes (Glucophage) or cholesterol (Lipitor) to save on chronic drug plans.<br>
        4. <strong>Delivery:</strong> Standard deliveries take 30 mins; check the Emergency flag on checkout for urgent orders.
      `;
    } else {
      reply = `
        I'm Dr. Dawaya, your AI Healthcare assistant. I can search medicines, compare prices in Egypt, list local generic alternatives, or give elderly health tips.<br><br>
        Try asking: <strong>"Amoxil price"</strong>, <strong>"Paracetamol alternatives"</strong>, or <strong>"Elderly tips"</strong>.
      `;
    }

    setTimeout(() => {
      appendBotMessage(reply);
    }, 600);
  };

  window.sendChatbotPredefined = (text) => {
    appendUserMessage(text);
    processChatbotInput(text);
  };

  window.addMedicationFromChat = (medId) => {
    // Determine cheapest pharmacy currently for this medicine in stock
    const med = state.medicines.find(m => m.id === medId);
    if (!med) return;
    const activePrices = Object.entries(med.prices)
      .filter(([pId]) => {
        const ph = state.pharmacies.find(p => p.id === pId);
        return ph && ph.status === "Active" && med.stock[pId] > 0;
      });

    if (activePrices.length === 0) {
      showToast("Sorry, this item is currently out of stock.", "danger");
      return;
    }

    // Sort by price and pick cheapest
    activePrices.sort((a, b) => a[1] - b[1]);
    const cheapestPharmId = activePrices[0][0];
    const cheapestPrice = activePrices[0][1];

    // Call global addToCart
    window.addToCart(medId, cheapestPharmId, cheapestPrice);
  };

  if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener("click", () => {
      const val = chatbotInput.value.trim();
      if (val) {
        appendUserMessage(val);
        processChatbotInput(val);
        chatbotInput.value = "";
      }
    });

    chatbotInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = chatbotInput.value.trim();
        if (val) {
          appendUserMessage(val);
          processChatbotInput(val);
          chatbotInput.value = "";
        }
      }
    });
  }
});
