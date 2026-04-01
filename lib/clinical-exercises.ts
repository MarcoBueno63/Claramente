// Exercícios Clínicos Completos Baseados no DSM-5-TR e TCC

export interface ClinicalExercise {
  id: string;
  name: string;
  relatedProtocols: string[]; // Códigos DSM-5
  relatedTechniques: string[]; // IDs das técnicas
  category: 'self-assessment' | 'cognitive' | 'behavioral' | 'exposure' | 'mindfulness' | 'interpersonal';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  duration: string;
  description: string;
  instructions: string[];
  materials?: string[];
  homework?: string;
  contraindicationsWarnings?: string[];
  targetSymptoms: string[];
  expectedOutcomes: string[];
  followUpQuestions: string[];
}

const CLINICAL_EXERCISES: ClinicalExercise[] = [
  // EXERCÍCIOS PARA TRANSTORNOS DE ANSIEDADE
  {
    id: 'hierarchy_exposure_phobia',
    name: 'Hierarquia de Exposição para Fobias',
    relatedProtocols: ['F40.10', 'F40.00'], // Fobias específicas e agorafobia
    relatedTechniques: ['exposicao_gradual', 'dessensibilizacao_sistematica'],
    category: 'exposure',
    difficulty: 'intermediate',
    duration: '45-60 minutos',
    description: 'Construção de uma hierarquia personalizada de situações temidas para exposição gradual',
    instructions: [
      '1. Liste todas as situações relacionadas ao seu medo específico',
      '2. Classifique cada situação de 0-100 baseado no nível de ansiedade que gera',
      '3. Organize as situações em ordem crescente de dificuldade',
      '4. Identifique 3-5 situações para cada faixa (0-25, 26-50, 51-75, 76-100)',
      '5. Comece praticando exposição com itens de ansiedade baixa (0-25)',
      '6. Permaneça na situação até a ansiedade diminuir pelo menos 50%',
      '7. Pratique a mesma situação múltiplas vezes antes de avançar',
      '8. Registre seus níveis de ansiedade antes, durante e após cada exposição'
    ],
    materials: ['Formulário de hierarquia', 'Escala de ansiedade 0-100', 'Cronômetro'],
    homework: 'Praticar diariamente situações do nível atual da hierarquia por 15-30 minutos',
    targetSymptoms: ['evitação fóbica', 'ansiedade antecipatória', 'ataques de pânico situacionais'],
    expectedOutcomes: ['Redução da evitação', 'Diminuição da ansiedade', 'Aumento da autoconfiança'],
    followUpQuestions: [
      'Quais situações foram mais fáceis/difíceis que o esperado?',
      'Que estratégias de enfrentamento funcionaram melhor?',
      'Como você se sentiu após completar cada nível?'
    ]
  },

  {
    id: 'worry_time_technique',
    name: 'Técnica do Tempo de Preocupação',
    relatedProtocols: ['F41.1'], // TAG
    relatedTechniques: ['reestruturacao_cognitiva', 'controle_estimulos'],
    category: 'cognitive',
    difficulty: 'basic',
    duration: '20-30 minutos',
    description: 'Delimitar um período específico para preocupações, reduzindo ruminação ao longo do dia',
    instructions: [
      '1. Escolha um horário fixo de 20 minutos por dia para se preocupar',
      '2. Durante o dia, anote preocupações que surgirem sem elaborá-las',
      '3. Diga a si mesmo: "Vou pensar nisso no meu tempo de preocupação"',
      '4. No horário estabelecido, revise sua lista de preocupações',
      '5. Para cada preocupação, pergunte: "Posso fazer algo sobre isso agora?"',
      '6. Se sim, elabore um plano de ação específico',
      '7. Se não, pratique técnicas de aceitação e mindfulness',
      '8. Após 20 minutos, pare mesmo que não tenha terminado'
    ],
    homework: 'Manter diário de preocupações e praticar técnica diariamente por 2 semanas',
    targetSymptoms: ['preocupação excessiva', 'ruminação', 'ansiedade difusa'],
    expectedOutcomes: ['Redução da ruminação diária', 'Maior sensação de controle', 'Diminuição da ansiedade geral'],
    followUpQuestions: [
      'Quantas preocupações você conseguiu resolver com planos de ação?',
      'Foi difícil interromper as preocupações fora do horário estabelecido?',
      'Como se sentiu tendo um tempo específico para se preocupar?'
    ]
  },

  {
    id: 'interoceptive_exposure',
    name: 'Exposição Interoceptiva para Pânico',
    relatedProtocols: ['F41.0'], // Transtorno de Pânico
    relatedTechniques: ['exposicao_interoceptiva', 'reestruturacao_cognitiva'],
    category: 'exposure',
    difficulty: 'advanced',
    duration: '30-45 minutos',
    description: 'Exposição controlada a sensações corporais que simulam sintomas de pânico',
    instructions: [
      '1. Avalie nível de ansiedade basal (0-100)',
      '2. Escolha um exercício para induzir sensações corporais:',
      '   • Respirar através de um canudo por 2 minutos (sensação de sufocamento)',
      '   • Respirar rapidamente por 30 segundos (hiperventilação)',
      '   • Correr no lugar por 1 minuto (palpitações)',
      '   • Girar em uma cadeira por 30 segundos (tontura)',
      '   • Tensionar todos os músculos por 1 minuto (tensão)',
      '3. Durante o exercício, monitore sensações e ansiedade',
      '4. Continue até ansiedade atingir pico e começar a diminuir',
      '5. Pratique respiração diafragmática após o exercício',
      '6. Registre: sensações experimentadas, pico de ansiedade, pensamentos'
    ],
    contraindicationsWarnings: [
      'Não realizar com problemas cardíacos ou respiratórios',
      'Interromper se houver sintomas médicos reais',
      'Supervisão terapêutica recomendada inicialmente'
    ],
    targetSymptoms: ['medo de sensações corporais', 'ataques de pânico', 'evitação de atividades físicas'],
    expectedOutcomes: ['Redução do medo de sensações corporais', 'Menor intensidade dos ataques de pânico', 'Maior tolerância à ativação fisiológica'],
    followUpQuestions: [
      'Quais sensações foram mais/menos assustadoras que o esperado?',
      'Conseguiu permanecer no exercício mesmo com ansiedade alta?',
      'Notou diferença entre sensações induzidas e ataques de pânico reais?'
    ]
  },

  // EXERCÍCIOS PARA TRANSTORNOS DEPRESSIVOS
  {
    id: 'behavioral_activation_schedule',
    name: 'Agenda de Ativação Comportamental',
    relatedProtocols: ['F32.9', 'F33.9'], // Episódio Depressivo Maior e Depressão Recorrente
    relatedTechniques: ['ativacao_comportamental', 'agendamento_atividades'],
    category: 'behavioral',
    difficulty: 'basic',
    duration: '30-45 minutos',
    description: 'Planejamento estruturado de atividades prazerosas e significativas',
    instructions: [
      '1. Divida suas atividades em 4 categorias:',
      '   • Necessárias (trabalho, higiene, alimentação)',
      '   • Prazerosas (hobbies, entretenimento)',
      '   • Significativas (valores pessoais, relacionamentos)',
      '   • Físicas (exercício, caminhada)',
      '2. Avalie seu nível atual de atividade em cada categoria (0-10)',
      '3. Identifique atividades específicas que costumava gostar',
      '4. Escolha 2-3 atividades pequenas para a próxima semana',
      '5. Agende horários específicos para cada atividade',
      '6. Comece com atividades de 15-30 minutos',
      '7. Após cada atividade, registre humor (0-10) e senso de realização (0-10)'
    ],
    homework: 'Seguir agenda diariamente e registrar humor antes/depois das atividades',
    targetSymptoms: ['anedonia', 'baixa energia', 'isolamento social', 'sentimentos de inutilidade'],
    expectedOutcomes: ['Aumento do humor', 'Maior senso de realização', 'Redução do isolamento'],
    followUpQuestions: [
      'Quais atividades geraram maior melhora no humor?',
      'Foi difícil se motivar para as atividades planejadas?',
      'Notou diferença entre atividades prazerosas e significativas?'
    ]
  },

  {
    id: 'thought_record_depression',
    name: 'Registro de Pensamentos para Depressão',
    relatedProtocols: ['F32.9', 'F34.1'], // Depressão Maior e Distimia
    relatedTechniques: ['registro_pensamentos', 'reestruturacao_cognitiva'],
    category: 'cognitive',
    difficulty: 'intermediate',
    duration: '20-30 minutos',
    description: 'Identificação e questionamento de pensamentos automáticos negativos',
    instructions: [
      '1. Identifique uma situação que gerou humor deprimido',
      '2. Registre a emoção específica e intensidade (0-100)',
      '3. Capture o pensamento automático exato que passou pela mente',
      '4. Identifique o tipo de distorção cognitiva presente',
      '5. Examine as evidências que apoiam o pensamento',
      '6. Examine as evidências que contradizem o pensamento',
      '7. Considere perspectivas alternativas mais equilibradas',
      '8. Formule um pensamento mais realista e útil',
      '9. Reavalie a intensidade da emoção com o novo pensamento'
    ],
    homework: 'Completar 1 registro por dia focando em momentos de humor mais baixo',
    targetSymptoms: ['pensamentos negativos automáticos', 'autocrítica', 'desesperança', 'culpa excessiva'],
    expectedOutcomes: ['Identificação de padrões de pensamento', 'Desenvolvimento de perspectivas alternativas', 'Redução da intensidade emocional'],
    followUpQuestions: [
      'Que padrões você notou em seus pensamentos automáticos?',
      'Quais evidências contrárias foram mais convincentes?',
      'Como se sentiu após desenvolver pensamentos alternativos?'
    ]
  },

  // EXERCÍCIOS PARA TOC
  {
    id: 'erp_contamination',
    name: 'Exposição e Prevenção de Resposta - Contaminação',
    relatedProtocols: ['F42.9'], // TOC
    relatedTechniques: ['exposicao_prevencao_resposta', 'exposicao_gradual'],
    category: 'exposure',
    difficulty: 'advanced',
    duration: '60-90 minutos',
    description: 'Exposição gradual a situações de "contaminação" com prevenção de lavagem/limpeza',
    instructions: [
      '1. Crie hierarquia de situações de contaminação (0-100)',
      '2. Comece com item de ansiedade moderada (40-60)',
      '3. Toque o objeto/superfície "contaminada" por tempo suficiente',
      '4. Monitore nível de ansiedade a cada 5 minutos',
      '5. NÃO lave as mãos ou realize rituais de limpeza',
      '6. Continue exposição até ansiedade diminuir 50% ou 2 horas',
      '7. Toque outras superfícies "limpas" com as mãos "contaminadas"',
      '8. Registre pico de ansiedade e tempo para redução',
      '9. Repita mesma exposição até ansiedade inicial ser <30'
    ],
    contraindicationsWarnings: [
      'Não usar substâncias realmente perigosas',
      'Supervisão terapêutica essencial inicialmente',
      'Ter plano de apoio para níveis extremos de ansiedade'
    ],
    targetSymptoms: ['obsessões de contaminação', 'compulsões de lavagem', 'evitação de objetos/lugares'],
    expectedOutcomes: ['Redução da ansiedade de contaminação', 'Diminuição de compulsões', 'Maior funcionalidade diária'],
    followUpQuestions: [
      'Quanto tempo levou para a ansiedade diminuir significativamente?',
      'Conseguiu resistir aos impulsos de lavar/limpar?',
      'Notou que as consequências temidas não ocorreram?'
    ]
  },

  // EXERCÍCIOS PARA PTSD
  {
    id: 'trauma_narrative',
    name: 'Narrativa Detalhada do Trauma',
    relatedProtocols: ['F43.10', 'F43.11'], // PTSD
    relatedTechniques: ['exposicao_narrativa', 'processamento_cognitivo'],
    category: 'exposure',
    difficulty: 'advanced',
    duration: '45-60 minutos',
    description: 'Reconto detalhado do evento traumático para processamento e integração',
    instructions: [
      '1. Prepare ambiente seguro e apoio terapêutico disponível',
      '2. Comece com relaxamento e técnicas de grounding',
      '3. Narre o trauma em primeira pessoa, tempo presente',
      '4. Inclua detalhes sensoriais: visões, sons, cheiros, sensações',
      '5. Descreva pensamentos e emoções durante o evento',
      '6. Foque nas partes mais perturbadoras sem evitar',
      '7. Continue até SUD (angústia subjetiva) diminuir 50%',
      '8. Termine com grounding e autocuidado',
      '9. Processe significados e crenças que emergiram'
    ],
    contraindicationsWarnings: [
      'APENAS sob supervisão de terapeuta especializado em trauma',
      'Avaliar estabilização emocional antes de iniciar',
      'Ter protocolo de segurança para dissociação/flashbacks',
      'Não realizar se houver ideação suicida ativa'
    ],
    targetSymptoms: ['reexperiência traumática', 'evitação de memórias', 'fragmentação da memória'],
    expectedOutcomes: ['Integração da memória traumática', 'Redução de flashbacks', 'Processamento emocional'],
    followUpQuestions: [
      'Que novos detalhes ou perspectivas emergiram?',
      'Como se sentiu diferente ao final em relação ao início?',
      'Que significados ou crenças sobre o trauma mudaram?'
    ]
  },

  // EXERCÍCIOS PARA TRANSTORNOS ALIMENTARES
  {
    id: 'meal_plan_exposure',
    name: 'Exposição Alimentar Estruturada',
    relatedProtocols: ['F50.00', 'F50.02'], // Anorexia e Bulimia
    relatedTechniques: ['exposicao_alimentos', 'reestruturacao_cognitiva_corporal'],
    category: 'exposure',
    difficulty: 'intermediate',
    duration: '60-90 minutos',
    description: 'Exposição gradual a alimentos temidos com processamento de ansiedade e cognições',
    instructions: [
      '1. Identifique alimento com ansiedade moderada (5-7/10)',
      '2. Prepare porção normal em ambiente supervisionado',
      '3. Registre ansiedade e pensamentos antes de comer',
      '4. Consuma alimento lentamente, mindfully',
      '5. Monitore ansiedade e urges compensatórios durante e após',
      '6. Identifique pensamentos automáticos sobre comida/corpo',
      '7. Questione evidências para medos sobre o alimento',
      '8. Permaneça sem comportamentos compensatórios por 2-3 horas',
      '9. Registre insights e mudanças na ansiedade'
    ],
    contraindicationsWarnings: [
      'Supervisão médica/nutricional obrigatória',
      'Monitorar sinais vitais se necessário',
      'Ter suporte para prevenção de comportamentos compensatórios'
    ],
    targetSymptoms: ['medo de alimentos específicos', 'rituais alimentares', 'comportamentos compensatórios'],
    expectedOutcomes: ['Redução do medo alimentar', 'Normalização da alimentação', 'Diminuição de comportamentos compensatórios'],
    followUpQuestions: [
      'Quais medos sobre o alimento se confirmaram ou não?',
      'Como foi a experiência de comer mindfully?',
      'Que estratégias ajudaram a resistir comportamentos compensatórios?'
    ]
  },

  // EXERCÍCIOS PARA TRANSTORNOS DO SONO
  {
    id: 'sleep_restriction_protocol',
    name: 'Protocolo de Restrição do Sono',
    relatedProtocols: ['F51.01'], // Insônia
    relatedTechniques: ['restricao_sono', 'controle_estimulos'],
    category: 'behavioral',
    difficulty: 'intermediate',
    duration: '30 minutos (planejamento) + implementação contínua',
    description: 'Limitação do tempo na cama para aumentar eficiência do sono',
    instructions: [
      '1. Calcule tempo médio de sono da última semana (excluindo tempo acordado na cama)',
      '2. Adicione 15 minutos ao tempo médio de sono',
      '3. Estabeleça horário fixo de despertar (mesmo aos fins de semana)',
      '4. Calcule horário de deitar subtraindo tempo permitido do horário de despertar',
      '5. Vá para cama APENAS no horário calculado',
      '6. Levante no horário fixo independente de quanto dormiu',
      '7. Calcule eficiência do sono: (tempo dormindo/tempo na cama) x 100',
      '8. Se eficiência ≥85% por 5 dias, adicione 15 min ao tempo na cama',
      '9. Se eficiência <80%, remova 15 min do tempo na cama',
      '10. Continue ajustando até eficiência estável ≥85%'
    ],
    contraindicationsWarnings: [
      'Não usar com transtorno bipolar (pode precipitar mania)',
      'Cuidado com profissões que requerem alerta máximo',
      'Monitorar sonolência diurna excessiva'
    ],
    targetSymptoms: ['insônia de iniciação', 'insônia de manutenção', 'sono fragmentado'],
    expectedOutcomes: ['Aumento da eficiência do sono', 'Redução do tempo para adormecer', 'Sono mais consolidado'],
    followUpQuestions: [
      'Como foi seguir o horário restrito de sono?',
      'Notou diferença na qualidade do sono?',
      'Que desafios encontrou na implementação?'
    ]
  },

  // EXERCÍCIOS DBT (Dialectical Behavior Therapy)
  {
    id: 'dbt-mindfulness-basico',
    name: 'DBT - Mindfulness Básico (Observe, Descreva, Participe)',
    category: 'mindfulness',
    difficulty: 'basic',
    duration: '15 minutos',
    description: 'Prática das três habilidades centrais de mindfulness da DBT para aumentar consciência presente',
    instructions: [
      '🎯 **OBSERVE (5 min)**: Sente-se confortavelmente. Apenas observe tudo ao seu redor sem tentar mudar nada. Sons, sensações, pensamentos que aparecem e passam.',
      '📝 **DESCREVA (5 min)**: Coloque em palavras o que observa: "Estou ouvindo um carro... sinto meus pés no chão... percebo um pensamento sobre o jantar..."',
      '🎭 **PARTICIPE (5 min)**: Escolha uma atividade simples (beber água, tocar objeto) e mergulhe completamente. Seja apenas a atividade.'
    ],
    targetSymptoms: ['impulsividade', 'dissociação', 'confusão emocional', 'reatividade'],
    expectedOutcomes: ['Maior consciência presente', 'Redução da reatividade emocional', 'Diminuição da dissociação'],
    followUpQuestions: [
      'Qual das três habilidades foi mais fácil/difícil?',
      'Como se sentiu ao final do exercício?',
      'Conseguiu perceber diferença na sua reatividade?'
    ],
    relatedProtocols: ['F60.3'],
    relatedTechniques: ['dbt_mindfulness']
  },

  {
    id: 'dbt-tipp-crise',
    name: 'DBT - TIPP para Sobrevivência à Crise',
    category: 'behavioral',
    difficulty: 'intermediate',
    duration: '10 minutos',
    description: 'Técnica de emergência para sobreviver a crises emocionais intensas',
    instructions: [
      '🧊 **T-TEMPERATURA**: Segure cubos de gelo ou lave rosto com água fria por 30 segundos (muda química cerebral)',
      '🏃 **I-INTENSO EXERCÍCIO**: Polichinelos, flexões ou correr no lugar por 2-3 minutos (queima adrenalina)',
      '🫁 **P-RESPIRAÇÃO PAUSADA**: Inspire 4, segure 2, expire 6. Repita 10 vezes',
      '💪 **P-RELAXAMENTO MUSCULAR**: Tensione e relaxe cada grupo muscular por 5 segundos'
    ],
    targetSymptoms: ['crise emocional', 'impulso de autolesão', 'raiva intensa', 'pânico'],
    expectedOutcomes: ['Redução rápida da intensidade emocional', 'Prevenção de comportamentos impulsivos', 'Estabilização fisiológica'],
    followUpQuestions: [
      'Qual técnica TIPP foi mais eficaz?',
      'Quanto diminuiu a intensidade emocional (0-10)?',
      'Conseguiu evitar comportamentos impulsivos?'
    ],
    relatedProtocols: ['F60.3'],
    relatedTechniques: ['dbt_tolerancia_angustia']
  },

  // EXERCÍCIOS ACT (Acceptance and Commitment Therapy)
  {
    id: 'act-folhas-no-rio',
    name: 'ACT - Exercício das Folhas no Rio',
    category: 'mindfulness',
    difficulty: 'basic',
    duration: '15 minutos',
    description: 'Técnica de defusão cognitiva para reduzir impacto de pensamentos dolorosos',
    instructions: [
      '🏞️ **VISUALIZAÇÃO**: Feche os olhos. Imagine-se na margem de um rio calmo com folhas flutuando',
      '🍃 **PENSAMENTOS EM FOLHAS**: Quando pensamento difícil aparecer, coloque-o gentilmente em uma folha',
      '👁️ **OBSERVAÇÃO**: Veja a folha (com seu pensamento) flutuando rio abaixo, sem empurrar ou agarrar',
      '🔄 **REPETIÇÃO**: Continue 10-15 minutos, colocando cada pensamento em uma folha'
    ],
    targetSymptoms: ['pensamentos obsessivos', 'ruminação', 'fusão cognitiva', 'luto complicado'],
    expectedOutcomes: ['Redução do impacto emocional de pensamentos', 'Maior distanciamento de cognições', 'Diminuição da ruminação'],
    followUpQuestions: [
      'Conseguiu visualizar as folhas no rio?',
      'Foi difícil "deixar ir" algum pensamento específico?',
      'Como se sente em relação aos pensamentos agora?'
    ],
    relatedProtocols: ['F43.81-ACT'],
    relatedTechniques: ['act_defusao_cognitiva']
  },

  {
    id: 'act-valores-luto',
    name: 'ACT - Clarificação de Valores Após Perda',
    category: 'interpersonal',
    difficulty: 'intermediate',
    duration: '30 minutos',
    description: 'Reconexão com valores importantes após perda, honrando a memória',
    instructions: [
      '💝 **VALORES COMPARTILHADOS (5 min)**: Escreva sobre a pessoa perdida: que valores ela representava?',
      '📝 **LISTA DE VALORES (5 min)**: Liste 3-5 valores importantes para vocês dois (família, bondade, coragem)',
      '💭 **REFLEXÃO (10 min)**: Para cada valor: "Como posso honrar esse valor hoje, mesmo sentindo dor?"',
      '🎯 **AÇÃO CONCRETA (10 min)**: Escolha UMA pequena ação para hoje que represente um valor'
    ],
    targetSymptoms: ['perda de sentido', 'desconexão de valores', 'luto complicado', 'falta de direção'],
    expectedOutcomes: ['Reconexão com propósito', 'Vínculo saudável com pessoa perdida', 'Direção baseada em valores'],
    followUpQuestions: [
      'Que valores ficaram mais claros?',
      'Como se sentiu ao pensar em honrar esses valores?',
      'Que ação pequena escolheu para hoje?'
    ],
    relatedProtocols: ['F43.81-ACT'],
    relatedTechniques: ['act_valores_pos_perda']
  }
];

