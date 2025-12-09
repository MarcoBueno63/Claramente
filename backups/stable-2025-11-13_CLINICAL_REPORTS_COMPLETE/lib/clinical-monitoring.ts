// lib/clinical-monitoring.ts - Sistema de Monitoramento Clínico
// Tracking completo de sintomas, humor e progresso terapêutico com escalas padronizadas

export interface ClinicalScale {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: 'depression' | 'anxiety' | 'general' | 'trauma' | 'mood' | 'custom';
  questions: ScaleQuestion[];
  scoring: ScaleScoring;
  interpretationRanges: InterpretationRange[];
  administrationFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
  estimatedDuration: number; // em minutos
  validatedPopulation: string[];
  clinicalUtility: string;
}

export interface ScaleQuestion {
  id: string;
  text: string;
  type: 'likert' | 'multiple_choice' | 'binary' | 'slider';
  options: string[];
  scores: number[];
  reversed?: boolean; // Para itens com pontuação reversa
  required: boolean;
  helpText?: string;
}

export interface ScaleScoring {
  method: 'sum' | 'average' | 'weighted' | 'complex';
  minScore: number;
  maxScore: number;
  subscales?: Subscale[];
  formula?: string; // Para cálculos complexos
}

export interface Subscale {
  name: string;
  questionIds: string[];
  interpretation: string;
}

export interface InterpretationRange {
  minScore: number;
  maxScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe' | 'very_severe';
  label: string;
  description: string;
  recommendations: string[];
  alertLevel: 'none' | 'watch' | 'concern' | 'urgent';
}

export interface AssessmentResponse {
  userId: string;
  scaleId: string;
  sessionId?: string;
  completedAt: Date;
  responses: Record<string, number>;
  totalScore: number;
  subscaleScores?: Record<string, number>;
  severity: string;
  interpretation: InterpretationRange;
  timeToComplete: number; // em segundos
  context?: 'baseline' | 'progress' | 'follow_up' | 'crisis';
  notes?: string;
}

export interface MoodEntry {
  userId: string;
  date: Date;
  overallMood: number; // 1-10
  anxiety: number; // 1-10
  depression: number; // 1-10
  energy: number; // 1-10
  sleep: number; // 1-10
  socialConnection: number; // 1-10
  tags: string[]; // Ex: ['trabalho', 'família', 'exercício']
  notes?: string;
  location?: string;
  weather?: string;
  activities?: string[];
  triggers?: string[];
  copingStrategies?: string[];
}

export interface SymptomTracker {
  userId: string;
  date: Date;
  symptoms: SymptomEntry[];
  functionalImpairment: number; // 0-10
  medicationAdherence?: number; // 0-100%
  exerciseCompleted?: string[]; // IDs dos exercícios feitos
  sessionAttended?: boolean;
  crisisRisk?: number; // 0-10
}

export interface SymptomEntry {
  name: string;
  severity: number; // 0-10
  frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  duration: number; // em minutos ou horas
  impact: number; // 0-10 impacto na vida diária
  triggers?: string[];
  reliefStrategies?: string[];
}

export interface ProgressMetrics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  assessmentScores: {
    scaleId: string;
    baseline?: number;
    current: number;
    change: number;
    percentChange: number;
    trend: 'improving' | 'stable' | 'worsening';
  }[];
  moodTrends: {
    overallMood: TrendData;
    anxiety: TrendData;
    depression: TrendData;
    energy: TrendData;
  };
  functionalImpairment: TrendData;
  exerciseEngagement: {
    totalCompleted: number;
    averageHelpfulness: number;
    favoriteTypes: string[];
    completionRate: number; // %
  };
  sessionAttendance: {
    scheduled: number;
    attended: number;
    rate: number; // %
  };
  riskFactors: {
    currentLevel: 'low' | 'moderate' | 'high';
    triggers: string[];
    protectiveFactors: string[];
  };
}

export interface TrendData {
  current: number;
  average: number;
  trend: 'improving' | 'stable' | 'worsening';
  changeRate: number; // mudança por período
  volatility: number; // variabilidade dos dados
}

