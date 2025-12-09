// lib/contextualized-ai.ts - Sistema de Prompts Contextualizados baseados em dados clínicos
// Prompts inteligentes que se adaptam à formulação de caso e progresso do cliente

export interface UserClinicalContext {
  userId: string;
  caseFormulation?: any; // Dados da formulação de caso
  assessmentHistory: any[]; // Histórico de avaliações (PHQ-9, GAD-7, etc.)
  exerciseProgress: any[]; // Progresso nos exercícios terapêuticos
  protocolProgress?: any; // Progresso em protocolos TCC
  moodTrends: any; // Tendências de humor
  riskFactors: string[]; // Fatores de risco identificados
  strengths: string[]; // Pontos fortes do cliente
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'empathetic' | 'direct';
    focusAreas: string[];
    avoidTopics?: string[];
  };
  currentTherapeuticGoals: string[];
  sessionContext?: {
    currentSession: number;
    lastSessionNotes: string;
    plannedInterventions: string[];
  };
}

export interface ContextualizedPrompt {
  id: string;
  category: 'therapeutic_response' | 'assessment_guidance' | 'exercise_suggestion' | 'crisis_support' | 'psychoeducation' | 'homework_assignment';
  baseTemplate: string;
  contextualizations: {
    condition: (context: UserClinicalContext) => boolean;
    modifications: string[];
  }[];
  adaptiveElements: {
    severity_based: Record<string, string>;
    progress_based: Record<string, string>;
    risk_based: Record<string, string>;
  };
  examples: string[];
  constraints: string[];
}

export interface PromptGenerationRequest {
  userId: string;
  category: ContextualizedPrompt['category'];
  userMessage: string;
  specificContext?: {
    exerciseId?: string;
    assessmentType?: string;
    crisisLevel?: 'low' | 'medium' | 'high';
    sessionPhase?: 'opening' | 'working' | 'closing';
  };
}

export interface GeneratedPrompt {
  systemPrompt: string;
  contextualInstructions: string[];
  therapeuticFocus: string[];
  riskMitigations: string[];
  adaptiveResponse: boolean;
  confidenceLevel: number;
}

class ContextualizedAIService {
  private promptTemplates: Map<string, ContextualizedPrompt> = new Map();

  constructor() {
    this.initializePromptTemplates();
  }

