// Sistema de Analytics e Tracking de Progresso Terapêutico
// Coleta métricas para relatórios de evolução

export interface AnalyticsEvent {
  userId: string
  sessionId: string
  eventType: 'session_start' | 'session_end' | 'message_sent' | 'assessment_completed' | 
            'technique_applied' | 'emotion_detected' | 'risk_level_changed' | 'improvement_milestone'
  eventData: Record<string, any>
  timestamp: Date
}

export interface SessionMetrics {
  sessionId: string
  userId: string
  startTime: Date
  endTime?: Date
  durationMinutes: number
  messageCount: number
  techniquesApplied: string[]
  emotionsDetected: string[]
  riskLevel: string
  urgencyLevel: string
  completedAssessments: number
  userSatisfaction?: number
}

export interface ProgressMetrics {
  userId: string
  period: string // '7d', '30d', '90d', 'all'
  startDate: Date
  endDate: Date
  
  // Métricas de engajamento
  totalSessions: number
  averageSessionDuration: number
  messagesSent: number
  assessmentsCompleted: number
  
  // Métricas de progresso terapêutico
  riskLevelTrend: 'improving' | 'stable' | 'declining'
  improvementScore: number
  primaryConcerns: string[]
  mostUsedTechniques: string[]
  emotionalProgress: EmotionalProgress
  
  // Marcos de progresso
  milestonesAchieved: Milestone[]
  nextMilestones: Milestone[]
}

export interface EmotionalProgress {
  dominantEmotions: { emotion: string; frequency: number }[]
  emotionalVariability: number
  positiveEmotionTrend: 'increasing' | 'stable' | 'decreasing'
  stressLevelTrend: 'decreasing' | 'stable' | 'increasing'
}

export interface Milestone {
  id: string
  name: string
  description: string
  criteria: MilestoneCriteria
  achievedAt?: Date
  progress: number // 0-100
}

export interface MilestoneCriteria {
  type: 'sessions_completed' | 'risk_reduction' | 'consistency' | 'assessment_improvement'
  target: number
  timeframe?: string
}

export class TherapeuticAnalytics {
  