class ClinicalMonitoringService {
  private scales: ClinicalScale[] = [
    // PHQ-9 - Patient Health Questionnaire
    {
      id: 'phq_9',
      name: 'Questionário de Saúde do Paciente - 9',
      shortName: 'PHQ-9',
      description: 'Escala validada para triagem e monitoramento de depressão',
      category: 'depression',
      estimatedDuration: 5,
      administrationFrequency: 'weekly',
      validatedPopulation: ['adultos', 'adolescentes'],
      clinicalUtility: 'Triagem, diagnóstico e monitoramento de episódio depressivo maior',
      questions: [
        {
          id: 'phq9_1',
          text: 'Pouco interesse ou prazer em fazer as coisas',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true,
          helpText: 'Pense nas últimas 2 semanas'
        },
        {
          id: 'phq9_2',
          text: 'Se sentir desanimado(a), deprimido(a) ou sem esperança',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'phq9_3',
          text: 'Dificuldade para pegar no sono, continuar dormindo ou dormir demais',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'phq9_4',
          text: 'Se sentir cansado(a) ou com pouca energia',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'phq9_5',
          text: 'Falta de apetite ou comer demais',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'phq9_6',
          text: 'Se sentir mal consigo mesmo(a) ou achar que é um fracasso ou que decepcionou sua família',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'phq9_7',
          text: 'Dificuldade de concentração nas coisas, como ler jornal ou ver televisão',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'phq9_8',
          text: 'Lentidão para se mover ou falar (a ponto de outras pessoas perceberem) ou agitação (inquieto(a), incapaz de ficar parado(a))',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'phq9_9',
          text: 'Pensamentos de que seria melhor estar morto(a) ou se ferir de alguma forma',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true,
          helpText: 'Esta pergunta é importante para sua segurança'
        }
      ],
      scoring: {
        method: 'sum',
        minScore: 0,
        maxScore: 27
      },
      interpretationRanges: [
        {
          minScore: 0,
          maxScore: 4,
          severity: 'minimal',
          label: 'Mínima',
          description: 'Sintomas depressivos mínimos ou ausentes',
          recommendations: ['Manter hábitos saudáveis', 'Monitoramento preventivo'],
          alertLevel: 'none'
        },
        {
          minScore: 5,
          maxScore: 9,
          severity: 'mild',
          label: 'Leve',
          description: 'Sintomas depressivos leves',
          recommendations: ['Exercícios de autoajuda', 'Monitoramento regular', 'Considerar apoio psicológico'],
          alertLevel: 'watch'
        },
        {
          minScore: 10,
          maxScore: 14,
          severity: 'moderate',
          label: 'Moderada',
          description: 'Sintomas depressivos moderados',
          recommendations: ['Buscar acompanhamento psicológico', 'Considerar tratamento medicamentoso', 'Aumentar frequência de monitoramento'],
          alertLevel: 'concern'
        },
        {
          minScore: 15,
          maxScore: 19,
          severity: 'severe',
          label: 'Moderadamente Severa',
          description: 'Sintomas depressivos moderadamente severos',
          recommendations: ['Acompanhamento psicológico urgente', 'Avaliação psiquiátrica', 'Considerar tratamento intensivo'],
          alertLevel: 'concern'
        },
        {
          minScore: 20,
          maxScore: 27,
          severity: 'very_severe',
          label: 'Severa',
          description: 'Sintomas depressivos severos',
          recommendations: ['Intervenção imediata', 'Acompanhamento psiquiátrico urgente', 'Considerar hospitalização se necessário'],
          alertLevel: 'urgent'
        }
      ]
    },

    // GAD-7 - Generalized Anxiety Disorder Scale
    {
      id: 'gad_7',
      name: 'Escala de Ansiedade Generalizada - 7',
      shortName: 'GAD-7',
      description: 'Escala para triagem e avaliação da severidade da ansiedade generalizada',
      category: 'anxiety',
      estimatedDuration: 3,
      administrationFrequency: 'weekly',
      validatedPopulation: ['adultos', 'adolescentes'],
      clinicalUtility: 'Triagem e monitoramento de transtorno de ansiedade generalizada',
      questions: [
        {
          id: 'gad7_1',
          text: 'Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true,
          helpText: 'Nas últimas 2 semanas, com que frequência você foi incomodado(a) pelos problemas abaixo?'
        },
        {
          id: 'gad7_2',
          text: 'Não conseguir parar de se preocupar ou controlar a preocupação',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'gad7_3',
          text: 'Preocupar-se muito com coisas diferentes',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'gad7_4',
          text: 'Dificuldade para relaxar',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'gad7_5',
          text: 'Ficar tão agitado(a) que se torna difícil permanecer sentado(a)',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'gad7_6',
          text: 'Ficar facilmente aborrecido(a) ou irritado(a)',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        },
        {
          id: 'gad7_7',
          text: 'Sentir medo como se algo terrível fosse acontecer',
          type: 'likert',
          options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
          scores: [0, 1, 2, 3],
          required: true
        }
      ],
      scoring: {
        method: 'sum',
        minScore: 0,
        maxScore: 21
      },
      interpretationRanges: [
        {
          minScore: 0,
          maxScore: 4,
          severity: 'minimal',
          label: 'Mínima',
          description: 'Ansiedade mínima',
          recommendations: ['Técnicas de relaxamento preventivas'],
          alertLevel: 'none'
        },
        {
          minScore: 5,
          maxScore: 9,
          severity: 'mild',
          label: 'Leve',
          description: 'Ansiedade leve',
          recommendations: ['Exercícios de respiração', 'Técnicas de mindfulness', 'Monitoramento regular'],
          alertLevel: 'watch'
        },
        {
          minScore: 10,
          maxScore: 14,
          severity: 'moderate',
          label: 'Moderada',
          description: 'Ansiedade moderada',
          recommendations: ['Buscar acompanhamento psicológico', 'Técnicas de TCC', 'Considerar medicação'],
          alertLevel: 'concern'
        },
        {
          minScore: 15,
          maxScore: 21,
          severity: 'severe',
          label: 'Severa',
          description: 'Ansiedade severa',
          recommendations: ['Acompanhamento imediato', 'Avaliação psiquiátrica', 'Tratamento intensivo'],
          alertLevel: 'urgent'
        }
      ]
    },

    // Escala de Humor Diário (personalizada)
    {
      id: 'daily_mood',
      name: 'Registro de Humor Diário',
      shortName: 'Humor',
      description: 'Monitoramento diário do estado de humor e bem-estar',
      category: 'mood',
      estimatedDuration: 2,
      administrationFrequency: 'daily',
      validatedPopulation: ['todos'],
      clinicalUtility: 'Tracking longitudinal de humor e identificação de padrões',
      questions: [
        {
          id: 'mood_overall',
          text: 'Como você avalia seu humor geral hoje?',
          type: 'slider',
          options: ['1 - Muito baixo', '2', '3', '4', '5 - Neutro', '6', '7', '8', '9', '10 - Excelente'],
          scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          required: true
        },
        {
          id: 'mood_anxiety',
          text: 'Nível de ansiedade hoje',
          type: 'slider',
          options: ['1 - Muito calmo', '2', '3', '4', '5 - Moderado', '6', '7', '8', '9', '10 - Muito ansioso'],
          scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          required: true
        },
        {
          id: 'mood_energy',
          text: 'Nível de energia hoje',
          type: 'slider',
          options: ['1 - Sem energia', '2', '3', '4', '5 - Moderado', '6', '7', '8', '9', '10 - Muito energético'],
          scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          required: true
        },
        {
          id: 'mood_sleep',
          text: 'Qualidade do sono (noite anterior)',
          type: 'slider',
          options: ['1 - Muito ruim', '2', '3', '4', '5 - Razoável', '6', '7', '8', '9', '10 - Excelente'],
          scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          required: true
        },
        {
          id: 'mood_social',
          text: 'Conexão social hoje',
          type: 'slider',
          options: ['1 - Muito isolado', '2', '3', '4', '5 - Moderado', '6', '7', '8', '9', '10 - Muito conectado'],
          scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          required: true
        }
      ],
      scoring: {
        method: 'average',
        minScore: 1,
        maxScore: 10,
        subscales: [
          { name: 'Bem-estar Geral', questionIds: ['mood_overall'], interpretation: 'Humor geral percebido' },
          { name: 'Ansiedade', questionIds: ['mood_anxiety'], interpretation: 'Nível de ansiedade diária' },
          { name: 'Energia', questionIds: ['mood_energy'], interpretation: 'Vitalidade e motivação' },
          { name: 'Sono', questionIds: ['mood_sleep'], interpretation: 'Qualidade do descanso' },
          { name: 'Social', questionIds: ['mood_social'], interpretation: 'Conexão interpessoal' }
        ]
      },
      interpretationRanges: [
        {
          minScore: 1,
          maxScore: 3,
          severity: 'severe',
          label: 'Baixo',
          description: 'Humor significativamente baixo',
          recommendations: ['Atenção especial necessária', 'Considerar intervenção'],
          alertLevel: 'concern'
        },
        {
          minScore: 4,
          maxScore: 6,
          severity: 'moderate',
          label: 'Moderado',
          description: 'Humor abaixo do ideal',
          recommendations: ['Técnicas de autoajuda', 'Monitoramento próximo'],
          alertLevel: 'watch'
        },
        {
          minScore: 7,
          maxScore: 10,
          severity: 'mild',
          label: 'Bom',
          description: 'Humor adequado',
          recommendations: ['Manter estratégias atuais'],
          alertLevel: 'none'
        }
      ]
    }
  ];

