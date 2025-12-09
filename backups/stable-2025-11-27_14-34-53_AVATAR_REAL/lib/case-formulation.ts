// lib/case-formulation.ts - Sistema de Formulação de Caso Terapêutico
// Assessment estruturado e personalização baseada em formulação clínica

export interface CaseFormulation {
  // Identificação e contexto
  userId: string;
  sessionId: string;
  createdAt: Date;
  lastUpdated: Date;
  
  // Problemas apresentados
  presentingProblems: {
    primary: string[];
    secondary: string[];
    severity: number; // 1-10
    duration: string;
    impactAreas: ('work' | 'relationships' | 'social' | 'physical' | 'emotional')[];
  };
  
  // Fatores predisponentes (vulnerabilidades)
  predisposingFactors: {
    biological: {
      genetics: string[];
      medical: string[];
      developmental: string[];
    };
    psychological: {
      personality: string[];
      cognitive_patterns: string[];
      emotional_patterns: string[];
      past_trauma: string[];
    };
    social: {
      family_history: string[];
      early_relationships: string[];
      cultural_factors: string[];
      socioeconomic: string[];
    };
  };
  
  // Eventos precipitantes (triggers)
  precipitatingEvents: {
    recent_events: string[];
    life_changes: string[];
    losses: string[];
    stressors: string[];
    timeline: string;
  };
  
  // Fatores perpetuadores (que mantém o problema)
  perpetuatingFactors: {
    cognitive: {
      automatic_thoughts: string[];
      cognitive_distortions: string[];
      core_beliefs: string[];
      assumptions: string[];
    };
    behavioral: {
      avoidance_patterns: string[];
      safety_behaviors: string[];
      maladaptive_coping: string[];
      behavioral_cycles: string[];
    };
    environmental: {
      social_reinforcement: string[];
      environmental_triggers: string[];
      interpersonal_patterns: string[];
      system_factors: string[];
    };
    physiological: {
      sleep_patterns: string[];
      appetite_changes: string[];
      energy_levels: string[];
      physical_symptoms: string[];
    };
  };
  
  // Fatores protetivos (forças e recursos)
  protectiveFactors: {
    personal: string[];
    social: string[];
    environmental: string[];
    skills: string[];
  };
  
  // Alvos de tratamento
  treatmentTargets: {
    primary: {
      target: string;
      measurable_outcome: string;
      timeline: string;
      intervention_approach: string;
    }[];
    secondary: {
      target: string;
      measurable_outcome: string;
      timeline: string;
      intervention_approach: string;
    }[];
  };
  
  // Plano de intervenção estruturado
  interventionPlan: {
    phase1: {
      focus: string;
      techniques: string[];
      duration: string;
      goals: string[];
    };
    phase2: {
      focus: string;
      techniques: string[];
      duration: string;
      goals: string[];
    };
    phase3: {
      focus: string;
      techniques: string[];
      duration: string;
      goals: string[];
    };
  };
  
  // Prognóstico e fatores de risco
  prognosis: {
    overall_outlook: 'excellent' | 'good' | 'fair' | 'poor';
    risk_factors: string[];
    protective_factors: string[];
    estimated_treatment_duration: string;
  };
}

export interface AssessmentQuestion {
  id: string;
  category: 'presenting' | 'history' | 'cognitive' | 'behavioral' | 'social' | 'strengths';
  question: string;
  type: 'open' | 'scale' | 'multiple_choice' | 'checklist';
  options?: string[];
  scale?: {
    min: number;
    max: number;
    labels: string[];
  };
  follow_up?: string[];
  clinical_significance: 'high' | 'medium' | 'low';
}

export interface TherapeuticHypothesis {
  id: string;
  hypothesis: string;
  supporting_evidence: string[];
  contradicting_evidence: string[];
  confidence_level: number; // 1-10
  implications_for_treatment: string[];
  tests_to_validate: string[];
}

class CaseFormulationService {
  
