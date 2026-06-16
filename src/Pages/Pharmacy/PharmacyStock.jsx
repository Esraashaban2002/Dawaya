import { useState, useEffect, useMemo } from "react";
import {
  getPharmacyStock,
  addPharmacyStockItem,
  updatePharmacyStockItem,
  deletePharmacyStockItem,
} from "../../services/api";
import { IoAdd } from "react-icons/io5";

export default function PharmacyStock() {
  const [stock, setStock] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    medicineId: "",
    quantity: "",
    price: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const response = await getPharmacyStock();
      console.log("Stock API Response:", response); 
      if (response?.data) {
        const stockList = response.data.data || [];
        setStock(stockList);
        setTotal(response.data.total || 0);
      } else {
        setStock([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      const payload = {
        medicineId: formData.medicineId,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      };
      await addPharmacyStockItem(payload);
      await fetchStock();
      setShowAddModal(false);
      setFormData({ medicineId: "", quantity: "", price: "" });
      setMessage({ type: "success", text: "تمت إضافة الدواء بنجاح" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleUpdateStock = async (id) => {

    if (!id) {
      setMessage({ type: "error", text: "معرف العنصر غير صالح" });
      return;
    }
    try {
      await updatePharmacyStockItem(id, {
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });
      await fetchStock(); 
      setEditingItem(null);
      setFormData({ medicineId: "", quantity: "", price: "" });
      setMessage({ type: "success", text: "تم تحديث البيانات" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الدواء نهائياً؟")) return;
    try {
      await deletePharmacyStockItem(id);
      await fetchStock();
      setMessage({ type: "success", text: "🗑️ تم حذف الدواء" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const startEdit = (item) => {

    const itemId = item.id || item._id;
    if (!itemId) {
      setMessage({ type: "error", text: "لا يمكن تعديل هذا العنصر" });
      return;
    }
    setEditingItem({ ...item, id: itemId });
    setFormData({
      medicineId: item.medicineId || "",
      quantity: item.quantity,
      price: item.price,
    });
  };

  const getMedicineName = (item) => {
    if (item.medicineName) return item.medicineName;
    if (item.name) return item.name;
    if (item.medicine && item.medicine.name) return item.medicine.name;
    return "اسم غير معروف";
  };

  const filteredStock = useMemo(() => {
    let filtered = [...stock];
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        getMedicineName(item).toLowerCase().includes(term),
      );
    }
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "name") {
        aVal = getMedicineName(a).toLowerCase();
        bVal = getMedicineName(b).toLowerCase();
      } else if (sortBy === "quantity") {
        aVal = a.quantity;
        bVal = b.quantity;
      } else {
        aVal = a.price;
        bVal = b.price;
      }
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    return filtered;
  }, [stock, searchTerm, sortBy, sortOrder]);

  const paginatedStock = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStock.slice(start, start + itemsPerPage);
  }, [filteredStock, currentPage]);

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">جاري تحميل المخزون...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchStock}
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
            إدارة المخزون
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            جميع الأدوية والمنتجات المتوفرة في الصيدلية
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <span className="text-sky-600 font-semibold">{total}</span>
            <span className="text-gray-600 mr-1">دواء في المخزون</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: "var(--color-primary)",
              color: "white",
            }}
            className="px-5 py-2.5 text-white rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <IoAdd className="w-5 h-5" />
            إضافة دواء جديد
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl mb-6 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4">
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
            placeholder="بحث باسم الدواء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm"
          >
            <option value="name">ترتيب حسب الاسم</option>
            <option value="quantity">ترتيب حسب الكمية</option>
            <option value="price">ترتيب حسب السعر</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm flex items-center gap-1"
          >
            {sortOrder === "asc" ? "↑ تصاعدي" : "↓ تنازلي"}
          </button>
          <button
            onClick={fetchStock}
            className="px-3 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50"
            title="تحديث"
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
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                اسم الدواء
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                الكمية
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                السعر
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedStock.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  لا توجد أدوية تطابق البحث
                </td>
              </tr>
            ) : (
              paginatedStock.map((item) => {
                const itemId = item.id || item._id;
                const isEditing = editingItem?.id === itemId;
                const isLowStock = item.quantity < 10;
                const medicineName = getMedicineName(item);
                return (
                  <tr
                    key={itemId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold">
                          {medicineName.charAt(0) || "د"}
                        </div>
                        <span className="font-medium text-gray-800">
                          {medicineName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 ${isLowStock ? "text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full" : ""}`}
                        >
                          {item.quantity}
                          {isLowStock && (
                            <span className="text-xs text-red-500">
                              (منخفض)
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-28 px-2 py-1 border border-gray-300 rounded-lg"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="font-semibold text-green-600">
                          {item.price?.toLocaleString()} ج.م
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStock(itemId)}
                            className="border p-2 rounded-full rounded text-green-600 hover:text-light  hover:bg-green-800 transition cursor-pointer"
                          >
                            حفظ
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="border p-2 rounded-full rounded text-gray-500 hover:text-light  hover:bg-gray-700 transition cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEdit(item)}
                            className="border p-2 rounded-full rounded text-blue-600 hover:text-light  hover:bg-blue-800 transition cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteStock(itemId)}
                            className="border p-2 rounded-full rounded text-red-600 hover:text-light hover:bg-red-800 transition cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                  style={{
                    background: "var(--color-primary)",
                    color: "white",
                  }}
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl transition ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            التالي &larr;
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-5 ">
              <h3 className="text-xl font-bold text-gray-800">
                إضافة دواء جديد
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddStock}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  معرف الدواء (Medicine ID)
                </label>
                <input
                  type="text"
                  name="medicineId"
                  value={formData.medicineId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 64f1a2b3c4d5e6f7a8b9c0d1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  أدخل المعرف الصحيح كما هو مسجل في قاعدة البيانات
                </p>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الكمية
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر (ج.م)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 text-white py-2.5 rounded-xl font-medium cursor-pointer"
                  style={{
                    background: "var(--color-primary)",
                    color: "white",
                  }}
                >
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
