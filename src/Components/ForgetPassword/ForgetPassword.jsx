import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleForgetPassword(values) {
    setIsLoading(true);

    try {
      let { data } = await axios.post(
        `https://dawaya-back-end.vercel.app/api/auth/forgetPassword`,
        values,
      );

      if (data.success) {
        setIsLoading(false);

        navigate("/resetpassword");
      }
    } catch (error) {
      setIsLoading(false);

      setApiError(error.response.data.message);
    }
  }

  let validationSchema = yup.object({
    email: yup
      .string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema,

    onSubmit: handleForgetPassword,
  });

  return (
      <div className="min-h-screen flex items-start justify-center bg-[#f6f7fb] px-4 py-15">
      <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-sky-100 px-8 py-12 md:px-14">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-sky-700 mb-3">
            نسيت كلمة المرور؟
          </h2>

          <p className="text-gray-500 leading-7">
            أدخل بريدك الإلكتروني لإرسال رمز التحقق
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>

            <input
              type="email"
              name="email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-sky-500"
              placeholder="example@email.com"
            />
          </div>

          {formik.errors.email && formik.touched.email ? (
            <div className="mb-5 p-3 rounded-xl bg-red-100 text-red-600 text-sm">
              {formik.errors.email}
            </div>
          ) : null}

          {apiError ? (
            <div className="mb-5 p-3 rounded-xl bg-red-100 text-red-600 text-sm">
              {apiError}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold text-lg"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "إرسال رمز التحقق"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
