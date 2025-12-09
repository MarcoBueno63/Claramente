// lib/tcc-protocols.ts - Sistema de Protocolos Especializados de TCC
// Protocolos baseados em evidências para transtornos específicos

export interface TCCProtocol {
  id: string;
  name: string;
  shortName: string;
  disorder: string;
  category: 'anxiety' | 'depression' | 'ocd' | 'phobia' | 'trauma' | 'eating' | 'bipolar';
  description: string;
  evidenceBase: string[];
  duration: {
    sessions: number;
    weeks: number;
  };
  phases: TCCPhase[];
  assessmentTools: string[];
  contraindicações: string[];
  targetSymptoms: string[];
  coreInterventions: string[];
  homeworkAssignments: TCCHomework[];
  relapsePrevention: RelapsePreventionPlan;
}

export interface TCCPhase {
  id: string;
  name: string;
  sessions: number[];
  objectives: string[];
  interventions: string[]; // IDs das intervenções
  assessments: string[];
  homework: string[];
}

export interface TCCIntervention {
  id: string;
  name: string;
  type: 'cognitive' | 'behavioral' | 'exposure' | 'psychoeducation' | 'relapse_prevention';
  description: string;
  procedure: string[];
  materials: string[];
  duration: number; // em minutos
  adaptations: {
    severity: string;
    modifications: string[];
  }[];
}

export interface TCCHomework {
  id: string;
  week: number;
  title: string;
  description: string;
  instructions: string[];
  materials: string[];
  frequency: string;
  duration: string;
  assessmentCriteria: string[];
}

export interface RelapsePreventionPlan {
  warningSignsIdentification: string[];
  copingStrategies: string[];
  supportNetwork: string[];
  maintenanceActivities: string[];
  crisisManagement: string[];
  followUpSchedule: string[];
}

export interface ProtocolSession {
  protocolId: string;
  sessionNumber: number;
  userId: string;
  sessionDate: Date;
  phaseId: string;
  completedInterventions: string[];
  homeworkAssigned: string[];
  sessionNotes: string;
  clientProgress: {
    symptomReduction: number; // 0-100%
    skillAcquisition: number; // 0-100%
    homeworkCompliance: number; // 0-100%
    therapeuticAlliance: number; // 1-10
  };
  nextSessionPlanning: string[];
}

class TCCProtocolsService {
  private protocols: Map<string, TCCProtocol> = new Map();

  constructor() {
    this.initializeProtocols();
  }

