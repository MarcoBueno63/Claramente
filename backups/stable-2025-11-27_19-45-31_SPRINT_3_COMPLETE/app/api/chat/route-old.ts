import { NextRequest, NextResponse } from "next/server";

interface ConversationMemory {
  sessionPhase: 'assessment' | 'exploration' | 'intervention' | 'practice' | 'integration';
  currentProtocol: string;
  sessionGoals: string[];
  userProfile: {
    primaryConcerns: string[];
    emotionalPatterns: string[];
    cognitiveDistortions: string[];
    preferredInteractionStyle: 'direct' | 'gentle' | 'exploratory';
    engagementLevel: number;
  };
  sessionProgress: {
    currentStep: number;
    totalSteps: number;
    completedExercises: string[];
    homeworkAssigned: boolean;
  };
  conversationFlow: {
    lastQuestionType: 'open' | 'specific' | 'reflective';
    lastTopic: string;
    continuityMarkers: string[];
  };
  insights: {
    keyRealizations: string[];
    progressIndicators: string[];
    adaptiveResponses: string[];
  };
  messageCount: number;
  lastInteraction: Date;
}

const conversationMemories = new Map<string, ConversationMemory>();

function getConversationMemory(userId: string): ConversationMemory {
  if (!conversationMemories.has(userId)) {
    conversationMemories.set(userId, {
      sessionPhase: 'assessment',
      currentProtocol: 'geral',
      sessionGoals: [],
      userProfile: {
        primaryConcerns: [],
        emotionalPatterns: [],
        cognitiveDistortions: [],
        preferredInteractionStyle: 'gentle',
        engagementLevel: 5
      },
      sessionProgress: {
        currentStep: 0,
        totalSteps: 5,
        completedExercises: [],
        homeworkAssigned: false
      },
      conversationFlow: {
        lastQuestionType: 'open',
        lastTopic: '',
        continuityMarkers: []
      },
      insights: {
        keyRealizations: [],
        progressIndicators: [],
        adaptiveResponses: []
      },
      messageCount: 0,
      lastInteraction: new Date()
    });
  }
  return conversationMemories.get(userId)!;
}

function updateConversationMemory(userId: string, updates: Partial<ConversationMemory>) {
  const current = getConversationMemory(userId);
  conversationMemories.set(userId, { ...current, ...updates });
}

function generateStructuredResponse(message: string, memory: ConversationMemory, userId: string): any {
  const messageCount = memory.messageCount;
  const lowerMessage = message.toLowerCase();
  
  if (messageCount === 0) {
    let issueType = 'geral';
    let initialResponse = '';
    let followUpQuestion = '';
    
    if (lowerMessage.includes('ansioso') || lowerMessage.includes('nervoso') || lowerMessage.includes('preocupado') || lowerMessage.includes('medo')) {
      issueType = 'ansiedade';
      initialResponse = `Entendo que você está se sentindo ansioso. A ansiedade pode ser muito desafiadora, mas existem técnicas eficazes para lidarmos com ela.`;
      followUpQuestion = `Me conte mais sobre quando você sente essa ansiedade - em que situações específicas ela aparece?`;
    } else if (lowerMessage.includes('triste') || lowerMessage.includes('deprimido') || lowerMessage.includes('vazio') || lowerMessage.includes('sem energia')) {
      issueType = 'depressao';
      initialResponse = `Reconheço que você está passando por um momento difícil com sentimentos de tristeza. É corajoso da sua parte buscar ajuda.`;
      followUpQuestion = `Como tem sido seu dia a dia? O que mudou na sua rotina ou nos seus sentimentos recentemente?`;
    } else if (lowerMessage.includes('autoestima') || lowerMessage.includes('confiança') || lowerMessage.includes('inseguro') || lowerMessage.includes('incapaz')) {
      issueType = 'autoestima';
      initialResponse = `Vejo que questões de autoestima têm te incomodado. Trabalhar a autoimagem é um processo importante e valioso.`;
      followUpQuestion = `O que específicamente faz você se sentir assim sobre si mesmo? Há alguma situação recente que disparou esses sentimentos?`;
    } else {
      initialResponse = `Obrigada por compartilhar isso comigo. Estou aqui para te ajudar usando técnicas de Terapia Cognitivo-Comportamental.`;
      followUpQuestion = `Para eu te ajudar melhor, pode me contar mais detalhes sobre o que está acontecendo? O que te trouxe aqui hoje?`;
    }
    
    updateConversationMemory(userId, {
      currentProtocol: issueType,
      userProfile: {
        ...memory.userProfile,
        primaryConcerns: [issueType]
      },
      messageCount: 1
    });
    
    return {
      message: `${initialResponse}\n\n${followUpQuestion}`,
      guidance: "💡 Fique à vontade para ser específico - quanto mais detalhes, melhor posso te ajudar."
    };
  }
  
  return generateContextualResponse(message, memory, userId);
}

