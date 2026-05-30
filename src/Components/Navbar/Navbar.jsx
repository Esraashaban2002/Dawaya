import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaGlobe,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { pathname } = useLocation();

  // const [cartCount, setCartCount] = useState(0);

  // Backend هتربط القيم دي بعدين
  const isLoggedIn = false;
  const userName = "اسم المستخدم";
  const userImage = "/images/user.jpg";

  return (
    <>
      <div className="nb">
        <div className="nb-top">
          احنا معاك ف بيتك احنا دواك..
        </div>

        <nav className="nb-main">
          <div className="nb-inner">

            <Link to="/" className="nb-logo">
              <img
                src="../public/imges/logo.png"
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
                to="/products"
                className={`nb-link${pathname === "/products" ? " active" : ""}`}
              >
                المنتجات
              </Link>

              <Link
                to="/pharmacies"
                className={`nb-link${pathname === "/pharmacies" ? " active" : ""}`}
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

              <button
                className="nb-icon-btn"
                style={{ position: "relative" }}
              >
                <FaShoppingCart />

                {/* {cartCount > 0 && (
                  <span className="nb-badge">
                    {cartCount}
                  </span>
                )} */}
              </button>
            </div>

            {isLoggedIn ? (
              <div className="nb-user">
                <img
                  src={userImage}
                  alt="User"
                  className="nb-user-img"
                />
                <span>{userName}</span>
              </div>
            ) : (
              <Link to="/login" className="nb-login">
                <FaUser />
                دخول
              </Link>
            )}

            <button
              className="nb-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {menuOpen && (
            <div className="nb-mobile-menu">
              <Link to="/" className="nb-mobile-link">
                الرئيسية
              </Link>

              <Link to="/products" className="nb-mobile-link">
                المنتجات
              </Link>

              <Link to="/pharmacies" className="nb-mobile-link">
                الصيدليات
              </Link>

              <Link to="/login" className="nb-mobile-login">
                تسجيل دخول
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* <button
        onClick={() => setCartCount((prev) => prev + 1)}
        style={{ margin: "20px" }}
      >
      </button> */}
    </>
  );
}