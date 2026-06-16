import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getUserById } from '../../services/api';
import { jwtDecode } from "jwt-decode";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingCart, 
  Globe, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { path: '/admin/users', label: 'المستخدمين', icon: Users },
  { path: '/admin/pharmacies', label: 'الصيدليات', icon: Store },
  { path: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { path: '/', label: 'تصفح الموقع الرئيسي', icon: Globe, end: true },
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };
  const token = localStorage.getItem("userToken");

  const decoded = token ? jwtDecode(token) : null;

  const userId = decoded?._id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

    function logout() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/");
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)', fontFamily: 'Cairo, sans-serif' }}>

      <aside className={`${collapsed ? 'w-16' : 'w-60'} flex flex-col transition-all duration-300 flex-shrink-0`}
        style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
        <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
       
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
              alt="Dawaya Logo"
              style={{
                height: collapsed ? "36px" : "65px",
                width: "auto",
                objectFit: "contain",
                transition: "height 0.3s",
              }}
            />
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: 'var(--color-text-muted)', background: 'var(--bg-primary)' }}>
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {collapsed && (
          <div className="flex justify-center py-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: 'var(--color-text-muted)', background: 'var(--bg-primary)' }}>
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

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
                justifyContent: collapsed ? "center" : "flex-start",
              })}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0">
                <item.icon size={18} />
              </span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all"
            style={{
              color: "var(--color-danger)",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            title={collapsed ? "تسجيل الخروج" : undefined}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-danger-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>

          <h1 className="font-bold text-sm" style={{ color: 'var(--color-text-muted)' }}>
            لوحة تحكم الأدمن
          </h1>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, #0ea5e9 100%)",
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}