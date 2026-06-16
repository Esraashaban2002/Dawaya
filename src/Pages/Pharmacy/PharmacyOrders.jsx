import { useState, useEffect, useMemo } from "react";
import {
  getPharmacyOrders,
  updatePharmacyOrderStatus,
} from "../../services/api";

export default function PharmacyOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit };
      if (statusFilter !== "all") params.status = statusFilter;
      const response = await getPharmacyOrders(params);
      if (response?.data) {
        setOrders(response.data.data || []);
        setTotal(response.data.total || 0);
      } else {
        setOrders([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updatePharmacyOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId || order._id === orderId
            ? { ...order, status: newStatus }
            : order,
        ),
      );
    } catch (err) {
      alert("فشل التحديث: " + err.message);
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (order) =>
          (order.id || order._id).toLowerCase().includes(term) ||
          (order.customerName || order.user?.name || "")
            .toLowerCase()
            .includes(term),
      );
    }
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "date") {
        aVal = new Date(a.orderDate);
        bVal = new Date(b.orderDate);
      } else {
        aVal = a.totalAmount || a.total || 0;
        bVal = b.totalAmount || b.total || 0;
      }
      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
          ? 1
          : -1;
    });
    return filtered;
  }, [orders, searchTerm, sortBy, sortOrder]);

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
        return {
          label: "قيد الانتظار",
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
        };
      case "confirmed":
        return {
          label: "مؤكد",
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      case "shipped":
        return {
          label: "تم الشحن",
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
        };
      case "delivered":
        return {
          label: "تم التوصيل",
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "cancelled":
        return {
          label: "ملغي",
          icon: "✗",
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };
      default:
        return {
          label: status || "غير معروف",
          icon: "•",
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-4 md:p-6 font-sans">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            الطلبات
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إدارة ومتابعة جميع طلبات الصيدلية
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <span className="text-blue-600 font-semibold">{total}</span>
            <span className="text-gray-600 mr-1">إجمالي الطلبات</span>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            تحديث
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="بحث برقم الطلب أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              "all",
              "pending",
              "confirmed",
              "shipped",
              "delivered",
              "cancelled",
            ].map((filter) => {
              const labels = {
                all: "الكل",
                pending: "معلق",
                confirmed: "مؤكد",
                shipped: "شحن",
                delivered: "مكتمل",
                cancelled: "ملغي",
              };
              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    statusFilter === filter
                      ? "bg-sky-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {labels[filter]}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm"
            >
              <option value="date">التاريخ</option>
              <option value="total">السعر</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm flex items-center gap-1"
            >
              {sortOrder === "asc" ? "↑ تصاعدي" : "↓ تنازلي"}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                رقم الطلب
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                العميل
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                المبلغ
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  لا توجد طلبات تطابق البحث
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const orderId = order.id || order._id;
                const statusConfig = getStatusConfig(order.status);
                return (
                  <tr
                    key={orderId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">
                        #{orderId.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm">
                          {order.customerName?.[0] ||
                            order.user?.name?.[0] ||
                            "ع"}
                        </div>
                        <span className="text-gray-800">
                          {order.customerName ||
                            order.user?.name ||
                            "غير معروف"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString(
                            "ar-EG",
                            { day: "numeric", month: "short", year: "numeric" },
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        {(
                          order.totalAmount ||
                          order.total ||
                          0
                        ).toLocaleString()}{" "}
                        ج.م
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                      >
                        <span>{statusConfig.icon}</span>
                        <span>{statusConfig.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.status !== "delivered" &&
                      order.status !== "cancelled" ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(orderId, e.target.value)
                            }
                            disabled={updatingId === orderId}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">قيد الانتظار</option>
                            <option value="confirmed">تأكيد</option>
                            <option value="shipped">شحن</option>
                            <option value="delivered">توصيل</option>
                            <option value="cancelled">إلغاء</option>
                          </select>
                          {updatingId === orderId && (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">مكتمل</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl">
            لا توجد طلبات
          </div>
        ) : (
          filteredOrders.map((order) => {
            const orderId = order.id || order._id;
            const statusConfig = getStatusConfig(order.status);
            return (
              <div
                key={orderId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    #{orderId.slice(-8)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">العميل:</span>
                    <span className="font-medium">
                      {order.customerName || order.user?.name || "غير معروف"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">التاريخ:</span>
                    <span>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString("ar-EG")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المبلغ:</span>
                    <span className="font-bold text-green-600">
                      {(order.totalAmount || order.total || 0).toLocaleString()}{" "}
                      ج.م
                    </span>
                  </div>
                </div>
                {order.status !== "delivered" &&
                  order.status !== "cancelled" && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(orderId, e.target.value)}
                        disabled={updatingId === orderId}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="confirmed">تأكيد</option>
                        <option value="shipped">شحن</option>
                        <option value="delivered">توصيل</option>
                        <option value="cancelled">إلغاء</option>
                      </select>
                    </div>
                  )}
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            &rarr; السابق
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = currentPage;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2)
                pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              if (pageNum < 1 || pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl transition ${
                    currentPage === pageNum
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            التالي &larr;
          </button>
        </div>
      )}
    </div>
  );
}