// SISTEMA DE PRESCRIÇÃO DE EXERCÍCIOS
export class ClinicalExercisePrescription {
  
  static prescribeExercises(
    protocolCode: string, 
    sessionNumber: number, 
    patientSymptoms: string[],
    difficultyLevel: 'basic' | 'intermediate' | 'advanced' = 'basic'
  ): ClinicalExercise[] {
    
    // Filtrar exercícios relevantes para o protocolo
    const relevantExercises = CLINICAL_EXERCISES.filter(exercise =>
      exercise.relatedProtocols.includes(protocolCode) ||
      exercise.targetSymptoms.some(symptom =>
        patientSymptoms.some(patientSymptom =>
          patientSymptom.toLowerCase().includes(symptom.toLowerCase())
        )
      )
    );
    
    // Priorizar baseado no número da sessão
    let prioritizedExercises: ClinicalExercise[] = [];
    
    if (sessionNumber <= 3) {
      // Sessões iniciais: autoavaliação e exercícios básicos
      prioritizedExercises = relevantExercises.filter(ex => 
        ex.category === 'self-assessment' || 
        (ex.difficulty === 'basic' && ex.category === 'cognitive')
      );
    } else if (sessionNumber <= 8) {
      // Sessões intermediárias: técnicas principais
      prioritizedExercises = relevantExercises.filter(ex => 
        ex.difficulty === difficultyLevel &&
        ['cognitive', 'behavioral'].includes(ex.category)
      );
    } else if (sessionNumber <= 15) {
      // Sessões avançadas: exposição e técnicas especializadas
      prioritizedExercises = relevantExercises.filter(ex => 
        ['exposure', 'behavioral', 'cognitive'].includes(ex.category)
      );
    } else {
      // Prevenção de recaída: consolidação e mindfulness
      prioritizedExercises = relevantExercises.filter(ex => 
        ['mindfulness', 'interpersonal'].includes(ex.category)
      );
    }
    
    // Retornar até 3 exercícios mais relevantes
    return prioritizedExercises.slice(0, 3);
  }
  
  static getExerciseById(exerciseId: string): ClinicalExercise | undefined {
    return CLINICAL_EXERCISES.find(exercise => exercise.id === exerciseId);
  }
  
  static getExercisesByCategory(category: ClinicalExercise['category']): ClinicalExercise[] {
    return CLINICAL_EXERCISES.filter(exercise => exercise.category === category);
  }
  
  static getExercisesByDifficulty(difficulty: ClinicalExercise['difficulty']): ClinicalExercise[] {
    return CLINICAL_EXERCISES.filter(exercise => exercise.difficulty === difficulty);
  }
}

export { CLINICAL_EXERCISES };