// lib/analytics-service.ts - Sistema de Analytics para Administradores
// Coleta e analisa métricas de uso da plataforma terapêutica

import { userService, ClaraMenteUser, TherapySession, UserProgress } from './user-service';

export interface PlatformMetrics {
  // Métricas gerais da plataforma
  totalUsers: number;
  activeUsers: number; // Usuários com sessão nas últimas 30 dias
  totalSessions: number;
  averageSessionDuration: number;
  
  // Métricas de crescimento
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  
  // Métricas de engajamento
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  userRetentionRate: number; // % que voltaram após primeira sessão
  averageSessionsPerUser: number;
  
  // Métricas de conversão
  freeUsersCount: number;
  paidUsersCount: number; // Para futuro
  conversionRate: number;
  
  // Métricas de satisfação
  averageMoodImprovement: number;
  successfulSessionsRate: number; // % sessões com melhoria de humor
  
  // Timestamp da coleta
  collectedAt: Date;
}

export interface ConversationAnalytics {
  // Análise de conversações (dados anonimizados)
  totalMessages: number;
  averageMessagesPerSession: number;
  
  // Temas mais discutidos
  topEmotions: Array<{emotion: string; frequency: number; percentage: number}>;
  topTopics: Array<{topic: string; frequency: number; percentage: number}>;
  
  // Técnicas terapêuticas
  mostUsedTechniques: Array<{technique: string; frequency: number; successRate: number}>;
  techniqueEffectiveness: Array<{
    technique: string;
    averageMoodImprovement: number;
    usageFrequency: number;
  }>;
  
  // Padrões de risco
  riskLevelDistribution: {
    minimal: number;
    moderate: number;
    high: number;
    critical: number;
  };
  
  // Padrões temporais
  peakHours: Array<{hour: number; sessionCount: number}>;
  peakDays: Array<{dayOfWeek: number; sessionCount: number}>;
  
  collectedAt: Date;
}

export interface TherapeuticInsights {
  // Insights para otimização terapêutica
  
  // Padrões de sucesso
  successFactors: Array<{
    factor: string;
    correlation: number; // -1 a 1
    description: string;
  }>;
  
  // Perfis de usuário mais bem-sucedidos
  successfulUserProfiles: Array<{
    profile: string;
    averageImprovement: number;
    commonCharacteristics: string[];
  }>;
  
  // Recomendações de melhoria
  recommendations: Array<{
    category: 'engagement' | 'effectiveness' | 'retention' | 'conversion';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    expectedImpact: string;
  }>;
  
  // Benchmarks
  benchmarks: {
    industryAverageSessionDuration: number;
    industryRetentionRate: number;
    industryConversionRate: number;
    ourPerformanceVsIndustry: {
      sessionDuration: 'above' | 'below' | 'average';
      retention: 'above' | 'below' | 'average';
      conversion: 'above' | 'below' | 'average';
    };
  };
  
  collectedAt: Date;
}

class AnalyticsService {
  private readonly STORAGE_PREFIX = 'claramente_analytics_';
  
  // Coletar métricas gerais da plataforma
  collectPlatformMetrics(): PlatformMetrics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Buscar todos os usuários (simulado - em produção seria do banco)
    const allUsers = this.getAllUsers();
    const allSessions = this.getAllSessions();
    
    // Usuários ativos (com sessão nas últimas 30 dias)
    const activeUserIds = new Set(
      allSessions
        .filter(s => new Date(s.startTime) >= thirtyDaysAgo)
        .map(s => s.userId)
    );
    
    // Usuários por período
    const newUsersToday = allUsers.filter(u => 
      new Date(u.createdAt) >= oneDayAgo
    ).length;
    
    const newUsersThisWeek = allUsers.filter(u => 
      new Date(u.createdAt) >= sevenDaysAgo
    ).length;
    
    const newUsersThisMonth = allUsers.filter(u => 
      new Date(u.createdAt) >= thirtyDaysAgo
    ).length;
    
    // DAU, WAU, MAU
    const dailyActiveUsers = new Set(
      allSessions
        .filter(s => new Date(s.startTime) >= oneDayAgo)
        .map(s => s.userId)
    ).size;
    
