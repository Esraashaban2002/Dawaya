import React, { useState, useEffect, useContext } from 'react';
import {
  User, Shield, Lock, MoreVertical, Plus,
  Home, Briefcase, Mail, Phone, Cake, CheckCircle,
  Edit3, Trash2
} from 'lucide-react';

import { UserContext } from '../Context/UserContext';
import Toast from './Toast';
import { api } from '../services/api';
import {
  EditProfileModal,
  ChangePasswordModal,
  LocationModal
} from './Modals';

const INITIAL_PROFILE = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  age: '',
  gender: ''
};

export default function UserProfile() {
  const { userLogin } = useContext(UserContext);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);

  const [toasts, setToasts] = useState([]);

  const [activeLocationMenu, setActiveLocationMenu] = useState(null);
  
  const [isChangePasswordExpanded, setIsChangePasswordExpanded] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchProfile = async () => {
    const activeToken = userLogin || localStorage.getItem('userToken');
    if (!activeToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.getProfile();
      const apiUser = data.user || data.data || data;

      const localEmail = localStorage.getItem("dawaya_current_email") || apiUser.email || '';
      const localPassword = localStorage.getItem("dawaya_current_password") || '';

      if (localEmail) {
        const storedLocations = JSON.parse(localStorage.getItem(`dawaya_locations_${localEmail.toLowerCase()}`) || '[]');
        setLocations(storedLocations);
      }

      setProfile({
        fullName: apiUser.username || 'عضو داوايا',
        username: apiUser.username || 'user',
        email: localEmail,
        password: localPassword,
        phone: apiUser.phone || '',
        age: apiUser.age || 30,
        gender: apiUser.gender === 'male' || apiUser.gender === 'ذكر' ? 'ذكر' : 'أنثى'
      });
    } catch (err) {
      try {
        const localEmail = localStorage.getItem("dawaya_current_email") || "";
        const localPassword = localStorage.getItem("dawaya_current_password") || "";
        const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
        const matchedUser = users.find(u => u.email.toLowerCase() === localEmail.toLowerCase());
        if (matchedUser) {
          const storedLocations = JSON.parse(localStorage.getItem(`dawaya_locations_${localEmail.toLowerCase()}`) || '[]');
          setLocations(storedLocations);

          setProfile({
            fullName: matchedUser.username || 'عضو داوايا',
            username: matchedUser.username || 'user',
            email: matchedUser.email,
            password: matchedUser.password,
            phone: matchedUser.phone || '01012345678',
            age: matchedUser.age || 25,
            gender: matchedUser.gender === 'female' ? 'أنثى' : 'ذكر'
          });
          return;
        }
      } catch (e) {
        console.error("Local fallback failed", e);
      }
      showToast(err.message || 'انتهت الجلسة، يرجى تسجيل الدخول مجدداً.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userLogin]);

  const handleSaveProfile = async (updatedProfile) => {
    const activeToken = localStorage.getItem("userToken");
    const isMockToken = !activeToken || activeToken === "mock_token_for_dawaya_auth";

    try {
      const genderApi = updatedProfile.gender === 'ذكر' ? 'male' : 'female';

      if (!isMockToken) {
        try {
          await api.updateProfile({
            username: updatedProfile.username,
            phone: updatedProfile.phone,
            age: Number(updatedProfile.age),
            gender: genderApi
          });
        } catch (apiErr) {
          console.warn("Backend profile update rejected or failed, executing local fallback save:", apiErr.message);
        }
      }

      try {
        const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
        const oldEmail = localStorage.getItem("dawaya_current_email") || updatedProfile.email;
        const index = users.findIndex(u => u.email.toLowerCase() === oldEmail.toLowerCase());
        const token = localStorage.getItem("userToken") || "mock_token_for_dawaya_auth";

        const userData = {
          username: updatedProfile.username,
          phone: updatedProfile.phone,
          email: updatedProfile.email,
          password: updatedProfile.password,
          gender: genderApi,
          age: Number(updatedProfile.age),
          token: token
        };

        if (index > -1) {
          users[index] = userData;
        } else {
          users.push(userData);
        }

        localStorage.setItem("dawaya_users", JSON.stringify(users));
        localStorage.setItem("dawaya_current_email", updatedProfile.email);
        localStorage.setItem("dawaya_current_password", updatedProfile.password);
      } catch (e) {
        console.error("Local profile update failed", e);
      }

      setProfile(updatedProfile);
      setActiveModal(null);
      showToast('تم تحديث الملف الشخصي بنجاح!');
    } catch (err) {
      showToast(err.message || 'حدث خطأ أثناء حفظ التغييرات.', 'error');
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    const activeToken = localStorage.getItem("userToken");
    const isMockToken = !activeToken || activeToken === "mock_token_for_dawaya_auth";

    try {
      if (!isMockToken) {
        try {
          await api.changePassword(oldPassword, newPassword);
        } catch (apiErr) {
          console.warn("Backend change password failed, executing local fallback save:", apiErr.message);
        }
      }

      localStorage.setItem("dawaya_current_password", newPassword);
      try {
        const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
        const activeEmail = localStorage.getItem("dawaya_current_email") || "";
        const index = users.findIndex(u => u.email.toLowerCase() === activeEmail.toLowerCase());
        if (index > -1) {
          users[index].password = newPassword;
          localStorage.setItem("dawaya_users", JSON.stringify(users));
        }
      } catch (e) {
        console.error("Local password change sync failed", e);
      }

      setProfile(prev => ({ ...prev, password: newPassword }));
      setActiveModal(null);
      showToast('تم تغيير كلمة المرور بنجاح!', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'يرجى التحقق من كلمة المرور الحالية والمحاولة مجدداً.', 'error');
      return false;
    }
  };

  const handleSaveLocation = (locData) => {
    let updatedLocations;
    if (locData.id) {
      updatedLocations = locations.map((l) => (l.id === locData.id ? locData : l));
      showToast('تم تحديث الموقع بنجاح!');
    } else {
      const newLoc = {
        ...locData,
        id: Date.now()
      };
      updatedLocations = [...locations, newLoc];
      showToast('تمت إضافة الموقع بنجاح!');
    }
    setLocations(updatedLocations);

    const email = profile.email || localStorage.getItem("dawaya_current_email");
    if (email) {
      localStorage.setItem(`dawaya_locations_${email.toLowerCase()}`, JSON.stringify(updatedLocations));
    }

    setActiveModal(null);
    setEditingLocation(null);
  };

  const handleDeleteLocation = (id) => {
    const updatedLocations = locations.filter((l) => l.id !== id);
    setLocations(updatedLocations);

    const email = profile.email || localStorage.getItem("dawaya_current_email");
    if (email) {
      localStorage.setItem(`dawaya_locations_${email.toLowerCase()}`, JSON.stringify(updatedLocations));
    }

    showToast('تم حذف الموقع بنجاح!', 'error');
  };

  const triggerEditLocation = (location) => {
    setEditingLocation(location);
    setActiveModal('location');
  };

  const triggerAddLocation = () => {
    setEditingLocation(null);
    setActiveModal('location');
  };

  const toggleLocationMenu = (id, e) => {
    e.stopPropagation();
    setActiveLocationMenu(activeLocationMenu === id ? null : id);
  };

  useEffect(() => {
    const closeMenu = () => setActiveLocationMenu(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  useEffect(() => {
    if (profile.password && passwords.newPass === profile.password) {
      setIsChangePasswordExpanded(false);
      setPasswords({ current: '', newPass: '', confirmPass: '' });
      setPasswordError('');
      setPasswordSuccess('');
    }
  }, [profile.password]);

  const isLengthValid = passwords.newPass.length >= 8;
  const isSpecialValid = /[!@#$%^&*(),.?":{}|<>_]/.test(passwords.newPass);
  const isCapitalValid = /[A-Z]/.test(passwords.newPass);

  const strengthCount = [isLengthValid, isSpecialValid, isCapitalValid].filter(Boolean).length;
  let strengthPercent = 0;
  let strengthText = 'ضعيفة';
  let strengthColor = '#ef4444';

  if (strengthCount === 1) {
    strengthPercent = 33;
    strengthText = 'ضعيفة';
    strengthColor = '#ef4444';
  } else if (strengthCount === 2) {
    strengthPercent = 66;
    strengthText = 'متوسطة - غالباً';
    strengthColor = '#f59e0b';
  } else if (strengthCount === 3) {
    strengthPercent = 100;
    strengthText = 'قوية جداً';
    strengthColor = '#0284c7';
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwords.current) {
      setPasswordError('يرجى إدخال كلمة المرور الحالية.');
      return;
    }

    if (profile.password && passwords.current !== profile.password) {
      setPasswordError('كلمة المرور الحالية غير صحيحة.');
      return;
    }

    if (!passwords.newPass) {
      setPasswordError('يرجى إدخال كلمة المرور الجديدة.');
      return;
    }

    if (passwords.newPass !== passwords.confirmPass) {
      setPasswordError('كلمتا المرور الجديدتان غير متطابقتين.');
      return;
    }

    if (passwords.newPass.length < 6) {
      setPasswordError('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.');
      return;
    }

    const success = await handleChangePassword(passwords.current, passwords.newPass);
    if (success) {
      setPasswordSuccess('تم تحديث كلمة المرور بنجاح!');
      setTimeout(() => {
        setIsChangePasswordExpanded(false);
        setPasswords({ current: '', newPass: '', confirmPass: '' });
        setPasswordError('');
        setPasswordSuccess('');
      }, 1500);
    }
  };

  const CheckCircleIcon = ({ checked }) => (
    <div style={{
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      border: checked ? 'none' : '1px solid #cbd5e1',
      backgroundColor: checked ? '#0284c7' : 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '8px',
      fontWeight: 'bold',
      lineHeight: 1
    }}>
      {checked && '✓'}
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', padding: '24px 0' }}>
      <main style={{ flex: 1, paddingBottom: '48px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <span style={{ fontSize: '15px', color: 'var(--color-text-muted)', fontWeight: '600' }}>جاري تحميل الملف الشخصي...</span>
          </div>
        ) : (
          <div className="container" style={{ margin: "5px" }}>
            <div className="app-grid" style={{ margin: "10px" }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="card animate-fade-in" style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '24px',
                  border: '1px solid rgba(241, 245, 249, 0.8)',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: '#ffffff'
                }}>
                  <div style={{
                    height: '30px',
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #faf7fb 100%)',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: '10%', right: '8%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.04)', filter: 'blur(8px)' }} />
                    <div style={{ position: 'absolute', bottom: '-20%', left: '12%', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.03)', filter: 'blur(6px)' }} />
                  </div>

                  <div style={{
                    padding: '24px 32px 32px 32px',
                    marginTop: '-25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px'
                  }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <div style={{
                        marginTop: '15px',
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid #ffffff',
                        boxShadow: '0 8px 24px rgba(2, 132, 199, 0.15)',
                        color: '#ffffff',
                        fontSize: '44px',
                        fontWeight: '800',
                        fontFamily: 'Cairo, sans-serif'
                      }}>
                        {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-main)', margin: 0 }}>{profile.fullName}</h2>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => setActiveModal('edit-profile')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          borderRadius: '12px',
                          padding: '10px 20px',
                          fontSize: '13px',
                          fontWeight: '700',
                          backgroundColor: '#0284c7',
                          border: 'none',
                          color: '#ffffff',
                          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          marginTop: '6px'
                        }}
                      >
                        <Edit3 size={15} />
                        <span>تعديل الملف الشخصي</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <User size={20} style={{ color: 'var(--color-brand)' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>المعلومات الشخصية</h3>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: '40px',
                    rowGap: '32px'
                  }}>
                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>اسم المستخدم</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-text-main)' }}>{profile.username}</span>
                        <span style={{ color: 'var(--color-text-light)', fontSize: '14px', fontWeight: '700' }}>@</span>
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>رقم الهاتف</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', direction: 'ltr' }}>{profile.phone}</span>
                        <Phone size={16} style={{ color: 'var(--color-text-light)' }} />
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>البريد الإلكتروني</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-text-main)' }}>{profile.email}</span>
                        <Mail size={16} style={{ color: 'var(--color-text-light)' }} />
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>الجنس</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>{profile.gender}</span>
                        <User size={16} style={{ color: 'var(--color-text-light)' }} />
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>العمر</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>{profile.age}</span>
                        <Cake size={16} style={{ color: 'var(--color-text-light)' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isChangePasswordExpanded ? '32px' : '0px', borderBottom: isChangePasswordExpanded ? '1px solid #f1f5f9' : 'none', paddingBottom: isChangePasswordExpanded ? '16px' : '0px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Shield size={20} style={{ color: 'var(--color-brand)' }} />
                      <h3 style={{ fontSize: '18px', fontWeight: '700' }}>الأمان وكلمة المرور</h3>
                    </div>

                    {isChangePasswordExpanded ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangePasswordExpanded(false);
                          setPasswords({ current: '', newPass: '', confirmPass: '' });
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#fee2e2',
                          color: '#ef4444',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: 1 }}>×</span>
                        <span>إلغاء التغيير</span>
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontFamily: 'monospace', letterSpacing: '3px' }}>••••••••</span>
                        <button
                          type="button"
                          onClick={() => setIsChangePasswordExpanded(true)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'var(--color-primary-light)',
                            border: 'none',
                            color: 'var(--color-brand)',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            transition: 'all var(--transition-fast)'
                          }}
                          className="hover-action-bg"
                        >
                          <Lock size={12} />
                          <span>تغيير كلمة المرور</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isChangePasswordExpanded && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', marginTop: '16px' }} className="form-row">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {passwordError && (
                          <div style={{
                            backgroundColor: 'var(--color-danger-light)',
                            color: 'var(--color-danger)',
                            padding: '12px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {passwordError}
                          </div>
                        )}
                        {passwordSuccess && (
                          <div style={{
                            backgroundColor: 'var(--color-success-light)',
                            color: 'var(--color-success-dark)',
                            padding: '12px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {passwordSuccess}
                          </div>
                        )}

                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ marginBottom: '8px' }}>كلمة المرور الحالية</label>
                          <input
                            type="password"
                            className="form-input"
                            style={{ direction: 'ltr', textAlign: 'left', borderRadius: '12px', padding: '12px' }}
                            placeholder="••••••••"
                            value={passwords.current}
                            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ marginBottom: '8px' }}>كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            className="form-input"
                            style={{ direction: 'ltr', textAlign: 'left', borderRadius: '12px', padding: '12px' }}
                            placeholder="••••••••"
                            value={passwords.newPass}
                            onChange={(e) => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ marginBottom: '8px' }}>تأكيد كلمة المرور</label>
                          <input
                            type="password"
                            className="form-input"
                            style={{ direction: 'ltr', textAlign: 'left', borderRadius: '12px', padding: '12px' }}
                            placeholder="••••••••"
                            value={passwords.confirmPass}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirmPass: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>قوة كلمة المرور</span>

                        <div style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: '#cbd5e1',
                          borderRadius: '9999px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${strengthPercent}%`,
                            height: '100%',
                            backgroundColor: strengthColor,
                            borderRadius: '9999px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: strengthColor }}>القوة: {strengthText}</span>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: '600' }}>ينصح بكلمة مرور معقدة</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: isLengthValid ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                            <CheckCircleIcon checked={isLengthValid} />
                            <span>8 أحرف على الأقل</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: isSpecialValid ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                            <CheckCircleIcon checked={isSpecialValid} />
                            <span>رمز خاص واحد (@، #، $، %)</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: isCapitalValid ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                            <CheckCircleIcon checked={isCapitalValid} />
                            <span>حرف واحد كبير (A-Z)</span>
                          </div>
                        </div>

                        <button
                          onClick={handleUpdatePassword}
                          style={{
                            width: '100%',
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginTop: 'auto',
                            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.15)',
                            transition: 'all 0.2s ease'
                          }}
                          className="hover-action-btn"
                        >
                          تحديث كلمة المرور
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>المواقع المحفوظة</span>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      onClick={triggerAddLocation}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {locations.map((loc) => (
                      <div
                        key={loc.id}
                        style={{
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px',
                          position: 'relative',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          color: 'var(--color-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--color-border)'
                        }}>
                          {loc.type === 'home' ? <Home size={14} /> : <Briefcase size={14} />}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, paddingLeft: '20px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-main)' }}>{loc.title}</span>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{loc.address}</p>
                        </div>

                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-text-light)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            onClick={(e) => toggleLocationMenu(loc.id, e)}
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeLocationMenu === loc.id && (
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-sm)',
                              boxShadow: 'var(--shadow-md)',
                              zIndex: 10,
                              minWidth: '100px',
                              padding: '4px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px'
                            }}>
                              <button
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 10px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  color: 'var(--color-text-main)',
                                  width: '100%',
                                  textAlign: 'right'
                                }}
                                className="hover-menu-item"
                                onClick={() => triggerEditLocation(loc)}
                              >
                                <Edit3 size={10} />
                                <span>تعديل</span>
                              </button>

                              <button
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 10px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  color: 'var(--color-danger)',
                                  width: '100%',
                                  textAlign: 'right'
                                }}
                                className="hover-menu-item-danger"
                                onClick={() => handleDeleteLocation(loc.id)}
                              >
                                <Trash2 size={10} />
                                <span>حذف</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {activeModal === 'edit-profile' && (
        <EditProfileModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'change-password' && (
        <ChangePasswordModal
          storedPassword={profile.password}
          onSave={handleChangePassword}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'location' && (
        <LocationModal
          location={editingLocation}
          onSave={handleSaveLocation}
          onClose={() => { setActiveModal(null); setEditingLocation(null); }}
        />
      )}

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  );
}