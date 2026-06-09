import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { UserContext } from "../../Context/UserContext";
import logo from "../../assets/11111.jpg";

export default function Login() {
  let navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let { setUserLogin } = useContext(UserContext);

  async function handelLogin(formValues) {
    setIsLoading(true);

    // 2. Fallback to server API if no local match is found
    try {
      let { data } = await axios.post(
        `https://dawaya-back-end.vercel.app/api/auth/login`,
        formValues,
      );
      if (data.success) {
        const token = data.data.accessToken;
        localStorage.setItem("userToken", token);
        setUserLogin(token);

        // Store active session parameters
        localStorage.setItem("dawaya_current_email", formValues.email);
        localStorage.setItem("dawaya_current_password", formValues.password);

        // Save or update user credentials in the local registry
        try {
          const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
          const index = users.findIndex(u => u.email.toLowerCase() === formValues.email.toLowerCase());
          if (index > -1) {
            users[index].password = formValues.password;
            users[index].token = token;
          } else {
            users.push({
              username: formValues.email.split('@')[0].slice(0, 12),
              email: formValues.email,
              password: formValues.password,
              phone: '01012345678',
              gender: 'male',
              age: 25,
              token: token
            });
          }
          localStorage.setItem("dawaya_users", JSON.stringify(users));
        } catch (e) {
          console.error("Saving to local user directory failed", e);
        }

        setIsLoading(false);
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      setApiError(error.response?.data?.message || "خطأ في تسجيل الدخول. يرجى التحقق من البيانات.");
    }
  }

  let validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
        "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف كبير ورقم",
      )
      .required("كلمة المرور مطلوبة"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handelLogin,
  });


  const handleGoogleLogin = () => {
    window.location.href = "https://dawaya-back-end.vercel.app/api/auth/google?action=login";
  }


  return (

    <div className="w-[90%] lg:w-[80%] mx-auto min-h-screen flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border border-sky-100 bg-white my-15">

      <div className="flex-1 bg-[#faf7fb] flex items-center justify-center px-6 py-10 lg:px-14">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-center text-sky-700 mb-3">
            أهلاً بك مجدداً
          </h2>

          <p className="text-gray-500 text-center mb-10">
            قم بتسجيل الدخول إلى حسابك
          </p>

          <form onSubmit={formik.handleSubmit}>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-500 transition-all"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                كلمة المرور
              </label>

              <input
                type="password"
                name="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-500 transition-all"
                placeholder="********"
                required
              />
              <NavLink
                to="/forgetpassword"
                className="text-sm text-sky-700 hover:underline"
              >
                نسيت كلمة المرور؟
              </NavLink>
            </div>

            {apiError && (
              <div className="mb-5 p-3 rounded-xl bg-red-100 text-red-600 text-sm border border-red-200">
                {apiError}
              </div>
            )}

            {formik.touched.email && formik.errors.email && (
              <div className="mb-4 text-red-500 text-sm">
                {formik.errors.email}
              </div>
            )}

            {formik.touched.password && formik.errors.password && (
              <div className="mb-4 text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 text-white font-semibold hover:opacity-90 transition-all shadow-lg cursor-pointer"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
            <p className="text-center text-gray-500 mt-6">
              ليس لديك حساب {" ؟ "}
              <NavLink
                to="/register"
                className="text-sky-700 font-bold hover:underline"
              >
                إنشاء حساب
              </NavLink>
            </p>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 mt-5 rounded-xl bg-white border border-gray-300 font-semibold flex items-center justify-center hover:opacity-100 gap-3 hover:bg-gray-50 transition cursor-pointer" >
              <i className="fa-brands fa-google"></i> تسجيل الدخول عبر Google
            </button>



          </form>
        </div>
      </div>

      <div
        className="hidden md:flex flex-1 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${logo})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-sky-900/80 to-sky-500/40"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center text-white px-10 w-full">
          <h2 className="text-5xl font-extrabold leading-snug mb-6">
            رفيقك الصحي الرقمي الآمن
          </h2>

          <p className="text-lg text-sky-100 leading-8 max-w-md">
            منصة متكاملة لإدارة الصيدليات والوصفات الطبية بكل سهولة وأمان.
          </p>
        </div>
      </div>
    </div>
  );
}
