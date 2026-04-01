// Protocolos completos do DSM-5-TR para ClaraMente
// Sistema abrangente de diagnósticos e intervenções baseadas em evidência

export interface DSMProtocol {
  code: string;
  category: string;
  name: string;
  description: string;
  criteria: string[];
  symptoms: string[];
  interventions: string[]; // IDs das técnicas
  sessionStructure: SessionPhase[];
  duration: string;
  efficacyRate: number;
  contraindicationsWarnings?: string[];
}

export interface TCCTechnique {
  id: string;
  name: string;
  category: 'cognitive' | 'behavioral' | 'mindfulness' | 'exposure' | 'acceptance' | 'interpersonal';
  description: string;
  instructions: string[];
  targetSymptoms: string[];
  contraindications: string[];
  evidenceLevel: 'A' | 'B' | 'C' | 'D'; // Grau de evidência científica
  developedBy: string;
  applications: string[];
  estimatedDuration: string;
  homework?: string;
}

export interface SessionPhase {
  phase: string;
  objectives: string[];
  techniques: string[];
  duration: string;
  homework: string[];
}

// PROTOCOLOS DSM-5-TR COMPLETOS
export const DSM5_PROTOCOLS_COMPREHENSIVE: DSMProtocol[] = [
  // TRANSTORNOS DE ANSIEDADE
  {
    code: 'F40.10',
    category: 'Transtornos de Ansiedade',
    name: 'Fobia Específica',
    description: 'Medo ou ansiedade intensa sobre um objeto ou situação específica',
    criteria: [
      'Medo ou ansiedade intensa sobre objeto/situação específica',
      'Objeto/situação quase sempre provoca medo ou ansiedade imediata',
      'Objeto/situação é ativamente evitado ou suportado com medo/ansiedade intensa',
      'Medo/ansiedade desproporcional ao perigo real',
      'Persistente, tipicamente 6 meses ou mais',
      'Causa sofrimento clinicamente significativo ou prejuízo funcional'
    ],
    symptoms: ['medo extremo', 'evitação', 'ansiedade antecipatória', 'sintomas físicos', 'pânico'],
    interventions: ['exposicao_gradual', 'dessensibilizacao_sistematica', 'reestruturacao_cognitiva'],
    sessionStructure: [
      {
        phase: 'Avaliação e Psicoeducação',
        objectives: ['Avaliar severidade', 'Explicar modelo TCC', 'Hierarquia de medos'],
        techniques: ['entrevista_estruturada', 'psychoeducacao'],
        duration: '2-3 sessões',
        homework: ['Automonitoramento de situações evitadas']
      },
      {
        phase: 'Exposição Gradual',
        objectives: ['Reduzir evitação', 'Habituar ao estímulo temido'],
        techniques: ['exposicao_in_vivo', 'exposicao_imaginaria'],
        duration: '6-10 sessões',
        homework: ['Exercícios de exposição diários']
      }
    ],
    duration: '8-12 sessões',
    efficacyRate: 85
  },
  
  {
    code: 'F41.1',
    category: 'Transtornos de Ansiedade',
    name: 'Transtorno de Ansiedade Generalizada',
    description: 'Ansiedade e preocupação excessivas sobre vários eventos ou atividades',
    criteria: [
      'Ansiedade e preocupação excessivas sobre vários eventos',
      'Dificuldade em controlar a preocupação',
      'Associada a 3+ sintomas físicos/cognitivos',
      'Causa sofrimento/prejuízo significativo',
      'Não atribuível a substâncias ou condição médica',
      'Duração mínima de 6 meses'
    ],
    symptoms: ['preocupação excessiva', 'inquietação', 'fadiga', 'dificuldade concentração', 'irritabilidade', 'tensão muscular', 'perturbação do sono'],
    interventions: ['reestruturacao_cognitiva', 'relaxamento_muscular', 'mindfulness', 'resolucao_problemas'],
    sessionStructure: [
      {
        phase: 'Conceituação e Psicoeducação',
        objectives: ['Compreender TAG', 'Identificar padrões de preocupação'],
        techniques: ['psychoeducacao', 'automonitoramento'],
        duration: '2-3 sessões',
        homework: ['Diário de preocupações']
      },
      {
        phase: 'Técnicas Cognitivas',
        objectives: ['Modificar pensamentos catastróficos', 'Reduzir ruminação'],
        techniques: ['questionamento_socratico', 'tecnica_seta_descendente'],
        duration: '4-6 sessões',
        homework: ['Registros de pensamentos automáticos']
      }
    ],
    duration: '12-16 sessões',
    efficacyRate: 80
  },

  {
    code: 'F41.0',
    category: 'Transtornos de Ansiedade',
    name: 'Transtorno de Pânico',
    description: 'Ataques de pânico recorrentes e inesperados',
    criteria: [
      'Ataques de pânico recorrentes e inesperados',
      'Pelo menos um ataque seguido por preocupação persistente',
      'Mudança comportamental significativa relacionada aos ataques',
      'Não atribuível a substâncias ou condição médica'
    ],
    symptoms: ['palpitações', 'suor', 'tremor', 'falta de ar', 'sensação de sufocamento', 'dor no peito', 'náusea', 'tontura', 'desrealização', 'medo de morrer'],
    interventions: ['reeducacao_respiratoria', 'exposicao_interoceptiva', 'reestruturacao_cognitiva'],
    sessionStructure: [
      {
        phase: 'Estabilização',
        objectives: ['Reduzir frequência de ataques', 'Ensinar técnicas de respiração'],
        techniques: ['respiracao_diafragmatica', 'relaxamento_progressivo'],
        duration: '2-4 sessões',
        homework: ['Prática diária de respiração']
      }
    ],
    duration: '10-15 sessões',
    efficacyRate: 85
  },

  // TRANSTORNOS DEPRESSIVOS
  {
    code: 'F32.9',
    category: 'Transtornos Depressivos',
    name: 'Episódio Depressivo Maior',
    description: 'Humor deprimido ou perda de interesse/prazer com sintomas adicionais',
    criteria: [
      'Humor deprimido na maior parte do dia',
      'Perda de interesse ou prazer em atividades',
      'Perda ou ganho significativo de peso',
      'Insônia ou hipersonia',
      'Agitação ou retardo psicomotor',
      'Fadiga ou perda de energia',
      'Sentimentos de inutilidade ou culpa excessiva',
      'Diminuição da capacidade de concentração',
      'Pensamentos de morte ou ideação suicida'
    ],
    symptoms: ['tristeza', 'anedonia', 'fadiga', 'culpa', 'desesperança', 'irritabilidade', 'alterações do sono', 'alterações do apetite'],
    interventions: ['ativacao_comportamental', 'reestruturacao_cognitiva', 'terapia_interpessoal', 'mindfulness'],
    sessionStructure: [
      {
        phase: 'Ativação Comportamental',
        objectives: ['Aumentar atividades prazerosas', 'Quebrar ciclo de inatividade'],
        techniques: ['agendamento_atividades', 'monitoramento_humor'],
        duration: '4-6 sessões',
        homework: ['Agenda de atividades diárias']
      },
      {
        phase: 'Trabalho Cognitivo',
        objectives: ['Identificar pensamentos depressivos', 'Desenvolver pensamentos balanceados'],
        techniques: ['registro_pensamentos', 'exame_evidencias'],
        duration: '6-8 sessões',
        homework: ['Registros de pensamentos automáticos']
      }
    ],
    duration: '16-20 sessões',
    efficacyRate: 75
  },

  // TRANSTORNO OBSESSIVO-COMPULSIVO
  {
    code: 'F42.9',
    category: 'Transtorno Obsessivo-Compulsivo e Relacionados',
    name: 'Transtorno Obsessivo-Compulsivo',
    description: 'Presença de obsessões e/ou compulsões',
    criteria: [
      'Presença de obsessões, compulsões ou ambas',
      'Obsessões/compulsões consomem tempo significativo',
      'Causa sofrimento clinicamente significativo',
      'Não atribuível a substâncias ou condição médica'
    ],
    symptoms: ['obsessões recorrentes', 'compulsões repetitivas', 'ansiedade', 'evitação', 'dúvidas', 'verificação'],
    interventions: ['exposicao_prevencao_resposta', 'reestruturacao_cognitiva', 'mindfulness'],
    sessionStructure: [
      {
        phase: 'Conceituação',
        objectives: ['Compreender ciclo TOC', 'Hierarquia de sintomas'],
        techniques: ['psychoeducacao', 'mapeamento_sintomas'],
        duration: '2-3 sessões',
        homework: ['Automonitoramento de obsessões/compulsões']
      },
      {
        phase: 'Exposição e Prevenção de Resposta',
        objectives: ['Reduzir compulsões', 'Habituar às obsessões'],
        techniques: ['exposicao_gradual', 'prevencao_resposta'],
        duration: '12-16 sessões',
        homework: ['Exercícios de EPR diários']
      }
    ],
    duration: '16-20 sessões',
    efficacyRate: 70
  },

  // TRANSTORNOS RELACIONADOS A TRAUMAS
  {
    code: 'F43.10',
    category: 'Transtornos Relacionados a Traumas e Estressores',
    name: 'Transtorno de Estresse Pós-Traumático',
    description: 'Desenvolvimento de sintomas após exposição a evento traumático',
    criteria: [
      'Exposição a morte real/ameaça de morte, ferimento grave ou violência sexual',
      'Sintomas intrusivos relacionados ao evento',
      'Evitação persistente de estímulos relacionados ao trauma',
      'Alterações negativas em cognições e humor',
      'Alterações na excitação e reatividade',
      'Duração superior a 1 mês'
    ],
    symptoms: ['flashbacks', 'pesadelos', 'evitação', 'hipervigilância', 'embotamento emocional', 'irritabilidade'],
    interventions: ['terapia_processamento_cognitivo', 'emdr_adaptado', 'exposicao_narrativa', 'mindfulness_trauma'],
    sessionStructure: [
      {
        phase: 'Estabilização',
        objectives: ['Desenvolver tolerância afetiva', 'Técnicas de grounding'],
        techniques: ['grounding_sensorial', 'respiracao_consciente'],
        duration: '3-5 sessões',
        homework: ['Técnicas de autorregulação']
      },
      {
        phase: 'Processamento do Trauma',
        objectives: ['Processar memórias traumáticas', 'Reduzir evitação'],
        techniques: ['exposicao_imaginaria', 'narrativa_trauma'],
        duration: '8-12 sessões',
        homework: ['Escrita expressiva supervisionada']
      }
    ],
    duration: '12-20 sessões',
    efficacyRate: 80,
    contraindicationsWarnings: ['Avaliar risco de suicídio', 'Considerar comorbidades']
  },

  // TRANSTORNOS ALIMENTARES
  {
    code: 'F50.00',
    category: 'Transtornos Alimentares',
    name: 'Anorexia Nervosa',
    description: 'Restrição da ingestão energética levando a peso corporal baixo',
    criteria: [
      'Restrição da ingestão energética',
      'Peso significativamente baixo',
      'Medo intenso de ganhar peso',
      'Perturbação na percepção do peso/forma corporais'
    ],
    symptoms: ['restrição alimentar', 'medo de ganho de peso', 'distorção da imagem corporal', 'amenorreia'],
    interventions: ['tcc_transtornos_alimentares', 'exposicao_alimentos', 'reestruturacao_cognitiva_corporal'],
    sessionStructure: [
      {
        phase: 'Estabilização Médica',
        objectives: ['Restauração ponderal', 'Normalização alimentar'],
        techniques: ['psychoeducacao_nutricional', 'diario_alimentar'],
        duration: '4-8 sessões',
        homework: ['Registro detalhado de refeições']
      }
    ],
    duration: '20+ sessões',
    efficacyRate: 60,
    contraindicationsWarnings: ['Acompanhamento médico obrigatório', 'Monitorar peso e sinais vitais']
  },

  // TRANSTORNOS DA PERSONALIDADE
  {
    code: 'F60.31',
    category: 'Transtornos da Personalidade',
    name: 'Transtorno da Personalidade Borderline',
    description: 'Padrão invasivo de instabilidade nas relações interpessoais, autoimagem e afetos',
    criteria: [
      'Esforços frenéticos para evitar abandono',
      'Padrão de relacionamentos instáveis e intensos',
      'Perturbação da identidade',
      'Impulsividade potencialmente prejudicial',
      'Comportamento suicida/automutilação recorrente',
      'Instabilidade afetiva',
      'Sentimentos crônicos de vazio',
      'Raiva inadequada e intensa',
      'Ideação paranóide ou dissociação relacionada ao estresse'
    ],
    symptoms: ['instabilidade emocional', 'medo do abandono', 'impulsividade', 'vazio crônico', 'raiva intensa'],
    interventions: ['terapia_comportamental_dialetica', 'mindfulness_radical', 'tolerancia_sofrimento'],
    sessionStructure: [
      {
        phase: 'Habilidades Básicas',
        objectives: ['Tolerância ao sofrimento', 'Regulação emocional'],
        techniques: ['mindfulness_dbt', 'distress_tolerance'],
        duration: '8-12 sessões',
        homework: ['Cartão de habilidades de crise']
      }
    ],
    duration: '52+ sessões',
    efficacyRate: 70,
    contraindicationsWarnings: ['Avaliar risco de suicídio regularmente', 'Considerar internação se necessário']
  },

  // TRANSTORNOS POR USO DE SUBSTÂNCIAS
  {
    code: 'F10.20',
    category: 'Transtornos por Uso de Substâncias',
    name: 'Transtorno por Uso de Álcool',
    description: 'Padrão problemático de uso de álcool levando a prejuízo clinicamente significativo',
    criteria: [
      'Álcool consumido em quantidades maiores ou por períodos mais longos',
      'Desejo persistente ou esforços malsucedidos para reduzir/controlar',
      'Muito tempo gasto em atividades para obter/usar/recuperar-se do álcool',
      'Fissura ou forte desejo de usar álcool',
      'Uso recorrente resultando em falha em cumprir obrigações',
      'Uso continuado apesar de problemas sociais/interpessoais',
      'Tolerância',
      'Abstinência'
    ],
    symptoms: ['fissura', 'perda de controle', 'tolerância', 'síndrome de abstinência', 'prejuízo social/ocupacional'],
    interventions: ['prevencao_recaida', 'entrevista_motivacional_adaptada', 'mindfulness_adicoes'],
    sessionStructure: [
      {
        phase: 'Motivação para Mudança',
        objectives: ['Aumentar motivação', 'Explorar ambivalência'],
        techniques: ['entrevista_motivacional', 'balanca_decisional'],
        duration: '2-4 sessões',
        homework: ['Autorregistro de situações de risco']
      }
    ],
    duration: '16+ sessões',
    efficacyRate: 65,
    contraindicationsWarnings: ['Avaliar necessidade de desintoxicação médica', 'Monitorar síndrome de abstinência']
  }
];

