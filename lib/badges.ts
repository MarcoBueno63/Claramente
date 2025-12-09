/**
 * Sistema de Badges e Conquistas
 * Biblioteca completa de badges para celebrar marcos terapêuticos
 */

export type BadgeCategory = 'progress' | 'streaks' | 'exercises' | 'emotions' | 'special';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  requirement: {
    type: 'sessions' | 'streak' | 'exercises' | 'emotions' | 'special';
    count?: number;
    specific?: string;
  };
  xpReward: number;
  unlockedAt?: Date;
  progress?: number; // 0-100
}

/**
 * Biblioteca completa de badges (30+)
 */
export const BADGES_LIBRARY: Badge[] = [
  // === PROGRESSO (8 badges) ===
  {
    id: 'first_session',
    name: 'Primeira Jornada',
    description: 'Complete sua primeira sessão de terapia',
    icon: '🌱',
    category: 'progress',
    rarity: 'common',
    requirement: { type: 'sessions', count: 1 },
    xpReward: 100,
  },
  {
    id: 'sessions_10',
    name: 'Explorador Dedicado',
    description: 'Complete 10 sessões de terapia',
    icon: '🎯',
    category: 'progress',
    rarity: 'common',
    requirement: { type: 'sessions', count: 10 },
    xpReward: 200,
  },
  {
    id: 'sessions_50',
    name: 'Praticante Comprometido',
    description: 'Complete 50 sessões de terapia',
    icon: '⭐',
    category: 'progress',
    rarity: 'rare',
    requirement: { type: 'sessions', count: 50 },
    xpReward: 500,
  },
  {
    id: 'sessions_100',
    name: 'Centúria do Autocuidado',
    description: 'Complete 100 sessões de terapia',
    icon: '💯',
    category: 'progress',
    rarity: 'epic',
    requirement: { type: 'sessions', count: 100 },
    xpReward: 1000,
  },
  {
    id: 'sessions_250',
    name: 'Mestre da Transformação',
    description: 'Complete 250 sessões de terapia',
    icon: '🏆',
    category: 'progress',
    rarity: 'legendary',
    requirement: { type: 'sessions', count: 250 },
    xpReward: 2500,
  },
  {
    id: 'deep_session',
    name: 'Mergulho Profundo',
    description: 'Complete uma sessão de 30+ minutos',
    icon: '🌊',
    category: 'progress',
    rarity: 'common',
    requirement: { type: 'special', specific: 'deep_session' },
    xpReward: 150,
  },
  {
    id: 'night_owl',
    name: 'Coruja Noturna',
    description: 'Complete uma sessão depois das 23h',
    icon: '🦉',
    category: 'progress',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'night_session' },
    xpReward: 100,
  },
  {
    id: 'early_bird',
    name: 'Pássaro Madrugador',
    description: 'Complete uma sessão antes das 7h',
    icon: '🐦',
    category: 'progress',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'early_session' },
    xpReward: 100,
  },

  // === STREAKS (7 badges) ===
  {
    id: 'streak_3',
    name: 'Início Consistente',
    description: 'Mantenha uma sequência de 3 dias',
    icon: '🔥',
    category: 'streaks',
    rarity: 'common',
    requirement: { type: 'streak', count: 3 },
    xpReward: 50,
  },
  {
    id: 'streak_7',
    name: 'Guerreiro Semanal',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '⚔️',
    category: 'streaks',
    rarity: 'rare',
    requirement: { type: 'streak', count: 7 },
    xpReward: 200,
  },
  {
    id: 'streak_30',
    name: 'Mestre do Hábito',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '🎖️',
    category: 'streaks',
    rarity: 'epic',
    requirement: { type: 'streak', count: 30 },
    xpReward: 1000,
  },
  {
    id: 'streak_100',
    name: 'Centúria Inabalável',
    description: 'Mantenha uma sequência de 100 dias',
    icon: '💎',
    category: 'streaks',
    rarity: 'legendary',
    requirement: { type: 'streak', count: 100 },
    xpReward: 5000,
  },
  {
    id: 'streak_365',
    name: 'Lenda Viva',
    description: 'Mantenha uma sequência de 1 ano completo',
    icon: '👑',
    category: 'streaks',
    rarity: 'legendary',
    requirement: { type: 'streak', count: 365 },
    xpReward: 10000,
  },
  {
    id: 'weekend_warrior',
    name: 'Guerreiro de Fim de Semana',
    description: 'Complete sessões em 4 fins de semana consecutivos',
    icon: '🎮',
    category: 'streaks',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'weekend_streak' },
    xpReward: 300,
  },
  {
    id: 'comeback_king',
    name: 'Rei do Retorno',
    description: 'Retome sua jornada após uma pausa',
    icon: '🔄',
    category: 'streaks',
    rarity: 'common',
    requirement: { type: 'special', specific: 'comeback' },
    xpReward: 100,
  },

  // === EXERCÍCIOS (8 badges) ===
  {
    id: 'first_exercise',
    name: 'Primeiro Passo Ativo',
    description: 'Complete seu primeiro exercício terapêutico',
    icon: '🎬',
    category: 'exercises',
    rarity: 'common',
    requirement: { type: 'exercises', count: 1 },
    xpReward: 50,
  },
  {
    id: 'exercises_10',
    name: 'Praticante Ativo',
    description: 'Complete 10 exercícios terapêuticos',
    icon: '🏃',
    category: 'exercises',
    rarity: 'common',
    requirement: { type: 'exercises', count: 10 },
    xpReward: 150,
  },
  {
    id: 'exercises_50',
    name: 'Entusiasta dos Exercícios',
    description: 'Complete 50 exercícios terapêuticos',
    icon: '💪',
    category: 'exercises',
    rarity: 'rare',
    requirement: { type: 'exercises', count: 50 },
    xpReward: 500,
  },
  {
    id: 'exercises_100',
    name: 'Mestre da Prática',
    description: 'Complete 100 exercícios terapêuticos',
    icon: '🥇',
    category: 'exercises',
    rarity: 'epic',
    requirement: { type: 'exercises', count: 100 },
    xpReward: 1200,
  },
  {
    id: 'breathing_master',
    name: 'Mestre da Respiração',
    description: 'Complete 20 exercícios de respiração',
    icon: '🫁',
    category: 'exercises',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'breathing_20' },
    xpReward: 300,
  },
  {
    id: 'meditation_monk',
    name: 'Monge da Meditação',
    description: 'Complete 30 meditações guiadas',
    icon: '🧘',
    category: 'exercises',
    rarity: 'epic',
    requirement: { type: 'special', specific: 'meditation_30' },
    xpReward: 800,
  },
  {
    id: 'grounding_guru',
    name: 'Guru do Grounding',
    description: 'Complete 15 exercícios de grounding',
    icon: '🌿',
    category: 'exercises',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'grounding_15' },
    xpReward: 400,
  },
  {
    id: 'versatile_practitioner',
    name: 'Praticante Versátil',
    description: 'Experimente todos os tipos de exercícios',
    icon: '🎨',
    category: 'exercises',
    rarity: 'epic',
    requirement: { type: 'special', specific: 'all_exercise_types' },
    xpReward: 600,
  },

  // === EMOÇÕES (5 badges) ===
  {
    id: 'emotional_awareness',
    name: 'Consciência Emocional',
    description: 'Identifique e nomeie 10 emoções diferentes',
    icon: '🎭',
    category: 'emotions',
    rarity: 'rare',
    requirement: { type: 'emotions', count: 10 },
    xpReward: 250,
  },
  {
    id: 'emotional_vocabulary',
    name: 'Vocabulário Emocional',
    description: 'Use o teclado emocional 20 vezes',
    icon: '💬',
    category: 'emotions',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'emotional_keyboard_20' },
    xpReward: 300,
  },
  {
    id: 'crisis_survivor',
    name: 'Sobrevivente de Crises',
    description: 'Use o modo de crise com sucesso',
    icon: '🆘',
    category: 'emotions',
    rarity: 'epic',
    requirement: { type: 'special', specific: 'crisis_mode_used' },
    xpReward: 500,
  },
  {
    id: 'mood_tracker',
    name: 'Rastreador de Humor',
    description: 'Registre seu humor por 30 dias consecutivos',
    icon: '📊',
    category: 'emotions',
    rarity: 'epic',
    requirement: { type: 'special', specific: 'mood_30_days' },
    xpReward: 750,
  },
  {
    id: 'emotional_mastery',
    name: 'Maestria Emocional',
    description: 'Demonstre regulação emocional consistente',
    icon: '🧠',
    category: 'emotions',
    rarity: 'legendary',
    requirement: { type: 'special', specific: 'emotional_regulation' },
    xpReward: 2000,
  },

  // === ESPECIAIS (7 badges) ===
  {
    id: 'beta_tester',
    name: 'Testador Beta',
    description: 'Seja um dos primeiros usuários do ClaraMente',
    icon: '🚀',
    category: 'special',
    rarity: 'legendary',
    requirement: { type: 'special', specific: 'beta_user' },
    xpReward: 1000,
  },
  {
    id: 'feedback_hero',
    name: 'Herói do Feedback',
    description: 'Forneça feedback valioso 5 vezes',
    icon: '💡',
    category: 'special',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'feedback_5' },
    xpReward: 400,
  },
  {
    id: 'community_helper',
    name: 'Ajudante da Comunidade',
    description: 'Ajude outros usuários na jornada',
    icon: '🤝',
    category: 'special',
    rarity: 'epic',
    requirement: { type: 'special', specific: 'help_others' },
    xpReward: 800,
  },
  {
    id: 'insight_seeker',
    name: 'Buscador de Insights',
    description: 'Visualize insights semanais 10 vezes',
    icon: '🔮',
    category: 'special',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'insights_10' },
    xpReward: 350,
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Complete um desafio semanal com 100%',
    icon: '✨',
    category: 'special',
    rarity: 'epic',
    requirement: { type: 'special', specific: 'perfect_challenge' },
    xpReward: 600,
  },
  {
    id: 'midnight_philosopher',
    name: 'Filósofo da Meia-Noite',
    description: 'Tenha um insight profundo durante a madrugada',
    icon: '🌙',
    category: 'special',
    rarity: 'rare',
    requirement: { type: 'special', specific: 'midnight_insight' },
    xpReward: 300,
  },
  {
    id: 'champion',
    name: 'Campeão do Bem-Estar',
    description: 'Desbloqueie todos os outros badges',
    icon: '🏅',
    category: 'special',
    rarity: 'legendary',
    requirement: { type: 'special', specific: 'all_badges' },
    xpReward: 10000,
  },
];