function generateContextualResponse(message: string, memory: ConversationMemory, userId: string): any {
  const messageCount = memory.messageCount;
  const userConcerns = memory.userProfile?.primaryConcerns || [];
  const currentPhase = memory.sessionProgress?.currentStep || 1;
  
  if (messageCount === 1) {
    const empathicResponse = getEmpathicResponse(message, userConcerns[0]);
    
    updateConversationMemory(userId, {
      messageCount: messageCount + 1,
      sessionProgress: {
        ...memory.sessionProgress,
        currentStep: 2
      }
    });
    
    if (userConcerns[0] === 'ansiedade') {
      return {
        message: `${empathicResponse}

Vou te ajudar a trabalhar essa ansiedade. Pelo que você descreveu, percebo que isso realmente tem impactado sua vida.

**Vamos começar identificando os gatilhos:** Quando você sente essa ansiedade, que pensamentos específicos passam pela sua cabeça?`,
        guidance: "🧠 Identificar pensamentos automáticos é o primeiro passo da TCC para ansiedade."
      };
    } else {
      return {
        message: `${empathicResponse}

Obrigada por compartilhar mais detalhes comigo. Isso me ajuda a entender melhor sua situação.

**Agora vamos aprofundar:** Como isso que você descreveu tem afetado seu dia a dia? O que mudou na sua rotina?`,
        guidance: "💡 Vamos mapear o impacto para encontrar pontos de intervenção."
      };
    }
  }
  
  if (messageCount === 2) {
    updateConversationMemory(userId, {
      messageCount: messageCount + 1,
      sessionProgress: {
        ...memory.sessionProgress,
        currentStep: 3
      }
    });
    
    return {
      message: `Entendo. O que você está descrevendo faz muito sentido considerando sua situação.

**Vou te ensinar uma técnica da TCC:** Vamos questionar esses pensamentos usando o "Teste de Realidade".

Pegue um desses pensamentos que você mencionou e me responda: **Que evidências concretas você tem de que esse pensamento é 100% verdadeiro?**`,
      guidance: "🔍 O questionamento socrático é uma ferramenta poderosa para reestruturação cognitiva."
    };
  }
  
  if (messageCount >= 3) {
    updateConversationMemory(userId, {
      messageCount: messageCount + 1,
      sessionProgress: {
        ...memory.sessionProgress,
        currentStep: Math.min(currentPhase + 1, 5)
      }
    });
    
    return {
      message: `Excelente reflexão! Você está desenvolvendo uma boa consciência sobre seus padrões.

**Agora vamos trabalhar uma estratégia prática:**

1. **Respiração 4-7-8**: Inspire por 4, segure por 7, expire por 8 segundos
2. **Reformulação**: Em vez dos pensamentos negativos, que tal pensar: "Estou aprendendo a lidar com isso"

**Quer praticar uma dessas técnicas agora ou tem alguma dúvida sobre como aplicá-las?**`,
      guidance: "🎯 Agora estamos na fase prática - aplicando as técnicas no seu contexto específico!"
    };
  }
  
  return {
    message: `Obrigada por compartilhar isso comigo. Percebo que você está refletindo sobre questões importantes.

**Vamos continuar trabalhando:** O que você gostaria de focar agora - entender melhor seus pensamentos ou praticar alguma técnica específica?`,
    guidance: "💭 Vamos manter o foco na sua jornada de autoconhecimento."
  };
}

function getEmpathicResponse(message: string, primaryConcern: string): string {
  const empathicPhrases = {
    ansiedade: [
      "Percebo que a ansiedade realmente tem impacto significativo na sua rotina.",
      "É compreensível que você se sinta assim nessas situações.",
      "A ansiedade pode ser muito intensa, e você está sendo corajoso ao enfrentar isso."
    ],
    depressao: [
      "Entendo como esses momentos podem ser pesados e desafiadores.",
      "É difícil quando perdemos o interesse em coisas que antes nos davam prazer.",
      "Reconheço a força que você tem ao buscar ajuda mesmo se sentindo assim."
    ],
    autoestima: [
      "Percebo como essas situações afetam a forma como você se vê.",
      "É natural questionar nossa capacidade em momentos difíceis.",
      "Muitas pessoas passam por dúvidas similares sobre seu próprio valor."
    ]
  };
  
  const phrases = empathicPhrases[primaryConcern as keyof typeof empathicPhrases] || [
    "Entendo que isso tem sido desafiador para você.",
    "Obrigada por compartilhar algo tão importante comigo.",
    "Reconheço a coragem que você tem ao falar sobre isso."
  ];
  
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Mensagem é obrigatória'
      }, { status: 400 });
    }

    if (body.message.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Mensagem não pode estar vazia'
      }, { status: 400 });
    }

    if (body.message.length > 2000) {
      return NextResponse.json({
        success: false,
        error: 'Mensagem muito longa (máximo 2000 caracteres)'
      }, { status: 400 });
    }

    const userId = body.userId || 'default_user';
    const userMessage = body.message.trim();

    let memory = getConversationMemory(userId);
    const response = generateStructuredResponse(userMessage, memory, userId);
    
    updateConversationMemory(userId, {
      messageCount: memory.messageCount + 1,
      lastInteraction: new Date(),
      conversationFlow: {
        ...memory.conversationFlow,
        lastQuestionType: 'specific'
      }
    });

    return NextResponse.json({
      success: true,
      message: response.message,
      suggestions: response.suggestions || [],
      guidance: response.guidance || null,
      technique: response.technique || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}