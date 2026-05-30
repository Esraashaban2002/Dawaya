import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyCompleted() {
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      <div className="w-full max-w-xl text-center bg-white rounded-[32px] shadow-2xl border border-sky-100 py-12 md:px-14">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-200 flex items-center justify-center">
            <i className="fa-regular fa-circle-check text-5xl text-green-600"></i>
          </div>

          <h2 className="text-4xl font-extrabold text-sky-700 mb-3">
            تم تأكيد حسابك بنجاح
          </h2>

          <p className="text-gray-500 leading-7 py-5">
            يمكنك الآن تسجيل الدخول والبدء في استخدام منصة دوايا.{" "}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsLoading(true);

            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }}
          className="w-[90%] mx-auto py-3 text-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </div>
    </div>
  );
}
