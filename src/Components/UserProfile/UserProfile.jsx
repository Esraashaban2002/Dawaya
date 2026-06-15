import React, { useState, useEffect, useContext } from 'react';
import {
  User, Shield, Lock, MoreVertical, Plus,
  Home, Briefcase, Mail, Phone, Cake, CheckCircle,
  Edit3, Trash2, ShoppingBag, Calendar, MapPin, CreditCard, Clock, ExternalLink
} from 'lucide-react';

import { UserContext } from '../../Context/UserContext';
import Toast from './Toast';
import { api } from '../../services/api';
import {
  EditProfileModal,
  ChangePasswordModal
} from './Modals';
import { Link } from 'react-router-dom';

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

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders'
  const [userOrders, setUserOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const email = profile.email || localStorage.getItem("dawaya_current_email") || '';
    if (email) {
      const allOrders = JSON.parse(localStorage.getItem('dawaya_orders') || '[]');
      const filtered = allOrders.filter(order => order.userEmail?.toLowerCase() === email.toLowerCase());
      setUserOrders(filtered);
    }
  }, [profile.email]);

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
        gender: (apiUser.gender === 'male' || apiUser.gender === 'ذكر' || localUser?.gender === 'male' || localUser?.gender === 'ذكر')
          ? 'ذكر'
          : (apiUser.gender === 'female' || apiUser.gender === 'أنثى' || localUser?.gender === 'female' || localUser?.gender === 'أنثى')
            ? 'أنثى'
            : ''
      });
    } else if (localUser) {
      setProfile({
        fullName: localUser.username || 'عضو داوايا',
        username: localUser.username || 'user',
        email: localUser.email || localEmail,
        password: localPassword,
        phone: localUser.phone || '',
        age: localUser.age || "18",
        gender: (localUser.gender === 'male' || localUser.gender === 'ذكر')
          ? 'ذكر'
          : (localUser.gender === 'female' || localUser.gender === 'أنثى')
            ? 'أنثى'
            : ''
      });
    } else {
      setProfile({
        fullName: 'عضو داوايا',
        username: 'user',
        email: localEmail,
        password: localPassword,
        phone: '',
        age: "18",
        gender: ''
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
        gender: updatedProfile.gender === 'ذكر' ? 'male' : updatedProfile.gender === 'أنثى' ? 'female' : '',
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

      // Sync local storage reminders that use the profile phone number
      const savedReminders = localStorage.getItem("dawaya_reminders");
      if (savedReminders) {
        const list = JSON.parse(savedReminders);
        const updatedList = list.map(rem => 
          rem.phoneType === "profile" ? { ...rem, phoneNumber: updatedProfile.phone } : rem
        );
        localStorage.setItem("dawaya_reminders", JSON.stringify(updatedList));
      }
    } catch (e) {
      console.error("Local storage registry update failed", e);
    }

    // 2. Try saving to the backend database
    let apiUser = null;
    try {
      const genderApi = updatedProfile.gender === 'ذكر' ? 'male' : updatedProfile.gender === 'أنثى' ? 'female' : '';
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
        gender: (apiUser.gender === 'male' || apiUser.gender === 'ذكر')
          ? 'ذكر'
          : (apiUser.gender === 'female' || apiUser.gender === 'أنثى')
            ? 'أنثى'
            : ''
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

              {/* Tab switcher */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '0px', marginBottom: '8px' }} className="animate-fade-in">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    borderBottom: activeTab === 'profile' ? '3px solid var(--color-primary)' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  بياناتي الشخصية
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    borderBottom: activeTab === 'orders' ? '3px solid var(--color-primary)' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>طلباتي المشتراة</span>
                  <span style={{ fontSize: '11px', backgroundColor: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-border)', color: activeTab === 'orders' ? '#ffffff' : 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
                    {userOrders.length}
                  </span>
                </button>
              </div>

              {activeTab === 'profile' ? (
                <>
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
                          <span className="profile-info-value">{profile.gender || "غير محدد"}</span>
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
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
                  <div className="card" style={{ padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                      <ShoppingBag size={20} style={{ color: 'var(--color-brand)' }} />
                      <h3 style={{ fontSize: '18px', fontWeight: '700' }}>طلباتي المشتراة</h3>
                    </div>

                    {userOrders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '8px' }}>
                          <ShoppingBag size={32} />
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-main)', margin: 0 }}>لا توجد طلبات شراء مسجلة</h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '400px', margin: 0, lineHeight: 1.6 }}>
                          يبدو أنك لم تقم بطلب أي منتجات بعد. ابدأ بالتسوق الآن واكتشف مجموعتنا المميزة من الأدوية والرعاية الصحية.
                        </p>
                        <Link to="/" style={{ textDecoration: 'none', maxWidth: '200px', marginTop: '16px' }} className="checkout-btn">
                          ابدأ التسوق الآن
                        </Link>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {userOrders.map((order) => {
                          const isExpanded = expandedOrderId === order.id;
                          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                          // Status colors & texts
                          let statusText = 'قيد الانتظار';
                          let statusColor = '#f59e0b';
                          let statusBg = 'rgba(245, 158, 11, 0.08)';

                          if (order.status === 'pending_verification') {
                            statusText = 'قيد التحقق من الدفع';
                            statusColor = '#f59e0b';
                            statusBg = 'rgba(245, 158, 11, 0.08)';
                          } else if (order.status === 'preparing') {
                            statusText = 'جاري التجهيز';
                            statusColor = 'var(--color-primary)';
                            statusBg = 'var(--color-primary-light)';
                          } else if (order.status === 'shipped') {
                            statusText = 'جاري التوصيل';
                            statusColor = '#6366f1';
                            statusBg = 'rgba(99, 102, 241, 0.08)';
                          } else if (order.status === 'completed' || order.status === 'delivered') {
                            statusText = 'تم التوصيل';
                            statusColor = 'var(--color-success)';
                            statusBg = 'var(--color-success-light)';
                          }

                          return (
                            <div key={order.id} style={{ border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#ffffff', transition: 'all 0.2s ease', boxShadow: isExpanded ? 'var(--shadow-md)' : 'none' }}>

                              {/* Order Main Header Row */}
                              <div
                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isExpanded ? '#f8fafc' : '#ffffff', transition: 'all 0.2s ease', flexWrap: 'wrap', gap: '12px' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '700' }}>رقم الطلب</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '900', color: 'var(--color-text-main)' }}>{order.id}</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '700' }}>التاريخ</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>{order.date}</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '700' }}>المنتجات</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>{itemCount} وحدات</span>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '700' }}>الإجمالي</span>
                                    <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--color-primary)' }}>{order.total} جنيه</span>
                                  </div>
                                  <span style={{ backgroundColor: statusBg, color: statusColor, padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                                    {statusText}
                                  </span>
                                </div>
                              </div>

                              {/* Expanded Details Panel */}
                              {isExpanded && (
                                <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">

                                  {/* Split details grid */}
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row">

                                    {/* Delivery information */}
                                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)' }}>
                                      <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '850', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} style={{ color: 'var(--color-brand)' }} />
                                        <span>تفاصيل التوصيل</span>
                                      </h4>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                                        <div><span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>الاسم:</span> <span style={{ fontWeight: '750', color: 'var(--color-text-main)' }}>{order.shippingInfo.fullName}</span></div>
                                        <div><span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>رقم الهاتف:</span> <span style={{ fontWeight: '750', color: 'var(--color-text-main)', direction: 'ltr', display: 'inline-block' }}>{order.shippingInfo.phone}</span></div>
                                        <div><span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>العنوان:</span> <span style={{ fontWeight: '750', color: 'var(--color-text-main)' }}>{order.shippingInfo.city}، {order.shippingInfo.address}</span></div>
                                        {order.shippingInfo.notes && (
                                          <div><span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>ملاحظات:</span> <span style={{ fontWeight: '750', color: 'var(--color-text-main)' }}>{order.shippingInfo.notes}</span></div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Payment information */}
                                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)' }}>
                                      <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '850', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <CreditCard size={14} style={{ color: 'var(--color-brand)' }} />
                                        <span>بيانات الدفع</span>
                                      </h4>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                                        <div>
                                          <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>طريقة الدفع:</span>
                                          <span style={{ fontWeight: '800', color: 'var(--color-primary)', marginRight: '6px' }}>
                                            {order.payment.method === 'vodafone' ? 'فودافون كاش' : order.payment.method === 'instapay' ? 'إنستا باي' : order.payment.method === 'bank' ? 'تحويل بنكي' : 'الدفع عند الاستلام'}
                                          </span>
                                        </div>
                                        {order.payment.senderInfo && (
                                          <div>
                                            <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>
                                              {order.payment.method === 'vodafone' ? 'رقم المحفظة:' : order.payment.method === 'instapay' ? 'اسم حساب التحويل:' : 'اسم المحول:'}
                                            </span>
                                            <span style={{ fontWeight: '750', color: 'var(--color-text-main)', marginRight: '6px' }}>{order.payment.senderInfo}</span>
                                          </div>
                                        )}
                                        <div>
                                          <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>إرفاق الإيصال:</span>
                                          <span style={{ fontWeight: '750', color: order.payment.receiptAttached ? 'var(--color-success)' : 'var(--color-text-muted)', marginRight: '6px' }}>
                                            {order.payment.receiptAttached ? 'تم إرفاق صورة الإيصال بنجاح' : 'لم يتم إرفاق إيصال'}
                                          </span>
                                        </div>
                                        <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '6px', marginTop: '4px' }}>
                                          <span style={{ color: 'var(--color-text-main)', fontWeight: '800' }}>المبلغ الكلي:</span>
                                          <span style={{ fontWeight: '900', color: 'var(--color-primary)', marginRight: '6px', fontSize: '14px' }}>{order.total} جنيه</span>
                                        </div>
                                      </div>
                                    </div>

                                  </div>

                                  {/* Order Status Tracker */}
                                  <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: '#ffffff' }}>
                                    <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: '850', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Clock size={14} style={{ color: 'var(--color-brand)' }} />
                                      <span>تتبع حالة الطلب</span>
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '10px', padding: '0 12px' }}>
                                      <div style={{ position: 'absolute', top: '10px', left: '25px', right: '25px', height: '2px', backgroundColor: '#e2e8f0', zIndex: 1 }} />

                                      {/* Placed step */}
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }}>✓</div>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-main)' }}>تم الطلب</span>
                                      </div>

                                      {/* Verification step */}
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                                        <div style={{
                                          width: '22px',
                                          height: '22px',
                                          borderRadius: '50%',
                                          backgroundColor: order.status !== 'pending_verification' ? 'var(--color-primary)' : '#e2e8f0',
                                          border: order.status !== 'pending_verification' ? 'none' : '2px solid #cbd5e1',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: order.status !== 'pending_verification' ? '#ffffff' : 'var(--color-text-muted)',
                                          fontSize: '10px',
                                          fontWeight: 'bold'
                                        }}>
                                          {order.status !== 'pending_verification' ? '✓' : '2'}
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: order.status !== 'pending_verification' ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                                          {order.payment.method === 'cod' ? 'مقبول تلقائياً' : 'تأكيد التحويل'}
                                        </span>
                                      </div>

                                      {/* Preparing step */}
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                                        <div style={{
                                          width: '22px',
                                          height: '22px',
                                          borderRadius: '50%',
                                          backgroundColor: (order.status === 'preparing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? 'var(--color-primary)' : '#ffffff',
                                          border: (order.status === 'preparing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? 'none' : '2px solid #cbd5e1',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: (order.status === 'preparing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? '#ffffff' : 'var(--color-text-muted)',
                                          fontSize: '10px',
                                          fontWeight: 'bold'
                                        }}>
                                          {(order.status === 'preparing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? '✓' : '3'}
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: (order.status === 'preparing' || order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>جاري التجهيز</span>
                                      </div>

                                      {/* Shipped step */}
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                                        <div style={{
                                          width: '22px',
                                          height: '22px',
                                          borderRadius: '50%',
                                          backgroundColor: (order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? 'var(--color-primary)' : '#ffffff',
                                          border: (order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? 'none' : '2px solid #cbd5e1',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: (order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? '#ffffff' : 'var(--color-text-muted)',
                                          fontSize: '10px',
                                          fontWeight: 'bold'
                                        }}>
                                          {(order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? '✓' : '4'}
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: (order.status === 'shipped' || order.status === 'completed' || order.status === 'delivered') ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>جاري التوصيل</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Products Purchased Table */}
                                  <div>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '850', color: 'var(--color-text-main)' }}>المنتجات المطلوبة</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      {order.items.map((item) => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '10px 14px' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                            <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-main)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</span>
                                              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>النوع / الماركة: {item.brand}</span>
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.price} جنيه × {item.quantity}</span>
                                            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--color-text-main)' }}>{item.price * item.quantity} جنيه</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

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