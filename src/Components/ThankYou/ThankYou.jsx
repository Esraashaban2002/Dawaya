import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-[#f6f7fb] px-4 py-20">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg text-center">
        <div className="text-green-500 text-6xl mb-4">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-sky-700">شكراً لتسجيلك</h1>

        <p className="text-gray-600 mb-6 leading-7">
          تم استلام طلبك بنجاح، وسيتم مراجعة البيانات من قبل الإدارة. سنقوم
          بالتواصل معك في أقرب وقت ممكن.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-xl transition pointer-coarse:"
        >
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
