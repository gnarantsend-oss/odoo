'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'abyss' | 'crimson' | 'aurora' | 'ember' | 'forest';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'abyss',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const VALID: Theme[] = ['abyss', 'crimson', 'aurora', 'ember', 'forest'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('abyss');

  useEffect(() => {
    const saved = localStorage.getItem('narhan-theme') as Theme | null;
    const initial = saved && VALID.includes(saved) ? saved : 'abyss';
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('narhan-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  // ❌ ХУУЧИН: if (!mounted) return <>{children}</> ← double render → FLASH
  // ✅ ШИНЭ: Provider-ыг ҮРГЭЛЖ render хийнэ
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
