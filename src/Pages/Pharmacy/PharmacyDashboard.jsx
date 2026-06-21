import { useState, useEffect } from "react";
import { getPharmacyStats, getPharmacyOrders } from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PharmacyDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalStock: 0,
    lowStock: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const [allOrders, setAllOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [chartPeriod, setChartPeriod] = useState("week");
  const [chartData, setChartData] = useState([]);

  const [topMedicines, setTopMedicines] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (allOrders.length > 0) {
      generateChartData(chartPeriod);
      generateTopMedicines();
    }
  }, [chartPeriod, allOrders]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await getPharmacyStats();
      const data = response.data || response;
      setStats({
        totalOrders: data.totalOrders ?? 0,
        pendingOrders: data.pendingOrders ?? 0,
        totalStock: data.totalStock ?? 0,
        lowStock: data.lowStock ?? 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAllOrders = async () => {
    try {
      setLoadingOrders(true);

      const response = await getPharmacyOrders({ limit: 100, page: 1 });

      let orders = [];
      if (response.data && Array.isArray(response.data.data)) {
        orders = response.data.data;
      } else if (Array.isArray(response.data)) {
        orders = response.data;
      } else if (Array.isArray(response)) {
        orders = response;
      } else {
        orders = [];
      }
      setAllOrders(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setAllOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const generateChartData = (period) => {
    if (allOrders.length === 0) {
      setChartData([]);
      return;
    }

    const now = new Date();
    let filteredOrders = [];
    let groupBy;

    switch (period) {
      case "week":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        filteredOrders = allOrders.filter(
          (order) => new Date(order.date) >= sevenDaysAgo,
        );
        groupBy = "day";
        break;
      case "month":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        filteredOrders = allOrders.filter(
          (order) => new Date(order.date) >= thirtyDaysAgo,
        );
        groupBy = "day";
        break;
      case "6months":
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        filteredOrders = allOrders.filter(
          (order) => new Date(order.date) >= sixMonthsAgo,
        );
        groupBy = "month";
        break;
      case "year":
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filteredOrders = allOrders.filter(
          (order) => new Date(order.date) >= oneYearAgo,
        );
        groupBy = "month";
        break;
      default:
        filteredOrders = allOrders;
        groupBy = "day";
    }

    const salesMap = new Map();

    filteredOrders.forEach((order) => {
      const date = new Date(order.date);
      let key;
      if (groupBy === "day") {
        key = date.toLocaleDateString("ar-EG");
      } else {
        key = date.toLocaleDateString("ar-EG", {
          month: "long",
          year: "numeric",
        });
      }
      const total = order.total || order.totalAmount || 0;
      salesMap.set(key, (salesMap.get(key) || 0) + total);
    });

    const chartArray = Array.from(salesMap.entries()).map(([name, sales]) => ({
      name,
      sales,
    }));

    chartArray.sort((a, b) => new Date(a.name) - new Date(b.name));
    setChartData(chartArray);
  };

  const generateTopMedicines = () => {
    const medicineSales = new Map();

    allOrders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const name = item.medicineName || item.name;
          if (name) {
            const qty = item.quantity || 1;
            medicineSales.set(name, (medicineSales.get(name) || 0) + qty);
          }
        });
      }
    });

    if (medicineSales.size === 0) {
      setTopMedicines([{ name: "لا توجد بيانات كافية", salesCount: 0 }]);
      return;
    }

    const sorted = Array.from(medicineSales.entries())
      .map(([name, salesCount]) => ({ name, salesCount }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 10);
    setTopMedicines(sorted);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "قيد الانتظار";
      case "confirmed":
        return "مؤكد";
      case "shipped":
        return "تم الشحن";
      case "delivered":
        return "تم التوصيل";
      case "cancelled":
        return "ملغي";
      default:
        return status || "غير معروف";
    }
  };

  if (loadingStats) {
    return <div className="text-center py-10">جاري تحميل لوحة التحكم...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">خطأ: {error}</div>;
  }

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div dir="rtl" className="space-y-8">
      <h2
        className="text-2xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        لوحة التحكم
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ background: "var(--bg-card)" }}
        >
          <h3 className="text-gray-500 text-sm mb-2">إجمالي الطلبات</h3>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {stats.totalOrders}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ background: "var(--bg-card)" }}
        >
          <h3 className="text-gray-500 text-sm mb-2">طلبات معلقة</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.pendingOrders}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ background: "var(--bg-card)" }}
        >
          <h3 className="text-gray-500 text-sm mb-2">
            إجمالي الأدوية في المخزون
          </h3>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {stats.totalStock}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ background: "var(--bg-card)" }}
        >
          <h3 className="text-gray-500 text-sm mb-2">أدوية منخفضة المخزون</h3>
          <p className="text-3xl font-bold text-red-600">{stats.lowStock}</p>
        </div>
      </div>

      <div
        className="rounded-xl p-6 shadow-md"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h3 className="text-xl font-semibold">مخطط المبيعات</h3>
          <div className="flex gap-2">
            {[
              { value: "week", label: "آخر 7 أيام" },
              { value: "month", label: "آخر شهر" },
              { value: "6months", label: "آخر 6 شهور" },
              { value: "year", label: "آخر سنة" },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setChartPeriod(period.value)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                  chartPeriod === period.value
                    ? "bg-sky-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
        {loadingOrders ? (
          <div className="text-center py-20">جاري تحميل البيانات...</div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            لا توجد بيانات مبيعات للفترة المحددة
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} ج.م`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                name="المبيعات"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div
        className="rounded-xl p-6 shadow-md"
        style={{ background: "var(--bg-card)" }}
      >
        <h3 className="text-xl font-semibold mb-4">آخر الطلبات</h3>
        {loadingOrders ? (
          <div className="text-center py-10">جاري تحميل الطلبات...</div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">لا توجد طلبات</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-4 py-3 text-right">رقم الطلب</th>
                  <th className="px-4 py-3 text-right">العميل</th>
                  <th className="px-4 py-3 text-right">التاريخ</th>
                  <th className="px-4 py-3 text-right">السعر (ج.م)</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">
                      {order.customerName || order.user?.name || "غير معروف"}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(order.date).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-4 py-3">
                      {order.total || order.totalAmount || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        className="rounded-xl p-6 shadow-md"
        style={{ background: "var(--bg-card)" }}
      >
        <h3 className="text-xl font-semibold mb-4">أكثر 10 أدوية مبيعاً</h3>
        {loadingOrders ? (
          <div className="text-center py-10">جاري تحميل البيانات...</div>
        ) : topMedicines.length === 0 ||
          (topMedicines.length === 1 &&
            topMedicines[0].name === "لا توجد بيانات كافية") ? (
          <div className="text-center py-10 text-gray-500">
            لا توجد بيانات كافية لحساب الأدوية الأكثر مبيعاً.
            {topMedicines[0]?.name === "لا توجد بيانات كافية" &&
              " تأكد من أن الطلبات تحتوي على تفاصيل الأدوية (items)."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-4 py-3 text-right">#</th>
                  <th className="px-4 py-3 text-right">اسم الدواء</th>
                  <th className="px-4 py-3 text-right">عدد المبيعات</th>
                </tr>
              </thead>
              <tbody>
                {topMedicines.map((medicine, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{medicine.name}</td>
                    <td className="px-4 py-3">{medicine.salesCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
