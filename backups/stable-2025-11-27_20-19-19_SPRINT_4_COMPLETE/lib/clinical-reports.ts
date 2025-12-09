/**
 * Sistema Completo de Relatórios Clínicos
 * Geração automatizada de relatórios de progresso, sessão e avaliação
 */

export interface SessionData {
  id: string;
  date: Date;
  duration: number; // em minutos
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  exercisesCompleted: string[];
  mood: number; // 1-10
  anxiety: number; // 1-10
  notes?: string;
  protocol?: string;
}

export interface AssessmentResult {
  id: string;
  type: 'PHQ-9' | 'GAD-7' | 'Beck' | 'Custom';
  date: Date;
  score: number;
  maxScore: number;
  interpretation: string;
  severity: 'Minimal' | 'Leve' | 'Moderado' | 'Moderado-Severo' | 'Severo';
  responses: Record<string, number>;
}

export interface CaseFormulation {
  id: string;
  patientId: string;
  date: Date;
  precipitatingFactors: string[];
  perpetuatingFactors: string[];
  protectiveFactors: string[];
  vulnerabilityFactors: string[];
  targetSymptoms: string[];
  treatmentGoals: string[];
  recommendedInterventions: string[];
}

export interface ProgressReport {
  id: string;
  patientId: string;
  startDate: Date;
  endDate: Date;
  totalSessions: number;
  completedExercises: number;
  assessmentProgress: {
    initial: AssessmentResult[];
    current: AssessmentResult[];
    improvement: Record<string, number>;
  };
  goalProgress: Array<{
    goal: string;
    progress: number; // 0-100%
    status: 'Em Andamento' | 'Atingido' | 'Revisado';
  }>;
  recommendations: string[];
  summary: string;
}

export class ClinicalReportsService {
  private static instance: ClinicalReportsService;

  public static getInstance(): ClinicalReportsService {
    if (!ClinicalReportsService.instance) {
      ClinicalReportsService.instance = new ClinicalReportsService();
    }
    return ClinicalReportsService.instance;
  }

