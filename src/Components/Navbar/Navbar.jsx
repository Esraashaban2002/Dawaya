import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";

export default function Navbar() {
  let { userLogin, setUserLogin } = useContext(UserContext);
  let navigate = useNavigate();
  function logout() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/");
  }

  return (
    <>
      <header className="fixed w-full z-20 top-0 start-0">
        <nav className="bg-neutral-primary">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            <NavLink
              to="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img src={logo} className="w-35" alt="Flowbite Logo" />

              {/* <span className="self-center text-xl text-heading font-semibold whitespace-nowrap"> Flowbite</span> */}
            </NavLink>

            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              {userLogin == null ? (
                <>
                  <NavLink
                    to="/register"
                    className="text-sm font-medium pl-5 hover:underline"
                  >
                    إنشاء حساب
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="text-sm font-medium text-fg-brand hover:underline"
                  >
                    تسجيل الدخول
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    className="text-sm font-medium pl-5 hover:underline text-fg-brand"
                  >
                    الملف الشخصي
                  </NavLink>
                  <span
                    onClick={logout}
                    className="text-sm font-medium pl-5 hover:underline cursor-pointer"
                  >
                    تسجيل الخروج
                  </span>
                </>
              )}
            </div>
          </div>
        </nav>

        <nav className="bg-neutral-secondary-soft border-y border-default">
          <div className="max-w-screen-xl px-4 py-3 mx-auto">
            <div className="flex items-center">
              <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                <li>
                  <NavLink
                    to="/"
                    className="text-heading hover:underline"
                    aria-current="page"
                  >
                    الرئيسيه
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className="text-heading hover:underline">
                    من نحن{" "}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="" className="text-heading hover:underline">
                    الصيدليات
                  </NavLink>
                </li>
                <li>
                  <NavLink to="" className="text-heading hover:underline">
                    خدمات{" "}
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* <div class="max-w-lg mx-auto">
                        <label for="search" class="block mb-2.5 text-sm font-medium text-heading sr-only ">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                            </div>
                            <input type="search" id="search" class="block w-full p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Search" required />
                            <button type="button" class="absolute end-1.5 bottom-1.5 text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none">Search</button>
                        </div>
                    </div> */}
        </nav>
      </header>
    </>
  );
}
