<<<<<<< HEAD
import axios from "axios"
import { useFormik } from "formik"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as yup from 'yup'

export default function Register() {

    let navigate = useNavigate()

    const [apiError, setApiError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handelRegester(formValues) {

        setIsLoading(true);

        let { rePassword, ...dataToSend } = formValues;

        try {
            let { data } = await axios.post(`https://dawaya-back-end.vercel.app/api/auth/register`, dataToSend)

            if (data.success) {
                setIsLoading(false);
                console.log(data);
                navigate('/verifyotp')
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error.response.data);
            setApiError(error.response.data.message);
        }
    }

    let validationSchema = yup.object().shape({

        username: yup.string().min(2, 'الاسم يجب ألا يقل عن حرفين').max(12, 'الاسم يجب ألا يزيد عن 12 حرف').required('الاسم مطلوب'),
        phone: yup.string().matches(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح').required('رقم الهاتف مطلوب'),
        email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
        password: yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف كبير ورقم').required('كلمة المرور مطلوبة'),
        rePassword: yup.string().oneOf([yup.ref('password')], 'كلمة المرور غير متطابقة').required('تأكيد كلمة المرور مطلوب'),
    })


    let formik = useFormik({
        initialValues: {
            username: '',
            phone: '',
            email: '',
            password: '',
            rePassword: '',
            gender: ''
        },
        validationSchema,
        onSubmit: handelRegester

    })

    return <>

        <div className='p-10 mx-auto max-w-xl bg-white shadow-lg border border-sky-100 rounded-3xl'>
            <h2 className="text-3xl mb-10 font-bold text-sky-700">إنشاء حساب جديد</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" onBlur={formik.handleBlur} onChange={formik.handleChange} name="username" value={formik.values.username} id="username" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-base border-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="username" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">اسم المستخدم</label>
                </div>

                <p>{(formik.errors.username || apiError) && formik.touched.username ? <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert">
                    {formik.errors.username} </div> : null}</p>

                <div className="relative z-0 w-full mb-5 group">
                    <input type="tel" onBlur={formik.handleBlur} onChange={formik.handleChange} name="phone" value={formik.values.phone} id="phone" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-base border-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="phone" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">رقم الهاتف</label>
                </div>

                <p>{(formik.errors.phone || apiError) && formik.touched.phone ? <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert">
                    {formik.errors.phone} </div> : null}</p>

                <div className="relative z-0 w-full mb-5 group">
                    <ul className="items-center w-full text-sm font-medium text-heading bg-neutral-primary-soft border border-default rounded-lg sm:flex">

                        <li className="w-full border-b border-default sm:border-b-0 sm:border-r">
                            <div className="flex items-center ps-3">
                                <input id="genderM" type="radio" onBlur={formik.handleBlur} onChange={formik.handleChange} value='male' name="gender" checked={formik.values.gender === "male"} className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none" />
                                <label htmlFor="genderM" className="w-full py-3 select-none ms-2 text-sm font-medium text-heading">ذكر</label>
                            </div>

                        </li>
                        <li className="w-full border-b border-default sm:border-b-0 sm:border-r">
                            <div className="flex items-center ps-3">
                                <input id="genderF" type="radio" onBlur={formik.handleBlur} onChange={formik.handleChange} value='female' name="gender" checked={formik.values.gender === "female"} className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none" />
                                <label htmlFor="genderF" className="w-full py-3 select-none ms-2 text-sm font-medium text-heading">أنثى</label>
                            </div>

                        </li>
                    </ul>

                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <input type="email" onBlur={formik.handleBlur} onChange={formik.handleChange} name="email" value={formik.values.email} id="email" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-base border-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="email" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">البريد الالكتروني</label>
                </div>

                <p>{(formik.errors.email || apiError) && formik.touched.email ? <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert">
                    {formik.errors.email} </div> : null}</p>

                <div className="relative z-0 w-full mb-5 group">
                    <input type="password" onBlur={formik.handleBlur} onChange={formik.handleChange} name="password" value={formik.values.password} id="password" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-base border-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="password" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">كلمه المرور</label>
                </div>

                <p>{(formik.errors.password || apiError) && formik.touched.password ? <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert">
                    {formik.errors.password} </div> : null}</p>

                <div className="relative z-0 w-full mb-5 group">
                    <input type="password" onBlur={formik.handleBlur} onChange={formik.handleChange} name="rePassword" value={formik.values.rePassword} id="rePassword" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-base border-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="rePassword" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">تأكيد كلمه المرور</label>
                </div>

                <p>{formik.errors.rePassword && formik.touched.rePassword ? <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert">
                    {formik.errors.rePassword} </div> : null}</p>

                <button type="submit" className=" text-white bg-sky-700 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'تسجيل'}
                </button>


            </form>
        </div>

    </>

=======
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
      .min(1, "العمر يجب أن يكون سنة واحدة على الأقل")
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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] py-10 px-4">
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
                    type="number"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
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
>>>>>>> 0fae21a (Add user profile code)
}
