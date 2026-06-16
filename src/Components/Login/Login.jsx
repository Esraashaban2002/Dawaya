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

  //  helper: decode JWT payload without library 
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  //  helper: redirect based on role 
  const redirectByRole = (role) => {
    switch (role) {
      case 'admin':       navigate('/admin'); break;
      case 'pharmacist':  navigate('/pharmacy'); break;
      default:            navigate('/');
    }
  };

  try {
    const users = JSON.parse(localStorage.getItem('dawaya_users') || '[]');
    const matchedUser = users.find(
      u => u.email.toLowerCase() === formValues.email.toLowerCase()
    );
    if (matchedUser && matchedUser.password === formValues.password) {
      const activeToken = matchedUser.token || localStorage.getItem('userToken') || 'mock_token_for_dawaya_auth';
      localStorage.setItem('userToken', activeToken);
      setUserLogin(activeToken);
      localStorage.setItem('dawaya_current_email', matchedUser.email);
      localStorage.setItem('dawaya_current_password', matchedUser.password);
      setIsLoading(false);

      redirectByRole(matchedUser.role || 'user');
      return;
    }
  } catch (e) {
    console.error('Local login intercept failed', e);
  }

  //  2. Fallback to server API 
  try {
    const { data } = await axios.post(
      'https://dawaya-back-end.vercel.app/api/auth/login',
      formValues,
    );

    if (data.success) {
      const token    = data.data.accessToken;

      const userRole = data.data.user?.role
                    || data.data.role
                    || decodeToken(token)?.role
                    || 'user';

      localStorage.setItem('userToken', token);
      localStorage.setItem('userRole', userRole);
      setUserLogin(token);
      localStorage.setItem('dawaya_current_email', formValues.email);
      localStorage.setItem('dawaya_current_password', formValues.password);

      try {
        const users = JSON.parse(localStorage.getItem('dawaya_users') || '[]');
        const index = users.findIndex(
          u => u.email.toLowerCase() === formValues.email.toLowerCase()
        );
        const userData = {
          username: data.data.user?.username || formValues.email.split('@')[0].slice(0, 12),
          email:    formValues.email,
          phone:    data.data.user?.phone || '01012345678',
          gender:   data.data.user?.gender || '',
          age:      data.data.user?.age || 25,
          role:     userRole,
          token,
        };
        if (index > -1) {
          users[index] = { ...users[index], ...userData };
        } else {
          users.push(userData);
        }
        localStorage.setItem('dawaya_users', JSON.stringify(users));
      } catch (e) {
        console.error('Saving to local user directory failed', e);
      }

      setIsLoading(false);
      redirectByRole(userRole);
    }
  } catch (error) {
    setIsLoading(false);
    setApiError(
      error.response?.data?.message || 'خطأ في تسجيل الدخول. يرجى التحقق من البيانات.'
    );
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

                  <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 mt-5 rounded-full bg-white border border-gray-300 text-gray-700 font-medium flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span className="text-sm">تسجيل الدخول عبر Google</span>
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
