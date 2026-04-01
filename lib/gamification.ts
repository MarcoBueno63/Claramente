// Sistema de gamificação e apoio para terapia TCC
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'engagement' | 'progress' | 'consistency' | 'breakthrough' | 'social';
  requirements: {
    type: 'sessions' | 'exercises' | 'beliefs' | 'tasks' | 'days_streak' | 'mood_improvement';
    threshold: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number; // 0-100
}

export interface UserLevel {
  level: number;
  title: string;
  pointsRequired: number;
  benefits: string[];
  badgeColor: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'mindfulness' | 'mood' | 'thoughts' | 'social' | 'consistency';
  requirements: {
    action: string;
    target: number;
    timeframe: number; // em dias
  };
  rewards: {
    points: number;
    achievement?: string;
  };
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participants?: number;
  completedBy?: string[];
}

export interface SupportMessage {
  id: string;
  type: 'encouragement' | 'tip' | 'challenge' | 'celebration' | 'reminder';
  message: string;
  trigger: {
    condition: 'low_mood' | 'achievement' | 'streak' | 'struggle' | 'milestone';
    value?: unknown;
  };
  personalizedFor?: string; // userId
  timestamp: Date;
}

interface GamificationStats {
  sessionsCompleted: number;
  exercisesCompleted: number;
  beliefsIdentified: number;
  tasksCompleted: number;
  [key: string]: number;
}

interface GamificationData {
  points: number;
  level: UserLevel;
  achievements: Achievement[];
  activeChallenges: Challenge[];
  streak: number;
  stats: GamificationStats;
}

class GamificationSystem {
  private readonly GAMIFICATION_KEY = 'claramente_gamification';
  private readonly ACHIEVEMENTS_KEY = 'claramente_achievements';
  private readonly CHALLENGES_KEY = 'claramente_challenges';

  // Definir conquistas disponíveis
  private readonly availableAchievements: Achievement[] = [
    {
      id: 'first_session',
      title: 'Primeira Jornada',
      description: 'Complete sua primeira sessão de terapia',
      icon: '🌱',
      category: 'engagement',
      requirements: { type: 'sessions', threshold: 1 },
      points: 50,
      rarity: 'common'
    },
    {
      id: 'week_warrior',
      title: 'Guerreiro da Semana',
      description: 'Complete 7 dias consecutivos de sessões',
      icon: '⚔️',
      category: 'consistency',
      requirements: { type: 'days_streak', threshold: 7 },
      points: 200,
      rarity: 'rare'
    },
    {
      id: 'belief_detective',
      title: 'Detetive de Crenças',
      description: 'Identifique 10 crenças centrais',
      icon: '🔍',
      category: 'progress',
      requirements: { type: 'beliefs', threshold: 10 },
      points: 300,
      rarity: 'epic'
    },
    {
      id: 'mood_master',
      title: 'Mestre do Humor',
      description: 'Registre seu humor por 30 dias',
      icon: '🎭',
      category: 'consistency',
      requirements: { type: 'days_streak', threshold: 30 },
      points: 500,
      rarity: 'epic'
    },
    {
      id: 'exercise_enthusiast',
      title: 'Entusiasta dos Exercícios',
      description: 'Complete 50 exercícios terapêuticos',
      icon: '🏃‍♀️',
      category: 'engagement',
      requirements: { type: 'exercises', threshold: 50 },
      points: 250,
      rarity: 'rare'
    },
    {
      id: 'breakthrough_moment',
      title: 'Momento de Insight',
      description: 'Tenha um insight significativo registrado',
      icon: '💡',
      category: 'breakthrough',
      requirements: { type: 'tasks', threshold: 1 },
      points: 1000,
      rarity: 'legendary'
    },
    {
      id: 'mindful_monk',
      title: 'Monge Mindful',
      description: 'Complete 100 minutos de meditação',
      icon: '🧘‍♂️',
      category: 'progress',
      requirements: { type: 'exercises', threshold: 20 },
      points: 400,
      rarity: 'epic'
    },
    {
      id: 'thought_challenger',
      title: 'Desafiador de Pensamentos',
      description: 'Complete 25 registros de pensamentos',
      icon: '🧠',
      category: 'progress',
      requirements: { type: 'tasks', threshold: 25 },
      points: 350,
      rarity: 'rare'
    }
  ];

