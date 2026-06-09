import React, { useState, useEffect, useContext } from 'react';
import {
  User, Shield, Lock, MoreVertical, Plus,
  Home, Briefcase, Mail, Phone, Cake, CheckCircle,
  Edit3, Trash2
} from 'lucide-react';

import { UserContext } from '../../Context/UserContext';
import Toast from './Toast';
import { api } from '../../services/api';
import {
  EditProfileModal,
  ChangePasswordModal
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
  const [isLoading, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState(null);

  const [toasts, setToasts] = useState([]);

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
    let apiUser = null;
    try {
      const data = await api.getProfile();
      
      // Robust user object extraction from backend response
      if (data) {
        if (data.user) {
          apiUser = data.user;
        } else if (data.data) {
          if (data.data.user) {
            apiUser = data.data.user;
          } else {
            apiUser = data.data;
          }
        } else {
          apiUser = data;
        }
      }
    } catch (err) {
      console.warn('Database profile fetch failed, falling back to local registry:', err);
    }

    const localEmail = localStorage.getItem("dawaya_current_email") || '';
    const localPassword = localStorage.getItem("dawaya_current_password") || '';

    // Check if we have local user registry details
    const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
    const localUser = users.find(u => u.email.toLowerCase() === localEmail.toLowerCase());

    if (apiUser) {
      setProfile({
        fullName: apiUser.username || localUser?.username || 'عضو داوايا',
        username: apiUser.username || localUser?.username || 'user',
        email: apiUser.email || localEmail,
        password: localPassword,
        phone: apiUser.phone || localUser?.phone || '',
        age: apiUser.age || localUser?.age || "18",
        gender: apiUser.gender === 'male' || apiUser.gender === 'ذكر' || localUser?.gender === 'male' || localUser?.gender === 'ذكر' ? 'ذكر' : 'أنثى'
      });
    } else if (localUser) {
      setProfile({
        fullName: localUser.username || 'عضو داوايا',
        username: localUser.username || 'user',
        email: localUser.email || localEmail,
        password: localPassword,
        phone: localUser.phone || '',
        age: localUser.age || "18",
        gender: localUser.gender === 'male' || localUser.gender === 'ذكر' ? 'ذكر' : 'أنثى'
      });
    } else {
      setProfile({
        fullName: 'عضو داوايا',
        username: 'user',
        email: localEmail,
        password: localPassword,
        phone: '',
        age: "18",
        gender: 'ذكر'
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [userLogin]);

  const handleSaveProfile = async (updatedProfile) => {
    // 1. Always save to local storage registry first
    try {
      const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
      const index = users.findIndex(u => u.email.toLowerCase() === updatedProfile.email.toLowerCase());
      const userData = {
        username: updatedProfile.username,
        phone: updatedProfile.phone,
        email: updatedProfile.email,
        password: updatedProfile.password,
        gender: updatedProfile.gender === 'ذكر' ? 'male' : 'female',
        age: Number(updatedProfile.age) || 18
      };
      if (index > -1) {
        users[index] = { ...users[index], ...userData };
      } else {
        users.push(userData);
      }
      localStorage.setItem("dawaya_users", JSON.stringify(users));
      localStorage.setItem("dawaya_current_email", updatedProfile.email);
      localStorage.setItem("dawaya_current_password", updatedProfile.password);
    } catch (e) {
      console.error("Local storage registry update failed", e);
    }

    // 2. Try saving to the backend database
    let apiUser = null;
    try {
      const genderApi = updatedProfile.gender === 'ذكر' ? 'male' : 'female';
      const data = await api.updateProfile({
        username: updatedProfile.username,
        phone: updatedProfile.phone,
        age: updatedProfile.age,
        gender: genderApi
      });

      // Robust user object extraction from backend response
      if (data) {
        if (data.user) {
          apiUser = data.user;
        } else if (data.data) {
          if (data.data.user) {
            apiUser = data.data.user;
          } else {
            apiUser = data.data;
          }
        } else {
          apiUser = data;
        }
      }
    } catch (err) {
      console.warn('Database save failed, using local registry as fallback:', err);
    }

    // 3. Always update active state from the latest data input to ensure seamless UI update
    if (apiUser) {
      setProfile({
        fullName: apiUser.username || updatedProfile.username,
        username: apiUser.username || updatedProfile.username,
        email: apiUser.email || updatedProfile.email,
        password: updatedProfile.password,
        phone: apiUser.phone || updatedProfile.phone,
        age: apiUser.age || updatedProfile.age,
        gender: apiUser.gender === 'male' || apiUser.gender === 'ذكر' ? 'ذكر' : 'أنثى'
      });
    } else {
      setProfile({
        fullName: updatedProfile.username,
        username: updatedProfile.username,
        email: updatedProfile.email,
        password: updatedProfile.password,
        phone: updatedProfile.phone,
        age: updatedProfile.age,
        gender: updatedProfile.gender
      });
    }
    setActiveModal(null);
    showToast('تم تحديث الملف الشخصي بنجاح!');
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      // Always change password in the database
      await api.changePassword(oldPassword, newPassword);

      localStorage.setItem("dawaya_current_password", newPassword);
      setProfile(prev => ({ ...prev, password: newPassword }));
      setActiveModal(null);
      showToast('تم تغيير كلمة المرور بنجاح!', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'يرجى التحقق من كلمة المرور الحالية والمحاولة مجدداً.', 'error');
      return false;
    }
  };



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
    strengthColor = '#1ab5ea';
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
      backgroundColor: checked ? 'var(--color-brand)' : 'transparent',
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
          <div className="container" style={{ margin: "15px auto", maxWidth: "800px" }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <div className="card animate-fade-in" style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '24px',
                  border: '1px solid rgba(241, 245, 249, 0.8)',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: '#ffffff'
                }}>
                  <div className="profile-cover-banner">
                    <div className="profile-cover-circle-1" />
                    <div className="profile-cover-circle-2" />
                  </div>

                  <div className="profile-header-content">
                    <div className="profile-user-info">
                      <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-badge">
                          {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                      </div>
                      <div className="profile-user-details">
                        <h2 className="profile-user-name">{profile.fullName}</h2>
                        <p className="profile-user-role">عضو منصة دوايا الصحية</p>
                      </div>
                    </div>

                    <button
                      className="profile-edit-btn"
                      onClick={() => setActiveModal('edit-profile')}
                    >
                      <Edit3 size={15} />
                      <span>تعديل الملف الشخصي</span>
                    </button>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <User size={20} style={{ color: 'var(--color-brand)' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>المعلومات الشخصية</h3>
                  </div>

                  <div className="profile-info-grid">
                    {/* Username */}
                    <div className="profile-info-card">
                      <div className="profile-info-icon-wrapper icon-wrapper-username">
                        <User size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="profile-info-label">اسم المستخدم</span>
                        <span className="profile-info-value" style={{ fontFamily: 'monospace' }}>{profile.username}</span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="profile-info-card">
                      <div className="profile-info-icon-wrapper icon-wrapper-phone">
                        <Phone size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="profile-info-label">رقم الهاتف</span>
                        <span className="profile-info-value" style={{ direction: 'ltr', display: 'inline-block' }}>{profile.phone}</span>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="profile-info-card">
                      <div className="profile-info-icon-wrapper icon-wrapper-gender">
                        <User size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="profile-info-label">الجنس</span>
                        <span className="profile-info-value">{profile.gender}</span>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="profile-info-card">
                      <div className="profile-info-icon-wrapper icon-wrapper-age">
                        <Cake size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="profile-info-label">العمر</span>
                        <span className="profile-info-value">{profile.age} سنة</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="profile-info-card full-width">
                      <div className="profile-info-icon-wrapper icon-wrapper-email">
                        <Mail size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="profile-info-label">البريد الإلكتروني</span>
                        <span className="profile-info-value" style={{ fontFamily: 'monospace' }}>{profile.email}</span>
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
                          backgroundColor: 'var(--color-danger-light)',
                          color: 'var(--color-danger)',
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
                            backgroundColor: 'var(--color-brand)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginTop: 'auto',
                            boxShadow: '0 4px 10px rgba(9, 119, 230, 0.15)',
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