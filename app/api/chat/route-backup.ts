import { NextRequest, NextResponse } from "next/server";
import { validateString, validateRequired } from "@/lib/validate";
import { personalizationEngine } from '@/lib/personalization';
import { DSM5_PROTOCOLS, TCC_TECHNIQUES, ProtocolDetectionSystem } from '@/lib/dsm5-protocols';
import { DSM5_ADDITIONAL_PROTOCOLS, TCC_ADDITIONAL_TECHNIQUES } from '@/lib/dsm5-additional-protocols';
import { ConversationFlow, validationResponses, encouragementPhrases } from '@/lib/conversation-flow';

// Sistema de Crenças TCC baseado em Aaron Beck
const coreBeliefsCategories = {
  // Crenças Centrais sobre o SELF
  self: {
    helplessness: {
      patterns: [
        /não consigo/, /sou incapaz/, /não dou conta/, /sou fraco/,
        /não tenho força/, /sou inadequado/, /não sei fazer/
      ],
      indicators: ["incapacidade", "inadequação", "incompetência"],
      centralBelief: "Eu sou inadequado/incapaz"
    },
    unlovability: {
      patterns: [
        /ninguém me ama/, /sou rejeitado/, /não mereço/, /sou sozinho/,
        /ninguém se importa/, /sou desprezível/, /sou indigno/
      ],
      indicators: ["rejeição", "abandono", "solidão"],
      centralBelief: "Eu não sou digno de amor"
    },
    worthlessness: {
      patterns: [
        /não valho nada/, /sou inútil/, /não sirvo/, /sou um lixo/,
        /não presto/, /sou insignificante/, /não tenho valor/
      ],
      indicators: ["inutilidade", "insignificância", "desvalorização"],
      centralBelief: "Eu não tenho valor"
    }
  },
  
  // Crenças Centrais sobre o MUNDO
  world: {
    dangerous: {
      patterns: [
        /mundo é perigoso/, /não posso confiar/, /vou ser machucado/,
        /é arriscado/, /algo ruim vai acontecer/, /não é seguro/
      ],
      indicators: ["perigo", "desconfiança", "ameaça"],
      centralBelief: "O mundo é perigoso"
    },
    demanding: {
      patterns: [
        /muito difícil/, /exigente demais/, /não consigo acompanhar/,
        /pressão constante/, /cobrança excessiva/, /muito complicado/
      ],
      indicators: ["demandas", "pressão", "exigências"],
      centralBelief: "O mundo é muito exigente"
    },
    unfair: {
      patterns: [
        /injusto/, /desigual/, /não é justo/, /outros têm mais sorte/,
        /sempre prejudicado/, /nunca dá certo para mim/
      ],
      indicators: ["injustiça", "desigualdade", "frustração"],
      centralBelief: "O mundo é injusto"
    }
  },
  
  // Crenças Centrais sobre o FUTURO
  future: {
    hopeless: {
      patterns: [
        /não vai melhorar/, /sem esperança/, /sempre será assim/,
        /não tem jeito/, /nunca vai dar certo/, /está perdido/
      ],
      indicators: ["desesperança", "resignação", "pessimismo"],
      centralBelief: "O futuro é sem esperança"
    },
    catastrophic: {
      patterns: [
        /vai ser terrível/, /catástrofe/, /pior coisa possível/,
        /desastre/, /vai acabar mal/, /será horrível/
      ],
      indicators: ["catastrofização", "antecipação negativa"],
      centralBelief: "O futuro será catastrófico"
    }
  }
};

