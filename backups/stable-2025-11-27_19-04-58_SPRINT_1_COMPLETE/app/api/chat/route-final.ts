import { NextRequest, NextResponse } from "next/server";

// SISTEMA SIMPLES E FUNCIONAL
interface SimpleMemory {
  messages: Array<{user: string, assistant: string}>;
  userConcern: string;
  emotionalState: string;
  lastTopics: string[];
}

const memories = new Map<string, SimpleMemory>();

function getMemory(userId: string): SimpleMemory {
  if (!memories.has(userId)) {
    memories.set(userId, {
      messages: [],
      userConcern: '',
      emotionalState: 'neutral',
      lastTopics: []
    });
  }
  return memories.get(userId)!;
}

// ANÁLISE SIMPLES DO QUE O USUÁRIO DISSE
function analyzeMessage(message: string, memory: SimpleMemory): {
  emotion: string;
  keywords: string[];
  concern: string;
  needsSupport: boolean;
} {
  const lower = message.toLowerCase();
  
  let emotion = 'neutral';
  if (lower.includes('ansioso') || lower.includes('preocupado') || lower.includes('nervoso')) {
    emotion = 'anxious';
  } else if (lower.includes('triste') || lower.includes('deprimido') || lower.includes('mal')) {
    emotion = 'sad';
  } else if (lower.includes('irritado') || lower.includes('com raiva') || lower.includes('estressado')) {
    emotion = 'angry';
  }

  const keywords = [];
  if (lower.includes('trabalho')) keywords.push('trabalho');
  if (lower.includes('família')) keywords.push('família');
  if (lower.includes('relacionamento')) keywords.push('relacionamento');
  if (lower.includes('sempre') || lower.includes('nunca')) keywords.push('pensamento_extremo');

  let concern = memory.userConcern;
  if (!concern && emotion !== 'neutral') {
    concern = emotion === 'anxious' ? 'ansiedade' : emotion === 'sad' ? 'tristeza' : 'estresse';
  }

  const needsSupport = lower.includes('ajuda') || lower.includes('não sei') || lower.includes('difícil');

  return { emotion, keywords, concern, needsSupport };
}

// GERADOR DE RESPOSTA INTELIGENTE
function generateIntelligentResponse(userMessage: string, analysis: any, memory: SimpleMemory): string {
  const messageCount = memory.messages.length;
  const lastAssistant = memory.messages.length > 0 ? memory.messages[memory.messages.length - 1].assistant : '';

  // PRIMEIRA MENSAGEM - Acolhimento
  if (messageCount === 0) {
    if (analysis.emotion === 'anxious') {
      return `Entendo que você está se sentindo ansioso. A ansiedade pode ser muito desconfortável.

Me conte: **quando isso acontece com mais frequência?** É em situações específicas ou é mais constante?`;
    }
    
    if (analysis.emotion === 'sad') {
      return `Percebo que você está passando por um momento difícil. É corajoso buscar ajuda quando nos sentimos assim.

**O que tem deixado você mais triste ultimamente?** Aconteceu algo específico ou é um sentimento que vem crescendo?`;
    }

    return `Obrigada por compartilhar isso comigo. Estou aqui para te escutar e ajudar.

**Me conte mais sobre o que está acontecendo.** O que mais tem te incomodado?`;
  }

  // RESPOSTA BASEADA NO QUE FOI DITO ANTES
  const lastUserMessage = memory.messages.length > 0 ? memory.messages[memory.messages.length - 1].user : '';
  
  // Se o usuário respondeu sobre "quando acontece"
  if (lastAssistant.includes('quando isso acontece') && (userMessage.includes('quando') || userMessage.includes('sempre'))) {
    return `Entendo. Então você sente isso ${userMessage.includes('sempre') ? 'com bastante frequência' : 'em momentos específicos'}.

**E quando isso acontece, que pensamentos passam pela sua cabeça?** O que você costuma pensar nesses momentos?

Na TCC, identificar esses pensamentos automáticos é fundamental para conseguirmos trabalhar com eles.`;
  }

  // Se o usuário falou sobre pensamentos
  if (userMessage.toLowerCase().includes('penso') || userMessage.toLowerCase().includes('acho') || 
      lastAssistant.includes('que pensamentos') && userMessage.length > 20) {
    return `Esses pensamentos que você compartilhou são muito importantes de identificarmos.

**Vou te ensinar uma técnica simples:** quando esses pensamentos aparecem, tente se perguntar:

"**Que evidências eu tenho de que isso é realmente verdade?**"

Às vezes nossos pensamentos ansiosos/tristes não refletem a realidade completa. O que você acha dessa ideia?`;
  }

  // Se o usuário está compartilhando uma situação específica
  if (analysis.keywords.includes('trabalho') || analysis.keywords.includes('família') || 
      analysis.keywords.includes('relacionamento')) {
    const context = analysis.keywords[0];
    return `Vejo que questões de ${context} estão te afetando bastante.

**Uma reflexão importante:** nessa situação, o que está mais sob seu controle e o que não está?

Identificar isso nos ajuda a focar nossa energia no que realmente podemos mudar. Como você vê essa diferença?`;
  }

  // Se detectou pensamento extremo (sempre/nunca)
  if (analysis.keywords.includes('pensamento_extremo')) {
    return `Notei que você usou palavras como "sempre" ou "nunca". É muito comum quando estamos sofrendo vermos as coisas de forma mais extrema.

**Vamos fazer um exercício:** se um amigo seu estivesse na mesma situação e dissesse exatamente o que você disse, o que você responderia para ele?

Às vezes conseguimos ser mais compassivos e realistas com outros do que conosco.`;
  }

  // Se o usuário pediu ajuda ou está confuso
  if (analysis.needsSupport) {
    return `Percebo que você está buscando direção. Isso é completamente normal.

Com base em tudo que você compartilhou, **qual seria um primeiro passo pequeno, mas significativo, que você poderia dar para se sentir um pouquinho melhor?**

Não precisa ser algo grande - mudanças pequenas podem ter impactos importantes.`;
  }

  // Resposta geral que ESCUTA o que foi dito
  const userWords = userMessage.split(' ').slice(0, 8).join(' ');
  return `Entendo o que você está dizendo sobre "${userWords}...".

Isso que você compartilhou mostra que você tem uma boa consciência do que está vivendo.

**Uma pergunta reflexiva:** se você pudesse dar um conselho carinhoso para si mesmo sobre essa situação, o que diria?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.message?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Mensagem é obrigatória'
      }, { status: 400 });
    }

    const userId = body.userId || 'default_user';
    const userMessage = body.message.trim();
    
    const memory = getMemory(userId);
    const analysis = analyzeMessage(userMessage, memory);
    
    // Gerar resposta inteligente
    const response = generateIntelligentResponse(userMessage, analysis, memory);
    
    // Atualizar memória simples
    memory.messages.push({
      user: userMessage,
      assistant: response
    });
    
    if (analysis.concern) {
      memory.userConcern = analysis.concern;
    }
    
    memory.emotionalState = analysis.emotion;
    memory.lastTopics = analysis.keywords;
    
    memories.set(userId, memory);

    return NextResponse.json({
      success: true,
      message: response,
      guidance: memory.messages.length < 3 ? 
        "💙 Estou te escutando atentamente e construindo nossa conversa baseada no que você compartilha." :
        "🧠 Agora estamos trabalhando técnicas específicas para sua situação.",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na terapia:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}