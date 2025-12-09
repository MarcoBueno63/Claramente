'use client';

import { useState, useEffect } from 'react';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface FontSizeConfig {
  name: string;
  scale: number;
  description: string;
}

const FONT_CONFIGS: Record<FontSize, FontSizeConfig> = {
  small: {
    name: 'Pequeno',
    scale: 0.875, // 14px base
    description: 'Texto compacto',
  },
  medium: {
    name: 'Médio',
    scale: 1, // 16px base (padrão)
    description: 'Tamanho padrão',
  },
  large: {
    name: 'Grande',
    scale: 1.125, // 18px base
    description: 'Mais confortável',
  },
  xlarge: {
    name: 'Extra Grande',
    scale: 1.25, // 20px base
    description: 'Máxima legibilidade',
  },
};

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Carregar preferência salva
    const saved = localStorage.getItem('font-size') as FontSize;
    if (saved && FONT_CONFIGS[saved]) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    const config = FONT_CONFIGS[size];
    const root = document.documentElement;
    
    // Aplicar escala CSS custom property
    root.style.setProperty('--font-scale', config.scale.toString());
    
    // Aplicar classes de tamanho
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    root.classList.add(`font-${size}`);
  };

  const changeFontSize = (size: FontSize) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem('font-size', size);
  };

  const increaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      changeFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      changeFontSize(sizes[currentIndex - 1]);
    }
  };

  const resetFontSize = () => {
    changeFontSize('medium');
  };

  return {
    fontSize,
    fontConfig: FONT_CONFIGS[fontSize],
    changeFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    canIncrease: fontSize !== 'xlarge',
    canDecrease: fontSize !== 'small',
    isClient,
  };
}
