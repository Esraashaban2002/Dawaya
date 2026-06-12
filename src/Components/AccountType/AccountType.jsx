import { NavLink } from "react-router-dom";

export default function AccountType() {
    return (
        <div className="text-center py-16 w-full bg-slate-50">

            <h2 className="text-4xl font-bold text-sky-700">
                انضم إلى دوايا
            </h2>

            <p className="text-slate-500 mt-3 text-lg">
                اختر مسارك لتجربة استثنائية
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full md:w-[80%] mx-auto mt-12">

                <div
                    className="group w-full md:w-[40%] p-8 rounded-3xl bg-white border border-sky-100
                    shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                    <div className="w-20 h-20 mx-auto my-5 rounded-full bg-sky-500 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-sky-600 group-hover:rotate-6" >
                        <i className="fa-solid fa-user text-3xl"></i>
                    </div>

                    <h3 className="text-2xl font-bold text-sky-700 mb-3">
                        سجل كمستخدم
                    </h3>

                    <p className="text-slate-500 mb-6">
                        ابحث عن الأدوية بسهولة وتابع طلباتك بكل راحة.
                    </p>

                    <NavLink to="/register" className="group/link inline-flex items-center gap-2 font-bold text-sky-700 hover:text-sky-600">
                        ابدأ الآن

                        <i className="fa-solid fa-arrow-left transition-transform duration-300 group-hover/link:-translate-x-2" ></i>
                    </NavLink>
                </div>

                <div
                    className="group w-full md:w-[40%] p-8 rounded-3xl bg-white border border-sky-100
                    shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                    <div
                        className="w-20 h-20 mx-auto my-5 rounded-full bg-sky-500
                        flex items-center justify-center text-white
                        transition-all duration-300
                        group-hover:bg-sky-600 group-hover:rotate-6"
                    >
                        <i className="fa-solid fa-user-doctor text-3xl"></i>
                    </div>

                    <h3 className="text-2xl font-bold text-sky-700 mb-3">
                        سجل كصيدلي
                    </h3>

                    <p className="text-slate-500 mb-6">
                        أدر صيدليتك وواصل العملاء بسهولة من خلال منصة دوايا.
                    </p>

                    <NavLink
                        to="/pharmacistRegister"
                        className="group/link inline-flex items-center gap-2 font-bold text-sky-700 hover:text-sky-600"
                    >
                        ابدأ الآن

                        <i
                            className="fa-solid fa-arrow-left transition-transform duration-300
                            group-hover/link:-translate-x-2"
                        ></i>
                    </NavLink>
                </div>

            </div>
        </div>
    );
}