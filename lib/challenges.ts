/**
 * Sistema de Desafios Semanais e Diários
 * Desafios rotativos para engajamento e motivação
 */

export type ChallengeType = 'daily' | 'weekly' | 'special';
export type ChallengeCategory = 'sessions' | 'exercises' | 'streaks' | 'emotions' | 'mixed';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface ChallengeReward {
  xp: number;
  badgeId?: string;
  specialReward?: string;
}

export interface ChallengeRequirement {
  type: 'count' | 'streak' | 'variety' | 'completion' | 'specific';
  target: number;
  description: string;
  current?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isCompleted?: boolean;
  progress?: number; // 0-100
  completedAt?: Date;
}

/**
 * Biblioteca de desafios diários (rotação diária)
 */
export const DAILY_CHALLENGES_POOL: Omit<Challenge, 'id' | 'startDate' | 'endDate' | 'isActive'>[] = [
  // === FÁCIL (20 desafios) ===
  {
    title: 'Primeiro Passo do Dia',
    description: 'Complete seu check-in diário hoje',
    icon: '🌅',
    type: 'daily',
    category: 'sessions',
    difficulty: 'easy',
    requirements: [
      { type: 'count', target: 1, description: 'Check-in diário' }
    ],
    rewards: { xp: 50 },
  },
  {
    title: 'Respire Fundo',
    description: 'Complete 1 exercício de respiração',
    icon: '🫁',
    type: 'daily',
    category: 'exercises',
    difficulty: 'easy',
    requirements: [
      { type: 'specific', target: 1, description: 'Exercício de respiração' }
    ],
    rewards: { xp: 75 },
  },
  {
    title: 'Momento de Calma',
    description: 'Complete 1 meditação guiada',
    icon: '🧘',
    type: 'daily',
    category: 'exercises',
    difficulty: 'easy',
    requirements: [
      { type: 'specific', target: 1, description: 'Meditação guiada' }
    ],
    rewards: { xp: 75 },
  },
  {
    title: 'Conexão com o Presente',
    description: 'Complete 1 exercício de grounding',
    icon: '🌿',
    type: 'daily',
    category: 'exercises',
    difficulty: 'easy',
    requirements: [
      { type: 'specific', target: 1, description: 'Exercício de grounding' }
    ],
    rewards: { xp: 75 },
  },
  {
    title: 'Explorador Emocional',
    description: 'Identifique 3 emoções diferentes hoje',
    icon: '🎭',
    type: 'daily',
    category: 'emotions',
    difficulty: 'easy',
    requirements: [
      { type: 'variety', target: 3, description: 'Emoções identificadas' }
    ],
    rewards: { xp: 100 },
  },

  // === MÉDIO (15 desafios) ===
  {
    title: 'Dedicação Dupla',
    description: 'Complete 2 sessões de terapia hoje',
    icon: '💪',
    type: 'daily',
    category: 'sessions',
    difficulty: 'medium',
    requirements: [
      { type: 'count', target: 2, description: 'Sessões completas' }
    ],
    rewards: { xp: 150 },
  },
  {
    title: 'Trio de Práticas',
    description: 'Complete 3 exercícios diferentes',
    icon: '🎯',
    type: 'daily',
    category: 'exercises',
    difficulty: 'medium',
    requirements: [
      { type: 'variety', target: 3, description: 'Tipos de exercícios' }
    ],
    rewards: { xp: 200 },
  },
  {
    title: 'Maratona de Bem-Estar',
    description: 'Complete 5 exercícios terapêuticos',
    icon: '🏃',
    type: 'daily',
    category: 'exercises',
    difficulty: 'medium',
    requirements: [
      { type: 'count', target: 5, description: 'Exercícios completos' }
    ],
    rewards: { xp: 250 },
  },
  {
    title: 'Consciência Emocional',
    description: 'Use o teclado emocional 5 vezes',
    icon: '💬',
    type: 'daily',
    category: 'emotions',
    difficulty: 'medium',
    requirements: [
      { type: 'count', target: 5, description: 'Usos do teclado emocional' }
    ],
    rewards: { xp: 150 },
  },
  {
    title: 'Sessão Profunda',
    description: 'Complete uma sessão de 30+ minutos',
    icon: '🌊',
    type: 'daily',
    category: 'sessions',
    difficulty: 'medium',
    requirements: [
      { type: 'specific', target: 1, description: 'Sessão longa (30+ min)' }
    ],
    rewards: { xp: 200 },
  },

  // === DIFÍCIL (10 desafios) ===
  {
    title: 'Mestre do Autocuidado',
    description: 'Complete check-in, 2 sessões e 3 exercícios',
    icon: '👑',
    type: 'daily',
    category: 'mixed',
    difficulty: 'hard',
    requirements: [
      { type: 'count', target: 1, description: 'Check-in diário' },
      { type: 'count', target: 2, description: 'Sessões de terapia' },
      { type: 'count', target: 3, description: 'Exercícios' },
    ],
    rewards: { xp: 400 },
  },
  {
    title: 'Explorador Completo',
    description: 'Experimente todos os tipos de exercícios hoje',
    icon: '🎨',
    type: 'daily',
    category: 'exercises',
    difficulty: 'hard',
    requirements: [
      { type: 'variety', target: 5, description: 'Tipos de exercícios diferentes' }
    ],
    rewards: { xp: 350 },
  },
  {
    title: 'Guardião das Emoções',
    description: 'Identifique e nomeie 10 emoções diferentes',
    icon: '🛡️',
    type: 'daily',
    category: 'emotions',
    difficulty: 'hard',
    requirements: [
      { type: 'variety', target: 10, description: 'Emoções únicas' }
    ],
    rewards: { xp: 300 },
  },
];

