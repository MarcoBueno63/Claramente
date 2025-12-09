// lib/user-service.ts - Sistema de Gerenciamento de Usuários
// Integra NextAuth com persistência de dados e progresso terapêutico

// MOCK Session para compatibilidade (NextAuth removido)
interface Session {
  user?: {
    id: string;
    email?: string;
    name?: string;
  }
}

export interface ClaraMenteUser {
  id: string;
  email?: string;
  name?: string;
  locale: string;
  createdAt: Date;
  lastLogin: Date;
  
  // Dados terapêuticos
  freeSessionsUsed: number;
  totalSessions: number;
  completedAssessments: number;
  
  // Preferências
  preferredPersona: string;
  preferredStyle: string;
  notificationsEnabled: boolean;
  
  // Progresso
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: string[];
  
  // Configurações de privacidade
  dataRetentionDays: number;
  shareProgressWithTherapist: boolean;
}

export interface TherapySession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // em segundos
  
  // Conteúdo da sessão
  messages: SessionMessage[];
  emotionsIdentified: string[];
  techniquesApplied: string[];
  riskLevel: 'minimal' | 'moderate' | 'high' | 'critical';
  
  // Métricas
  moodBefore?: number; // 1-10
  moodAfter?: number;  // 1-10
  engagementLevel: number; // 1-10
  
  // Resultados
  keyInsights: string[];
  homeworkAssigned?: string;
  followUpSuggested: boolean;
}

export interface SessionMessage {
  id: string;
  sessionId: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  
  // Metadata
  emotionalTone?: string;
  riskIndicators?: string[];
  techniqueUsed?: string;
  aiPowered?: boolean;
}

export interface UserProgress {
  userId: string;
  period: '7d' | '30d' | '90d' | 'all';
  
  // Métricas gerais
  totalSessions: number;
  averageSessionDuration: number;
  moodImprovement: number; // Diferença média entre mood antes/depois
  
  // Padrões comportamentais
  preferredSessionTimes: string[]; // Horários de maior atividade
  mostDiscussedTopics: string[];
  mostEffectiveTechniques: string[];
  
  // Evolução emocional
  dominantEmotions: Array<{emotion: string; frequency: number}>;
  riskLevelTrend: Array<{date: Date; level: string}>;
  
  // Marcos alcançados
  milestonesAchieved: Array<{
    name: string;
    achievedAt: Date;
    description: string;
  }>;
}

class UserService {
  private readonly STORAGE_PREFIX = 'claramente_';
  
  // Criar ou atualizar usuário baseado na sessão NextAuth
  async createOrUpdateUser(session: Session): Promise<ClaraMenteUser> {
    const userId = session.user?.email || (session.user as any)?.id || 'anonymous';
    
    // Buscar usuário existente
    let user = this.getUserById(userId);
    
    if (!user) {
      // Criar novo usuário
      user = {
        id: userId,
        email: session.user?.email || undefined,
        name: session.user?.name || session.user?.email?.split('@')[0] || 'Usuário',
        locale: 'pt-BR',
        createdAt: new Date(),
        lastLogin: new Date(),
        
        // Dados terapêuticos
        freeSessionsUsed: 0,
        totalSessions: 0,
        completedAssessments: 0,
        
        // Preferências
        preferredPersona: 'empática',
        preferredStyle: 'conversacional',
        notificationsEnabled: true,
        
        // Progresso
        currentStreak: 0,
        longestStreak: 0,
        achievementsUnlocked: [],
        
        // Configurações
        dataRetentionDays: 365,
        shareProgressWithTherapist: false
      };
    } else {
      // Atualizar último login
      user.lastLogin = new Date();
      if (session.user?.name && !user.name) {
        user.name = session.user.name;
      }
    }
    
    this.saveUser(user);
    return user;
  }
  
  // Buscar usuário por ID
  getUserById(userId: string): ClaraMenteUser | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem(`${this.STORAGE_PREFIX}user_${userId}`);
    if (!userData) return null;
    
