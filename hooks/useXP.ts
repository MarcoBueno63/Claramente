'use client';

import { useState, useEffect, useCallback } from 'react';
import { gamificationSystem } from '../lib/gamification';

export interface XPState {
  totalXP: number;
  level: number;
  levelTitle: string;
  currentLevelXP: number;
  xpToNextLevel: number;
  xpProgress: number;
  recentGains: XPGainLog[];
}

export interface XPGainLog {
  id: string;
  action: string;
  xp: number;
  timestamp: Date;
  multiplier?: number;
}

/**
 * Hook para gerenciar sistema de XP e níveis
 * Integra com gamificationSystem existente
 */
export function useXP(userId: string) {
  const [xpState, setXPState] = useState<XPState>({
    totalXP: 0,
    level: 1,
    levelTitle: 'Iniciante',
    currentLevelXP: 0,
    xpToNextLevel: 100,
    xpProgress: 0,
    recentGains: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  // Carregar dados do usuário
  useEffect(() => {
    if (!userId) return;
    
    try {
      const userData = gamificationSystem.loadUserData(userId);
      updateXPState(userData.points, false);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar XP:', error);
      setIsLoading(false);
    }
  }, [userId]);

  // Atualizar estado de XP
  const updateXPState = useCallback((totalXP: number, checkLevelUp: boolean = true) => {
    const level = gamificationSystem.calculateUserLevel(totalXP);
    const prevLevel = xpState.level;
    
    // Calcular XP atual no nível
    const currentLevelXP = totalXP - level.pointsRequired;
    const nextLevelIndex = gamificationSystem['userLevels'].findIndex(l => l.level === level.level + 1);
    const xpToNextLevel = nextLevelIndex >= 0 
      ? gamificationSystem['userLevels'][nextLevelIndex].pointsRequired - level.pointsRequired
      : 1000;
    
    const xpProgress = (currentLevelXP / xpToNextLevel) * 100;

    setXPState(prev => ({
      ...prev,
      totalXP,
      level: level.level,
      levelTitle: level.title,
      currentLevelXP,
      xpToNextLevel,
      xpProgress: Math.min(xpProgress, 100),
    }));

    // Verificar se subiu de nível
    if (checkLevelUp && level.level > prevLevel) {
      setNewLevel(level.level);
      setShowLevelUp(true);
    }
  }, [xpState.level]);

  // Adicionar XP
  const addXP = useCallback((action: string, baseXP: number, multiplier: number = 1.0) => {
    if (!userId) return;

    const xpGained = Math.floor(baseXP * multiplier);
    const newTotalXP = xpState.totalXP + xpGained;

    // Registrar ganho
    const gain: XPGainLog = {
      id: Date.now().toString(),
      action,
      xp: xpGained,
      timestamp: new Date(),
      multiplier: multiplier !== 1.0 ? multiplier : undefined,
    };

    setXPState(prev => ({
      ...prev,
      recentGains: [gain, ...prev.recentGains.slice(0, 9)], // Manter últimos 10
    }));

    // Atualizar total
    updateXPState(newTotalXP);

    // Salvar no sistema de gamificação
    try {
      const userData = gamificationSystem.loadUserData(userId);
      userData.points = newTotalXP;
      gamificationSystem.saveUserData(userId, userData);
    } catch (error) {
      console.error('Erro ao salvar XP:', error);
    }

    return xpGained;
  }, [userId, xpState.totalXP, updateXPState]);

  // Ações específicas de XP
  const actions = {
    // Check-ins
    dailyCheckin: () => addXP('Check-in Diário', 10),
    firstCheckinDay: () => addXP('Primeiro Check-in', 5),

    // Sessões
    sessionComplete: (duration: number) => {
      if (duration >= 30) return addXP('Sessão Intensa', 100);
      if (duration >= 20) return addXP('Sessão Aprofundada', 75);
      return addXP('Sessão Completa', 50);
    },

    // Exercícios
    exerciseBreathing: () => addXP('Respiração', 15),
    exerciseGrounding: () => addXP('Grounding', 20),
    exerciseMeditation: () => addXP('Meditação', 30),
    exerciseTCC: () => addXP('TCC', 40),
    exerciseAudio: () => addXP('Áudio', 25),

    // Streaks
    streak3Days: () => addXP('Streak 3 Dias', 30),
    streak7Days: () => addXP('Streak 1 Semana', 100),
    streak14Days: () => addXP('Streak 2 Semanas', 250),
    streak30Days: () => addXP('Streak 1 Mês', 500),
    streak100Days: () => addXP('Streak 100 Dias', 2000),

    // Especiais
    firstSession: () => addXP('Primeira Sessão', 100),
    emotionalAwareness: () => addXP('Consciência Emocional', 20),
    crisisOvercome: () => addXP('Crise Superada', 50),
    insightsView: () => addXP('Autoconhecimento', 30),
  };

  // Fechar modal de level up
  const closeLevelUp = useCallback(() => {
    setShowLevelUp(false);
    setNewLevel(null);
  }, []);

  // Calcular multiplicador baseado em contexto
  const getMultiplier = useCallback((context: {
    isWeekend?: boolean;
    currentStreak?: number;
    hasActiveChallenges?: boolean;
  }) => {
    let multiplier = 1.0;
    
    if (context.isWeekend) multiplier += 0.5;
    if (context.currentStreak && context.currentStreak >= 7) multiplier += 0.25;
    if (context.currentStreak && context.currentStreak >= 30) multiplier += 0.5;
    if (context.hasActiveChallenges) multiplier += 0.2;
    
    return multiplier;
  }, []);

  return {
    xpState,
    isLoading,
    addXP,
    actions,
    showLevelUp,
    newLevel,
    closeLevelUp,
    getMultiplier,
  };
}
