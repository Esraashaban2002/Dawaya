import { useState, useEffect } from 'react';
import { getPharmacyProfile, updatePharmacyProfile } from '../../services/api';

export default function PharmacyProfile() {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    phone: '',

  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getPharmacyProfile();
      
      if (response && response.data) {
        const { name, address, phone } = response.data;
        setProfile({
          name: name || '',
          address: address || '',
          phone: phone || '',
        });
      } else {
        throw new Error('بيانات غير صالحة من الخادم');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {

      await updatePharmacyProfile(profile);
      setMessage({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح' });

      await fetchProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">خطأ: {error}</div>;
  }

  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
        الملف الشخصي للصيدلية
      </h2>

      {message.text && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            اسم الصيدلية
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--bg-input)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            العنوان
          </label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--bg-input)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            رقم الهاتف
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--bg-input)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
          }}
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>
    </div>
  );
}