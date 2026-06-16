import { useEffect, useState } from 'react';
import {
    getPharmacies,
    createPharmacy,
    updatePharmacy,
    deletePharmacy,
    togglePharmacy,
} from '../../services/api';

const EMPTY_FORM = {
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    image: '',
    rating: '',
    distance: '',
    estimatedTime: '',
    mapLink: '',
    services: '',
};

// ── helper: normalize any API shape to { list, total }
const parsePharmaciesResponse = (res) => {
    // res might be: { data: [...] } | { data: { data:[...], total:N } } | [...]
    if (Array.isArray(res)) return { list: res, total: res.length };
    if (Array.isArray(res?.data)) return { list: res.data, total: res.total ?? res.data.length };
    if (Array.isArray(res?.data?.data)) return { list: res.data.data, total: res.data.total ?? res.data.data.length };
    if (Array.isArray(res?.pharmacies)) return { list: res.pharmacies, total: res.total ?? res.pharmacies.length };
    return { list: [], total: 0 };
};

export default function Pharmacies() {
    const [pharmacies, setPharmacies] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    /* ───────── fetch ───────── */
    const fetchPharmacies = async () => {
        setLoading(true);
        try {
            const res = await getPharmacies({ page, limit: 10 });
            console.log('[Pharmacies] GET response:', res);       // ← هتشوف الـ shape هنا
            const { list, total: t } = parsePharmaciesResponse(res);
            setPharmacies(list);
            setTotal(t);
        } catch (err) {
            console.error('[Pharmacies] fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPharmacies(); }, [page]);

    /* ───────── modal helpers ───────── */
    const openCreate = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setFormError('');
        setModalOpen(true);
    };

    const openEdit = (pharmacy) => {
        setEditTarget(pharmacy);
        setForm({
            name: pharmacy.name || '',
            address: pharmacy.address || '',
            phone: pharmacy.phone || '',
            email: pharmacy.email || '',
            password: '',
            image: pharmacy.image || '',
            rating: pharmacy.rating ?? '',
            distance: pharmacy.distance || '',
            estimatedTime: pharmacy.estimatedTime || '',
            mapLink: pharmacy.mapLink || '',
            services: Array.isArray(pharmacy.services)
                ? pharmacy.services.join(', ')
                : pharmacy.services || '',
        });

        setFormError('');
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditTarget(null); };

    /* ───────── submit ───────── */
    const handleSubmit = async () => {
        if (!form.name.trim() || !form.address.trim() || !form.phone.trim()) {
            setFormError('الاسم والعنوان والهاتف مطلوبين');
            return;
        }
        if (!form.email.trim()) {
            setFormError('الإيميل مطلوب');
            return;
        }
        if (!editTarget && !form.password.trim()) {
            setFormError('كلمة المرور مطلوبة عند الإنشاء');
            return;
        }
        setSaving(true);
        setFormError('');
        try {
            const payload = {
                name: form.name,
                address: form.address,
                phone: form.phone,

                ...(form.email && { email: form.email }),

                ...(!editTarget && form.password
                    ? { password: form.password }
                    : {}),

                ...(editTarget && form.password
                    ? { password: form.password }
                    : {}),

                ...(form.image && { image: form.image }),

                ...(form.rating !== ''
                    ? { rating: Number(form.rating) }
                    : {}),

                ...(form.distance && {
                    distance: form.distance,
                }),

                ...(form.estimatedTime && {
                    estimatedTime: form.estimatedTime,
                }),

                ...(form.mapLink && {
                    mapLink: form.mapLink,
                }),

                ...(form.services && {
                    services: form.services
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean),
                }),
            };

            let res;
            if (editTarget) {
                res = await updatePharmacy(editTarget._id, payload);
                console.log('[Pharmacies] PUT response:', res);
            } else {
                res = await createPharmacy(payload);
                console.log('[Pharmacies] POST response:', res);
            }

            // لو السيرفر رجع error message جوّا الـ response
            if (res?.error || res?.message?.toLowerCase().includes('error')) {
                setFormError(res.message || 'حصل خطأ من السيرفر');
                return;
            }

            closeModal();
            fetchPharmacies();
        } catch (err) {
            console.error('[Pharmacies] submit error:', err);
            setFormError('حصل خطأ، تأكد من الاتصال بالسيرفر');
        } finally {
            setSaving(false);
        }
    };

    /* ───────── delete ───────── */
    const handleDelete = async (id) => {
        if (!confirm('متأكد إنك عايز تحذف الصيدلية دي؟')) return;
        try {
            const res = await deletePharmacy(id);
            console.log('[Pharmacies] DELETE response:', res);
            fetchPharmacies();
        } catch (err) {
            console.error('[Pharmacies] delete error:', err);
            alert('مش قادر يحذف، حاول تاني');
        }
    };

    /* ───────── toggle ───────── */
    const handleToggle = async (id) => {
        try {
            const res = await togglePharmacy(id);
            console.log('[Pharmacies] TOGGLE response:', res);
            // Optimistic update بدل ما ننتظر refetch
            setPharmacies(prev =>
                prev.map(p => p._id === id ? { ...p, isOpen: !p.isOpen } : p)
            );
        } catch (err) {
            console.error('[Pharmacies] toggle error:', err);
            fetchPharmacies(); // fallback
        }
    };

    /* ───────── filter client-side ───────── */
    const filtered = pharmacies.filter(p => {
        if (!search.trim()) return true;
        return (
            p.name?.includes(search) ||
            p.address?.includes(search) ||
            p.phone?.includes(search)
        );
    });

    const totalPages = Math.ceil(total / 10) || 1;

    /* ══════════════════════════════════════════ */
    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-main)' }}>
                        الصيدليات
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        إجمالي: {total} صيدلية
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: 'var(--color-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <span>+</span> إضافة صيدلية
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="بحث بالاسم أو العنوان أو الهاتف..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="form-input"
                    style={{ width: '300px' }}
                />
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

                <table className="w-full text-sm">
                    <thead>
                        <tr
                            style={{
                                background: 'var(--bg-primary)',
                                borderBottom: '1px solid var(--color-border)',
                            }}
                        >
                            {[
                                'الصيدلية',
                                'العنوان',
                                'الهاتف',
                                'التقييم',
                                'المسافة',
                                'وقت التوصيل',
                                'الحالة',
                                'إجراءات',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="text-right px-4 py-3 font-bold text-xs"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center py-12"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <i className="fas fa-spinner fa-spin ml-2"></i>
                                    جاري التحميل...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center py-12"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    مفيش صيدليات
                                </td>
                            </tr>
                        ) : (
                            filtered.map((ph, i) => (
                                <tr
                                    key={ph._id}
                                    style={{
                                        borderBottom: '1px solid var(--color-border)',
                                        background:
                                            i % 2 === 0
                                                ? 'var(--bg-card)'
                                                : 'var(--bg-primary)',
                                    }}
                                >
                                    {/* اسم الصيدلية */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                                                style={{
                                                    background: 'rgba(16,185,129,0.1)',
                                                    color: '#10b981',
                                                }}
                                            >
                                                <img src={ph.image} alt={ph.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                            </div>

                                            <span
                                                className="font-semibold"
                                                style={{ color: 'var(--color-text-main)' }}
                                            >
                                                {ph.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* العنوان */}
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {ph.address}
                                    </td>

                                    {/* الهاتف */}
                                    <td
                                        className="px-4 py-3"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                            direction: 'ltr',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {ph.phone}
                                    </td>

                                    {/* التقييم */}
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {ph.rating ?? '-'}
                                    </td>

                                    {/* المسافة */}
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {ph.distance ?? '-'}
                                    </td>

                                    {/* وقت التوصيل */}
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {ph.estimatedTime ?? '-'}
                                    </td>

                                    {/* الحالة */}
                                    <td className="px-4 py-3">
                                        <span
                                            className="text-xs px-3 py-1 rounded-full font-bold"
                                            style={
                                                ph.isOpen
                                                    ? {
                                                        background: 'rgba(16,185,129,0.1)',
                                                        color: '#10b981',
                                                    }
                                                    : {
                                                        background: 'rgba(239,68,68,0.1)',
                                                        color: '#ef4444',
                                                    }
                                            }
                                        >
                                            {ph.isOpen ? 'مفتوحة' : 'مغلقة'}
                                        </span>
                                    </td>

                                    {/* الإجراءات */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggle(ph._id)}
                                                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                                                style={
                                                    ph.isOpen
                                                        ? {
                                                            color: '#f59e0b',
                                                            background: 'rgba(245,158,11,0.1)',
                                                        }
                                                        : {
                                                            color: '#10b981',
                                                            background: 'rgba(16,185,129,0.1)',
                                                        }
                                                }
                                            >
                                                {ph.isOpen ? 'إغلاق' : 'فتح'}
                                            </button>

                                            <button
                                                onClick={() => openEdit(ph)}
                                                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                                                style={{
                                                    color: 'var(--color-primary)',
                                                    background: 'var(--color-primary-light)',
                                                }}
                                            >
                                                تعديل
                                            </button>

                                            <button
                                                onClick={() => handleDelete(ph._id)}
                                                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                                                style={{
                                                    color: 'var(--color-danger)',
                                                    background: 'var(--color-danger-light)',
                                                }}
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>



            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                    صفحة {page} من {totalPages}
                </p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-1.5 text-sm rounded-lg font-semibold transition-all disabled:opacity-40"
                        style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--bg-card)' }}>
                        السابق
                    </button>
                    <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                        className="px-4 py-1.5 text-sm rounded-lg font-semibold transition-all disabled:opacity-40"
                        style={{ background: 'var(--color-primary)', color: 'white' }}>
                        التالي
                    </button>
                </div>
            </div>

            {/* ─── Modal ─── */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.45)' }}
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="card w-full max-w-lg mx-4 overflow-y-auto" style={{ padding: '28px', maxHeight: '90vh' }}>
                        <h2 className="text-lg font-extrabold mb-5" style={{ color: 'var(--color-text-main)' }}>
                            {editTarget ? 'تعديل الصيدلية' : 'إضافة صيدلية جديدة'}
                        </h2>

                        <div className="space-y-4">

                            {/* ── الاسم ── */}
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    الاسم *
                                </label>
                                <input
                                    className="form-input w-full"
                                    placeholder="صيدلية النور"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                />
                            </div>

                            {/* ── العنوان ── */}
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    العنوان *
                                </label>
                                <input
                                    className="form-input w-full"
                                    placeholder="شارع التحرير، القاهرة"
                                    value={form.address}
                                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                />
                            </div>

                            {/* ── الهاتف ── */}
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    الهاتف *
                                </label>
                                <input
                                    className="form-input w-full"
                                    placeholder="01012345678"
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    style={{ direction: 'ltr', textAlign: 'right' }}
                                />
                            </div>

                            {/* ── الإيميل + الباسورد ── */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                        الإيميل *
                                    </label>
                                    <input
                                        className="form-input w-full"
                                        placeholder="pharmacy@example.com"
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        style={{ direction: 'ltr' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                        {editTarget ? 'كلمة المرور (اتركها فارغة للإبقاء)' : 'كلمة المرور *'}
                                    </label>
                                    <input
                                        className="form-input w-full"
                                        placeholder={editTarget ? '••••••••' : 'أدخل كلمة المرور'}
                                        type="password"
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        style={{ direction: 'ltr' }}
                                    />
                                </div>
                            </div>

                            {/* ── الصورة ── */}
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    رابط الصورة
                                </label>
                                <input
                                    className="form-input w-full"
                                    placeholder="/images/pharmacies/example.png"
                                    value={form.image}
                                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* ── التقييم + المسافة ── */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                        التقييم (0 - 5)
                                    </label>
                                    <input
                                        className="form-input w-full"
                                        placeholder="4.8"
                                        type="number"
                                        min="0" max="5" step="0.1"
                                        value={form.rating}
                                        onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
                                        style={{ direction: 'ltr' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                        المسافة
                                    </label>
                                    <input
                                        className="form-input w-full"
                                        placeholder="9.2 KM"
                                        value={form.distance}
                                        onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
                                        style={{ direction: 'ltr' }}
                                    />
                                </div>
                            </div>

                            {/* ── وقت التوصيل + رابط الخريطة ── */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                        الوقت المتوقع
                                    </label>
                                    <input
                                        className="form-input w-full"
                                        placeholder="25 دقيقة"
                                        value={form.estimatedTime}
                                        onChange={e => setForm(f => ({ ...f, estimatedTime: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                        رابط الخريطة
                                    </label>
                                    <input
                                        className="form-input w-full"
                                        placeholder="https://maps.google.com/..."
                                        value={form.mapLink}
                                        onChange={e => setForm(f => ({ ...f, mapLink: e.target.value }))}
                                        style={{ direction: 'ltr' }}
                                    />
                                </div>
                            </div>

                            {/* ── الخدمات ── */}
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    الخدمات <span style={{ fontWeight: 400 }}>(افصل بفاصلة: Parking, 24h)</span>
                                </label>
                                <input
                                    className="form-input w-full"
                                    placeholder="Parking, 24h"
                                    value={form.services}
                                    onChange={e => setForm(f => ({ ...f, services: e.target.value }))}
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {formError && (
                                <p className="text-xs font-semibold px-3 py-2 rounded-lg"
                                    style={{ color: 'var(--color-danger)', background: 'var(--color-danger-light)' }}>
                                    ⚠️ {formError}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                                style={{ background: 'var(--color-primary)' }}
                            >
                                {saving ? 'جاري الحفظ...' : editTarget ? 'حفظ التعديلات' : 'إضافة'}
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                                style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--bg-card)' }}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}