  // Obter escala por ID
  getScale(scaleId: string): ClinicalScale | undefined {
    return this.scales.find(scale => scale.id === scaleId);
  }

  // Obter escalas por categoria
  getScalesByCategory(category: string): ClinicalScale[] {
    return this.scales.filter(scale => scale.category === category);
  }

  // Calcular pontuação de uma avaliação
  calculateScore(scaleId: string, responses: Record<string, number>): {
    totalScore: number;
    subscaleScores: Record<string, number>;
    interpretation: InterpretationRange;
  } {
    const scale = this.getScale(scaleId);
    if (!scale) throw new Error(`Escala ${scaleId} não encontrada`);

    let totalScore = 0;
    const subscaleScores: Record<string, number> = {};

    // Calcular pontuação total
    if (scale.scoring.method === 'sum') {
      scale.questions.forEach(question => {
        const response = responses[question.id];
        if (response !== undefined) {
          totalScore += question.reversed ? 
            (question.scores[question.scores.length - 1] - response + question.scores[0]) : 
            response;
        }
      });
    } else if (scale.scoring.method === 'average') {
      let sum = 0;
      let count = 0;
      scale.questions.forEach(question => {
        const response = responses[question.id];
        if (response !== undefined) {
          sum += response;
          count++;
        }
      });
      totalScore = count > 0 ? sum / count : 0;
    }

    // Calcular pontuações das subescalas
    if (scale.scoring.subscales) {
      scale.scoring.subscales.forEach(subscale => {
        let subscaleSum = 0;
        let subscaleCount = 0;
        subscale.questionIds.forEach(questionId => {
          const response = responses[questionId];
          if (response !== undefined) {
            subscaleSum += response;
            subscaleCount++;
          }
        });
        subscaleScores[subscale.name] = subscaleCount > 0 ? subscaleSum / subscaleCount : 0;
      });
    }

    // Encontrar interpretação
    const interpretation = scale.interpretationRanges.find(range => 
      totalScore >= range.minScore && totalScore <= range.maxScore
    ) || scale.interpretationRanges[0];

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      subscaleScores,
      interpretation
    };
  }

  // Salvar resposta de avaliação
  saveAssessmentResponse(response: AssessmentResponse): void {
    const key = `assessment_${response.userId}_${response.scaleId}_${response.completedAt.getTime()}`;
    localStorage.setItem(key, JSON.stringify({
      ...response,
      completedAt: response.completedAt.toISOString()
    }));
  }

  // Obter histórico de avaliações
  getAssessmentHistory(userId: string, scaleId?: string): AssessmentResponse[] {
    const responses: AssessmentResponse[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`assessment_${userId}_`) && 
          (!scaleId || key.includes(`_${scaleId}_`))) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          data.completedAt = new Date(data.completedAt);
          responses.push(data);
        } catch (error) {
          console.error('Erro ao carregar resposta de avaliação:', error);
        }
      }
    }
    
    return responses.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  // Salvar entrada de humor
  saveMoodEntry(entry: MoodEntry): void {
    const dateKey = entry.date.toISOString().split('T')[0];
    const key = `mood_${entry.userId}_${dateKey}`;
    localStorage.setItem(key, JSON.stringify({
      ...entry,
      date: entry.date.toISOString()
    }));
  }

  // Obter entradas de humor
  getMoodEntries(userId: string, days: number = 30): MoodEntry[] {
    const entries: MoodEntry[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`mood_${userId}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          data.date = new Date(data.date);
          if (data.date >= cutoffDate) {
            entries.push(data);
          }
        } catch (error) {
          console.error('Erro ao carregar entrada de humor:', error);
        }
      }
    }
    
    return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Calcular métricas de progresso
  calculateProgressMetrics(userId: string, days: number = 30): ProgressMetrics {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const assessmentHistory = this.getAssessmentHistory(userId);
    const moodEntries = this.getMoodEntries(userId, days);

    // Calcular tendências de escalas
    const assessmentScores = this.scales.map(scale => {
      const scaleResponses = assessmentHistory.filter(r => r.scaleId === scale.id);
      if (scaleResponses.length === 0) return null;

      const recent = scaleResponses[0];
      const baseline = scaleResponses[scaleResponses.length - 1];
      const change = recent.totalScore - (baseline ? baseline.totalScore : recent.totalScore);
      const percentChange = baseline ? (change / baseline.totalScore) * 100 : 0;

      return {
        scaleId: scale.id,
        baseline: baseline ? baseline.totalScore : undefined,
        current: recent.totalScore,
        change,
        percentChange,
        trend: change > 2 ? 'worsening' : change < -2 ? 'improving' : 'stable' as 'improving' | 'stable' | 'worsening'
      };
    }).filter(Boolean) as any[];

    // Calcular tendências de humor
    const moodTrends = {
      overallMood: this.calculateTrendData(moodEntries.map(e => e.overallMood)),
      anxiety: this.calculateTrendData(moodEntries.map(e => e.anxiety)),
      depression: this.calculateTrendData(moodEntries.map(e => e.depression)),
      energy: this.calculateTrendData(moodEntries.map(e => e.energy))
    };

    return {
      userId,
      period: { start: startDate, end: endDate },
      assessmentScores,
      moodTrends,
      functionalImpairment: { current: 0, average: 0, trend: 'stable', changeRate: 0, volatility: 0 },
      exerciseEngagement: {
        totalCompleted: 0,
        averageHelpfulness: 0,
        favoriteTypes: [],
        completionRate: 0
      },
      sessionAttendance: {
        scheduled: 0,
        attended: 0,
        rate: 0
      },
      riskFactors: {
        currentLevel: 'low',
        triggers: [],
        protectiveFactors: []
      }
    };
  }

  private calculateTrendData(values: number[]): TrendData {
    if (values.length === 0) {
      return { current: 0, average: 0, trend: 'stable', changeRate: 0, volatility: 0 };
    }

    const current = values[0] || 0;
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calcular tendência (comparar primeira metade com segunda metade)
    const midpoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midpoint);
    const secondHalf = values.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const changeRate = firstAvg - secondAvg;
    const trend = changeRate > 0.5 ? 'improving' : changeRate < -0.5 ? 'worsening' : 'stable';
    
    // Calcular volatilidade (desvio padrão)
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const volatility = Math.sqrt(variance);

    return {
      current: Math.round(current * 100) / 100,
      average: Math.round(average * 100) / 100,
      trend,
      changeRate: Math.round(changeRate * 100) / 100,
      volatility: Math.round(volatility * 100) / 100
    };
  }

  // Detectar alertas baseados nas últimas avaliações
  detectAlerts(userId: string): {
    level: 'none' | 'watch' | 'concern' | 'urgent';
    alerts: string[];
    recommendations: string[];
  } {
    const recentAssessments = this.getAssessmentHistory(userId).slice(0, 5);
    const alerts: string[] = [];
    const recommendations: string[] = [];
    let maxAlertLevel: 'none' | 'watch' | 'concern' | 'urgent' = 'none';

    recentAssessments.forEach(assessment => {
      if (assessment.interpretation.alertLevel !== 'none') {
        alerts.push(`${this.getScale(assessment.scaleId)?.shortName}: ${assessment.interpretation.label}`);
        recommendations.push(...assessment.interpretation.recommendations);
        
        if (assessment.interpretation.alertLevel === 'urgent') maxAlertLevel = 'urgent';
        else if (assessment.interpretation.alertLevel === 'concern' && maxAlertLevel !== 'urgent') maxAlertLevel = 'concern';
        else if (assessment.interpretation.alertLevel === 'watch' && !['urgent', 'concern'].includes(maxAlertLevel)) maxAlertLevel = 'watch';
      }
    });

    return {
      level: maxAlertLevel,
      alerts: [...new Set(alerts)],
      recommendations: [...new Set(recommendations)]
    };
  }
}

export const clinicalMonitoringService = new ClinicalMonitoringService();