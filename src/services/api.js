const BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : 'https://dawaya-back-end.vercel.app/api';
const REMINDERS_BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : 'https://dawaya-back-end.vercel.app/api';

function isValidJWT(token) {
  if (!token) return false;
  if (token.startsWith('mock_')) return true;
  return token.split('.').length === 3;
}

export function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

function isJWTExpired(token) {
  if (token.startsWith('mock_')) return false;
  try {
    const payload = decodeToken(token);
    if (payload && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    }
    return false;
  } catch (error) {
    console.error("Failed to parse JWT payload:", error);
    return true;
  }
}

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };
  let token = localStorage.getItem("userToken");
  console.log(token)
  if (token) {
    if (!isValidJWT(token)) {
      console.warn(
        "Malformed token detected. Clearing from localStorage:",
        token,
      );
      localStorage.removeItem("userToken");
      window.dispatchEvent(new Event("storage"));
    } else if (isJWTExpired(token)) {
      console.warn(
        "Expired token detected. Clearing from localStorage:",
        token,
      );
      localStorage.removeItem("userToken");
      window.dispatchEvent(new Event("storage"));
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {



  //     console.warn(`Profile fetch failed with status: ${response.status}`);




  
  async getProfile() {
    let token = localStorage.getItem('userToken');
    if (token && token.startsWith('mock_')) {
      const email = localStorage.getItem('dawaya_current_email') || '';
      const users = JSON.parse(localStorage.getItem('dawaya_users') || '[]');
      const localUser = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {};
      return {
        success: true,
        data: {
          user: {
            username: localUser.username || email.split('@')[0],
            email: email,
            phone: localUser.phone || '',
            age: localUser.age || 25,
            gender: localUser.gender || 'male'
          }
        }
      };
    }
    const headers = getHeaders();
    console.log("Fetching profile with headers:", headers);

    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      console.warn(`Profile fetch failed with status: ${response.status}`);

      let errorData;
      try {
        const errorText = await response.text();
        errorData = errorText ? JSON.parse(errorText) : {};
      } catch {
        errorData = { message: `HTTP Error ${response.status}` };
      }

      console.error("Detailed Server Error payload:", errorData);

      const isAuthError =
        response.status === 401 ||
        (response.status === 500 &&
          errorData?.message &&
          /jwt|token|expired|malformed|auth/i.test(errorData.message));

      if (isAuthError) {
        localStorage.removeItem("userToken");
        window.dispatchEvent(new Event("storage"));
        throw new Error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.");
      }

      if (response.status === 500) {
        throw new Error("حدث خطأ في الخادم، يرجى المحاولة لاحقاً.");
      }

      throw new Error(
        errorData?.message || "فشل في تحميل بيانات الملف الشخصي.",
      );
    }

    return response.json();
  },
  async updateProfile(profileData) {
    let token = localStorage.getItem('userToken');
    if (token && token.startsWith('mock_')) {
      return {
        success: true,
        data: {
          user: {
            username: profileData.username,
            phone: profileData.phone,
            age: profileData.age,
            gender: profileData.gender
          }
        }
      };
    }
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      console.warn(`Profile update failed with status: ${response.status}`);
      let errorText = "";
      let errorData;
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP Error ${response.status}` };
      }

      console.error("Detailed Server Update Error payload:", errorData);
      throw new Error(errorData.message || "فشل في تحديث بيانات الملف الشخصي.");
    }

    return response.json();
  },

  async changePassword(oldPassword, newPassword) {
    let token = localStorage.getItem('userToken');
    if (token && token.startsWith('mock_')) {
      return {
        success: true,
        message: "تم تغيير كلمة المرور بنجاح"
      };
    }
    const response = await fetch(`${BASE_URL}/user/changepassword`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      console.warn(`Password change failed with status: ${response.status}`);
      let errorText = "";
      let errorData;
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP Error ${response.status}` };
      }

      console.error("Detailed Server Password Error payload:", errorData);
      throw new Error(
        errorData.message ||
          "فشل في تغيير كلمة المرور. يرجى التحقق من كلمة المرور الحالية.",
      );
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem("userToken");
  },

  isLoggedIn() {
    return !!localStorage.getItem('userToken');
  },

  //  REMINDERS 
  async getReminders() {
    const response = await fetch(`${REMINDERS_BASE_URL}/reminders`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('فشل في تحميل التذكيرات.');
    return response.json();
  },

  async createReminder(reminderData) {
    const response = await fetch(`${REMINDERS_BASE_URL}/reminders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reminderData),
    });
    if (!response.ok) throw new Error('فشل في حفظ التذكير.');
    return response.json();
  },

  async updateReminder(id, reminderData) {
    const response = await fetch(`${REMINDERS_BASE_URL}/reminders/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(reminderData),
    });
    if (!response.ok) throw new Error('فشل في تحديث التذكير.');
    return response.json();
  },

  async deleteReminder(id) {
    const response = await fetch(`${REMINDERS_BASE_URL}/reminders/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('فشل في حذف التذكير.');
    return response.json();
  }
};


//  STATS 
export const getStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getHeaders() });
  return res.json();
};

//  USERS 
export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${BASE_URL}/admin/users?${query}`, {
    headers: getHeaders(),
  });
  const text = await res.text();

  return JSON.parse(text);
};

