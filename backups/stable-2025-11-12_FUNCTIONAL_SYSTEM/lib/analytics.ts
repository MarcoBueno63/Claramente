// AnalyticsSystem.ts
// Sistema de Analytics Avançados - Claramente
// Coleta, análise e insights de dados comportamentais

'use client';

export interface SessionAnalytics {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // em minutos
  messageCount: number;
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
  topicsDiscussed: string[];
  techniquesUsed: string[];
  moodBefore?: number; // 1-10
  moodAfter?: number; // 1-10
  exercisesCompleted: string[];
  thoughtRecordsCreated: number;
  coreBeliefsChallenged: string[];
  engagement: {
    responseTime: number; // segundos médios
    interactionDepth: number; // 1-5
    completionRate: number; // %
  };
}

export interface UserBehaviorPattern {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalSessions: number;
    avgSessionDuration: number;
    mostActiveHours: number[];
    mostDiscussedTopics: Array<{ topic: string; frequency: number }>;
    emotionalTrend: Array<{ date: Date; mood: number; tone: string }>;
    progressionRate: number; // melhora por semana
    streakBest: number;
    streakCurrent: number;
    exercisePreferences: Array<{ type: string; completionRate: number }>;
  };
}

export interface TherapeuticInsight {
  id: string;
  userId: string;
  type: 'pattern_detection' | 'trigger_identification' | 'progress_milestone' | 'concern_alert';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  evidence: string[];
  recommendations: string[];
  detectedAt: Date;
  acknowledged: boolean;
}

export interface AnalyticsConfig {
  dataRetention: number; // dias
  privacyLevel: 'minimal' | 'standard' | 'comprehensive';
  anonymization: boolean;
  shareWithTherapist: boolean;
  autoInsights: boolean;
}

