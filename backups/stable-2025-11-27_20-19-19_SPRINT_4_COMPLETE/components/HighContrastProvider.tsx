'use client';

import { useEffect } from 'react';
import { useHighContrast } from '../hooks/useHighContrast';

/**
 * Componente que aplica o modo de alto contraste ao documento
 * Deve ser renderizado no layout para gerenciar o tema global
 */
export default function HighContrastProvider() {
  const { contrastMode, isClient } = useHighContrast();

  useEffect(() => {
    if (!isClient) return;

    // A lógica de aplicação já está no hook useHighContrast
    // Este componente apenas força a execução do hook no layout
  }, [contrastMode, isClient]);

  return null; // Este componente não renderiza nada
}