  /**
   * Gera relatório de progresso geral do paciente
   */
  async generateProgressReport(
    patientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ProgressReport> {
    const sessions = await this.getSessionsInPeriod(patientId, startDate, endDate);
    const assessments = await this.getAssessmentsInPeriod(patientId, startDate, endDate);
    const caseFormulation = await this.getCaseFormulation(patientId);

    const totalSessions = sessions.length;
    const completedExercises = this.countCompletedExercises(sessions);
    const assessmentProgress = this.analyzeAssessmentProgress(assessments);
    const goalProgress = this.analyzeGoalProgress(caseFormulation, sessions, assessments);
    
    return {
      id: `progress_${Date.now()}`,
      patientId,
      startDate,
      endDate,
      totalSessions,
      completedExercises,
      assessmentProgress,
      goalProgress,
      recommendations: this.generateRecommendations(sessions, assessments, goalProgress),
      summary: this.generateProgressSummary(sessions, assessmentProgress, goalProgress)
    };
  }

  /**
   * Gera relatório detalhado de sessão individual
   */
  generateSessionReport(session: SessionData, caseFormulation?: CaseFormulation): {
    sessionSummary: string;
    keyTopics: string[];
    emotionalState: {
      mood: number;
      anxiety: number;
      analysis: string;
    };
    interventionsUsed: string[];
    homework: string[];
    nextSessionPlan: string[];
    therapeuticProgress: string;
  } {
    const keyTopics = this.extractKeyTopics(session.messages);
    const interventionsUsed = this.identifyInterventions(session.messages, session.exercisesCompleted);
    const emotionalAnalysis = this.analyzeEmotionalState(session);
    
    return {
      sessionSummary: this.generateSessionSummary(session, keyTopics),
      keyTopics,
      emotionalState: {
        mood: session.mood,
        anxiety: session.anxiety,
        analysis: emotionalAnalysis
      },
      interventionsUsed,
      homework: this.generateHomework(keyTopics, interventionsUsed, caseFormulation),
      nextSessionPlan: this.generateNextSessionPlan(session, caseFormulation),
      therapeuticProgress: this.evaluateTherapeuticProgress(session, keyTopics)
    };
  }

  /**
   * Gera relatório compilado de avaliações
   */
  generateAssessmentReport(assessments: AssessmentResult[]): {
    overallTrend: 'Melhora' | 'Estável' | 'Piora';
    detailedAnalysis: Record<string, any>;
    recommendations: string[];
    riskFactors: string[];
    strengthsIdentified: string[];
  } {
    const trends = this.analyzeAssessmentTrends(assessments);
    const riskAssessment = this.performRiskAssessment(assessments);
    
    return {
      overallTrend: trends.overall,
      detailedAnalysis: trends.detailed,
      recommendations: this.generateAssessmentRecommendations(trends, riskAssessment),
      riskFactors: riskAssessment.risks,
      strengthsIdentified: riskAssessment.strengths
    };
  }

  /**
   * Gera dashboard analítico com métricas visuais
   */
  async generateAnalyticsDashboard(patientId: string, period: 'week' | 'month' | 'quarter'): Promise<{
    sessionMetrics: {
      frequency: number[];
      duration: number[];
      mood: number[];
      anxiety: number[];
    };
    exerciseCompletion: Record<string, number>;
    assessmentScores: Record<string, number[]>;
    goalProgress: Array<{ goal: string; progress: number; trend: string }>;
    insights: string[];
    alerts: Array<{ type: 'warning' | 'success' | 'info'; message: string }>;
  }> {
    const { MockDataService } = await import('./mock-data');
    const mockService = MockDataService.getInstance();
    return mockService.generateAnalyticsData(patientId, period);
  }

  // Métodos auxiliares privados

  private async getSessionsInPeriod(
    patientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<SessionData[]> {
    // Importar dinamicamente o serviço de dados mockados
    const { MockDataService } = await import('./mock-data');
    const mockService = MockDataService.getInstance();
    const allSessions = mockService.generateMockSessions(patientId);
    
    // Filtrar por período
    return allSessions.filter(session => 
      session.date >= startDate && session.date <= endDate
    );
  }

  private async getAssessmentsInPeriod(
    patientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AssessmentResult[]> {
    const { MockDataService } = await import('./mock-data');
    const mockService = MockDataService.getInstance();
    const allAssessments = mockService.generateMockAssessments(patientId);
    
    // Filtrar por período
    return allAssessments.filter(assessment => 
      assessment.date >= startDate && assessment.date <= endDate
    );
  }

  private async getCaseFormulation(patientId: string): Promise<CaseFormulation | undefined> {
    const { MockDataService } = await import('./mock-data');
    const mockService = MockDataService.getInstance();
    return mockService.generateMockCaseFormulation(patientId);
  }

  private countCompletedExercises(sessions: SessionData[]): number {
    return sessions.reduce((total, session) => total + session.exercisesCompleted.length, 0);
  }

  private analyzeAssessmentProgress(assessments: AssessmentResult[]) {
    if (assessments.length === 0) return { initial: [], current: [], improvement: {} };
    
    const sorted = assessments.sort((a, b) => a.date.getTime() - b.date.getTime());
    const initial = sorted.slice(0, Math.ceil(sorted.length * 0.3));
    const current = sorted.slice(-Math.ceil(sorted.length * 0.3));
    
    const improvement: Record<string, number> = {};
    
    // Calcular melhoria por tipo de avaliação
    const types = Array.from(new Set(assessments.map(a => a.type)));
    types.forEach(type => {
      const initialAvg = initial.filter(a => a.type === type).reduce((sum, a) => sum + a.score, 0) / 
                        initial.filter(a => a.type === type).length || 0;
      const currentAvg = current.filter(a => a.type === type).reduce((sum, a) => sum + a.score, 0) / 
                        current.filter(a => a.type === type).length || 0;
      improvement[type] = ((initialAvg - currentAvg) / initialAvg) * 100;
    });
    
    return { initial, current, improvement };
  }

  private analyzeGoalProgress(
    caseFormulation: CaseFormulation | undefined,
    sessions: SessionData[],
    assessments: AssessmentResult[]
  ) {
    if (!caseFormulation) return [];
    
    return caseFormulation.treatmentGoals.map(goal => ({
      goal,
      progress: Math.min(100, sessions.length * 10 + Math.random() * 30), // Placeholder
      status: 'Em Andamento' as const
    }));
  }

  private generateRecommendations(
    sessions: SessionData[],
    assessments: AssessmentResult[],
    goalProgress: any[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Baseado na frequência de sessões
    if (sessions.length < 4) {
      recommendations.push("Aumentar frequência de sessões para melhor continuidade terapêutica");
    }
    
    // Baseado no progresso das avaliações
    const latestAssessment = assessments.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    if (latestAssessment?.severity === 'Severo' || latestAssessment?.severity === 'Moderado-Severo') {
      recommendations.push("Considerar intensificação do tratamento ou avaliação para suporte adicional");
    }
    
    // Baseado no progresso dos objetivos
    const slowProgress = goalProgress.filter(g => g.progress < 30);
    if (slowProgress.length > goalProgress.length * 0.5) {
      recommendations.push("Revisar estratégias terapêuticas para objetivos com progresso mais lento");
    }
    
    return recommendations;
  }

  private generateProgressSummary(
    sessions: SessionData[],
    assessmentProgress: any,
    goalProgress: any[]
  ): string {
    const totalSessions = sessions.length;
    const improvements = Object.values(assessmentProgress.improvement) as number[];
    const avgImprovement = improvements.length > 0 ? 
                          improvements.reduce((a, b) => a + b, 0) / improvements.length : 0;
    const goalsOnTrack = goalProgress.filter(g => g.progress >= 50).length;
    
    return `Paciente completou ${totalSessions} sessões com melhoria média de ${avgImprovement.toFixed(1)}% nos scores de avaliação. ${goalsOnTrack} de ${goalProgress.length} objetivos terapêuticos estão progredindo adequadamente. O engajamento nas atividades propostas tem sido ${sessions.length > 8 ? 'consistente' : 'irregular'}.`;
  }

  private extractKeyTopics(messages: any[]): string[] {
    // Análise simples de tópicos baseada em palavras-chave
    const keywords = [
      'ansiedade', 'depressão', 'estresse', 'relacionamento', 'trabalho',
      'família', 'sono', 'autoestima', 'trauma', 'luto', 'fobia'
    ];
    
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    return keywords.filter(keyword => content.includes(keyword));
  }

  private identifyInterventions(messages: any[], exercisesCompleted: string[]): string[] {
    const interventions: string[] = [];
    
    // Baseado nos exercícios completados
    interventions.push(...exercisesCompleted);
    
    // Análise do conteúdo das mensagens
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    
    if (content.includes('respiração') || content.includes('respirar')) {
      interventions.push('Técnicas de Respiração');
    }
    if (content.includes('pensamento') || content.includes('cognição')) {
      interventions.push('Reestruturação Cognitiva');
    }
    if (content.includes('exposição')) {
      interventions.push('Terapia de Exposição');
    }
    
    return Array.from(new Set(interventions));
  }

  private analyzeEmotionalState(session: SessionData): string {
    const moodLevel = session.mood;
    const anxietyLevel = session.anxiety;
    
    let analysis = "";
    
    if (moodLevel <= 3) {
      analysis += "Humor significativamente rebaixado. ";
    } else if (moodLevel <= 6) {
      analysis += "Humor moderadamente baixo. ";
    } else {
      analysis += "Humor dentro do esperado. ";
    }
    
    if (anxietyLevel >= 8) {
      analysis += "Níveis elevados de ansiedade requerem atenção imediata.";
    } else if (anxietyLevel >= 6) {
      analysis += "Ansiedade moderada, continuar monitoramento.";
    } else {
      analysis += "Níveis de ansiedade controláveis.";
    }
    
    return analysis;
  }

  private generateSessionSummary(session: SessionData, keyTopics: string[]): string {
    const duration = session.duration;
    const topicsText = keyTopics.length > 0 ? keyTopics.join(', ') : 'questões gerais';
    
    return `Sessão de ${duration} minutos focada em ${topicsText}. Paciente demonstrou ${session.mood >= 6 ? 'boa' : 'limitada'} receptividade às intervenções propostas. ${session.exercisesCompleted.length} exercício(s) terapêutico(s) foi(foram) completado(s) durante a sessão.`;
  }

  private generateHomework(
    keyTopics: string[],
    interventionsUsed: string[],
    caseFormulation?: CaseFormulation
  ): string[] {
    const homework: string[] = [];
    
    // Baseado nos tópicos da sessão
    if (keyTopics.includes('ansiedade')) {
      homework.push("Praticar exercício de respiração diafragmática 2x ao dia");
      homework.push("Registro de situações que geram ansiedade");
    }
    
    if (keyTopics.includes('depressão')) {
      homework.push("Agenda de atividades prazerosas para a semana");
      homework.push("Diário de humor - 3 anotações por dia");
    }
    
    // Baseado nas intervenções utilizadas
    if (interventionsUsed.includes('Reestruturação Cognitiva')) {
      homework.push("Completar registro de pensamentos automáticos");
    }
    
    return homework;
  }

  private generateNextSessionPlan(
    session: SessionData,
    caseFormulation?: CaseFormulation
  ): string[] {
    const plan: string[] = [];
    
    plan.push("Revisar homework da sessão anterior");
    plan.push("Avaliar progresso dos objetivos terapêuticos");
    
    if (session.anxiety >= 7) {
      plan.push("Focar em técnicas de manejo da ansiedade");
    }
    
    if (session.mood <= 4) {
      plan.push("Trabalhar ativação comportamental");
    }
    
    plan.push("Introduzir nova técnica terapêutica se apropriado");
    
    return plan;
  }

  private evaluateTherapeuticProgress(session: SessionData, keyTopics: string[]): string {
    let progress = "O paciente ";
    
    if (session.exercisesCompleted.length > 0) {
      progress += "demonstrou engajamento ativo ";
    } else {
      progress += "mostrou resistência inicial ";
    }
    
    progress += "às intervenções propostas. ";
    
    if (session.mood >= 6 && session.anxiety <= 5) {
      progress += "Estado emocional estável favorece continuidade do tratamento.";
    } else if (session.mood < 4 || session.anxiety > 7) {
      progress += "Estado emocional requer atenção prioritária na próxima sessão.";
    } else {
      progress += "Progresso gradual dentro do esperado para esta fase do tratamento.";
    }
    
    return progress;
  }

  private analyzeAssessmentTrends(assessments: AssessmentResult[]) {
    if (assessments.length < 2) {
      return {
        overall: 'Estável' as const,
        detailed: {}
      };
    }
    
    const sorted = assessments.sort((a, b) => a.date.getTime() - b.date.getTime());
    const recent = sorted.slice(-3);
    const older = sorted.slice(0, 3);
    
    const recentAvg = recent.reduce((sum, a) => sum + a.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, a) => sum + a.score, 0) / older.length;
    
    let overall: 'Melhora' | 'Estável' | 'Piora';
    if (recentAvg < olderAvg * 0.85) {
      overall = 'Melhora';
    } else if (recentAvg > olderAvg * 1.15) {
      overall = 'Piora';
    } else {
      overall = 'Estável';
    }
    
    return {
      overall,
      detailed: {
        recentAverage: recentAvg,
        previousAverage: olderAvg,
        changePercentage: ((recentAvg - olderAvg) / olderAvg) * 100
      }
    };
  }

  private performRiskAssessment(assessments: AssessmentResult[]) {
    const risks: string[] = [];
    const strengths: string[] = [];
    
    const latestScores = assessments
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);
    
    latestScores.forEach(assessment => {
      if (assessment.severity === 'Severo') {
        risks.push(`Scores severos em ${assessment.type}`);
      } else if (assessment.severity === 'Minimal' || assessment.severity === 'Leve') {
        strengths.push(`Melhoria significativa em ${assessment.type}`);
      }
    });
    
    return { risks, strengths };
  }

  private generateAssessmentRecommendations(trends: any, riskAssessment: any): string[] {
    const recommendations: string[] = [];
    
    if (trends.overall === 'Piora') {
      recommendations.push("Revisar plano de tratamento e considerar intensificação");
      recommendations.push("Avaliação médica para possível suporte farmacológico");
    } else if (trends.overall === 'Melhora') {
      recommendations.push("Manter estratégias atuais que demonstraram eficácia");
      recommendations.push("Considerar espaçamento gradual das sessões");
    }
    
    if (riskAssessment.risks.length > 0) {
      recommendations.push("Implementar protocolo de segurança e monitoramento intensivo");
    }
    
    return recommendations;
  }

  /**
   * Exporta relatório para PDF (placeholder)
   */
  async exportToPDF(report: any, type: 'progress' | 'session' | 'assessment'): Promise<Blob> {
    // Implementação futura para exportação PDF
    throw new Error("Exportação PDF ainda não implementada");
  }

  /**
   * Salva relatório no sistema
   */
  async saveReport(report: any, type: string): Promise<string> {
    // Implementação futura para persistência
    return `report_${Date.now()}`;
  }
}

// Factory functions para facilitar o uso
export const createProgressReport = (patientId: string, startDate: Date, endDate: Date) => 
  ClinicalReportsService.getInstance().generateProgressReport(patientId, startDate, endDate);

export const createSessionReport = (session: SessionData, caseFormulation?: CaseFormulation) =>
  ClinicalReportsService.getInstance().generateSessionReport(session, caseFormulation);

export const createAssessmentReport = (assessments: AssessmentResult[]) =>
  ClinicalReportsService.getInstance().generateAssessmentReport(assessments);

export const createAnalyticsDashboard = (patientId: string, period: 'week' | 'month' | 'quarter') =>
  ClinicalReportsService.getInstance().generateAnalyticsDashboard(patientId, period);