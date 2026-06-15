import React, { useState } from 'react';
import { User, Shield, Lock, MapPin, X } from 'lucide-react';

/* 1. Edit Profile Modal */
export function EditProfileModal({ profile, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...profile });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Auto-sync fullName to username since Full Name display is removed
    formData.fullName = formData.username;

    // Validate Username
    if (formData.username.trim().length < 2) {
      setValidationError('اسم المستخدم يجب ألا يقل عن حرفين');
      return;
    }
    if (formData.username.trim().length > 12) {
      setValidationError('اسم المستخدم يجب ألا يزيد عن 12 حرفاً');
      return;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('البريد الإلكتروني غير صحيح');
      return;
    }

    // Validate Phone Number (Egyptian format)
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setValidationError('رقم الهاتف غير صحيح. يجب أن يكون رقم هاتف مصري صحيح (مثال: 01012345678)');
      return;
    }

    // Validate Age
    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum <= 0 || ageNum > 120) {
      setValidationError('يرجى إدخال عمر صحيح (عدد صحيح) بين 1 و 120 سنة');
      return;
    }



    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div className="modal-title">
            <User size={20} className="text-primary" style={{ color: 'var(--color-primary)' }} />
            <span>تعديل الملف الشخصي</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body">
          {validationError && (
            <div style={{
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {validationError}
            </div>
          )}


          <div className="form-group">
            <label className="form-label">اسم المستخدم</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني (لا يمكن تعديله)</label>
            <input
              type="email"
              name="email"
              className="form-input"
              style={{ direction: 'ltr', textAlign: 'left', backgroundColor: '#e2e8f0', cursor: 'not-allowed' }}
              value={formData.email}
              disabled
              required
            />
          </div>



          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              style={{ direction: 'ltr', textAlign: 'left' }}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">العمر</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="age"
                className="form-input"
                value={formData.age}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({ ...prev, age: val }));
                  setValidationError('');
                }}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">الجنس</label>
              <select
                name="gender"
                className="form-input"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">غير محدد</option>
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            إلغاء
          </button>
          <button type="submit" className="btn btn-primary">
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}

/* 2. Change Password Modal */
export function ChangePasswordModal({ storedPassword, onSave, onClose }) {
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (storedPassword && passwords.current !== storedPassword) {
      setError('كلمة المرور الحالية غير صحيحة.');
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      setError('كلمتا المرور الجديدتان غير متطابقتين.');
      return;
    }
    if (passwords.newPass.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
      return;
    }
    onSave(passwords.current, passwords.newPass);
  };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div className="modal-title">
            <Lock size={20} style={{ color: 'var(--color-primary)' }} />
            <span>تغيير كلمة المرور</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">كلمة المرور الحالية</label>
            <input
              type="password"
              name="current"
              className="form-input"
              value={passwords.current}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور الجديدة</label>
            <input
              type="password"
              name="newPass"
              className="form-input"
              value={passwords.newPass}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              name="confirmPass"
              className="form-input"
              value={passwords.confirmPass}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            إلغاء
          </button>
          <button type="submit" className="btn btn-primary">
            تحديث كلمة المرور
          </button>
        </div>
      </form>
    </div>
  );
}

/* 3. Location Modal (Add / Edit Location) */
export function LocationModal({ location, onSave, onClose }) {
  const [formData, setFormData] = useState(
    location || { title: '', type: 'home', address: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div className="modal-title">
            <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
            <span>{location ? 'تعديل الموقع المحفوظ' : 'إضافة موقع جديد'}</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">اسم الموقع (مثال: المنزل، العمل، العيادة)</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: النادي، عيادة الأسنان"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">نوع الموقع</label>
            <select
              name="type"
              className="form-input"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="home">المنزل (أيقونة سكنية)</option>
              <option value="work">العمل (أيقونة حقيبة عمل)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">العنوان الكامل بالتفصيل</label>
            <textarea
              name="address"
              className="form-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={formData.address}
              onChange={handleChange}
              placeholder="اكتب العنوان هنا بالتفصيل (مثل: 123 طريق العيادات، نيويورك)..."
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            إلغاء
          </button>
          <button type="submit" className="btn btn-primary">
            حفظ الموقع
          </button>
        </div>
      </form>
    </div>
  );
}

