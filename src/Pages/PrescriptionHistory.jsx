import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  User,
  ShoppingBag,
  RotateCcw,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  Plus,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Trash2
} from "lucide-react";
import { getUserPrescriptions, reorderPrescription, deletePrescription } from "../services/api";
import { useCart } from "../Context/CartContext";

const DEFAULT_PRESCRIPTION_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" rx="16" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="260" rx="12" fill="white" stroke="%23e2e8f0" stroke-width="2"/><path d="M50 60h120M50 90h260M50 120h220M50 150h240M50 180h180" stroke="%23cbd5e1" stroke-width="6" stroke-linecap="round"/><text x="50" y="230" fill="%231ab5ea" font-family="sans-serif" font-size="28" font-weight="bold">Rx</text></svg>`;

function PrescriptionThumbnail({ src, alt }) {
  const [imgError, setImgError] = useState(false);
  const activeSrc = imgError || !src ? DEFAULT_PRESCRIPTION_IMAGE : src;

  return (
    <img
      src={activeSrc}
      alt={alt || "روشتة"}
      onError={() => setImgError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
  );
}

function PrescriptionModalImage({ src }) {
  const [imgError, setImgError] = useState(false);
  const activeSrc = imgError || !src ? DEFAULT_PRESCRIPTION_IMAGE : src;

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-60 bg-slate-100 flex items-center justify-center">
      <img
        src={activeSrc}
        alt="الروشتة الممسوحة"
        onError={() => setImgError(true)}
        className="max-h-60 w-auto object-contain"
      />
    </div>
  );
}

