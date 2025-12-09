// Sistema de Autenticação Simplificado - ClaraMente  
// Versão mock otimizada sem NextAuth para performance

import { userService, ClaraMenteUser } from './user-service';

// Re-export para compatibilidade
export type { ClaraMenteUser } from './user-service';

// 🚀 MOCK: Sistema de auth simplificado para otimização
// Em produção, integrar com sistema de auth escolhido (Clerk, Auth0, etc.)

// Lista de usuários para desenvolvimento (remover em produção)
const DEVELOPMENT_USERS = [
  {
    id: '1',
    email: 'teste@claramente.ai',
    password: '123456',
    name: 'Usuário Teste',
  },
  {
    id: '2',
    email: 'demo@claramente.ai',
    password: 'demo123',
    name: 'Demo User',
  },
  {
    id: '3',
    email: 'clinico@claramente.ai',
    password: 'clinico123',
    name: 'Dr. Clinical',
  }
];

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'clinician' | 'admin';
}

export interface Session {
  user: AuthUser;
  expires: string;
}

// Classe principal do serviço de autenticação
export class AuthService {
  private currentUser: ClaraMenteUser | null = null;
  private sessions: Map<string, any> = new Map();

  // 🔐 LOGIN MOCK
  async signIn(credentials: { email: string; password: string }): Promise<AuthUser | null> {
    const user = DEVELOPMENT_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user'
    };
  }

  // 👤 CRIAR OU ATUALIZAR USUÁRIO
  async createOrUpdateUser(session: any): Promise<ClaraMenteUser | null> {
    if (!session?.user) return null;

    try {
      // Verificar se usuário já existe
      let user = this.getUserById(session.user.id);
      
      if (!user) {
        // Criar novo usuário no sistema
        user = {
          id: session.user.id,
          locale: 'pt-BR',
          name: session.user.name || 'Usuário',
          email: session.user.email || '',
          createdAt: new Date(),
          lastLogin: new Date(),
          freeSessionsUsed: 0,
          totalSessions: 0,
          completedAssessments: 0,
          preferredPersona: 'empática',
          preferredStyle: 'conversacional',
          notificationsEnabled: true,
          currentStreak: 0,
          longestStreak: 0,
          achievementsUnlocked: [],
          dataRetentionDays: 365,
          shareProgressWithTherapist: false
        };

        // Salvar no userService
        userService.saveUser(user);
      } else {
        // Atualizar último login
        user.lastLogin = new Date();
        userService.saveUser(user);
      }

      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Erro ao criar/atualizar usuário:', error);
      return null;
    }
  }

  // 📊 GERENCIAMENTO DE SESSÕES
  startTherapySession(userId: string): any {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      userId,
      startTime: new Date(),
      endTime: null,
      duration: null,
      messages: [],
      moodBefore: null,
      moodAfter: null,
      techniques: [],
      insights: [],
      completed: false
    };

    this.sessions.set(sessionId, session);
    
    // Incrementar contador de sessões do usuário
    const user = this.getUserById(userId);
    if (user) {
      user.totalSessions += 1;
      userService.saveUser(user);
    }

    return session;
  }

  endTherapySession(sessionId: string, moodAfter?: number): any {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.duration = Math.round(
      (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60
    );
    session.moodAfter = moodAfter;
    session.completed = true;

    this.sessions.set(sessionId, session);
    return session;
  }

  // 📈 PROGRESSO E MÉTRICAS
  calculateProgress(userId: string, period: string = '30d'): any {
    const user = this.getUserById(userId);
    if (!user) return null;

    const userSessions = Array.from(this.sessions.values())
      .filter(s => s.userId === userId && s.completed);

    return {
      userId,
      period,
      totalSessions: userSessions.length,
      averageSessionDuration: userSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / userSessions.length || 0,
      moodImprovement: this.calculateMoodImprovement(userSessions),
      preferredSessionTimes: [],
      mostDiscussedTopics: [],
      mostEffectiveTechniques: [],
      dominantEmotions: [],
      riskLevelTrend: [],
      milestonesAchieved: user.achievementsUnlocked
    };
  }

  private calculateMoodImprovement(sessions: any[]): number {
    const validSessions = sessions.filter(s => s.moodBefore && s.moodAfter);
    if (validSessions.length === 0) return 0;

    const totalImprovement = validSessions.reduce(
      (sum, s) => sum + (s.moodAfter - s.moodBefore), 0
    );
    
    return Math.round((totalImprovement / validSessions.length) * 10) / 10;
  }

  // 🎯 UTILIDADES
  canStartNewSession(user: ClaraMenteUser): boolean {
    return user.freeSessionsUsed < 5; // Limite de 5 sessões grátis
  }

  useFreeSession(user: ClaraMenteUser): ClaraMenteUser {
    user.freeSessionsUsed += 1;
    userService.saveUser(user);
    return user;
  }

  getUserById(userId: string): ClaraMenteUser | null {
    const user = getUser();
    return user?.id === userId ? user : null;
  }

  getUserSessions(userId: string, limit: number = 10): any[] {
    return Array.from(this.sessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  getSessionById(sessionId: string): any {
    return this.sessions.get(sessionId);
  }
}

// Instância singleton do serviço
export const authService = new AuthService();

// 🔄 FUNÇÕES DE COMPATIBILIDADE PARA COMPONENTES EXISTENTES
export const getUser = (userId?: string): ClaraMenteUser | null => {
  if (userId) {
    return authService.getUserById(userId);
  }
  
  // Retornar usuário atual se não especificar ID
  return (authService as any).currentUser;
};

export const setUser = (user: ClaraMenteUser): void => {
  (authService as any).currentUser = user;
  userService.saveUser(user);
};

export const getCurrentUser = (): ClaraMenteUser | null => {
  return (authService as any).currentUser;
};

export const createSession = (userId: string) => {
  return authService.startTherapySession(userId);
};

export const getSession = (sessionId: string) => {
  return authService.getSessionById(sessionId);
};

export default authService;