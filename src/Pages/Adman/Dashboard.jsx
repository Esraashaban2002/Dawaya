import { useEffect, useState } from "react";
import { getStats, getUsers, getPharmacyRequests } from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Users, Store, ShoppingCart, Clock, Activity } from 'lucide-react';

// ── helper: normalize any API shape to a flat array ──
const extractList = (res) => {
  if (Array.isArray(res))             return res;
  if (Array.isArray(res?.data))       return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, requestsRes] = await Promise.all([
          getStats(),
          getUsers({ limit: 100 }),
          getPharmacyRequests({ limit: 100 }),
        ]);
        setStats(statsRes.data);
        setUsers(extractList(usersRes));
        setRequests(extractList(requestsRes));
      } catch (err) {
        console.error("[Dashboard] fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div
        className="flex items-center justify-center h-64 text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        <i className="fas fa-spinner fa-spin ml-2"></i> جاري التحميل...
      </div>
    );

    const COLORS = ['#1ab5ea', '#10b981', '#f59e0b', '#ef4444'];
  const roleData = [
    { name: "Users", value: users.filter((u) => u.role === "user").length },
    {
      name: "Pharmacists",
      value: users.filter((u) => u.role === "pharmacist").length,
    },
    { name: "Admins", value: users.filter((u) => u.role === "admin").length },
  ];

  const requestStatusData = [
    {
      name: "قيد المراجعة",
      value: requests.filter((r) => r.status === "pending").length,
    },
    {
      name: "مقبول",
      value: requests.filter((r) => r.status === "approved").length,
    },
    {
      name: "مرفوض",
      value: requests.filter((r) => r.status === "rejected").length,
    },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];
    return {
      day: date.toLocaleDateString("ar-EG", { weekday: "short" }),
      مستخدمين: users.filter((u) => u.createdAt?.startsWith(dateStr)).length,
      "طلبات صيدليات": requests.filter((r) => r.createdAt?.startsWith(dateStr))
        .length,
    };
  });

  const statCards = [
    { label: 'المستخدمين', value: stats?.users || 0, icon: Users, color: '#1ab5ea', bg: 'rgba(26,181,234,0.08)' },
    { label: 'الصيدليات', value: stats?.pharmacies || 0, icon: Store, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'الطلبات', value: stats?.orders || 0, icon: ShoppingCart, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: 'طلبات معلقة', value: requestStatusData[0].value, icon: Clock, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  ];
  
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div 
            key={i} 
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div 
              className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full opacity-5 group-hover:scale-150 transition-all duration-500" 
              style={{ backgroundColor: card.color }}
            />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500">
                {card.label}
              </span>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: card.bg, color: card.color }}
              >
                <card.icon size={20} className="transition-transform group-hover:scale-110" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-1.5 mt-2">
              <p className="text-3xl font-black text-slate-800 tracking-tight">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <h3 className="font-black mb-6 text-base text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Activity className="w-5 h-5 text-[#1ab5ea]" />
            <span>نشاط آخر 7 أيام</span>
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'Cairo', fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  fontFamily: 'Cairo', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' 
                }} 
              />
              <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Line type="monotone" name="مستخدمين مسجلين" dataKey="مستخدمين" stroke="#1ab5ea" strokeWidth={3} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="طلبات جديدة" dataKey="طلبات" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <h3 className="font-black mb-6 text-base text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Users className="w-5 h-5 text-[#10b981]" />
            <span>توزيع المستخدمين بالدور</span>
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie 
                data={roleData} 
                cx="50%" 
                cy="45%" 
                innerRadius={60} 
                outerRadius={82} 
                paddingAngle={4}
                dataKey="value"
              >
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  fontFamily: 'Cairo', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                }} 
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value, entry) => {
                  const item = roleData.find(d => d.name === value);
                  let labelName = value;
                  if (value === 'Users') labelName = 'عملاء';
                  else if (value === 'Pharmacists') labelName = 'صيادلة';
                  else if (value === 'Admins') labelName = 'مدراء النظام';
                  return <span style={{ color: '#475569', fontWeight: 700, fontFamily: 'Cairo', fontSize: '11px' }}>{labelName} ({item ? item.value : 0})</span>;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3 className="font-black mb-6 text-base text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
          <ShoppingCart className="w-5 h-5 text-[#f59e0b]" />
          <span>حالة الطلبات الحالية</span>
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={requestStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Cairo', fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                fontFamily: 'Cairo', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
              }} 
            />
            <Bar dataKey="value" name="عدد الطلبات" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {requestStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}