class ClaramenteAnalytics {
  private config: AnalyticsConfig;
  private currentSession: SessionAnalytics | null = null;
  private behaviorBuffer: Array<any> = [];

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      dataRetention: 90, // 3 meses padrão
      privacyLevel: 'standard',
      anonymization: true,
      shareWithTherapist: false,
      autoInsights: true,
      ...config
    };
    
    this.initializeStorage();
  }

  // ===== INICIALIZAÇÃO =====

  private initializeStorage(): void {
    if (typeof window === 'undefined') return;
    
    // Verificar se já existe configuração
    const savedConfig = localStorage.getItem('claramente-analytics-config');
    if (savedConfig) {
      this.config = { ...this.config, ...JSON.parse(savedConfig) };
    } else {
      this.saveConfig();
    }
    
    // Limpar dados antigos baseado na retenção
    this.cleanOldData();
  }

  private saveConfig(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('claramente-analytics-config', JSON.stringify(this.config));
  }

  private cleanOldData(): void {
    if (typeof window === 'undefined') return;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.dataRetention);
    
    // Limpar sessões antigas
    const sessions = this.getAllSessions();
    const validSessions = sessions.filter(s => new Date(s.startTime) >= cutoffDate);
    localStorage.setItem('claramente-analytics-sessions', JSON.stringify(validSessions));
    
    // Limpar insights antigos
    const insights = this.getAllInsights();
    const validInsights = insights.filter(i => new Date(i.detectedAt) >= cutoffDate);
    localStorage.setItem('claramente-analytics-insights', JSON.stringify(validInsights));
  }

  // ===== COLETA DE DADOS =====

  startSession(userId: string): SessionAnalytics {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      sessionId,
      userId,
      startTime: new Date(),
      duration: 0,
      messageCount: 0,
      emotionalTone: 'neutral',
      topicsDiscussed: [],
      techniquesUsed: [],
      exercisesCompleted: [],
      thoughtRecordsCreated: 0,
      coreBeliefsChallenged: [],
      engagement: {
        responseTime: 0,
        interactionDepth: 1,
        completionRate: 0
      }
    };

    console.log('[Analytics] Sessão iniciada:', sessionId);
    return this.currentSession;
  }

  endSession(): SessionAnalytics | null {
    if (!this.currentSession) return null;

    this.currentSession.endTime = new Date();
    this.currentSession.duration = Math.floor(
      (this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime()) / (1000 * 60)
    );

    // Salvar sessão
    this.saveSession(this.currentSession);
    
    // Gerar insights automáticos
    if (this.config.autoInsights) {
      this.generateSessionInsights(this.currentSession);
    }

    const completedSession = { ...this.currentSession };
    this.currentSession = null;

    console.log('[Analytics] Sessão finalizada:', completedSession.sessionId, `${completedSession.duration}min`);
    return completedSession;
  }

  trackMessage(content: string, role: 'user' | 'assistant', context?: any): void {
    if (!this.currentSession) return;

    this.currentSession.messageCount++;
    
    // Analisar tom emocional
    if (role === 'user') {
      const tone = this.analyzeEmotionalTone(content);
      this.currentSession.emotionalTone = this.combineEmotionalTones(this.currentSession.emotionalTone, tone);
    }

    // Extrair tópicos discutidos
    if (context?.category) {
      if (!this.currentSession.topicsDiscussed.includes(context.category)) {
        this.currentSession.topicsDiscussed.push(context.category);
      }
    }

    // Rastrear técnicas usadas
    if (context?.technique && !this.currentSession.techniquesUsed.includes(context.technique)) {
      this.currentSession.techniquesUsed.push(context.technique);
    }

    // Atualizar engagement
    if (role === 'user') {
      this.updateEngagementMetrics(content.length);
    }
  }

  trackExerciseCompletion(exerciseType: string, completion: boolean): void {
    if (!this.currentSession) return;

    if (completion) {
      this.currentSession.exercisesCompleted.push(exerciseType);
    }

    // Atualizar taxa de conclusão
    const totalExercises = this.currentSession.exercisesCompleted.length + 1;
    this.currentSession.engagement.completionRate = 
      (this.currentSession.exercisesCompleted.length / totalExercises) * 100;
  }

  trackMoodChange(before: number, after: number): void {
    if (!this.currentSession) return;

    this.currentSession.moodBefore = before;
    this.currentSession.moodAfter = after;
  }

  trackThoughtRecord(beliefType?: string): void {
    if (!this.currentSession) return;

    this.currentSession.thoughtRecordsCreated++;
    
    if (beliefType && !this.currentSession.coreBeliefsChallenged.includes(beliefType)) {
      this.currentSession.coreBeliefsChallenged.push(beliefType);
    }
  }

  // ===== ANÁLISE COMPORTAMENTAL =====

  private analyzeEmotionalTone(text: string): 'positive' | 'neutral' | 'negative' | 'mixed' {
    const positiveWords = ['feliz', 'bem', 'ótimo', 'alegre', 'tranquilo', 'confiante', 'motivado', 'esperançoso'];
    const negativeWords = ['triste', 'ansioso', 'preocupado', 'frustrado', 'deprimido', 'medo', 'raiva', 'angústia'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount && positiveCount > 0) return 'positive';
    if (negativeCount > positiveCount && negativeCount > 0) return 'negative';
    if (positiveCount > 0 && negativeCount > 0) return 'mixed';
    return 'neutral';
  }

  private combineEmotionalTones(current: string, new_tone: string): 'positive' | 'neutral' | 'negative' | 'mixed' {
    if (current === new_tone) return current as any;
    if (current === 'neutral') return new_tone as any;
    if (new_tone === 'neutral') return current as any;
    return 'mixed';
  }

  private updateEngagementMetrics(messageLength: number): void {
    if (!this.currentSession) return;

    // Calcular profundidade de interação baseada no comprimento da mensagem
    const depth = Math.min(5, Math.ceil(messageLength / 50));
    this.currentSession.engagement.interactionDepth = 
      Math.max(this.currentSession.engagement.interactionDepth, depth);
  }

  // ===== GERAÇÃO DE INSIGHTS =====

  private generateSessionInsights(session: SessionAnalytics): void {
    const insights: TherapeuticInsight[] = [];

    // Insight de Progresso de Humor
    if (session.moodBefore && session.moodAfter) {
      const improvement = session.moodAfter - session.moodBefore;
      if (improvement >= 2) {
        insights.push({
          id: `insight_${Date.now()}_mood_improvement`,
          userId: session.userId,
          type: 'progress_milestone',
          severity: 'low',
          title: 'Melhora Significativa do Humor',
          description: `Seu humor melhorou ${improvement} pontos durante a sessão (${session.moodBefore} → ${session.moodAfter})`,
          evidence: [`Sessão: ${session.sessionId}`, `Duração: ${session.duration} minutos`],
          recommendations: [
            'Continue praticando as técnicas que funcionaram hoje',
            'Identifique o que contribuiu para essa melhora'
          ],
          detectedAt: new Date(),
          acknowledged: false
        });
      }
    }

    // Insight de Engagement Alto
    if (session.engagement.interactionDepth >= 4 && session.duration >= 20) {
      insights.push({
        id: `insight_${Date.now()}_high_engagement`,
        userId: session.userId,
        type: 'progress_milestone',
        severity: 'low',
        title: 'Sessão Altamente Engajada',
        description: 'Você demonstrou alto nível de engajamento e reflexão profunda',
        evidence: [
          `Profundidade de interação: ${session.engagement.interactionDepth}/5`,
          `${session.messageCount} mensagens trocadas`,
          `${session.techniquesUsed.length} técnicas aplicadas`
        ],
        recommendations: [
          'Esse nível de engajamento potencializa seus resultados',
          'Considere manter essa frequência de prática'
        ],
        detectedAt: new Date(),
        acknowledged: false
      });
    }

    // Salvar insights gerados
    insights.forEach(insight => this.saveInsight(insight));
  }

  // ===== ANÁLISE DE PADRÕES =====

  generateBehaviorPattern(userId: string, period: 'daily' | 'weekly' | 'monthly' = 'weekly'): UserBehaviorPattern {
    const sessions = this.getUserSessions(userId);
    const now = new Date();
    
    let startDate = new Date(now);
    switch (period) {
      case 'daily':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const periodSessions = sessions.filter(s => 
      new Date(s.startTime) >= startDate && new Date(s.startTime) <= now
    );

    // Calcular métricas
    const totalSessions = periodSessions.length;
    const avgDuration = totalSessions > 0 
      ? periodSessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions 
      : 0;

    // Horas mais ativas
    const hourCounts: { [hour: number]: number } = {};
    periodSessions.forEach(s => {
      const hour = new Date(s.startTime).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const mostActiveHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Tópicos mais discutidos
    const topicCounts: { [topic: string]: number } = {};
    periodSessions.forEach(s => {
      s.topicsDiscussed.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });
    const mostDiscussedTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, frequency]) => ({ topic, frequency }));

    // Trend emocional
    const emotionalTrend = periodSessions
      .filter(s => s.moodAfter)
      .map(s => ({
        date: new Date(s.startTime),
        mood: s.moodAfter!,
        tone: s.emotionalTone
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      userId,
      period,
      startDate,
      endDate: now,
      metrics: {
        totalSessions,
        avgSessionDuration: Math.round(avgDuration),
        mostActiveHours,
        mostDiscussedTopics,
        emotionalTrend,
        progressionRate: this.calculateProgressionRate(emotionalTrend),
        streakBest: this.calculateBestStreak(userId),
        streakCurrent: this.calculateCurrentStreak(userId),
        exercisePreferences: this.calculateExercisePreferences(periodSessions)
      }
    };
  }

  private calculateProgressionRate(emotionalTrend: Array<{ date: Date; mood: number; tone: string }>): number {
    if (emotionalTrend.length < 2) return 0;
    
    const first = emotionalTrend[0].mood;
    const last = emotionalTrend[emotionalTrend.length - 1].mood;
    return ((last - first) / emotionalTrend.length) * 7; // por semana
  }

  private calculateBestStreak(userId: string): number {
    const sessions = this.getUserSessions(userId);
    if (sessions.length === 0) return 0;

    sessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    let bestStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < sessions.length; i++) {
      const prevDate = new Date(sessions[i-1].startTime);
      const currDate = new Date(sessions[i].startTime);
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        currentStreak++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    return Math.max(bestStreak, currentStreak);
  }

  private calculateCurrentStreak(userId: string): number {
    const sessions = this.getUserSessions(userId);
    if (sessions.length === 0) return 0;

    sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    const today = new Date();
    const lastSession = new Date(sessions[0].startTime);
    const daysSinceLastSession = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastSession > 1) return 0; // Streak quebrado
    
    let streak = 1;
    for (let i = 1; i < sessions.length; i++) {
      const prevDate = new Date(sessions[i-1].startTime);
      const currDate = new Date(sessions[i].startTime);
      const daysDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private calculateExercisePreferences(sessions: SessionAnalytics[]): Array<{ type: string; completionRate: number }> {
    const exerciseStats: { [type: string]: { attempts: number; completions: number } } = {};
    
    sessions.forEach(session => {
      session.exercisesCompleted.forEach(exercise => {
        if (!exerciseStats[exercise]) {
          exerciseStats[exercise] = { attempts: 0, completions: 0 };
        }
        exerciseStats[exercise].attempts++;
        exerciseStats[exercise].completions++;
      });
    });

    return Object.entries(exerciseStats)
      .map(([type, stats]) => ({
        type,
        completionRate: (stats.completions / stats.attempts) * 100
      }))
      .sort((a, b) => b.completionRate - a.completionRate);
  }

  // ===== PERSISTÊNCIA =====

  private saveSession(session: SessionAnalytics): void {
    if (typeof window === 'undefined') return;
    
    const sessions = this.getAllSessions();
    sessions.push(session);
    localStorage.setItem('claramente-analytics-sessions', JSON.stringify(sessions));
  }

  private saveInsight(insight: TherapeuticInsight): void {
    if (typeof window === 'undefined') return;
    
    const insights = this.getAllInsights();
    insights.push(insight);
    localStorage.setItem('claramente-analytics-insights', JSON.stringify(insights));
  }

  // ===== API PÚBLICA =====

  getAllSessions(): SessionAnalytics[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem('claramente-analytics-sessions');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getUserSessions(userId: string): SessionAnalytics[] {
    return this.getAllSessions().filter(s => s.userId === userId);
  }

  getAllInsights(): TherapeuticInsight[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem('claramente-analytics-insights');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getUserInsights(userId: string): TherapeuticInsight[] {
    return this.getAllInsights().filter(i => i.userId === userId);
  }

  acknowledgeInsight(insightId: string): void {
    const insights = this.getAllInsights();
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      insight.acknowledged = true;
      localStorage.setItem('claramente-analytics-insights', JSON.stringify(insights));
    }
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  getCurrentSession(): SessionAnalytics | null {
    return this.currentSession;
  }

  // Exportar dados para relatório
  exportData(userId: string, format: 'json' | 'csv' = 'json'): string {
    const sessions = this.getUserSessions(userId);
    const insights = this.getUserInsights(userId);
    const patterns = this.generateBehaviorPattern(userId, 'monthly');

    const data = {
      exportDate: new Date().toISOString(),
      userId: this.config.anonymization ? 'anonymous' : userId,
      sessions: sessions.length,
      insights: insights.length,
      period: patterns,
      sessions_data: this.config.privacyLevel === 'comprehensive' ? sessions : [],
      insights_data: insights
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    // CSV simplificado
    let csv = 'Date,Duration,Mood_Before,Mood_After,Topics,Techniques\n';
    sessions.forEach(s => {
      csv += `${s.startTime},${s.duration},${s.moodBefore || ''},${s.moodAfter || ''},${s.topicsDiscussed.join(';')},${s.techniquesUsed.join(';')}\n`;
    });
    return csv;
  }
}

// Instância singleton
let analyticsInstance: ClaramenteAnalytics | null = null;

export function getAnalytics(config?: Partial<AnalyticsConfig>): ClaramenteAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new ClaramenteAnalytics(config);
  }
  return analyticsInstance;
}

export default ClaramenteAnalytics;