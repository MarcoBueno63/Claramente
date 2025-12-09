/**
 * Serviço de Dados Mockados para Demonstração do Sistema de Relatórios
 * Este serviço simula dados reais para demonstrar as funcionalidades completas
 */

import { 
  SessionData, 
  AssessmentResult, 
  CaseFormulation, 
  ProgressReport 
} from './clinical-reports';

export class MockDataService {
  private static instance: MockDataService;

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  /**
   * Gera dados mockados de sessões para um paciente
   */
  generateMockSessions(patientId: string, count: number = 16): SessionData[] {
    const sessions: SessionData[] = [];
    const baseDate = new Date();

    for (let i = count; i >= 1; i--) {
      const sessionDate = new Date(baseDate);
      sessionDate.setDate(sessionDate.getDate() - (i * 3)); // Sessões a cada 3 dias

      const session: SessionData = {
        id: `session_${patientId}_${i}`,
        date: sessionDate,
        duration: 45 + Math.random() * 15, // 45-60 minutos
        messages: this.generateMockMessages(i),
        exercisesCompleted: this.generateMockExercises(i),
        mood: Math.max(1, Math.min(10, 4 + (count - i) * 0.3 + Math.random() * 2)), // Melhora gradual
        anxiety: Math.max(1, Math.min(10, 8 - (count - i) * 0.2 + Math.random() * 1.5)), // Redução gradual
        notes: this.generateSessionNotes(i),
        protocol: this.selectProtocol(i)
      };

      sessions.push(session);
    }

    return sessions;
  }