  // Perguntas de assessment estruturado
  private getAssessmentQuestions(): AssessmentQuestion[] {
    return [
      // Problemas apresentados
      {
        id: 'presenting_primary',
        category: 'presenting',
        question: 'Qual é o principal problema que te trouxe aqui hoje? O que mais te incomoda?',
        type: 'open',
        clinical_significance: 'high',
        follow_up: [
          'Há quanto tempo isso vem acontecendo?',
          'Como isso afeta sua vida no dia a dia?',
          'O que você já tentou fazer para melhorar?'
        ]
      },
      
      {
        id: 'severity_impact',
        category: 'presenting',
        question: 'Em uma escala de 1 a 10, qual o nível de sofrimento que isso causa?',
        type: 'scale',
        scale: {
          min: 1,
          max: 10,
          labels: ['Nenhum', 'Leve', 'Moderado', 'Intenso', 'Insuportável']
        },
        clinical_significance: 'high'
      },
      
      // Padrões cognitivos
      {
        id: 'automatic_thoughts',
        category: 'cognitive',
        question: 'Quando você se sente assim, quais pensamentos passam pela sua cabeça?',
        type: 'open',
        clinical_significance: 'high',
        follow_up: [
          'Esses pensamentos parecem verdadeiros no momento?',
          'Você consegue pensar em evidências que apoiam ou contradizem esses pensamentos?'
        ]
      },
      
      {
        id: 'cognitive_distortions',
        category: 'cognitive',
        question: 'Você reconhece algum destes padrões de pensamento em si mesmo?',
        type: 'checklist',
        options: [
          'Tudo ou nada (pensar em extremos)',
          'Catastrofização (imaginar o pior)',
          'Leitura mental (achar que sabe o que outros pensam)',
          'Personalização (se culpar por tudo)',
          'Filtro negativo (focar apenas no negativo)',
          'Desqualificar o positivo',
          'Conclusões precipitadas',
          'Rotulação (se chamar de nomes)'
        ],
        clinical_significance: 'high'
      },
      
      // Padrões comportamentais
      {
        id: 'avoidance_patterns',
        category: 'behavioral',
        question: 'Existe alguma coisa que você evita fazer por causa desses sentimentos?',
        type: 'open',
        clinical_significance: 'high',
        follow_up: [
          'Como essa evitação afeta sua vida?',
          'O que você faz em vez disso?'
        ]
      },
      
      {
        id: 'coping_strategies',
        category: 'behavioral', 
        question: 'Como você geralmente tenta lidar com esses sentimentos difíceis?',
        type: 'checklist',
        options: [
          'Evito situações que me deixam ansioso',
          'Busco reasseguramento de outros',
          'Fico ruminando sobre o problema',
          'Uso álcool ou substâncias para relaxar',
          'Me isolo das pessoas',
          'Fico muito ocupado para não pensar',
          'Exercito-me ou faço atividades físicas',
          'Converso com amigos ou família',
          'Pratico técnicas de relaxamento',
          'Busco ajuda profissional'
        ],
        clinical_significance: 'medium'
      },
      
      // História e fatores predisponentes
      {
        id: 'family_history',
        category: 'history',
        question: 'Alguém na sua família já passou por problemas parecidos (depressão, ansiedade, etc.)?',
        type: 'open',
        clinical_significance: 'medium'
      },
      
      {
        id: 'early_experiences',
        category: 'history',
        question: 'Houve algum evento marcante na sua infância ou adolescência que pode ter influenciado como você vê o mundo hoje?',
        type: 'open',
        clinical_significance: 'high',
        follow_up: [
          'Como isso afetou você na época?',
          'Você vê conexões entre isso e seus problemas atuais?'
        ]
      },
      
      // Fatores precipitantes
      {
        id: 'recent_triggers',
        category: 'presenting',
        question: 'Você consegue identificar algo específico que aconteceu recentemente e que pode ter piorado seus sintomas?',
        type: 'open',
        clinical_significance: 'high'
      },
      
      // Forças e recursos
      {
        id: 'strengths_resources',
        category: 'strengths',
        question: 'Quais são suas principais qualidades e recursos que te ajudam a enfrentar dificuldades?',
        type: 'open',
        clinical_significance: 'medium'
      },
      
      {
        id: 'support_system',
        category: 'social',
        question: 'Quem são as pessoas importantes na sua vida que te apoiam?',
        type: 'open',
        clinical_significance: 'medium'
      },
      
      {
        id: 'previous_therapy',
        category: 'history',
        question: 'Você já fez terapia antes? Como foi sua experiência?',
        type: 'open',
        clinical_significance: 'medium',
        follow_up: [
          'O que funcionou bem?',
          'O que você gostaria que fosse diferente?'
        ]
      }
    ];
  }
  
