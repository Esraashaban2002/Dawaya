// Dawaya Healthcare Marketplace - Realistic Initial Mock Data

const INITIAL_MEDICINES = [
  {
    id: "med-1",
    name: "Panadol Extra",
    genericName: "Paracetamol / Caffeine",
    activeIngredient: "Paracetamol 500mg + Caffeine 65mg",
    category: "OTC / Pain Relief",
    image: "images/panadol.png",
    dosage: "500mg / 65mg",
    description: "Effective relief of tough pain, including headaches, migraines, muscle aches, period pain, and toothache. Gentle on the stomach.",
    prescriptionRequired: false,
    warnings: "Do not exceed the recommended dose. Avoid taking other paracetamol-containing products simultaneously.",
    barcode: "622100234567",
    genericAlternatives: ["med-1-alt"], // We'll handle matching dynamically in code too
    expiryDate: "2028-12-31",
    batchNo: "B902-12",
    demandTrend: "High Demand",
    prices: {
      "pharm-1": 15.50,
      "pharm-2": 16.00,
      "pharm-3": 15.00,
      "pharm-4": 15.75
    },
    stock: {
      "pharm-1": 45,
      "pharm-2": 32,
      "pharm-3": 60,
      "pharm-4": 20
    }
  },
  {
    id: "med-2",
    name: "Amoxil 500mg",
    genericName: "Amoxicillin Trihydrate",
    activeIngredient: "Amoxicillin 500mg",
    category: "Antibiotics",
    image: "images/amoxil.png",
    dosage: "500mg Capsule",
    description: "Broad-spectrum penicillin antibiotic used to treat bacterial infections of the ears, nose, throat, urinary tract, and skin.",
    prescriptionRequired: true,
    warnings: "Requires a valid physician prescription. Complete the full course as directed, even if symptoms disappear.",
    barcode: "622200345678",
    genericAlternatives: ["med-2-alt"],
    expiryDate: "2027-06-30",
    batchNo: "B771-08",
    demandTrend: "Stable",
    prices: {
      "pharm-1": 48.00,
      "pharm-2": 49.50,
      "pharm-3": 47.00
    },
    stock: {
      "pharm-1": 15,
      "pharm-2": 8,
      "pharm-3": 25
    }
  },
  {
    id: "med-3",
    name: "Lipitor",
    genericName: "Atorvastatin Calcium",
    activeIngredient: "Atorvastatin 10mg",
    category: "Chronic / Cholesterol",
    image: "images/lipitor.png",
    dosage: "10mg Tablet",
    description: "Statin medication used to prevent cardiovascular disease in those at high risk and lower abnormal lipid levels.",
    prescriptionRequired: true,
    warnings: "Report any unexplained muscle pain or weakness immediately. Do not consume grapefruit juice in large quantities.",
    barcode: "622300456789",
    genericAlternatives: ["med-3-alt"],
    expiryDate: "2027-10-31",
    batchNo: "B114-04",
    demandTrend: "High Demand",
    prices: {
      "pharm-1": 120.00,
      "pharm-2": 122.50,
      "pharm-3": 119.00,
      "pharm-4": 121.00
    },
    stock: {
      "pharm-1": 3,
      "pharm-2": 12,
      "pharm-3": 18,
      "pharm-4": 5
    }
  },
  {
    id: "med-4",
    name: "Glucophage",
    genericName: "Metformin Hydrochloride",
    activeIngredient: "Metformin 850mg",
    category: "Chronic / Diabetes",
    image: "images/glucophage.png",
    dosage: "850mg Tablet",
    description: "Oral anti-diabetic drug indicated for type 2 diabetes mellitus to improve glycemic control by reducing liver glucose production.",
    prescriptionRequired: true,
    warnings: "Take with meals to minimize gastrointestinal discomfort. Regular blood glucose monitoring is required.",
    barcode: "622400567890",
    genericAlternatives: ["med-4-alt"],
    expiryDate: "2028-03-31",
    batchNo: "B225-11",
    demandTrend: "Stable",
    prices: {
      "pharm-1": 35.00,
      "pharm-2": 34.50,
      "pharm-4": 36.00
    },
    stock: {
      "pharm-1": 50,
      "pharm-2": 40,
      "pharm-4": 65
    }
  },
  {
    id: "med-5",
    name: "Ventolin Inhaler",
    genericName: "Salbutamol Sulfate",
    activeIngredient: "Salbutamol 100mcg",
    category: "Respiratory",
    image: "images/ventolin.png",
    dosage: "100mcg/Dose",
    description: "Reliever inhaler for asthma, bronchospasm, and COPD. Fast-acting bronchodilator that relaxes airways to facilitate breathing.",
    prescriptionRequired: true,
    warnings: "If normal relief wears off or you require more than 4 inhalations daily, consult your doctor immediately.",
    barcode: "622500678901",
    genericAlternatives: ["med-5-alt"],
    expiryDate: "2027-11-30",
    batchNo: "B667-02",
    demandTrend: "Seasonal Increase",
    prices: {
      "pharm-1": 65.00,
      "pharm-2": 67.00,
      "pharm-3": 65.00,
      "pharm-4": 66.50
    },
    stock: {
      "pharm-1": 22,
      "pharm-2": 14,
      "pharm-3": 30,
      "pharm-4": 2
    }
  },
  {
    id: "med-6",
    name: "Claritin",
    genericName: "Loratadine",
    activeIngredient: "Loratadine 10mg",
    category: "Allergies / OTC",
    image: "images/claritin.png",
    dosage: "10mg Tablet",
    description: "Non-drowsy 24-hour allergy relief from sneezing, runny nose, itchy/watery eyes, and itchy throat or nose.",
    prescriptionRequired: false,
    warnings: "Do not exceed one tablet daily. May cause mild dry mouth or drowsiness in exceptional cases.",
    barcode: "622600789012",
    genericAlternatives: ["med-6-alt"],
    expiryDate: "2028-08-31",
    batchNo: "B443-09",
    demandTrend: "Seasonal Increase",
    prices: {
      "pharm-1": 28.50,
      "pharm-2": 29.00,
      "pharm-3": 28.00,
      "pharm-4": 28.90
    },
    stock: {
      "pharm-1": 80,
      "pharm-2": 60,
      "pharm-3": 110,
      "pharm-4": 95
    }
  },
  {
    id: "med-7",
    name: "Solgar Vitamin C",
    genericName: "Ascorbic Acid",
    activeIngredient: "Vitamin C 1000mg",
    category: "Vitamins & Supplements",
    image: "images/solgar.png",
    dosage: "1000mg Capsule",
    description: "Premium dietary supplement supporting immune system health, skin vitality, and antioxidant cell protection.",
    prescriptionRequired: false,
    warnings: "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    barcode: "622700890123",
    genericAlternatives: ["med-7-alt"],
    expiryDate: "2029-01-31",
    batchNo: "B002-05",
    demandTrend: "Stable",
    prices: {
      "pharm-1": 180.00,
      "pharm-3": 175.00,
      "pharm-4": 178.00
    },
    stock: {
      "pharm-1": 25,
      "pharm-3": 35,
      "pharm-4": 12
    }
  }
];