  // Definir níveis do usuário
  private readonly userLevels: UserLevel[] = [
    { level: 1, title: 'Iniciante', pointsRequired: 0, benefits: ['Acesso básico'], badgeColor: 'bg-gray-400' },
    { level: 2, title: 'Explorador', pointsRequired: 100, benefits: ['Exercícios avançados'], badgeColor: 'bg-green-400' },
    { level: 3, title: 'Praticante', pointsRequired: 300, benefits: ['Análises detalhadas'], badgeColor: 'bg-blue-400' },
    { level: 4, title: 'Conhecedor', pointsRequired: 600, benefits: ['Insights personalizados'], badgeColor: 'bg-purple-400' },
    { level: 5, title: 'Especialista', pointsRequired: 1000, benefits: ['Conteúdo exclusivo'], badgeColor: 'bg-orange-400' },
    { level: 6, title: 'Mestre', pointsRequired: 1500, benefits: ['Mentoria avançada'], badgeColor: 'bg-red-400' },
    { level: 7, title: 'Sábio', pointsRequired: 2500, benefits: ['Acesso beta'], badgeColor: 'bg-yellow-400' },
    { level: 8, title: 'Iluminado', pointsRequired: 4000, benefits: ['Criação de conteúdo'], badgeColor: 'bg-pink-400' },
    { level: 9, title: 'Transcendente', pointsRequired: 6000, benefits: ['Fórum exclusivo'], badgeColor: 'bg-indigo-400' },
    { level: 10, title: 'Lendário', pointsRequired: 10000, benefits: ['Tudo liberado'], badgeColor: 'bg-gradient-to-r from-yellow-400 to-red-400' }
  ];

  // Desafios semanais
  private generateWeeklyChallenges(): Challenge[] {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return [
      {
        id: `weekly_mindfulness_${today.getTime()}`,
        title: 'Semana Mindful',
        description: 'Complete 3 sessões de meditação esta semana',
        icon: '🧘‍♀️',
        type: 'weekly',
        category: 'mindfulness',
        requirements: {
          action: 'complete_meditation',
          target: 3,
          timeframe: 7
        },
        rewards: {
          points: 150
        },
        startDate: today,
        endDate: nextWeek,
        isActive: true,
        participants: Math.floor(Math.random() * 200) + 50
      },
      {
        id: `weekly_mood_${today.getTime()}`,
        title: 'Rastreador de Humor',
        description: 'Registre seu humor todos os dias da semana',
        icon: '📊',
        type: 'weekly',
        category: 'mood',
        requirements: {
          action: 'log_mood',
          target: 7,
          timeframe: 7
        },
        rewards: {
          points: 200
        },
        startDate: today,
        endDate: nextWeek,
        isActive: true,
        participants: Math.floor(Math.random() * 150) + 30
      },
      {
        id: `weekly_thoughts_${today.getTime()}`,
        title: 'Desafio dos Pensamentos',
        description: 'Questione 5 pensamentos automáticos esta semana',
        icon: '💭',
        type: 'weekly',
        category: 'thoughts',
        requirements: {
          action: 'challenge_thought',
          target: 5,
          timeframe: 7
        },
        rewards: {
          points: 180
        },
        startDate: today,
        endDate: nextWeek,
        isActive: true,
        participants: Math.floor(Math.random() * 100) + 20
      }
    ];
  }

