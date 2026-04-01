// Sistema de persistência local para sessões TCC
export interface SessionData {
  id: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    tccContext?: {
      technique?: string;
      category?: string;
      coreBeliefs?: Array<{
        domain: string;
        type: string;
        centralBelief: string;
        confidence: number;
      }>;
      intermediateBeliefs?: Array<{
        type: string;
        category: string;
        rule?: string;
        attitude?: string;
        intervention: string;
      }>;
      interventionType?: string;
    };
  }>;
  beliefProfile: {
    coreBeliefs: Array<{
      domain: string;
      type: string;
      centralBelief: string;
      confidence: number;
      identifiedAt: Date;
    }>;
    intermediateBeliefs: Array<{
      type: string;
      category: string;
      rule?: string;
      attitude?: string;
      intervention: string;
      identifiedAt: Date;
    }>;
  };
  thoughtRecords: Array<{
    id: string;
    situation: string;
    emotion: string;
    intensity: number;
    automaticThought: string;
    alternativeThought?: string;
    timestamp: Date;
  }>;
  therapeuticTasks: Array<{
    id: string;
    type: 'thought_record' | 'behavioral_experiment' | 'mood_tracking' | 'homework';
    title: string;
    description: string;
    dueDate?: Date;
    completed: boolean;
    createdAt: Date;
  }>;
  sessionNotes: string;
  emotionalProgress: Array<{
    timestamp: Date;
    emotions: string[];
    intensity: number;
    context: string;
  }>;
}

export interface UserProfile {
  id: string;
  createdAt: Date;
  lastSession: Date;
  totalSessions: number;
  preferredTherapeuticStyle: string;
  progressMetrics: {
    coreBeliefs: {
      identified: number;
      addressed: number;
    };
    emotionalRegulation: {
      averageIntensity: number;
      improvementTrend: number;
    };
    taskCompletion: {
      assigned: number;
      completed: number;
      completionRate: number;
    };
  };
}

type SerializedMessage = SessionData['messages'][number] & { timestamp: string | Date };
type SerializedCoreBelief = SessionData['beliefProfile']['coreBeliefs'][number] & { identifiedAt: string | Date };
type SerializedIntermediateBelief = SessionData['beliefProfile']['intermediateBeliefs'][number] & { identifiedAt: string | Date };
type SerializedThoughtRecord = SessionData['thoughtRecords'][number] & { timestamp: string | Date };
type SerializedTask = SessionData['therapeuticTasks'][number] & { createdAt: string | Date; dueDate?: string | Date };
type SerializedEmotion = SessionData['emotionalProgress'][number] & { timestamp: string | Date };

type SerializedSession = Omit<SessionData, 'startTime' | 'lastActivity' | 'messages' | 'beliefProfile' | 'thoughtRecords' | 'therapeuticTasks' | 'emotionalProgress'> & {
  startTime: string | Date;
  lastActivity: string | Date;
  messages: SerializedMessage[];
  beliefProfile: {
    coreBeliefs: SerializedCoreBelief[];
    intermediateBeliefs: SerializedIntermediateBelief[];
  };
  thoughtRecords: SerializedThoughtRecord[];
  therapeuticTasks: SerializedTask[];
  emotionalProgress: SerializedEmotion[];
};

class TherapyStorage {
  private readonly SESSION_KEY = 'claramente_sessions';
  private readonly PROFILE_KEY = 'claramente_profile';
  private readonly CURRENT_SESSION_KEY = 'claramente_current_session';

  // Gerenciamento de Sessões
  saveSession(sessionData: SessionData): void {
    try {
      const sessions = this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === sessionData.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = sessionData;
      } else {
        sessions.push(sessionData);
      }
      
      // Manter apenas as últimas 50 sessões
      if (sessions.length > 50) {
        sessions.splice(0, sessions.length - 50);
      }
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
      localStorage.setItem(this.CURRENT_SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  }

  getCurrentSession(): SessionData | null {
    try {
      const data = localStorage.getItem(this.CURRENT_SESSION_KEY);
      if (!data) return null;
      
      const session = JSON.parse(data);
      // Reconverter datas
      return this.deserializeSession(session as SerializedSession);
    } catch (error) {
      console.error('Erro ao carregar sessão atual:', error);
      return null;
    }
  }

  getAllSessions(): SessionData[] {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      if (!data) return [];
      
      const sessions = JSON.parse(data);
      return sessions.map((session: SerializedSession) => this.deserializeSession(session));
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      return [];
    }
  }

  createNewSession(userId: string): SessionData {
    const newSession: SessionData = {
      id: Date.now().toString(),
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      messages: [],
      beliefProfile: {
        coreBeliefs: [],
        intermediateBeliefs: []
      },
      thoughtRecords: [],
      therapeuticTasks: [],
      sessionNotes: '',
      emotionalProgress: []
    };

    this.saveSession(newSession);
    return newSession;
  }