// Crenças Intermediárias (Regras, Atitudes, Suposições)
const intermediateBeliefsPatterns = {
  // Regras condicionais ("Se... então...")
  conditionalRules: [
    {
      pattern: /se eu não for perfeito|se eu errar|se eu falhar/,
      type: "perfectionism",
      rule: "Se eu não for perfeito, então serei rejeitado",
      intervention: "Vamos questionar: é realmente necessário ser perfeito para ser aceito?"
    },
    {
      pattern: /se eu não agradar|se eu disser não|se eu decepcionar/,
      type: "people_pleasing", 
      rule: "Se eu não agradar todos, então não serei amado",
      intervention: "É possível agradar a todos? O que acontece quando tentamos isso?"
    },
    {
      pattern: /se eu confiar|se eu me abrir|se eu me aproximar/,
      type: "mistrust",
      rule: "Se eu confiar nas pessoas, então serei machucado",
      intervention: "Todas as pessoas são iguais? Existem graus de confiança?"
    }
  ],
  
  // Atitudes e suposições
  attitudes: [
    {
      pattern: /tenho que ser|devo sempre|preciso|é obrigatório/,
      type: "should_statements",
      attitude: "Exigências absolutas sobre si mesmo",
      intervention: "Vamos transformar esse 'tenho que' em 'seria bom se'. Como fica?"
    },
    {
      pattern: /todos|sempre|nunca|ninguém/,
      type: "all_or_nothing",
      attitude: "Pensamento dicotômico",
      intervention: "Que evidências temos para essa generalização? Existem exceções?"
    }
  ]
};

// Técnica da Seta Descendente para identificar crenças centrais
function identifyCoreBeliefs(message: string) {
  const msg = message.toLowerCase();
  const identifiedBeliefs: Array<{
    domain: string;
    type: string;
    centralBelief: string;
    confidence: number;
  }> = [];
  
  // Analisar crenças sobre o self
  Object.entries(coreBeliefsCategories.self).forEach(([key, belief]) => {
    belief.patterns.forEach(pattern => {
      if (pattern.test(msg)) {
        identifiedBeliefs.push({
          domain: 'self',
          type: key,
          centralBelief: belief.centralBelief,
          confidence: 0.8
        });
      }
    });
  });
  
  // Analisar crenças sobre o mundo
  Object.entries(coreBeliefsCategories.world).forEach(([key, belief]) => {
    belief.patterns.forEach(pattern => {
      if (pattern.test(msg)) {
        identifiedBeliefs.push({
          domain: 'world',
          type: key,
          centralBelief: belief.centralBelief,
          confidence: 0.7
        });
      }
    });
  });
  
  // Analisar crenças sobre o futuro
  Object.entries(coreBeliefsCategories.future).forEach(([key, belief]) => {
    belief.patterns.forEach(pattern => {
      if (pattern.test(msg)) {
        identifiedBeliefs.push({
          domain: 'future',
          type: key,
          centralBelief: belief.centralBelief,
          confidence: 0.9
        });
      }
    });
  });
  
  return identifiedBeliefs;
}

function identifyIntermediateBeliefs(message: string) {
  const msg = message.toLowerCase();
  const identifiedRules: Array<{
    type: string;
    category: string;
    rule?: string;
    attitude?: string;
    intervention: string;
  }> = [];
  
  // Identificar regras condicionais
  intermediateBeliefsPatterns.conditionalRules.forEach(rule => {
    if (rule.pattern.test(msg)) {
      identifiedRules.push({
        type: 'conditional_rule',
        category: rule.type,
        rule: rule.rule,
        intervention: rule.intervention
      });
    }
  });
  
  // Identificar atitudes disfuncionais
  intermediateBeliefsPatterns.attitudes.forEach(attitude => {
    if (attitude.pattern.test(msg)) {
      identifiedRules.push({
        type: 'dysfunctional_attitude',
        category: attitude.type,
        attitude: attitude.attitude,
        intervention: attitude.intervention
      });
    }
  });
  
  return identifiedRules;
}

