/* eslint-disable */
import { NextResponse } from "next/server";
import { validateString, validateRequired } from "@/lib/validate";
import { personalizationEngine } from '@/lib/personalization';
import { DSM5_PROTOCOLS, TCC_TECHNIQUES, ProtocolDetectionSystem } from '@/lib/dsm5-protocols';
import { DSM5_ADDITIONAL_PROTOCOLS, TCC_ADDITIONAL_TECHNIQUES } from '@/lib/dsm5-additional-protocols';
import { ConversationFlow } from '@/lib/conversation-flow';

// Sistema de Crenças TCC baseado em Aaron Beck

// Gerar perguntas da seta descendente
function generateIntermediateBeliefQuestion(belief: { rule?: string; attitude?: string; pattern?: string }) {
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
function generateBeliefIntervention(coreBeliefs: Array<{ domain: string }>, intermediateBeliefs: Array<{ rule?: string; attitude?: string; pattern?: string }>) {
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

// Análise de padrões emocionais
function analyzeEmotionalPatterns(message: string): string[] {
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
function detectCognitiveDistortions(message: string): string[] {
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
    }
  };
  // Função fictícia para manter compatibilidade
  return [];
}

export async function POST(req: Request) {
  try {
    // const startTime = Date.now();
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
    // const sessionCount = body.sessionCount || 1;
    
    // Carregar perfil de personalização
    const personalizationProfile = personalizationEngine.loadProfile(userId);

    // Combinar todos os protocolos e técnicas
    // const allProtocols = [...DSM5_PROTOCOLS, ...DSM5_ADDITIONAL_PROTOCOLS];
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
      reply = `${timeBasedGreeting}! 😊\n\nQue bom te ver aqui! Sou a Clara, e estou aqui para te acompanhar.\n\nComo você está se sentindo hoje? Pode ficar à vontade para me contar o que está passando pela sua cabeça.`;
      technique = "warm_greeting";
    } else if (emotionalPatterns.includes('depression')) {
      technique = "empathetic_depression_response";
    } else if (emotionalPatterns.includes('anxiety')) {
      const anxietyKeywords = ['ansioso', 'nervoso', 'preocupado', 'medo', 'pânico', 'agitado'];
      const hasAnxietyWords = anxietyKeywords.some(word => message.toLowerCase().includes(word));
      if (hasAnxietyWords) {
        reply = `Entendo que você está sentindo essa ansiedade... É uma sensação muito desconfortável mesmo. 🌟\n\nVamos respirar um pouquinho juntos primeiro?\n\nAgora me conte: o que está te deixando mais preocupado(a) neste momento? Às vezes só falar sobre isso já ajuda a organizar os pensamentos.\n\n${protocolInfo}`;
      } else {
        reply = `Posso sentir uma energia de preocupação no que você está me contando. É normal se sentir assim às vezes.\n\nQue tal me contar mais detalhes sobre essa situação? Às vezes quando colocamos tudo "no papel", fica mais claro o que realmente está acontecendo.\n\n${protocolInfo}`;
      }
      technique = "supportive_anxiety_response";
    } else if (cognitiveDistortions.length > 0) {
      // const distortion = cognitiveDistortions[0];
      reply = `Hmm, notei algo interessante no que você disse... 🤔\n\n"${message.substring(0, 80)}..."\n\nSerá que podemos olhar para isso de outro ângulo? Às vezes nossa mente nos prega umas peças e nos faz ver as coisas de um jeito muito categórico.\n\nMe ajuda a entender: como você chegou a essa conclusão? Tem alguma coisa que talvez contradiga essa ideia?\n\n${protocolInfo}`;
      technique = "gentle_cognitive_restructuring";
    }
    // Se crenças foram identificadas, usar intervenção específica personalizada
    else if (coreBeliefs.length > 0 || intermediateBeliefs.length > 0) {
      let baseResponse = generateBeliefIntervention(coreBeliefs, intermediateBeliefs);
      
      // Verificar se o usuário tem triggers relacionados
      const beliefTopics = [
        ...coreBeliefs.map(b => b.domain),
        ...intermediateBeliefs.map((b: { category: string }) => b.category)
      ];
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
  } // <-- fechamento do try
  catch (error) {
    console.error('Erro no endpoint de chat:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
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
}
