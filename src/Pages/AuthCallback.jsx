import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

function getCookie(name) {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function getRedirectPath(role) {
  switch (role) {
    case 'admin':      return '/admin';
    case 'pharmacist': return '/pharmacy';
    default:           return '/';
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUserLogin } = useContext(UserContext);

  useEffect(() => {
  const token = searchParams.get('token');
  const roleFromQuery = searchParams.get('role');

  if (!token) {
    navigate('/login', { replace: true });
    return;
  }

  localStorage.setItem('userToken', token);
  setUserLogin(token);

  const decoded = decodeToken(token);
  const role = roleFromQuery || decoded?.role || 'user';
  localStorage.setItem('userRole', role);

  try {
    const email = decoded?.email || '';
    if (email) {
      const users = JSON.parse(localStorage.getItem('dawaya_users') || '[]');
      const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      const userData = {
        username: decoded?.username || email.split('@')[0].slice(0, 12),
        email,
        password: '',
        phone:    decoded?.phone || '',
        gender:   decoded?.gender || '',
        age:      decoded?.age || 25,
        role,
        token,
      };
      if (index > -1) {
        users[index] = { ...users[index], ...userData };
      } else {
        users.push(userData);
      }
      localStorage.setItem('dawaya_users', JSON.stringify(users));
      localStorage.setItem('dawaya_current_email', email);
    }
  } catch (e) {
    console.error('Google login local sync failed', e);
  }

  navigate(getRedirectPath(role), { replace: true });
}, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid var(--color-primary, #1ab5ea)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: '600' }}>
        جاري تسجيل الدخول...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}