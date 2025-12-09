"use client";
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Carregar preferência salva
    const savedTheme = localStorage.getItem('claramente-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('claramente-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('claramente-theme', 'light');
    }
  };

  return {
    isDark,
    toggleDarkMode,
    mounted
  };
}
