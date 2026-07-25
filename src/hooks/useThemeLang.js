// Shared hook: returns isDark boolean and card/text style helpers for inline dark styling
import { useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';
import { LanguageContext } from '../Context/LanguageContext';

export function useDarkMode() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const pageStyle = isDark
    ? { backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }
    : {};

  const cardStyle = isDark
    ? { backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }
    : { backgroundColor: '#ffffff', color: '#1e293b' };

  const cardAltStyle = isDark
    ? { backgroundColor: '#0f172a', color: '#f8fafc', borderColor: '#334155' }
    : { backgroundColor: '#f8fafc', color: '#1e293b' };

  const textMain = isDark ? '#f8fafc' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const border = isDark ? '#334155' : '#e2e8f0';
  const inputStyle = isDark
    ? { backgroundColor: '#0f172a', color: '#f8fafc', borderColor: '#334155' }
    : {};

  return { isDark, pageStyle, cardStyle, cardAltStyle, textMain, textMuted, border, inputStyle };
}

export function useLang() {
  const { t, language } = useContext(LanguageContext);
  const isAr = language === 'ar';
  return { t, language, isAr };
}