  private initializePromptTemplates() {
    // Template para Respostas Terapêuticas Gerais
    this.promptTemplates.set('therapeutic_response', {
      id: 'therapeutic_response',
      category: 'therapeutic_response',
      baseTemplate: `
Você é Clara, uma assistente de IA especializada em Terapia Cognitivo-Comportamental, trabalhando com um cliente específico.

CONTEXTO CLÍNICO DO CLIENTE:
{clinical_context}

OBJETIVOS TERAPÊUTICOS ATUAIS:
{therapeutic_goals}

INSTRUÇÕES PARA RESPOSTA:
1. Use uma abordagem empática e validadora
2. Integre os dados clínicos conhecidos do cliente
3. Sugira intervenções baseadas no progresso atual
4. Mantenha foco nos objetivos terapêuticos
5. Use linguagem apropriada ao nível de severidade dos sintomas

RESTRIÇÕES:
- Não forneça diagnósticos médicos
- Sempre incentive acompanhamento profissional quando apropriado
- Mantenha confidencialidade e ética terapêutica
- Use técnicas de TCC validadas cientificamente

Responda à mensagem do cliente considerando todo este contexto:
`,
      contextualizations: [
        {
          condition: (ctx) => ctx.riskFactors.includes('ideacao_suicida'),
          modifications: [
            'PRIORIDADE MÁXIMA: Cliente com histórico de ideação suicida',
            'Monitore sinais de crise e encoraje busca por ajuda imediata se necessário',
            'Use linguagem de esperança e conexão'
          ]
        },
        {
          condition: (ctx) => ctx.assessmentHistory.some(a => a.severity === 'severe'),
          modifications: [
            'Cliente apresenta sintomas severos - use abordagem mais estruturada',
            'Foque em estabilização antes de intervenções complexas',
            'Considere necessidade de suporte adicional'
          ]
        }
      ],
      adaptiveElements: {
        severity_based: {
          'mild': 'Use tom mais casual e exploratório',
          'moderate': 'Mantenha estrutura clara com validação emocional',
          'severe': 'Priorize estabilização e segurança'
        },
        progress_based: {
          'beginning': 'Foque em psicoeducação e estabelecimento de rapport',
          'middle': 'Integre técnicas específicas de TCC',
          'advanced': 'Enfatize consolidação e prevenção de recaída'
        },
        risk_based: {
          'low': 'Pode explorar temas mais desafiadores',
          'medium': 'Mantenha equilíbrio entre desafio e suporte',
          'high': 'Priorize contenção e estabilização'
        }
      },
      examples: [
        'Cliente com TAG: Integre técnicas de tolerância à incerteza',
        'Cliente com depressão: Foque em ativação comportamental'
      ],
      constraints: [
        'Nunca minimize sintomas do cliente',
        'Sempre valide experiências emocionais',
        'Mantenha foco terapêutico'
      ]
    });

    // Template para Sugestões de Exercícios
    this.promptTemplates.set('exercise_suggestion', {
      id: 'exercise_suggestion',
      category: 'exercise_suggestion',
      baseTemplate: `
Com base no perfil clínico e progresso do cliente, sugira exercícios terapêuticos apropriados.

DADOS DO CLIENTE:
{clinical_context}

EXERCÍCIOS JÁ REALIZADOS:
{exercise_history}

CRITÉRIOS DE SELEÇÃO:
1. Alinhamento com objetivos terapêuticos atuais
2. Adequação ao nível de sintomas
3. Progressão lógica baseada em exercícios anteriores
4. Consideração de preferências e limitações

FORMATO DA SUGESTÃO:
- Nome do exercício e categoria
- Justificativa baseada no contexto clínico
- Adaptações necessárias para este cliente específico
- Frequência e duração recomendadas
`,
      contextualizations: [
        {
          condition: (ctx) => ctx.exerciseProgress.length === 0,
          modifications: [
            'Cliente iniciante - priorize exercícios básicos de psicoeducação',
            'Comece com técnicas de automonitoramento'
          ]
        },
        {
          condition: (ctx) => ctx.protocolProgress?.currentPhase === 'cognitive_restructuring_phase',
          modifications: [
            'Foque em exercícios de reestruturação cognitiva',
            'Sugira registro de pensamentos automáticos'
          ]
        }
      ],
      adaptiveElements: {
        severity_based: {
          'mild': 'Pode sugerir exercícios de autoexploração',
          'moderate': 'Foque em exercícios estruturados de TCC',
          'severe': 'Priorize técnicas de estabilização'
        },
        progress_based: {
          'beginning': 'Exercícios de monitoramento e psicoeducação',
          'middle': 'Técnicas específicas de mudança cognitiva/comportamental',
          'advanced': 'Exercícios de consolidação e generalização'
        },
        risk_based: {
          'low': 'Pode incluir exercícios de exposição gradual',
          'medium': 'Mantenha exercícios com suporte estruturado',
          'high': 'Apenas técnicas de regulação emocional'
        }
      },
      examples: [
        'Para ansiedade: Respiração diafragmática + registro de preocupações',
        'Para depressão: Programação de atividades + registro de humor'
      ],
      constraints: [
        'Não sugira exercícios além da capacidade atual',
        'Sempre explique o propósito terapêutico',
        'Considere limitações logísticas do cliente'
      ]
    });

    // Template para Orientação em Avaliações
    this.promptTemplates.set('assessment_guidance', {
      id: 'assessment_guidance',
      category: 'assessment_guidance',
      baseTemplate: `
Forneça orientação personalizada para avaliações clínicas baseada no histórico do cliente.

PERFIL DO CLIENTE:
{clinical_context}

HISTÓRICO DE AVALIAÇÕES:
{assessment_history}

ORIENTAÇÕES PERSONALIZADAS:
1. Explique a importância da avaliação no contexto específico
2. Conecte com objetivos terapêuticos atuais
3. Forneça dicas para resposta honesta e precisa
4. Normalize possíveis dificuldades
5. Explique como os resultados serão usados

ADAPTAÇÕES BASEADAS NO PERFIL:
{adaptive_elements}
`,
      contextualizations: [
        {
          condition: (ctx) => ctx.assessmentHistory.length === 0,
          modifications: [
            'Primeira avaliação - explique o processo detalhadamente',
            'Normalize ansiedades sobre autoavaliação'
          ]
        },
        {
          condition: (ctx) => ctx.assessmentHistory.some(a => a.totalScore > a.previousScore),
          modifications: [
            'Houve piora em avaliações recentes - aborde com sensibilidade',
            'Valide que oscilações são normais no processo terapêutico'
          ]
        }
      ],
      adaptiveElements: {
        severity_based: {
          'mild': 'Enfatize autoconhecimento e monitoramento',
          'moderate': 'Foque na utilidade para ajuste do tratamento',
          'severe': 'Assegure que avaliação não causará angústia adicional'
        },
        progress_based: {
          'beginning': 'Estabeleça linha de base e educação sobre sintomas',
          'middle': 'Use para monitorar progresso e ajustar intervenções',
          'advanced': 'Foque em consolidação de ganhos'
        },
        risk_based: {
          'low': 'Pode explorar nuances dos sintomas',
          'medium': 'Monitore para sinais de deterioração',
          'high': 'Priorize avaliação de segurança'
        }
      },
      examples: [
        'PHQ-9 para cliente com depressão: "Esta escala nos ajuda a acompanhar como você tem se sentido..."',
        'GAD-7 após episódio de ansiedade: "Vamos ver como sua ansiedade tem evoluído..."'
      ],
      constraints: [
        'Não interprete resultados diagnósticamente',
        'Sempre contextualize no processo terapêutico',
        'Mantenha foco no empoderamento do cliente'
      ]
    });

    // Template para Suporte em Crise
    this.promptTemplates.set('crisis_support', {
      id: 'crisis_support',
      category: 'crisis_support',
      baseTemplate: `
PROTOCOLO DE RESPOSTA PARA SITUAÇÃO DE CRISE

NÍVEL DA CRISE: {crisis_level}
CONTEXTO DO CLIENTE: {clinical_context}
FATORES DE RISCO CONHECIDOS: {risk_factors}

PRIORIDADES DE RESPOSTA:
1. SEGURANÇA IMEDIATA
2. Validação e normalização
3. Técnicas de regulação emocional
4. Orientação para recursos de apoio
5. Planejamento de segurança

INSTRUÇÕES ESPECÍFICAS:
- Use linguagem calma e direta
- Valide a experiência do cliente
- Ofereça técnicas concretas de enfrentamento
- Encoraje busca por ajuda profissional
- Forneça recursos de emergência quando apropriado

RECURSOS DE EMERGÊNCIA:
- CVV: 188 (24h, gratuito)
- SAMU: 192
- Emergência: 190/193

TÉCNICAS DE REGULAÇÃO IMEDIATA:
{crisis_techniques}
`,
      contextualizations: [
        {
          condition: (ctx) => ctx.riskFactors.includes('ideacao_suicida'),
          modifications: [
            'ALERTA MÁXIMO: Histórico de ideação suicida',
            'Avalie imediatamente intenção e plano',
            'Encoraje contato com profissional de saúde mental'
          ]
        },
        {
          condition: (ctx) => ctx.riskFactors.includes('auto_lesao'),
          modifications: [
            'Cliente com histórico de autolesão',
            'Ofereça alternativas saudáveis de regulação emocional',
            'Monitore impulsos de autolesão'
          ]
        }
      ],
      adaptiveElements: {
        severity_based: {
          'mild': 'Foque em técnicas de autorregulação',
          'moderate': 'Combine suporte emocional com técnicas práticas',
          'severe': 'Priorize segurança e encaminhamento profissional'
        },
        progress_based: {
          'beginning': 'Use técnicas básicas de estabilização',
          'middle': 'Integre habilidades já aprendidas',
          'advanced': 'Relembre planos de enfrentamento desenvolvidos'
        },
        risk_based: {
          'low': 'Técnicas preventivas e de autorregulação',
          'medium': 'Monitoramento ativo e técnicas de contenção',
          'high': 'Intervenção imediata e encaminhamento profissional'
        }
      },
      examples: [
        'Crise de ansiedade: "Vamos focar na sua respiração agora..."',
        'Episódio depressivo: "Você não está sozinho(a) neste momento..."'
      ],
      constraints: [
        'NUNCA minimize uma crise',
        'SEMPRE encoraje busca por ajuda profissional',
        'Mantenha foco na segurança imediata'
      ]
    });

    // Template para Psicoeducação
    this.promptTemplates.set('psychoeducation', {
      id: 'psychoeducation',
      category: 'psychoeducation',
      baseTemplate: `
Forneça psicoeducação personalizada baseada no perfil e necessidades do cliente.

TÓPICO SOLICITADO: {topic}
CONTEXTO CLÍNICO: {clinical_context}
NÍVEL DE CONHECIMENTO ATUAL: {knowledge_level}

ESTRUTURA DA PSICOEDUCAÇÃO:
1. Explicação clara e acessível do conceito
2. Conexão com a experiência específica do cliente
3. Exemplos práticos e relevantes
4. Desmistificação de mitos ou concepções errôneas
5. Implicações para o tratamento
6. Recursos para aprofundamento

ADAPTAÇÕES:
- Linguagem apropriada ao nível educacional
- Exemplos relevantes ao contexto cultural
- Foco nos aspectos mais relevantes para este cliente
- Integração com objetivos terapêuticos atuais
`,
      contextualizations: [
        {
          condition: (ctx) => ctx.caseFormulation?.education_level === 'baixo',
          modifications: [
            'Use linguagem simples e evite jargões técnicos',
            'Utilize mais exemplos concretos e analogias'
          ]
        },
        {
          condition: (ctx) => ctx.caseFormulation?.cultural_background === 'conservador',
          modifications: [
            'Seja sensível a valores culturais e religiosos',
            'Adapte exemplos ao contexto cultural do cliente'
          ]
        }
      ],
      adaptiveElements: {
        severity_based: {
          'mild': 'Pode incluir informações mais detalhadas e nuançadas',
          'moderate': 'Foque nos aspectos mais relevantes para o tratamento',
          'severe': 'Mantenha informações essenciais e tranquilizadoras'
        },
        progress_based: {
          'beginning': 'Conceitos básicos e desmistificação',
          'middle': 'Aplicação prática no contexto terapêutico',
          'advanced': 'Refinamento e aprofundamento'
        },
        risk_based: {
          'low': 'Pode explorar aspectos mais complexos',
          'medium': 'Mantenha foco nos aspectos mais estabilizadores',
          'high': 'Apenas informações que promovam segurança'
        }
      },
      examples: [
        'Explicar ansiedade para cliente com TAG',
        'Psicoeducação sobre depressão e modelo cognitivo'
      ],
      constraints: [
        'Mantenha precisão científica',
        'Evite sobrecarga de informações',
        'Sempre conecte com a experiência do cliente'
      ]
    });
  }

