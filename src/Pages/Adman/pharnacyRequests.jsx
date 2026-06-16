import { useEffect, useState } from 'react';
import {
  getPharmacyRequests,
  updatePharmacyRequestStatus,
  deletePharmacyRequest,
} from '../../services/api';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];

const statusMeta = {
  pending:  { label: 'قيد المراجعة', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  approved: { label: 'مقبول',        color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  rejected: { label: 'مرفوض',        color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
};

// ── helper: normalize any API shape to { list, total } ──
const parseRequestsResponse = (res) => {
  if (Array.isArray(res))             return { list: res,           total: res.length };
  if (Array.isArray(res?.data))       return { list: res.data,      total: res.total ?? res.data.length };
  if (Array.isArray(res?.data?.data)) return { list: res.data.data, total: res.data.total ?? res.data.data.length };
  return { list: [], total: 0 };
};

const StatusBadge = ({ status }) => {
  const meta = statusMeta[status] || statusMeta.pending;
  return (
    <span className="text-xs px-3 py-1 rounded-full font-bold"
      style={{ background: meta.bg, color: meta.color }}>
      {meta.label}
    </span>
  );
};

export default function PharmacyRequests() {
  const [requests, setRequests]       = useState([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected]       = useState(null);
  const [updatingId, setUpdatingId]   = useState(null);

  const [noteModal, setNoteModal] = useState(null); 
  const [noteText, setNoteText]   = useState('');

  /*  fetch  */
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await getPharmacyRequests(params);
      console.log('[PharmacyRequests] GET response:', res);
      const { list, total: t } = parseRequestsResponse(res);
      setRequests(list);
      setTotal(t);
    } catch (err) {
      console.error('[PharmacyRequests] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [page, statusFilter]);

  /*  status update  */
  const applyStatusChange = async (id, newStatus, adminNote = '') => {
    setUpdatingId(id);
    try {
      const res = await updatePharmacyRequestStatus(id, newStatus, adminNote);
      console.log('[PharmacyRequests] PATCH status response:', res);

      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus, adminNote } : r));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: newStatus, adminNote }));
    } catch (err) {
      console.error('[PharmacyRequests] status update error:', err);
      alert('مش قادر يحدث الحالة، حاول تاني');
      fetchRequests();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApprove = (id) => applyStatusChange(id, 'approved');

  const handleRejectClick = (id) => {
    setNoteText('');
    setNoteModal({ id });
  };

  const confirmReject = async () => {
    if (!noteModal) return;
    await applyStatusChange(noteModal.id, 'rejected', noteText);
    setNoteModal(null);
  };

  /*  delete  */
  const handleDelete = async (id) => {
    if (!confirm('متأكد إنك عايز تحذف الطلب ده؟')) return;
    try {
      await deletePharmacyRequest(id);
      fetchRequests();
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      console.error('[PharmacyRequests] delete error:', err);
      alert('مش قادر يحذف، حاول تاني');
    }
  };

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-main)' }}>
            طلبات انضمام الصيدليات
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            إجمالي: {total} طلب
          </p>
        </div>
      </div>

      {/* Status filter buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => { setStatusFilter(''); setPage(1); }}
          className="px-4 py-1.5 text-sm rounded-xl font-semibold transition-all"
          style={!statusFilter
            ? { background: 'var(--color-primary)', color: 'white' }
            : { border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--bg-card)' }
          }
        >
          الكل
        </button>
        {STATUS_OPTIONS.map(s => {
          const meta = statusMeta[s];
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="px-4 py-1.5 text-sm rounded-xl font-semibold transition-all"
              style={active
                ? { background: meta.color, color: 'white' }
                : { border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--bg-card)' }
              }
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
              {['الصيدلية', 'المدير', 'منطقة التوصيل', 'الهاتف', 'الحالة', 'تاريخ الطلب', 'إجراءات'].map(h => (
                <th key={h} className="text-right px-4 py-3 font-bold text-xs"
                  style={{ color: 'var(--color-text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                <i className="fas fa-spinner fa-spin ml-2"></i> جاري التحميل...
              </td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                مفيش طلبات
              </td></tr>
            ) : requests.map((req, i) => (
              <tr key={req._id}
                style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-primary)' }}>

                {/* Pharmacy name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                      🏪
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--color-text-main)' }}>
                      {req.pharmacyName}
                    </span>
                  </div>
                </td>

                {/* Manager */}
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  <div>{req.managerName}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-light)', direction: 'ltr', textAlign: 'right' }}>
                    {req.managerEmail}
                  </div>
                </td>

                {/* Delivery area */}
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {req.deliveryArea}
                </td>

                {/* Phone */}
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-muted)', direction: 'ltr', textAlign: 'right' }}>
                  {req.pharmacyPhone}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {req.createdAt ? new Date(req.createdAt).toLocaleDateString('ar-EG') : '—'}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={updatingId === req._id}
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50"
                          style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => handleRejectClick(req._id)}
                          disabled={updatingId === req._id}
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50"
                          style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                        >
                          رفض
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setSelected(req)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                      style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}
                    >
                      تفاصيل
                    </button>

                    <button
                      onClick={() => handleDelete(req._id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                      style={{ color: 'var(--color-danger)', background: 'var(--color-danger-light)' }}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

      {/*  Request Detail Modal  */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="card w-full max-w-lg mx-4 overflow-y-auto" style={{ padding: '28px', maxHeight: '85vh' }}>

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold" style={{ color: 'var(--color-text-main)' }}>
                طلب صيدلية: {selected.pharmacyName}
              </h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ color: 'var(--color-text-muted)', background: 'var(--bg-primary)' }}>
                ✕
              </button>
            </div>

            {/* Status + quick actions */}
            <div className="flex items-center gap-3 mb-5 p-4 rounded-xl flex-wrap" style={{ background: 'var(--bg-primary)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>الحالة:</span>
              <StatusBadge status={selected.status} />
              {selected.status === 'pending' && (
                <div className="flex gap-2 mr-auto">
                  <button
                    onClick={() => handleApprove(selected._id)}
                    disabled={updatingId === selected._id}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50"
                    style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}
                  >
                    قبول الطلب
                  </button>
                  <button
                    onClick={() => handleRejectClick(selected._id)}
                    disabled={updatingId === selected._id}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50"
                    style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                  >
                    رفض الطلب
                  </button>
                </div>
              )}
              {updatingId === selected._id && (
                <i className="fas fa-spinner fa-spin text-xs" style={{ color: 'var(--color-primary)' }}></i>
              )}
            </div>

            {/* Admin note */}
            {selected.adminNote && (
              <div className="mb-5 p-3 rounded-xl" style={{ background: 'var(--color-danger-light)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-danger)' }}>ملاحظة الإدارة:</p>
                <p className="text-sm" style={{ color: 'var(--color-text-main)' }}>{selected.adminNote}</p>
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'اسم الصيدلية',     value: selected.pharmacyName },
                { label: 'تليفون الصيدلية',  value: selected.pharmacyPhone },
                { label: 'منطقة التوصيل',    value: selected.deliveryArea },
                { label: 'مواعيد العمل',     value: selected.workingHours },
                { label: 'اسم المدير',       value: selected.managerName },
                { label: 'تليفون المدير',    value: selected.managerPhone },
                { label: 'إيميل المدير',     value: selected.managerEmail },
                { label: 'تاريخ الطلب',      value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('ar-EG') : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)', wordBreak: 'break-word' }}>
                    {value || '—'}
                  </p>
                </div>
              ))}
            </div>

            {/* Documents */}
            {selected.documents && (selected.documents.commercialRegister || selected.documents.taxCard || selected.documents.pharmacyLicense) && (
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-muted)' }}>
                  المستندات المرفقة
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'commercialRegister', label: 'سجل تجاري' },
                    { key: 'taxCard',             label: 'بطاقة ضريبية' },
                    { key: 'pharmacyLicense',     label: 'رخصة صيدلية' },
                  ].filter(d => selected.documents[d.key]).map(d => (
                    <div key={d.key} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: 'var(--bg-primary)', border: '1px solid var(--color-border)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: 'rgba(26,181,234,0.1)', color: '#1ab5ea' }}>
                        📄
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>{d.label}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{selected.documents[d.key]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-6 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--bg-card)' }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/*  Reject Reason Modal  */}
      {noteModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setNoteModal(null); }}
        >
          <div className="card w-full max-w-md mx-4" style={{ padding: '24px' }}>
            <h3 className="text-base font-extrabold mb-4" style={{ color: 'var(--color-text-main)' }}>
              سبب الرفض
            </h3>
            <textarea
              className="form-input w-full"
              style={{ minHeight: '90px', resize: 'vertical' }}
              placeholder="اكتب سبب رفض الطلب (اختياري)..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={confirmReject}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: '#ef4444' }}
              >
                تأكيد الرفض
              </button>
              <button
                onClick={() => setNoteModal(null)}
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