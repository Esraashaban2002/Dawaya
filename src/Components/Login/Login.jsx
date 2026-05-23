import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import axios from "axios"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from 'yup'

export default function Login() {

    let navigate = useNavigate()
    const [apiError, setApiError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handelLogin(formValues) {
        setIsLoading(true)
        try {

            let { data } = await axios.post(`https://dawaya-back-end.vercel.app/api/auth/login`, formValues)
            if (data.success) {
                setIsLoading(false);
                navigate('/')
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error.response.data.message);
            setApiError(error.response.data.message);
        }
    }

    let validationSchema = yup.object().shape({
        email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
        password: yup.string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف كبير ورقم').required('كلمة المرور مطلوبة'),
    })

    let formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: handelLogin
    })

    return (

        <div className='p-10 mx-auto max-w-xl bg-white shadow-lg border border-sky-100 rounded-3xl'>
            <h2 className="text-3xl mb-10 font-bold text-sky-700">تسجيل الدخول</h2>
            <form className="w-full mx-auto" onSubmit={formik.handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">البريد الإلكترونى</label>
                    <input type="email" name='email' value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} id="email" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="name@flowbite.com" required />
                </div>

                {((formik.errors.email && formik.touched.email) || apiError) ? (
                    <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert" >
                        {formik.errors.email || apiError} </div>) : null}

                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-heading">كلمه السر</label>
                    <input type="password" name='password' value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} id="password" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="••••••••" required />
                </div>

                {((formik.errors.password && formik.touched.password) || apiError) ? (
                    <div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft" role="alert" >
                        {formik.errors.password || apiError} </div>) : null}

                <p className="pb-4">ليس لديك حساب ؟ <span className="font-semibold text-fg-brand hover:underline"><NavLink to='/regester'>سجل الان</NavLink></span></p>

                <button type="submit" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'تسجيل الدخول'}
                </button>

            </form>
        </div>
    )
}