  // Carregar dados de gamificação
  loadUserData(userId: string): {
    points: number;
    level: UserLevel;
    achievements: Achievement[];
    activeChallenges: Challenge[];
    streak: number;
    stats: GamificationStats;
  } {
    try {
      const data = localStorage.getItem(`${this.GAMIFICATION_KEY}_${userId}`);
      const achievements = localStorage.getItem(`${this.ACHIEVEMENTS_KEY}_${userId}`);
      
      if (!data) {
        return this.createInitialUserData(userId);
      }

      const userData = JSON.parse(data) as Partial<GamificationData>;
      const userAchievements = achievements ? (JSON.parse(achievements) as Achievement[]) : [];
      const currentLevel = this.calculateUserLevel(userData.points ?? 0);

      return {
        points: userData.points || 0,
        level: currentLevel,
        achievements: userAchievements,
        activeChallenges: this.generateWeeklyChallenges(),
        streak: userData.streak || 0,
        stats: userData.stats || {
          sessionsCompleted: 0,
          exercisesCompleted: 0,
          beliefsIdentified: 0,
          tasksCompleted: 0,
        }
      };
    } catch (error) {
      console.error('Erro ao carregar dados de gamificação:', error);
      return this.createInitialUserData(userId);
    }
  }

  // Criar dados iniciais
  private createInitialUserData(userId: string): GamificationData {
    const initialData: GamificationData = {
      points: 0,
      level: this.userLevels[0],
      achievements: [],
      activeChallenges: this.generateWeeklyChallenges(),
      streak: 0,
      stats: {
        sessionsCompleted: 0,
        exercisesCompleted: 0,
        beliefsIdentified: 0,
        tasksCompleted: 0
      }
    };

    this.saveUserData(userId, initialData);
    return initialData;
  }

  // Salvar dados do usuário
  saveUserData(userId: string, data: GamificationData): void {
    try {
      const { achievements, ...userData } = data;
      localStorage.setItem(`${this.GAMIFICATION_KEY}_${userId}`, JSON.stringify(userData));
      localStorage.setItem(`${this.ACHIEVEMENTS_KEY}_${userId}`, JSON.stringify(achievements));
    } catch (error) {
      console.error('Erro ao salvar dados de gamificação:', error);
    }
  }

  // Calcular nível do usuário
  calculateUserLevel(points: number): UserLevel {
    for (let i = this.userLevels.length - 1; i >= 0; i--) {
      if (points >= this.userLevels[i].pointsRequired) {
        return this.userLevels[i];
      }
    }
    return this.userLevels[0];
  }

  // Verificar conquistas
  checkAchievements(userId: string, userData: GamificationData): { newAchievements: Achievement[], updatedData: GamificationData } {
    const currentAchievements = userData.achievements || [];
    const newAchievements: Achievement[] = [];

    this.availableAchievements.forEach(achievement => {
      // Verificar se já foi conquistada
      if (currentAchievements.find((a: Achievement) => a.id === achievement.id)) {
        return;
      }

      let isUnlocked = false;

      switch (achievement.requirements.type) {
        case 'sessions':
          isUnlocked = userData.stats.sessionsCompleted >= achievement.requirements.threshold;
          break;
        case 'exercises':
          isUnlocked = userData.stats.exercisesCompleted >= achievement.requirements.threshold;
          break;
        case 'beliefs':
          isUnlocked = userData.stats.beliefsIdentified >= achievement.requirements.threshold;
          break;
        case 'tasks':
          isUnlocked = userData.stats.tasksCompleted >= achievement.requirements.threshold;
          break;
        case 'days_streak':
          isUnlocked = userData.streak >= achievement.requirements.threshold;
          break;
      }

      if (isUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date()
        };
        newAchievements.push(unlockedAchievement);
        currentAchievements.push(unlockedAchievement);
        userData.points += achievement.points;
      }
    });

    userData.achievements = currentAchievements;
    userData.level = this.calculateUserLevel(userData.points);