// Gerar perguntas da seta descendente
function generateIntermediateBeliefQuestion(belief: any) {
  const pattern = belief.rule || belief.attitude || belief.pattern;
  const questions = [
    `Quando você pensa "${pattern}", como isso afeta suas ações?`,
    `Que evidências você tem de que "${pattern}" é sempre verdade?`,
    `O que aconteceria se você questionasse a regra "${pattern}"?`,
    `Como essa crença "${pattern}" influencia seus relacionamentos?`,
    `Existe uma forma mais flexível de pensar sobre "${pattern}"?`,
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
}

function generateDownwardArrowQuestions(belief: { centralBelief: string; domain: string }) {
  const questions = [
    "Se isso fosse verdade, o que isso significaria sobre você?",
    "E se isso acontecesse, qual seria o pior aspecto disso?",
    "O que isso diz sobre você como pessoa?",
    "Se outros soubessem disso, o que eles pensariam sobre você?",
    "O que isso significa sobre sua capacidade de ser feliz?"
  ];
  
  return `Percebo que você pode ter a crença de que "${belief.centralBelief}". ${questions[Math.floor(Math.random() * questions.length)]}`;
}

// Técnicas de intervenção baseadas nas crenças identificadas
function generateBeliefIntervention(coreBeliefs: any[], intermediateBeliefs: any[]) {
  let intervention = "";
  
  if (coreBeliefs.length > 0) {
    const belief = coreBeliefs[0];
    
    switch(belief.domain) {
      case 'self':
        intervention = "Vamos examinar essa crença sobre você mesmo. Que evidências você tem de que isso é completamente verdade? E que evidências contrárias existem?";
        break;
      case 'world':
        intervention = "Notei uma perspectiva sobre como o mundo funciona. Será que essa visão se aplica a todas as situações? Vamos explorar exceções.";
        break;
      case 'future':
        intervention = "Parece que há uma expectativa sobre o futuro. Como podemos tornar essa previsão mais equilibrada e realista?";
        break;
    }
  }
  
  if (intermediateBeliefs.length > 0) {
    const rule = intermediateBeliefs[0];
    const pattern = rule.rule || rule.attitude || "essa crença";
    intervention += ` Noto um padrão de pensamento: "${pattern}". ${generateIntermediateBeliefQuestion(rule)}.`;
  }
  
  return intervention || "Vamos explorar os pensamentos por trás desses sentimentos. O que está passando pela sua mente agora?";
}

// Protocolos TCC Avançados
const advancedTCCProtocols = {
  depressionProtocol: {
    phases: ['assessment', 'behavioral_activation', 'cognitive_restructuring', 'relapse_prevention'],
    techniques: ['thoughtRecord', 'activityScheduling', 'behavioralExperiment', 'evidenceExamination'],
    sessionGoals: {
      1: 'Estabelecer rapport e avaliar sintomas',
      2: 'Psicoeducação sobre TCC e depressão',
      3: 'Ativação comportamental - agendar atividades prazerosas',
      4: 'Identificar pensamentos automáticos',
      5: 'Questionamento de pensamentos distorcidos',
      6: 'Técnicas de resolução de problemas'
    }
  },
  anxietyProtocol: {
    phases: ['psychoeducation', 'relaxation_training', 'exposure_therapy', 'maintenance'],
    techniques: ['relaxationTraining', 'gradedExposure', 'cognitiveRestructuring', 'mindfulness'],
    sessionGoals: {
      1: 'Compreender o ciclo da ansiedade',
      2: 'Treinar técnicas de respiração e relaxamento',
      3: 'Identificar gatilhos e evitação',
      4: 'Hierarquia de exposição gradual',
      5: 'Reestruturação cognitiva de medos',
      6: 'Prevenção de recaídas'
    }
  }
};

// Análise de padrões emocionais
function analyzeEmotionalPatterns(message: string) {
  const emotionalKeywords = {
    depression: ['triste', 'deprimido', 'sem energia', 'desesperança', 'inútil', 'culpa', 'vazio', 'desmotivado'],
    anxiety: ['ansioso', 'preocupado', 'nervoso', 'tenso', 'medo', 'pânico', 'inquieto', 'apreensivo'],
    anger: ['raiva', 'irritado', 'furioso', 'zangado', 'indignado', 'revoltado', 'ódio'],
    shame: ['vergonha', 'envergonhado', 'humilhado', 'constrangido', 'inadequado', 'ridículo'],
    fear: ['medo', 'terror', 'pavor', 'receio', 'apreensivo', 'temeroso', 'assustado']
  };

  const detectedEmotions: string[] = [];
  const message_lower = message.toLowerCase();
  
  Object.entries(emotionalKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => message_lower.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  });

  return detectedEmotions;
}

