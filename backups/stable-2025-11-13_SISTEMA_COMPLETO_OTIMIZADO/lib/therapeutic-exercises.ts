// lib/therapeutic-exercises.ts - Sistema de Exercícios Terapêuticos
// Biblioteca completa de exercícios baseados na formulação de caso e fase de tratamento

import { CaseFormulation } from './case-formulation';

export interface TherapeuticExercise {
  id: string;
  title: string;
  description: string;
  type: 'cognitive_restructuring' | 'behavioral_experiment' | 'mindfulness' | 'exposure' | 'homework' | 'reflection' | 'grounding' | 'activity_scheduling';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // em minutos
  phase: 1 | 2 | 3; // Fase do tratamento
  targetIssues: string[]; // Problemas que o exercício aborda
  cognitiveDistortions?: string[]; // Distorções específicas que trabalha
  instructions: ExerciseInstruction[];
  materials?: string[]; // Materiais necessários
  followUpQuestions: string[];
  successCriteria: string[];
  adaptations?: ExerciseAdaptation[];
}

export interface ExerciseInstruction {
  step: number;
  title: string;
  content: string;
  example?: string;
  tip?: string;
  timeEstimate?: number;
}

export interface ExerciseAdaptation {
  condition: string; // Ex: "alta ansiedade", "baixa motivação"
  modification: string;
}

export interface ExerciseCompletion {
  exerciseId: string;
  userId: string;
  sessionId?: string;
  completedAt: Date;
  timeSpent: number; // em minutos
  responses: Record<string, any>;
  difficulty: 1 | 2 | 3 | 4 | 5;
  helpfulness: 1 | 2 | 3 | 4 | 5;
  insights: string[];
  challenges: string[];
  nextSteps: string[];
}

export interface ExerciseRecommendation {
  exercise: TherapeuticExercise;
  relevanceScore: number; // 0-100
  reasoning: string;
  urgency: 'low' | 'medium' | 'high';
  prerequisites?: string[];
}