/**
 * Biblioteca de desafios semanais (rotação semanal)
 */
export const WEEKLY_CHALLENGES_POOL: Omit<Challenge, 'id' | 'startDate' | 'endDate' | 'isActive'>[] = [
  // === FÁCIL (10 desafios) ===
  {
    title: 'Guerreiro de 3 Dias',
    description: 'Mantenha um check-in por 3 dias seguidos',
    icon: '🔥',
    type: 'weekly',
    category: 'streaks',
    difficulty: 'easy',
    requirements: [
      { type: 'streak', target: 3, description: 'Dias consecutivos' }
    ],
    rewards: { xp: 200 },
  },
  {
    title: 'Colecionador de Sessões',
    description: 'Complete 5 sessões de terapia esta semana',
    icon: '📚',
    type: 'weekly',
    category: 'sessions',
    difficulty: 'easy',
    requirements: [
      { type: 'count', target: 5, description: 'Sessões completas' }
    ],
    rewards: { xp: 300 },
  },
  {
    title: 'Praticante Ativo',
    description: 'Complete 10 exercícios esta semana',
    icon: '🏃',
    type: 'weekly',
    category: 'exercises',
    difficulty: 'easy',
    requirements: [
      { type: 'count', target: 10, description: 'Exercícios completos' }
    ],
    rewards: { xp: 250 },
  },

  // === MÉDIO (8 desafios) ===
  {
    title: 'Guerreiro Semanal',
    description: 'Mantenha check-in por 7 dias consecutivos',
    icon: '⚔️',
    type: 'weekly',
    category: 'streaks',
    difficulty: 'medium',
    requirements: [
      { type: 'streak', target: 7, description: 'Semana completa' }
    ],
    rewards: { xp: 500, badgeId: 'streak_7' },
  },
  {
    title: 'Maratonista Terapêutico',
    description: 'Complete 10 sessões de terapia',
    icon: '🏅',
    type: 'weekly',
    category: 'sessions',
    difficulty: 'medium',
    requirements: [
      { type: 'count', target: 10, description: 'Sessões esta semana' }
    ],
    rewards: { xp: 600 },
  },
  {
    title: 'Entusiasta dos Exercícios',
    description: 'Complete 20 exercícios terapêuticos',
    icon: '💪',
    type: 'weekly',
    category: 'exercises',
    difficulty: 'medium',
    requirements: [
      { type: 'count', target: 20, description: 'Exercícios esta semana' }
    ],
    rewards: { xp: 500 },
  },
  {
    title: 'Explorador Versátil',
    description: 'Experimente todos os tipos de exercícios',
    icon: '🎨',
    type: 'weekly',
    category: 'exercises',
    difficulty: 'medium',
    requirements: [
      { type: 'variety', target: 5, description: 'Tipos diferentes' }
    ],
    rewards: { xp: 400 },
  },
  {
    title: 'Mestre do Fim de Semana',
    description: 'Complete sessões no sábado E domingo',
    icon: '🎮',
    type: 'weekly',
    category: 'sessions',
    difficulty: 'medium',
    requirements: [
      { type: 'specific', target: 2, description: 'Sessões de fim de semana' }
    ],
    rewards: { xp: 350 },
  },

  // === DIFÍCIL (6 desafios) ===
  {
    title: 'Perfeição Semanal',
    description: 'Complete check-in + 1 sessão + 2 exercícios por 7 dias',
    icon: '✨',
    type: 'weekly',
    category: 'mixed',
    difficulty: 'hard',
    requirements: [
      { type: 'streak', target: 7, description: 'Dias com rotina completa' }
    ],
    rewards: { xp: 1000, badgeId: 'perfectionist' },
  },
  {
    title: 'Campeão dos Exercícios',
    description: 'Complete 50 exercícios terapêuticos',
    icon: '🏆',
    type: 'weekly',
    category: 'exercises',
    difficulty: 'hard',
    requirements: [
      { type: 'count', target: 50, description: 'Exercícios esta semana' }
    ],
    rewards: { xp: 1200 },
  },
  {
    title: 'Atleta Emocional',
    description: 'Identifique 50 emoções únicas esta semana',
    icon: '🎭',
    type: 'weekly',
    category: 'emotions',
    difficulty: 'hard',
    requirements: [
      { type: 'count', target: 50, description: 'Emoções identificadas' }
    ],
    rewards: { xp: 800 },
  },
  {
    title: 'Senhor do Tempo',
    description: 'Complete sessões em todos os períodos (manhã, tarde, noite)',
    icon: '⏰',
    type: 'weekly',
    category: 'sessions',
    difficulty: 'hard',
    requirements: [
      { type: 'variety', target: 3, description: 'Períodos diferentes' }
    ],
    rewards: { xp: 700 },
  },

  // === EXPERT (4 desafios) ===
  {
    title: 'Lenda Viva',
    description: 'Complete 20 sessões + 50 exercícios + streak de 7 dias',
    icon: '👑',
    type: 'weekly',
    category: 'mixed',
    difficulty: 'expert',
    requirements: [
      { type: 'count', target: 20, description: 'Sessões' },
      { type: 'count', target: 50, description: 'Exercícios' },
      { type: 'streak', target: 7, description: 'Dias consecutivos' },
    ],
    rewards: { xp: 2000, specialReward: 'Avatar especial por 7 dias' },
  },
  {
    title: 'Iluminado',
    description: 'Complete 100 exercícios de meditação',
    icon: '🌟',
    type: 'weekly',
    category: 'exercises',
    difficulty: 'expert',
    requirements: [
      { type: 'specific', target: 100, description: 'Meditações' }
    ],
    rewards: { xp: 1500 },
  },
];

