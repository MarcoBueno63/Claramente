// Protocolos adicionais DSM-5-TR - Expansão completa
import { DSMProtocol, TCCTechnique } from './dsm5-protocols';

// PROTOCOLOS ADICIONAIS DO DSM-5-TR
const DSM5_ADDITIONAL_PROTOCOLS: DSMProtocol[] = [
  // AGORAFOBIA - ALTA PRIORIDADE
  {
    code: 'F40.00',
    category: 'Transtornos de Ansiedade',
    name: 'Agorafobia',
    description: 'Medo ou ansiedade intensa sobre duas ou mais situações agorafóbicas',
    criteria: [
      'Medo ou ansiedade intensa sobre duas ou mais das seguintes situações:',
      '- Usar transporte público',
      '- Estar em espaços abertos',
      '- Estar em locais fechados',
      '- Ficar em fila ou estar em multidão',
      '- Estar sozinho fora de casa',
      'Situações são evitadas ou exigem presença de companhante',
      'Medo/ansiedade desproporcional ao perigo real',
      'Persistente (6+ meses)',
      'Causa sofrimento clinicamente significativo'
    ],
    symptoms: ['evitação de espaços abertos', 'medo de multidões', 'ansiedade antecipatória', 'necessidade de companhante'],
    interventions: ['exposicao_graduada_agorafobia', 'reestruturacao_cognitiva', 'treino_respiracao'],
    sessionStructure: [
      {
        phase: 'Avaliação e Psicoeducação',
        objectives: ['Mapear situações evitadas', 'Compreender ciclo agorafóbico'],
        techniques: ['psychoeducacao_agorafobia', 'hierarquia_medos'],
        duration: '2-3 sessões',
        homework: ['Diário de evitação e ansiedade']
      },
      {
        phase: 'Exposição Gradual In Vivo',
        objectives: ['Reduzir evitação progressivamente', 'Aumentar autonomia'],
        techniques: ['exposicao_in_vivo', 'acompanhamento_terapeutico'],
        duration: '8-12 sessões',
        homework: ['Exercícios de exposição diários']
      }
    ],
    duration: '12-16 sessões',
    efficacyRate: 85,
    contraindicationsWarnings: ['Verificar condições médicas que contraindiquem exposição']
  },

  // FOBIA SOCIAL - ALTA PRIORIDADE
  {
    code: 'F40.11',
    category: 'Transtornos de Ansiedade', 
    name: 'Transtorno de Ansiedade Social (Fobia Social)',
    description: 'Medo ou ansiedade intensa sobre situações sociais onde pode ser avaliado',
    criteria: [
      'Medo ou ansiedade intensa sobre situações sociais',
      'Situações quase sempre provocam medo/ansiedade',
      'Situações são evitadas ou suportadas com intenso sofrimento',
      'Medo/ansiedade desproporcional à ameaça real',
      'Persistente (6+ meses)',
      'Causa prejuízo clinicamente significativo'
    ],
    symptoms: ['medo de avaliação negativa', 'evitação social', 'sintomas físicos em situações sociais', 'baixa autoestima'],
    interventions: ['tcc_fobia_social', 'exposicao_social_graduada', 'treino_habilidades_sociais'],
    sessionStructure: [
      {
        phase: 'Reestruturação Cognitiva',
        objectives: ['Identificar pensamentos catastróficos', 'Desenvolver pensamentos equilibrados'],
        techniques: ['registro_pensamentos_sociais', 'questionamento_socratico'],
        duration: '4-6 sessões',
        homework: ['Registro diário de situações sociais']
      },
      {
        phase: 'Exposição Social Gradual',
        objectives: ['Reduzir evitação social', 'Aumentar confiança'],
        techniques: ['role_play', 'exposicao_social_in_vivo', 'video_feedback'],
        duration: '8-10 sessões', 
        homework: ['Tarefas sociais progressivas']
      }
    ],
    duration: '14-18 sessões',
    efficacyRate: 80
  },

  // BULIMIA NERVOSA - ALTA PRIORIDADE
  {
    code: 'F50.2',
    category: 'Transtornos Alimentares',
    name: 'Bulimia Nervosa',
    description: 'Episódios recorrentes de compulsão alimentar seguidos de comportamentos compensatórios',
    criteria: [
      'Episódios recorrentes de compulsão alimentar',
      'Comportamentos compensatórios recorrentes para prevenir ganho de peso',
      'Compulsões e compensações ocorrem pelo menos 1x/semana por 3 meses',
      'Autoavaliação influenciada por forma e peso corporal',
      'Não ocorre exclusivamente durante episódios de anorexia nervosa'
    ],
    symptoms: ['episódios de compulsão alimentar', 'comportamentos compensatórios', 'preocupação excessiva com peso', 'flutuações de humor'],
    interventions: ['tcc_bulimia', 'normalizacao_alimentar', 'prevencao_compulsao'],
    sessionStructure: [
      {
        phase: 'Normalização Alimentar',
        objectives: ['Estabelecer padrão alimentar regular', 'Reduzir restrições'],
        techniques: ['planejamento_refeicoes', 'monitorizacao_alimentar'],
        duration: '4-6 sessões',
        homework: ['Diário alimentar detalhado']
      },
      {
        phase: 'Prevenção de Compulsão',
        objectives: ['Identificar gatilhos', 'Desenvolver estratégias alternativas'],
        techniques: ['analise_funcional_compulsao', 'prevencao_resposta'],
        duration: '8-10 sessões',
        homework: ['Plano de prevenção de compulsão']
      }
    ],
    duration: '16-20 sessões',
    efficacyRate: 70,
    contraindicationsWarnings: ['Monitorar estado nutricional e complicações médicas']
  },

  // TRANSTORNO DA COMPULSÃO ALIMENTAR - ALTA PRIORIDADE 
  {
    code: 'F50.81',
    category: 'Transtornos Alimentares',
    name: 'Transtorno da Compulsão Alimentar Periódica',
    description: 'Episódios recorrentes de compulsão alimentar sem comportamentos compensatórios',
    criteria: [
      'Episódios recorrentes de compulsão alimentar',
      'Episódios associados a 3+ dos seguintes:',
      '- Comer muito mais rapidamente que o normal',
      '- Comer até sentir-se desconfortavelmente cheio',
      '- Comer grandes quantidades sem fome física',
      '- Comer sozinho por embaraço',
      '- Sentir nojo, depressão ou culpa após comer',
      'Sofrimento significativo com compulsões',
      'Pelo menos 1x/semana por 3 meses',
      'Não associado a comportamentos compensatórios'
    ],
    symptoms: ['episódios de compulsão alimentar', 'ganho de peso', 'culpa e vergonha', 'comer emocional'],
    interventions: ['tcc_compulsao_alimentar', 'regulacao_emocional', 'mindful_eating'],
    sessionStructure: [
      {
        phase: 'Compreensão da Compulsão',
        objectives: ['Identificar gatilhos emocionais', 'Mapear padrões alimentares'],
        techniques: ['analise_funcional', 'monitorizacao_humor_comida'],
        duration: '3-4 sessões',
        homework: ['Diário de compulsões e emoções']
      },
      {
        phase: 'Estratégias de Regulação',
        objectives: ['Desenvolver alternativas à compulsão', 'Regular emoções'],
        techniques: ['mindfulness_alimentar', 'tolerancia_emocional'],
        duration: '8-12 sessões',
        homework: ['Prática de mindful eating diário']
      }
    ],
    duration: '14-18 sessões',
    efficacyRate: 75
  },

  // DISTIMIA - ALTA PRIORIDADE
  {
    code: 'F34.1',
    category: 'Transtornos Depressivos',
    name: 'Transtorno Depressivo Persistente (Distimia)',
    description: 'Humor deprimido na maior parte do dia, mais dias sim que não, por pelo menos 2 anos',
    criteria: [
      'Humor deprimido na maior parte do dia',
      'Presente mais dias que não por pelo menos 2 anos',
      'Durante período, nunca sem sintomas por mais de 2 meses consecutivos',
      'Dois ou mais dos seguintes enquanto deprimido:',
      '- Apetite diminuído ou alimentação excessiva',
      '- Insônia ou hipersonia',
      '- Pouca energia ou fadiga',
      '- Baixa autoestima',
      '- Concentração pobre ou dificuldade para tomar decisões',
      '- Sentimentos de desesperança'
    ],
    symptoms: ['humor cronicamente deprimido', 'baixa autoestima', 'fadiga crônica', 'pessimismo', 'dificuldade concentração'],
    interventions: ['tcc_distimia', 'ativacao_comportamental_cronica', 'modificacao_crenças_nucleares'],
    sessionStructure: [
      {
        phase: 'Ativação Comportamental Crônica',
        objectives: ['Aumentar atividades prazerosas gradualmente', 'Quebrar padrões de inatividade'],
        techniques: ['agenda_atividades_distimia', 'experimentos_comportamentais'],
        duration: '6-8 sessões',
        homework: ['Programação semanal de atividades']
      },
      {
        phase: 'Trabalho com Crenças Nucleares',
        objectives: ['Modificar esquemas depressogênicos crônicos', 'Aumentar autoestima'],
        techniques: ['identificacao_crenças_nucleares', 'reestruturacao_profunda'],
        duration: '10-12 sessões',
        homework: ['Diário de evidências positivas sobre si mesmo']
      }
    ],
    duration: '20-24 sessões',
    efficacyRate: 65,
    contraindicationsWarnings: ['Avaliar ideação suicida regularmente', 'Considerar medicação adjuvante']
  },

  // TRANSTORNO BIPOLAR II - ALTA PRIORIDADE
  {
    code: 'F31.81',
    category: 'Transtorno Bipolar e Relacionados',
    name: 'Transtorno Bipolar II',
    description: 'Pelo menos um episódio hipomaníaco e pelo menos um episódio depressivo maior',
    criteria: [
      'Critérios para pelo menos um episódio hipomaníaco',
      'Critérios para pelo menos um episódio depressivo maior',
      'Nunca houve episódio maníaco',
      'Não explicado melhor por transtorno esquizoafetivo',
      'Causa prejuízo clinicamente significativo'
    ],
    symptoms: ['alternância humor depressivo/elevado', 'episódios hipomaníacos', 'episódios depressivos', 'ciclagem rápida'],
    interventions: ['terapia_ritmo_social_II', 'monitorizacao_humor_II', 'prevencao_episodios'],
    sessionStructure: [
      {
        phase: 'Psicoeducação Bipolar II',
        objectives: ['Compreender diferença entre mania e hipomania', 'Identificar sinais precoces'],
        techniques: ['psychoeducacao_bipolar_II', 'mapeamento_episodios'],
        duration: '4-5 sessões',
        homework: ['Gráfico retrospectivo de episódios']
      },
      {
        phase: 'Estabilização do Ritmo Social',
        objectives: ['Regularizar rotinas', 'Prevenir desencadeamento de episódios'],
        techniques: ['regulacao_sono_vigilia', 'estruturacao_atividades'],
        duration: '8-10 sessões',
        homework: ['Agenda rigorosa de atividades']
      }
    ],
    duration: '16-20 sessões',
    efficacyRate: 70
  },

  // TRANSTORNO DE ESTRESSE AGUDO - ALTA PRIORIDADE  
  {
    code: 'F43.0',
    category: 'Transtornos Relacionados a Traumas e Estressores',
    name: 'Transtorno de Estresse Agudo',
    description: 'Sintomas de intrusão, humor negativo, dissociação, evitação e excitação após trauma',
    criteria: [
      'Exposição a morte real/ameaça, lesão grave ou violência sexual',
      'Nove ou mais dos seguintes sintomas de qualquer categoria:',
      'Sintomas de intrusão',
      'Humor negativo',
      'Sintomas dissociativos', 
      'Sintomas de evitação',
      'Sintomas de excitação',
      'Duração: 3 dias a 1 mês após trauma',
      'Causa sofrimento clinicamente significativo'
    ],
    symptoms: ['flashbacks agudos', 'despersonalização', 'evitação traumática', 'hipervigilância', 'sintomas dissociativos'],
    interventions: ['stabilizacao_trauma_agudo', 'grounding_tecnicas', 'psychoeducacao_trauma'],
    sessionStructure: [
      {
        phase: 'Estabilização Imediata',
        objectives: ['Reduzir sintomas agudos', 'Estabelecer segurança'],
        techniques: ['tecnicas_grounding', 'respiracao_trauma', 'psychoeducacao_aguda'],
        duration: '2-4 sessões',
        homework: ['Kit de ferramentas de estabilização']
      },
      {
        phase: 'Processamento Inicial',
        objectives: ['Processar trauma de forma segura', 'Prevenir cronificação'],
        techniques: ['narrativa_trauma_breve', 'reestruturacao_significado'],
        duration: '4-6 sessões',
        homework: ['Escrita expressiva controlada']
      }
    ],
    duration: '8-12 sessões',
    efficacyRate: 75,
    contraindicationsWarnings: ['Avaliar risco suicida', 'Considerar hospitalização se necessário']
  },

  // TRANSTORNO DE AJUSTAMENTO - ALTA PRIORIDADE
  {
    code: 'F43.20',
    category: 'Transtornos Relacionados a Traumas e Estressores', 
    name: 'Transtorno de Ajustamento',
    description: 'Sintomas emocionais/comportamentais em resposta a estressor identificável',
    criteria: [
      'Desenvolvimento de sintomas emocionais/comportamentais',
      'Sintomas se desenvolvem dentro de 3 meses do estressor',
      'Sintomas são clinicamente significativos evidenciado por:',
      '- Sofrimento desproporcional ao estressor',
      '- Prejuízo significativo no funcionamento',
      'Não representa luto normal',
      'Uma vez cessado o estressor, sintomas não persistem mais que 6 meses'
    ],
    symptoms: ['ansiedade de ajustamento', 'humor deprimido', 'alterações comportamentais', 'dificuldade funcional'],
    interventions: ['terapia_resolucao_problemas', 'apoio_psicossocial', 'estrategias_enfrentamento'],
    sessionStructure: [
      {
        phase: 'Avaliação do Estressor',
        objectives: ['Identificar estressor específico', 'Avaliar recursos disponíveis'],
        techniques: ['analise_estressor', 'mapeamento_recursos'],
        duration: '2-3 sessões',
        homework: ['Inventário de recursos pessoais']
      },
      {
        phase: 'Desenvolvimento de Estratégias',
        objectives: ['Desenvolver habilidades de enfrentamento', 'Melhorar funcionamento'],
        techniques: ['resolucao_problemas_estruturada', 'treino_habilidades'],
        duration: '4-8 sessões',
        homework: ['Implementação de estratégias diárias']
      }
    ],
    duration: '8-12 sessões',
    efficacyRate: 85
  },

  // TRANSTORNOS DO NEURODESENVOLVIMENTO
  {
    code: 'F90.9',
    category: 'Transtornos do Neurodesenvolvimento',
    name: 'Transtorno do Déficit de Atenção/Hiperatividade',
    description: 'Padrão persistente de desatenção e/ou hiperatividade-impulsividade',
    criteria: [
      'Seis ou mais sintomas de desatenção por 6+ meses',
      'Seis ou mais sintomas de hiperatividade-impulsividade por 6+ meses',
      'Sintomas presentes antes dos 12 anos',
      'Sintomas presentes em dois ou mais ambientes',
      'Interferência no funcionamento social/acadêmico/ocupacional',
      'Não exclusivamente durante esquizofrenia ou outro transtorno psicótico'
    ],
    symptoms: ['desatenção', 'hiperatividade', 'impulsividade', 'desorganização', 'procrastinação'],
    interventions: ['organizacao_cognitiva', 'treino_atencional', 'modificacao_comportamental', 'mindfulness_tdah'],
    sessionStructure: [
      {
        phase: 'Avaliação e Psicoeducação',
        objectives: ['Compreender TDAH', 'Identificar padrões problemáticos'],
        techniques: ['psychoeducacao_tdah', 'automonitoramento'],
        duration: '3-4 sessões',
        homework: ['Diário de atenção e concentração']
      },
      {
        phase: 'Técnicas Organizacionais',
        objectives: ['Melhorar organização', 'Desenvolver rotinas'],
        techniques: ['sistemas_organizacao', 'planejamento_tempo'],
        duration: '6-8 sessões',
        homework: ['Implementação de sistemas organizacionais']
      }
    ],
    duration: '16-20 sessões',
    efficacyRate: 70
  },

  {
    code: 'F84.0',
    category: 'Transtornos do Neurodesenvolvimento',
    name: 'Transtorno do Espectro Autista',
    description: 'Déficits persistentes na comunicação/interação social e padrões restritos/repetitivos',
    criteria: [
      'Déficits na comunicação e interação social',
      'Padrões restritos e repetitivos de comportamento',
      'Sintomas presentes no período de desenvolvimento inicial',
      'Sintomas causam prejuízo clinicamente significativo',
      'Não explicado por deficiência intelectual'
    ],
    symptoms: ['dificuldades comunicação', 'interação social limitada', 'comportamentos repetitivos', 'sensibilidades sensoriais'],
    interventions: ['habilidades_sociais_tea', 'comunicacao_funcional', 'regulacao_sensorial', 'estruturacao_ambiental'],
    sessionStructure: [
      {
        phase: 'Habilidades de Comunicação',
        objectives: ['Melhorar comunicação funcional', 'Desenvolver habilidades sociais'],
        techniques: ['treino_comunicacao', 'role_play_social'],
        duration: '8-12 sessões',
        homework: ['Prática de habilidades sociais estruturadas']
      }
    ],
    duration: '20+ sessões',
    efficacyRate: 65,
    contraindicationsWarnings: ['Adaptações necessárias baseadas no nível de funcionamento']
  },

  // TRANSTORNOS BIPOLARES
  {
    code: 'F31.9',
    category: 'Transtorno Bipolar e Relacionados',
    name: 'Transtorno Bipolar I',
    description: 'Pelo menos um episódio maníaco',
    criteria: [
      'Critérios para pelo menos um episódio maníaco',
      'Episódio maníaco pode ter sido precedido/seguido por episódio depressivo maior',
      'Não explicado por transtorno esquizoafetivo',
      'Não sobreposto a esquizofrenia, delirante ou outro transtorno psicótico'
    ],
    symptoms: ['episódios maníacos', 'episódios depressivos', 'instabilidade humor', 'impulsividade', 'grandiosidade'],
    interventions: ['terapia_ritmo_social', 'psychoeducacao_bipolar', 'prevencao_recaida_bipolar', 'mindfulness_bipolar'],
    sessionStructure: [
      {
        phase: 'Estabilização e Psicoeducação',
        objectives: ['Compreender transtorno bipolar', 'Identificar sinais precoces'],
        techniques: ['psychoeducacao_bipolar', 'monitorizacao_humor'],
        duration: '4-6 sessões',
        homework: ['Gráfico diário de humor']
      },
      {
        phase: 'Regulação do Ritmo Social',
        objectives: ['Estabelecer rotinas regulares', 'Prevenir desregulação'],
        techniques: ['terapia_ritmo_social', 'higiene_sono'],
        duration: '6-8 sessões',
        homework: ['Diário de atividades e sono']
      }
    ],
    duration: '16-24 sessões',
    efficacyRate: 75,
    contraindicationsWarnings: ['Acompanhamento psiquiátrico obrigatório', 'Monitorar episódios maníacos']
  },

  // TRANSTORNOS ESQUIZOFRÊNICOS
  {
    code: 'F20.9',
    category: 'Espectro da Esquizofrenia',
    name: 'Esquizofrenia',
    description: 'Dois ou mais sintomas psicóticos por período significativo',
    criteria: [
      'Delírios, alucinações, discurso desorganizado',
      'Comportamento grosseiramente desorganizado ou catatônico',
      'Sintomas negativos',
      'Disfunção social/ocupacional significativa',
      'Duração contínua de pelo menos 6 meses'
    ],
    symptoms: ['delírios', 'alucinações', 'pensamento desorganizado', 'comportamento desorganizado', 'sintomas negativos'],
    interventions: ['tcc_psicose', 'treino_cognitivo', 'habilidades_sociais_esquizofrenia', 'psychoeducacao_familia'],
    sessionStructure: [
      {
        phase: 'Estabilização e Aliança',
        objectives: ['Estabelecer rapport', 'Avaliar insight', 'Reduzir angústia'],
        techniques: ['validacao_empática', 'normalizacao_experiencias'],
        duration: '4-6 sessões',
        homework: ['Autorregistro de experiências sem julgamento']
      },
      {
        phase: 'Teste de Realidade',
        objectives: ['Desenvolver teste de realidade', 'Reduzir convicção delirante'],
        techniques: ['questionamento_gentil', 'exame_evidencias_psicose'],
        duration: '8-12 sessões',
        homework: ['Diário de evidências alternativas']
      }
    ],
    duration: '20+ sessões',
    efficacyRate: 60,
    contraindicationsWarnings: ['Acompanhamento psiquiátrico obrigatório', 'Adaptação para nível cognitivo']
  },

  // TRANSTORNOS DISSOCIATIVOS
  {
    code: 'F44.81',
    category: 'Transtornos Dissociativos',
    name: 'Transtorno Dissociativo de Identidade',
    description: 'Presença de duas ou mais identidades ou estados de personalidade distintos',
    criteria: [
      'Duas ou mais identidades ou estados de personalidade',
      'Lapsos recorrentes na recordação de eventos cotidianos',
      'Sintomas causam sofrimento clinicamente significativo',
      'Não atribuível a práticas culturais aceitas',
      'Não atribuível a substâncias ou condição médica'
    ],
    symptoms: ['múltiplas identidades', 'amnésia dissociativa', 'despersonalização', 'desrealização'],
    interventions: ['terapia_processamento_trauma_complexo', 'integracao_identidades', 'grounding_dissociativo', 'estabilizacao_fases'],
    sessionStructure: [
      {
        phase: 'Estabilização e Segurança',
        objectives: ['Estabelecer segurança', 'Desenvolver co-consciência'],
        techniques: ['grounding_avancado', 'sistema_interno_comunicacao'],
        duration: '12-20 sessões',
        homework: ['Técnicas de estabilização diárias']
      }
    ],
    duration: '52+ sessões',
    efficacyRate: 50,
    contraindicationsWarnings: ['Especialização em trauma complexo necessária', 'Processo de longo prazo']
  },

  // TRANSTORNOS PARAFÍLICOS
  {
    code: 'F65.9',
    category: 'Transtornos Parafílicos',
    name: 'Transtorno Parafílico Não Especificado',
    description: 'Excitação sexual recorrente e intensa por objetos, situações ou indivíduos atípicos',
    criteria: [
      'Excitação sexual intensa e recorrente por objetos/situações atípicos',
      'Duração de pelo menos 6 meses',
      'Sofrimento clinicamente significativo ou prejuízo funcional',
      'Pode envolver comportamento prejudicial a outros'
    ],
    symptoms: ['fantasias sexuais atípicas', 'impulsos sexuais intensos', 'comportamentos compulsivos'],
    interventions: ['tcc_comportamento_sexual', 'prevencao_recaida_sexual', 'mindfulness_impulsos', 'terapia_aceitacao'],
    sessionStructure: [
      {
        phase: 'Avaliação de Risco',
        objectives: ['Avaliar risco para outros', 'Estabelecer motivação para tratamento'],
        techniques: ['avaliacao_risco', 'entrevista_motivacional'],
        duration: '3-5 sessões',
        homework: ['Autorregistro de impulsos e triggers']
      }
    ],
    duration: '24+ sessões',
    efficacyRate: 65,
    contraindicationsWarnings: ['Avaliação de risco obrigatória', 'Pode requerer supervisão legal']
  },

  // TRANSTORNOS NEUROCOGNITIVOS
  {
    code: 'F03.90',
    category: 'Transtornos Neurocognitivos',
    name: 'Transtorno Neurocognitivo Maior',
    description: 'Declínio cognitivo significativo em um ou mais domínios',
    criteria: [
      'Declínio cognitivo significativo comparado ao nível anterior',
      'Déficits interferem na independência em atividades cotidianas',
      'Não ocorrem exclusivamente no contexto de delirium',
      'Não explicados por outro transtorno mental'
    ],
    symptoms: ['perda de memória', 'dificuldades executivas', 'desorientação', 'alterações personalidade'],
    interventions: ['estimulacao_cognitiva', 'orientacao_realidade', 'terapia_reminiscencia', 'adaptacao_ambiental'],
    sessionStructure: [
      {
        phase: 'Estimulação Cognitiva',
        objectives: ['Manter funções cognitivas', 'Reduzir agitação'],
        techniques: ['exercicios_memoria', 'orientacao_temporal'],
        duration: 'Contínuo',
        homework: ['Atividades cognitivas estruturadas']
      }
    ],
    duration: 'Contínuo',
    efficacyRate: 40,
    contraindicationsWarnings: ['Adaptação conforme severidade cognitiva', 'Envolvimento familiar essencial']
  },

  // TRANSTORNOS DO CONTROLE DOS IMPULSOS
  {
    code: 'F63.1',
    category: 'Transtornos Disruptivos, do Controle de Impulsos e da Conduta',
    name: 'Transtorno Explosivo Intermitente',
    description: 'Episódios recorrentes de agressividade impulsiva',
    criteria: [
      'Falha recorrente em resistir a impulsos agressivos',
      'Episódios resultam em agressão ou destruição de propriedade',
      'Magnitude da agressividade desproporcional ao estressor',
      'Não é premeditada',
      'Causa sofrimento ou prejuízo funcional significativo'
    ],
    symptoms: ['explosões de raiva', 'agressividade impulsiva', 'arrependimento posterior', 'tensão crescente'],
    interventions: ['manejo_raiva', 'controle_impulsos', 'relaxamento_muscular', 'resolucao_conflitos'],
    sessionStructure: [
      {
        phase: 'Identificação de Triggers',
        objectives: ['Identificar gatilhos de raiva', 'Desenvolver automonitoramento'],
        techniques: ['diario_raiva', 'analise_functional'],
        duration: '3-4 sessões',
        homework: ['Registro diário de episódios de raiva']
      },
      {
        phase: 'Técnicas de Controle',
        objectives: ['Desenvolver estratégias de manejo', 'Praticar técnicas de relaxamento'],
        techniques: ['time_out', 'respiracao_controle_raiva'],
        duration: '6-8 sessões',
        homework: ['Prática diária de técnicas de relaxamento']
      }
    ],
    duration: '12-16 sessões',
    efficacyRate: 70
  },

  // TRANSTORNOS RELACIONADOS AO SONO
  {
    code: 'F51.01',
    category: 'Transtornos do Sono-Vigília',
    name: 'Transtorno de Insônia',
    description: 'Insatisfação com a qualidade ou quantidade do sono',
    criteria: [
      'Dificuldade para iniciar ou manter o sono',
      'Despertar precoce com incapacidade de retornar ao sono',
      'Ocorre pelo menos 3 noites por semana por 3 meses',
      'Causa sofrimento clinicamente significativo',
      'Oportunidade adequada para sono',
      'Não explicado por outro transtorno do sono'
    ],
    symptoms: ['dificuldade adormecer', 'despertares noturnos', 'sono não restaurador', 'fadiga diurna'],
    interventions: ['higiene_sono', 'restricao_sono', 'controle_estimulos', 'relaxamento_sono'],
    sessionStructure: [
      {
        phase: 'Avaliação do Sono',
        objectives: ['Avaliar padrões de sono', 'Identificar fatores contribuintes'],
        techniques: ['diario_sono', 'avaliacao_higiene_sono'],
        duration: '2-3 sessões',
        homework: ['Diário detalhado do sono por 2 semanas']
      },
      {
        phase: 'Terapia Cognitivo-Comportamental para Insônia',
        objectives: ['Melhorar eficiência do sono', 'Reduzir ansiedade relacionada ao sono'],
        techniques: ['restricao_tempo_cama', 'reestruturacao_cognições_sono'],
        duration: '6-8 sessões',
        homework: ['Implementação rigorosa de protocolo de sono']
      }
    ],
    duration: '8-12 sessões',
    efficacyRate: 85
  },

  // TRANSTORNOS DE LUTO
  {
    code: 'F43.81',
    category: 'Transtornos Relacionados a Traumas e Estressores',
    name: 'Transtorno de Luto Prolongado',
    description: 'Luto persistente e prejudicial após perda de pessoa próxima',
    criteria: [
      'Morte de alguém próximo há pelo menos 12 meses (6 meses para crianças)',
      'Saudade/anseio persistente pela pessoa falecida',
      'Sofrimento emocional intenso relacionado à morte',
      'Preocupação com a pessoa falecida',
      'Preocupação com as circunstâncias da morte',
      'Evitação de lembretes da perda',
      'Perda de sentido/propósito',
      'Dificuldade para seguir em frente',
      'Entorpecimento emocional',
      'Solidão excessiva'
    ],
    symptoms: ['saudade persistente', 'evitação de lembretes', 'raiva', 'culpa', 'isolamento social', 'perda de sentido'],
    interventions: ['terapia_luto_complicado', 'exposicao_lembrancas', 'reestruturacao_cognitiva_luto', 'rituais_despedida'],
    sessionStructure: [
      {
        phase: 'Validação e Psicoeducação',
        objectives: ['Normalizar processo de luto', 'Identificar complicações'],
        techniques: ['psychoeducacao_luto', 'validacao_empatica'],
        duration: '3-4 sessões',
        homework: ['Narrativa da perda']
      },
      {
        phase: 'Exposição às Memórias',
        objectives: ['Processar memórias da pessoa falecida', 'Reduzir evitação'],
        techniques: ['exposicao_imaginaria_luto', 'visitas_lugares_significativos'],
        duration: '6-8 sessões',
        homework: ['Exercícios de memória guiados']
      },
      {
        phase: 'Reconstrução de Significado',
        objectives: ['Encontrar novo propósito', 'Integrar a perda'],
        techniques: ['terapia_narrativa', 'construcao_legado'],
        duration: '4-6 sessões',
        homework: ['Projetos de memória/legado']
      }
    ],
    duration: '16-20 sessões',
    efficacyRate: 75,
    contraindicationsWarnings: ['Avaliar risco de suicídio', 'Considerar luto traumático']
  },

  {
    code: 'Z63.4',
    category: 'Outros Problemas Relacionados ao Contexto Social',
    name: 'Luto Não Complicado',
    description: 'Resposta normal de luto que pode se beneficiar de apoio terapêutico',
    criteria: [
      'Morte de familiar ou pessoa próxima',
      'Reações normais de luto (tristeza, saudade, raiva, culpa)',
      'Funcionamento gradualmente retornando ao normal',
      'Não atende critérios para transtorno de luto prolongado',
      'Pode incluir sintomas depressivos ou ansiosos temporários'
    ],
    symptoms: ['tristeza', 'saudade', 'choque inicial', 'fadiga', 'dificuldade concentração', 'sintomas somáticos'],
    interventions: ['psicoeducacao_luto_normal', 'suporte_emocional', 'grupos_apoio', 'rituais_significativos'],
    sessionStructure: [
      {
        phase: 'Apoio e Normalização',
        objectives: ['Normalizar reações de luto', 'Oferecer suporte emocional'],
        techniques: ['escuta_ativa', 'validacao_experiencia'],
        duration: '2-4 sessões',
        homework: ['Autocuidado estruturado']
      },
      {
        phase: 'Processamento da Perda',
        objectives: ['Processar emoções', 'Encontrar formas de homenagear'],
        techniques: ['narrativa_perda', 'rituais_despedida'],
        duration: '4-6 sessões',
        homework: ['Criação de memorial ou ritual']
      }
    ],
    duration: '6-12 sessões',
    efficacyRate: 80
  },

  // TRANSTORNOS DE HUMOR ADICIONAIS
  {
    code: 'F34.0',
    category: 'Transtornos Depressivos',
    name: 'Transtorno Ciclotímico',
    description: 'Flutuações crônicas do humor com episódios hipomaníacos e depressivos',
    criteria: [
      'Por pelo menos 2 anos, períodos com sintomas hipomaníacos',
      'Períodos com sintomas depressivos que não atendem critérios para episódio depressivo maior',
      'Durante 2 anos, sintomas presentes por pelo menos metade do tempo',
      'Nunca ausente por mais de 2 meses consecutivos',
      'Nunca atendeu critérios para episódio depressivo maior, maníaco ou hipomaníaco',
      'Não explicado por transtorno esquizoafetivo',
      'Sofrimento clinicamente significativo ou prejuízo funcional'
    ],
    symptoms: ['flutuações humor', 'períodos hipomaníacos', 'períodos depressivos leves', 'instabilidade emocional', 'energia variável'],
    interventions: ['estabilizacao_humor', 'terapia_ritmo_social', 'monitorizacao_humor_ciclotimia', 'psychoeducacao_ciclotimia'],
    sessionStructure: [
      {
        phase: 'Estabilização e Monitoramento',
        objectives: ['Identificar padrões de humor', 'Estabilizar rotinas'],
        techniques: ['grafico_humor_diario', 'regulacao_sono_vigilia'],
        duration: '4-6 sessões',
        homework: ['Monitoramento diário de humor e energia']
      },
      {
        phase: 'Regulação do Humor',
        objectives: ['Prevenir oscilações extremas', 'Desenvolver estratégias de enfrentamento'],
        techniques: ['terapia_ritmo_social', 'reestruturacao_cognitiva'],
        duration: '8-10 sessões',
        homework: ['Manutenção de rotinas estruturadas']
      }
    ],
    duration: '16-20 sessões',
    efficacyRate: 70,
    contraindicationsWarnings: ['Monitorar para progressão para transtorno bipolar', 'Acompanhamento psiquiátrico recomendado']
  },

  {
    code: 'F34.1',
    category: 'Transtornos Depressivos',
    name: 'Transtorno Depressivo Persistente (Distimia)',
    description: 'Humor deprimido na maior parte dos dias por pelo menos 2 anos',
    criteria: [
      'Humor deprimido na maior parte dos dias por pelo menos 2 anos',
      'Presença de 2 ou mais dos seguintes: alterações do apetite, insônia/hipersonia, baixa energia, baixa autoestima, dificuldade concentração, desesperança',
      'Durante 2 anos, nunca sem sintomas por mais de 2 meses consecutivos',
      'Nunca houve episódio depressivo maior durante os primeiros 2 anos',
      'Nunca houve episódio maníaco ou hipomaníaco',
      'Sofrimento clinicamente significativo ou prejuízo funcional'
    ],
    symptoms: ['humor deprimido crônico', 'baixa energia persistente', 'baixa autoestima', 'desesperança', 'dificuldade decisões'],
    interventions: ['ativacao_comportamental_cronica', 'reestruturacao_cognitiva_distimia', 'mindfulness_depressao_cronica'],
    sessionStructure: [
      {
        phase: 'Ativação Gradual',
        objectives: ['Aumentar atividades prazerosas', 'Quebrar padrões de inatividade'],
        techniques: ['agendamento_atividades_graduais', 'experimentos_comportamentais'],
        duration: '6-8 sessões',
        homework: ['Agenda de atividades semanais']
      },
      {
        phase: 'Trabalho Cognitivo Profundo',
        objectives: ['Abordar crenças centrais', 'Modificar padrões de pensamento crônicos'],
        techniques: ['questionamento_socratico_profundo', 'tecnica_continuum'],
        duration: '10-12 sessões',
        homework: ['Registros de pensamentos automáticos diários']
      }
    ],
    duration: '20-24 sessões',
    efficacyRate: 65,
    contraindicationsWarnings: ['Processo de longo prazo', 'Considerar medicação adjuvante']
  },

  {
    code: 'F32.4',
    category: 'Transtornos Depressivos',
    name: 'Episódio Depressivo Maior com Características Psicóticas',
    description: 'Episódio depressivo maior acompanhado de delírios ou alucinações',
    criteria: [
      'Atende critérios para episódio depressivo maior',
      'Presença de delírios ou alucinações',
      'Características psicóticas são congruentes ou incongruentes com o humor',
      'Características psicóticas não ocorrem exclusivamente durante episódios de humor',
      'Não atribuível a substâncias ou condição médica'
    ],
    symptoms: ['humor deprimido severo', 'delírios', 'alucinações', 'agitação psicomotora', 'catatonia'],
    interventions: ['tcc_depressao_psicotica', 'teste_realidade_gentil', 'ativacao_comportamental_adaptada'],
    sessionStructure: [
      {
        phase: 'Estabilização e Aliança',
        objectives: ['Estabelecer segurança', 'Reduzir angústia psicótica'],
        techniques: ['validacao_empática', 'normalizacao_experiencias'],
        duration: '6-8 sessões',
        homework: ['Autorregistro sem julgamento']
      },
      {
        phase: 'Trabalho Cognitivo Adaptado',
        objectives: ['Questionar cognições delirantes gentilmente', 'Melhorar teste de realidade'],
        techniques: ['questionamento_colaborativo', 'exame_evidencias_adaptado'],
        duration: '8-12 sessões',
        homework: ['Registro de evidências alternativas']
      }
    ],
    duration: '16-24 sessões',
    efficacyRate: 55,
    contraindicationsWarnings: ['Acompanhamento psiquiátrico obrigatório', 'Avaliar necessidade de hospitalização', 'Monitorar risco de suicídio']
  },

  {
    code: 'F39',
    category: 'Transtornos de Humor',
    name: 'Transtorno do Humor Não Especificado',
    description: 'Sintomas de humor que não atendem critérios para transtorno específico',
    criteria: [
      'Sintomas de humor clinicamente significativos',
      'Não atende critérios completos para nenhum transtorno de humor específico',
      'Causa sofrimento clinicamente significativo',
      'Prejuízo no funcionamento social, ocupacional ou outras áreas importantes',
      'Não atribuível a substâncias ou condição médica'
    ],
    symptoms: ['alterações humor', 'instabilidade emocional', 'sintomas subsindrômicos', 'prejuízo funcional'],
    interventions: ['avaliacao_diagnostica_aprofundada', 'estabilizacao_humor_geral', 'psychoeducacao_humor'],
    sessionStructure: [
      {
        phase: 'Avaliação Diagnóstica',
        objectives: ['Clarificar apresentação clínica', 'Identificar padrões'],
        techniques: ['entrevista_estruturada', 'monitorizacao_sintomas'],
        duration: '4-6 sessões',
        homework: ['Diário detalhado de sintomas']
      },
      {
        phase: 'Intervenção Direcionada',
        objectives: ['Abordar sintomas predominantes', 'Melhorar funcionamento'],
        techniques: ['intervencoes_flexiveis', 'abordagem_integrada'],
        duration: '8-12 sessões',
        homework: ['Estratégias personalizadas baseadas em sintomas']
      }
    ],
    duration: '12-20 sessões',
    efficacyRate: 60,
    contraindicationsWarnings: ['Reavaliação diagnóstica periódica necessária']
  },

  // TRANSTORNO DE PERSONALIDADE BORDERLINE - PROTOCOLO DBT
  {
    code: 'F60.3',
    category: 'Transtornos da Personalidade',
    name: 'Transtorno de Personalidade Borderline (TPB)',
    description: 'Padrão difuso de instabilidade nas relações interpessoais, autoimagem e afetos, e impulsividade acentuada',
    criteria: [
      'Esforços extremos para evitar abandono real ou imaginário',
      'Padrão de relacionamentos interpessoais instáveis e intensos',
      'Perturbação da identidade: autoimagem ou sentido do eu instável',
      'Impulsividade em pelo menos duas áreas potencialmente prejudiciais',
      'Comportamento, gestos ou ameaças suicidas recorrentes',
      'Instabilidade afetiva devido à reatividade acentuada do humor',
      'Sentimentos crônicos de vazio',
      'Raiva intensa inapropriada ou dificuldade para controlar a raiva',
      'Ideação paranóide transitória relacionada ao estresse ou sintomas dissociativos severos'
    ],
    symptoms: ['instabilidade emocional', 'medo do abandono', 'impulsividade', 'autolesão', 'relações instáveis', 'vazio crônico'],
    interventions: ['dbt_mindfulness', 'dbt_regulacao_emocional', 'dbt_eficacia_interpessoal', 'dbt_tolerancia_angustia'],
    sessionStructure: [
      {
        phase: 'DBT - Habilidades de Mindfulness',
        objectives: ['Desenvolver consciência do momento presente', 'Observar sem julgar'],
        techniques: ['mindfulness_dbt', 'observacao_sem_julgamento', 'participacao_plena'],
        duration: '8-10 sessões',
        homework: ['Práticas diárias de mindfulness', 'Cartões de lembrança']
      },
      {
        phase: 'DBT - Regulação Emocional',
        objectives: ['Identificar e nomear emoções', 'Reduzir vulnerabilidade emocional'],
        techniques: ['surf_emocional', 'acao_oposta', 'please_skills'],
        duration: '10-12 sessões',
        homework: ['Diário de emoções', 'Plano de autocuidado']
      },
      {
        phase: 'DBT - Eficácia Interpessoal',
        objectives: ['Melhorar habilidades de comunicação', 'Manter relacionamentos saudáveis'],
        techniques: ['dear_man', 'give_fast', 'assertividade_dialectica'],
        duration: '8-10 sessões',
        homework: ['Prática de habilidades interpessoais']
      },
      {
        phase: 'DBT - Tolerância à Angústia',
        objectives: ['Sobreviver a crises sem piorar situação', 'Aceitar realidade'],
        techniques: ['tipp_skills', 'radical_acceptance', 'distraction_techniques'],
        duration: '8-10 sessões',
        homework: ['Kit de sobrevivência a crises']
      }
    ],
    duration: '12-18 meses (intensivo)',
    efficacyRate: 85,
    contraindicationsWarnings: ['Requer treinamento especializado em DBT', 'Ideação suicida ativa requer protocolo de segurança']
  },

  // PROTOCOLO ACT PARA LUTO COMPLICADO
  {
    code: 'F43.81-ACT',
    category: 'Transtornos Relacionados a Traumas e Estressores',
    name: 'Luto Complicado - Protocolo ACT (Terapia de Aceitação e Compromisso)',
    description: 'Abordagem ACT para processamento de luto através de aceitação psicológica e compromisso com valores',
    criteria: [
      'Atende critérios para transtorno de luto prolongado',
      'Evitação experiencial significativa relacionada ao luto',
      'Fusão cognitiva com pensamentos sobre a perda',
      'Afastamento de valores importantes devido ao luto',
      'Rigidez psicológica no processo de adaptação'
    ],
    symptoms: ['evitação experiencial', 'fusão cognitiva', 'perda de flexibilidade', 'afastamento de valores', 'rumination'],
    interventions: ['act_aceitacao_luto', 'act_defusao_cognitiva', 'act_valores_pos_perda', 'act_mindfulness_luto'],
    sessionStructure: [
      {
        phase: 'ACT - Aceitação Psicológica da Perda',
        objectives: ['Aceitar a dor do luto como natural', 'Reduzir luta contra sentimentos difíceis'],
        techniques: ['exercicios_aceitacao', 'metaforas_act', 'mindfulness_da_dor'],
        duration: '6-8 sessões',
        homework: ['Práticas de aceitação diárias', 'Diário de observação sem julgamento']
      },
      {
        phase: 'ACT - Defusão Cognitiva',
        objectives: ['Reduzir fusão com pensamentos dolorosos', 'Ver pensamentos como eventos mentais'],
        techniques: ['defusao_verbal', 'observador_eu', 'metaforas_mente'],
        duration: '4-6 sessões',
        homework: ['Exercícios de defusão', 'Nomeação de pensamentos']
      },
      {
        phase: 'ACT - Clarificação de Valores Pós-Perda',
        objectives: ['Identificar valores importantes', 'Conectar ações com valores'],
        techniques: ['clarificacao_valores', 'acao_comprometida', 'memorial_valores'],
        duration: '6-8 sessões',
        homework: ['Ações guiadas por valores', 'Projeto de legado']
      },
      {
        phase: 'ACT - Flexibilidade Psicológica',
        objectives: ['Desenvolver flexibilidade na resposta ao luto', 'Integrar perda na vida presente'],
        techniques: ['matriz_act', 'eu_contexto', 'compromisso_comportamental'],
        duration: '4-6 sessões',
        homework: ['Plano de ação baseado em valores']
      }
    ],
    duration: '20-28 sessões',
    efficacyRate: 78,
    contraindicationsWarnings: ['Requer familiaridade com modelo ACT', 'Luto traumático pode necessitar EMDR adjuvante']
  }
];

