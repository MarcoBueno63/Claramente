'use client';

import { useCallback, useEffect } from 'react';

export type HapticPattern = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'notification'
  | 'selection'
  | 'impact'
  | 'breatheIn'
  | 'breatheOut'
  | 'breatheCycle'
  | 'grounding'
  | 'calm'
  | 'focus'
  | 'celebration'
  | 'streak';

interface HapticPatterns {
  [key: string]: number | number[];
}

const HAPTIC_PATTERNS: HapticPatterns = {
  // Toques básicos
  light: 10,
  medium: 20,
  heavy: 50,
  
  // Feedback de ações
  success: [10, 50, 10, 50, 100],
  warning: [30, 30, 30],
  error: [50, 100, 50, 100, 200],
  
  // Interações
  notification: [50, 100, 50],
  selection: 15,
  impact: [20, 100],
  
  // Padrões terapêuticos
  breatheIn: [100, 4000],  // Inspire (4s)
  breatheOut: [100, 6000], // Expire (6s)
  breatheCycle: [100, 4000, 50, 6000], // Ciclo completo
  
  // Grounding exercises
  grounding: [100, 500, 100, 500, 100, 500, 100, 500, 100],
  calm: [30, 1000, 30, 1000, 30],
  focus: [10, 200, 10, 200, 100],
  
  // Celebração
  celebration: [50, 100, 50, 100, 50, 100, 200],
  streak: [30, 50, 30, 50, 30, 50, 100],
};

export function useHaptics() {
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern: HapticPattern | number | number[]): boolean => {
    if (!isSupported) {
      console.log('[Haptics] Vibration API não suportada');
      return false;
    }

    try {
      let vibrationPattern: number | number[];

      if (typeof pattern === 'string') {
        vibrationPattern = HAPTIC_PATTERNS[pattern] || HAPTIC_PATTERNS.light;
      } else {
        vibrationPattern = pattern;
      }

      const success = navigator.vibrate(vibrationPattern);
      return success;
    } catch (error) {
      console.error('[Haptics] Erro ao vibrar:', error);
      return false;
    }
  }, [isSupported]);

  const stop = useCallback((): boolean => {
    if (!isSupported) return false;
    return navigator.vibrate(0);
  }, [isSupported]);

  // Feedback helpers pré-configurados
  const feedback = {
    // Ações básicas
    tap: () => vibrate('light'),
    press: () => vibrate('medium'),
    longPress: () => vibrate('heavy'),
    
    // Resultados de ações
    success: () => vibrate('success'),
    warning: () => vibrate('warning'),
    error: () => vibrate('error'),
    
    // Notificações
    notification: () => vibrate('notification'),
    message: () => vibrate([50, 100, 50]),
    
    // UI feedback
    selection: () => vibrate('selection'),
    toggle: () => vibrate([10, 30]),
    swipe: () => vibrate(5),
    
    // Terapêuticos
    breatheIn: () => vibrate('breatheIn'),
    breatheOut: () => vibrate('breatheOut'),
    breatheCycle: () => vibrate('breatheCycle'),
    grounding: () => vibrate('grounding'),
    calm: () => vibrate('calm'),
    focus: () => vibrate('focus'),
    
    // Gamificação
    celebration: () => vibrate('celebration'),
    streak: () => vibrate('streak'),
    levelUp: () => vibrate([100, 50, 100, 50, 200]),
    achievement: () => vibrate([50, 100, 50, 100, 50, 100]),
  };

  return {
    isSupported,
    vibrate,
    stop,
    ...feedback,
  };
}

// Hook para exercícios de respiração com haptic
export function useBreathingHaptics() {
  const { isSupported, vibrate } = useHaptics();

  const startBreathingCycle = useCallback((
    cycles: number = 5,
    inhaleSeconds: number = 4,
    exhaleSeconds: number = 6
  ) => {
    if (!isSupported) return null;

    let currentCycle = 0;
    
    const runCycle = () => {
      if (currentCycle >= cycles) return;
      
      // Inspire
      vibrate([100, inhaleSeconds * 1000]);
      
      // Expire (após inspiração)
      setTimeout(() => {
        vibrate([100, exhaleSeconds * 1000]);
        currentCycle++;
        
        // Próximo ciclo
        if (currentCycle < cycles) {
          setTimeout(runCycle, exhaleSeconds * 1000 + 500);
        }
      }, inhaleSeconds * 1000 + 200);
    };

    runCycle();

    return () => {
      vibrate(0); // Stop all vibrations
    };
  }, [isSupported, vibrate]);

  return {
    isSupported,
    startBreathingCycle,
  };
}

// Hook para grounding exercise com haptic
export function useGroundingHaptics() {
  const { isSupported, vibrate } = useHaptics();

  const start54321 = useCallback(() => {
    if (!isSupported) return null;

    // 5 coisas que você vê
    setTimeout(() => vibrate([100, 500]), 0);
    setTimeout(() => vibrate([100, 500]), 1000);
    setTimeout(() => vibrate([100, 500]), 2000);
    setTimeout(() => vibrate([100, 500]), 3000);
    setTimeout(() => vibrate([100, 500]), 4000);

    // 4 coisas que você toca
    setTimeout(() => vibrate([100, 500]), 6000);
    setTimeout(() => vibrate([100, 500]), 7000);
    setTimeout(() => vibrate([100, 500]), 8000);
    setTimeout(() => vibrate([100, 500]), 9000);

    // 3 coisas que você ouve
    setTimeout(() => vibrate([100, 500]), 11000);
    setTimeout(() => vibrate([100, 500]), 12000);
    setTimeout(() => vibrate([100, 500]), 13000);

    // 2 coisas que você cheira
    setTimeout(() => vibrate([100, 500]), 15000);
    setTimeout(() => vibrate([100, 500]), 16000);

    // 1 coisa que você gosta de você
    setTimeout(() => vibrate([200, 1000]), 18000);

    return () => vibrate(0);
  }, [isSupported, vibrate]);

  return {
    isSupported,
    start54321,
  };
}