// Detector de distorções cognitivas
function detectCognitiveDistortions(message: string) {
  const distortions = {
    allOrNothing: {
      patterns: ['sempre', 'nunca', 'tudo', 'nada', 'completamente', 'totalmente', 'todos', 'ninguém'],
      description: 'Pensamento Tudo ou Nada - Ver situações apenas em extremos'
    },
    overgeneralization: {
      patterns: ['sempre acontece', 'toda vez', 'todo mundo', 'todas as pessoas'],
      description: 'Generalização Excessiva - Tirar conclusões amplas baseadas em eventos isolados'
    },
    mentalFilter: {
      patterns: ['só vejo', 'apenas', 'somente o que', 'não consigo parar de pensar'],
      description: 'Filtro Mental - Focar apenas nos aspectos negativos'
    },
    jumpingToConclusions: {
      patterns: ['tenho certeza que', 'sei que ele pensa', 'vai dar errado', 'não vai funcionar'],
      description: 'Saltar para Conclusões - Fazer interpretações negativas sem evidências'
    },
    catastrophizing: {
      patterns: ['terrível', 'catástrofe', 'desastre', 'fim do mundo', 'horrível', 'pior coisa'],
      description: 'Catastrofização - Imaginar o pior cenário possível'
    },
    shouldStatements: {
      patterns: ['deveria', 'tinha que', 'preciso', 'é obrigatório', 'tenho que'],
      description: 'Afirmações "Deveria" - Expectativas rígidas sobre si mesmo ou outros'
    }
  };

  const detectedDistortions: Array<{type: string; description: string}> = [];
  const message_lower = message.toLowerCase();
  
  Object.entries(distortions).forEach(([type, distortion]) => {
    if (distortion.patterns.some(pattern => message_lower.includes(pattern))) {
      detectedDistortions.push({
        type,
        description: distortion.description
      });
    }
  });

  return detectedDistortions;
}

// Técnicas específicas de intervenção 
const interventionTechniques = {
  thoughtRecord: "📝 **Registro de Pensamentos** - Vamos identificar: Situação → Emoção → Pensamento Automático → Evidências → Pensamento Balanceado",
  behavioralExperiment: "🔬 **Experimento Comportamental** - Teste suas predições na prática: O que você acha que vai acontecer vs. o que realmente acontece",
  cognitiveRestructuring: "🧠 **Reestruturação Cognitiva** - Questione: Qual a evidência? Existe outra explicação? O que você diria para um amigo?",
  downwardArrow: "⬇️ **Seta Descendente** - Vamos explorar: 'E se isso for verdade, o que significa sobre você?'",
  evidenceExamination: "⚖️ **Exame de Evidências** - Evidências A FAVOR vs. CONTRA esse pensamento",
  alternativePerspectives: "🔍 **Perspectivas Alternativas** - Como outra pessoa veria esta situação?",
  gradedExposure: "📈 **Exposição Gradual** - Enfrente seus medos passo a passo, começando pelo mais fácil",
  mindfulness: "🧘 **Mindfulness** - Observe seus pensamentos como nuvens passando - sem julgamento, apenas notando",
  problemSolving: "🎯 **Resolução de Problemas** - 1) Defina o problema 2) Gere soluções 3) Avalie opções 4) Implemente",
  relaxationTraining: "😌 **Treinamento de Relaxamento** - Respiração diafragmática: inspire por 4, segure por 4, expire por 6"
};

// Função para extrair sintomas da mensagem do usuário
function extractSymptomsFromMessage(message: string): string[] {
  const symptoms: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  // Palavras-chave relacionadas a sintomas comuns
  const symptomKeywords = [
    'ansiedade', 'preocupação', 'medo', 'pânico', 'nervoso',
    'depressão', 'tristeza', 'desânimo', 'sem energia', 'cansaço',
    'insônia', 'sono', 'dormir', 'despertar',
    'irritabilidade', 'raiva', 'explosão',
    'concentração', 'atenção', 'foco', 'esquecimento',
    'obsessão', 'compulsão', 'verificar', 'repetir',
    'trauma', 'flashback', 'evitar', 'reviver',
    'isolamento', 'solidão', 'evito pessoas',
    'autoestima', 'inutilidade', 'culpa', 'vergonha'
  ];
  
  symptomKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
      symptoms.push(keyword);
    }
  });
  
  return symptoms;
}

