import { useFormik } from "formik";
import logo from "../../assets/11111.jpg";
import * as yup from "yup";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PharmacistRegister() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handelRegister(formValues) {
    setIsLoading(true);

    const data = new FormData();

    data.append("pharmacyName", formValues.pharmacyName);
    data.append("pharmacyPhone", formValues.pharmacyPhone);
    data.append("deliveryArea", formValues.deliveryArea);
    data.append("workingHours", formValues.workingHours);
    data.append("managerName", formValues.managerName);
    data.append("managerPhone", formValues.managerPhone);
    data.append("managerEmail", formValues.managerEmail);

    data.append("commercialRegister", formValues.commercialRegister);
    data.append("taxCard", formValues.taxCard);
    data.append("pharmacyLicense", formValues.pharmacyLicense);

    try {
      await axios.post(
        "https://dawaya-back-end.vercel.app/api/auth/pharmacy-request",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setIsLoading(false);
      navigate("/thankyou");
    } catch (error) {
      setApiError(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }

  let validationSchema = yup.object().shape({
    pharmacyName: yup.string().required("الاسم مطلوب"),

    pharmacyPhone: yup
      .string()
      .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح")
      .required("رقم الهاتف مطلوب"),

    deliveryArea: yup.string().required("العنوان مطلوب"),
    workingHours: yup.string().required("عدد الساعات مطلوب"),

    managerName: yup.string().required(" الاسم مطلوب"),
    managerPhone: yup
      .string()
      .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح")
      .required("رقم الهاتف مطلوب"),
    managerEmail: yup
      .string()
      .email("لبريد الإلكتروني غير صحيح")
      .required("الايميل مطلوب"),

    commercialRegister: yup
      .mixed()
      .test("fileType", "يجب أن يكون الملف PDF أو صورة", (value) => {
        return (
          value &&
          ["application/pdf", "image/jpeg", "image/png"].includes(value.type)
        );
      })

      .required("السجل التجاري مطلوب"),

    taxCard: yup
      .mixed()
      .test("fileType", "يجب أن يكون الملف PDF أو صورة", (value) => {
        return (
          value &&
          ["application/pdf", "image/jpeg", "image/png"].includes(value.type)
        );
      })
      .required("البطاقة الضريبية مطلوبة"),

    pharmacyLicense: yup
      .mixed()
      .test("fileType", "يجب أن يكون الملف PDF أو صورة", (value) => {
        return (
          value &&
          ["application/pdf", "image/jpeg", "image/png"].includes(value.type)
        );
      })
      .test(
        "fileSize",
        "حجم الملف يجب ألا يتجاوز 5MB",
        (value) => !value || value.size <= 5 * 1024 * 1024,
      )
      .required("رخصة الصيدلية مطلوبة"),
  });

  let formik = useFormik({
    initialValues: {
      pharmacyName: "",
      pharmacyPhone: "",
      deliveryArea: "",
      workingHours: "",
      managerName: "",
      managerPhone: "",
      managerEmail: "",

      commercialRegister: null,
      taxCard: null,
      pharmacyLicense: null,
    },
    onSubmit: handelRegister,
    validationSchema,
  });

  return (
    <>
      <div className="min-h-screen flex items-start justify-center bg-[#f6f7fb] py-15 px-4">
        <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div
            className="hidden lg:flex flex-1 relative bg-cover bg-center min-h-[750px]"
            style={{ backgroundImage: `url(${logo})` }}
          >
            <div className="absolute inset-0 bg-sky-900/60"></div>

            <div className="relative z-10 flex flex-col justify-center text-white p-12 w-full">
              <div className="max-w-xl mx-auto">
                <span className="inline-block px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                  منصة دوايا للشركاء
                </span>

                <h1 className="text-5xl font-extrabold leading-tight mb-6">
                  ضاعف مبيعات صيدليتك
                  <span className="block text-sky-400">ووسّع قاعدة عملائك</span>
                </h1>

                <p className="text-lg leading-8 text-sky-100 mb-10">
                  انضم إلى دوايا وابدأ استقبال طلبات العملاء أونلاين بسهولة، مع
                  نظام متكامل يساعدك على زيادة المبيعات والوصول إلى عدد أكبر من
                  العملاء في منطقتك.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex items-center justify-center w-7 h-7 rounded-full bg-sky-500">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <p>الوصول إلى شريحة أكبر من العملاء في منطقتك</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex items-center justify-center w-7 h-7 rounded-full bg-sky-500">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <p>زيادة الطلبات والمبيعات دون تكاليف تسويقية مرتفعة</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex items-center justify-center w-7 h-7 rounded-full bg-sky-500">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <p>إدارة الطلبات بسهولة من خلال لوحة تحكم متطورة</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex items-center justify-center w-7 h-7 rounded-full bg-sky-500">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <p>تجربة حديثة تعزز رضا العملاء وولاءهم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#fcfbff] flex items-center justify-center px-5 py-12">
            <div className="w-full max-w-lg">
              <h2 className="text-4xl font-extrabold text-sky-700 mb-3 text-center">
                إنشاء حساب جديد
              </h2>

              <p className="text-gray-500 text-center mb-10">
                قم بإنشاء حسابك للبدء في استخدام منصة دوايا
              </p>

              <form onSubmit={formik.handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="pharmacyName"
                    >
                      اسم الصيدلية
                      <span className="text-red-500 text-xl"> * </span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                      required
                      id="pharmacyName"
                      name="pharmacyName"
                      value={formik.values.pharmacyName}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.pharmacyName &&
                    formik.touched.pharmacyName ? (
                      <div className="mt-3 text-red-600 text-sm p-3">
                        {formik.errors.pharmacyName}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="pharmacyPhone"
                    >
                      موبايل الصيدلية
                      <span className="text-red-500 text-xl"> * </span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                      required
                      id="pharmacyPhone"
                      name="pharmacyPhone"
                      value={formik.values.pharmacyPhone}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.pharmacyPhone &&
                    formik.touched.pharmacyPhone ? (
                      <div className="mt-3 text-red-600 text-sm p-3">
                        {formik.errors.pharmacyPhone}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="deliveryArea"
                    >
                      منطقة التوصيل
                      <span className="text-red-500 text-xl"> * </span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                      required
                      id="deliveryArea"
                      name="deliveryArea"
                      value={formik.values.deliveryArea}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.deliveryArea &&
                    formik.touched.deliveryArea ? (
                      <div className="mt-3 text-red-600 text-sm p-3">
                        {formik.errors.deliveryArea}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="workingHours"
                    >
                      مواعيد عمل الصيدلية
                      <span className="text-red-500 text-xl"> * </span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                      placeholder="مثال: 9 صباحًا - 12 مساءً"
                      required
                      id="workingHours"
                      name="workingHours"
                      value={formik.values.workingHours}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.workingHours &&
                    formik.touched.workingHours ? (
                      <div className="mt-3 text-red-600 text-sm p-3">
                        {formik.errors.workingHours}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="managerName"
                    >
                      اسم مدير الصيدلية
                      <span className="text-red-500 text-xl"> * </span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                      placeholder=""
                      required
                      id="managerName"
                      name="managerName"
                      value={formik.values.managerName}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.managerName && formik.touched.managerName ? (
                      <div className="mt-3 text-red-600 text-sm p-3">
                        {formik.errors.managerName}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="managerPhone"
                    >
                      تليفون مدير الصيدلية
                      <span className="text-red-500 text-xl"> * </span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                      placeholder=""
                      required
                      id="managerPhone"
                      name="managerPhone"
                      value={formik.values.managerPhone}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.managerPhone &&
                    formik.touched.managerPhone ? (
                      <div className="mt-3 text-red-600 text-sm p-3">
                        {formik.errors.managerPhone}
                      </div>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className="block mb-2 text-sm font-medium"
                      htmlFor="managerEmail"
                    >
                      ايميل مدير الصيدلية
                      <span className="text-red-500 text-xl"> * </span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                      required
                      id="managerEmail"
                      name="managerEmail"
                      value={formik.values.managerEmail}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />

                    {formik.errors.managerEmail &&
                    formik.touched.managerEmail ? (
                      <div className="mt-3 text-red-600 text-sm p-3">
                        {formik.errors.managerEmail}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8">
                  <div>
                    <p className="font-medium mb-2">
                      السجل التجاري
                      <span className="text-red-500 text-xl"> * </span>
                    </p>
                    <label
                      htmlFor="commercialRegister"
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                    >
                      <i className="fa-solid fa-file-circle-plus text-2xl mb-2 text-sky-600"></i>

                      <p className="text-xs text-center px-2">
                        اضغط لاختيار الملف
                      </p>

                      <input
                        type="file"
                        className="hidden"
                        id="commercialRegister"
                        name="commercialRegister"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "commercialRegister",
                            e.currentTarget.files[0],
                          );
                        }}
                      />
                      {formik.values.commercialRegister && (
                        <p className="mt-2 text-sm text-green-600 text-center">
                          {formik.values.commercialRegister.name}
                        </p>
                      )}
                    </label>
                    {formik.errors.commercialRegister &&
                    formik.touched.commercialRegister ? (
                      <div className="mt-5 text-red-600 text-sm p-3">
                        {formik.errors.commercialRegister}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="font-medium mb-2">
                      البطاقة الضريبية
                      <span className="text-red-500 text-xl"> * </span>
                    </p>

                    <label
                      htmlFor="taxCard"
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                    >
                      <i className="fa-solid fa-file-circle-plus text-2xl mb-2 text-sky-600"></i>

                      <p className="text-xs text-center px-2">
                        اضغط لاختيار الملف
                      </p>

                      <input
                        type="file"
                        className="hidden"
                        id="taxCard"
                        name="taxCard"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "taxCard",
                            e.currentTarget.files[0],
                          );
                        }}
                      />
                      {formik.values.taxCard && (
                        <p className="mt-2 text-sm text-green-600 text-center">
                          {formik.values.taxCard.name}
                        </p>
                      )}
                    </label>
                    {formik.errors.taxCard && formik.touched.taxCard ? (
                      <div className="mt-5 text-red-600 text-sm p-3">
                        {formik.errors.taxCard}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="font-medium mb-2">
                      رخصة الصيدلية
                      <span className="text-red-500 text-xl"> * </span>
                    </p>

                    <label
                      htmlFor="pharmacyLicense"
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                    >
                      <i className="fa-solid fa-file-circle-plus text-2xl mb-2 text-sky-600"></i>

                      <p className="text-xs text-center px-2">
                        اضغط لاختيار الملف
                      </p>

                      <input
                        type="file"
                        className="hidden"
                        id="pharmacyLicense"
                        name="pharmacyLicense"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "pharmacyLicense",
                            e.currentTarget.files[0],
                          );
                        }}
                      />
                      {formik.values.pharmacyLicense && (
                        <p className="mt-2 text-sm text-green-600 text-center">
                          {formik.values.pharmacyLicense.name}
                        </p>
                      )}
                    </label>
                    {formik.errors.pharmacyLicense &&
                    formik.touched.pharmacyLicense ? (
                      <div className="mt-5 text-red-600 text-sm p-3">
                        {formik.errors.pharmacyLicense}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-3 rounded-xl transition"
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "إرسال الطلب"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
