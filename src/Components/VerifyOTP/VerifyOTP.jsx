<<<<<<< HEAD
import { useState } from 'react'
import axios from "axios"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from 'yup'

export default function VerifyOTP() {

    let navigate = useNavigate()
    const [apiError, setApiError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handelLogin(formValues) {
        setIsLoading(true)
        try {

            let { data } = await axios.post(`https://dawaya-back-end.vercel.app/api/auth/verify`, formValues)
            if (data.success) {
                setIsLoading(false);
                navigate('/login')
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error.response.data.message);
            setApiError(error.response?.data?.message);
        }
    }

    let validationSchema = yup.object().shape({
        email: yup.string().email("البريد الإلكتروني غير صالح").required("البريد الإلكتروني مطلوب"),
        otp: yup.string().matches(/^\d{6}$/, "كود التحقق يجب أن يكون 6 أرقام").required("كود التحقق مطلوب")
    })

    let formik = useFormik({
        initialValues: {
            email: '',
            otp: ""
        },
        validationSchema,
        onSubmit: handelLogin
    })

    return (

        <div className='p-10 mx-auto max-w-xl bg-white shadow-lg border border-sky-100 rounded-3xl'>
            {/* <h2 className="text-3xl mb-10 font-bold text-sky-700 text-center">تحقق من بريدك الإلكتروني</h2> */}

            <form className="max-w-xl mx-auto" onSubmit={formik.handleSubmit}>

                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">البريد الإلكترونى</label>
                    <input type="email" name='email' value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} id="email" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="name@flowbite.com" required />
                </div>

                <div>
                    <label htmlFor="otp" className="block mb-2.5 text-sm font-medium text-heading">كود التحقق</label>
                    <input type="text" id="otp" name='otp' value={formik.values.otp} onBlur={formik.handleBlur} onChange={formik.handleChange} className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="" required />
                </div>

                {((formik.errors.otp && formik.touched.otp) || apiError) ? (
                    <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert" >
                        {formik.errors.otp || apiError} </div>) : null}

                <p id="helper-text-explanation" className="mt-2.5 text-sm text-body text-center my-5">أدخل رمز التحقق المكوّن من 6 أرقام الذي أرسلناه إلى بريدك الإلكتروني</p>


                <button type="submit" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'تأكيد'}
                </button>


            </form>

        </div>
    )
=======
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export default function VerifyOTP() {
  let navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handelLogin(formValues) {
    setIsLoading(true);
    try {
      let { data } = await axios.post(
        `https://dawaya-back-end.vercel.app/api/auth/verify`,
        formValues,
      );
      if (data.success) {
        setIsLoading(false);
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      setApiError(error.response?.data?.message);
    }
  }

  let validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الإلكتروني مطلوب"),
    otp: yup
      .string()
      .matches(/^\d{6}$/, "كود التحقق يجب أن يكون 6 أرقام")
      .required("كود التحقق مطلوب"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema,
    onSubmit: handelLogin,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-sky-100  py-12 md:px-14">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-sky-700 mb-3">
            تحقق من بريدك الإلكتروني
          </h2>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              البريد الإلكتروني
            </label>

            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-500 transition-all"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              كود التحقق
            </label>

            <input
              type="text"
              id="otp"
              name="otp"
              value={formik.values.otp}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-full px-4 py-3 text-center tracking-[10px] text-xl rounded-xl border border-gray-200 bg-white outline-none focus:border-sky-500 transition-all"
              placeholder="000000"
              required
            />

            <p className="text-gray-500 leading-7 py-5">
              أدخل رمز التحقق المكوّن من 6 أرقام الذي أرسلناه إلى بريدك
              الإلكتروني
            </p>
          </div>

          {((formik.errors.otp && formik.touched.otp) || apiError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {formik.errors.otp || apiError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold text-lg shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "تأكيد الحساب"
            )}
          </button>
        </form>
      </div>
    </div>
  );
>>>>>>> 0fae21a (Add user profile code)
}