export default function PrescriptionHistory() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleDeletePrescription = async (prescriptionId) => {
    try {
      setDeletingId(prescriptionId);
      await deletePrescription(prescriptionId);
      setPrescriptions((prev) => prev.filter((p) => String(p._id) !== String(prescriptionId)));
      if (selectedPrescription && String(selectedPrescription._id) === String(prescriptionId)) {
        setSelectedPrescription(null);
      }
      setShowDeleteConfirmModal(null);
      triggerToast("تم حذف الروشتة من السجل بنجاح", "success");
    } catch (err) {
      console.error("Error deleting prescription:", err);
      triggerToast("حدث خطأ أثناء حذف الروشتة", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserPrescriptions();
      setPrescriptions(data || []);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("تعذر تحميل قائمة الروشتات السابقة");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleReorder = async (e, prescriptionId) => {
    e.stopPropagation();
    try {
      setReorderingId(prescriptionId);
      const res = await reorderPrescription(prescriptionId);

      if (res && res.addedToCart && res.addedToCart.length > 0) {
        res.addedToCart.forEach((item) => {
          addToCart(
            {
              id: item.productId || item.id,
              name: item.name,
              price: item.price || 45,
              dosageInstructions: item.dosageInstructions
            },
            item.quantity || 1
          );
        });

        triggerToast(`تمت إضافة (${res.addedToCart.length}) منتجات بنجاح إلى سلة المشتريات!`, "success");
      }

      if (res && res.outOfStock && res.outOfStock.length > 0) {
        setOutOfStockItems(res.outOfStock);
        setShowOutOfStockModal(true);
      }
    } catch (err) {
      console.error("Error reordering prescription:", err);
      triggerToast("حدث خطأ أثناء إعادة طلب الروشتة", "error");
    } finally {
      setReorderingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "تاريخ غير محدد";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Floating Bottom Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold transition-all max-w-md ${
            toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-cyan-50 border-[#1ab5ea]/40 text-[#0d82d3]"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-[#1ab5ea] shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <Link to="/" className="hover:text-[#1ab5ea] transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-slate-700">روشتاتي السابقة</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#1ab5ea]" />
              روشتاتي السابقة (سجل الروشتات)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              استعرض جميع الروشتات الطبية التي قمت بمسحها سابقاً وأعد طلب الأدوية بسهولة بضغطة زر واحدة.
            </p>
          </div>

          <Link
            to="/prescription"
            className="inline-flex items-center justify-center gap-2 bg-[#1ab5ea] hover:bg-[#159ccb] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md shadow-[#1ab5ea]/20 transition-all hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>مسح روشتة جديدة</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 border-4 border-[#1ab5ea]/20 border-t-[#1ab5ea] rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-bold text-sm">جاري تحميل سجل الروشتات...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-3xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchHistory}
              className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && prescriptions.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
            <div className="w-20 h-20 bg-[#e0f7ff] rounded-full flex items-center justify-center text-[#1ab5ea]">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">لا يوجد روشتات مسجلة حتى الآن</h2>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              قم بمسح روشتتك الطبية باستخدام الذكاء الاصطناعي ليتم حفظها تلقائياً في حسابك وتتمكن من إعادة طلبها متى تشاء.
            </p>
            <Link
              to="/prescription"
              className="inline-flex items-center gap-2 bg-[#1ab5ea] hover:bg-[#159ccb] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>امسح روشتتك الأولى الآن</span>
            </Link>
          </div>
        )}

        {/* Prescriptions Grid */}
        {!loading && !error && prescriptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((item) => {
              const medCount = item.medications?.length || 0;
              const isReordering = reorderingId === item._id;

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedPrescription(item)}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:border-[#1ab5ea]/40"
                >
                  <div className="space-y-4">
                    {/* Header Thumbnail & Doctor Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          <PrescriptionThumbnail src={item.scannedImageUrl} alt="روشتة" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-800 font-black text-base group-hover:text-[#1ab5ea] transition-colors">
                            <Stethoscope className="w-4 h-4 text-[#1ab5ea]" />
                            <span>{item.doctorName || "دكتور غير محدد"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                            <User className="w-3.5 h-3.5" />
                            <span>المريض: {item.patientName || "مريض غير محدد"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#1ab5ea]" />
                        <span>{formatDate(item.dateIssued || item.createdAt)}</span>
                      </div>
                      <span className="bg-[#e0f7ff] text-[#1ab5ea] px-2.5 py-1 rounded-full text-xs font-extrabold border border-[#1ab5ea]/20">
                        {medCount} {medCount === 1 ? "دواء" : "أدوية"}
                      </span>
                    </div>

                    {/* Medications Preview List */}
                    <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs text-slate-600">
                      <p className="font-bold text-slate-700 text-[11px] mb-1">الأدوية المسجلة:</p>
                      {item.medications?.slice(0, 3).map((med, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="truncate max-w-[180px]">• {med.matchedName || med.name}</span>
                          <span className="font-extrabold text-slate-400">×{med.quantity || 1}</span>
                        </div>
                      ))}
                      {medCount > 3 && (
                        <p className="text-[10px] text-[#1ab5ea] font-bold text-left pt-1">
                          +{medCount - 3} أدوية أخرى...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => handleReorder(e, item._id)}
                      disabled={isReordering}
                      className="flex-1 bg-[#1ab5ea] hover:bg-[#159ccb] text-white py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.97] disabled:opacity-50"
                    >
                      {isReordering ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                      <span>إعادة الطلب</span>
                    </button>

                    <button
                      onClick={() => setSelectedPrescription(item)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors"
                      title="عرض التفاصيل الكاملة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirmModal(item);
                      }}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-xl transition-colors border border-rose-100"
                      title="حذف الروشتة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#e0f7ff] text-[#1ab5ea] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-800">تفاصيل الروشتة الطبية</h3>
                  <p className="text-xs text-slate-400">تاريخ الإصدار: {formatDate(selectedPrescription.dateIssued || selectedPrescription.createdAt)}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPrescription(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
              {/* Doctor & Patient Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-bold mb-1">اسم الطبيب:</span>
                  <span className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-[#1ab5ea] shrink-0" />
                    {selectedPrescription.doctorName || "غير محدد"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold mb-1">اسم المريض:</span>
                  <span className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-500 shrink-0" />
                    {selectedPrescription.patientName || "غير محدد"}
                  </span>
                </div>
              </div>

              {/* Scanned Image Preview */}
              <div>
                <h4 className="font-bold text-xs text-slate-700 mb-2">صورة الروشتة الممسوحة:</h4>
                <PrescriptionModalImage src={selectedPrescription.scannedImageUrl} />
              </div>

              {/* Medications List Table */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center justify-between">
                  <span>قائمة الأدوية المكتوبة في الروشتة</span>
                  <span className="text-xs text-[#1ab5ea] font-black bg-[#e0f7ff] px-2.5 py-1 rounded-full">
                    {selectedPrescription.medications?.length || 0} أدوية
                  </span>
                </h4>

                <div className="border border-slate-100 rounded-2xl overflow-x-auto shadow-sm">
                  <table className="w-full text-right text-xs min-w-[480px]">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">اسم الدواء</th>
                        <th className="p-3">اسم المنتج المتميز</th>
                        <th className="p-3 text-center">الكمية</th>
                        <th className="p-3 text-left">السعر التقريبي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPrescription.medications?.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-semibold text-slate-800">{med.name}</td>
                          <td className="p-3 text-[#1ab5ea] font-extrabold">{med.matchedName || med.name}</td>
                          <td className="p-3 text-center font-bold text-slate-700">×{med.quantity || 1}</td>
                          <td className="p-3 text-left font-black text-slate-800">{med.price || 45} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => setShowDeleteConfirmModal(selectedPrescription)}
                  className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف الروشتة</span>
                </button>
              </div>

              <button
                onClick={(e) => {
                  const pid = selectedPrescription._id;
                  setSelectedPrescription(null);
                  handleReorder(e, pid);
                }}
                className="w-full sm:w-auto bg-[#1ab5ea] hover:bg-[#159ccb] text-white px-6 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إعادة طلب هذه الروشتة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Out of Stock Warning Modal */}
      {showOutOfStockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl text-amber-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-black text-lg text-slate-800">تنبيه: أدوية غير متوفرة حالياً</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تمت إضافة باقي الأدوية المتاحة إلى سلتك، ولكن الأدوية التالية غير متوفرة بالمخزون حالياً:
              </p>
            </div>

            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2 max-h-48 overflow-y-auto">
              {outOfStockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-amber-900 font-bold border-b border-amber-100/60 pb-1.5 last:border-0 last:pb-0">
                  <span>• {item.name}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{item.reason || "غير متوفر"}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowOutOfStockModal(false);
                  navigate('/cart');
                }}
                className="flex-1 bg-[#1ab5ea] hover:bg-[#159ccb] text-white py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>الانتقال إلى السلة</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              <button
                onClick={() => setShowOutOfStockModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-200" dir="rtl">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-black text-lg text-slate-800">حذف الروشتة الطبية</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                هل أنت تأكد من رغبتك في حذف هذه الروشتة من السجل؟ لا يمكن التراجع عن هذا الإجراء لاحقاً.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDeletePrescription(showDeleteConfirmModal._id)}
                disabled={deletingId === showDeleteConfirmModal._id}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingId === showDeleteConfirmModal._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>تأكيد الحذف</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirmModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