/**
 * Desafios especiais (eventos limitados)
 */
export const SPECIAL_CHALLENGES: Omit<Challenge, 'id' | 'isActive'>[] = [
  {
    title: 'Bem-Vindo ao ClaraMente',
    description: 'Complete sua primeira semana no app',
    icon: '🚀',
    type: 'special',
    category: 'mixed',
    difficulty: 'easy',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    requirements: [
      { type: 'streak', target: 7, description: 'Dias consecutivos' }
    ],
    rewards: { xp: 500, badgeId: 'beta_tester' },
  },
  {
    title: 'Maratona de Autocuidado',
    description: 'Evento especial: Complete 30 exercícios em 3 dias',
    icon: '🎊',
    type: 'special',
    category: 'exercises',
    difficulty: 'hard',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    requirements: [
      { type: 'count', target: 30, description: 'Exercícios em 3 dias' }
    ],
    rewards: { xp: 1000, specialReward: 'Badge exclusivo de evento' },
  },
];

/**
 * Obtém cor baseada na dificuldade
 */
export function getChallengeDifficultyColor(difficulty: ChallengeDifficulty): {
  bg: string;
  border: string;
  text: string;
  badge: string;
} {
  const colors = {
    easy: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-400 dark:border-green-600',
      text: 'text-green-700 dark:text-green-300',
      badge: 'bg-green-500',
    },
    medium: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-400 dark:border-blue-600',
      text: 'text-blue-700 dark:text-blue-300',
      badge: 'bg-blue-500',
    },
    hard: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-400 dark:border-purple-600',
      text: 'text-purple-700 dark:text-purple-300',
      badge: 'bg-purple-500',
    },
    expert: {
      bg: 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
      border: 'border-orange-400 dark:border-orange-600',
      text: 'text-orange-700 dark:text-orange-300',
      badge: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
  };

  return colors[difficulty];
}

