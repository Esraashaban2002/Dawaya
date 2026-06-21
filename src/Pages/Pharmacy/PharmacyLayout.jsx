import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHouse,
  FaUser,
  FaStore,
  FaCartShopping,
  FaRightFromBracket,
} from "react-icons/fa6";
const navItems = [
  { path: "/pharmacy", label: "الرئيسية", icon: <FaHouse />, end: true },
  {
    path: "/pharmacy/pharmacyprofile",
    label: "الملف الشخصي",
    icon: <FaUser />,
  },
  {
    path: "/pharmacy/pharmacystock",
    label: " إدارة المخزون",
    icon: <FaStore />,
  },
  {
    path: "/pharmacy/pharmacyorders",
    label: "الطلبات",
    icon: <FaCartShopping />,
  },
];

export default function PharmacyLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        fontFamily: "Cairo, sans-serif",
      }}
    >
      <aside
        className={`${collapsed ? "w-16" : "w-60"} flex flex-col transition-all duration-300 flex-shrink-0`}
        style={{
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {!collapsed && (
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <img
                src="/imges/logo.png"
                alt="Dawaa Logo"
                style={{ width: "80px", height: "50px" }}
              />
            </Link>

          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              color: "var(--color-text-muted)",
              background: "var(--bg-primary)",
            }}
          >
            {collapsed ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={({ isActive }) => ({
                background: isActive
                  ? "var(--color-primary-light)"
                  : "transparent",
                color: isActive
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
                fontWeight: isActive ? "700" : "500",
              })}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div
          className="px-2 py-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all cursor-pointer"
            style={{ color: "var(--color-danger)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-danger-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span>
              <FaRightFromBracket />
            </span>
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">

        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h1
            className="font-bold text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            لوحة تحكم الصيدليه
          </h1>
        </div>

        <div className="flex-1 overflow-scroll p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
