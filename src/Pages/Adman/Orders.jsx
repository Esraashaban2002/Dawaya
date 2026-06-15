import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../services/api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'delivered', 'cancelled'];

const statusMeta = {
  pending:   { label: 'معلق',       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  confirmed: { label: 'مؤكد',       color: '#1ab5ea', bg: 'rgba(26,181,234,0.1)'  },
  delivered: { label: 'تم التوصيل', color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  cancelled: { label: 'ملغي',       color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  // Detail drawer
  const [selected, setSelected] = useState(null);

  /* ───────── fetch ───────── */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const data = await getOrders(params);
      setOrders(data.data?.data || data.data || []);
      setTotal(data.data?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  /* ───────── status update ───────── */
  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    // update local state optimistically
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
    if (selected?._id === id) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  const totalPages = Math.ceil(total / 10) || 1;

  /* ══════════════════════════════════════════ */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-main)' }}>
            الطلبات
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            إجمالي: {total} طلب
          </p>
        </div>
      </div>

      {/* Status filter */}
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
              {['رقم الطلب', 'العميل', 'الصيدلية', 'المبلغ', 'الحالة', 'التاريخ', 'إجراءات'].map(h => (
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
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                مفيش طلبات
              </td></tr>
            ) : orders.map((order, i) => (
              <tr key={order._id}
                style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-primary)' }}>

                {/* Order ID */}
                <td className="px-4 py-3">
                  <span className="text-xs font-mono px-2 py-1 rounded-lg"
                    style={{ background: 'var(--bg-primary)', color: 'var(--color-text-muted)' }}>
                    #{order._id?.slice(-6).toUpperCase()}
                  </span>
                </td>

                {/* Customer */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #0ea5e9 100%)' }}>
                      {(order.user?.username || order.userId?.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: 'var(--color-text-main)' }}>
                      {order.user?.username || order.userId?.username || 'مجهول'}
                    </span>
                  </div>
                </td>

                {/* Pharmacy */}
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {order.pharmacy?.name || order.pharmacyId?.name || '—'}
                </td>

                {/* Total */}
                <td className="px-4 py-3 font-bold" style={{ color: 'var(--color-text-main)' }}>
                  {order.totalPrice != null ? `${order.totalPrice} ج` : '—'}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '—'}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* Status quick-change */}
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg font-semibold border-0 outline-none cursor-pointer"
                      style={{ background: 'var(--bg-primary)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{statusMeta[s].label}</option>
                      ))}
                    </select>

                    {/* Details */}
                    <button
                      onClick={() => setSelected(order)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                      style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      تفاصيل
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

      {/* ─── Order Detail Drawer ─── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="card w-full max-w-lg mx-4 overflow-y-auto" style={{ padding: '28px', maxHeight: '85vh' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold" style={{ color: 'var(--color-text-main)' }}>
                تفاصيل الطلب #{selected._id?.slice(-6).toUpperCase()}
              </h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{ color: 'var(--color-text-muted)', background: 'var(--bg-primary)' }}>
                ✕
              </button>
            </div>

            {/* Status change */}
            <div className="flex items-center gap-3 mb-5 p-4 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>الحالة:</span>
              <StatusBadge status={selected.status} />
              <select
                value={selected.status}
                onChange={e => handleStatusChange(selected._id, e.target.value)}
                className="mr-auto text-xs px-3 py-1.5 rounded-lg font-semibold border-0 outline-none cursor-pointer"
                style={{ background: 'var(--bg-card)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{statusMeta[s].label}</option>
                ))}
              </select>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: 'العميل', value: selected.user?.username || selected.userId?.username || 'مجهول' },
                { label: 'الصيدلية', value: selected.pharmacy?.name || selected.pharmacyId?.name || '—' },
                { label: 'الهاتف', value: selected.user?.phone || selected.phone || '—' },
                { label: 'تاريخ الطلب', value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('ar-EG') : '—' },
                { label: 'العنوان', value: selected.deliveryAddress || selected.address || '—' },
                { label: 'إجمالي المبلغ', value: selected.totalPrice != null ? `${selected.totalPrice} ج` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Items */}
            {(selected.items || selected.orderItems || []).length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-muted)' }}>
                  الأدوية / المنتجات
                </h3>
                <div className="space-y-2">
                  {(selected.items || selected.orderItems).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: 'var(--bg-primary)', border: '1px solid var(--color-border)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                          style={{ background: 'rgba(26,181,234,0.1)', color: '#1ab5ea' }}>
                          💊
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
                            {item.medicine?.name || item.name || 'منتج'}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            الكمية: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>
                        {item.price != null ? `${item.price} ج` : ''}
                      </span>
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
    </div>
  );
}