const INITIAL_PHARMACIES = [
  {
    id: "pharm-1",
    name: "El Ezaby Pharmacy",
    address: "24 Tahrir St, Downtown, Cairo",
    phone: "+201023456789",
    rating: 4.8,
    reviews: 1240,
    deliveryFee: 15.00,
    deliveryTime: "30-45 mins",
    workingHours: "24 Hours, 7 Days a week",
    deliveryZones: "Downtown, Zamalek, Garden City, Dokki",
    status: "Active",
    licenseNo: "LIC-88290-EZE",
    joinedDate: "2025-01-15"
  },
  {
    id: "pharm-2",
    name: "Metro Pharmacy",
    address: "12 El-Batal Ahmed St, Mohandessin",
    phone: "+201198765432",
    rating: 4.6,
    reviews: 840,
    deliveryFee: 20.00,
    deliveryTime: "40-60 mins",
    workingHours: "8:00 AM - 2:00 AM",
    deliveryZones: "Mohandessin, Agouza, Imbaba",
    status: "Active",
    licenseNo: "LIC-11928-MET",
    joinedDate: "2025-03-10"
  },
  {
    id: "pharm-3",
    name: "Seif Pharmacy",
    address: "55 Korba St, Heliopolis, Cairo",
    phone: "+201245678912",
    rating: 4.7,
    reviews: 980,
    deliveryFee: 18.00,
    deliveryTime: "25-40 mins",
    workingHours: "24 Hours, 7 Days a week",
    deliveryZones: "Heliopolis, Nasr City, Sheraton",
    status: "Active",
    licenseNo: "LIC-44321-SEF",
    joinedDate: "2025-02-28"
  },
  {
    id: "pharm-4",
    name: "Dawaya Express",
    address: "Digital Hub Office, Maadi",
    phone: "+201555551212",
    rating: 4.9,
    reviews: 310,
    deliveryFee: 10.00,
    deliveryTime: "15-30 mins",
    workingHours: "9:00 AM - 12:00 AM",
    deliveryZones: "Maadi, Degla, Zahraa Maadi",
    status: "Active",
    licenseNo: "LIC-99388-DAW",
    joinedDate: "2025-04-01"
  }
];