// TÉCNICAS TCC COMPLETAS
export const TCC_TECHNIQUES_COMPREHENSIVE: TCCTechnique[] = [
  // TÉCNICAS COGNITIVAS
  {
    id: 'reestruturacao_cognitiva',
    name: 'Reestruturação Cognitiva',
    category: 'cognitive',
    description: 'Identificação e modificação de pensamentos automáticos disfuncionais',
    instructions: [
      'Identifique o pensamento automático',
      'Examine as evidências a favor e contra',
      'Considere explicações alternativas',
      'Desenvolva um pensamento mais equilibrado',
      'Teste o novo pensamento na prática'
    ],
    targetSymptoms: ['pensamentos negativos', 'crenças disfuncionais', 'catastrofização', 'personalização'],
    contraindications: ['Episódios psicóticos ativos'],
    evidenceLevel: 'A',
    developedBy: 'Aaron Beck',
    applications: ['depressão', 'ansiedade', 'transtorno bipolar'],
    estimatedDuration: '45-60 minutos',
    homework: 'Registro diário de pensamentos automáticos'
  },

  {
    id: 'registro_pensamentos',
    name: 'Registro de Pensamentos Automáticos',
    category: 'cognitive',
    description: 'Ferramenta para capturar e analisar pensamentos automáticos',
    instructions: [
      'Identifique a situação desencadeadora',
      'Registre a emoção e sua intensidade (0-100)',
      'Capture o pensamento automático exato',
      'Avalie o grau de crença no pensamento (0-100)',
      'Questione e desenvolva pensamento alternativo',
      'Reavalie a emoção após o pensamento alternativo'
    ],
    targetSymptoms: ['ruminação', 'pensamentos distorcidos', 'humor deprimido'],
    contraindications: [],
    evidenceLevel: 'A',
    developedBy: 'Aaron Beck',
    applications: ['todos os transtornos de humor e ansiedade'],
    estimatedDuration: '20-30 minutos',
    homework: 'Completar 3-5 registros por semana'
  },

  {
    id: 'questionamento_socratico',
    name: 'Questionamento Socrático',
    category: 'cognitive',
    description: 'Técnica de questionamento guiado para explorar crenças',
    instructions: [
      'Faça perguntas abertas sobre as evidências',
      'Explore as implicações dos pensamentos',
      'Questione a utilidade das crenças',
      'Examine perspectivas alternativas',
      'Facilite a descoberta guiada'
    ],
    targetSymptoms: ['rigidez cognitiva', 'crenças absolutistas'],
    contraindications: ['Déficits cognitivos severos'],
    evidenceLevel: 'A',
    developedBy: 'Sócrates/adaptado por Beck',
    applications: ['todos os transtornos mentais'],
    estimatedDuration: '30-45 minutos',
    homework: 'Autoqueestionamento dirigido'
  },

  {
    id: 'tecnica_seta_descendente',
    name: 'Técnica da Seta Descendente',
    category: 'cognitive',
    description: 'Método para identificar crenças centrais através de questionamento em cadeia',
    instructions: [
      'Comece com um pensamento automático',
      'Pergunte: "E se isso fosse verdade, o que significaria?"',
      'Continue perguntando até chegar à crença central',
      'Identifique o tema subjacente',
      'Trabalhe na modificação da crença central'
    ],
    targetSymptoms: ['crenças centrais negativas', 'baixa autoestima'],
    contraindications: ['Estados emocionais muito intensos'],
    evidenceLevel: 'B',
    developedBy: 'David Burns',
    applications: ['depressão', 'transtornos de personalidade'],
    estimatedDuration: '30-45 minutos',
    homework: 'Exploração individual das crenças identificadas'
  },

  // TÉCNICAS COMPORTAMENTAIS
  {
    id: 'ativacao_comportamental',
    name: 'Ativação Comportamental',
    category: 'behavioral',
    description: 'Aumento sistemático de atividades prazerosas e significativas',
    instructions: [
      'Monitore atividades atuais e humor',
      'Identifique atividades prazerosas/significativas',
      'Agende atividades gradualmente',
      'Monitore mudanças no humor',
      'Aumente progressivamente a complexidade'
    ],
    targetSymptoms: ['anedonia', 'baixa energia', 'isolamento social'],
    contraindications: [],
    evidenceLevel: 'A',
    developedBy: 'Martell, Addis, Jacobson',
    applications: ['depressão', 'distimia'],
    estimatedDuration: '45-60 minutos',
    homework: 'Agenda semanal de atividades'
  },

  {
    id: 'exposicao_gradual',
    name: 'Exposição Gradual',
    category: 'exposure',
    description: 'Exposição progressiva a estímulos ansiogênicos',
    instructions: [
      'Crie uma hierarquia de situações temidas',
      'Comece com itens de ansiedade baixa-moderada',
      'Mantenha exposição até ansiedade diminuir 50%',
      'Progrida na hierarquia gradualmente',
      'Pratique regularmente'
    ],
    targetSymptoms: ['evitação', 'fobias', 'ansiedade'],
    contraindications: ['Transtorno de pânico severo não tratado'],
    evidenceLevel: 'A',
    developedBy: 'Wolpe/adaptado',
    applications: ['fobias', 'TAG', 'TOC'],
    estimatedDuration: '60-90 minutos',
    homework: 'Exposições diárias de 15-30 minutos'
  },

  {
    id: 'prevencao_resposta',
    name: 'Prevenção de Resposta',
    category: 'behavioral',
    description: 'Bloqueio de comportamentos compulsivos/de escape',
    instructions: [
      'Identifique comportamentos compulsivos específicos',
      'Estabeleça períodos de prevenção gradualmente crescentes',
      'Use técnicas de tolerância ao desconforto',
      'Monitore ansiedade durante prevenção',
      'Reforce sucesso na prevenção'
    ],
    targetSymptoms: ['compulsões', 'comportamentos de segurança'],
    contraindications: ['Risco de autolesão'],
    evidenceLevel: 'A',
    developedBy: 'Victor Meyer',
    applications: ['TOC', 'tricotilomania'],
    estimatedDuration: '60+ minutos',
    homework: 'Prevenção de resposta diária estruturada'
  },

  // TÉCNICAS DE MINDFULNESS
  {
    id: 'mindfulness_respiracao',
    name: 'Mindfulness da Respiração',
    category: 'mindfulness',
    description: 'Atenção plena focada na respiração',
    instructions: [
      'Sente-se confortavelmente e feche os olhos',
      'Foque na respiração natural',
      'Quando a mente divagar, gentilmente retorne à respiração',
      'Observe sem julgar',
      'Pratique por 10-20 minutos'
    ],
    targetSymptoms: ['ruminação', 'ansiedade', 'estresse'],
    contraindications: ['Transtornos dissociativos'],
    evidenceLevel: 'A',
    developedBy: 'Jon Kabat-Zinn',
    applications: ['todos os transtornos'],
    estimatedDuration: '10-20 minutos',
    homework: 'Prática diária de mindfulness'
  },

  {
    id: 'body_scan',
    name: 'Varredura Corporal',
    category: 'mindfulness',
    description: 'Atenção plena sistemática ao corpo',
    instructions: [
      'Deite-se confortavelmente',
      'Comece pelos pés, notando sensações',
      'Mova a atenção gradualmente pelo corpo',
      'Observe sem tentar mudar nada',
      'Complete todo o corpo em 20-45 minutos'
    ],
    targetSymptoms: ['tensão muscular', 'ansiedade somática', 'dissociação'],
    contraindications: ['Trauma corporal recente'],
    evidenceLevel: 'B',
    developedBy: 'Jon Kabat-Zinn',
    applications: ['ansiedade', 'dor crônica', 'PTSD'],
    estimatedDuration: '20-45 minutos',
    homework: 'Varredura corporal 3x por semana'
  },

  // TÉCNICAS DE ACEITAÇÃO
  {
    id: 'act_defusao',
    name: 'Defusão Cognitiva (ACT)',
    category: 'acceptance',
    description: 'Redução do impacto literal dos pensamentos',
    instructions: [
      'Identifique pensamentos problemáticos',
      'Observe o pensamento como evento mental',
      'Use metáforas (folhas no rio, nuvens no céu)',
      'Pratique "Estou tendo o pensamento de que..."',
      'Foque em valores e ações'
    ],
    targetSymptoms: ['fusão cognitiva', 'ruminação', 'autocobrança'],
    contraindications: [],
    evidenceLevel: 'A',
    developedBy: 'Steven Hayes',
    applications: ['depressão', 'ansiedade', 'dor crônica'],
    estimatedDuration: '30-45 minutos',
    homework: 'Exercícios de defusão diários'
  },

  {
    id: 'valores_clarificacao',
    name: 'Clarificação de Valores',
    category: 'acceptance',
    description: 'Identificação de valores pessoais fundamentais',
    instructions: [
      'Explore diferentes domínios da vida',
      'Identifique o que é verdadeiramente importante',
      'Distinga valores de objetivos',
      'Avalie ações atuais em relação aos valores',
      'Comprometa-se com ações baseadas em valores'
    ],
    targetSymptoms: ['falta de direção', 'baixa motivação', 'vazio existencial'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Steven Hayes',
    applications: ['depressão', 'transtornos de personalidade'],
    estimatedDuration: '60+ minutos',
    homework: 'Ações diárias baseadas em valores'
  },

  // TÉCNICAS INTERPESSOAIS
  {
    id: 'habilidades_sociais',
    name: 'Treinamento de Habilidades Sociais',
    category: 'interpersonal',
    description: 'Desenvolvimento de competências sociais específicas',
    instructions: [
      'Identifique déficits específicos em habilidades sociais',
      'Modele comportamentos apropriados',
      'Pratique através de role-play',
      'Forneça feedback específico',
      'Aplique em situações reais gradualmente'
    ],
    targetSymptoms: ['isolamento social', 'ansiedade social', 'conflitos interpessoais'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Liberman/Bellack',
    applications: ['ansiedade social', 'esquizofrenia', 'TEA'],
    estimatedDuration: '60-90 minutos',
    homework: 'Prática de habilidades em situações reais'
  },

  {
    id: 'comunicacao_assertiva',
    name: 'Treinamento em Assertividade',
    category: 'interpersonal',
    description: 'Desenvolvimento de comunicação direta e respeitosa',
    instructions: [
      'Identifique estilos de comunicação (passivo/agressivo/assertivo)',
      'Aprenda técnicas de comunicação assertiva',
      'Pratique expressão de necessidades/limites',
      'Desenvolva habilidades de escuta ativa',
      'Aplique em relacionamentos específicos'
    ],
    targetSymptoms: ['passividade', 'agressividade', 'baixa autoestima'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Wolpe/Lazarus',
    applications: ['depressão', 'ansiedade social', 'transtornos de personalidade'],
    estimatedDuration: '45-60 minutos',
    homework: 'Prática de assertividade em situações específicas'
  },

  // TÉCNICAS ESPECIALIZADAS
  {
    id: 'emdr_adaptado',
    name: 'EMDR Adaptado para TCC',
    category: 'exposure',
    description: 'Dessensibilização através de movimentos oculares',
    instructions: [
      'Identifique memória traumática específica',
      'Avalie perturbação subjetiva (SUD 0-10)',
      'Realize movimentos oculares bilaterais',
      'Processe material emergente',
      'Instale cognição positiva'
    ],
    targetSymptoms: ['trauma', 'flashbacks', 'memórias intrusivas'],
    contraindications: ['Transtornos dissociativos severos', 'epilepsia'],
    evidenceLevel: 'A',
    developedBy: 'Francine Shapiro',
    applications: ['PTSD', 'trauma complexo'],
    estimatedDuration: '60-90 minutos',
    homework: 'Técnicas de autorregulação',
    contraindicationsWarnings: ['Requer treinamento especializado']
  },

  {
    id: 'terapia_comportamental_dialetica',
    name: 'Habilidades DBT',
    category: 'acceptance',
    description: 'Habilidades de regulação emocional e tolerância ao sofrimento',
    instructions: [
      'Ensine habilidades de mindfulness radical',
      'Desenvolva tolerância ao sofrimento',
      'Trabalhe regulação emocional',
      'Pratique efetividade interpessoal',
      'Integre habilidades na vida diária'
    ],
    targetSymptoms: ['desregulação emocional', 'impulsividade', 'autolesão'],
    contraindications: [],
    evidenceLevel: 'A',
    developedBy: 'Marsha Linehan',
    applications: ['TPB', 'transtornos de humor', 'adicções'],
    estimatedDuration: '90 minutos',
    homework: 'Cartão de habilidades, diário de emoções'
  }
];

// SISTEMA DE DETECÇÃO AUTOMÁTICA DE PROTOCOLOS
export class ProtocolDetectionSystem {
  
  static detectProtocol(symptoms: string[], userHistory: any): DSMProtocol[] {
    const matchingProtocols: { protocol: DSMProtocol; confidence: number }[] = [];
    
    DSM5_PROTOCOLS_COMPREHENSIVE.forEach(protocol => {
      let confidence = 0;
      
      // Verificar sintomas correspondentes
      protocol.symptoms.forEach(symptom => {
        if (symptoms.some(userSymptom => 
          userSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(userSymptom.toLowerCase())
        )) {
          confidence += 0.2;
        }
      });
      
      // Verificar histórico do usuário
      if (userHistory?.previousDiagnoses) {
        if (userHistory.previousDiagnoses.includes(protocol.code)) {
          confidence += 0.3;
        }
      }
      
      // Adicionar se confiança suficiente
      if (confidence >= 0.4) {
        matchingProtocols.push({ protocol, confidence });
      }
    });
    
    // Ordenar por confiança e retornar top 3
    return matchingProtocols
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)
      .map(item => item.protocol);
  }
  
  static selectTechniques(protocol: DSMProtocol, sessionNumber: number): TCCTechnique[] {
    const applicableTechniques = TCC_TECHNIQUES_COMPREHENSIVE.filter(technique =>
      protocol.interventions.includes(technique.id) ||
      technique.applications.some(app => 
        protocol.symptoms.some(symptom => app.includes(symptom))
      )
    );
    
    // Priorizar técnicas baseadas no número da sessão
    if (sessionNumber <= 3) {
      // Sessões iniciais: psicoeducação e estabilização
      return applicableTechniques.filter(t => 
        t.category === 'cognitive' && t.evidenceLevel === 'A'
      );
    } else if (sessionNumber <= 10) {
      // Sessões intermediárias: técnicas principais
      return applicableTechniques.filter(t => 
        ['cognitive', 'behavioral'].includes(t.category)
      );
    } else {
      // Sessões finais: consolidação e prevenção de recaídas
      return applicableTechniques.filter(t => 
        ['acceptance', 'mindfulness'].includes(t.category)
      );
    }
  }
}

export { 
  DSM5_PROTOCOLS_COMPREHENSIVE as DSM5_PROTOCOLS, 
  TCC_TECHNIQUES_COMPREHENSIVE as TCC_TECHNIQUES 
};