/**
 * Obtém cor baseada na raridade
 */
export function getBadgeRarityColor(rarity: BadgeRarity): {
  bg: string;
  border: string;
  text: string;
  glow: string;
} {
  const colors = {
    common: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      border: 'border-gray-300 dark:border-gray-600',
      text: 'text-gray-700 dark:text-gray-300',
      glow: 'shadow-gray-400/50',
    },
    rare: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-400 dark:border-blue-600',
      text: 'text-blue-700 dark:text-blue-300',
      glow: 'shadow-blue-400/50',
    },
    epic: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-400 dark:border-purple-600',
      text: 'text-purple-700 dark:text-purple-300',
      glow: 'shadow-purple-400/50',
    },
    legendary: {
      bg: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30',
      border: 'border-yellow-400 dark:border-yellow-600',
      text: 'text-yellow-700 dark:text-yellow-300',
      glow: 'shadow-yellow-400/50',
    },
  };

  return colors[rarity];
}

/**
 * Obtém label de raridade
 */
export function getBadgeRarityLabel(rarity: BadgeRarity): string {
  const labels = {
    common: 'Comum',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Lendário',
  };

  return labels[rarity];
}

/**
 * Obtém badges por categoria
 */
export function getBadgesByCategory(category: BadgeCategory): Badge[] {
  return BADGES_LIBRARY.filter(badge => badge.category === category);
}