    const weeklyActiveUsers = new Set(
      allSessions
        .filter(s => new Date(s.startTime) >= sevenDaysAgo)
        .map(s => s.userId)
    ).size;
    
    const monthlyActiveUsers = activeUserIds.size;
    
    // Retenção (usuários que tiveram mais de uma sessão)
    const userSessionCounts = new Map<string, number>();
    allSessions.forEach(session => {
      userSessionCounts.set(
        session.userId, 
        (userSessionCounts.get(session.userId) || 0) + 1
      );
    });
    
    const usersWithMultipleSessions = Array.from(userSessionCounts.values())
      .filter(count => count > 1).length;
    const userRetentionRate = allUsers.length > 0 
      ? (usersWithMultipleSessions / allUsers.length) * 100 
      : 0;
    
    // Duração média das sessões
    const completedSessions = allSessions.filter(s => s.endTime);
    const averageSessionDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length
      : 0;
    
    // Taxa de sucesso (sessões com melhoria de humor)
    const sessionsWithMood = allSessions.filter(s => 
      s.moodBefore !== undefined && s.moodAfter !== undefined
    );
    const successfulSessions = sessionsWithMood.filter(s => 
      s.moodAfter! > s.moodBefore!
    );
    const successfulSessionsRate = sessionsWithMood.length > 0
      ? (successfulSessions.length / sessionsWithMood.length) * 100
      : 0;
    
    // Melhoria média de humor
    const averageMoodImprovement = sessionsWithMood.length > 0
      ? sessionsWithMood.reduce((sum, s) => 
          sum + (s.moodAfter! - s.moodBefore!), 0
        ) / sessionsWithMood.length
      : 0;
    
    const metrics: PlatformMetrics = {
      totalUsers: allUsers.length,
      activeUsers: monthlyActiveUsers,
      totalSessions: allSessions.length,
      averageSessionDuration,
      
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers,
      userRetentionRate,
      averageSessionsPerUser: allUsers.length > 0 ? allSessions.length / allUsers.length : 0,
      
      freeUsersCount: allUsers.filter(u => u.freeSessionsUsed < 5).length,
      paidUsersCount: 0, // Para futuro
      conversionRate: 0, // Para futuro
      
      averageMoodImprovement,
      successfulSessionsRate,
      
      collectedAt: now
    };
    
    // Salvar métricas
    this.saveMetrics('platform', metrics);
    
