'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'sapphire' | 'ruby' | 'emerald' | 'diamond';
export type Mode = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('sapphire');
  const [mode, setMode] = useState<Mode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('kitgems-theme') as Theme;
    const savedMode = localStorage.getItem('kitgems-mode') as Mode;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('kitgems-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('kitgems-mode', mode);
      document.documentElement.setAttribute('data-mode', mode);
    }
  }, [mode, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export const themes = {
  sapphire: {
    name: 'Sapphire',
    primary: '#243B6B',
    accent: '#D4AF37',
    emoji: '💎',
  },
  ruby: {
    name: 'Ruby',
    primary: '#8B0000',
    accent: '#FFD700',
    emoji: '💍',
  },
  emerald: {
    name: 'Emerald',
    primary: '#0F4C3A',
    accent: '#50C878',
    emoji: '🟢',
  },
  diamond: {
    name: 'Diamond',
    primary: '#1E293B',
    accent: '#E0E7FF',
    emoji: '💠',
  },
};
