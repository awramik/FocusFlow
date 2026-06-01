import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Stan początkowy z localStorage
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const setFavicon = (iconPath) => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconPath;
  };

  // Efekt uruchamiający się natychmiast na całej stronie
  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : '';
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      setFavicon('/favicon-light.svg');
    } else {
      setFavicon('/favicon-dark.svg');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);