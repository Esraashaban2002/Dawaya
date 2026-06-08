const BASE_URL = 'https://dawaya-back-end.vercel.app';

// Helper to get auth headers
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('userToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {

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
      let errorText = '';
      let errorData = {};
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP Error ${response.status}` };
      }
      
      console.error('Detailed Server Error payload:', errorData);

      if (response.status === 401) {
        localStorage.removeItem('userToken');
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.');
      }
      throw new Error(errorData.message || 'فشل في تحميل بيانات الملف الشخصي من الخادم السحابي.');
    }
  console.log(response);
  

    return response.json();
  },

  // Update Profile
  async updateProfile(profileData) {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        username: profileData.username,
        phone: String(profileData.phone),
        age: Number(profileData.age),
        gender: profileData.gender
      }),
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

//  Adman Dashoard

// ─── USERS ───
export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${BASE_URL}/api/admin/users?${query}`,
    { headers: getHeaders() }
  );
  const text = await res.text();

  return JSON.parse(text);
};

export const getUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, { headers: getHeaders()});
  return res.json();
};

export const updateUserRole = async (id, role) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}/role`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ role })
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};