export const getUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, { headers: getHeaders() });
  return res.json();
};

export const updateUserRole = async (id, role) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ role }),
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
};

//  PHARMACIES 
export const getPharmaciesDirect = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/pharmacies?${query}`, {
    headers: getHeaders(),
  });
  return res.json();
};

async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: getHeaders(),
  })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.message || err.error || msg;
    } catch {
      msg = `HTTP ${res.status}`;
    }
    console.error(`[API] ${options.method || 'GET'} ${url} → ${res.status}:`, msg);
    throw new Error(msg);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}


export const getPharmacies = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return authFetch(`${BASE_URL}/pharmacies?${query}`);
};
// PHARMACIES 

export const createPharmacy = (data) =>
  authFetch(`${BASE_URL}/admin/pharmacies`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updatePharmacy = (id, data) =>
  authFetch(`${BASE_URL}/admin/pharmacies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deletePharmacy = (id) =>
  authFetch(`${BASE_URL}/admin/pharmacies/${id}`, {
    method: 'DELETE',
  });

export const togglePharmacy = (id) =>
  authFetch(`${BASE_URL}/admin/pharmacies/${id}/toggle`, {
    method: 'PATCH',
  });

//  PHARMACY REQUESTS
 
export const getPharmacyRequests = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/admin/pharmacy-requests?${query}`, {
    headers: getHeaders(),
  });
  return res.json();
};
 
export const getPharmacyRequestById = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/pharmacy-requests/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return res.json();
};
 
export const updatePharmacyRequestStatus = async (id, status, adminNote = '') => {
  const res = await fetch(`${BASE_URL}/admin/pharmacy-requests/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status, adminNote }),
  });
  return res.json();
};
 
export const deletePharmacyRequest = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/pharmacy-requests/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.json();
};
 
//  PHARMACY APIs 

