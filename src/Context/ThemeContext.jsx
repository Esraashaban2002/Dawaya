import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dawaya_theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      // Directly override body styles so Tailwind bg-gray-50 can't win
      body.style.setProperty('background-color', '#0f172a', 'important');
      body.style.setProperty('color', '#f8fafc', 'important');
    } else {
      root.classList.remove('dark');
      body.style.removeProperty('background-color');
      body.style.removeProperty('color');
    }
    localStorage.setItem('dawaya_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
