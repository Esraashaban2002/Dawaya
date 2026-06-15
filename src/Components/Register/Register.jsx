import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import logo from "../../assets/11111.jpg";

export default function Register() {
  let navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(formValues) {
    setIsLoading(true);

    let { rePassword, age, ...dataToSend } = formValues;

    try {
      let { data } = await axios.post(
        `https://dawaya-back-end.vercel.app/api/auth/register`,
        dataToSend,
      );

      if (data.success) {
        // Persist user registration details locally
        try {
          const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
          const index = users.findIndex(u => u.email.toLowerCase() === formValues.email.toLowerCase());
          const userData = {
            username: formValues.username,
            phone: formValues.phone,
            email: formValues.email,
            password: formValues.password,
            gender: formValues.gender || 'male',
            age: Number(formValues.age) || 25
          };
          if (index > -1) {
            users[index] = userData;
          } else {
            users.push(userData);
          }
          localStorage.setItem("dawaya_users", JSON.stringify(users));

          // Save active password and email session
          localStorage.setItem("dawaya_current_email", formValues.email);
          localStorage.setItem("dawaya_current_password", formValues.password);
        } catch (e) {
          console.error("Local storage register sync failed", e);
        }

        setIsLoading(false);
        console.log(data.message);
        navigate("/verifyotp");
      }
    } catch (error) {
      setIsLoading(false);
      setApiError(error.response.data.message);
    }
  }

  let validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(2, "الاسم يجب ألا يقل عن حرفين")
      .max(12, "الاسم يجب ألا يزيد عن 12 حرف")
      .required("الاسم مطلوب"),
    phone: yup
      .string()
      .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح")
      .required("رقم الهاتف مطلوب"),
    email: yup
      .string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف كبير ورقم",
      )
      .required("كلمة المرور مطلوبة"),
    rePassword: yup
      .string()
      .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
    age: yup
      .number()
      .typeError("العمر يجب أن يكون رقماً")
      .integer("العمر يجب أن يكون عدداً صحيحاً")
      .positive("العمر يجب أن يكون رقماً موجباً")
      .min(18, "العمر يجب أن يكون ١٨ سنة على الأقل")
      .max(120, "العمر يجب ألا يتجاوز 120 سنة")
      .required("العمر مطلوب"),
  });

  let formik = useFormik({
    initialValues: {
      username: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "",
      age: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  const handleGoogleRegister = () => {
    window.location.href = 'https://dawaya-back-end.vercel.app/api/auth/google?action=register';
  }

  return (
    <>
      <div className="min-h-screen flex items-start justify-center bg-[#f6f7fb] py-15 px-4">
        <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div
            className="hidden lg:flex flex-1 relative bg-cover bg-center min-h-[750px]"
            style={{ backgroundImage: `url(${logo})` }}
          >
            <div className="absolute inset-0 bg-sky-900/60"></div>

            <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-10 w-full">
              <span className="mb-4 text-lg font-light tracking-widest">
                دوايا
              </span>

              <h2 className="text-5xl font-extrabold leading-tight mb-6">
                رفيقك الصحي الرقمي الآمن
              </h2>

              <p className="text-lg text-sky-100 leading-8 max-w-md">
                منصة متكاملة لإدارة الصيدليات وتقديم الخدمات الطبية بسهولة
                واحترافية عالية.
              </p>

              <div className="flex gap-4 mt-10">
                <button className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 duration-300">
                  دعم 24 ساعة
                </button>

                <button className="px-6 py-3 rounded-full bg-white text-sky-900 font-semibold hover:bg-sky-100 duration-300">
                  ابدأ الآن
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#fcfbff] flex items-center justify-center px-6 py-12 lg:px-14">
            <div className="w-full max-w-md">
              <h2 className="text-4xl font-extrabold text-sky-700 mb-3 text-center">
                إنشاء حساب جديد
              </h2>

              <p className="text-gray-500 text-center mb-10">
                قم بإنشاء حسابك للبدء في استخدام منصة دوايا
              </p>

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    اسم المستخدم
                  </label>

                  <input
                    type="text"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    name="username"
                    value={formik.values.username}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                    placeholder="أدخل اسم المستخدم"
                  />
                </div>

                {formik.errors.username && formik.touched.username ? (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {formik.errors.username}
                  </div>
                ) : null}

                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    رقم الهاتف
                  </label>

                  <input
                    type="text"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    name="phone"
                    value={formik.values.phone}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>

                {formik.errors.phone && formik.touched.phone ? (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {formik.errors.phone}
                  </div>
                ) : null}

                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    العمر
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onBlur={formik.handleBlur}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      formik.setFieldValue("age", val);
                    }}
                    name="age"
                    value={formik.values.age}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                    placeholder="أدخل العمر"
                  />
                </div>

                {formik.errors.age && formik.touched.age ? (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {formik.errors.age}
                  </div>
                ) : null}

                <div className="mb-5">
                  <label className="block mb-3 text-sm font-medium text-gray-700">
                    النوع
                  </label>

                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 cursor-pointer hover:border-sky-500 transition">
                      <input
                        type="radio"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value="male"
                        name="gender"
                        checked={formik.values.gender === "male"}
                      />
                      ذكر
                    </label>

                    <label className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 cursor-pointer hover:border-sky-500 transition">
                      <input
                        type="radio"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value="female"
                        name="gender"
                        checked={formik.values.gender === "female"}
                      />
                      أنثى
                    </label>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>

                  <input
                    type="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    name="email"
                    value={formik.values.email}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                    placeholder="name@example.com"
                  />
                </div>

                {formik.errors.email && formik.touched.email ? (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {formik.errors.email}
                  </div>
                ) : null}

                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    كلمة المرور
                  </label>

                  <input
                    type="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    name="password"
                    value={formik.values.password}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                    placeholder="********"
                  />
                </div>

                {formik.errors.password && formik.touched.password ? (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {formik.errors.password}
                  </div>
                ) : null}

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    تأكيد كلمة المرور
                  </label>

                  <input
                    type="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    name="rePassword"
                    value={formik.values.rePassword}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                    placeholder="********"
                  />
                </div>

                {formik.errors.rePassword && formik.touched.rePassword ? (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {formik.errors.rePassword}
                  </div>
                ) : null}
                {apiError ? (
                  <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {apiError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold text-lg hover:scale-[1.01] duration-300 shadow-lg cursor-pointer"
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "إنشاء حساب"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  className="w-full py-3 mt-5 rounded-full bg-white border border-gray-300 text-gray-700 font-medium flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  <span className="text-sm"> إنشاء حساب باستخدام Google</span>
                </button>
                <p className="text-center text-gray-500 mt-6">
                  هل لديك حساب {" ؟ "}
                  <NavLink
                    to="/login"
                    className="text-sky-700 font-bold hover:underline"
                  >
                    تسجيل الدخول
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