/**
 * Obtém label de dificuldade
 */
export function getChallengeDifficultyLabel(difficulty: ChallengeDifficulty): string {
  const labels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
    expert: 'Expert',
  };

  return labels[difficulty];
}

/**
 * Gera desafios diários aleatórios (1 fácil, 1 médio, 1 difícil)
 */
export function generateDailyChallenges(date: Date = new Date()): Challenge[] {
  const challenges: Challenge[] = [];
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // 1 fácil
  const easyChallenges = DAILY_CHALLENGES_POOL.filter(c => c.difficulty === 'easy');
  const easyChallenge = easyChallenges[Math.floor(Math.random() * easyChallenges.length)];
  challenges.push({
    ...easyChallenge,
    id: `daily_easy_${date.toISOString().split('T')[0]}`,
    startDate: startOfDay,
    endDate: endOfDay,
    isActive: true,
    progress: 0,
  });

  // 1 médio
  const mediumChallenges = DAILY_CHALLENGES_POOL.filter(c => c.difficulty === 'medium');
  const mediumChallenge = mediumChallenges[Math.floor(Math.random() * mediumChallenges.length)];
  challenges.push({
    ...mediumChallenge,
    id: `daily_medium_${date.toISOString().split('T')[0]}`,
    startDate: startOfDay,
    endDate: endOfDay,
    isActive: true,
    progress: 0,
  });

  // 1 difícil
  const hardChallenges = DAILY_CHALLENGES_POOL.filter(c => c.difficulty === 'hard');
  const hardChallenge = hardChallenges[Math.floor(Math.random() * hardChallenges.length)];
  challenges.push({
    ...hardChallenge,
    id: `daily_hard_${date.toISOString().split('T')[0]}`,
    startDate: startOfDay,
    endDate: endOfDay,
    isActive: true,
    progress: 0,
  });

  return challenges;
}

/**
 * Gera desafios semanais aleatórios (1 fácil, 1 médio, 1 difícil/expert)
 */
export function generateWeeklyChallenges(date: Date = new Date()): Challenge[] {
  const challenges: Challenge[] = [];
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // 1 fácil
  const easyChallenges = WEEKLY_CHALLENGES_POOL.filter(c => c.difficulty === 'easy');
  const easyChallenge = easyChallenges[Math.floor(Math.random() * easyChallenges.length)];
  challenges.push({
    ...easyChallenge,
    id: `weekly_easy_${startOfWeek.toISOString().split('T')[0]}`,
    startDate: startOfWeek,
    endDate: endOfWeek,
    isActive: true,
    progress: 0,
  });

  // 1 médio
  const mediumChallenges = WEEKLY_CHALLENGES_POOL.filter(c => c.difficulty === 'medium');
  const mediumChallenge = mediumChallenges[Math.floor(Math.random() * mediumChallenges.length)];
  challenges.push({
    ...mediumChallenge,
    id: `weekly_medium_${startOfWeek.toISOString().split('T')[0]}`,
    startDate: startOfWeek,
    endDate: endOfWeek,
    isActive: true,
    progress: 0,
  });

  // 1 difícil ou expert
  const hardChallenges = WEEKLY_CHALLENGES_POOL.filter(c => c.difficulty === 'hard' || c.difficulty === 'expert');
  const hardChallenge = hardChallenges[Math.floor(Math.random() * hardChallenges.length)];
  challenges.push({
    ...hardChallenge,
    id: `weekly_hard_${startOfWeek.toISOString().split('T')[0]}`,
    startDate: startOfWeek,
    endDate: endOfWeek,
    isActive: true,
    progress: 0,
  });

  return challenges;
}

/**
 * Calcula tempo restante formatado
 */
export function getTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 'Expirado';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
