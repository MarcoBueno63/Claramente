'use client';

import { useEffect } from 'react';
import { useFontSize } from '../hooks/useFontSize';

/**
 * Componente que aplica a classe de tamanho de fonte ao body
 * Deve ser renderizado no layout para gerenciar a escala global
 */
export default function FontSizeProvider() {
  const { fontSize, isClient } = useFontSize();

  useEffect(() => {
    if (!isClient) return;

    // Remove todas as classes de tamanho de fonte
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    
    // Adiciona a classe atual
    document.body.classList.add(`font-${fontSize}`);
  }, [fontSize, isClient]);

  return null; // Este componente não renderiza nada
}