  /**
   * Gera dados mockados de avaliações
   */
  generateMockAssessments(patientId: string, count: number = 8): AssessmentResult[] {
    const assessments: AssessmentResult[] = [];
    const baseDate = new Date();

    // PHQ-9 (Depressão) - Melhora gradual de 15 para 6
    for (let i = count; i >= 1; i--) {
      const assessmentDate = new Date(baseDate);
      assessmentDate.setDate(assessmentDate.getDate() - (i * 14)); // A cada 2 semanas

      const phq9Score = Math.max(1, Math.round(15 - (count - i) * 1.2 + Math.random() * 2));
      
      assessments.push({
        id: `phq9_${patientId}_${i}`,
        type: 'PHQ-9',
        date: assessmentDate,
        score: phq9Score,
        maxScore: 27,
        interpretation: this.interpretPHQ9(phq9Score),
        severity: this.getSeverityPHQ9(phq9Score),
        responses: this.generatePHQ9Responses(phq9Score)
      });
    }

    // GAD-7 (Ansiedade) - Melhora mais lenta
    for (let i = count; i >= 1; i--) {
      const assessmentDate = new Date(baseDate);
      assessmentDate.setDate(assessmentDate.getDate() - (i * 14));

      const gad7Score = Math.max(0, Math.round(12 - (count - i) * 0.8 + Math.random() * 2));
      
      assessments.push({
        id: `gad7_${patientId}_${i}`,
        type: 'GAD-7',
        date: assessmentDate,
        score: gad7Score,
        maxScore: 21,
        interpretation: this.interpretGAD7(gad7Score),
        severity: this.getSeverityGAD7(gad7Score),
        responses: this.generateGAD7Responses(gad7Score)
      });
    }

    return assessments.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Gera formulação de caso mockada
   */
  generateMockCaseFormulation(patientId: string): CaseFormulation {
    return {
      id: `case_${patientId}`,
      patientId,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      precipitatingFactors: [
        'Mudança de emprego há 6 meses',
        'Término de relacionamento longo',
        'Dificuldades financeiras'
      ],
      perpetuatingFactors: [
        'Pensamentos autocríticos frequentes',
        'Isolamento social progressivo',
        'Evitação de situações desafiadoras',
        'Padrões perfeccionistas'
      ],
      protectiveFactors: [
        'Suporte familiar presente',
        'Histórico de resiliência prévia',
        'Motivação para mudança',
        'Habilidades cognitivas preservadas'
      ],
      vulnerabilityFactors: [
        'Histórico de ansiedade na infância',
        'Tendência ao pensamento catastrófico',
        'Baixa tolerância à incerteza'
      ],
      targetSymptoms: [
        'Ansiedade generalizada',
        'Humor deprimido',
        'Insônia inicial',
        'Fadiga e baixa energia',
        'Dificuldade de concentração'
      ],
      treatmentGoals: [
        'Reduzir sintomas ansiosos em 50%',
        'Melhorar qualidade do sono',
        'Aumentar atividades sociais',
        'Desenvolver estratégias de enfrentamento',
        'Retomar atividades profissionais plenas'
      ],
      recommendedInterventions: [
        'Terapia Cognitivo-Comportamental',
        'Técnicas de relaxamento e mindfulness',
        'Reestruturação cognitiva',
        'Exposição gradual',
        'Ativação comportamental'
      ]
    };
  }

  // Métodos auxiliares privados

  private generateMockMessages(sessionNumber: number): any[] {
    const messages = [
      {
        role: 'user' as const,
        content: `Como tem se sentido desde nossa última sessão?`,
        timestamp: new Date(Date.now() - sessionNumber * 60000)
      },
      {
        role: 'assistant' as const,
        content: this.generateTherapistResponse(sessionNumber),
        timestamp: new Date(Date.now() - sessionNumber * 60000 + 30000)
      }
    ];

    // Adicionar mais mensagens baseadas no progresso da sessão
    if (sessionNumber <= 8) { // Sessões mais recentes têm mais interação
      messages.push({
        role: 'user' as const,
        content: 'Pratiquei os exercícios de respiração como combinamos.',
        timestamp: new Date(Date.now() - sessionNumber * 60000 + 60000)
      });
    }

    return messages;
  }

  private generateTherapistResponse(sessionNumber: number): string {
    const responses = [
      'Vejo que você tem mostrado progresso consistente. Como avalia sua semana?',
      'Percebo uma melhoria no seu humor. Consegue identificar o que tem ajudado?',
      'Vamos trabalhar juntos algumas técnicas que podem ser úteis neste momento.',
      'É natural que alguns dias sejam mais desafiadores. Como podemos lidar com isso?',
      'Seu engajamento no tratamento tem sido notável. Continue assim!'
    ];

    return responses[sessionNumber % responses.length];
  }

  private generateMockExercises(sessionNumber: number): string[] {
    const allExercises = [
      'Respiração Diafragmática',
      'Reestruturação Cognitiva',
      'Relaxamento Progressivo',
      'Mindfulness',
      'Registro de Pensamentos',
      'Exposição Gradual',
      'Ativação Comportamental',
      'Técnica 5-4-3-2-1'
    ];

    // Mais exercícios nas sessões iniciais, menos nas finais
    const exerciseCount = sessionNumber > 12 ? 1 : sessionNumber > 8 ? 2 : 3;
    
    return allExercises
      .sort(() => Math.random() - 0.5)
      .slice(0, exerciseCount);
  }

  private generateSessionNotes(sessionNumber: number): string {
    const notes = [
      'Paciente demonstrou boa receptividade às técnicas apresentadas.',
      'Observada melhora significativa no humor desde a última sessão.',
      'Relatou maior facilidade para lidar com situações estressantes.',
      'Mantém adesão consistente aos exercícios propostos.',
      'Expressou sentimentos de esperança em relação ao futuro.'
    ];

    return notes[sessionNumber % notes.length];
  }

  private selectProtocol(sessionNumber: number): string {
    const protocols = ['TCC para Ansiedade', 'TCC para Depressão', 'Mindfulness-Based', 'Exposição Graduada'];
    
    // Protocolo baseado na fase do tratamento
    if (sessionNumber <= 4) return 'TCC para Ansiedade';
    if (sessionNumber <= 8) return 'TCC para Depressão';
    if (sessionNumber <= 12) return 'Exposição Graduada';
    return 'Mindfulness-Based';
  }

  private interpretPHQ9(score: number): string {
    if (score <= 4) return 'Sintomas mínimos de depressão';
    if (score <= 9) return 'Sintomas leves de depressão';
    if (score <= 14) return 'Sintomas moderados de depressão';
    if (score <= 19) return 'Sintomas moderados a severos';
    return 'Sintomas severos de depressão';
  }

  private getSeverityPHQ9(score: number): 'Minimal' | 'Leve' | 'Moderado' | 'Moderado-Severo' | 'Severo' {
    if (score <= 4) return 'Minimal';
    if (score <= 9) return 'Leve';
    if (score <= 14) return 'Moderado';
    if (score <= 19) return 'Moderado-Severo';
    return 'Severo';
  }

  private generatePHQ9Responses(score: number): Record<string, number> {
    // Simular respostas baseadas no score total
    const avgResponse = Math.round(score / 9);
    const responses: Record<string, number> = {};
    
    for (let i = 1; i <= 9; i++) {
      responses[`q${i}`] = Math.max(0, Math.min(3, avgResponse + Math.round(Math.random() * 2 - 1)));
    }
    
    return responses;
  }

  private interpretGAD7(score: number): string {
    if (score <= 4) return 'Ansiedade mínima';
    if (score <= 9) return 'Ansiedade leve';
    if (score <= 14) return 'Ansiedade moderada';
    return 'Ansiedade severa';
  }

  private getSeverityGAD7(score: number): 'Minimal' | 'Leve' | 'Moderado' | 'Moderado-Severo' | 'Severo' {
    if (score <= 4) return 'Minimal';
    if (score <= 9) return 'Leve';
    if (score <= 14) return 'Moderado';
    return 'Severo';
  }

  private generateGAD7Responses(score: number): Record<string, number> {
    const avgResponse = Math.round(score / 7);
    const responses: Record<string, number> = {};
    
    for (let i = 1; i <= 7; i++) {
      responses[`q${i}`] = Math.max(0, Math.min(3, avgResponse + Math.round(Math.random() * 2 - 1)));
    }
    
    return responses;
  }

  /**
   * Gera métricas para o dashboard analítico
   */
  generateAnalyticsData(patientId: string, period: 'week' | 'month' | 'quarter') {
    const sessions = this.generateMockSessions(patientId);
    const assessments = this.generateMockAssessments(patientId);

    return {
      sessionMetrics: {
        frequency: sessions.map(() => Math.round(Math.random() * 3 + 1)), // 1-4 por semana
        duration: sessions.map(s => s.duration),
        mood: sessions.map(s => s.mood),
        anxiety: sessions.map(s => s.anxiety)
      },
      exerciseCompletion: {
        'Respiração Diafragmática': Math.round(Math.random() * 20 + 15),
        'Reestruturação Cognitiva': Math.round(Math.random() * 15 + 10),
        'Relaxamento Progressivo': Math.round(Math.random() * 12 + 8),
        'Mindfulness': Math.round(Math.random() * 10 + 5),
        'Exposição Gradual': Math.round(Math.random() * 8 + 3)
      },
      assessmentScores: {
        'PHQ-9': assessments.filter(a => a.type === 'PHQ-9').map(a => a.score),
        'GAD-7': assessments.filter(a => a.type === 'GAD-7').map(a => a.score)
      },
      goalProgress: [
        { goal: 'Reduzir ansiedade', progress: 75, trend: 'improving' },
        { goal: 'Melhorar humor', progress: 82, trend: 'improving' },
        { goal: 'Aumentar atividades sociais', progress: 60, trend: 'stable' },
        { goal: 'Técnicas de enfrentamento', progress: 90, trend: 'improving' },
        { goal: 'Qualidade do sono', progress: 45, trend: 'needs_attention' }
      ],
      insights: [
        'Maior engajamento observado nas sessões matutinas',
        'Exercícios de respiração mostram 85% de eficácia relatada',
        'Padrão consistente de melhora há 4 semanas consecutivas',
        'Correlação positiva entre exercícios e melhora do humor'
      ],
      alerts: [
        {
          type: 'success' as const,
          message: 'Excelente progresso nos últimos 15 dias - manter estratégias atuais'
        },
        {
          type: 'info' as const,
          message: 'Considerar introdução de técnicas avançadas de mindfulness'
        },
        {
          type: 'warning' as const,
          message: 'Monitorar qualidade do sono - possível área de intervenção'
        }
      ]
    };
  }
}

// Função utilitária para integrar com o serviço de relatórios
export const getMockDataForReports = (patientId: string) => {
  const mockService = MockDataService.getInstance();
  
  return {
    sessions: mockService.generateMockSessions(patientId),
    assessments: mockService.generateMockAssessments(patientId),
    caseFormulation: mockService.generateMockCaseFormulation(patientId),
    analytics: mockService.generateAnalyticsData(patientId, 'month')
  };
};