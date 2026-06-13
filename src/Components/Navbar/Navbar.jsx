import { useState, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaGlobe,
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
  const [search, setSearch] = useState("");
  const { pathname, hash } = useLocation();
  const { userLogin, setUserLogin } = useContext(UserContext);
  const { cartCount } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/");
  }

  return (
    <>
      <div className="nb">
        <div className="nb-top">احنا معاك ف بيتك احنا دواك..</div>

        <nav className="nb-main">
          <div className="nb-inner">
            <Link to="/" className="nb-logo">
              <img
                src="/imges/logo.png"
                alt="Dawaa Logo"
                style={{ width: "100px", height: "90px" }}
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
                to="/#products-section"
                className={`nb-link${(pathname === "/" && hash === "#products-section") ? " active" : ""}`}
              >
                المنتجات
              </Link>

              <Link
                to="/#pharmacies-section"
                className={`nb-link${(pathname === "/" && hash === "#pharmacies-section") ? " active" : ""}`}
              >
                الصيدليات
              </Link>
            </div>

            <div className="nb-search">
              <input
                placeholder="ابحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="nb-search-icon">
                <FaSearch />
              </span>
            </div>

            <div className="nb-actions">
              <button className="nb-icon-btn">
                <FaGlobe />
              </button>

              <Link to="/favorites" className="nb-icon-btn" style={{ position: "relative", textDecoration: "none" }}>
                <FaHeart style={{ color: "#000000" }} />
                {favorites.length > 0 && <span className="nb-badge" style={{ backgroundColor: "#e53935" }}>{favorites.length}</span>}
              </Link>

              <Link to="/cart" className="nb-icon-btn" style={{ position: "relative", textDecoration: "none" }}>
                <FaShoppingCart />
                {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
              </Link>
            </div>

            {/* Auth Section */}
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
              <div className="nb-auth-links">
                <NavLink to="/profile" className="nb-link">
                  الملف الشخصي
                </NavLink>
                <span
                  onClick={logout}
                  className="nb-login"
                  style={{ cursor: "pointer" }}
                >
                  تسجيل الخروج
                </span>
              </div>
            )}

            <button
              className="nb-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="nb-mobile-menu">
               <Link to="/" className="nb-mobile-link">الرئيسية</Link>
              <Link to="/#products-section" className="nb-mobile-link">المنتجات</Link>
              <Link to="/#pharmacies-section" className="nb-mobile-link">الصيدليات</Link>

              {userLogin == null ? (
                <>
                  <Link to="/register" className="nb-mobile-link">
                    إنشاء حساب
                  </Link>
                  <Link to="/login" className="nb-mobile-login">
                    تسجيل دخول
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="nb-mobile-link">
                    الملف الشخصي
                  </Link>
                  <span
                    onClick={logout}
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