const MOCK_TESTIMONIALS = [
  {
    name: "Dr. Sarah Mansour",
    role: "Clinical Pharmacist & Mother",
    text: "Dawaya transformed how I source medications for my family. The price comparison page showed me a 20% difference in chronic medication prices right in my neighborhood!",
    rating: 5,
    avatar: "👩‍⚕️"
  },
  {
    name: "Omar Khalifa",
    role: "Patient with Type 2 Diabetes",
    text: "The WhatsApp medication reminder feature is life-saving. I just set my schedule once, and I receive friendly alerts on my phone. Dawaya is an absolute necessity.",
    rating: 5,
    avatar: "👨"
  },
  {
    name: "Yasmine Aly",
    role: "Digital Marketing Specialist",
    text: "I uploaded my hand-written prescription, and within seconds the OCR scan recognized the medications, let me choose the cheapest pharmacy, and delivered them in 30 minutes. Incredible UX!",
    rating: 5,
    avatar: "👩"
  }
];

const MOCK_FAQS = [
  {
    question: "How does Dawaya compare medicine prices?",
    answer: "Dawaya integrates with licensed pharmacies in your immediate area. When you search for a medicine, we query their inventory databases in real-time to show you a side-by-side comparison of unit costs, delivery fees, and estimated delivery times."
  },
  {
    question: "Is a prescription required for all pharmacy orders?",
    answer: "No. Medicines categorized as OTC (Over-the-Counter) or Vitamins can be purchased instantly. Prescription-only medications (indicated by a red warning icon) require you to upload a valid photo or PDF prescription which the pharmacy verifies before processing."
  },
  {
    question: "How do WhatsApp medication reminders work?",
    answer: "After logging in, navigate to the Reminders dashboard, add your drugs, dosage, and schedules, and link your phone number. Our system automatically schedules automated notification pings directly to your WhatsApp account at the specified times."
  },
  {
    question: "How can my pharmacy register on Dawaya?",
    answer: "Click the 'Register Pharmacy' link in the navigation or footers, fill out your pharmacy details, upload your Ministry of Health Operating License, and submit. The Dawaya Admin team reviews all registration requests within 24 hours to approve or request updates."
  }
];

const MOCK_SUPPORT_TICKETS = [
  {
    id: "TCK-102",
    user: "Sherif Amer",
    email: "sherif.amer@gmail.com",
    subject: "Order delay on Dawaya Express",
    message: "My order was placed 45 minutes ago and is still marked as 'Packing'. Can you check with the delivery rider?",
    status: "Open",
    date: "2026-05-20 12:15"
  },
  {
    id: "TCK-101",
    user: "Amira Younes",
    email: "amira.y@yahoo.com",
    subject: "Unable to verify OCR results",
    message: "I uploaded my doctor's prescription note, but the OCR recognized a different tablet strength. How do I manually adjust it?",
    status: "Resolved",
    date: "2026-05-19 18:30"
  }
];

const MOCK_INITIAL_REMINDERS = [
  {
    id: "rem-1",
    name: "Glucophage 850mg",
    dosage: "1 tablet after breakfast",
    schedule: "08:30 AM",
    days: ["Daily"],
    status: "Active",
    history: [
      { date: "May 20, 2026", status: "Taken", time: "08:32 AM" },
      { date: "May 19, 2026", status: "Taken", time: "08:35 AM" },
      { date: "May 18, 2026", status: "Missed", time: "08:30 AM" }
    ]
  },
  {
    id: "rem-2",
    name: "Lipitor 10mg",
    dosage: "1 tablet at bedtime",
    schedule: "10:00 PM",
    days: ["Daily"],
    status: "Active",
    history: [
      { date: "May 19, 2026", status: "Taken", time: "10:05 PM" },
      { date: "May 18, 2026", status: "Taken", time: "10:01 PM" }
    ]
  }
];

const MOCK_INITIAL_ORDERS = [
  {
    id: "DWY-8840",
    date: "2026-05-20 11:30",
    pharmacyId: "pharm-1",
    pharmacyName: "El Ezaby Pharmacy",
    items: [
      { id: "med-1", name: "Panadol Extra", quantity: 2, price: 15.50 },
      { id: "med-6", name: "Claritin", quantity: 1, price: 28.50 }
    ],
    subtotal: 59.50,
    deliveryFee: 15.00,
    total: 74.50,
    paymentMethod: "Cash on Delivery",
    address: "Apartment 14, 5th Floor, 10 Zamalek Towers, Cairo",
    status: "Packing", // Tracking states: Placed -> Packing -> Dispatched -> Delivered
    patientName: "John Doe",
    patientPhone: "+201011122233"
  },
  {
    id: "DWY-7540",
    date: "2026-05-18 14:15",
    pharmacyId: "pharm-3",
    pharmacyName: "Seif Pharmacy",
    items: [
      { id: "med-7", name: "Solgar Vitamin C", quantity: 1, price: 175.00 }
    ],
    subtotal: 175.00,
    deliveryFee: 18.00,
    total: 193.00,
    paymentMethod: "Credit Card (Ending in 4829)",
    address: "Apartment 14, 5th Floor, 10 Zamalek Towers, Cairo",
    status: "Delivered",
    patientName: "John Doe",
    patientPhone: "+201011122233"
  }
];
