import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { CartContext } from "../../Context/CartContext";
import { Lock, X } from "lucide-react";

export default function Layout() {
    const { showLoginModal, setShowLoginModal } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        setShowLoginModal(false);
        navigate("/login");
    };

    const handleRegisterRedirect = () => {
        setShowLoginModal(false);
        navigate("/register");
    };

    return <>
        <Navbar />
        <div className="mx-auto max-w-[1280px] px-4 py-10">
            <Outlet></Outlet>
        </div>
        <Footer />

        { }
        {showLoginModal && (
            <div className="modal-overlay" style={{ zIndex: 10000 }}>
                <div className="modal-content animate-fade-in" style={{ maxWidth: '440px', background: '#fff' }}>
                    <div className="modal-header" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
                        <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                backgroundColor: 'rgba(26, 181, 234, 0.08)', color: 'var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Lock size={18} />
                            </div>
                            <span>مطلوب تسجيل الدخول</span>
                        </div>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => setShowLoginModal(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="modal-body" style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--color-text-main)',
                            lineHeight: '1.7',
                            margin: '0 0 24px',
                            fontWeight: '600'
                        }}>
                            تحتاج إلى تسجيل الدخول أو إنشاء حساب جديد للمتابعة.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={handleLoginRedirect}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '12px 0', fontWeight: '800', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                تسجيل الدخول الآن
                            </button>
                            <button
                                onClick={handleRegisterRedirect}
                                className="btn btn-outline"
                                style={{ width: '100%', padding: '12px 0', fontWeight: '800', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                إنشاء حساب جديد
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
}