class TherapeuticExerciseService {
  private exercises: TherapeuticExercise[] = [
    // === EXERCÍCIOS FASE 1: ESTABILIZAÇÃO ===
    {
      id: 'thought-record-basic',
      title: 'Registro de Pensamentos Básico',
      description: 'Identifique e registre pensamentos automáticos em situações difíceis',
      type: 'cognitive_restructuring',
      difficulty: 'beginner',
      estimatedDuration: 15,
      phase: 1,
      targetIssues: ['pensamentos negativos', 'ansiedade', 'depressão', 'ruminação'],
      cognitiveDistortions: ['catastrofização', 'pensamento tudo-ou-nada', 'leitura mental'],
      instructions: [
        {
          step: 1,
          title: 'Identifique a Situação',
          content: 'Descreva brevemente a situação que trouxe desconforto emocional',
          example: 'Chegando atrasado ao trabalho',
          tip: 'Seja específico: quando, onde, quem estava presente'
        },
        {
          step: 2,
          title: 'Observe suas Emoções',
          content: 'Identifique e classifique as emoções que sentiu (0-10)',
          example: 'Ansiedade: 8/10, Vergonha: 6/10',
          tip: 'É normal sentir múltiplas emoções ao mesmo tempo'
        },
        {
          step: 3,
          title: 'Capture o Pensamento',
          content: 'Qual foi o pensamento automático que passou pela sua cabeça?',
          example: 'Vão me demitir por causa disso',
          tip: 'Anote exatamente como pensou, sem filtros'
        },
        {
          step: 4,
          title: 'Avalie a Evidência',
          content: 'Que evidências apoiam e contradizem este pensamento?',
          example: 'A favor: estou atrasado. Contra: já me atrasei antes e não fui demitido',
          tip: 'Seja como um detetive investigando os fatos'
        }
      ],
      materials: ['papel', 'caneta', 'smartphone para lembretes'],
      followUpQuestions: [
        'O que você aprendeu sobre seus padrões de pensamento?',
        'Houve algum pensamento que o surpreendeu?',
        'Como se sentiu ao questionar seus pensamentos automáticos?'
      ],
      successCriteria: [
        'Conseguiu identificar pensamentos específicos',
        'Reconheceu a conexão pensamento-emoção',
        'Encontrou pelo menos uma evidência contrária'
      ],
      adaptations: [
        {
          condition: 'alta ansiedade',
          modification: 'Comece com situações menos intensas (nível 3-5)'
        },
        {
          condition: 'dificuldade de concentração',
          modification: 'Use formato de áudio ou faça em etapas menores'
        }
      ]
    },
    {
      id: 'breathing-grounding',
      title: 'Técnica de Respiração 4-7-8',
      description: 'Exercício de respiração para reduzir ansiedade e promover calma',
      type: 'grounding',
      difficulty: 'beginner',
      estimatedDuration: 10,
      phase: 1,
      targetIssues: ['ansiedade', 'ataques de pânico', 'estresse', 'insônia'],
      instructions: [
        {
          step: 1,
          title: 'Posição Confortável',
          content: 'Sente-se confortavelmente com as costas retas ou deite-se',
          tip: 'Certifique-se de que não será interrompido'
        },
        {
          step: 2,
          title: 'Expire Completamente',
          content: 'Expire todo o ar dos pulmões através da boca',
          tip: 'Faça um som de "whoosh" ao expirar'
        },
        {
          step: 3,
          title: 'Inspire (4 tempos)',
          content: 'Feche a boca e inspire pelo nariz contando mentalmente até 4',
          timeEstimate: 4
        },
        {
          step: 4,
          title: 'Segure (7 tempos)',
          content: 'Segure a respiração contando mentalmente até 7',
          timeEstimate: 7
        },
        {
          step: 5,
          title: 'Expire (8 tempos)',
          content: 'Expire completamente pela boca contando até 8, fazendo som de "whoosh"',
          timeEstimate: 8
        },
        {
          step: 6,
          title: 'Repita o Ciclo',
          content: 'Repita este ciclo 3-4 vezes para começar',
          tip: 'Com a prática, pode aumentar para até 8 ciclos'
        }
      ],
      followUpQuestions: [
        'Como seu corpo se sente antes e depois do exercício?',
        'Você notou alguma mudança no seu nível de ansiedade?',
        'Em que situações você poderia usar esta técnica?'
      ],
      successCriteria: [
        'Completou pelo menos 3 ciclos completos',
        'Sentiu alguma redução na tensão física',
        'Conseguiu manter o foco na respiração'
      ]
    },

    // === EXERCÍCIOS FASE 2: INTERVENÇÃO ATIVA ===
    {
      id: 'behavioral-experiment',
      title: 'Experimento Comportamental',
      description: 'Teste suas crenças através de experimentos práticos controlados',
      type: 'behavioral_experiment',
      difficulty: 'intermediate',
      estimatedDuration: 30,
      phase: 2,
      targetIssues: ['evitação', 'crenças limitantes', 'ansiedade social', 'procrastinação'],
      instructions: [
        {
          step: 1,
          title: 'Identifique a Crença',
          content: 'Qual crença ou previsão você quer testar?',
          example: 'Se eu falar em público, vou fazer papel de bobo',
          tip: 'Escolha algo específico e mensurável'
        },
        {
          step: 2,
          title: 'Planeje o Experimento',
          content: 'Como você pode testar esta crença de forma segura?',
          example: 'Fazer uma pergunta em uma reunião pequena',
          tip: 'Comece pequeno e aumente gradualmente'
        },
        {
          step: 3,
          title: 'Faça uma Previsão',
          content: 'O que você acha que vai acontecer? (0-100% de certeza)',
          example: 'Vou gaguejar e as pessoas vão rir - 85% certo',
          tip: 'Seja específico sobre o que espera'
        },
        {
          step: 4,
          title: 'Execute o Experimento',
          content: 'Realize a ação planejada e observe o que realmente acontece',
          tip: 'Mantenha a mente aberta para resultados inesperados'
        },
        {
          step: 5,
          title: 'Avalie os Resultados',
          content: 'O que realmente aconteceu? Como isso se compara à sua previsão?',
          example: 'Fiz a pergunta normalmente, algumas pessoas concordaram',
          tip: 'Anote tanto os aspectos positivos quanto negativos'
        }
      ],
      followUpQuestions: [
        'O resultado foi diferente da sua previsão?',
        'Que evidências você coletou sobre sua crença?',
        'Como você se sente em relação a tentar novamente?',
        'O que você aprendeu sobre si mesmo?'
      ],
      successCriteria: [
        'Completou o experimento como planejado',
        'Coletou dados objetivos sobre o resultado',
        'Comparou o resultado com a previsão inicial',
        'Identificou pelo menos um aprendizado'
      ]
    },
    {
      id: 'activity-scheduling',
      title: 'Agenda de Atividades Prazerosas',
      description: 'Programe atividades que tragam prazer e senso de realização',
      type: 'activity_scheduling',
      difficulty: 'intermediate',
      estimatedDuration: 25,
      phase: 2,
      targetIssues: ['depressão', 'baixa energia', 'anedonia', 'isolamento'],
      instructions: [
        {
          step: 1,
          title: 'Liste Atividades Prazerosas',
          content: 'Faça uma lista de 10-15 atividades que você costumava gostar',
          example: 'Ler, caminhar, cozinhar, ouvir música, jardinar',
          tip: 'Inclua atividades pequenas e grandes'
        },
        {
          step: 2,
          title: 'Classifique por Prazer',
          content: 'Avalie cada atividade: quanto prazer ela te traria hoje? (0-10)',
          tip: 'Seja realista sobre seu estado atual'
        },
        {
          step: 3,
          title: 'Classifique por Facilidade',
          content: 'Avalie a facilidade de fazer cada atividade hoje (0-10)',
          tip: 'Considere tempo, energia e recursos necessários'
        },
        {
          step: 4,
          title: 'Selecione e Agende',
          content: 'Escolha 2-3 atividades e agende horários específicos esta semana',
          example: 'Segunda 19h: 20min de música. Quarta 16h: caminhada 15min',
          tip: 'Seja específico sobre quando e por quanto tempo'
        },
        {
          step: 5,
          title: 'Monitore e Ajuste',
          content: 'Após cada atividade, avalie prazer real (0-10) e energia (0-10)',
          tip: 'Use estes dados para ajustar sua próxima agenda'
        }
      ],
      followUpQuestions: [
        'Quais atividades trouxeram mais prazer que o esperado?',
        'Você notou algum padrão no seu humor antes/depois?',
        'Que obstáculos você encontrou e como pode superá-los?',
        'Como pode incorporar mais dessas atividades na rotina?'
      ],
      successCriteria: [
        'Completou pelo menos 2 das atividades programadas',
        'Registrou níveis de prazer e energia',
        'Identificou pelo menos uma atividade para repetir'
      ]
    },

    // === EXERCÍCIOS FASE 3: CONSOLIDAÇÃO ===
    {
      id: 'relapse-prevention-plan',
      title: 'Plano de Prevenção de Recaída',
      description: 'Desenvolva estratégias para manter o progresso e prevenir retrocessos',
      type: 'reflection',
      difficulty: 'advanced',
      estimatedDuration: 40,
      phase: 3,
      targetIssues: ['recaída', 'manutenção de progresso', 'autoeficácia'],
      instructions: [
        {
          step: 1,
          title: 'Reconheça Sinais Precoces',
          content: 'Identifique os primeiros sinais de que você pode estar voltando aos padrões antigos',
          example: 'Evitando ligações, dormindo mal, pensamentos de autocrítica',
          tip: 'Pense em sinais físicos, emocionais e comportamentais'
        },
        {
          step: 2,
          title: 'Identifique Fatores de Risco',
          content: 'Que situações ou épocas aumentam o risco de recaída?',
          example: 'Fim de ano, pressão no trabalho, conflitos familiares',
          tip: 'Inclua tanto fatores externos quanto internos'
        },
        {
          step: 3,
          title: 'Estratégias de Enfrentamento',
          content: 'Liste técnicas específicas que funcionaram para você',
          example: 'Respiração 4-7-8, registro de pensamentos, caminhada',
          tip: 'Inclua tanto estratégias imediatas quanto de longo prazo'
        },
        {
          step: 4,
          title: 'Rede de Apoio',
          content: 'Identifique pessoas que podem te ajudar em momentos difíceis',
          example: 'Maria (amiga), Dr. João (terapeuta), grupo de apoio',
          tip: 'Inclua contatos e como cada pessoa pode ajudar'
        },
        {
          step: 5,
          title: 'Plano de Ação',
          content: 'Crie um plano passo-a-passo para quando os sinais aparecerem',
          example: '1. Usar técnica de respiração 2. Ligar para Maria 3. Agendar sessão extra',
          tip: 'Torne o plano concreto e fácil de seguir'
        }
      ],
      followUpQuestions: [
        'Como você se sente sobre sua capacidade de manter o progresso?',
        'Que recursos você descobriu que não sabia que tinha?',
        'Como pode tornar este plano facilmente acessível?',
        'Quando você vai revisar e atualizar este plano?'
      ],
      successCriteria: [
        'Criou uma lista completa de sinais precoces',
        'Identificou pelo menos 5 estratégias de enfrentamento',
        'Desenvolveu um plano de ação específico',
        'Estabeleceu uma rede de apoio com contatos'
      ]
    },

    // === EXERCÍCIOS ESPECIALIZADOS ===
    {
      id: 'exposure-hierarchy',
      title: 'Escada de Exposição Gradual',
      description: 'Enfrente seus medos de forma gradual e sistemática',
      type: 'exposure',
      difficulty: 'advanced',
      estimatedDuration: 35,
      phase: 2,
      targetIssues: ['fobias', 'ansiedade social', 'evitação', 'ataques de pânico'],
      instructions: [
        {
          step: 1,
          title: 'Identifique o Medo Principal',
          content: 'Qual é a situação que você mais evita ou teme?',
          example: 'Falar em público para uma plateia grande',
          tip: 'Seja específico sobre o que exatamente te assusta'
        },
        {
          step: 2,
          title: 'Crie uma Escada',
          content: 'Liste 8-10 situações relacionadas, do menos ao mais assustador',
          example: '1. Ler em voz alta sozinho 2. Falar com 1 pessoa 3. Grupo de 3 pessoas...',
          tip: 'Cada degrau deve ser um pouco mais desafiador que o anterior'
        },
        {
          step: 3,
          title: 'Avalie a Ansiedade',
          content: 'Para cada situação, estime o nível de ansiedade (0-100)',
          tip: 'Use incrementos de 10-15 pontos entre os degraus'
        },
        {
          step: 4,
          title: 'Comece pelo Primeiro Degrau',
          content: 'Pratique a situação menos assustadora até a ansiedade diminuir 50%',
          tip: 'Não passe para o próximo degrau até dominar o atual'
        },
        {
          step: 5,
          title: 'Suba Gradualmente',
          content: 'Continue subindo a escada, um degrau por vez',
          tip: 'É normal sentir ansiedade - o objetivo é enfrentar, não evitar'
        }
      ],
      followUpQuestions: [
        'Como seu nível de ansiedade mudou durante o exercício?',
        'Você descobriu que algumas situações eram menos assustadoras que imaginou?',
        'Que estratégias de enfrentamento funcionaram melhor?',
        'Como se sente sobre enfrentar o próximo degrau?'
      ],
      successCriteria: [
        'Criou uma hierarquia com pelo menos 8 situações',
        'Completou com sucesso pelo menos 2 degraus',
        'Registrou níveis de ansiedade antes e depois',
        'Identificou progressos específicos'
      ]
    },
    {
      id: 'mindful-observation',
      title: 'Observação Mindful do Ambiente',
      description: 'Pratique atenção plena observando seu ambiente com os 5 sentidos',
      type: 'mindfulness',
      difficulty: 'beginner',
      estimatedDuration: 15,
      phase: 1,
      targetIssues: ['ansiedade', 'ruminação', 'estresse', 'desconexão'],
      instructions: [
        {
          step: 1,
          title: 'Encontre um Local',
          content: 'Escolha um lugar onde possa se sentar confortavelmente por 10 minutos',
          tip: 'Pode ser interno ou externo - o importante é se sentir seguro'
        },
        {
          step: 2,
          title: '5 Coisas que Você Vê',
          content: 'Observe atentamente 5 coisas visíveis, notando cores, formas, texturas',
          example: 'A cor azul da caneta, o formato irregular da nuvem...',
          timeEstimate: 2
        },
        {
          step: 3,
          title: '4 Coisas que Você Ouve',
          content: 'Identifique 4 sons diferentes, próximos e distantes',
          example: 'Carros passando, pássaros, ar condicionado, respiração',
          timeEstimate: 2
        },
        {
          step: 4,
          title: '3 Coisas que Você Sente',
          content: 'Notice 3 sensações físicas ou texturas que pode tocar',
          example: 'Temperatura do ar, textura da roupa, dureza da cadeira',
          timeEstimate: 2
        },
        {
          step: 5,
          title: '2 Coisas que Você Cheira',
          content: 'Identifique 2 aromas no ambiente',
          example: 'Perfume, café, ar fresco',
          timeEstimate: 2
        },
        {
          step: 6,
          title: '1 Coisa que Você Saboreia',
          content: 'Perceba algum sabor na boca ou tome um gole de água mindfully',
          timeEstimate: 2
        }
      ],
      followUpQuestions: [
        'Como sua mente se sentia antes e depois do exercício?',
        'Você descobriu algo novo sobre o ambiente?',
        'Quando sua mente vagou, como foi redirecioná-la?',
        'Em que situações esta técnica pode ser útil?'
      ],
      successCriteria: [
        'Completou todos os passos sensoriais',
        'Permaneceu presente por pelo menos 10 minutos',
        'Notou a diferença no estado mental'
      ]
    }
  ];

