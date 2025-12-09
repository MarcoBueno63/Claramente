'use client';

import { useState, useEffect } from 'react';

// ================================
// TIPOS E INTERFACES
// ================================

export interface PersonalStats {
  totalXP: number;
  currentLevel: number;
  badgesUnlocked: number;
  totalBadges: number;
  challengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  sessionsCompleted: number;
  exercisesCompleted: number;
  emotionsIdentified: number;
  lastActiveDate: string | null;
  accountCreatedDate: string;
}

export interface PlatformAverages {
  avgXP: number;
  avgLevel: number;
  avgBadges: number;
  avgChallenges: number;
  avgStreak: number;
  avgSessions: number;
  avgExercises: number;
  totalUsers: number;
}

export interface PercentileData {
  xpPercentile: number; // 0-100 (higher is better)
  badgesPercentile: number;
  challengesPercentile: number;
  streakPercentile: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: string;
  icon: string;
  category: 'xp' | 'badges' | 'challenges' | 'streaks' | 'sessions' | 'special';
  requirement: string;
}

export interface PrivacySettings {
  showComparison: boolean; // Mostrar comparação com média da plataforma
  showPercentiles: boolean; // Mostrar posição percentil
  shareData: boolean; // Contribuir para estatísticas agregadas
}

export interface TrendData {
  date: string;
  xp: number;
  sessions: number;
  exercises: number;
}

// ================================
// HOOK PRINCIPAL
// ================================