// TÉCNICAS TCC ESPECIALIZADAS ADICIONAIS
const TCC_ADDITIONAL_TECHNIQUES: TCCTechnique[] = [
  // Técnicas para TDAH
  {
    id: 'organizacao_cognitiva',
    name: 'Organização Cognitiva e Comportamental',
    category: 'cognitive',
    description: 'Estratégias para melhorar organização e planejamento',
    instructions: [
      'Identifique áreas problemáticas de organização',
      'Desenvolva sistemas simples e consistentes',
      'Use lembretes visuais e auditivos',
      'Pratique decomposição de tarefas complexas',
      'Implemente rotinas estruturadas'
    ],
    targetSymptoms: ['desorganização', 'procrastinação', 'esquecimento'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Russell Barkley/adaptado',
    applications: ['TDAH', 'função executiva comprometida'],
    estimatedDuration: '45-60 minutos',
    homework: 'Implementação de sistema organizacional escolhido'
  },

  {
    id: 'treino_atencional',
    name: 'Treinamento Atencional',
    category: 'cognitive',
    description: 'Exercícios para melhorar atenção sustentada e seletiva',
    instructions: [
      'Comece com exercícios de atenção de curta duração',
      'Aumente gradualmente a duração dos exercícios',
      'Pratique atenção dividida controlada',
      'Use técnicas de mindfulness adaptadas',
      'Monitore melhoras na vida real'
    ],
    targetSymptoms: ['desatenção', 'distratibilidade', 'dificuldade concentração'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Sohlberg & Mateer',
    applications: ['TDAH', 'lesões cerebrais', 'déficit atencionais'],
    estimatedDuration: '30-45 minutos',
    homework: 'Exercícios de atenção diários de 10-15 minutos'
  },

  // Técnicas para Transtorno Bipolar
  {
    id: 'terapia_ritmo_social',
    name: 'Terapia do Ritmo Social',
    category: 'behavioral',
    description: 'Regulação de ritmos circadianos e rotinas sociais',
    instructions: [
      'Monitore ritmos de sono-vigília diariamente',
      'Identifique eventos disruptivos de rotina',
      'Estabeleça horários regulares para atividades-chave',
      'Mantenha consistência em rotinas sociais',
      'Antecipe e prepare-se para mudanças de rotina'
    ],
    targetSymptoms: ['instabilidade humor', 'alterações sono', 'irregularidade rotinas'],
    contraindications: [],
    evidenceLevel: 'A',
    developedBy: 'Ellen Frank',
    applications: ['transtorno bipolar', 'depressão recorrente'],
    estimatedDuration: '60 minutos',
    homework: 'Manutenção de gráfico de ritmo social diário'
  },

  {
    id: 'psychoeducacao_bipolar',
    name: 'Psicoeducação para Transtorno Bipolar',
    category: 'cognitive',
    description: 'Educação sobre natureza, curso e tratamento do transtorno bipolar',
    instructions: [
      'Explique neurobiologia do transtorno bipolar',
      'Identifique sinais precoces de episódios',
      'Discuta importância da medicação',
      'Desenvolva plano de prevenção de recaída',
      'Eduque família sobre o transtorno'
    ],
    targetSymptoms: ['falta de insight', 'não aderência ao tratamento'],
    contraindications: [],
    evidenceLevel: 'A',
    developedBy: 'Colom & Vieta',
    applications: ['transtorno bipolar', 'educação familiar'],
    estimatedDuration: '60-90 minutos',
    homework: 'Material educativo para revisão e discussão familiar'
  },

  // Técnicas para Esquizofrenia/Psicose
  {
    id: 'tcc_psicose',
    name: 'TCC para Psicose',
    category: 'cognitive',
    description: 'Abordagem cognitiva adaptada para sintomas psicóticos',
    instructions: [
      'Estabeleça aliança terapêutica sem desafiar delírios inicialmente',
      'Explore impacto emocional dos sintomas',
      'Examine evidências gentilmente e de forma colaborativa',
      'Desenvolva estratégias de enfrentamento',
      'Trabalhe na redução da angústia associada'
    ],
    targetSymptoms: ['delírios', 'alucinações', 'ansiedade psicótica'],
    contraindications: ['Agitação psicótica severa'],
    evidenceLevel: 'A',
    developedBy: 'Aaron Beck/Paul Grant',
    applications: ['esquizofrenia', 'transtorno delirante', 'psicose'],
    estimatedDuration: '45-60 minutos',
    homework: 'Registro de experiências e evidências alternativas'
  },

  // Técnicas para Trauma Complexo/Dissociação
  {
    id: 'grounding_dissociativo',
    name: 'Técnicas de Grounding para Dissociação',
    category: 'mindfulness',
    description: 'Técnicas especializadas para reconexão com o presente',
    instructions: [
      'Use técnica 5-4-3-2-1 (sentidos)',
      'Pratique pressão física (apertar mãos, pisar firme)',
      'Use objetos de grounding (pedra, cubo de gelo)',
      'Pratique respiração consciente e lenta',
      'Desenvolva frase de orientação pessoal'
    ],
    targetSymptoms: ['dissociação', 'despersonalização', 'desrealização'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Janina Fisher/adaptado',
    applications: ['PTSD complexo', 'transtornos dissociativos'],
    estimatedDuration: '15-30 minutos',
    homework: 'Prática de grounding 2x por dia'
  },

  {
    id: 'sistema_interno_comunicacao',
    name: 'Comunicação com Sistema Interno',
    category: 'acceptance',
    description: 'Desenvolvimento de comunicação co-consciente entre partes',
    instructions: [
      'Identifique diferentes partes/estados do self',
      'Desenvolva linguagem respeitosa para comunicação interna',
      'Pratique escuta interna sem julgamento',
      'Negocie cooperação entre partes',
      'Estabeleça sistema de tomada de decisão interno'
    ],
    targetSymptoms: ['conflitos internos', 'amnésia dissociativa', 'co-consciência limitada'],
    contraindications: ['Fase inicial do tratamento sem estabilização'],
    evidenceLevel: 'C',
    developedBy: 'Putnam/adaptado',
    applications: ['transtorno dissociativo de identidade'],
    estimatedDuration: '60-90 minutos',
    homework: 'Diário de comunicação interna'
  },

  // Técnicas para Controle de Impulsos
  {
    id: 'manejo_raiva',
    name: 'Manejo da Raiva',
    category: 'behavioral',
    description: 'Estratégias para controle e expressão apropriada da raiva',
    instructions: [
      'Identifique sinais físicos precoces da raiva',
      'Pratique técnicas de time-out estruturado',
      'Desenvolva auto-talk de enfrentamento',
      'Aprenda comunicação assertiva para necessidades',
      'Pratique resolução de problemas quando calmo'
    ],
    targetSymptoms: ['explosões de raiva', 'agressividade', 'irritabilidade'],
    contraindications: ['Risco de violência imediata'],
    evidenceLevel: 'A',
    developedBy: 'Raymond Novaco',
    applications: ['transtorno explosivo intermitente', 'problemas de raiva'],
    estimatedDuration: '60 minutos',
    homework: 'Diário de raiva e prática de técnicas de relaxamento'
  },

  // Técnicas para Sono
  {
    id: 'restricao_sono',
    name: 'Restrição do Tempo na Cama',
    category: 'behavioral',
    description: 'Limitação do tempo na cama para aumentar eficiência do sono',
    instructions: [
      'Calcule tempo médio de sono atual',
      'Limite tempo na cama a esse período + 15 minutos',
      'Mantenha horário de despertar fixo',
      'Aumente tempo na cama apenas quando eficiência >85%',
      'Monitore sonolência diurna cuidadosamente'
    ],
    targetSymptoms: ['insônia', 'sono fragmentado', 'baixa eficiência do sono'],
    contraindications: ['Transtorno bipolar', 'epilepsia', 'trabalho por turnos'],
    evidenceLevel: 'A',
    developedBy: 'Arthur Spielman',
    applications: ['insônia crônica'],
    estimatedDuration: '45 minutos',
    homework: 'Adesão rigorosa aos horários de sono prescritos'
  },

  {
    id: 'controle_estimulos',
    name: 'Controle de Estímulos para o Sono',
    category: 'behavioral',
    description: 'Associação da cama apenas com sono e atividade sexual',
    instructions: [
      'Use cama apenas para dormir e sexo',
      'Saia da cama se não conseguir adormecer em 20 minutos',
      'Retorne à cama apenas quando sonolento',
      'Mantenha horário fixo de despertar',
      'Evite cochilos durante o dia'
    ],
    targetSymptoms: ['dificuldade para adormecer', 'ansiedade na hora de dormir'],
    contraindications: [],
    evidenceLevel: 'A',
    developedBy: 'Richard Bootzin',
    applications: ['insônia de iniciação'],
    estimatedDuration: '30-45 minutos',
    homework: 'Implementação consistente das regras de controle de estímulos'
  },

  // Técnicas para Transtornos de Luto
  {
    id: 'terapia_luto_complicado',
    name: 'Terapia para Luto Complicado',
    category: 'acceptance',
    description: 'Abordagem estruturada para processar luto prolongado e adaptar-se à perda',
    instructions: [
      'Estabeleça narrativa detalhada da relação e da perda',
      'Identifique aspectos complicadores do luto',
      'Pratique exposição gradual a lembretes da perda',
      'Desenvolva rituais de conexão e despedida',
      'Trabalhe na adaptação às mudanças de papel e identidade'
    ],
    targetSymptoms: ['luto prolongado', 'evitação de lembretes', 'dificuldade aceitar morte', 'raiva intensa'],
    contraindications: ['Luto recente (< 6 meses)', 'ideação suicida ativa'],
    evidenceLevel: 'A',
    developedBy: 'Katherine Shear',
    applications: ['transtorno de luto prolongado'],
    estimatedDuration: '60-90 minutos',
    homework: 'Práticas de memória diárias e visitas a locais significativos'
  },

  {
    id: 'exposicao_lembrancas',
    name: 'Exposição a Lembranças da Pessoa Falecida',
    category: 'exposure',
    description: 'Exposição gradual e estruturada a memórias e objetos da pessoa perdida',
    instructions: [
      'Crie hierarquia de lembretes da perda (menos para mais dolorosos)',
      'Comece com exposição imaginária a memórias positivas',
      'Progrida para revisão de fotos e objetos pessoais',
      'Visite locais significativos com apoio',
      'Pratique conversas imaginárias com a pessoa falecida'
    ],
    targetSymptoms: ['evitação de lembretes', 'ansiedade ao pensar na pessoa', 'isolamento'],
    contraindications: ['Sintomas psicóticos', 'intoxicação por substâncias'],
    evidenceLevel: 'B',
    developedBy: 'Adaptado de terapia de exposição',
    applications: ['luto complicado', 'luto traumático'],
    estimatedDuration: '45-60 minutos',
    homework: 'Exposições diárias graduais conforme hierarquia'
  },

  {
    id: 'psicoeducacao_luto_normal',
    name: 'Psicoeducação sobre Luto Normal',
    category: 'cognitive',
    description: 'Educação sobre processo normal de luto e validação de experiências',
    instructions: [
      'Explique fases e manifestações normais do luto',
      'Normalize variabilidade individual no processo',
      'Identifique mitos e expectativas irreais sobre luto',
      'Discuta diferenças culturais e espirituais',
      'Valide emoções complexas (alívio, raiva, culpa)'
    ],
    targetSymptoms: ['confusão sobre processo de luto', 'culpa por emoções', 'pressão social para "superar"'],
    contraindications: [],
    evidenceLevel: 'C',
    developedBy: 'Worden/adaptado',
    applications: ['luto normal', 'grupos de apoio'],
    estimatedDuration: '45 minutos',
    homework: 'Leitura de material educativo sobre luto'
  },

  {
    id: 'rituais_despedida',
    name: 'Criação de Rituais de Despedida',
    category: 'behavioral',
    description: 'Desenvolvimento de rituais significativos para honrar e se conectar com a pessoa falecida',
    instructions: [
      'Identifique valores e características especiais da pessoa',
      'Crie ritual personalizado (altar, memorial, atividade significativa)',
      'Estabeleça momento regular para conexão (aniversários, datas especiais)',
      'Envolva outros enlutados quando apropriado',
      'Adapte rituais conforme processo de luto evolui'
    ],
    targetSymptoms: ['sensação de desconexão', 'falta de fechamento', 'busca por significado'],
    contraindications: ['Obsessão com objetos da pessoa', 'negação da morte'],
    evidenceLevel: 'C',
    developedBy: 'Terapia narrativa/adaptado',
    applications: ['luto normal e complicado'],
    estimatedDuration: '60 minutos',
    homework: 'Implementação e manutenção de rituais criados'
  },

  // Técnicas para Transtornos de Humor Adicionais
  {
    id: 'estabilizacao_humor',
    name: 'Técnicas de Estabilização do Humor',
    category: 'cognitive',
    description: 'Estratégias integradas para regular oscilações de humor',
    instructions: [
      'Monitore humor diariamente em escala de 1-10',
      'Identifique gatilhos e padrões de oscilação',
      'Pratique técnicas de autorregulação (respiração, mindfulness)',
      'Estabeleça rotinas estabilizadoras (sono, exercício)',
      'Use reestruturação cognitiva para pensamentos extremos'
    ],
    targetSymptoms: ['instabilidade emocional', 'oscilações humor', 'reatividade excessiva'],
    contraindications: ['Episódio maníaco ativo', 'psicose'],
    evidenceLevel: 'B',
    developedBy: 'Terapia Dialética Comportamental/adaptado',
    applications: ['ciclotimia', 'transtorno bipolar', 'TPB'],
    estimatedDuration: '45-60 minutos',
    homework: 'Monitoramento diário de humor e aplicação de técnicas'
  },

  {
    id: 'monitorizacao_humor_ciclotimia',
    name: 'Monitoramento Especializado para Ciclotimia',
    category: 'behavioral',
    description: 'Sistema de monitoramento específico para flutuações ciclotímicas',
    instructions: [
      'Registre humor, energia, sono e atividades diariamente',
      'Use escalas específicas para hipomania e depressão leve',
      'Identifique padrões sazonais e ciclos pessoais',
      'Monitore eventos estressantes e mudanças de rotina',
      'Correlacione dados para identificar fatores de risco'
    ],
    targetSymptoms: ['ciclos de humor imprevisíveis', 'dificuldade identificar padrões'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Terapia do Ritmo Social e Interpessoal/adaptado',
    applications: ['transtorno ciclotímico'],
    estimatedDuration: '30 minutos',
    homework: 'Preenchimento diário de gráfico de humor complexo'
  },

  {
    id: 'ativacao_comportamental_cronica',
    name: 'Ativação Comportamental para Depressão Crônica',
    category: 'behavioral',
    description: 'Ativação comportamental adaptada para depressão persistente',
    instructions: [
      'Identifique atividades que proporcionavam prazer no passado',
      'Comece com micro-atividades de 5-10 minutos',
      'Agende atividades independente do humor',
      'Use hierarquia muito gradual devido à cronicidade',
      'Foque em atividades de maestria e prazer separadamente'
    ],
    targetSymptoms: ['anedonia persistente', 'baixa energia crônica', 'inatividade prolongada'],
    contraindications: ['Limitações físicas severas'],
    evidenceLevel: 'A',
    developedBy: 'Peter Lewinsohn/adaptado',
    applications: ['distimia', 'depressão crônica'],
    estimatedDuration: '45-60 minutos',
    homework: 'Agenda de atividades muito estruturada com metas mínimas'
  },

  {
    id: 'tcc_depressao_psicotica',
    name: 'TCC Adaptada para Depressão com Características Psicóticas',
    category: 'cognitive',
    description: 'Abordagem cognitivo-comportamental modificada para depressão com psicose',
    instructions: [
      'Use questionamento socrático muito gentil',
      'Foque primeiro na estabilização do humor',
      'Aborde delírios através de questionamento colaborativo',
      'Valide experiências sem reforçar crenças delirantes',
      'Integre técnicas de teste de realidade gradual'
    ],
    targetSymptoms: ['delírios depressivos', 'alucinações auditivas', 'ideação paranoide'],
    contraindications: ['Agitação psicomotora severa', 'risco iminente de auto/heteroagressão'],
    evidenceLevel: 'B',
    developedBy: 'Aaron Beck/adaptado para psicose',
    applications: ['depressão maior com características psicóticas'],
    estimatedDuration: '30-45 minutos (sessões mais frequentes)',
    homework: 'Registros de evidências muito simplificados, sem confronto direto'
  },

  // Técnicas para Transtornos Alimentares
  {
    id: 'exposicao_alimentos',
    name: 'Exposição a Alimentos',
    category: 'exposure',
    description: 'Exposição gradual a alimentos temidos',
    instructions: [
      'Crie hierarquia de alimentos temidos',
      'Comece com exposição imaginal',
      'Progrida para exposição real gradual',
      'Pratique técnicas de tolerância à ansiedade',
      'Monitore pensamentos e sensações durante exposição'
    ],
    targetSymptoms: ['evitação alimentar', 'fobia de alimentos específicos', 'ansiedade alimentar'],
    contraindications: ['Estado médico instável'],
    evidenceLevel: 'B',
    developedBy: 'Fairburn/adaptado',
    applications: ['anorexia nervosa', 'ARFID'],
    estimatedDuration: '60-90 minutos',
    homework: 'Exposições diárias a alimentos da hierarquia'
  },

  // TÉCNICAS DBT (Dialectical Behavior Therapy) para Transtorno de Personalidade Borderline
  {
    id: 'dbt_mindfulness',
    name: 'DBT - Habilidades de Mindfulness',
    category: 'mindfulness',
    description: 'Técnicas centrais de mindfulness da DBT para consciência presente',
    instructions: [
      'Pratique "Observe": Note experiências sem tentar mudá-las',
      'Pratique "Descreva": Coloque em palavras o que observa',
      'Pratique "Participe": Mergulhe completamente na atividade',
      'Use "Sem julgamento": Evite avaliar como bom/ruim',
      'Use "Uma mente": Foque em uma coisa por vez',
      'Use "Eficácia": Foque no que funciona'
    ],
    targetSymptoms: ['impulsividade', 'dissociação', 'reatividade emocional', 'confusão mental'],
    contraindications: ['Psicose ativa'],
    evidenceLevel: 'A',
    developedBy: 'Marsha Linehan',
    applications: ['transtorno borderline', 'desregulação emocional'],
    estimatedDuration: '20-30 minutos',
    homework: 'Prática diária de mindfulness por 10-15 minutos'
  },

  {
    id: 'dbt_regulacao_emocional',
    name: 'DBT - Regulação Emocional',
    category: 'behavioral',
    description: 'Habilidades para identificar, compreender e modular emoções',
    instructions: [
      'PLEASE: Trate doença Física, coma Equilibrado, evite Álcool, durma Suficiente, Exercite-se',
      'Pratique "Surf Emocional": Deixe emoção passar como onda',
      'Use "Ação Oposta": Aja de forma oposta ao impulso emocional',
      'Aplique "Autocompaixão": Trate-se com gentileza',
      'Pratique "Construção de Maestria": Atividades que geram competência'
    ],
    targetSymptoms: ['labilidade emocional', 'intensidade emocional', 'impulsividade', 'autolesão'],
    contraindications: ['Risco suicida iminente sem suporte'],
    evidenceLevel: 'A',
    developedBy: 'Marsha Linehan',
    applications: ['transtorno borderline', 'instabilidade emocional'],
    estimatedDuration: '45-60 minutos',
    homework: 'Diário de emoções e aplicação de habilidades'
  },

  {
    id: 'dbt_eficacia_interpessoal',
    name: 'DBT - Eficácia Interpessoal',
    category: 'interpersonal',
    description: 'Habilidades para comunicação eficaz e relacionamentos saudáveis',
    instructions: [
      'DEAR MAN: Descreva, Expresse, Afirme, Reforce, Mantenha-se atento, Apareça confiante, Negocie',
      'GIVE: seja Gentil, Interessado, Valide, use Easy manner',
      'FAST: seja Justo, sem Desculpas, mantenha-se nos fatos, Truthful',
      'Pratique pedidos claros e diretos',
      'Estabeleça e mantenha limites saudáveis'
    ],
    targetSymptoms: ['relacionamentos instáveis', 'medo abandono', 'dificuldade comunicação'],
    contraindications: ['Relacionamento abusivo ativo'],
    evidenceLevel: 'A',
    developedBy: 'Marsha Linehan',
    applications: ['transtorno borderline', 'dificuldades relacionais'],
    estimatedDuration: '45-60 minutos',
    homework: 'Prática de habilidades em interações reais'
  },

  {
    id: 'dbt_tolerancia_angustia',
    name: 'DBT - Tolerância à Angústia',
    category: 'acceptance',
    description: 'Habilidades para sobreviver a crises sem comportamentos destrutivos',
    instructions: [
      'TIPP: Temperatura (água fria), Intenso exercício, Respiração pausada, Relaxamento muscular',
      'ACCEPTS: Atividades, Contribuições, Comparações, Emoções diferentes, Empurrar pensamentos, Sensações diferentes',
      'Pratique "Aceitação Radical": Aceitar realidade completamente',
      'Use técnicas de "Distração Saudável"',
      'Pratique "Autoconforto": Cuidar de si através dos sentidos'
    ],
    targetSymptoms: ['crises emocionais', 'comportamentos impulsivos', 'autolesão', 'ideação suicida'],
    contraindications: ['Uso ativo de substâncias'],
    evidenceLevel: 'A',
    developedBy: 'Marsha Linehan',
    applications: ['transtorno borderline', 'crises emocionais'],
    estimatedDuration: '30-45 minutos',
    homework: 'Kit de sobrevivência a crises personalizado'
  },

  // TÉCNICAS ACT (Acceptance and Commitment Therapy) para Luto
  {
    id: 'act_aceitacao_luto',
    name: 'ACT - Aceitação Psicológica do Luto',
    category: 'acceptance',
    description: 'Desenvolver aceitação da dor do luto sem evitação experiencial',
    instructions: [
      'Pratique "Observação Gentil" da dor do luto',
      'Use metáforas: "Dor como visitante indesejado mas temporário"',
      'Experimento: "E se eu parasse de lutar contra esta dor?"',
      'Pratique respiração com aceitação da tristeza',
      'Desenvolva disposição para sentir em vez de evitar'
    ],
    targetSymptoms: ['evitação experiencial', 'luta contra dor', 'negação do luto'],
    contraindications: ['Luto traumático sem estabilização'],
    evidenceLevel: 'B',
    developedBy: 'Steven Hayes/adaptado para luto',
    applications: ['luto complicado', 'evitação do processo de luto'],
    estimatedDuration: '45-60 minutos',
    homework: 'Práticas diárias de aceitação de 10 minutos'
  },

  {
    id: 'act_defusao_cognitiva',
    name: 'ACT - Defusão Cognitiva para Luto',
    category: 'cognitive',
    description: 'Reduzir fusão com pensamentos dolorosos sobre a perda',
    instructions: [
      'Pratique "Obrigado mente por esse pensamento"',
      'Use técnica "Estou tendo o pensamento de que..."',
      'Exercício das "Folhas no Rio": Pensamentos como folhas passando',
      'Cante pensamentos dolorosos em melodia engraçada',
      'Visualize pensamentos como nuvens passando no céu'
    ],
    targetSymptoms: ['ruminação sobre perda', 'pensamentos obsessivos', 'culpa excessiva'],
    contraindications: ['Sintomas psicóticos'],
    evidenceLevel: 'B',
    developedBy: 'Steven Hayes/adaptado',
    applications: ['luto complicado', 'pensamentos ruminativos'],
    estimatedDuration: '30-45 minutos',
    homework: 'Exercícios de defusão quando pensamentos aparecem'
  },

  {
    id: 'act_valores_pos_perda',
    name: 'ACT - Clarificação de Valores Pós-Perda',
    category: 'interpersonal',
    description: 'Reconectar com valores importantes após a perda',
    instructions: [
      'Explore: "O que era importante para mim antes da perda?"',
      'Identifique: "Que valores a pessoa falecida valorizava?"',
      'Questione: "Como posso honrar esses valores agora?"',
      'Crie pequenas ações baseadas em valores',
      'Desenvolva projeto de legado baseado em valores compartilhados'
    ],
    targetSymptoms: ['perda de significado', 'desconexão de valores', 'falta de direção'],
    contraindications: [],
    evidenceLevel: 'B',
    developedBy: 'Steven Hayes/adaptado para luto',
    applications: ['luto complicado', 'busca de significado'],
    estimatedDuration: '60-90 minutos',
    homework: 'Ações diárias pequenas baseadas em valores'
  },

  {
    id: 'act_mindfulness_luto',
    name: 'ACT - Mindfulness Contextual para Luto',
    category: 'mindfulness',
    description: 'Consciência presente que inclui a presença da ausência',
    instructions: [
      'Pratique "Presença da Ausência": Sentir falta como forma de presença',
      'Exercício "Aqui e Agora com Saudade": Mindfulness que inclui saudade',
      'Meditação "Eu Observador": Parte que observa todas as experiências',
      'Prática "Espaço para Tudo": Criar espaço mental para alegria E tristeza',
      'Mindfulness "Conexão Continuada": Sentir vínculo que persiste'
    ],
    targetSymptoms: ['desconexão do presente', 'evitação de memórias', 'negação da realidade'],
    contraindications: ['Dissociação severa'],
    evidenceLevel: 'B',
    developedBy: 'Steven Hayes/Russ Harris adaptado',
    applications: ['luto complicado', 'integração da perda'],
    estimatedDuration: '30-45 minutos',
    homework: 'Meditações diárias incluindo a presença da ausência'
  },

  // TÉCNICAS PARA AGORAFOBIA
  {
    id: 'exposicao_graduada_agorafobia',
    name: 'Exposição Gradual para Agorafobia',
    category: 'exposure',
    description: 'Exposição progressiva e sistemática a situações agorafóbicas',
    instructions: [
      'Construa hierarquia de 10 situações agorafóbicas (0-100 ansiedade)',
      'Inicie com situação de ansiedade baixa (20-30)',
      'Permaneça na situação até ansiedade diminuir 50%',
      'Pratique técnicas de respiração durante exposição',
      'Progrida para próximo nível apenas após dominância do atual',
      'Registre nível de ansiedade antes, durante e após exposição'
    ],
    targetSymptoms: ['evitação agorafóbica', 'ansiedade antecipatória', 'dependência de companhante'],
    contraindications: ['Condições médicas que contraindiquem exposição'],
    evidenceLevel: 'A',
    developedBy: 'Isaac Marks',
    applications: ['agorafobia', 'fobias específicas', 'ansiedade social'],
    estimatedDuration: '60-90 minutos',
    homework: 'Exercícios de exposição diários de 30-45 minutos'
  },

  // TÉCNICAS PARA FOBIA SOCIAL
  {
    id: 'tcc_fobia_social',
    name: 'TCC para Fobia Social',
    category: 'cognitive',
    description: 'Abordagem cognitivo-comportamental específica para ansiedade social',
    instructions: [
      'Identifique pensamentos automáticos em situações sociais',
      'Examine evidências para pensamentos catastróficos',
      'Desenvolva interpretações mais realistas',
      'Pratique experimentos comportamentais em situações sociais',
      'Use role-play para treinar habilidades sociais',
      'Aplique técnicas em situações reais progressivamente'
    ],
    targetSymptoms: ['medo de avaliação negativa', 'evitação social', 'ansiedade social', 'baixa autoestima'],
    contraindications: ['Depressão severa não tratada'],
    evidenceLevel: 'A',
    developedBy: 'Richard Heimberg',
    applications: ['fobia social', 'ansiedade de performance', 'timidez patológica'],
    estimatedDuration: '50-60 minutos',
    homework: 'Registro de pensamentos sociais e experimentos comportamentais'
  },

  {
    id: 'exposicao_social_graduada',
    name: 'Exposição Social Gradual',
    category: 'exposure',
    description: 'Exposição sistemática a situações sociais temidas',
    instructions: [
      'Crie hierarquia de situações sociais (1-10 em dificuldade)',
      'Comece com situações de baixo risco social',
      'Permaneça na situação até ansiedade diminuir naturalmente',
      'Observe reações reais vs. temidas das pessoas',
      'Registre aprendizados sobre reações sociais',
      'Progrida gradualmente para situações mais desafiadoras'
    ],
    targetSymptoms: ['evitação social', 'ansiedade em situações sociais', 'medo de avaliação'],
    contraindications: ['Transtorno psicótico ativo'],
    evidenceLevel: 'A',
    developedBy: 'Isaac Marks',
    applications: ['fobia social', 'ansiedade de performance', 'mutismo seletivo'],
    estimatedDuration: '45-90 minutos',
    homework: 'Exposições sociais diárias estruturadas'
  },

  // TÉCNICAS PARA DISTIMIA
  {
    id: 'tcc_distimia',
    name: 'TCC Adaptada para Distimia',
    category: 'cognitive',
    description: 'Abordagem cognitivo-comportamental modificada para depressão crônica',
    instructions: [
      'Foque em pequenas mudanças comportamentais graduais',
      'Trabalhe com crenças nucleares sobre si mesmo, mundo e futuro',
      'Use técnicas de ativação comportamental adaptadas para energia baixa',
      'Implemente rotinas estruturadas mas flexíveis',
      'Desenvolva autocompaixão para padrões de autocrítica crônica',
      'Estabeleça metas modestas e realizáveis'
    ],
    targetSymptoms: ['humor cronicamente deprimido', 'baixa autoestima', 'fadiga', 'pessimismo'],
    contraindications: ['Episódio depressivo maior sobreposto'],
    evidenceLevel: 'A',
    developedBy: 'Aaron Beck/McCullough',
    applications: ['distimia', 'depressão crônica', 'dupla depressão'],
    estimatedDuration: '45-60 minutos',
    homework: 'Agenda de atividades pequenas e diário de autocompaixão'
  },

  // TÉCNICAS PARA TRAUMA AGUDO
  {
    id: 'stabilizacao_trauma_agudo',
    name: 'Estabilização para Trauma Agudo',
    category: 'behavioral',
    description: 'Técnicas imediatas de estabilização após trauma',
    instructions: [
      'Garanta segurança física e emocional imediata',
      'Use técnicas de grounding 5-4-3-2-1 quando dissociativo',
      'Pratique respiração controlada 4-4-6 para autorregulação',
      'Identifique sistema de apoio disponível',
      'Estabeleça rotinas básicas (sono, alimentação, higiene)',
      'Normalize reações traumáticas como respostas adaptativas'
    ],
    targetSymptoms: ['dissociação aguda', 'hipervigilância', 'flashbacks', 'desregulação emocional'],
    contraindications: ['Intoxicação por substâncias'],
    evidenceLevel: 'A',
    developedBy: 'Judith Herman/Bessel van der Kolk',
    applications: ['trauma agudo', 'PTSD inicial', 'resposta a crise'],
    estimatedDuration: '30-60 minutos',
    homework: 'Kit de ferramentas de estabilização personalizado'
  }
];

export { DSM5_ADDITIONAL_PROTOCOLS, TCC_ADDITIONAL_TECHNIQUES };