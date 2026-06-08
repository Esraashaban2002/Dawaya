import { useEffect, useState } from "react";
import { getUsers, updateUserRole, deleteUser } from "../../services/api";

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
     console.log(data)
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">المستخدمين</h1>
          <p className="text-sm text-gray-500 mt-1">إجمالي: {total} مستخدم</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="بحث باسم أو إيميل..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">كل الأدوار</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">المستخدم</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">الإيميل</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">الدور</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">تاريخ التسجيل</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">جاري التحميل...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">مفيش مستخدمين</td>
              </tr>
            ) : filtered.map(user => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                {/* Avatar + Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-medium text-sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{user.username}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-gray-500">{user.email}</td>

                {/* Role */}
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border font-medium focus:outline-none
                      ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'pharmacist' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-green-50 text-green-700 border-green-200'}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 text-xs px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
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
        <p className="text-sm text-gray-400">
          صفحة {page} من {Math.ceil(total / 10)}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            السابق
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 10)}
            className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}