import { useEffect, useState } from 'react';
import { getStats, getUsers, getOrders } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#1ab5ea', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        getStats(),
        getUsers({ limit: 100 }),
        getOrders({ limit: 100 })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data?.data || []);
      setOrders(ordersRes.data?.data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'var(--color-text-muted)' }}>
      <i className="fas fa-spinner fa-spin ml-2"></i> جاري التحميل...
    </div>
  );

  const roleData = [
    { name: 'Users', value: users.filter(u => u.role === 'user').length },
    { name: 'Pharmacists', value: users.filter(u => u.role === 'pharmacist').length },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ];

  const orderStatusData = [
    { name: 'معلق', value: orders.filter(o => o.status === 'pending').length },
    { name: 'مؤكد', value: orders.filter(o => o.status === 'confirmed').length },
    { name: 'تم التوصيل', value: orders.filter(o => o.status === 'delivered').length },
    { name: 'ملغي', value: orders.filter(o => o.status === 'cancelled').length },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    return {
      day: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
      مستخدمين: users.filter(u => u.createdAt?.startsWith(dateStr)).length,
      طلبات: orders.filter(o => o.createdAt?.startsWith(dateStr)).length,
    };
  });

  const statCards = [
    { label: 'المستخدمين', value: stats?.users || 0, icon: '👥', color: '#1ab5ea', bg: 'rgba(26,181,234,0.08)' },
    { label: 'الصيدليات', value: stats?.pharmacies || 0, icon: '🏪', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'الطلبات', value: stats?.orders || 0, icon: '🛒', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: 'طلبات معلقة', value: orderStatusData[0].value, icon: '⏳', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  ];

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                {card.label}
              </span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <p className="text-3xl font-extrabold" style={{ color: 'var(--color-text-main)' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Line Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--color-text-main)' }}>
            نشاط آخر 7 أيام
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'Cairo' }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontFamily: 'Cairo', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: '12px' }} />
              <Line type="monotone" dataKey="مستخدمين" stroke="#1ab5ea" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="طلبات" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--color-text-main)' }}>
            توزيع المستخدمين بالدور
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={{ stroke: 'var(--color-border)' }}>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: 'Cairo', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--color-text-main)' }}>
          حالة الطلبات
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={orderStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Cairo' }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ fontFamily: 'Cairo', borderRadius: '12px' }} />
            <Bar dataKey="value" name="عدد الطلبات" radius={[8, 8, 0, 0]}>
              {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}