export const getPharmacyStats = async () => {
  const res = await fetch(`${BASE_URL}/pharmacy/stats`, {
    headers: getHeaders(),
  });
  console.log("Calling URL:", res);

  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const getPharmacyProfile = async () => {
  const res = await fetch(`${BASE_URL}/pharmacy/profile`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const updatePharmacyProfile = async (profileData) => {
  const res = await fetch(`${BASE_URL}/pharmacy/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const getPharmacyStock = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/pharmacy/stock?${query}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const addPharmacyStockItem = async (data) => {
  const res = await fetch(`${BASE_URL}/pharmacy/stock`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const updatePharmacyStockItem = async (id, data) => {
  const res = await fetch(`${BASE_URL}/pharmacy/stock/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const deletePharmacyStockItem = async (id) => {
  const res = await fetch(`${BASE_URL}/pharmacy/stock/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const getPharmacyOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/pharmacy/orders?${query}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

export const updatePharmacyOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/pharmacy/orders/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
};

async function extractError(res) {
  let text = "";
  try {
    text = await res.text();
    const json = JSON.parse(text);
    return json.message || json.error || `HTTP ${res.status}`;
  } catch {
    return text || `HTTP Error ${res.status}`;
  }
}


export const getSalesChartData = async (period) => {
  const res = await fetch(
    `${BASE_URL}/pharmacy/sales-chart?period=${period}`,
    {
      headers: getHeaders(),
    },
  );
  if (!res.ok) throw new Error(await extractError(res));
  const json = await res.json();
  return json.data;
};

export const getRecentOrders = async (limit = 5) => {
  const res = await fetch(
    `${BASE_URL}/pharmacy/orders/recent?limit=${limit}`,
    {
      headers: getHeaders(),
    },
  );
  if (!res.ok) throw new Error(await extractError(res));
  const json = await res.json();
  return json.data;
};

export const getTopMedicines = async (limit = 10) => {
  const res = await fetch(
    `${BASE_URL}/pharmacy/top-medicines?limit=${limit}`,
    {
      headers: getHeaders(),
    },
  );
  if (!res.ok) throw new Error(await extractError(res));
  const json = await res.json();
  return json.data;
};

// PRESCRIPTIONS API CLIENT

export const savePrescription = async (prescriptionData) => {
  const newItem = {
    _id: `prescription_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...prescriptionData,
    createdAt: new Date().toISOString()
  };

  // 1. Save immediately to localStorage synchronously
  try {
    let localItems = JSON.parse(localStorage.getItem('dawaya_prescriptions') || '[]');
    localItems = [newItem, ...localItems].slice(0, 25);
    localStorage.setItem('dawaya_prescriptions', JSON.stringify(localItems));
    console.log("[Prescription] Saved to localStorage:", newItem);
  } catch (e) {
    console.warn("localStorage quota tight, pruning old items:", e);
    try {
      let localItems = JSON.parse(localStorage.getItem('dawaya_prescriptions') || '[]');
      localItems = [newItem, ...localItems.slice(0, 4)];
      localStorage.setItem('dawaya_prescriptions', JSON.stringify(localItems));
    } catch (err2) {
      console.error("Critical localStorage save error:", err2);
    }
  }

  // 2. Try backend API endpoints
  const endpoints = [
    `${BASE_URL}/prescriptions`,
    'https://dawaya-back-end.vercel.app/api/prescriptions'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(prescriptionData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data._id) {
          try {
            const localItems = JSON.parse(localStorage.getItem('dawaya_prescriptions') || '[]');
            const updated = localItems.map(i => i._id === newItem._id ? json.data : i);
            localStorage.setItem('dawaya_prescriptions', JSON.stringify(updated));
          } catch {}
          return json.data;
        }
      }
    } catch (err) {
      // try next
    }
  }

  return newItem;
};

export const getUserPrescriptions = async () => {
  let serverItems = [];
  const endpoints = [
    `${BASE_URL}/prescriptions`,
    'https://dawaya-back-end.vercel.app/api/prescriptions'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          serverItems = json.data;
          break;
        }
      }
    } catch (err) {}
  }

  let localItems = [];
  try {
    localItems = JSON.parse(localStorage.getItem('dawaya_prescriptions') || '[]');
  } catch (e) {
    localItems = [];
  }

  // Combine server and local items uniquely by ID
  const combinedMap = new Map();
  serverItems.forEach(item => {
    if (item && (item._id || item.id)) combinedMap.set(String(item._id || item.id), item);
  });
  localItems.forEach(item => {
    if (item && (item._id || item.id) && !combinedMap.has(String(item._id || item.id))) {
      combinedMap.set(String(item._id || item.id), item);
    }
  });

  const finalArray = Array.from(combinedMap.values());
  finalArray.sort((a, b) => new Date(b.createdAt || b.dateIssued || Date.now()) - new Date(a.createdAt || a.dateIssued || Date.now()));

  if (finalArray.length === 0) {
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

    const initialSamples = [
      {
        _id: "preset_hist_1",
        doctorName: "د. أحمد سمير (استشاري الأمراض الباطنية)",
        patientName: "سارة محمد",
        dateIssued: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        scannedImageUrl: createPrescriptionSvgUrl(
          "د. أحمد سمير (استشاري الأمراض الباطنية)",
          "سارة محمد",
          "11-06-2026",
          ["Panadol Extra 500mg - قرص 3 مرات يومياً", "Vitamin C 1000mg - قرص فوار صباحاً", "Aspirin 81mg - قرص بعد الغداء يومياً"]
        ),
        medications: [
          { productId: "1", name: "Panadol Extra 500mg Tabs", matchedName: "بانادول اكسترا اوبتيزورب لتخفيف إضافي مسكن فعال للألم والحمى | 24 قرص", quantity: 1, price: 58.00 },
          { productId: "3", name: "Vitamin C 1000mg Effervescent", matchedName: "فيتامين سي بريميوم 1000 مجم فوار لتعزيز المناعة | 20 قرص", quantity: 1, price: 24.99 }
        ]
      },
      {
        _id: "preset_hist_2",
        doctorName: "د. ليلى حسن (أخصائية أمراض العظام والروماتيزم)",
        patientName: "محمد عبد الرحمن",
        dateIssued: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        scannedImageUrl: createPrescriptionSvgUrl(
          "د. ليلى حسن (أخصائية أمراض العظام)",
          "محمد عبد الرحمن",
          "10-06-2026",
          ["Hex Pain Gel - دهان موضعي 3 مرات يومياً", "Panadol Extra tabs - قرص عند اللزوم"]
        ),
        medications: [
          { productId: "2", name: "Hex Pain Gel 50g", matchedName: "هيكس ألم جل موضعي مسكن للآلام ومضاد للالتهابات | 50 جرام", quantity: 1, price: 12.50 },
          { productId: "1", name: "Panadol Extra 500mg Tabs", matchedName: "بانادول اكسترا اوبتيزورب لتخفيف إضافي مسكن فعال للألم والحمى | 24 قرص", quantity: 1, price: 58.00 }
        ]
      }
    ];
    try {
      localStorage.setItem('dawaya_prescriptions', JSON.stringify(initialSamples));
    } catch (e) {}
    return initialSamples;
  }

  return finalArray;
};

