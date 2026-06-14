import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell, Clock, Calendar, Check, AlertCircle, Trash2,
  Plus, MessageSquare, Smartphone, User, Phone, CheckCircle, RefreshCw, X, Edit
} from 'lucide-react';
import { UserContext } from '../Context/UserContext';
import { api } from '../services/api';

const DEFAULT_REMINDERS = [
  {
    id: "rem-1",
    medicineName: "بانادول اكسترا اوبتيزورب",
    dosage: "قرص واحد",
    frequency: "مرتين يومياً",
    time: "08:00",
    useApp: true,
    useWhatsapp: true,
    phoneType: "profile",
    phoneNumber: "",
    active: true
  },
  {
    id: "rem-2",
    idCustom: "rem-2",
    medicineName: "هيكس ألم جل موضعي",
    dosage: "دهان خفيف للمفصل",
    frequency: "3 مرات يومياً",
    time: "14:00",
    useApp: false,
    useWhatsapp: true,
    phoneType: "custom",
    phoneNumber: "01287654321",
    active: true
  }
];

export default function Reminders() {
  const { userLogin } = useContext(UserContext);
  const location = useLocation();

  // State Management
  const [profilePhone, setProfilePhone] = useState("");
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("قرص واحد");
  const [frequency, setFrequency] = useState("مرة واحدة يومياً");
  const [time, setTime] = useState("08:00");
  const [useApp, setUseApp] = useState(true);
  const [useWhatsapp, setUseWhatsapp] = useState(location.pathname === '/whatsapp');
  const [phoneType, setPhoneType] = useState("profile");
  const [customPhone, setCustomPhone] = useState("");

  // UI state
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [simulatedReminder, setSimulatedReminder] = useState(null);
  const [editingReminderId, setEditingReminderId] = useState(null);

  // Fetch profile phone number
  const fetchProfilePhone = async () => {
    const activeToken = userLogin || localStorage.getItem('userToken');
    if (!activeToken) {
      setIsLoading(false);
      return;
    }

    let phone = "";
    try {
      const data = await api.getProfile();
      if (data) {
        const user = data.user || data.data?.user || data.data || data;
        phone = user.phone || "";
      }
    } catch (err) {
      console.warn("Database profiles failed, checking local storage:", err);
    }

    if (!phone) {
      const email = localStorage.getItem("dawaya_current_email") || '';
      const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
      const localUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      phone = localUser?.phone || "";
    }

    setProfilePhone(phone);
    if (!phone) {
      setPhoneType("custom"); // Force custom if profile phone does not exist
    } else {
      setPhoneType("profile");
      setCustomPhone(phone); // Pre-populate custom phone input with profile phone
    }
  };

  // Sync route check
  useEffect(() => {
    if (location.pathname === '/whatsapp') {
      setUseWhatsapp(true);
    }
  }, [location.pathname]);

  // Load reminders
  useEffect(() => {
    const loadReminders = async () => {
      fetchProfilePhone();
      try {
        const data = await api.getReminders();
        if (data && data.success && data.data) {
          setReminders(data.data);
        } else {
          const saved = localStorage.getItem("dawaya_reminders");
          setReminders(saved ? JSON.parse(saved) : DEFAULT_REMINDERS);
        }
      } catch (err) {
        console.warn("Backend reminders not available, loading from local storage:", err);
        const saved = localStorage.getItem("dawaya_reminders");
        setReminders(saved ? JSON.parse(saved) : DEFAULT_REMINDERS);
      } finally {
        setIsLoading(false);
      }
    };
    loadReminders();
  }, [userLogin]);

  // Sync profile-type reminders with the profilePhone state dynamically
  useEffect(() => {
    if (profilePhone && reminders.length > 0) {
      let hasChanged = false;
      const updated = reminders.map(r => {
        if (r.phoneType === "profile" && r.phoneNumber !== profilePhone) {
          hasChanged = true;
          const updatedRem = { ...r, phoneNumber: profilePhone };
          // Sync changes to reminders backend database
          api.updateReminder(r._id || r.id, updatedRem)
            .then(() => console.log(`Successfully synced reminder ${r._id || r.id} to new profile phone ${profilePhone}`))
            .catch(err => console.warn(`Failed to sync reminder ${r._id || r.id} to new profile phone:`, err));
          return updatedRem;
        }
        return r;
      });
      if (hasChanged) {
        setReminders(updated);
        localStorage.setItem("dawaya_reminders", JSON.stringify(updated));
      }
    }
  }, [profilePhone, reminders]);

  const handleEditClick = (rem) => {
    setMedicineName(rem.medicineName);
    setDosage(rem.dosage);
    setFrequency(rem.frequency);
    setTime(rem.time);
    setUseApp(rem.useApp);
    setUseWhatsapp(rem.useWhatsapp);
    setPhoneType(rem.phoneType || (profilePhone ? "profile" : "custom"));
    if (rem.phoneType === "custom") {
      setCustomPhone(rem.phoneNumber || "");
    } else {
      setCustomPhone(profilePhone || "");
    }
    setEditingReminderId(rem.id || rem._id);
    setValidationError("");
    setSuccessMsg("");

    // Smooth scroll to the form panel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReminderId(null);
    setMedicineName("");
    setDosage("قرص واحد");
    setFrequency("مرة واحدة يومياً");
    setTime("08:00");
    setUseApp(true);
    setUseWhatsapp(false);
    setPhoneType(profilePhone ? "profile" : "custom");
    setCustomPhone(profilePhone || "");
    setValidationError("");
    setSuccessMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMsg("");

    if (!medicineName.trim()) {
      setValidationError("يرجى إدخال اسم الدواء.");
      return;
    }

    if (!useApp && !useWhatsapp) {
      setValidationError("يرجى تحديد طريقة واحدة على الأقل للتنبيه (إشعارات التطبيق أو واتساب).");
      return;
    }

    let finalPhone = "";
    if (useWhatsapp) {
      if (phoneType === 'profile') {
        if (!profilePhone) {
          setValidationError("لا يوجد رقم هاتف مسجل في ملفك الشخصي حالياً. يرجى اختيار رقم هاتف آخر وإدخاله بالأسفل.");
          return;
        }
        finalPhone = profilePhone;
      } else {
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(customPhone)) {
          setValidationError("يرجى إدخال رقم هاتف مصري صحيح (مثل: 01012345678).");
          return;
        }
        finalPhone = customPhone;
      }
    }

    const finalReminderData = {
      medicineName,
      dosage,
      frequency,
      time,
      useApp,
      useWhatsapp,
      phoneType: useWhatsapp ? phoneType : "",
      phoneNumber: useWhatsapp ? finalPhone : "",
      active: true
    };

    if (editingReminderId) {
      const updatedLocal = reminders.map(r => {
        if (r.id === editingReminderId || r._id === editingReminderId) {
          return {
            ...r,
            ...finalReminderData
          };
        }
        return r;
      });

      api.updateReminder(editingReminderId, finalReminderData)
        .then((data) => {
          if (data && data.success && data.data) {
            const updatedList = reminders.map(r => (r._id === editingReminderId || r.id === editingReminderId) ? data.data : r);
            setReminders(updatedList);
            localStorage.setItem("dawaya_reminders", JSON.stringify(updatedList));
          } else {
            setReminders(updatedLocal);
            localStorage.setItem("dawaya_reminders", JSON.stringify(updatedLocal));
          }
        })
        .catch((err) => {
          console.warn("Failed to update reminder in backend, saving locally:", err);
          setReminders(updatedLocal);
          localStorage.setItem("dawaya_reminders", JSON.stringify(updatedLocal));
        });

      setSuccessMsg("تم تحديث التذكير الطبي بنجاح!");
      setEditingReminderId(null);
    } else {
      const localId = "rem-" + Date.now();
      const localNewReminder = {
        id: localId,
        ...finalReminderData
      };
      const updatedLocal = [localNewReminder, ...reminders];

      api.createReminder(finalReminderData)
        .then((data) => {
          if (data && data.success && data.data) {
            const updatedList = [data.data, ...reminders];
            setReminders(updatedList);
            localStorage.setItem("dawaya_reminders", JSON.stringify(updatedList));
          } else {
            setReminders(updatedLocal);
            localStorage.setItem("dawaya_reminders", JSON.stringify(updatedLocal));
          }
        })
        .catch((err) => {
          console.warn("Failed to save reminder to backend, saving locally:", err);
          setReminders(updatedLocal);
          localStorage.setItem("dawaya_reminders", JSON.stringify(updatedLocal));
        });

      setSuccessMsg("تم إضافة التذكير الطبي بنجاح وسيبدأ العمل فوراً!");
    }

    // Reset Form
    setMedicineName("");
    setDosage("قرص واحد");
    setFrequency("مرة واحدة يومياً");
    setTime("08:00");
    if (!profilePhone) {
      setPhoneType("custom");
    } else {
      setPhoneType("profile");
    }
    setCustomPhone(profilePhone || "");

    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
  };

  const toggleReminderActive = async (targetId) => {
    const reminderToToggle = reminders.find(r => r.id === targetId || r._id === targetId);
    if (!reminderToToggle) return;

    const newActiveState = !reminderToToggle.active;
    const updatedLocal = reminders.map(r => (r.id === targetId || r._id === targetId) ? { ...r, active: newActiveState } : r);
    setReminders(updatedLocal);
    localStorage.setItem("dawaya_reminders", JSON.stringify(updatedLocal));

    try {
      await api.updateReminder(targetId, { ...reminderToToggle, active: newActiveState });
    } catch (err) {
      console.warn("Could not sync active state toggle with backend:", err);
    }
  };

  const handleDeleteReminder = async (targetId) => {
    const updatedLocal = reminders.filter(r => r.id !== targetId && r._id !== targetId);
    setReminders(updatedLocal);
    localStorage.setItem("dawaya_reminders", JSON.stringify(updatedLocal));

    try {
      await api.deleteReminder(targetId);
    } catch (err) {
      console.warn("Could not delete reminder from backend:", err);
    }
  };

  const triggerWhatsappSimulation = (reminder) => {
    setSimulatedReminder(reminder);
  };

  return (
    <div className="cart-page" style={{ background: '#f4f6f9', minHeight: '90vh', paddingBottom: '48px' }}>
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 16px' }}>

        {/* Navigation Breadcrumb */}
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span className="separator">/</span>
          <span className="current">جدولة تذكيرات الدواء وواتساب</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>

          {/* Right Panel: Add Reminder Form */}
          <div className="cart-items-card animate-fade-in" style={{ padding: '32px' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell style={{ color: 'var(--color-primary)' }} />
                {editingReminderId ? "تعديل التذكير الطبي" : "إعداد تذكير طبي جديد"}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
                {editingReminderId
                  ? "تعديل تفاصيل التذكير الحالي. اضغط على حفظ التعديلات لتطبيق التغييرات."
                  : "املأ مواعيد جرعات دوائك واشترك بالتنبيهات لنرسل لك رسالة تذكير فورية في الموعد المحدد."}
              </p>
            </div>

            {validationError && (
              <div style={{
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                color: '#10b981',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Medicine Name */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>اسم الدواء</label>
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className="form-input"
                  placeholder="مثال: بانادول اكسترا، شراب خافض للحرارة..."
                  required
                />
              </div>

              {/* Dosage & Frequency Row */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: 0 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>الجرعة المطلوبة</label>
                  <select
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="form-input"
                  >
                    <option value="قرص واحد">قرص واحد (1 Tab)</option>
                    <option value="قرصين">قرصين (2 Tabs)</option>
                    <option value="ملعقة صغيرة">ملعقة صغيرة (5 مل)</option>
                    <option value="ملعقة كبيرة">ملعقة كبيرة (10 مل)</option>
                    <option value="حقنة واحدة">حقنة واحدة (Injection)</option>
                    <option value="دهان موضعي">دهان موضعي خفيف</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>التكرار</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="form-input"
                  >
                    <option value="مرة واحدة يومياً">مرة واحدة يومياً</option>
                    <option value="مرتين يومياً">مرتين يومياً</option>
                    <option value="3 مرات يومياً">3 مرات يومياً</option>
                    <option value="عند اللزوم">عند اللزوم (As needed)</option>
                  </select>
                </div>
              </div>

              {/* Timing */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>توقيت أخذ الجرعة</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-input"
                    style={{ maxWidth: '140px', padding: '8px 12px' }}
                    required
                  />
                </div>
              </div>

              {/* Channels (Alert Type Choice) */}
              <div style={{
                background: '#f8fafc', border: '1px solid var(--color-border)',
                borderRadius: '16px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  حدد طريقة استقبال التنبيه:
                </span>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={useApp}
                      onChange={(e) => setUseApp(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                    />
                    <span>إشعارات التطبيق</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={useWhatsapp}
                      onChange={(e) => setUseWhatsapp(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ color: '#25D366', fontWeight: 700 }}>تنبيهات واتساب (WhatsApp)</span>
                  </label>
                </div>

                {/* WhatsApp configuration overlay details */}
                {useWhatsapp && (
                  <div style={{
                    marginTop: '8px', borderTop: '1px solid #edf2f7', paddingTop: '12px',
                    display: 'flex', flexDirection: 'column', gap: '12px'
                  }} className="animate-fade-in">

                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                      حدد رقم الهاتف لاستقبال التنبيهات:
                    </span>

                    {/* Options: Profile or Custom */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                        <input
                          type="radio"
                          name="phoneType"
                          value="profile"
                          checked={phoneType === "profile"}
                          onChange={() => setPhoneType("profile")}
                          disabled={!profilePhone}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span>
                          رقم الهاتف المسجل بالملف الشخصي:
                          {profilePhone ? (
                            <strong style={{ direction: 'ltr', display: 'inline-block', marginRight: '6px', color: 'var(--color-primary)' }}> {profilePhone}</strong>
                          ) : (
                            <span style={{ color: '#e53935', marginRight: '6px' }}> (لا يوجد رقم مسجل بالملف الشخصي)</span>
                          )}
                        </span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                        <input
                          type="radio"
                          name="phoneType"
                          value="custom"
                          checked={phoneType === "custom"}
                          onChange={() => setPhoneType("custom")}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span>رقم هاتف آخر مخصص</span>
                      </label>
                    </div>

                    {/* Custom Phone Number input */}
                    {phoneType === "custom" && (
                      <div className="form-group animate-fade-in" style={{ margin: '4px 0 0 0' }}>
                        <input
                          type="tel"
                          value={customPhone}
                          onChange={(e) => setCustomPhone(e.target.value)}
                          className="form-input"
                          style={{ maxWidth: '240px', padding: '8px 12px', fontSize: '13px' }}
                          placeholder="مثال: 01012345678"
                          required={phoneType === "custom"}
                        />
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                          أدخل رقم الهاتف المكون من 11 رقماً متصلاً بالواتساب لتلقي الرسالة.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit CTA / Edit CTAs */}
              {editingReminderId ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    className="checkout-btn"
                    style={{ flex: 1, border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Check size={18} />
                    <span>حفظ التعديلات</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="checkout-btn-secondary"
                    style={{
                      flex: 1,
                      border: '1px solid var(--color-border)',
                      background: '#f8fafc',
                      color: 'var(--color-text-muted)',
                      padding: '12px 0',
                      fontSize: '14px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      gap: '8px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={18} />
                    <span>إلغاء التعديل</span>
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="checkout-btn"
                  style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Plus size={18} />
                  <span>حفظ التذكير الطبي</span>
                </button>
              )}

            </form>
          </div>

          {/* Left Panel: Active Schedules Listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', margin: '4px 0 0' }}>
              التذكيرات النشطة حالياً ({reminders.length})
            </h3>

            {isLoading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>جاري التحميل...</div>
            ) : reminders.length === 0 ? (
              <div style={{
                background: '#ffffff', border: '1px solid var(--color-border)',
                borderRadius: '16px', padding: '32px 20px', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  <Bell size={22} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>لا توجد تذكيرات مجدولة</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  لم تقم بتهيئة أي تذكير بالدواء بعد. أدخل أدوية علاجك في النموذج الجانبي لتصلك التنبيهات.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reminders.map((rem) => (
                  <div
                    key={rem.id || rem._id}
                    className={`reminder-active-card animate-fade-in ${editingReminderId === (rem.id || rem._id) ? 'editing' : ''}`}
                    style={{ opacity: rem.active ? 1 : 0.6 }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-text-main)' }}>
                          {rem.medicineName}
                        </span>
                        {rem.useWhatsapp && (
                          <span style={{ fontSize: '9px', background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', fontWeight: '800', padding: '2px 8px', borderRadius: '20px' }}>
                            تنبيه واتساب نشط
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <div>
                          <span>⏰ الموعد: </span>
                          <strong style={{ color: 'var(--color-text-main)' }}>{rem.time} ({rem.frequency})</strong>
                        </div>
                        <div>
                          <span>💊 الجرعة: </span>
                          <strong style={{ color: 'var(--color-text-main)' }}>{rem.dosage}</strong>
                        </div>
                        {rem.useWhatsapp && (
                          <div>
                            <span>📞 رقم الواتساب: </span>
                            <strong style={{ color: 'var(--color-text-main)', direction: 'ltr', display: 'inline-block' }}>{rem.phoneNumber}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Toggle switch active/inactive */}
                      <label className="reminder-switch">
                        <input
                          type="checkbox"
                          checked={rem.active}
                          onChange={() => toggleReminderActive(rem.id || rem._id)}
                        />
                        <span className="reminder-slider" />
                      </label>

                      {/* WhatsApp simulation trigger */}
                      {rem.useWhatsapp && rem.active && (
                        <button
                          onClick={() => triggerWhatsappSimulation(rem)}
                          className="action-icon-btn"
                          title="محاكاة إرسال تذكير واتساب"
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: '1px solid #25D366', color: '#25d366', background: 'rgba(37, 211, 102, 0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                          }}
                        >
                          <Smartphone size={16} />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => handleEditClick(rem)}
                        className="action-icon-btn"
                        title="تعديل التذكير"
                        style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid var(--color-border)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          cursor: 'pointer',
                          color: 'var(--color-primary)',
                          background: 'var(--color-primary-light)'
                        }}
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteReminder(rem.id || rem._id)}
                        className="action-icon-btn"
                        title="حذف التذكير"
                        style={{ width: '32px', height: '32px', border: '1px solid var(--color-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} style={{ color: '#e53935' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Simulated Phone Mockup WhatsApp alert modal */}
      {simulatedReminder && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} className="animate-fade-in">

            {/* Phone Frame Mockup container */}
            <div className="whatsapp-phone-mockup">

              {/* WhatsApp header */}
              <div className="whatsapp-chat-header">
                <button
                  onClick={() => setSimulatedReminder(null)}
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', padding: 0 }}
                >
                  ✕
                </button>
                <div className="whatsapp-avatar">D</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800' }}>دوايا للتذكير الطبي</h4>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>متصل الآن</span>
                </div>
              </div>

              {/* Chat history list */}
              <div className="whatsapp-chat-body">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  alignSelf: 'center',
                  fontSize: '10px',
                  color: '#667781',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.05)'
                }}>
                  اليوم
                </div>

                <div className="whatsapp-msg-bubble">
                  ⏰ *تذكير طبي من دوايا* ⏰
                  <br />
                  <br />
                  مرحباً! حان الآن موعد جرعة دواء:
                  <br />
                  💊 *{simulatedReminder.medicineName}*
                  <br />
                  🔹 الجرعة: *{simulatedReminder.dosage}*
                  <br />
                  📅 الموعد: *{simulatedReminder.time} ({simulatedReminder.frequency})*
                  <br />
                  <br />
                  نتمنى لك دوام الصحة والعافية! 💚
                  <span className="whatsapp-msg-time">
                    {simulatedReminder.time} ✓✓
                  </span>
                </div>
              </div>
            </div>

            {/* Info and exit button */}
            <div style={{
              background: '#0d1b2e', color: '#38bdf8', padding: '12px 20px', borderRadius: '12px',
              textAlign: 'center', fontSize: '13px', border: '1px solid #1e293b', maxWidth: '320px'
            }}>
              <span>تمت محاكاة إرسال رسالة التنبيه الطبية بنجاح إلى الرقم: </span>
              <strong style={{ color: '#fff', direction: 'ltr', display: 'inline-block' }}>{simulatedReminder.phoneNumber}</strong>
              <button
                onClick={() => setSimulatedReminder(null)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '8px 0', fontSize: '12px', marginTop: '12px', cursor: 'pointer', borderRadius: '8px' }}
              >
                إغلاق نافذة المحاكاة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