  // Método principal para gerar prompts contextualizados
  generateContextualizedPrompt(
    request: PromptGenerationRequest,
    clinicalContext: UserClinicalContext
  ): GeneratedPrompt {
    const template = this.promptTemplates.get(request.category);
    if (!template) {
      throw new Error(`Template not found for category: ${request.category}`);
    }

    // Construir contexto clínico personalizado
    const contextString = this.buildClinicalContextString(clinicalContext);
    
    // Aplicar contextualizações condicionais
    const contextualInstructions = this.applyContextualizations(template, clinicalContext);
    
    // Selecionar elementos adaptativos
    const adaptiveElements = this.selectAdaptiveElements(template, clinicalContext);
    
    // Identificar focos terapêuticos
    const therapeuticFocus = this.identifyTherapeuticFocus(clinicalContext, request);
    
    // Gerar mitigações de risco
    const riskMitigations = this.generateRiskMitigations(clinicalContext);
    
    // Construir prompt final
    let systemPrompt = template.baseTemplate
      .replace('{clinical_context}', contextString)
      .replace('{therapeutic_goals}', clinicalContext.currentTherapeuticGoals.join(', '))
      .replace('{adaptive_elements}', adaptiveElements.join('\n'));

    // Adicionar contexto específico se fornecido
    if (request.specificContext) {
      systemPrompt += `\n\nCONTEXTO ESPECÍFICO DA INTERAÇÃO:\n${JSON.stringify(request.specificContext, null, 2)}`;
    }

    // Adicionar instruções contextuais
    if (contextualInstructions.length > 0) {
      systemPrompt += `\n\nINSTRUÇÕES CONTEXTUAIS ESPECIAIS:\n${contextualInstructions.join('\n')}`;
    }

    // Calcular nível de confiança
    const confidenceLevel = this.calculateConfidenceLevel(clinicalContext, request);

    return {
      systemPrompt,
      contextualInstructions,
      therapeuticFocus,
      riskMitigations,
      adaptiveResponse: true,
      confidenceLevel
    };
  }

