const BASE_URL = "https://dawaya-back-end.vercel.app/api";

function isValidJWT(token) {
  if (!token) return false;
  return token.split(".").length === 3;
}

function isJWTExpired(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    if (payload && typeof payload.exp === "number") {
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
      token = null;
    } else if (isJWTExpired(token)) {
      console.warn(
        "Expired token detected. Clearing from localStorage:",
        token,
      );
      localStorage.removeItem("userToken");
      window.dispatchEvent(new Event("storage"));
      token = null;
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {
  
  async getProfile() {
    const headers = getHeaders();
    console.log("Fetching profile with headers:", headers);

    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: "GET",
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

      // Generic 500 fallback
      if (response.status === 500) {
        throw new Error("حدث خطأ في الخادم، يرجى المحاولة لاحقاً.");
      }

      throw new Error(
        errorData?.message || "فشل في تحميل بيانات الملف الشخصي.",
      );
    }

    return response.json();
  },
  // Update Profile
  async updateProfile(profileData) {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(bodyToSend),
    });

    if (!response.ok) {
      console.warn(`Profile update failed with status: ${response.status}`);
      let errorText = "";
      let errorData = {};
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP Error ${response.status}` };
      }

      console.error("Detailed Server Update Error payload:", errorData);
      throw new Error(errorData.message || "فشل في تحديث بيانات الملف الشخصي.");
    }

    return response.json();
  },

  // Change Password
  async changePassword(oldPassword, newPassword) {
    const response = await fetch(`${BASE_URL}/user/changepassword`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      console.warn(`Password change failed with status: ${response.status}`);
      let errorText = "";
      let errorData = {};
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch (e) {
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

  // Logout
  logout() {
    localStorage.removeItem("userToken");
  },

  isLoggedIn() {
    return !!localStorage.getItem("userToken");
  },
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

  const res = await fetch(`${BASE_URL}/admin/users?${query}`, {
    headers: getHeaders(),
  });
  const text = await res.text();

  return JSON.parse(text);
};

export const getUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    headers: getHeaders(),
  });
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

// ─── PHARMACIES ───
export const getPharmacies = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/pharmacies?${query}`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const createPharmacy = async (data) => {
  const res = await fetch(`${BASE_URL}/admin/pharmacies`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePharmacy = async (id, data) => {
  const res = await fetch(`${BASE_URL}/admin/pharmacies/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePharmacy = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/pharmacies/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
};

export const togglePharmacy = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/pharmacies/${id}/toggle`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return res.json();
};

// ─── ORDERS ───
export const getOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/admin/orders?${query}`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
};

// ---------------------- PHARMACY APIs ----------------------

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
