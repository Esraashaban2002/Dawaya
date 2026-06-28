import { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import "./Navbar.css";
import { UserContext } from "../../Context/UserContext";
import { CartContext } from "../../Context/CartContext";
import { FavoritesContext } from "../../Context/FavoritesContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", image: "" });
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);
  const { pathname, hash, search: urlSearch } = useLocation();
  const { userLogin, setUserLogin } = useContext(UserContext);
  const { cartCount } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const query = new URLSearchParams(urlSearch).get("search") || "";
    setSearch(query);
  }, [urlSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setImgError(false);
    if (userLogin) {
      const email = localStorage.getItem("dawaya_current_email") || "";
      const users = JSON.parse(localStorage.getItem("dawaya_users") || "[]");
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        setUserInfo({
          name: matchedUser.username || matchedUser.name || "مستخدم",
          image: matchedUser.image || ""
        });
      } else {
        try {
          const payload = userLogin.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          setUserInfo({
            name: decoded.username || decoded.name || "مستخدم",
            image: decoded.image || ""
          });
        } catch {
          setUserInfo({ name: "مستخدم", image: "" });
        }
      }
    } else {
      setUserInfo({ name: "", image: "" });
    }
  }, [userLogin]);

  function logout() {
    localStorage.removeItem("userToken");
    localStorage.setItem("dawaya_logged_out", "true");
    setUserLogin(null);
    navigate("/");
  }

  const firstLetter = userInfo.name ? userInfo.name.trim().charAt(0).toUpperCase() : "م";

  return (
    <>
      <div className="nb">
        <div className="nb-top">احنا معاك ف بيتك احنا دواك..</div>

        <nav className="nb-main">
          <div className="nb-inner">
            <Link to="/" className="nb-logo">
              <img
                src="/imges/logo.png"
                alt="Dawaya Logo"
                style={{ height: "72px", width: "auto", objectFit: "contain" }}
              />
            </Link>

            <div className="nb-links">
              <Link
                to="/"
                className={`nb-link${pathname === "/" ? " active" : ""}`}
              >
                الرئيسية
              </Link>

              <Link
                to="/products"
                className={`nb-link${(pathname === "/products") ? " active" : ""}`}
              >
                المنتجات
              </Link>

              <Link
                to="/pharmacies"
                className={`nb-link${(pathname === "/" && hash === "pharmacies") ? " active" : ""}`}
              >
                الصيدليات
              </Link>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/products?search=${search}`);
              }} 
              className="nb-search"
            >
              <input
                placeholder="إبحث باسم الدواء"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  navigate(`/products?search=${e.target.value}`);
                }}
              />
              <span 
                className="nb-search-icon"
                onClick={() => navigate(`/products?search=${search}`)}
                style={{ cursor: "pointer" }}
              >
                <FaSearch />
              </span>
            </form>

            <div className="nb-actions">
              <Link to="/favorites" className="nb-icon-btn" style={{ position: "relative", textDecoration: "none" }}>
                <FaHeart style={{ color: "#000000" }} />
                {favorites.length > 0 && <span className="nb-badge" style={{ backgroundColor: "#e53935" }}>{favorites.length}</span>}
              </Link>

              <Link to="/cart" className="nb-icon-btn" style={{ position: "relative", textDecoration: "none" }}>
                <FaShoppingCart />
                {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
              </Link>
            </div>

            {}
            {userLogin == null ? (
              <div className="nb-auth-links">
                <NavLink to="/AccountType" className="nb-link">
                  إنشاء حساب
                </NavLink>
                <NavLink to="/login" className="nb-login">
                  <FaUser />
                  دخول
                </NavLink>
              </div>
            ) : (
              <div className="nb-user-menu-container" ref={dropdownRef}>
                <div 
                  className="nb-user-trigger" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {userInfo.image && !imgError ? (
                    <img 
                      src={userInfo.image} 
                      alt={userInfo.name} 
                      className="nb-user-avatar"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="nb-user-avatar-placeholder">
                      {firstLetter}
                    </div>
                  )}
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`nb-dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {dropdownOpen && (
                  <div className="nb-dropdown-menu">
                    <div className="nb-dropdown-header">
                      <span className="nb-welcome-msg">مرحباً،</span>
                      <span className="nb-username-display">{userInfo.name}</span>
                    </div>
                    <div className="nb-dropdown-divider"></div>
                    {userRole === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="nb-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nb-item-icon"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                        <span>لوحة التحكم</span>
                      </Link>
                    )}
                    {userRole === 'pharmacist' && (
                      <Link 
                        to="/pharmacy" 
                        className="nb-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nb-item-icon"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                        <span>لوحة التحكم</span>
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      className="nb-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="nb-item-icon" />
                      <span>الملف الشخصي</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }} 
                      className="nb-dropdown-item logout"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nb-item-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="nb-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {}
          {menuOpen && (
            <div className="nb-mobile-menu">
              <Link to="/" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
              <Link to="/#products-section" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>المنتجات</Link>
              <Link to="/#pharmacies-section" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>الصيدليات</Link>

              {userLogin == null ? (
                <>
                  <Link to="/register" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>
                    إنشاء حساب
                  </Link>
                  <Link to="/login" className="nb-mobile-login" onClick={() => setMenuOpen(false)}>
                    تسجيل دخول
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {userInfo.image && !imgError ? (
                        <img 
                          src={userInfo.image} 
                          alt={userInfo.name} 
                          style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #1ab5ea' }}
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #1ab5ea, #0d82d3)', 
                          color: '#fff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: '700',
                          fontSize: '14px'
                        }}>
                          {firstLetter}
                        </div>
                      )}
                      <span>{userInfo.name}</span>
                    </div>
                  </Link>
                  <span
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="nb-mobile-login"
                    style={{ cursor: "pointer" }}
                  >
                    تسجيل الخروج
                  </span>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </>
  );
}