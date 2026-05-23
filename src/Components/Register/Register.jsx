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

}