  // Rastrear evento de analytics
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Erro ao rastrear evento:', error)
    }
  }
  
  // Rastrear início de sessão
  static async trackSessionStart(userId: string, sessionId: string, persona: string, style: string): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'session_start',
      eventData: { persona, style },
      timestamp: new Date()
    })
  }
  
  // Rastrear fim de sessão
  static async trackSessionEnd(sessionId: string, metrics: Partial<SessionMetrics>): Promise<void> {
    await this.trackEvent({
      userId: metrics.userId!,
      sessionId,
      eventType: 'session_end',
      eventData: metrics,
      timestamp: new Date()
    })
  }
  
  // Rastrear aplicação de técnica terapêutica
  static async trackTechniqueApplied(userId: string, sessionId: string, technique: string, context: string): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'technique_applied',
      eventData: { technique, context },
      timestamp: new Date()
    })
  }
  
  // Rastrear detecção de emoção
  static async trackEmotionDetected(userId: string, sessionId: string, emotion: string, confidence: number): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'emotion_detected',
      eventData: { emotion, confidence },
      timestamp: new Date()
    })
  }
  
  // Rastrear mudança de nível de risco
  static async trackRiskLevelChange(userId: string, sessionId: string, previousLevel: string, newLevel: string, reason: string): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'risk_level_changed',
      eventData: { previousLevel, newLevel, reason },
      timestamp: new Date()
    })
  }
  
  // Rastrear conclusão de avaliação
  static async trackAssessmentCompleted(userId: string, sessionId: string, assessmentType: string, score: number, riskLevel: string): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId,
      eventType: 'assessment_completed',
      eventData: { assessmentType, score, riskLevel },
      timestamp: new Date()
    })
  }
  
  // Calcular métricas de progresso
  static calculateProgressMetrics(sessions: any[], assessments: any[], period: string): ProgressMetrics {
    const startDate = this.getStartDateForPeriod(period)
    const endDate = new Date()
    
    // Filtrar dados do período
    const periodSessions = sessions.filter(s => new Date(s.startedAt) >= startDate)
    const periodAssessments = assessments.filter(a => new Date(a.completedAt) >= startDate)
    
    // Métricas básicas
    const totalSessions = periodSessions.length
    const averageSessionDuration = this.calculateAverageSessionDuration(periodSessions)
    const messagesSent = periodSessions.reduce((sum, session) => sum + (session.messages?.length || 0), 0)
    const assessmentsCompleted = periodAssessments.length
    
    // Análise de tendência de risco
    const riskLevels = periodAssessments.map(a => a.overallRiskLevel)
    const riskLevelTrend = this.calculateRiskTrend(riskLevels)
    
    // Score de melhoria
    const improvementScore = this.calculateImprovementScore(riskLevels)
    
    // Preocupações primárias
    const primaryConcerns = this.extractPrimaryConcerns(periodAssessments)
    
    // Técnicas mais usadas
    const mostUsedTechniques = this.extractMostUsedTechniques(periodSessions)
    
    // Progresso emocional
    const emotionalProgress = this.calculateEmotionalProgress(periodSessions)
    
    // Marcos de progresso
    const milestonesAchieved = this.checkAchievedMilestones(sessions, assessments)
    const nextMilestones = this.getNextMilestones(sessions, assessments)
    
    return {
      userId: sessions[0]?.userId || '',
      period,
      startDate,
      endDate,
      totalSessions,
      averageSessionDuration,
      messagesSent,
      assessmentsCompleted,
      riskLevelTrend,
      improvementScore,
      primaryConcerns,
      mostUsedTechniques,
      emotionalProgress,
      milestonesAchieved,
      nextMilestones
    }
  }
  
  // Obter data de início baseada no período
  private static getStartDateForPeriod(period: string): Date {
    const now = new Date()
    switch (period) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      default: return new Date(2020, 0, 1) // 'all' - desde muito tempo atrás
    }
  }
  
  // Calcular duração média das sessões
  private static calculateAverageSessionDuration(sessions: any[]): number {
    const completedSessions = sessions.filter(s => s.endedAt)
    if (completedSessions.length === 0) return 0
    
    const totalDuration = completedSessions.reduce((sum, session) => {
      const duration = (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / (1000 * 60)
      return sum + duration
    }, 0)
    
    return Math.round(totalDuration / completedSessions.length)
  }
  
  // Calcular tendência de risco
  private static calculateRiskTrend(riskLevels: string[]): 'improving' | 'stable' | 'declining' {
    if (riskLevels.length < 2) return 'stable'
    
    const riskValues = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 }
    const recent = riskLevels.slice(-3)
    
    let trend = 0
    for (let i = 1; i < recent.length; i++) {
      const prev = riskValues[recent[i-1] as keyof typeof riskValues] || 2
      const curr = riskValues[recent[i] as keyof typeof riskValues] || 2
      trend += prev - curr // Redução = positivo
    }
    
    if (trend > 0) return 'improving'
    if (trend < 0) return 'declining'
    return 'stable'
  }
  
  // Calcular score de melhoria
  private static calculateImprovementScore(riskLevels: string[]): number {
    if (riskLevels.length < 2) return 0
    
    const riskValues = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 }
    let improvementSum = 0
    
    for (let i = 1; i < riskLevels.length; i++) {
      const prev = riskValues[riskLevels[i-1] as keyof typeof riskValues] || 2
      const curr = riskValues[riskLevels[i] as keyof typeof riskValues] || 2
      improvementSum += prev - curr
    }
    
    return Math.max(-100, Math.min(100, Math.round((improvementSum / riskLevels.length) * 25)))
  }
  
  // Extrair preocupações primárias
  private static extractPrimaryConcerns(assessments: any[]): string[] {
    const concerns: { [key: string]: number } = {}
    
    assessments.forEach(assessment => {
      assessment.primaryConcerns?.forEach((concern: string) => {
        concerns[concern] = (concerns[concern] || 0) + 1
      })
    })
    
    return Object.entries(concerns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([concern]) => concern)
  }
  
  // Extrair técnicas mais usadas
  private static extractMostUsedTechniques(sessions: any[]): string[] {
    const techniques: { [key: string]: number } = {}
    
    sessions.forEach(session => {
      session.appliedTechniques?.forEach((technique: string) => {
        techniques[technique] = (techniques[technique] || 0) + 1
      })
      
      session.messages?.forEach((message: any) => {
        if (message.technique) {
          techniques[message.technique] = (techniques[message.technique] || 0) + 1
        }
      })
    })
    
    return Object.entries(techniques)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([technique]) => technique)
  }
  
  // Calcular progresso emocional
  private static calculateEmotionalProgress(sessions: any[]): EmotionalProgress {
    const emotions: { [key: string]: number } = {}
    let totalEmotions = 0
    
    sessions.forEach(session => {
      session.detectedEmotions?.forEach((emotion: string) => {
        emotions[emotion] = (emotions[emotion] || 0) + 1
        totalEmotions++
      })
    })
    
    const dominantEmotions = Object.entries(emotions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, frequency: count / totalEmotions }))
    
    // Simplificado - em implementação real seria mais complexo
    return {
      dominantEmotions,
      emotionalVariability: dominantEmotions.length / 10, // 0-1
      positiveEmotionTrend: 'stable',
      stressLevelTrend: 'stable'
    }
  }
  
  // Verificar marcos alcançados
  private static checkAchievedMilestones(sessions: any[], assessments: any[]): Milestone[] {
    const milestones: Milestone[] = []
    
    // Marco: Primeira sessão
    if (sessions.length >= 1) {
      milestones.push({
        id: 'first_session',
        name: 'Primeira Sessão',
        description: 'Completou sua primeira sessão terapêutica',
        criteria: { type: 'sessions_completed', target: 1 },
        achievedAt: new Date(sessions[0].startedAt),
        progress: 100
      })
    }
    
    // Marco: Primeira avaliação
    if (assessments.length >= 1) {
      milestones.push({
        id: 'first_assessment',
        name: 'Primeira Avaliação',
        description: 'Completou sua primeira avaliação psicométrica',
        criteria: { type: 'assessment_improvement', target: 1 },
        achievedAt: new Date(assessments[0].completedAt),
        progress: 100
      })
    }
    
    // Marco: 5 sessões
    if (sessions.length >= 5) {
      milestones.push({
        id: 'five_sessions',
        name: 'Engajamento Consistente',
        description: 'Completou 5 sessões terapêuticas',
        criteria: { type: 'sessions_completed', target: 5 },
        achievedAt: new Date(sessions[4].startedAt),
        progress: 100
      })
    }
    
    return milestones
  }
  
  // Obter próximos marcos
  private static getNextMilestones(sessions: any[], assessments: any[]): Milestone[] {
    const milestones: Milestone[] = []
    
    // Próximos marcos baseados no progresso atual
    if (sessions.length < 5) {
      milestones.push({
        id: 'five_sessions',
        name: 'Engajamento Consistente',
        description: 'Complete 5 sessões terapêuticas',
        criteria: { type: 'sessions_completed', target: 5 },
        progress: (sessions.length / 5) * 100
      })
    } else if (sessions.length < 10) {
      milestones.push({
        id: 'ten_sessions',
        name: 'Dedicação Terapêutica',
        description: 'Complete 10 sessões terapêuticas',
        criteria: { type: 'sessions_completed', target: 10 },
        progress: (sessions.length / 10) * 100
      })
    }
    
    if (assessments.length < 3) {
      milestones.push({
        id: 'three_assessments',
        name: 'Acompanhamento Regular',
        description: 'Complete 3 avaliações psicométricas',
        criteria: { type: 'assessment_improvement', target: 3 },
        progress: (assessments.length / 3) * 100
      })
    }
    
    return milestones
  }
}