/**
 * Obtém badge por ID
 */
export function getBadgeById(id: string): Badge | undefined {
  return BADGES_LIBRARY.find(badge => badge.id === id);
}

/**
 * Filtra badges desbloqueados
 */
export function getUnlockedBadges(badges: Badge[]): Badge[] {
  return badges.filter(badge => badge.unlockedAt !== undefined);
}

/**
 * Filtra badges bloqueados
 */
export function getLockedBadges(badges: Badge[]): Badge[] {
  return badges.filter(badge => badge.unlockedAt === undefined);
}

/**
 * Calcula progresso total de badges
 */
export function calculateBadgeProgress(unlockedBadges: Badge[]): {
  total: number;
  unlocked: number;
  percentage: number;
  byCategory: Record<BadgeCategory, { total: number; unlocked: number }>;
} {
  const total = BADGES_LIBRARY.length;
  const unlocked = unlockedBadges.length;
  const percentage = (unlocked / total) * 100;

  const categories: BadgeCategory[] = ['progress', 'streaks', 'exercises', 'emotions', 'special'];
  const byCategory = {} as Record<BadgeCategory, { total: number; unlocked: number }>;

  categories.forEach(category => {
    const categoryBadges = getBadgesByCategory(category);
    const unlockedInCategory = unlockedBadges.filter(b => b.category === category);
    
    byCategory[category] = {
      total: categoryBadges.length,
      unlocked: unlockedInCategory.length,
    };
  });

  return {
    total,
    unlocked,
    percentage,
    byCategory,
  };
}