  // Gerar formulação inicial baseada no assessment
  generateInitialFormulation(responses: Record<string, any>): Partial<CaseFormulation> {
    const formulation: Partial<CaseFormulation> = {
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    // Processar problemas apresentados
    if (responses.presenting_primary) {
      formulation.presentingProblems = {
        primary: [responses.presenting_primary],
        secondary: [],
        severity: responses.severity_impact || 5,
        duration: responses.duration || 'Não especificado',
        impactAreas: this.extractImpactAreas(responses.presenting_primary)
      };
    }
    
    // Processar fatores cognitivos
    if (responses.automatic_thoughts || responses.cognitive_distortions) {
      formulation.perpetuatingFactors = {
        cognitive: {
          automatic_thoughts: responses.automatic_thoughts ? [responses.automatic_thoughts] : [],
          cognitive_distortions: responses.cognitive_distortions || [],
          core_beliefs: [],
          assumptions: []
        },
        behavioral: {
          avoidance_patterns: responses.avoidance_patterns ? [responses.avoidance_patterns] : [],
          safety_behaviors: [],
          maladaptive_coping: responses.coping_strategies?.filter((s: string) => 
            ['Evito situações', 'Uso álcool', 'Me isolo', 'Fico ruminando'].some(neg => s.includes(neg))
          ) || [],
          behavioral_cycles: []
        },
        environmental: {
          social_reinforcement: [],
          environmental_triggers: [],
          interpersonal_patterns: [],
          system_factors: []
        },
        physiological: {
          sleep_patterns: [],
          appetite_changes: [],
          energy_levels: [],
          physical_symptoms: []
        }
      };
    }
    
    // Processar fatores predisponentes
    if (responses.family_history || responses.early_experiences) {
      formulation.predisposingFactors = {
        biological: {
          genetics: responses.family_history ? [responses.family_history] : [],
          medical: [],
          developmental: []
        },
        psychological: {
          personality: [],
          cognitive_patterns: [],
          emotional_patterns: [],
          past_trauma: responses.early_experiences ? [responses.early_experiences] : []
        },
        social: {
          family_history: responses.family_history ? [responses.family_history] : [],
          early_relationships: [],
          cultural_factors: [],
          socioeconomic: []
        }
      };
    }
    
    // Processar eventos precipitantes
    if (responses.recent_triggers) {
      formulation.precipitatingEvents = {
        recent_events: [responses.recent_triggers],
        life_changes: [],
        losses: [],
        stressors: [],
        timeline: 'Recente'
      };
    }
    
    // Processar fatores protetivos
    if (responses.strengths_resources || responses.support_system) {
      formulation.protectiveFactors = {
        personal: responses.strengths_resources ? [responses.strengths_resources] : [],
        social: responses.support_system ? [responses.support_system] : [],
        environmental: [],
        skills: responses.coping_strategies?.filter((s: string) => 
          ['Exercito-me', 'Converso com', 'Pratico técnicas', 'Busco ajuda'].some(pos => s.includes(pos))
        ) || []
      };
    }
    
    return formulation;
  }
  
  // Gerar hipóteses terapêuticas
  generateTherapeuticHypotheses(formulation: CaseFormulation): TherapeuticHypothesis[] {
    const hypotheses: TherapeuticHypothesis[] = [];
    
    // Hipótese cognitiva
    if (formulation.perpetuatingFactors?.cognitive?.cognitive_distortions?.length > 0) {
      hypotheses.push({
        id: 'cognitive_hypothesis',
        hypothesis: 'Os sintomas são mantidos por padrões de pensamento disfuncionais e crenças negativas',
        supporting_evidence: [
          'Presença de distorções cognitivas identificadas',
          'Pensamentos automáticos negativos reportados',
          'Padrões de ruminação'
        ],
        contradicting_evidence: [],
        confidence_level: 8,
        implications_for_treatment: [
          'TCC com foco em reestruturação cognitiva',
          'Thought records e questionamento socrático',
          'Identificação e modificação de crenças nucleares'
        ],
        tests_to_validate: [
          'Monitorar mudanças em pensamentos automáticos',
          'Avaliar resposta a técnicas de reestruturação cognitiva'
        ]
      });
    }
    
    // Hipótese comportamental
    if (formulation.perpetuatingFactors?.behavioral?.avoidance_patterns?.length > 0) {
      hypotheses.push({
        id: 'behavioral_hypothesis',
        hypothesis: 'Padrões de evitação mantêm e intensificam os sintomas através de reforço negativo',
        supporting_evidence: [
          'Evitação de situações identificada',
          'Comportamentos de segurança presentes',
          'Redução de atividades prazerosas'
        ],
        contradicting_evidence: [],
        confidence_level: 7,
        implications_for_treatment: [
          'Exposição gradual e dessensibilização',
          'Ativação comportamental',
          'Redução de comportamentos de evitação'
        ],
        tests_to_validate: [
          'Monitorar níveis de ansiedade durante exposições',
          'Avaliar aumento em atividades e funcionamento'
        ]
      });
    }
    
    // Hipótese trauma/história
    if (formulation.predisposingFactors?.psychological?.past_trauma?.length > 0) {
      hypotheses.push({
        id: 'trauma_hypothesis',
        hypothesis: 'Experiências traumáticas passadas influenciam respostas atuais e vulnerabilidade',
        supporting_evidence: [
          'História de trauma identificada',
          'Padrões de resposta compatíveis com trauma',
          'Sintomas de reativação presentes'
        ],
        contradicting_evidence: [],
        confidence_level: 6,
        implications_for_treatment: [
          'Abordagem trauma-informed',
          'Técnicas de processamento traumático',
          'Regulação emocional e mindfulness'
        ],
        tests_to_validate: [
          'Avaliar respostas a intervenções específicas para trauma',
          'Monitorar sintomas de PTSD'
        ]
      });
    }
    
    return hypotheses;
  }
  
  // Gerar plano de tratamento baseado na formulação
  generateTreatmentPlan(formulation: CaseFormulation, hypotheses: TherapeuticHypothesis[]): CaseFormulation['interventionPlan'] {
    const plan: CaseFormulation['interventionPlan'] = {
      phase1: {
        focus: 'Estabilização e Assessment',
        techniques: [
          'Psicoeducação sobre sintomas',
          'Desenvolvimento de rapport terapêutico',
          'Técnicas de regulação emocional básicas',
          'Assessment contínuo'
        ],
        duration: '2-4 sessões',
        goals: [
          'Compreensão clara dos sintomas',
          'Estabilização emocional',
          'Estabelecimento de metas terapêuticas'
        ]
      },
      phase2: {
        focus: 'Intervenção Principal',
        techniques: [],
        duration: '6-12 sessões',
        goals: []
      },
      phase3: {
        focus: 'Consolidação e Prevenção de Recaída',
        techniques: [
          'Revisão de progressos',
          'Plano de prevenção de recaída',
          'Estratégias de auto-manejo',
          'Preparação para término'
        ],
        duration: '2-4 sessões',
        goals: [
          'Consolidação de ganhos',
          'Prevenção de recaídas',
          'Manutenção de melhorias'
        ]
      }
    };
    
    // Personalizar fase 2 baseada nas hipóteses
    const primaryHypothesis = hypotheses.sort((a, b) => b.confidence_level - a.confidence_level)[0];
    
    if (primaryHypothesis?.id === 'cognitive_hypothesis') {
      plan.phase2.focus = 'Reestruturação Cognitiva';
      plan.phase2.techniques = [
        'Identificação de pensamentos automáticos',
        'Questionamento socrático',
        'Thought records',
        'Experimentos comportamentais',
        'Modificação de crenças nucleares'
      ];
      plan.phase2.goals = [
        'Redução de distorções cognitivas',
        'Desenvolvimento de pensamentos mais adaptativos',
        'Melhoria no humor e funcionamento'
      ];
    } else if (primaryHypothesis?.id === 'behavioral_hypothesis') {
      plan.phase2.focus = 'Modificação Comportamental';
      plan.phase2.techniques = [
        'Hierarquia de exposição',
        'Dessensibilização sistemática',
        'Ativação comportamental',
        'Técnicas de enfrentamento',
        'Redução de evitação'
      ];
      plan.phase2.goals = [
        'Redução de comportamentos de evitação',
        'Aumento de atividades prazerosas',
        'Melhoria no funcionamento diário'
      ];
    } else if (primaryHypothesis?.id === 'trauma_hypothesis') {
      plan.phase2.focus = 'Processamento Traumático';
      plan.phase2.techniques = [
        'Técnicas de grounding',
        'Processamento narrativo',
        'EMDR adaptado',
        'Regulação emocional avançada',
        'Reestruturação de memórias'
      ];
      plan.phase2.goals = [
        'Processamento adaptativo do trauma',
        'Redução de sintomas de reativação',
        'Integração saudável da experiência'
      ];
    }
    
    return plan;
  }
  
  // Extrair áreas de impacto do texto
  private extractImpactAreas(text: string): ('work' | 'relationships' | 'social' | 'physical' | 'emotional')[] {
    const areas: ('work' | 'relationships' | 'social' | 'physical' | 'emotional')[] = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('trabalho') || lowerText.includes('emprego') || lowerText.includes('carreira')) {
      areas.push('work');
    }
    if (lowerText.includes('relacionamento') || lowerText.includes('família') || lowerText.includes('parceiro')) {
      areas.push('relationships');
    }
    if (lowerText.includes('social') || lowerText.includes('amigos') || lowerText.includes('pessoas')) {
      areas.push('social');
    }
    if (lowerText.includes('físico') || lowerText.includes('corpo') || lowerText.includes('saúde')) {
      areas.push('physical');
    }
    if (lowerText.includes('emocional') || lowerText.includes('sentimento') || lowerText.includes('humor')) {
      areas.push('emotional');
    }
    
    return areas;
  }
  
  // Salvar formulação
  saveFormulation(formulation: CaseFormulation): void {
    if (typeof window === 'undefined') return;
    
    try {
      const key = `claramente_formulation_${formulation.userId}`;
      localStorage.setItem(key, JSON.stringify(formulation));
    } catch (error) {
      console.error('Erro ao salvar formulação:', error);
    }
  }
  
  // Carregar formulação
  loadFormulation(userId: string): CaseFormulation | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const key = `claramente_formulation_${userId}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const formulation = JSON.parse(data);
      formulation.createdAt = new Date(formulation.createdAt);
      formulation.lastUpdated = new Date(formulation.lastUpdated);
      
      return formulation;
    } catch (error) {
      console.error('Erro ao carregar formulação:', error);
      return null;
    }
  }
  
  // Atualizar formulação com novos dados
  updateFormulation(userId: string, updates: Partial<CaseFormulation>): CaseFormulation | null {
    const current = this.loadFormulation(userId);
    if (!current) return null;
    
    const updated = {
      ...current,
      ...updates,
      lastUpdated: new Date()
    };
    
    this.saveFormulation(updated);
    return updated;
  }
}

// Instância singleton
export const caseFormulationService = new CaseFormulationService();