  private buildClinicalContextString(context: UserClinicalContext): string {
    const parts = [];
    
    if (context.caseFormulation) {
      parts.push(`Formulação de Caso: ${JSON.stringify(context.caseFormulation, null, 2)}`);
    }
    
    if (context.assessmentHistory.length > 0) {
      const recent = context.assessmentHistory.slice(-3);
      parts.push(`Avaliações Recentes: ${recent.map(a => `${a.scaleId}: ${a.totalScore} (${a.severity})`).join(', ')}`);
    }
    
    if (context.moodTrends) {
      parts.push(`Tendências de Humor: ${JSON.stringify(context.moodTrends, null, 2)}`);
    }
    
    if (context.riskFactors.length > 0) {
      parts.push(`Fatores de Risco: ${context.riskFactors.join(', ')}`);
    }
    
    if (context.strengths.length > 0) {
      parts.push(`Pontos Fortes: ${context.strengths.join(', ')}`);
    }
    
    if (context.protocolProgress) {
      parts.push(`Protocolo Atual: ${context.protocolProgress.protocolName} - Fase: ${context.protocolProgress.currentPhase}`);
    }
    
    return parts.join('\n\n');
  }

  private applyContextualizations(
    template: ContextualizedPrompt, 
    context: UserClinicalContext
  ): string[] {
    const applicableInstructions: string[] = [];
    
    for (const contextualization of template.contextualizations) {
      if (contextualization.condition(context)) {
        applicableInstructions.push(...contextualization.modifications);
      }
    }
    
    return applicableInstructions;
  }

