'use client';

import { useState, useEffect } from 'react';

export type ContrastMode = 'normal' | 'high';

interface ContrastConfig {
  mode: ContrastMode;
  label: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    border: string;
    accent: string;
  };
}

export const CONTRAST_CONFIGS: Record<ContrastMode, ContrastConfig> = {
  normal: {
    mode: 'normal',
    label: 'Normal',
    description: 'Cores padrão do sistema',
    colors: {
      background: '#ffffff',
      foreground: '#171717',
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      border: '#e5e7eb',
      accent: '#10b981',
    },
  },
  high: {
    mode: 'high',
    label: 'Alto Contraste',
    description: 'Máximo contraste para melhor visibilidade (WCAG AAA)',
    colors: {
      background: '#000000',
      foreground: '#ffffff',
      primary: '#ffff00',
      secondary: '#00ff00',
      border: '#ffffff',
      accent: '#ff00ff',
    },
  },
};

/**
 * Hook para gerenciar modo de alto contraste
 * Oferece tema com máximo contraste para usuários com baixa visão
 * Atende aos critérios WCAG AAA (relação de contraste 7:1 ou superior)
 */
export function useHighContrast() {
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Carregar preferência do localStorage
    const saved = localStorage.getItem('contrast-mode');
    if (saved === 'high' || saved === 'normal') {
      setContrastMode(saved);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Salvar preferência
    localStorage.setItem('contrast-mode', contrastMode);

    // Aplicar CSS custom properties
    const config = CONTRAST_CONFIGS[contrastMode];
    const root = document.documentElement;

    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Adicionar/remover classe no body
    if (contrastMode === 'high') {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [contrastMode, isClient]);

  const toggleContrast = () => {
    setContrastMode(current => current === 'normal' ? 'high' : 'normal');
  };

  const setNormalContrast = () => setContrastMode('normal');
  const setHighContrast = () => setContrastMode('high');

  return {
    contrastMode,
    contrastConfig: CONTRAST_CONFIGS[contrastMode],
    isHighContrast: contrastMode === 'high',
    toggleContrast,
    setNormalContrast,
    setHighContrast,
    isClient,
  };
}
