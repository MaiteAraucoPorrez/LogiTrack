import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Theme } from '@mui/material/styles';
import { makeTheme } from '../theme/theme';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('logitrack-theme') === 'dark';
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('logitrack-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const theme = useMemo(() => makeTheme(isDark), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
