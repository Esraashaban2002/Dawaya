const BASE_URL = 'https://dawaya-back-end.vercel.app/api';
const REMINDERS_BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : 'https://dawaya-back-end.vercel.app/api';

// Helper to check if a token is a valid JWT format
function isValidJWT(token) {
  if (!token) return false;
  return token.split('.').length === 3;
}

// Helper to check if JWT token is expired
function isJWTExpired(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (payload && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    }
    return false;
  } catch (error) {
    console.error('Failed to parse JWT payload:', error);
    return true;
  }
}

// Helper to get auth headers
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  let token = localStorage.getItem('userToken');
  if (token) {
    if (!isValidJWT(token)) {
      console.warn('Malformed token detected. Clearing from localStorage:', token);
      localStorage.removeItem('userToken');
      window.dispatchEvent(new Event('storage'));
      token = null;
    } else if (isJWTExpired(token)) {
      console.warn('Expired token detected. Clearing from localStorage:', token);
      localStorage.removeItem('userToken');
      window.dispatchEvent(new Event('storage'));
      token = null;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {

  // Get Profile
  // async getProfile() {
  //   const headers = getHeaders();
  //   console.log('Fetching profile with headers:', headers);

  //   const response = await fetch(`${BASE_URL}/api/user/profile`, {
  //     method: 'GET',
  //     headers: headers,
  //   });

  //   if (!response.ok) {
  //     console.warn(`Profile fetch failed with status: ${response.status}`);
  //     let errorText = '';
  //     let errorData = {};
  //     try {
  //       errorText = await response.text();
  //       errorData = JSON.parse(errorText);
  //     } catch (e) {
  //       errorData = { message: errorText || `HTTP Error ${response.status}` };
  //     }

  //     console.error('Detailed Server Error payload:', errorData);

  //     const isAuthError = response.status === 401 || 
  //       (response.status === 500 && errorData.message && /jwt|token|expired|malformed|auth/i.test(errorData.message));

  //     if (isAuthError) {
  //       localStorage.removeItem('userToken');
  //       window.dispatchEvent(new Event('storage')); // Trigger session reload/logout
  //       throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.');
  //     }
  //     throw new Error(errorData.message || 'فشل في تحميل بيانات الملف الشخصي من الخادم السحابي.');
  //   }
  //   console.log(response);

  //   return response.json();
  // },
  // Get Profile
  async getProfile() {
    const headers = getHeaders();
    console.log('Fetching profile with headers:', headers);

    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      console.warn(`Profile fetch failed with status: ${response.status}`);

      let errorData = {};
      try {
        const errorText = await response.text();
        errorData = errorText ? JSON.parse(errorText) : {};
      } catch (e) {
        errorData = { message: `HTTP Error ${response.status}` };
      }

      console.error('Detailed Server Error payload:', errorData);

      // Handle auth errors (401) OR backend crash (500) with token-related message
      const isAuthError =
        response.status === 401 ||
        (response.status === 500 &&
          errorData?.message &&
          /jwt|token|expired|malformed|auth/i.test(errorData.message));

      if (isAuthError) {
        localStorage.removeItem('userToken');
        window.dispatchEvent(new Event('storage'));
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.');
      }

      // Generic 500 fallback
      if (response.status === 500) {
        throw new Error('حدث خطأ في الخادم، يرجى المحاولة لاحقاً.');
      }

      throw new Error(errorData?.message || 'فشل في تحميل بيانات الملف الشخصي.');
    }

    return response.json();
  },
  // Update Profile
  async updateProfile(profileData) {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      console.warn(`Profile update failed with status: ${response.status}`);
      let errorText = '';
      let errorData = {};
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP Error ${response.status}` };
      }

      console.error('Detailed Server Update Error payload:', errorData);
      throw new Error(errorData.message || 'فشل في تحديث بيانات الملف الشخصي.');
    }

    return response.json();
  },

  // Change Password
  async changePassword(oldPassword, newPassword) {
    const response = await fetch(`${BASE_URL}/user/changepassword`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      console.warn(`Password change failed with status: ${response.status}`);
      let errorText = '';
      let errorData = {};
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP Error ${response.status}` };
      }

      console.error('Detailed Server Password Error payload:', errorData);
      throw new Error(errorData.message || 'فشل في تغيير كلمة المرور. يرجى التحقق من كلمة المرور الحالية.');
    }

    return response.json();
  },

  // Logout
  logout() {
    localStorage.removeItem('userToken');
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('userToken');
  },

  // ─── REMINDERS ───
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

//  Adman Dashoard

// ─── STATS ───
export const getStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getHeaders() });
  return res.json();
};

// ─── USERS ───
export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${BASE_URL}/admin/users?${query}`,
    { headers: getHeaders() }
  );
  const text = await res.text();

  return JSON.parse(text);
};

export const getUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, { headers: getHeaders() });
  return res.json();
};

export const updateUserRole = async (id, role) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ role })
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};



async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: getHeaders(),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.message || err.error || msg;
    } catch (_) { }
    console.error(`[API] ${options.method || 'GET'} ${url} → ${res.status}:`, msg);
    throw new Error(msg);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ─── PHARMACIES ───────────────────────────────────────

// ✅ صحّحنا المسار: /admin/pharmacies بدل /pharmacies
export const getPharmacies = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return authFetch(`${BASE_URL}/pharmacies?${query}`);
};

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

// ─── ORDERS ───────────────────────────────────────────

export const getOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/admin/orders?${query}`, { headers: getHeaders() });
  return res.json();
};

export const updateOrderStatus = (id, status) =>
  authFetch(`${BASE_URL}/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