    return metrics;
  }
  
  // Analisar conversações de forma anonimizada
  analyzeConversations(): ConversationAnalytics {
    const allSessions = this.getAllSessions();
    const allMessages = allSessions.flatMap(s => s.messages);
    
    // Contagem de mensagens
    const totalMessages = allMessages.length;
    const averageMessagesPerSession = allSessions.length > 0 
      ? totalMessages / allSessions.length 
      : 0;
    
    // Análise de emoções
    const emotionCounts = new Map<string, number>();
    allSessions.forEach(session => {
      session.emotionsIdentified.forEach(emotion => {
        emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
      });
    });
    
    const topEmotions = Array.from(emotionCounts.entries())
      .map(([emotion, frequency]) => ({
        emotion,
        frequency,
        percentage: (frequency / allSessions.length) * 100
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
    
    // Análise de técnicas
    const techniqueCounts = new Map<string, {frequency: number; moodImprovements: number[];}>();
    allSessions.forEach(session => {
      session.techniquesApplied.forEach(technique => {
        if (!techniqueCounts.has(technique)) {
          techniqueCounts.set(technique, {frequency: 0, moodImprovements: []});
        }
        const data = techniqueCounts.get(technique)!;
        data.frequency += 1;
        
        if (session.moodBefore && session.moodAfter) {
          data.moodImprovements.push(session.moodAfter - session.moodBefore);
        }
      });
    });
    
    const mostUsedTechniques = Array.from(techniqueCounts.entries())
      .map(([technique, data]) => ({
        technique,
        frequency: data.frequency,
        successRate: data.moodImprovements.length > 0 
          ? (data.moodImprovements.filter(imp => imp > 0).length / data.moodImprovements.length) * 100
          : 0
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
    
    const techniqueEffectiveness = Array.from(techniqueCounts.entries())
      .map(([technique, data]) => ({
        technique,
        averageMoodImprovement: data.moodImprovements.length > 0
          ? data.moodImprovements.reduce((sum, imp) => sum + imp, 0) / data.moodImprovements.length
          : 0,
        usageFrequency: data.frequency
      }))
      .sort((a, b) => b.averageMoodImprovement - a.averageMoodImprovement)
      .slice(0, 10);
    
    // Distribuição de níveis de risco
    const riskCounts = {minimal: 0, moderate: 0, high: 0, critical: 0};
    allSessions.forEach(session => {
      riskCounts[session.riskLevel] += 1;
    });
    
    // Padrões temporais
    const hourCounts = new Map<number, number>();
    const dayCounts = new Map<number, number>();
    
    allSessions.forEach(session => {
      const date = new Date(session.startTime);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      dayCounts.set(dayOfWeek, (dayCounts.get(dayOfWeek) || 0) + 1);
    });
    
    const peakHours = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({hour, sessionCount: count}))
      .sort((a, b) => b.sessionCount - a.sessionCount);
    
    const peakDays = Array.from(dayCounts.entries())
      .map(([dayOfWeek, count]) => ({dayOfWeek, sessionCount: count}))
      .sort((a, b) => b.sessionCount - a.sessionCount);
    
    const analytics: ConversationAnalytics = {
      totalMessages,
      averageMessagesPerSession,
      
      topEmotions,
      topTopics: [], // Implementar análise de tópicos se necessário
      
      mostUsedTechniques,
      techniqueEffectiveness,
      
      riskLevelDistribution: riskCounts,
      
      peakHours,
      peakDays,
      
      collectedAt: new Date()
    };
    
    this.saveMetrics('conversations', analytics);
    return analytics;
  }
  
  // Gerar insights terapêuticos
  generateTherapeuticInsights(): TherapeuticInsights {
    const platformMetrics = this.getLatestMetrics('platform') as PlatformMetrics;
    const conversationAnalytics = this.getLatestMetrics('conversations') as ConversationAnalytics;
    
    // Fatores de sucesso baseados nos dados
    const successFactors = [
      {
        factor: 'Duração da Sessão',
        correlation: platformMetrics.averageSessionDuration > 20 * 60 ? 0.7 : 0.3,
        description: platformMetrics.averageSessionDuration > 20 * 60 
          ? 'Sessões mais longas correlacionam com melhor resultado'
          : 'Sessões muito curtas podem não ser eficazes'
      },
      {
        factor: 'Frequência de Uso',
        correlation: platformMetrics.averageSessionsPerUser > 2 ? 0.8 : 0.4,
        description: 'Usuários que retornam múltiplas vezes têm melhor progresso'
      },
      {
        factor: 'Engajamento com Técnicas',
        correlation: conversationAnalytics.mostUsedTechniques.length > 0 ? 0.6 : 0.2,
        description: 'Aplicação consistente de técnicas terapêuticas melhora resultados'
      }
    ];
    
    // Recomendações baseadas nos dados
    const recommendations = [];
    
    if (platformMetrics.userRetentionRate < 50) {
      recommendations.push({
        category: 'retention' as const,
        priority: 'high' as const,
        title: 'Melhorar Retenção de Usuários',
        description: `Taxa de retenção atual: ${platformMetrics.userRetentionRate.toFixed(1)}%. Implementar lembretes e follow-ups.`,
        expectedImpact: 'Aumento de 20-30% na retenção'
      });
    }
    
    if (platformMetrics.averageSessionDuration < 15 * 60) {
      recommendations.push({
        category: 'engagement' as const,
        priority: 'medium' as const,
        title: 'Aumentar Duração das Sessões',
        description: 'Sessões muito curtas podem não ser terapeuticamente eficazes. Adicionar exercícios interativos.',
        expectedImpact: 'Melhoria de 15-25% na eficácia terapêutica'
      });
    }
    
    if (conversationAnalytics.riskLevelDistribution.high > conversationAnalytics.totalMessages * 0.1) {
      recommendations.push({
        category: 'effectiveness' as const,
        priority: 'high' as const,
        title: 'Protocolo de Alto Risco',
        description: 'Alto número de sessões com risco elevado. Implementar encaminhamento automático.',
        expectedImpact: 'Redução de 40-60% em situações de risco não tratadas'
      });
    }
    
    const insights: TherapeuticInsights = {
      successFactors,
      
      successfulUserProfiles: [
        {
          profile: 'Usuário Engajado',
          averageImprovement: platformMetrics.averageMoodImprovement,
          commonCharacteristics: [
            'Múltiplas sessões por semana',
            'Engajamento com exercícios',
            'Compartilhamento emocional aberto'
          ]
        }
      ],
      
      recommendations,
      
      benchmarks: {
        industryAverageSessionDuration: 25 * 60, // 25 minutos
        industryRetentionRate: 45, // 45%
        industryConversionRate: 8, // 8%
        ourPerformanceVsIndustry: {
          sessionDuration: platformMetrics.averageSessionDuration > 25 * 60 ? 'above' : 
                           platformMetrics.averageSessionDuration < 20 * 60 ? 'below' : 'average',
          retention: platformMetrics.userRetentionRate > 50 ? 'above' :
                     platformMetrics.userRetentionRate < 40 ? 'below' : 'average',
          conversion: 'average' // Para futuro quando implementarmos pagamentos
        }
      },
      
      collectedAt: new Date()
    };
    
    this.saveMetrics('insights', insights);
    return insights;
  }
  
  // Métodos auxiliares para simular busca de dados
  private getAllUsers(): ClaraMenteUser[] {
    if (typeof window === 'undefined') return [];
    
    const users: ClaraMenteUser[] = [];
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('claramente_user_') && !key.includes('sessions')
    );
    
    keys.forEach(key => {
      try {
        const userData = localStorage.getItem(key);
        if (userData) {
          const user = JSON.parse(userData);
          user.createdAt = new Date(user.createdAt);
          user.lastLogin = new Date(user.lastLogin);
          users.push(user);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    });
    
    return users;
  }
  
  private getAllSessions(): TherapySession[] {
    if (typeof window === 'undefined') return [];
    
    const sessions: TherapySession[] = [];
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('claramente_session_')
    );
    
    keys.forEach(key => {
      try {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          session.startTime = new Date(session.startTime);
          if (session.endTime) {
            session.endTime = new Date(session.endTime);
          }
          sessions.push(session);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      }
    });
    
    return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }
  
  // Salvar métricas
  private saveMetrics(type: string, data: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const key = `${this.STORAGE_PREFIX}${type}_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(data));
      
      // Manter apenas as últimas 10 coletas por tipo
      this.cleanOldMetrics(type);
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
    }
  }
  
  // Buscar últimas métricas
  private getLatestMetrics(type: string): any {
    if (typeof window === 'undefined') return null;
    
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.STORAGE_PREFIX}${type}_`))
      .sort((a, b) => {
        const timestampA = parseInt(a.split('_').pop() || '0');
        const timestampB = parseInt(b.split('_').pop() || '0');
        return timestampB - timestampA;
      });
    
    if (keys.length === 0) return null;
    
    try {
      const data = localStorage.getItem(keys[0]);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      return null;
    }
  }
  
  // Limpar métricas antigas
  private cleanOldMetrics(type: string): void {
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.STORAGE_PREFIX}${type}_`))
      .sort((a, b) => {
        const timestampA = parseInt(a.split('_').pop() || '0');
        const timestampB = parseInt(b.split('_').pop() || '0');
        return timestampB - timestampA;
      });
    
    // Remover além das últimas 10
    keys.slice(10).forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  // Exportar dados para relatório
  exportAnalyticsData(): {
    platform: PlatformMetrics;
    conversations: ConversationAnalytics;
    insights: TherapeuticInsights;
  } {
    return {
      platform: this.collectPlatformMetrics(),
      conversations: this.analyzeConversations(),
      insights: this.generateTherapeuticInsights()
    };
  }
}

// Instância singleton
export const analyticsService = new AnalyticsService();