export async function POST(req: Request) {
  try {
    const startTime = Date.now();
    const body = await req.json();
    const requiredFields = ["userId", "message"];

    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }

    if (!validateString(body.userId) || !validateString(body.message)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Delay terapêutico
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const message = body.message;
    const userId = body.userId;
    const responseTime = body.responseTime || 30000;
    
    // Analisar contexto da conversa usando novo sistema
    const emotionalTone = ConversationFlow.detectEmotionalTone(message);
    const userEngagement = ConversationFlow.detectEngagement(message);
    const sessionCount = body.sessionCount || 1;
    
    // Carregar perfil de personalização
    const personalizationProfile = personalizationEngine.loadProfile(userId);

    // Combinar todos os protocolos e técnicas
    const allProtocols = [...DSM5_PROTOCOLS, ...DSM5_ADDITIONAL_PROTOCOLS];
    const allTechniques = [...TCC_TECHNIQUES, ...TCC_ADDITIONAL_TECHNIQUES];

    // Detectar protocolos DSM-5 aplicáveis baseados nos sintomas relatados
    const extractedSymptoms = extractSymptomsFromMessage(message);
    const suggestedProtocols = ProtocolDetectionSystem.detectProtocol(extractedSymptoms, {
      previousDiagnoses: personalizationProfile.triggers || []
    });
    
    // Preparar informações de protocolo DSM-5 quando relevante
    let protocolInfo = '';
    if (suggestedProtocols.length > 0 && extractedSymptoms.length > 2) {
      const primaryProtocol = suggestedProtocols[0];
      protocolInfo = `\n\n🏥 **Protocolo Clínico Baseado no DSM-5**: *${primaryProtocol.name}*\n`;
      protocolInfo += `📋 **Técnicas Recomendadas**: ${primaryProtocol.interventions.slice(0, 3).join(', ')}\n`;
      protocolInfo += `⏱️ **Duração Estimada**: ${primaryProtocol.duration} | 📈 **Eficácia**: ${primaryProtocol.efficacyRate}%\n`;
      
      // Adicionar técnicas específicas encontradas
      const relevantTechniques = allTechniques.filter(tech => 
        primaryProtocol.interventions.includes(tech.id)
      ).slice(0, 2);
      
      if (relevantTechniques.length > 0) {
        protocolInfo += `\n🔧 **Técnicas Específicas Disponíveis**:\n`;
        relevantTechniques.forEach(tech => {
          protocolInfo += `• **${tech.name}**: ${tech.description}\n`;
        });
      }
      protocolInfo += '\n---\n';
    }
    
    const coreBeliefs = identifyCoreBeliefs(message);
    const intermediateBeliefs = identifyIntermediateBeliefs(message);
    const emotionalPatterns = analyzeEmotionalPatterns(message);
    const cognitiveDistortions = detectCognitiveDistortions(message);
    
    let reply: string;
    let technique = "exploration";

    // CONVERSAS MAIS NATURAIS E EMPÁTICAS
    // Saudações iniciais
    if (message.toLowerCase().match(/oi|olá|boa tarde|boa noite|bom dia|hey|e aí/)) {
      const timeBasedGreeting = new Date().getHours() < 12 ? 'Bom dia' : 
                               new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
      
      reply = `${timeBasedGreeting}! 😊

Que bom te ver aqui! Sou a Clara, e estou aqui para te acompanhar. 

Como você está se sentindo hoje? Pode ficar à vontade para me contar o que está passando pela sua cabeça.`;
      technique = "warm_greeting";
    }
    // Respostas baseadas no tom emocional detectado
    else {
      const empathicResponse = ConversationFlow.generateEmpathicResponse(message, emotionalTone, userEngagement);
      const followUpQuestion = ConversationFlow.generateFollowUpQuestion(message, emotionalTone);
      
      reply = `${empathicResponse}

${followUpQuestion}`;
      
      // Adicionar validação para casos difíceis
      if (emotionalTone === 'negative' && userEngagement === 'high') {
        const validation = validationResponses[Math.floor(Math.random() * validationResponses.length)];
        reply = `${validation} ${reply}`;
      }
      
      // Adicionar protocolo de forma sutil se relevante
      if (protocolInfo && extractedSymptoms.length > 1) {
        reply += `\n\n💙 *Vejo alguns padrões que poderíamos explorar juntos.*\n${protocolInfo}`;
      }
      
      technique = `natural_${emotionalTone}_response`;
    }
      const timeOfDay = personalizationProfile.interactionPatterns.preferredTimeOfDay;
      const greeting = timeOfDay === 'morning' ? 'Bom dia' : 
                      timeOfDay === 'afternoon' ? 'Boa tarde' : 'Boa noite';
      
      reply = `${greeting}! 😊 

Que bom te ver por aqui! Sou a Clara, e estou aqui para te acompanhar nessa jornada. 

Como você tem se sentido ultimamente? Pode me contar o que está passando pela sua cabeça hoje?`;
      technique = "natural_welcome";
    }
    // Conversas sobre sentimentos - MAIS EMPÁTICA
    else if (emotionalPatterns.includes('depression')) {
      const depressiveKeywords = ['triste', 'deprimido', 'down', 'pra baixo', 'sem energia', 'cansado', 'sem vontade'];
      const hasDepressiveWords = depressiveKeywords.some(word => message.toLowerCase().includes(word));
      
      if (hasDepressiveWords) {
        reply = `Posso imaginar como deve ser difícil se sentir assim. É muito corajoso da sua parte compartilhar isso comigo. 💙

Me conte um pouco mais... quando você começou a se sentir assim? Tem alguma coisa específica que você acha que pode ter contribuído para isso?

${protocolInfo}

Vamos trabalhar juntos para entender melhor o que está acontecendo, sem pressa.`;
      } else {
        reply = `Estou percebendo que as coisas não andam fáceis pra você. Obrigada por confiar em mim para dividir isso.

O que seria mais útil agora: conversar sobre como você está se sentindo, ou pensar em alguma coisa pequena que poderia te dar uma sensação boa hoje?

${protocolInfo}`;
      }
      technique = "empathetic_depression_response";
    }
    // Ansiedade - MAIS ACOLHEDORA
    else if (emotionalPatterns.includes('anxiety')) {
      const anxietyKeywords = ['ansioso', 'nervoso', 'preocupado', 'medo', 'pânico', 'agitado'];
      const hasAnxietyWords = anxietyKeywords.some(word => message.toLowerCase().includes(word));
      
      if (hasAnxietyWords) {
        reply = `Entendo que você está sentindo essa ansiedade... É uma sensação muito desconfortável mesmo. 🌟

Vamos respirar um pouquinho juntos primeiro? 

Agora me conte: o que está te deixando mais preocupado(a) neste momento? Às vezes só falar sobre isso já ajuda a organizar os pensamentos.

${protocolInfo}`;
      } else {
        reply = `Posso sentir uma energia de preocupação no que você está me contando. É normal se sentir assim às vezes.

Que tal me contar mais detalhes sobre essa situação? Às vezes quando colocamos tudo "no papel", fica mais claro o que realmente está acontecendo.

${protocolInfo}`;
      }
      technique = "supportive_anxiety_response";
    }
    // Distorções cognitivas - QUESTIONAMENTO GENTIL
    else if (cognitiveDistortions.length > 0) {
      const distortion = cognitiveDistortions[0];
      
      reply = `Hmm, notei algo interessante no que você disse... 🤔

"${message.substring(0, 80)}..."

Será que podemos olhar para isso de outro ângulo? Às vezes nossa mente nos prega umas peças e nos faz ver as coisas de um jeito muito categórico.

Me ajuda a entender: como você chegou a essa conclusão? Tem alguma coisa que talvez contradiga essa ideia?

${protocolInfo}`;
      
      technique = "gentle_cognitive_restructuring";
    }
    // Se crenças foram identificadas, usar intervenção específica personalizada
    else if (coreBeliefs.length > 0 || intermediateBeliefs.length > 0) {
      let baseResponse = generateBeliefIntervention(coreBeliefs, intermediateBeliefs);
      
      // Verificar se o usuário tem triggers relacionados
      const beliefTopics = [...coreBeliefs.map(b => b.domain), ...intermediateBeliefs.map(b => b.category)];
      const hasRelatedTriggers = personalizationProfile.triggers.some(trigger => 
        beliefTopics.some(topic => topic.includes(trigger))
      );
      
      if (hasRelatedTriggers) {
        baseResponse = `Vamos abordar isso com cuidado, pois percebo que é um tema sensível para você. ` + baseResponse;
      }
      
      reply = personalizationEngine.personalizeResponse(baseResponse, personalizationProfile, { coreBeliefs, intermediateBeliefs });
      technique = "personalized_belief_identification";
      
      // Adicionar pergunta da seta descendente personalizada
      if (coreBeliefs.length > 0) {
        const personalizedQuestion = generateDownwardArrowQuestions(coreBeliefs[0]);
        reply = personalizationEngine.personalizeResponse(personalizedQuestion, personalizationProfile, { coreBeliefs });
        technique = "personalized_downward_arrow";
      }
    }
    // RESPOSTA PADRÃO MAIS NATURAL E CONVERSACIONAL
    else {
      // Respostas mais naturais e variadas
      const naturalResponses = [
        `Estou ouvindo você... ${message.length > 50 ? 'Parece que tem bastante coisa passando pela sua cabeça.' : ''} 

Me ajuda a entender melhor: como você está se sentindo sobre essa situação?`,

        `Entendi... ${protocolInfo ? 'Vejo que isso pode estar conectado com alguns padrões importantes.' : ''} 

O que mais está te incomodando nisso tudo? Às vezes ajuda colocar os pensamentos em ordem.`,

        `Obrigada por compartilhar isso comigo. 💙

Quando você pensa nessa situação, que sensação aparece no seu corpo? E que pensamentos vêm à sua mente?`,

        `Posso imaginar como isso deve ser difícil para você...

Me conte: essa situação te lembra de alguma outra coisa que já aconteceu antes? Ou é algo completamente novo?`,

        `Hmm, interessante... 

Se um amigo seu estivesse passando exatamente pela mesma situação, o que você diria para ele? Que conselho daria?`
      ];
      
      const randomIndex = Math.floor(Math.random() * naturalResponses.length);
      let baseResponse = naturalResponses[randomIndex];
      
      // Adicionar protocolo se relevante
      if (protocolInfo) {
        baseResponse += `\n\n${protocolInfo}`;
      }
      
      reply = personalizationEngine.personalizeResponse(baseResponse, personalizationProfile, { 
        extractedSymptoms, 
        emotionalPatterns, 
        suggestedProtocols 
      });
      technique = "natural_exploration";
    }

    // Analisar esta interação e atualizar perfil
    const endTime = Date.now();
    const actualResponseTime = endTime - startTime;
    
    const updatedProfile = personalizationEngine.analyzeInteraction(
      userId, 
      message, 
      reply, 
      { 
        technique, 
        coreBeliefs, 
        intermediateBeliefs, 
        emotionalPatterns, 
        cognitiveDistortions 
      }, 
      responseTime
    );

    return NextResponse.json({ 
      reply,
      tccContext: {
        technique: technique,
        coreBeliefs: coreBeliefs,
        intermediateBeliefs: intermediateBeliefs,
        emotionalPatterns: emotionalPatterns,
        cognitiveDistortions: cognitiveDistortions,
        interventionType: coreBeliefs.length > 0 ? "core-belief-work" : 
                        intermediateBeliefs.length > 0 ? "intermediate-belief-work" :
                        cognitiveDistortions.length > 0 ? "distortion-correction" :
                        emotionalPatterns.length > 0 ? "emotional-regulation" : "exploration",
        sessionPhase: emotionalPatterns.includes('depression') ? 'behavioral_activation' :
                     emotionalPatterns.includes('anxiety') ? 'relaxation_training' : 'assessment',
        personalization: {
          communicationStyle: updatedProfile.communicationStyle,
          emotionalSensitivity: updatedProfile.emotionalSensitivity,
          preferredTechniques: updatedProfile.preferredTechniques.slice(0, 3), // Top 3
          adaptations: updatedProfile.adaptations
        }
      }
    });
    
  } catch (err: unknown) {
    console.error("Erro na API TCC:", err);
    return NextResponse.json({
      error: "Desculpe, tive uma dificuldade técnica. Que tal continuarmos explorando seus pensamentos de forma mais simples?"
    }, { status: 500 });
  }
}
