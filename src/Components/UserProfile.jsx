import React, { useState } from 'react';
import {
  User, Shield, Lock, MoreVertical, Plus,
  Home, Briefcase, Mail, Phone, Cake, CheckCircle,
  Edit3, Trash2
} from 'lucide-react';

export default function UserProfile({
  profile,
  locations,
  onEditProfile,
  onChangePassword,
  onAddLocation,
  onEditLocation,
  onDeleteLocation
}) {
  const [activeLocationMenu, setActiveLocationMenu] = useState(null);
  const [isChangePasswordExpanded, setIsChangePasswordExpanded] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Toggle three dots menu for locations
  const toggleLocationMenu = (id, e) => {
    e.stopPropagation();
    setActiveLocationMenu(activeLocationMenu === id ? null : id);
  };

  // Close location menu
  React.useEffect(() => {
    const closeMenu = () => setActiveLocationMenu(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  // Sync password expansion state to clear forms on successful parent updates
  React.useEffect(() => {
    if (profile.password && passwords.newPass === profile.password) {
      setIsChangePasswordExpanded(false);
      setPasswords({ current: '', newPass: '', confirmPass: '' });
      setError('');
      setSuccess('');
    }
  }, [profile.password]);

  // Checklist criteria logic
  const isLengthValid = passwords.newPass.length >= 8;
  const isSpecialValid = /[!@#$%^&*(),.?":{}|<>_]/.test(passwords.newPass);
  const isCapitalValid = /[A-Z]/.test(passwords.newPass);

  const strengthCount = [isLengthValid, isSpecialValid, isCapitalValid].filter(Boolean).length;
  let strengthPercent = 0;
  let strengthText = 'ضعيفة';
  let strengthColor = '#ef4444'; // Red

  if (strengthCount === 1) {
    strengthPercent = 33;
    strengthText = 'ضعيفة';
    strengthColor = '#ef4444';
  } else if (strengthCount === 2) {
    strengthPercent = 66;
    strengthText = 'متوسطة - غالباً';
    strengthColor = '#f59e0b'; // Orange
  } else if (strengthCount === 3) {
    strengthPercent = 100;
    strengthText = 'قوية جداً';
    strengthColor = '#0284c7'; // Solid blue as in screenshot
  }

  // Update password local handler
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwords.current) {
      setError('يرجى إدخال كلمة المرور الحالية.');
      return;
    }

    if (profile.password && passwords.current !== profile.password) {
      setError('كلمة المرور الحالية غير صحيحة.');
      return;
    }

    if (!passwords.newPass) {
      setError('يرجى إدخال كلمة المرور الجديدة.');
      return;
    }

    if (passwords.newPass !== passwords.confirmPass) {
      setError('كلمتا المرور الجديدتان غير متطابقتين.');
      return;
    }

    if (passwords.newPass.length < 6) {
      setError('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.');
      return;
    }

    onChangePassword(passwords.current, passwords.newPass);
    setSuccess('تم تحديث كلمة المرور بنجاح!');

    setTimeout(() => {
      setIsChangePasswordExpanded(false);
      setPasswords({ current: '', newPass: '', confirmPass: '' });
      setError('');
      setSuccess('');
    }, 1500);
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
    <div className="container" style={{ margin: "5px" }}>
      <div className="app-grid" style={{ margin: "10px" }}>

        {/* RIGHT COLUMN: Banner, Information, and Security details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Card 1: User Profile Banner with Vibrant Sky Gradient */}
          <div className="card animate-fade-in" style={{
            padding: 0,
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid rgba(241, 245, 249, 0.8)',
            boxShadow: 'var(--shadow-md)',
            backgroundColor: '#ffffff'
          }}>
            {/* Top Backdrop Gradient */}
            <div style={{
              height: '30px',
              background: 'linear-gradient(135deg, #e0f2fe 0%, #faf7fb 100%)',
              position: 'relative',
              // overflow: 'hidden'
            }}>
              {/* Decorative blurred rings */}
              <div style={{ position: 'absolute', top: '10%', right: '8%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.04)', filter: 'blur(8px)' }} />
              <div style={{ position: 'absolute', bottom: '-20%', left: '12%', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.03)', filter: 'blur(6px)' }} />
            </div>

            {/* Profile Avatar & Details Section */}
            <div style={{
              padding: '24px 32px 32px 32px',
              marginTop: '-25px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px'
            }}>
              {/* Avatar on the right in RTL */}
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

              {/* Username details and edit trigger column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-main)', margin: 0 }}>{profile.fullName}</h2>
                  {/* <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(2, 132, 199, 0.08)',
                    color: 'var(--color-brand)',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(2, 132, 199, 0.15)'
                  }}>
                    <CheckCircle size={11} style={{ color: 'var(--color-brand)' }} />
                    مو موث
                  </span> */}
                </div>

                {/* <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px' }}>📅</span>
                  عضو منذ أكتوبر 2023
                </span> */}

                <button
                  className="btn btn-primary"
                  onClick={onEditProfile}
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

          {/* Card 2: Personal Information Grid */}
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



              {/* Field 2: Username */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>اسم المستخدم</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-text-main)' }}>{profile.username}</span>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '14px', fontWeight: '700' }}>@</span>
                </div>
              </div>

              {/* Field 3: Phone */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>رقم الهاتف</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', direction: 'ltr' }}>{profile.phone}</span>
                  <Phone size={16} style={{ color: 'var(--color-text-light)' }} />
                </div>
              </div>

              {/* Field 4: Email */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>البريد الإلكتروني</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-text-main)' }}>{profile.email}</span>
                  <Mail size={16} style={{ color: 'var(--color-text-light)' }} />
                </div>
              </div>

              {/* Field 5: Gender */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>الجنس</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>{profile.gender}</span>
                  <User size={16} style={{ color: 'var(--color-text-light)' }} />
                </div>
              </div>

              {/* Field 6: Age */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <span className="form-label" style={{ marginBottom: '8px', display: 'block' }}>العمر</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-main)' }}>{profile.age}</span>
                  <Cake size={16} style={{ color: 'var(--color-text-light)' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Card 3: Security & Password collapsible details */}
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
                    setError('');
                    setSuccess('');
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

                {/* Right Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {error && (
                    <div style={{
                      backgroundColor: 'var(--color-danger-light)',
                      color: 'var(--color-danger)',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {error}
                    </div>
                  )}
                  {success && (
                    <div style={{
                      backgroundColor: 'var(--color-success-light)',
                      color: 'var(--color-success-dark)',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {success}
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

                {/* Left Password Strength Card */}
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

                  {/* Progress Indicator */}
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

                  {/* Criteria Checklist */}
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

        {/* LEFT COLUMN: Sidebar (Locations) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Card 2: Saved Locations */}
          <div className="card" style={{ padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700' }}>المواقع المحفوظة</span>
              <button
                className="btn-icon"
                style={{ width: '28px', height: '28px' }}
                onClick={onAddLocation}
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

                  {/* Options dots menu button */}
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
                          onClick={() => onEditLocation(loc)}
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
                          onClick={() => onDeleteLocation(loc.id)}
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
  );
}