    try {
      const user = JSON.parse(userData);
      // Converter strings de data para objetos Date
      user.createdAt = new Date(user.createdAt);
      user.lastLogin = new Date(user.lastLogin);
      return user;
    } catch (error) {
      console.error('Erro ao parsear dados do usuário:', error);
      return null;
    }
  }
  
  // Salvar usuário
  saveUser(user: ClaraMenteUser): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(
        `${this.STORAGE_PREFIX}user_${user.id}`,
        JSON.stringify(user)
      );
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }
  
  // Iniciar nova sessão terapêutica
  startTherapySession(userId: string): TherapySession {
    const session: TherapySession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      startTime: new Date(),
      duration: 0,
      messages: [],
      emotionsIdentified: [],
      techniquesApplied: [],
      riskLevel: 'minimal',
      engagementLevel: 5,
      keyInsights: [],
      followUpSuggested: false
    };
    
    this.saveSession(session);
    
    // Atualizar contador do usuário
    const user = this.getUserById(userId);
    if (user) {
      user.totalSessions += 1;
      this.saveUser(user);
    }
    
    return session;
  }
  
  // Salvar sessão terapêutica
  saveSession(session: TherapySession): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(
        `${this.STORAGE_PREFIX}session_${session.id}`,
        JSON.stringify(session)
      );
      
      // Também manter em lista de sessões do usuário
      this.addToUserSessionList(session.userId, session.id);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  }
  
  // Adicionar sessão à lista do usuário
  private addToUserSessionList(userId: string, sessionId: string): void {
    const key = `${this.STORAGE_PREFIX}user_sessions_${userId}`;
    let sessions: string[] = [];
    
    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        sessions = JSON.parse(existing);
      }
    } catch (error) {
      console.error('Erro ao recuperar lista de sessões:', error);
    }
    
    // Adicionar nova sessão no início da lista
    sessions.unshift(sessionId);
    
    // Manter apenas as últimas 50 sessões
    sessions = sessions.slice(0, 50);
    
    try {
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (error) {
      console.error('Erro ao salvar lista de sessões:', error);
    }
  }
  
  // Buscar sessões do usuário
  getUserSessions(userId: string, limit: number = 10): TherapySession[] {
    if (typeof window === 'undefined') return [];
    
    const key = `${this.STORAGE_PREFIX}user_sessions_${userId}`;
    let sessionIds: string[] = [];
    
    try {
      const data = localStorage.getItem(key);
      if (data) {
        sessionIds = JSON.parse(data);
      }
    } catch (error) {
      console.error('Erro ao recuperar IDs das sessões:', error);
      return [];
    }
    
    const sessions: TherapySession[] = [];
    
    // Carregar sessões (limitado pela quantidade solicitada)
    for (const sessionId of sessionIds.slice(0, limit)) {
      try {
        const sessionData = localStorage.getItem(`${this.STORAGE_PREFIX}session_${sessionId}`);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          // Converter strings de data
          session.startTime = new Date(session.startTime);
          if (session.endTime) {
            session.endTime = new Date(session.endTime);
          }
          sessions.push(session);
        }
      } catch (error) {
        console.error(`Erro ao carregar sessão ${sessionId}:`, error);
      }
    }
    
    return sessions;
  }
  
  // Finalizar sessão
  endTherapySession(sessionId: string, moodAfter?: number): TherapySession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = localStorage.getItem(`${this.STORAGE_PREFIX}session_${sessionId}`);
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData) as TherapySession;
      session.endTime = new Date();
      session.duration = Math.floor((session.endTime.getTime() - new Date(session.startTime).getTime()) / 1000);
      
      if (moodAfter !== undefined) {
        session.moodAfter = moodAfter;
      }
      
      this.saveSession(session);
      return session;
      
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
      return null;
    }
  }
  
  // Calcular progresso do usuário
  calculateUserProgress(userId: string, period: '7d' | '30d' | '90d' | 'all' = '30d'): UserProgress {
    const sessions = this.getUserSessions(userId, 100); // Buscar mais sessões para cálculo
    
    // Filtrar por período
    const now = new Date();
    let cutoffDate: Date;
    
    switch (period) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0); // Todas as sessões
    }
    
    const filteredSessions = sessions.filter(s => new Date(s.startTime) >= cutoffDate);
    
    // Calcular métricas
    const totalSessions = filteredSessions.length;
    const averageSessionDuration = totalSessions > 0 
      ? filteredSessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions
      : 0;
    
    // Melhoria do humor
    const sessionsWithMood = filteredSessions.filter(s => s.moodBefore && s.moodAfter);
    const moodImprovement = sessionsWithMood.length > 0
      ? sessionsWithMood.reduce((sum, s) => sum + (s.moodAfter! - s.moodBefore!), 0) / sessionsWithMood.length
      : 0;
    
    // Emoções dominantes
    const emotionCounts: Record<string, number> = {};
    filteredSessions.forEach(session => {
      session.emotionsIdentified.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });
    
    const dominantEmotions = Object.entries(emotionCounts)
      .map(([emotion, frequency]) => ({ emotion, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
    
    // Técnicas mais eficazes (simplificado)
    const techniqueCounts: Record<string, number> = {};
    filteredSessions.forEach(session => {
      session.techniquesApplied.forEach(technique => {
        techniqueCounts[technique] = (techniqueCounts[technique] || 0) + 1;
      });
    });
    
    const mostEffectiveTechniques = Object.keys(techniqueCounts)
      .sort((a, b) => techniqueCounts[b] - techniqueCounts[a])
      .slice(0, 3);
    
    return {
      userId,
      period,
      totalSessions,
      averageSessionDuration,
      moodImprovement,
      preferredSessionTimes: [], // Implementar se necessário
      mostDiscussedTopics: [], // Implementar se necessário
      mostEffectiveTechniques,
      dominantEmotions,
      riskLevelTrend: [], // Implementar se necessário
      milestonesAchieved: [] // Implementar se necessário
    };
  }
  
  // Limpar dados do usuário (GDPR)
  deleteUserData(userId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Buscar todas as sessões do usuário
      const sessions = this.getUserSessions(userId, 1000);
      
      // Deletar cada sessão
      sessions.forEach(session => {
        localStorage.removeItem(`${this.STORAGE_PREFIX}session_${session.id}`);
      });
      
      // Deletar lista de sessões
      localStorage.removeItem(`${this.STORAGE_PREFIX}user_sessions_${userId}`);
      
      // Deletar dados do usuário
      localStorage.removeItem(`${this.STORAGE_PREFIX}user_${userId}`);
      
      console.log(`Dados do usuário ${userId} removidos com sucesso`);
    } catch (error) {
      console.error('Erro ao deletar dados do usuário:', error);
    }
  }
}

// Instância singleton
export const userService = new UserService();

// Hook para usar com NextAuth
export function useAuthenticatedUser() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Este será conectado com useSession do NextAuth
  return userService;
}