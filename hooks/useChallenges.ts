'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Challenge,
  generateDailyChallenges,
  generateWeeklyChallenges,
} from '@/lib/challenges';

interface UserChallengeData {
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  lastDailyReset: Date;
  lastWeeklyReset: Date;
  completedChallenges: string[]; // IDs dos desafios completados
}

export function useChallenges(userId: string) {
  const [challenges, setChallenges] = useState<{
    daily: Challenge[];
    weekly: Challenge[];
  }>({
    daily: [],
    weekly: [],
  });
  const [completedChallenge, setCompletedChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do usuário
  const loadUserData = useCallback((): UserChallengeData => {
    const key = `claramente_challenges_${userId}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      const data = JSON.parse(saved);
      return {
        ...data,
        lastDailyReset: new Date(data.lastDailyReset),
        lastWeeklyReset: new Date(data.lastWeeklyReset),
        dailyChallenges: data.dailyChallenges.map((c: any) => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          completedAt: c.completedAt ? new Date(c.completedAt) : undefined,
        })),
        weeklyChallenges: data.weeklyChallenges.map((c: any) => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          completedAt: c.completedAt ? new Date(c.completedAt) : undefined,
        })),
      };
    }

    // Dados iniciais
    const now = new Date();
    return {
      dailyChallenges: generateDailyChallenges(now),
      weeklyChallenges: generateWeeklyChallenges(now),
      lastDailyReset: now,
      lastWeeklyReset: now,
      completedChallenges: [],
    };
  }, [userId]);

  // Salvar dados do usuário
  const saveUserData = useCallback(
    (data: UserChallengeData) => {
      const key = `claramente_challenges_${userId}`;
      localStorage.setItem(key, JSON.stringify(data));
    },
    [userId]
  );

  // Verificar se precisa resetar desafios
  const checkAndResetChallenges = useCallback((userData: UserChallengeData): UserChallengeData => {
    const now = new Date();
    let updated = { ...userData };
    let needsSave = false;

    // Verificar reset diário (novo dia)
    const lastResetDay = userData.lastDailyReset.toDateString();
    const currentDay = now.toDateString();
    if (lastResetDay !== currentDay) {
      updated.dailyChallenges = generateDailyChallenges(now);
      updated.lastDailyReset = now;
      needsSave = true;
    }

    // Verificar reset semanal (nova semana)
    const getWeekNumber = (date: Date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const lastResetWeek = getWeekNumber(userData.lastWeeklyReset);
    const currentWeek = getWeekNumber(now);
    const lastResetYear = userData.lastWeeklyReset.getFullYear();
    const currentYear = now.getFullYear();

    if (lastResetYear !== currentYear || lastResetWeek !== currentWeek) {
      updated.weeklyChallenges = generateWeeklyChallenges(now);
      updated.lastWeeklyReset = now;
      needsSave = true;
    }

    if (needsSave) {
      saveUserData(updated);
    }

    return updated;
  }, [saveUserData]);

  // Atualizar progresso de um desafio
  const updateChallengeProgress = useCallback(
    (challengeId: string, progress: number) => {
      const userData = loadUserData();
      let updated = false;

      // Atualizar desafios diários
      userData.dailyChallenges = userData.dailyChallenges.map(challenge => {
        if (challenge.id === challengeId && !challenge.isCompleted) {
          const newProgress = Math.min(progress, 100);
          const wasCompleted = newProgress >= 100;

          if (wasCompleted && !challenge.isCompleted) {
            updated = true;
            setCompletedChallenge(challenge);
            userData.completedChallenges.push(challengeId);
            return {
              ...challenge,
              progress: 100,
              isCompleted: true,
              completedAt: new Date(),
            };
          }

          return { ...challenge, progress: newProgress };
        }
        return challenge;
      });

      // Atualizar desafios semanais
      userData.weeklyChallenges = userData.weeklyChallenges.map(challenge => {
        if (challenge.id === challengeId && !challenge.isCompleted) {
          const newProgress = Math.min(progress, 100);
          const wasCompleted = newProgress >= 100;

          if (wasCompleted && !challenge.isCompleted) {
            updated = true;
            setCompletedChallenge(challenge);
            userData.completedChallenges.push(challengeId);
            return {
              ...challenge,
              progress: 100,
              isCompleted: true,
              completedAt: new Date(),
            };
          }

          return { ...challenge, progress: newProgress };
        }
        return challenge;
      });

      saveUserData(userData);
      setChallenges({
        daily: userData.dailyChallenges,
        weekly: userData.weeklyChallenges,
      });

      return updated;
    },
    [loadUserData, saveUserData]
  );

  // Incrementar progresso baseado em tipo de ação
  const trackAction = useCallback(
    (actionType: 'session' | 'exercise' | 'checkin' | 'emotion', count: number = 1) => {
      const userData = loadUserData();

      // Mapear ações para tipos de requisitos de desafios
      const allChallenges = [...userData.dailyChallenges, ...userData.weeklyChallenges];

      allChallenges.forEach(challenge => {
        if (challenge.isCompleted) return;

        challenge.requirements.forEach((req, index) => {
          let shouldUpdate = false;
          let newCurrent = (req.current || 0) + count;

          // Verificar se a ação corresponde ao requisito
          if (
            (actionType === 'session' && challenge.category === 'sessions') ||
            (actionType === 'exercise' && challenge.category === 'exercises') ||
            (actionType === 'checkin' && challenge.category === 'sessions') ||
            (actionType === 'emotion' && challenge.category === 'emotions')
          ) {
            shouldUpdate = true;
          }

          if (shouldUpdate) {
            req.current = newCurrent;
            const progress = (newCurrent / req.target) * 100;
            updateChallengeProgress(challenge.id, progress);
          }
        });
      });
    },
    [loadUserData, updateChallengeProgress]
  );

  // Descartar modal de desafio completado
  const dismissCompletedChallenge = useCallback(() => {
    setCompletedChallenge(null);
  }, []);

  // Obter desafios ativos
  const getActiveChallenges = useCallback(() => {
    return {
      daily: challenges.daily.filter(c => c.isActive && !c.isCompleted),
      weekly: challenges.weekly.filter(c => c.isActive && !c.isCompleted),
    };
  }, [challenges]);

  // Obter desafios completados
  const getCompletedChallenges = useCallback(() => {
    return {
      daily: challenges.daily.filter(c => c.isCompleted),
      weekly: challenges.weekly.filter(c => c.isCompleted),
    };
  }, [challenges]);

  // Inicializar e verificar resets
  useEffect(() => {
    let userData = loadUserData();
    userData = checkAndResetChallenges(userData);
    
    setChallenges({
      daily: userData.dailyChallenges,
      weekly: userData.weeklyChallenges,
    });
    
    setIsLoading(false);
  }, [loadUserData, checkAndResetChallenges]);

  return {
    challenges,
    isLoading,
    completedChallenge,
    dismissCompletedChallenge,
    
    // Métodos
    updateChallengeProgress,
    trackAction,
    getActiveChallenges,
    getCompletedChallenges,
  };
}
