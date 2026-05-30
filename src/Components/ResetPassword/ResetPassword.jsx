import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleResetPassword(values) {
    setIsLoading(true);

    try {
      let { data } = await axios.put(
        "https://dawaya-back-end.vercel.app/api/auth/reastpassword",
        values,
      );

      if (data.message) {
        setIsLoading(false);
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      setApiError(error.response?.data?.message || "Something went wrong");
    }
  }

  let validationSchema = yup.object({
    email: yup
      .string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),

    otp: yup
      .string()
      .length(6, "الكود يجب أن يكون 6 أرقام")
      .required("كود التحقق مطلوب"),

    password: yup
      .string()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, "كلمة المرور ضعيفة")
      .required("كلمة المرور مطلوبة"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleResetPassword,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-sky-100 px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-sky-700 mb-2">
            إعادة تعيين كلمة المرور
          </h2>

          <p className="text-gray-500 py-2">
            أدخل البيانات لإعادة تعيين كلمة المرور
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-200"
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">
            كود التحقق
          </label>{" "}
          <input
            type="text"
            name="otp"
            placeholder="000 000"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-200 text-center tracking-[6px]"
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">
            كلمة المرور الجديده
          </label>{" "}
          <input
            type="password"
            name="password"
            placeholder="*********"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-200"
          />
          {apiError && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
              {apiError}
            </div>
          )}
          {formik.errors.email && formik.touched.email && (
            <div className="mb-2 text-red-500 text-sm">
              {formik.errors.email}
            </div>
          )}
          {formik.errors.otp && formik.touched.otp && (
            <div className="mb-2 text-red-500 text-sm">{formik.errors.otp}</div>
          )}
          {formik.errors.password && formik.touched.password && (
            <div className="mb-4 text-red-500 text-sm">
              {formik.errors.password}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold cursor-pointer"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "تغيير كلمة المرور"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