  private selectAdaptiveElements(
    template: ContextualizedPrompt, 
    context: UserClinicalContext
  ): string[] {
    const elements: string[] = [];
    
    // Determinar severidade atual
    const currentSeverity = this.getCurrentSeverity(context);
    if (template.adaptiveElements.severity_based[currentSeverity]) {
      elements.push(`Severidade (${currentSeverity}): ${template.adaptiveElements.severity_based[currentSeverity]}`);
    }
    
    // Determinar progresso terapêutico
    const progressStage = this.getProgressStage(context);
    if (template.adaptiveElements.progress_based[progressStage]) {
      elements.push(`Progresso (${progressStage}): ${template.adaptiveElements.progress_based[progressStage]}`);
    }
    
    // Determinar nível de risco
    const riskLevel = this.getRiskLevel(context);
    if (template.adaptiveElements.risk_based[riskLevel]) {
      elements.push(`Risco (${riskLevel}): ${template.adaptiveElements.risk_based[riskLevel]}`);
    }
    
    return elements;
  }

  private identifyTherapeuticFocus(
    context: UserClinicalContext, 
    request: PromptGenerationRequest
  ): string[] {
    const focus: string[] = [];
    
    // Base nos objetivos atuais
    focus.push(...context.currentTherapeuticGoals);
    
    // Base no protocolo atual
    if (context.protocolProgress) {
      focus.push(`Protocolo ${context.protocolProgress.protocolName}`);
    }
    
    // Base nas preferências
    if (context.preferences.focusAreas) {
      focus.push(...context.preferences.focusAreas);
    }
    
    // Base no contexto específico da requisição
    if (request.specificContext?.exerciseId) {
      focus.push(`Exercício específico: ${request.specificContext.exerciseId}`);
    }
    
    return focus;
  }

  private generateRiskMitigations(context: UserClinicalContext): string[] {
    const mitigations: string[] = [];
    
    for (const risk of context.riskFactors) {
      switch (risk) {
        case 'ideacao_suicida':
          mitigations.push('Monitorar sinais de ideação suicida e oferecer recursos de crise');
          break;
        case 'auto_lesao':
          mitigations.push('Oferecer alternativas saudáveis para regulação emocional');
          break;
        case 'abuso_substancias':
          mitigations.push('Considerar impacto do uso de substâncias no tratamento');
          break;
        case 'trauma_recente':
          mitigations.push('Usar abordagem sensível ao trauma');
          break;
        default:
          mitigations.push(`Atentar para fator de risco: ${risk}`);
      }
    }
    
    return mitigations;
  }

  private getCurrentSeverity(context: UserClinicalContext): string {
    if (context.assessmentHistory.length === 0) return 'unknown';
    
    const recent = context.assessmentHistory[context.assessmentHistory.length - 1];
    return recent.severity || 'mild';
  }