    return { newAchievements, updatedData: userData };
  }

  // Atualizar estatísticas
  updateStats(userId: string, action: string, value: number = 1): { updatedData: GamificationData, newAchievements: Achievement[] } {
    const userData = this.loadUserData(userId);

    // Atualizar estatísticas
    switch (action) {
      case 'complete_session':
        userData.stats.sessionsCompleted += value;
        break;
      case 'complete_exercise':
        userData.stats.exercisesCompleted += value;
        break;
      case 'identify_belief':
        userData.stats.beliefsIdentified += value;
        break;
      case 'complete_task':
        userData.stats.tasksCompleted += value;
        break;
      case 'daily_streak':
        userData.streak = value;
        break;
    }

    // Verificar conquistas
    const { newAchievements, updatedData } = this.checkAchievements(userId, userData);

    // Salvar dados atualizados
    this.saveUserData(userId, updatedData);

    return { updatedData, newAchievements };
  }

  // Gerar mensagem de apoio
  generateSupportMessage(userData: GamificationData, context: { newAchievement?: boolean; lowMood?: boolean }): SupportMessage | null {
    const messages: Omit<SupportMessage, 'id' | 'timestamp'>[] = [
      {
        type: 'encouragement',
        message: `🌟 Você está no nível ${userData.level.level} (${userData.level.title})! Continue assim!`,
        trigger: { condition: 'milestone' }
      },
      {
        type: 'celebration',
        message: `🎉 Parabéns! Você desbloqueou uma nova conquista!`,
        trigger: { condition: 'achievement' }
      },
      {
        type: 'tip',
        message: `💡 Dica: Tente usar a técnica de respiração quando se sentir ansioso.`,
        trigger: { condition: 'low_mood' }
      },
      {
        type: 'challenge',
        message: `🏆 Que tal tentar completar o desafio semanal? Você está quase lá!`,
        trigger: { condition: 'struggle' }
      },
      {
        type: 'reminder',
        message: `⏰ Lembrete gentil: Que tal registrar seu humor hoje?`,
        trigger: { condition: 'streak' }
      }
    ];

    // Selecionar mensagem baseada no contexto
    let selectedMessage = messages[Math.floor(Math.random() * messages.length)];

    if (context.newAchievement) {
      selectedMessage = messages.find(m => m.trigger.condition === 'achievement') || selectedMessage;
    } else if (context.lowMood) {
      selectedMessage = messages.find(m => m.trigger.condition === 'low_mood') || selectedMessage;
    }

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...selectedMessage
    };
  }

  // Calcular progresso das conquistas
  calculateAchievementProgress(achievement: Achievement, userData: GamificationData): number {
    switch (achievement.requirements.type) {
      case 'sessions':
        return Math.min(100, (userData.stats.sessionsCompleted / achievement.requirements.threshold) * 100);
      case 'exercises':
        return Math.min(100, (userData.stats.exercisesCompleted / achievement.requirements.threshold) * 100);
      case 'beliefs':
        return Math.min(100, (userData.stats.beliefsIdentified / achievement.requirements.threshold) * 100);
      case 'tasks':
        return Math.min(100, (userData.stats.tasksCompleted / achievement.requirements.threshold) * 100);
      case 'days_streak':
        return Math.min(100, (userData.streak / achievement.requirements.threshold) * 100);
      default:
        return 0;
    }
  }

  // Obter ranking semanal (simulado)
  getWeeklyLeaderboard(): Array<{ name: string, points: number, level: string }> {
    return [
      { name: 'Ana M.', points: 1250, level: 'Especialista' },
      { name: 'João S.', points: 980, level: 'Conhecedor' },
      { name: 'Maria L.', points: 850, level: 'Praticante' },
      { name: 'Pedro R.', points: 720, level: 'Praticante' },
      { name: 'Você', points: 0, level: 'Iniciante' } // Será atualizado com dados reais
    ];
  }
}

export const gamificationSystem = new GamificationSystem();