  // Gerenciamento de Perfil do Usuário
  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  }

  getUserProfile(userId: string): UserProfile | null {
    try {
      const data = localStorage.getItem(this.PROFILE_KEY);
      if (!data) return null;
      
      const profile = JSON.parse(data);
      if (profile.id !== userId) return null;
      
      // Reconverter datas
      profile.createdAt = new Date(profile.createdAt);
      profile.lastSession = new Date(profile.lastSession);
      
      return profile;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      return null;
    }
  }

  createUserProfile(userId: string): UserProfile {
    const profile: UserProfile = {
      id: userId,
      createdAt: new Date(),
      lastSession: new Date(),
      totalSessions: 0,
      preferredTherapeuticStyle: 'balanced',
      progressMetrics: {
        coreBeliefs: {
          identified: 0,
          addressed: 0
        },
        emotionalRegulation: {
          averageIntensity: 5,
          improvementTrend: 0
        },
        taskCompletion: {
          assigned: 0,
          completed: 0,
          completionRate: 0
        }
      }
    };

    this.saveUserProfile(profile);
    return profile;
  }

  updateProgressMetrics(userId: string, sessionData: SessionData): void {
    const profile = this.getUserProfile(userId) || this.createUserProfile(userId);
    
    // Atualizar métricas
    profile.lastSession = new Date();
    profile.totalSessions += 1;
    
    // Crenças identificadas
    profile.progressMetrics.coreBeliefs.identified = sessionData.beliefProfile.coreBeliefs.length;
    
    // Taxa de conclusão de tarefas
    const completedTasks = sessionData.therapeuticTasks.filter(task => task.completed).length;
    profile.progressMetrics.taskCompletion.assigned = sessionData.therapeuticTasks.length;
    profile.progressMetrics.taskCompletion.completed = completedTasks;
    profile.progressMetrics.taskCompletion.completionRate = 
      sessionData.therapeuticTasks.length > 0 ? completedTasks / sessionData.therapeuticTasks.length : 0;
    
    // Intensidade emocional média
    if (sessionData.emotionalProgress.length > 0) {
      const avgIntensity = sessionData.emotionalProgress.reduce((sum, ep) => sum + ep.intensity, 0) 
        / sessionData.emotionalProgress.length;
      profile.progressMetrics.emotionalRegulation.averageIntensity = avgIntensity;
    }
    
    this.saveUserProfile(profile);
  }

  // Análise de Progresso
  getProgressAnalytics(userId: string): {
    sessionsOverTime: Array<{ date: string; count: number }>;
    emotionalTrends: Array<{ date: string; intensity: number; emotions: string[] }>;
    beliefEvolution: Array<{ date: string; coreBeliefs: number; intermediateBeliefs: number }>;
    taskCompletionRate: number;
  } {
    const sessions = this.getAllSessions().filter(s => s.userId === userId);
    
    // Agrupar sessões por data
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = session.startTime.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tendências emocionais
    const emotionalTrends = sessions.flatMap(session => 
      session.emotionalProgress.map(ep => ({
        date: ep.timestamp.toISOString().split('T')[0],
        intensity: ep.intensity,
        emotions: ep.emotions
      }))
    );

    // Evolução de crenças
    const beliefEvolution = sessions.map(session => ({
      date: session.startTime.toISOString().split('T')[0],
      coreBeliefs: session.beliefProfile.coreBeliefs.length,
      intermediateBeliefs: session.beliefProfile.intermediateBeliefs.length
    }));

    // Taxa de conclusão de tarefas
    const allTasks = sessions.flatMap(s => s.therapeuticTasks);
    const completedTasks = allTasks.filter(task => task.completed).length;
    const taskCompletionRate = allTasks.length > 0 ? completedTasks / allTasks.length : 0;

    return {
      sessionsOverTime: Object.entries(sessionsByDate).map(([date, count]) => ({ date, count })),
      emotionalTrends,
      beliefEvolution,
      taskCompletionRate
    };
  }

  // Utilidades
  private deserializeSession(session: SerializedSession): SessionData {
    return {
      ...session,
      startTime: new Date(session.startTime),
      lastActivity: new Date(session.lastActivity),
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })),
      beliefProfile: {
        coreBeliefs: session.beliefProfile.coreBeliefs.map((belief) => ({
          ...belief,
          identifiedAt: new Date(belief.identifiedAt)
        })),
        intermediateBeliefs: session.beliefProfile.intermediateBeliefs.map((belief) => ({
          ...belief,
          identifiedAt: new Date(belief.identifiedAt)
        }))
      },
      thoughtRecords: session.thoughtRecords.map((record) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      })),
      therapeuticTasks: session.therapeuticTasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      })),
      emotionalProgress: session.emotionalProgress.map((ep) => ({
        ...ep,
        timestamp: new Date(ep.timestamp)
      }))
    };
  }

  // Limpeza e Manutenção
  clearAllData(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.removeItem(this.CURRENT_SESSION_KEY);
  }

  exportData(userId: string): string {
    const sessions = this.getAllSessions().filter(s => s.userId === userId);
    const profile = this.getUserProfile(userId);
    const analytics = this.getProgressAnalytics(userId);
    
    return JSON.stringify({
      profile,
      sessions,
      analytics,
      exportDate: new Date().toISOString()
    }, null, 2);
  }
}

// Instância singleton
export const therapyStorage = new TherapyStorage();