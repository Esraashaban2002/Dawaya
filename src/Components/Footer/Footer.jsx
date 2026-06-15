import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe() {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <footer
      dir="rtl"
      className="bg-[#1a2744] text-white"
      style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
    >
      <div className="w-[90%] lg:w-[80%] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">دوايا</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              منصة رعاية طبية مميزة تربطك بأفضل الصيدليات المعتمده مع توصيل فوري
              لباب منزلك
            </p>
            <div className="flex gap-3 pt-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all duration-200">
                <i className="fas fa-share-alt text-xs"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all duration-200">
                <i className="fas fa-globe text-xs"></i>
              </button>
            </div>
          </div>

          {}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white/90">خدماتنا</h3>
            <ul className="space-y-2">
              {[
                { name: "رفع الروشتة", path: "/prescription" },
                { name: "تذكيرات الجرعات", path: "/reminders" },
                { name: "طلبات الجملة", path: "#" },
                { name: "تحاليل طبية", path: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="text-white/45 text-sm hover:text-white/80 transition-colors duration-200"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white/90">الشركة</h3>
            <ul className="space-y-2">
              {[
                { name: "من نحن", path: "/about" },
                { name: "الوظائف", path: "#" },
                { name: "سياسة الخصوصية", path: "#" },
                { name: "شروط الخدمة", path: "#" }
              ].map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className="text-white/45 text-sm hover:text-white/80 transition-colors duration-200"
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </div>

          {}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white/90">الدعم</h3>
            <ul className="space-y-2">
              {["التواصل بالدعم", "متجر التطبيقات", "جوجل بلاى"].map((link) => (
                <li key={link}>
                  <NavLink
                    to="#"
                    className="text-white/45 text-sm hover:text-white/80 transition-colors duration-200"
                  >
                    {link}
                  </NavLink>
                </li>
              ))}
            </ul>

            {}
            <div className="mt-4 bg-[#253361] rounded-xl p-3 flex flex-col gap-2">
              {subscribed ? (
                <p className="text-teal-400 text-xs text-center py-1">
                  تم الاشتراك بنجاح ✓
                </p>
              ) : (
                <>
                  <div className="flex gap-2 items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="البريد الإلكتروني..."
                      className="flex-1 bg-[#1a2744] text-white text-xs placeholder-white/30 rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-sky-400/40 transition"
                    />
                    <button
                      onClick={handleSubscribe}
                      className="bg-sky-600 hover:bg-sky-500 transition-colors text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer"
                    >
                      انضم
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="border-t border-white/10" />

      {}
      <div className="w-[90%] lg:w-[80%] mx-auto py-4 flex items-center justify-center">
        <p className="text-white/40 text-xs text-center">
          © 2026 دوايا. رعاية طبية مميزة. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