  private getProgressStage(context: UserClinicalContext): string {
    const totalExercises = context.exerciseProgress.length;
    const sessionCount = context.sessionContext?.currentSession || 0;
    
    if (totalExercises === 0 && sessionCount <= 3) return 'beginning';
    if (sessionCount <= 10) return 'middle';
    return 'advanced';
  }

  private getRiskLevel(context: UserClinicalContext): string {
    const highRiskFactors = ['ideacao_suicida', 'auto_lesao', 'abuso_substancias'];
    const hasHighRisk = context.riskFactors.some(risk => highRiskFactors.includes(risk));
    
    if (hasHighRisk) return 'high';
    if (context.riskFactors.length > 0) return 'medium';
    return 'low';
  }

  private calculateConfidenceLevel(
    context: UserClinicalContext, 
    request: PromptGenerationRequest
  ): number {
    let confidence = 0.5; // Base
    
    // Aumenta com mais dados disponíveis
    if (context.caseFormulation) confidence += 0.15;
    if (context.assessmentHistory.length > 0) confidence += 0.1;
    if (context.exerciseProgress.length > 0) confidence += 0.1;
    if (context.protocolProgress) confidence += 0.1;
    if (context.sessionContext) confidence += 0.05;
    
    // Ajusta baseado na categoria da requisição
    switch (request.category) {
      case 'crisis_support':
        confidence = Math.min(confidence, 0.8); // Nunca 100% confiante em crise
        break;
      case 'therapeutic_response':
        if (context.assessmentHistory.length >= 3) confidence += 0.05;
        break;
    }
    
    return Math.min(confidence, 0.95); // Máximo 95%
  }

  // Método para obter contexto clínico do usuário
  getUserClinicalContext(userId: string): UserClinicalContext {
    // Em implementação real, isso buscaria dados de múltiplas fontes
    const baseContext: UserClinicalContext = {
      userId,
      assessmentHistory: [],
      exerciseProgress: [],
      moodTrends: {},
      riskFactors: [],
      strengths: [],
      preferences: {
        communicationStyle: 'empathetic',
        focusAreas: []
      },
      currentTherapeuticGoals: []
    };

    // Buscar dados do localStorage para este demo
    try {
      // Case Formulation
      const caseFormulation = localStorage.getItem(`case_formulation_${userId}`);
      if (caseFormulation) {
        baseContext.caseFormulation = JSON.parse(caseFormulation);
      }

      // Assessment History  
      const assessmentKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`assessment_response_${userId}`)
      );
      baseContext.assessmentHistory = assessmentKeys.map(key => 
        JSON.parse(localStorage.getItem(key) || '{}')
      );

      // Exercise Progress
      const exerciseKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`exercise_progress_${userId}`)
      );
      baseContext.exerciseProgress = exerciseKeys.map(key => 
        JSON.parse(localStorage.getItem(key) || '{}')
      );

      // Protocol Progress
      const protocolKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`protocol_sessions_${userId}`)
      );
      if (protocolKeys.length > 0) {
        // Usar o protocolo mais recente
        const sessions = JSON.parse(localStorage.getItem(protocolKeys[0]) || '[]');
        if (sessions.length > 0) {
          baseContext.protocolProgress = sessions[sessions.length - 1];
        }
      }

      // Extrair fatores de risco e pontos fortes do case formulation
      if (baseContext.caseFormulation) {
        baseContext.riskFactors = baseContext.caseFormulation.risk_factors || [];
        baseContext.strengths = baseContext.caseFormulation.strengths || [];
        baseContext.currentTherapeuticGoals = baseContext.caseFormulation.therapeutic_goals || [];
      }

    } catch (error) {
      console.error('Erro ao carregar contexto clínico:', error);
    }

    return baseContext;
  }

  // Método para cache de contexto (otimização)
  private contextCache: Map<string, { context: UserClinicalContext; timestamp: number }> = new Map();

  getCachedUserContext(userId: string, maxAge: number = 300000): UserClinicalContext {
    const cached = this.contextCache.get(userId);
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.context;
    }

    const context = this.getUserClinicalContext(userId);
    this.contextCache.set(userId, { context, timestamp: Date.now() });
    return context;
  }
}

// Instância singleton do serviço
export const contextualizedAIService = new ContextualizedAIService();