  private initializeProtocols() {
    // Protocolo para Transtorno de Ansiedade Generalizada (TAG)
    this.protocols.set('tag_protocol', {
      id: 'tag_protocol',
      name: 'Protocolo TCC para Transtorno de Ansiedade Generalizada',
      shortName: 'TCC-TAG',
      disorder: 'Transtorno de Ansiedade Generalizada',
      category: 'anxiety',
      description: 'Protocolo estruturado baseado no modelo de Borkovec e Newman para tratamento do TAG através de reestruturação cognitiva, técnicas de relaxamento e exposição à preocupação.',
      evidenceBase: [
        'Borkovec, T.D. & Newman, M.G. (1998)',
        'Wells, A. (2009) - Metacognitive Therapy',
        'Dugas, M.J. & Robichaud, M. (2007)',
        'APA Clinical Practice Guidelines (2019)'
      ],
      duration: {
        sessions: 16,
        weeks: 20
      },
      phases: [
        {
          id: 'psychoeducation_phase',
          name: 'Psicoeducação e Avaliação',
          sessions: [1, 2, 3],
          objectives: [
            'Estabelecer rapport terapêutico',
            'Compreender o modelo cognitivo da ansiedade',
            'Identificar padrões de preocupação',
            'Definir metas terapêuticas'
          ],
          interventions: ['psychoeducation_tag', 'worry_diary', 'cognitive_model'],
          assessments: ['GAD-7', 'PSWQ', 'functional_analysis'],
          homework: ['daily_worry_monitoring', 'relaxation_practice']
        },
        {
          id: 'cognitive_restructuring_phase',
          name: 'Reestruturação Cognitiva',
          sessions: [4, 5, 6, 7, 8, 9],
          objectives: [
            'Identificar pensamentos automáticos ansiogênicos',
            'Desenvolver habilidades de questionamento socrático',
            'Praticar reestruturação de pensamentos catastróficos',
            'Reduzir metacognições sobre preocupação'
          ],
          interventions: ['thought_record', 'socratic_questioning', 'catastrophic_thinking_challenge'],
          assessments: ['thought_monitoring', 'belief_rating'],
          homework: ['daily_thought_record', 'behavioral_experiments']
        },
        {
          id: 'worry_exposure_phase',
          name: 'Exposição à Preocupação',
          sessions: [10, 11, 12, 13],
          objectives: [
            'Implementar tempo controlado de preocupação',
            'Praticar exposição imaginária a cenários temidos',
            'Desenvolver tolerância à incerteza',
            'Reduzir evitação cognitiva'
          ],
          interventions: ['worry_time', 'imaginal_exposure', 'uncertainty_training'],
          assessments: ['exposure_hierarchy', 'anxiety_ratings'],
          homework: ['scheduled_worry_time', 'uncertainty_exercises']
        },
        {
          id: 'relapse_prevention_phase',
          name: 'Prevenção de Recaída',
          sessions: [14, 15, 16],
          objectives: [
            'Consolidar habilidades aprendidas',
            'Desenvolver plano de prevenção de recaída',
            'Planejar manutenção a longo prazo',
            'Preparar alta terapêutica'
          ],
          interventions: ['relapse_prevention_planning', 'skill_consolidation'],
          assessments: ['outcome_measures', 'relapse_risk_assessment'],
          homework: ['maintenance_plan', 'self_therapy_sessions']
        }
      ],
      assessmentTools: ['GAD-7', 'PSWQ', 'DASS-21', 'BAI', 'IU-12'],
      contraindicações: [
        'Transtorno psicótico ativo',
        'Transtorno bipolar não estabilizado',
        'Abuso ativo de substâncias',
        'Ideação suicida grave'
      ],
      targetSymptoms: [
        'Preocupação excessiva',
        'Tensão muscular',
        'Fadiga',
        'Irritabilidade',
        'Dificuldade de concentração',
        'Distúrbios do sono'
      ],
      coreInterventions: [
        'Reestruturação cognitiva',
        'Exposição à preocupação',
        'Relaxamento muscular progressivo',
        'Tempo controlado de preocupação',
        'Treinamento em tolerância à incerteza'
      ],
      homeworkAssignments: [], // Será preenchido abaixo
      relapsePrevention: {
        warningSignsIdentification: [
          'Aumento na frequência de preocupações',
          'Retorno de sintomas físicos (tensão, fadiga)',
          'Evitação de situações antes toleradas',
          'Diminuição no uso de técnicas aprendidas'
        ],
        copingStrategies: [
          'Retomar registro de pensamentos',
          'Praticar relaxamento diário',
          'Implementar tempo de preocupação',
          'Revisar questionamento socrático'
        ],
        supportNetwork: [
          'Familiares treinados em apoio',
          'Grupos de apoio para ansiedade',
          'Profissionais de saúde mental',
          'Aplicativos de mindfulness'
        ],
        maintenanceActivities: [
          'Prática diária de relaxamento (10 min)',
          'Registro semanal de preocupações',
          'Exercícios de exposição mensais',
          'Revisão trimestral de habilidades'
        ],
        crisisManagement: [
          'Técnicas de respiração para crises agudas',
          'Lista de contatos de emergência',
          'Plano de ação escalonado',
          'Protocolo de busca por ajuda profissional'
        ],
        followUpSchedule: [
          'Sessão de follow-up em 1 mês',
          'Contato telefônico em 3 meses',
          'Sessão de reforço em 6 meses',
          'Avaliação anual de manutenção'
        ]
      }
    });

    // Protocolo para Transtorno Depressivo Maior (TDM)
    this.protocols.set('depression_protocol', {
      id: 'depression_protocol',
      name: 'Protocolo TCC para Transtorno Depressivo Maior',
      shortName: 'TCC-TDM',
      disorder: 'Transtorno Depressivo Maior',
      category: 'depression',
      description: 'Protocolo baseado no modelo de Beck para tratamento da depressão através de ativação comportamental, reestruturação cognitiva e prevenção de recaída.',
      evidenceBase: [
        'Beck, A.T. et al. (1979) - Cognitive Therapy of Depression',
        'Dobson, K.S. (1989) - Meta-analysis of CBT for depression',
        'Cuijpers, P. et al. (2013) - Effectiveness of CBT',
        'APA Clinical Practice Guidelines (2019)'
      ],
      duration: {
        sessions: 20,
        weeks: 24
      },
      phases: [
        {
          id: 'assessment_stabilization',
          name: 'Avaliação e Estabilização',
          sessions: [1, 2, 3, 4],
          objectives: [
            'Avaliação completa dos sintomas depressivos',
            'Estabelecimento de segurança e rapport',
            'Psicoeducação sobre depressão e TCC',
            'Ativação comportamental inicial'
          ],
          interventions: ['depression_psychoeducation', 'activity_monitoring', 'suicide_risk_assessment'],
          assessments: ['PHQ-9', 'BDI-II', 'functional_impairment'],
          homework: ['activity_diary', 'mood_monitoring']
        },
        {
          id: 'behavioral_activation',
          name: 'Ativação Comportamental',
          sessions: [5, 6, 7, 8, 9],
          objectives: [
            'Aumentar atividades prazerosas e de domínio',
            'Quebrar ciclo de inatividade-depressão',
            'Estabelecer rotinas estruturadas',
            'Melhorar funcionamento diário'
          ],
          interventions: ['activity_scheduling', 'mastery_pleasure_ratings', 'graded_task_assignment'],
          assessments: ['activity_levels', 'pleasure_ratings'],
          homework: ['daily_activity_planning', 'behavioral_experiments']
        },
        {
          id: 'cognitive_work',
          name: 'Trabalho Cognitivo',
          sessions: [10, 11, 12, 13, 14, 15],
          objectives: [
            'Identificar pensamentos automáticos negativos',
            'Questionar crenças disfuncionais',
            'Desenvolver pensamentos equilibrados',
            'Modificar esquemas cognitivos depressogênicos'
          ],
          interventions: ['thought_record_depression', 'cognitive_restructuring', 'core_belief_work'],
          assessments: ['dysfunctional_attitudes', 'thought_patterns'],
          homework: ['thought_challenging', 'behavioral_testing']
        },
        {
          id: 'integration_prevention',
          name: 'Integração e Prevenção',
          sessions: [16, 17, 18, 19, 20],
          objectives: [
            'Integrar ganhos terapêuticos',
            'Desenvolver plano de prevenção de recaída',
            'Preparar enfrentamento de situações futuras',
            'Planejar manutenção de mudanças'
          ],
          interventions: ['relapse_prevention_depression', 'future_planning', 'skill_generalization'],
          assessments: ['treatment_gains', 'relapse_vulnerability'],
          homework: ['maintenance_planning', 'self_therapy_practice']
        }
      ],
      assessmentTools: ['PHQ-9', 'BDI-II', 'DASS-21', 'BAI', 'DAS'],
      contraindicações: [
        'Ideação suicida com plano específico',
        'Episódio maníaco ou hipomaníaco atual',
        'Transtorno psicótico com sintomas ativos',
        'Demência ou comprometimento cognitivo grave'
      ],
      targetSymptoms: [
        'Humor deprimido',
        'Anedonia',
        'Fadiga e perda de energia',
        'Sentimentos de inutilidade ou culpa',
        'Dificuldade de concentração',
        'Distúrbios do sono e apetite'
      ],
      coreInterventions: [
        'Ativação comportamental',
        'Reestruturação cognitiva',
        'Programação de atividades',
        'Registro de pensamentos disfuncionais',
        'Prevenção de recaída'
      ],
      homeworkAssignments: [],
      relapsePrevention: {
        warningSignsIdentification: [
          'Diminuição gradual de atividades',
          'Retorno de pensamentos negativos automáticos',
          'Isolamento social',
          'Alterações no sono e apetite',
          'Sentimentos de desesperança'
        ],
        copingStrategies: [
          'Retomar programação de atividades',
          'Usar registro de pensamentos',
          'Buscar apoio social',
          'Manter rotinas de autocuidado',
          'Praticar exercícios físicos'
        ],
        supportNetwork: [
          'Família e amigos próximos',
          'Grupos de apoio para depressão',
          'Profissionais de saúde',
          'Comunidades online de apoio'
        ],
        maintenanceActivities: [
          'Atividades físicas regulares',
          'Manutenção de rotinas estruturadas',
          'Prática de mindfulness',
          'Monitoramento semanal do humor'
        ],
        crisisManagement: [
          'Plano de segurança para ideação suicida',
          'Contatos de emergência 24h',
          'Estratégias de distração e enfrentamento',
          'Protocolo escalonado de busca por ajuda'
        ],
        followUpSchedule: [
          'Sessões quinzenais por 2 meses',
          'Sessões mensais por 3 meses',
          'Contato telefônico trimestral',
          'Avaliação semestral presencial'
        ]
      }
    });

    // Protocolo para Transtorno Obsessivo-Compulsivo (TOC)
    this.protocols.set('ocd_protocol', {
      id: 'ocd_protocol',
      name: 'Protocolo TCC para Transtorno Obsessivo-Compulsivo',
      shortName: 'TCC-TOC',
      disorder: 'Transtorno Obsessivo-Compulsivo',
      category: 'ocd',
      description: 'Protocolo baseado em Exposição e Prevenção de Resposta (EPR) combinado com reestruturação cognitiva para tratamento do TOC.',
      evidenceBase: [
        'Foa, E.B. & Kozak, M.J. (1986)',
        'Salkovskis, P.M. (1985) - Cognitive model of OCD',
        'OCCWG (1997) - Expert consensus guidelines',
        'APA Practice Guidelines (2007)'
      ],
      duration: {
        sessions: 18,
        weeks: 22
      },
      phases: [
        {
          id: 'assessment_psychoeducation',
          name: 'Avaliação e Psicoeducação',
          sessions: [1, 2, 3],
          objectives: [
            'Avaliação detalhada de obsessões e compulsões',
            'Compreensão do modelo cognitivo do TOC',
            'Identificação de gatilhos e padrões',
            'Construção de hierarquia de exposição'
          ],
          interventions: ['ocd_assessment', 'cognitive_model_ocd', 'hierarchy_construction'],
          assessments: ['Y-BOCS', 'OCI-R', 'functional_analysis_ocd'],
          homework: ['obsession_compulsion_diary', 'trigger_identification']
        },
        {
          id: 'exposure_response_prevention',
          name: 'Exposição e Prevenção de Resposta',
          sessions: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          objectives: [
            'Implementar exposições graduais',
            'Prevenir rituais compulsivos',
            'Reduzir ansiedade através de habituação',
            'Aumentar tolerância à incerteza'
          ],
          interventions: ['graded_exposure', 'response_prevention', 'in_vivo_exposure'],
          assessments: ['anxiety_ratings', 'ritual_frequency'],
          homework: ['daily_exposure_practice', 'ritual_prevention']
        },
        {
          id: 'cognitive_restructuring_ocd',
          name: 'Reestruturação Cognitiva',
          sessions: [14, 15, 16],
          objectives: [
            'Modificar interpretações catastróficas',
            'Reduzir responsabilidade excessiva',
            'Questionar pensamentos de fusão',
            'Desenvolver flexibilidade cognitiva'
          ],
          interventions: ['thought_challenging_ocd', 'responsibility_pie', 'thought_action_fusion'],
          assessments: ['obsessive_beliefs', 'responsibility_ratings'],
          homework: ['cognitive_exercises', 'belief_testing']
        },
        {
          id: 'consolidation_relapse_prevention',
          name: 'Consolidação e Prevenção',
          sessions: [17, 18],
          objectives: [
            'Consolidar ganhos da EPR',
            'Planejar manutenção a longo prazo',
            'Desenvolver estratégias para situações futuras',
            'Preparar alta terapêutica'
          ],
          interventions: ['skill_consolidation_ocd', 'relapse_prevention_ocd'],
          assessments: ['treatment_response', 'maintenance_planning'],
          homework: ['self_directed_exposure', 'maintenance_schedule']
        }
      ],
      assessmentTools: ['Y-BOCS', 'OCI-R', 'DOCS', 'OBQ-44'],
      contraindicações: [
        'Transtorno psicótico com delírios',
        'Transtorno de personalidade borderline grave',
        'Ideação suicida relacionada aos sintomas do TOC',
        'Comprometimento cognitivo significativo'
      ],
      targetSymptoms: [
        'Obsessões intrusivas',
        'Comportamentos compulsivos',
        'Ansiedade relacionada aos sintomas',
        'Evitação de gatilhos',
        'Prejuízo funcional',
        'Insight sobre sintomas'
      ],
      coreInterventions: [
        'Exposição gradual in vivo',
        'Prevenção de resposta',
        'Reestruturação de crenças obsessivas',
        'Treinamento em tolerância à incerteza',
        'Técnicas de mindfulness'
      ],
      homeworkAssignments: [],
      relapsePrevention: {
        warningSignsIdentification: [
          'Retorno de rituais previamente controlados',
          'Aumento da frequência de obsessões',
          'Evitação de situações antes toleradas',
          'Aumento da ansiedade relacionada aos sintomas'
        ],
        copingStrategies: [
          'Retomar exercícios de exposição',
          'Usar técnicas de prevenção de resposta',
          'Praticar mindfulness para obsessões',
          'Aplicar reestruturação cognitiva'
        ],
        supportNetwork: [
          'Familiares educados sobre TOC',
          'Grupos de apoio específicos',
          'Profissionais especializados em TOC',
          'Comunidades online de apoio'
        ],
        maintenanceActivities: [
          'Exposições de manutenção semanais',
          'Prática diária de mindfulness',
          'Monitoramento de sintomas',
          'Exercícios cognitivos regulares'
        ],
        crisisManagement: [
          'Protocolo de intensificação da EPR',
          'Estratégias para crises de ansiedade',
          'Plano de contato com terapeuta',
          'Medicação de resgate se prescrita'
        ],
        followUpSchedule: [
          'Sessões de reforço quinzenais (2 meses)',
          'Sessões mensais (3 meses)',
          'Contatos trimestrais',
          'Avaliação anual completa'
        ]
      }
    });

    // Protocolo para Fobia Específica
    this.protocols.set('specific_phobia_protocol', {
      id: 'specific_phobia_protocol',
      name: 'Protocolo TCC para Fobia Específica',
      shortName: 'TCC-Fobia',
      disorder: 'Fobia Específica',
      category: 'phobia',
      description: 'Protocolo intensivo baseado em exposição gradual para tratamento de fobias específicas.',
      evidenceBase: [
        'Wolpe, J. (1958) - Systematic Desensitization',
        'Öst, L.G. (1989) - One-session treatment',
        'Choy, Y. et al. (2007) - Treatment of specific phobias',
        'Wolitzky-Taylor, K.B. et al. (2008)'
      ],
      duration: {
        sessions: 8,
        weeks: 10
      },
      phases: [
        {
          id: 'assessment_hierarchy',
          name: 'Avaliação e Construção de Hierarquia',
          sessions: [1, 2],
          objectives: [
            'Avaliação detalhada da fobia',
            'Identificação de gatilhos específicos',
            'Construção de hierarquia de exposição',
            'Ensino de técnicas de relaxamento'
          ],
          interventions: ['phobia_assessment', 'fear_hierarchy', 'relaxation_training'],
          assessments: ['fear_rating', 'avoidance_assessment'],
          homework: ['fear_monitoring', 'relaxation_practice']
        },
        {
          id: 'graded_exposure',
          name: 'Exposição Gradual',
          sessions: [3, 4, 5, 6, 7],
          objectives: [
            'Exposição sistemática aos estímulos fóbicos',
            'Redução da ansiedade através de habituação',
            'Aumento da autoeficácia',
            'Generalização para situações reais'
          ],
          interventions: ['systematic_desensitization', 'in_vivo_exposure_phobia', 'flooding_technique'],
          assessments: ['subjective_anxiety', 'behavioral_approach'],
          homework: ['exposure_exercises', 'fear_diary']
        },
        {
          id: 'consolidation_generalization',
          name: 'Consolidação e Generalização',
          sessions: [8],
          objectives: [
            'Consolidar ganhos terapêuticos',
            'Planejar exposições de manutenção',
            'Generalizar para situações variadas',
            'Prevenir recaída da fobia'
          ],
          interventions: ['exposure_consolidation', 'generalization_training'],
          assessments: ['treatment_outcome', 'fear_reduction'],
          homework: ['maintenance_exposures', 'self_exposure_planning']
        }
      ],
      assessmentTools: ['Fear Survey Schedule', 'BAT', 'SUDS', 'Phobia Severity Scale'],
      contraindicações: [
        'Transtorno de pânico não tratado',
        'Condições médicas que impedem exposição',
        'Transtorno psicótico ativo',
        'Abuso ativo de substâncias'
      ],
      targetSymptoms: [
        'Medo intenso de estímulo específico',
        'Ansiedade antecipatória',
        'Comportamento de evitação',
        'Prejuízo funcional',
        'Sintomas físicos de ansiedade',
        'Cognições catastróficas'
      ],
      coreInterventions: [
        'Dessensibilização sistemática',
        'Exposição in vivo gradual',
        'Técnicas de relaxamento',
        'Reestruturação cognitiva básica',
        'Treinamento em habilidades de enfrentamento'
      ],
      homeworkAssignments: [],
      relapsePrevention: {
        warningSignsIdentification: [
          'Retorno de evitação aos estímulos fóbicos',
          'Aumento da ansiedade antecipatória',
          'Diminuição na frequência de exposições',
          'Pensamentos catastróficos sobre o estímulo'
        ],
        copingStrategies: [
          'Retomar exposições graduais',
          'Usar técnicas de relaxamento',
          'Praticar reestruturação cognitiva',
          'Buscar apoio para exposições'
        ],
        supportNetwork: [
          'Familiares como parceiros de exposição',
          'Amigos que apoiem o tratamento',
          'Grupos de apoio para ansiedade',
          'Profissionais de saúde mental'
        ],
        maintenanceActivities: [
          'Exposições regulares ao estímulo fóbico',
          'Prática de técnicas de relaxamento',
          'Monitoramento da ansiedade',
          'Desafios graduais de exposição'
        ],
        crisisManagement: [
          'Técnicas de respiração para crises',
          'Estratégias de enfrentamento rápido',
          'Plano de exposição de emergência',
          'Contato com profissional se necessário'
        ],
        followUpSchedule: [
          'Contato telefônico em 2 semanas',
          'Sessão de reforço em 1 mês',
          'Avaliação trimestral',
          'Check-up anual se necessário'
        ]
      }
    });
  }

