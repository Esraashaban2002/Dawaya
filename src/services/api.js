const BASE_URL = 'https://dawaya-back-end.vercel.app';

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

    const response = await fetch(`${BASE_URL}/api/user/profile`, {
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
    const bodyToSend = {
      username: profileData.username,
      phone: String(profileData.phone),
      gender: profileData.gender
    };
    if (profileData.age !== undefined && profileData.age !== null && profileData.age !== '') {
      bodyToSend.age = Number(profileData.age);
    }

    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bodyToSend),
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
    const response = await fetch(`${BASE_URL}/api/user/changepassword`, {
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
  }
};
