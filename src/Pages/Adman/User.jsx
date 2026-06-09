import { useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (roleFilter) params.role = roleFilter;
    const data = await getUsers(params);
    setUsers(data.data?.data || []);
    setTotal(data.data?.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm('متأكد إنك عايز تحذف اليوزر ده؟')) return;
    await deleteUser(id);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const styles = {
      admin: { background: 'rgba(99,102,241,0.1)', color: '#6366f1' },
      pharmacist: { background: 'rgba(26,181,234,0.1)', color: '#1ab5ea' },
      user: { background: 'rgba(16,185,129,0.1)', color: '#10b981' },
    };
    return styles[role] || styles.user;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-main)' }}>
            المستخدمين
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            إجمالي: {total} مستخدم
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="بحث باسم أو إيميل..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          style={{ width: '260px' }}
        />
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="form-input"
          style={{ width: 'auto' }}
        >
          <option value="">كل الأدوار</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
              {['المستخدم', 'الإيميل', 'الدور', 'تاريخ التسجيل', 'إجراءات'].map(h => (
                <th key={h} className="text-right px-4 py-3 font-bold text-xs"
                  style={{ color: 'var(--color-text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                <i className="fas fa-spinner fa-spin ml-2"></i> جاري التحميل...
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                مفيش مستخدمين
              </td></tr>
            ) : filtered.map((user, i) => (
              <tr key={user._id}
                style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-primary)' }}>

                {/* Avatar + Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #0ea5e9 100%)' }}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--color-text-main)' }}>
                      {user.username}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {user.email}
                </td>

                {/* Role Select */}
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className="text-xs px-3 py-1 rounded-full font-bold border-0 outline-none cursor-pointer"
                    style={roleBadge(user.role)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                </td>

                {/* Delete */}
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(user._id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                    style={{ color: 'var(--color-danger)', background: 'var(--color-danger-light)' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
          صفحة {page} من {Math.ceil(total / 10) || 1}
        </p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-1.5 text-sm rounded-lg font-semibold transition-all disabled:opacity-40"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--bg-card)' }}>
            السابق
          </button>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)}
            className="px-4 py-1.5 text-sm rounded-lg font-semibold transition-all disabled:opacity-40"
            style={{ background: 'var(--color-primary)', color: 'white' }}>
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}