  // Métodos públicos para acessar protocolos
  getProtocol(protocolId: string): TCCProtocol | undefined {
    return this.protocols.get(protocolId);
  }

  getAllProtocols(): TCCProtocol[] {
    return Array.from(this.protocols.values());
  }

  getProtocolsByCategory(category: TCCProtocol['category']): TCCProtocol[] {
    return this.getAllProtocols().filter(protocol => protocol.category === category);
  }

  getProtocolsByDisorder(disorder: string): TCCProtocol[] {
    return this.getAllProtocols().filter(protocol => 
      protocol.disorder.toLowerCase().includes(disorder.toLowerCase())
    );
  }

  // Métodos para gerenciar sessões de protocolo
  createProtocolSession(
    protocolId: string,
    sessionNumber: number,
    userId: string,
    phaseId: string
  ): ProtocolSession {
    return {
      protocolId,
      sessionNumber,
      userId,
      sessionDate: new Date(),
      phaseId,
      completedInterventions: [],
      homeworkAssigned: [],
      sessionNotes: '',
      clientProgress: {
        symptomReduction: 0,
        skillAcquisition: 0,
        homeworkCompliance: 0,
        therapeuticAlliance: 5
      },
      nextSessionPlanning: []
    };
  }

  saveProtocolSession(session: ProtocolSession): void {
    const sessions = this.getProtocolSessions(session.userId, session.protocolId);
    sessions.push(session);
    
    localStorage.setItem(
      `protocol_sessions_${session.userId}_${session.protocolId}`, 
      JSON.stringify(sessions)
    );
  }