/**
 * Verifica se badge deve ser desbloqueado
 */
export function checkBadgeUnlock(
  badge: Badge,
  userStats: {
    sessionsCompleted: number;
    currentStreak: number;
    exercisesCompleted: number;
    emotionsIdentified: number;
    specialFlags: Record<string, boolean | number>;
  }
): boolean {
  const { requirement } = badge;

  switch (requirement.type) {
    case 'sessions':
      return requirement.count ? userStats.sessionsCompleted >= requirement.count : false;
    
    case 'streak':
      return requirement.count ? userStats.currentStreak >= requirement.count : false;
    
    case 'exercises':
      return requirement.count ? userStats.exercisesCompleted >= requirement.count : false;
    
    case 'emotions':
      return requirement.count ? userStats.emotionsIdentified >= requirement.count : false;
    
    case 'special':
      if (!requirement.specific) return false;
      const flag = userStats.specialFlags[requirement.specific];
      return typeof flag === 'boolean' ? flag : (typeof flag === 'number' && flag > 0);
    
    default:
      return false;
  }
}

/**
 * Calcula progresso de badge específico
 */
export function calculateBadgeProgressPercent(
  badge: Badge,
  userStats: {
    sessionsCompleted: number;
    currentStreak: number;
    exercisesCompleted: number;
    emotionsIdentified: number;
    specialFlags: Record<string, boolean | number>;
  }
): number {
  const { requirement } = badge;

  if (!requirement.count) return 0;

  let current = 0;
  switch (requirement.type) {
    case 'sessions':
      current = userStats.sessionsCompleted;
      break;
    case 'streak':
      current = userStats.currentStreak;
      break;
    case 'exercises':
      current = userStats.exercisesCompleted;
      break;
    case 'emotions':
      current = userStats.emotionsIdentified;
      break;
  }

  return Math.min((current / requirement.count) * 100, 100);
}