export function useLeaderboard(userId: string) {
  const [personalStats, setPersonalStats] = useState<PersonalStats>({
    totalXP: 0,
    currentLevel: 1,
    badgesUnlocked: 0,
    totalBadges: 35,
    challengesCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessionsCompleted: 0,
    exercisesCompleted: 0,
    emotionsIdentified: 0,
    lastActiveDate: null,
    accountCreatedDate: new Date().toISOString(),
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    showComparison: true,
    showPercentiles: true,
    shareData: true,
  });

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ================================
  // CARREGAR DADOS DO USUÁRIO
  // ================================

  useEffect(() => {
    loadPersonalStats();
    loadPrivacySettings();
    loadTrendData();
    setIsLoading(false);
  }, [userId]);

  const loadPersonalStats = () => {
    try {
      // Carregar XP
      const xpData = localStorage.getItem(`claramente_xp_${userId}`);
      let totalXP = 0;
      let currentLevel = 1;
      if (xpData) {
        const parsed = JSON.parse(xpData);
        totalXP = parsed.totalXP || 0;
        currentLevel = parsed.currentLevel || 1;
      }

      // Carregar Badges
      const badgesData = localStorage.getItem(`claramente_badges_${userId}`);
      let badgesUnlocked = 0;
      let currentStreak = 0;
      let longestStreak = 0;
      let sessionsCompleted = 0;
      let exercisesCompleted = 0;
      let emotionsIdentified = 0;
      if (badgesData) {
        const parsed = JSON.parse(badgesData);
        badgesUnlocked = parsed.unlockedBadges?.length || 0;
        currentStreak = parsed.currentStreak || 0;
        longestStreak = parsed.specialFlags?.longestStreak || 0;
        sessionsCompleted = parsed.sessionsCompleted || 0;
        exercisesCompleted = parsed.exercisesCompleted || 0;
        emotionsIdentified = parsed.emotionsIdentified || 0;
      }

      // Carregar Challenges
      const challengesData = localStorage.getItem(`claramente_challenges_${userId}`);
      let challengesCompleted = 0;
      if (challengesData) {
        const parsed = JSON.parse(challengesData);
        challengesCompleted = parsed.completedChallenges?.length || 0;
      }

      // Carregar streaks (último check-in)
      const streakData = localStorage.getItem(`claramente_streak_${userId}`);
      let lastActiveDate = null;
      if (streakData) {
        const parsed = JSON.parse(streakData);
        lastActiveDate = parsed.lastCheckIn || null;
      }

      // Carregar data de criação da conta (simulado)
      const accountCreatedDate = localStorage.getItem(`claramente_account_created_${userId}`) || new Date().toISOString();
      if (!localStorage.getItem(`claramente_account_created_${userId}`)) {
        localStorage.setItem(`claramente_account_created_${userId}`, accountCreatedDate);
      }

      setPersonalStats({
        totalXP,
        currentLevel,
        badgesUnlocked,
        totalBadges: 35,
        challengesCompleted,
        currentStreak,
        longestStreak,
        sessionsCompleted,
        exercisesCompleted,
        emotionsIdentified,
        lastActiveDate,
        accountCreatedDate,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas pessoais:', error);
    }
  };

  const loadPrivacySettings = () => {
    try {
      const saved = localStorage.getItem(`claramente_privacy_${userId}`);
      if (saved) {
        setPrivacySettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de privacidade:', error);
    }
  };

  const loadTrendData = () => {
    try {
      const saved = localStorage.getItem(`claramente_trends_${userId}`);
      if (saved) {
        const trends = JSON.parse(saved);
        // Pegar apenas os últimos 30 dias
        const last30Days = trends.slice(-30);
        setTrendData(last30Days);
      } else {
        // Inicializar com dados vazios dos últimos 7 dias
        const trends: TrendData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          trends.push({
            date: date.toISOString().split('T')[0],
            xp: 0,
            sessions: 0,
            exercises: 0,
          });
        }
        setTrendData(trends);
        localStorage.setItem(`claramente_trends_${userId}`, JSON.stringify(trends));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de tendência:', error);
    }
  };

  // ================================
  // ATUALIZAR PRIVACIDADE
  // ================================

  const updatePrivacySettings = (newSettings: Partial<PrivacySettings>) => {
    const updated = { ...privacySettings, ...newSettings };
    setPrivacySettings(updated);
    localStorage.setItem(`claramente_privacy_${userId}`, JSON.stringify(updated));
  };

  // ================================
  // ADICIONAR DADOS DE TENDÊNCIA
  // ================================

  const addTrendDataPoint = (xp: number, sessions: number, exercises: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = [...trendData];
    
    // Verificar se já existe entrada para hoje
    const todayIndex = updated.findIndex(t => t.date === today);
    if (todayIndex >= 0) {
      // Atualizar entrada de hoje
      updated[todayIndex].xp += xp;
      updated[todayIndex].sessions += sessions;
      updated[todayIndex].exercises += exercises;
    } else {
      // Adicionar nova entrada
      updated.push({ date: today, xp, sessions, exercises });
    }

    // Manter apenas os últimos 30 dias
    const last30Days = updated.slice(-30);
    setTrendData(last30Days);
    localStorage.setItem(`claramente_trends_${userId}`, JSON.stringify(last30Days));
  };

  // ================================
  // MÉDIAS DA PLATAFORMA (MOCK)
  // ================================

  const getPlatformAverages = (): PlatformAverages => {
    // Dados simulados - em produção, viriam de API
    return {
      avgXP: 2500,
      avgLevel: 8,
      avgBadges: 12,
      avgChallenges: 15,
      avgStreak: 5,
      avgSessions: 20,
      avgExercises: 35,
      totalUsers: 1247, // Simulado
    };
  };

  // ================================
  // CÁLCULO DE PERCENTIS
  // ================================

  const calculatePercentiles = (): PercentileData => {
    // Simulação baseada em distribuição normal
    // Em produção, viria de cálculo real do backend
    
    const calculatePercentile = (value: number, average: number, stdDev: number): number => {
      // Aproximação simples usando z-score
      const zScore = (value - average) / stdDev;
      // Converter z-score para percentil (aproximação)
      let percentile = 50 + (zScore * 20); // Simplificado
      percentile = Math.max(0, Math.min(100, percentile));
      return Math.round(percentile);
    };

    const platformAvg = getPlatformAverages();

    return {
      xpPercentile: calculatePercentile(personalStats.totalXP, platformAvg.avgXP, 1500),
      badgesPercentile: calculatePercentile(personalStats.badgesUnlocked, platformAvg.avgBadges, 8),
      challengesPercentile: calculatePercentile(personalStats.challengesCompleted, platformAvg.avgChallenges, 10),
      streakPercentile: calculatePercentile(personalStats.currentStreak, platformAvg.avgStreak, 4),
    };
  };

  // ================================
  // MARCOS PESSOAIS
  // ================================

  const getPersonalMilestones = (): Milestone[] => {
    const milestones: Milestone[] = [
      {
        id: 'first_session',
        title: 'Primeira Sessão',
        description: 'Completou sua primeira sessão terapêutica',
        achieved: personalStats.sessionsCompleted >= 1,
        icon: '🎯',
        category: 'sessions',
        requirement: '1 sessão',
      },
      {
        id: 'level_10',
        title: 'Nível 10 Alcançado',
        description: 'Atingiu o nível 10 de experiência',
        achieved: personalStats.currentLevel >= 10,
        icon: '⭐',
        category: 'xp',
        requirement: 'Nível 10',
      },
      {
        id: 'level_25',
        title: 'Veterano da Jornada',
        description: 'Atingiu o nível 25 - você está no caminho certo!',
        achieved: personalStats.currentLevel >= 25,
        icon: '🌟',
        category: 'xp',
        requirement: 'Nível 25',
      },
      {
        id: 'streak_7',
        title: 'Semana Consistente',
        description: 'Manteve um streak de 7 dias consecutivos',
        achieved: personalStats.longestStreak >= 7,
        icon: '🔥',
        category: 'streaks',
        requirement: '7 dias seguidos',
      },
      {
        id: 'streak_30',
        title: 'Mês de Dedicação',
        description: 'Manteve um streak de 30 dias - incrível!',
        achieved: personalStats.longestStreak >= 30,
        icon: '🚀',
        category: 'streaks',
        requirement: '30 dias seguidos',
      },
      {
        id: 'badges_10',
        title: 'Colecionador Iniciante',
        description: 'Desbloqueou 10 badges diferentes',
        achieved: personalStats.badgesUnlocked >= 10,
        icon: '🏆',
        category: 'badges',
        requirement: '10 badges',
      },
      {
        id: 'badges_20',
        title: 'Colecionador Experiente',
        description: 'Desbloqueou 20 badges - metade da coleção!',
        achieved: personalStats.badgesUnlocked >= 20,
        icon: '👑',
        category: 'badges',
        requirement: '20 badges',
      },
      {
        id: 'challenges_10',
        title: 'Desafiador Persistente',
        description: 'Completou 10 desafios',
        achieved: personalStats.challengesCompleted >= 10,
        icon: '🎯',
        category: 'challenges',
        requirement: '10 desafios',
      },
      {
        id: 'challenges_50',
        title: 'Mestre dos Desafios',
        description: 'Completou 50 desafios - você é incansável!',
        achieved: personalStats.challengesCompleted >= 50,
        icon: '💪',
        category: 'challenges',
        requirement: '50 desafios',
      },
      {
        id: 'exercises_50',
        title: 'Praticante Dedicado',
        description: 'Completou 50 exercícios terapêuticos',
        achieved: personalStats.exercisesCompleted >= 50,
        icon: '📝',
        category: 'sessions',
        requirement: '50 exercícios',
      },
      {
        id: 'exercises_100',
        title: 'Expert em Prática',
        description: 'Completou 100 exercícios - você domina as técnicas!',
        achieved: personalStats.exercisesCompleted >= 100,
        icon: '🎓',
        category: 'sessions',
        requirement: '100 exercícios',
      },
      {
        id: 'sessions_50',
        title: 'Jornada Sólida',
        description: 'Completou 50 sessões terapêuticas',
        achieved: personalStats.sessionsCompleted >= 50,
        icon: '💎',
        category: 'sessions',
        requirement: '50 sessões',
      },
    ];

    // Adicionar datas de conquista para marcos alcançados (simulado)
    return milestones.map(m => {
      if (m.achieved && !m.achievedDate) {
        return { ...m, achievedDate: new Date().toISOString() };
      }
      return m;
    });
  };

  // ================================
  // PRÓXIMO MARCO
  // ================================

  const getNextMilestone = (): Milestone | null => {
    const milestones = getPersonalMilestones();
    const unachieved = milestones.filter(m => !m.achieved);
    
    if (unachieved.length === 0) return null;

    // Retornar o primeiro não alcançado (assumindo ordem de dificuldade)
    return unachieved[0];
  };

  // ================================
  // ESTATÍSTICAS DE CRESCIMENTO
  // ================================

  const getGrowthStats = () => {
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(personalStats.accountCreatedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const accountAgeWeeks = Math.max(1, Math.floor(accountAge / 7));

    return {
      accountAgeDays: accountAge,
      accountAgeWeeks,
      xpPerWeek: Math.round(personalStats.totalXP / accountAgeWeeks),
      sessionsPerWeek: Math.round(personalStats.sessionsCompleted / accountAgeWeeks),
      exercisesPerWeek: Math.round(personalStats.exercisesCompleted / accountAgeWeeks),
    };
  };

  // ================================
  // RETORNO DO HOOK
  // ================================

  return {
    // Estados
    personalStats,
    privacySettings,
    trendData,
    isLoading,

    // Funções
    updatePrivacySettings,
    addTrendDataPoint,
    loadPersonalStats, // Para refresh manual

    // Dados calculados
    platformAverages: privacySettings.showComparison ? getPlatformAverages() : null,
    percentiles: privacySettings.showPercentiles ? calculatePercentiles() : null,
    milestones: getPersonalMilestones(),
    nextMilestone: getNextMilestone(),
    growthStats: getGrowthStats(),
  };
}