  getProtocolSessions(userId: string, protocolId: string): ProtocolSession[] {
    const stored = localStorage.getItem(`protocol_sessions_${userId}_${protocolId}`);
    return stored ? JSON.parse(stored) : [];
  }

  calculateProtocolProgress(userId: string, protocolId: string): {
    totalSessions: number;
    completedSessions: number;
    currentPhase: string;
    progressPercentage: number;
    averageSymptomReduction: number;
    averageSkillAcquisition: number;
  } {
    const protocol = this.getProtocol(protocolId);
    const sessions = this.getProtocolSessions(userId, protocolId);
    
    if (!protocol) {
      throw new Error('Protocol not found');
    }

    const totalSessions = protocol.duration.sessions;
    const completedSessions = sessions.length;
    const progressPercentage = (completedSessions / totalSessions) * 100;

    // Calcular média de redução de sintomas e aquisição de habilidades
    const averageSymptomReduction = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.clientProgress.symptomReduction, 0) / sessions.length
      : 0;
    
    const averageSkillAcquisition = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.clientProgress.skillAcquisition, 0) / sessions.length
      : 0;

    // Determinar fase atual
    let currentPhase = protocol.phases[0]?.name || 'Início';
    for (const phase of protocol.phases) {
      if (phase.sessions.some(sessionNum => sessionNum <= completedSessions + 1)) {
        currentPhase = phase.name;
      }
    }

    return {
      totalSessions,
      completedSessions,
      currentPhase,
      progressPercentage: Math.round(progressPercentage),
      averageSymptomReduction: Math.round(averageSymptomReduction),
      averageSkillAcquisition: Math.round(averageSkillAcquisition)
    };
  }

  getNextSessionRecommendations(userId: string, protocolId: string): {
    sessionNumber: number;
    phase: TCCPhase;
    interventions: TCCIntervention[];
    homework: string[];
    assessments: string[];
  } | null {
    const protocol = this.getProtocol(protocolId);
    const sessions = this.getProtocolSessions(userId, protocolId);
    
    if (!protocol) return null;

    const nextSessionNumber = sessions.length + 1;
    
    // Encontrar a fase correspondente à próxima sessão
    const currentPhase = protocol.phases.find(phase => 
      phase.sessions.includes(nextSessionNumber)
    );

    if (!currentPhase) return null;

    // Buscar intervenções específicas da fase
    const interventions = currentPhase.interventions.map(interventionId => {
      // Retornar intervenção mock - em uma implementação real, haveria um banco de intervenções
      return {
        id: interventionId,
        name: interventionId.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        type: 'cognitive' as const,
        description: `Intervenção ${interventionId} da fase ${currentPhase.name}`,
        procedure: [`Implementar ${interventionId} conforme protocolo`],
        materials: ['Folhas de registro', 'Material psicoeducativo'],
        duration: 45,
        adaptations: []
      };
    });

    return {
      sessionNumber: nextSessionNumber,
      phase: currentPhase,
      interventions,
      homework: currentPhase.homework,
      assessments: currentPhase.assessments
    };
  }

  // Método para buscar protocolos baseado em sintomas ou diagnóstico
  recommendProtocols(symptoms: string[], diagnosis?: string): TCCProtocol[] {
    const allProtocols = this.getAllProtocols();
    
    return allProtocols.filter(protocol => {
      // Verificar se o diagnóstico corresponde
      if (diagnosis && protocol.disorder.toLowerCase().includes(diagnosis.toLowerCase())) {
        return true;
      }
      
      // Verificar se os sintomas correspondem aos sintomas-alvo
      const symptomMatch = symptoms.some(symptom => 
        protocol.targetSymptoms.some(target => 
          target.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(target.toLowerCase())
        )
      );
      
      return symptomMatch;
    });
  }
}

// Instância singleton do serviço
export const tccProtocolsService = new TCCProtocolsService();