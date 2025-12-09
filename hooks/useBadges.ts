'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Badge,
  BADGES_LIBRARY,
  checkBadgeUnlock,
  calculateBadgeProgressPercent,
  getBadgeById,
} from '@/lib/badges';

interface UserBadgeData {
  unlockedBadges: string[]; // IDs dos badges desbloqueados
  lastChecked: Date;
  sessionsCompleted: number;
  currentStreak: number;
  exercisesCompleted: number;
  emotionsIdentified: number;
  specialFlags: Record<string, boolean | number>;
}

export interface BadgeWithProgress extends Badge {
  isUnlocked: boolean;
  progressPercent: number;
}

export function useBadges(userId: string) {
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Badge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do usuário
  const loadUserData = useCallback((): UserBadgeData => {
    const key = `claramente_badges_${userId}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      const data = JSON.parse(saved);
      return {
        ...data,
        lastChecked: new Date(data.lastChecked),
      };
    }

    // Dados iniciais
    return {
      unlockedBadges: [],
      lastChecked: new Date(),
      sessionsCompleted: 0,
      currentStreak: 0,
      exercisesCompleted: 0,
      emotionsIdentified: 0,
      specialFlags: {},
    };
  }, [userId]);

  // Salvar dados do usuário
  const saveUserData = useCallback(
    (data: UserBadgeData) => {
      const key = `claramente_badges_${userId}`;
      localStorage.setItem(key, JSON.stringify(data));
    },
    [userId]
  );

  // Atualizar badges com progresso
  const updateBadgesWithProgress = useCallback((userData: UserBadgeData) => {
    const badgesWithProgress: BadgeWithProgress[] = BADGES_LIBRARY.map(badge => {
      const isUnlocked = userData.unlockedBadges.includes(badge.id);
      const progressPercent = isUnlocked
        ? 100
        : calculateBadgeProgressPercent(badge, userData);

      return {
        ...badge,
        isUnlocked,
        progressPercent,
        unlockedAt: isUnlocked ? new Date() : undefined,
      };
    });

    setBadges(badgesWithProgress);
  }, []);

  // Verificar e desbloquear badges
  const checkAndUnlockBadges = useCallback(
    (userData: UserBadgeData): Badge | null => {
      let newBadge: Badge | null = null;

      for (const badge of BADGES_LIBRARY) {
        // Pular se já desbloqueado
        if (userData.unlockedBadges.includes(badge.id)) continue;

        // Verificar se deve desbloquear
        if (checkBadgeUnlock(badge, userData)) {
          userData.unlockedBadges.push(badge.id);
          newBadge = { ...badge, unlockedAt: new Date() };
          
          // Salvar imediatamente
          saveUserData(userData);
          
          // Apenas o primeiro badge desbloqueado por vez
          break;
        }
      }

      return newBadge;
    },
    [saveUserData]
  );

  // Atualizar estatística específica
  const updateStat = useCallback(
    (
      stat: 'sessionsCompleted' | 'currentStreak' | 'exercisesCompleted' | 'emotionsIdentified',
      value: number
    ) => {
      const userData = loadUserData();
      userData[stat] = value;
      userData.lastChecked = new Date();

      // Verificar novos badges
      const newBadge = checkAndUnlockBadges(userData);
      if (newBadge) {
        setNewlyUnlocked(newBadge);
      }

      // Atualizar visualização
      updateBadgesWithProgress(userData);
      saveUserData(userData);
    },
    [loadUserData, saveUserData, checkAndUnlockBadges, updateBadgesWithProgress]
  );

  // Atualizar flag especial
  const updateSpecialFlag = useCallback(
    (flag: string, value: boolean | number) => {
      const userData = loadUserData();
      userData.specialFlags[flag] = value;
      userData.lastChecked = new Date();

      // Verificar novos badges
      const newBadge = checkAndUnlockBadges(userData);
      if (newBadge) {
        setNewlyUnlocked(newBadge);
      }

      // Atualizar visualização
      updateBadgesWithProgress(userData);
      saveUserData(userData);
    },
    [loadUserData, saveUserData, checkAndUnlockBadges, updateBadgesWithProgress]
  );

  // Incrementar estatística
  const incrementStat = useCallback(
    (stat: 'sessionsCompleted' | 'exercisesCompleted' | 'emotionsIdentified') => {
      const userData = loadUserData();
      userData[stat] = (userData[stat] || 0) + 1;
      updateStat(stat, userData[stat]);
    },
    [loadUserData, updateStat]
  );

  // Descartar modal de badge desbloqueado
  const dismissNewBadge = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  // Obter estatísticas atuais
  const getStats = useCallback((): UserBadgeData => {
    return loadUserData();
  }, [loadUserData]);

  // Obter badges por status
  const getUnlockedBadges = useCallback((): BadgeWithProgress[] => {
    return badges.filter(b => b.isUnlocked);
  }, [badges]);

  const getLockedBadges = useCallback((): BadgeWithProgress[] => {
    return badges.filter(b => !b.isUnlocked);
  }, [badges]);

  // Obter próximos badges a desbloquear (com maior progresso)
  const getNextBadges = useCallback((count: number = 3): BadgeWithProgress[] => {
    return badges
      .filter(b => !b.isUnlocked)
      .sort((a, b) => b.progressPercent - a.progressPercent)
      .slice(0, count);
  }, [badges]);

  // Inicializar
  useEffect(() => {
    const userData = loadUserData();
    updateBadgesWithProgress(userData);
    setIsLoading(false);
  }, [loadUserData, updateBadgesWithProgress]);

  return {
    badges,
    isLoading,
    newlyUnlocked,
    dismissNewBadge,
    
    // Métodos de atualização
    updateStat,
    updateSpecialFlag,
    incrementStat,
    
    // Getters
    getStats,
    getUnlockedBadges,
    getLockedBadges,
    getNextBadges,
  };
}