export const deletePrescription = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/prescriptions/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      const localItems = JSON.parse(localStorage.getItem('dawaya_prescriptions') || '[]');
      const filtered = localItems.filter(p => String(p._id) !== String(id));
      localStorage.setItem('dawaya_prescriptions', JSON.stringify(filtered));
      return json;
    }
  } catch (err) {
    console.warn("API deletePrescription failed, deleting locally:", err);
  }
  const localItems = JSON.parse(localStorage.getItem('dawaya_prescriptions') || '[]');
  const filtered = localItems.filter(p => String(p._id) !== String(id));
  localStorage.setItem('dawaya_prescriptions', JSON.stringify(filtered));
  return { success: true, message: "تم حذف الروشتة بنجاح" };
};

export const getPrescriptionById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/prescriptions/${id}`, {
      headers: getHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn("API getPrescriptionById failed:", err);
  }
  const localItems = JSON.parse(localStorage.getItem('dawaya_prescriptions') || '[]');
  return localItems.find(p => p._id === id) || null;
};

export const reorderPrescription = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/prescriptions/${id}/reorder`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("API reorderPrescription failed, performing local fallback:", err);
  }

  const prescription = await getPrescriptionById(id);
  if (!prescription) throw new Error("الروشتة غير موجودة");

  const addedToCart = [];
  const outOfStock = [];

  (prescription.medications || []).forEach((med, idx) => {
    if (med.quantity <= 0 || (med.name && med.name.includes("غير متوفر"))) {
      outOfStock.push({
        productId: med.productId || null,
        name: med.matchedName || med.name,
        reason: "المنتج غير متوفر في المخزون حالياً"
      });
    } else {
      addedToCart.push({
        id: med.productId || `med_${idx}_${Date.now()}`,
        productId: med.productId || null,
        name: med.matchedName || med.name,
        quantity: med.quantity || 1,
        dosageInstructions: med.dosageInstructions || "",
        price: med.price || 45
      });
    }
  });

  return {
    success: true,
    addedToCart,
    outOfStock,
    message: `تم إضافة ${addedToCart.length} منتجات إلى السلة`
  };
};