  // Gerar recomendações baseadas na formulação de caso
  generateRecommendations(formulation: CaseFormulation, phase: 1 | 2 | 3 = 1): ExerciseRecommendation[] {
    const recommendations: ExerciseRecommendation[] = [];
    
    // Filtrar exercícios por fase
    const phaseExercises = this.exercises.filter(ex => ex.phase <= phase);
    
    for (const exercise of phaseExercises) {
      let relevanceScore = 0;
      let reasoning = '';
      let urgency: 'low' | 'medium' | 'high' = 'low';
      
      // Pontuar baseado em problemas apresentados
      if (formulation.presentingProblems?.primary) {
        const matchingIssues = exercise.targetIssues.filter(issue =>
          formulation.presentingProblems.primary.some(problem =>
            problem.toLowerCase().includes(issue.toLowerCase()) ||
            issue.toLowerCase().includes(problem.toLowerCase())
          )
        );
        
        if (matchingIssues.length > 0) {
          relevanceScore += 30 * matchingIssues.length;
          reasoning += `Aborda diretamente: ${matchingIssues.join(', ')}. `;
        }
      }
      
      // Pontuar baseado em distorções cognitivas
      if (formulation.perpetuatingFactors?.cognitive?.cognitive_distortions && exercise.cognitiveDistortions) {
        const matchingDistortions = exercise.cognitiveDistortions.filter(distortion =>
          formulation.perpetuatingFactors.cognitive.cognitive_distortions.includes(distortion)
        );
        
        if (matchingDistortions.length > 0) {
          relevanceScore += 20 * matchingDistortions.length;
          reasoning += `Trabalha distorções: ${matchingDistortions.join(', ')}. `;
        }
      }
      
      // Ajustar por severidade
      if (formulation.presentingProblems?.severity >= 8) {
        if (exercise.difficulty === 'beginner') relevanceScore += 15;
        urgency = 'high';
      } else if (formulation.presentingProblems?.severity >= 6) {
        if (exercise.difficulty === 'intermediate') relevanceScore += 10;
        urgency = 'medium';
      }
      
      // Ajustar por fase de tratamento
      if (exercise.phase === phase) {
        relevanceScore += 10;
        reasoning += `Apropriado para fase ${phase} do tratamento. `;
      }
      
      // Só incluir se tiver relevância mínima
      if (relevanceScore >= 20) {
        recommendations.push({
          exercise,
          relevanceScore: Math.min(relevanceScore, 100),
          reasoning: reasoning.trim(),
          urgency
        });
      }
    }
    
    // Ordenar por relevância
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6); // Top 6 recomendações
  }
  
  // Obter exercício por ID
  getExerciseById(id: string): TherapeuticExercise | undefined {
    return this.exercises.find(ex => ex.id === id);
  }
  
  // Filtrar exercícios
  filterExercises(filters: {
    phase?: 1 | 2 | 3;
    type?: string;
    difficulty?: string;
    targetIssue?: string;
  }): TherapeuticExercise[] {
    return this.exercises.filter(exercise => {
      if (filters.phase && exercise.phase !== filters.phase) return false;
      if (filters.type && exercise.type !== filters.type) return false;
      if (filters.difficulty && exercise.difficulty !== filters.difficulty) return false;
      if (filters.targetIssue && !exercise.targetIssues.includes(filters.targetIssue)) return false;
      return true;
    });
  }
  
  // Salvar conclusão de exercício
  saveExerciseCompletion(completion: ExerciseCompletion): void {
    const key = `exercise_completion_${completion.userId}_${completion.exerciseId}_${completion.completedAt.getTime()}`;
    localStorage.setItem(key, JSON.stringify(completion));
  }
  
  // Obter histórico de conclusões
  getExerciseHistory(userId: string): ExerciseCompletion[] {
    const completions: ExerciseCompletion[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`exercise_completion_${userId}_`)) {
        try {
          const completion = JSON.parse(localStorage.getItem(key) || '{}');
          completion.completedAt = new Date(completion.completedAt);
          completions.push(completion);
        } catch (error) {
          console.error('Erro ao carregar conclusão de exercício:', error);
        }
      }
    }
    
    return completions.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }
  
  // Obter estatísticas de progresso
  getProgressStats(userId: string): {
    totalCompleted: number;
    averageHelpfulness: number;
    favoriteTypes: string[];
    weeklyProgress: number[];
  } {
    const history = this.getExerciseHistory(userId);
    
    if (history.length === 0) {
      return {
        totalCompleted: 0,
        averageHelpfulness: 0,
        favoriteTypes: [],
        weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
      };
    }
    
    // Calcular média de utilidade
    const avgHelpfulness = history.reduce((sum, h) => sum + h.helpfulness, 0) / history.length;
    
    // Tipos favoritos (mais realizados)
    const typeCount: Record<string, number> = {};
    history.forEach(h => {
      const exercise = this.getExerciseById(h.exerciseId);
      if (exercise) {
        typeCount[exercise.type] = (typeCount[exercise.type] || 0) + 1;
      }
    });
    
    const favoriteTypes = Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
    
    // Progresso semanal (últimos 7 dias)
    const weeklyProgress = new Array(7).fill(0);
    const today = new Date();
    
    history.forEach(h => {
      const daysDiff = Math.floor((today.getTime() - h.completedAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0 && daysDiff < 7) {
        weeklyProgress[6 - daysDiff]++;
      }
    });
    
    return {
      totalCompleted: history.length,
      averageHelpfulness: Math.round(avgHelpfulness * 100) / 100,
      favoriteTypes,
      weeklyProgress
    };
  }
}

export const therapeuticExerciseService = new TherapeuticExerciseService();