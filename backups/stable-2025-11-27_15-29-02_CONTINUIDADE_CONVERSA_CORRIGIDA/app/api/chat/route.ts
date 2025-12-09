import { NextRequest, NextResponse } from "next/server";
import { generateTherapeuticResponse, ConversationContext } from "@/lib/openai";

// Cache simples em memória para sessões
const sessionCache = new Map<string, {
  startTime: Date;
  messages: Array<{content: string; timestamp: Date}>;
  emotions: string[];
}>();

// Análise rápida de emoções
function analyzeEmotions(message: string): string[] {
  const lower = message.toLowerCase();
  const emotions = [];
  
  if (lower.match(/ansios|nervos|preocup|tens/)) emotions.push('ansiedade');
  if (lower.match(/trist|deprimi|melancol/)) emotions.push('tristeza'); 
  if (lower.match(/raiva|irrita|brav|furios/)) emotions.push('raiva');
  if (lower.match(/medo|assusta|receos/)) emotions.push('medo');
  if (lower.match(/vazio|sem sentido|perdid/)) emotions.push('vazio');
  
  return emotions;
}

// Gerador de resposta contextual e inteligente
function generateResponse(message: string, emotions: string[], timeElapsed: number, previousMessages: Array<{content: string; timestamp: Date}>): string {
  const lower = message.toLowerCase();
  
  // Respostas de crise
  if (lower.match(/suicídio|me matar|acabar com tudo|não aguento mais/)) {
    return "Percebo que você está passando por um momento muito difícil. É importante buscar ajuda profissional imediata. Você tem alguém de confiança com quem pode conversar agora?";
  }
  
  // Saudações iniciais
  if (lower.match(/^(oi|olá|ola|hey|hello)$/)) {
    return "Olá! É um prazer te conhecer. Sou a ClaraMente, sua assistente terapêutica. Como você está se sentindo hoje?";
  }
  
  // Detectar repetições ou confirmações simples
  if (lower.match(/^(sim|não|ok|certo|entendi|já falei|isso mesmo)$/)) {
    const recentMessages = previousMessages.slice(-4).map(m => m.content.toLowerCase());
    
    if (recentMessages.some(msg => msg.includes('excluido') || msg.includes('grupo'))) {
      return "Entendo que a exclusão do grupo foi dolorosa para você. Essas situações podem despertar sentimentos de rejeição e inadequação. Como você tem lidado com esses sentimentos desde então? Você já passou por experiências similares antes?";
    }
    
    if (recentMessages.some(msg => msg.includes('triste') || msg.includes('tristeza'))) {
      return "A tristeza é um sentimento natural e importante. Ela nos ajuda a processar perdas e mudanças. Você consegue identificar o que mais tem contribuído para essa tristeza além da situação do grupo?";
    }
    
    return "Percebo que você confirmou o que conversamos. Vamos aprofundar um pouco mais - o que você sente quando pensa nisso agora? Há alguma parte dessa situação que te incomoda mais?";
  }
  
  // Análise contextual específica
  if (lower.includes('exclu') && lower.includes('grupo')) {
    return "A exclusão de um grupo pode ser muito dolorosa, especialmente quando valorizamos aquele espaço. Isso pode despertar sentimentos de rejeição e questionar nosso senso de pertencimento. Você tem ideia do que pode ter levado a essa exclusão? E como isso tem afetado sua autoestima?";
  }
  
  if (lower.includes('mudar') && emotions.includes('tristeza')) {
    return "É muito positivo que você queira fazer mudanças, isso mostra sua força e resiliência. Vamos pensar em estratégias práticas: que pequenos passos você poderia dar hoje para começar a se sentir melhor? Às vezes, mudanças pequenas geram grandes resultados.";
  }
  
  // Respostas baseadas em emoções com mais profundidade
  if (emotions.includes('ansiedade')) {
    return "Entendo que você está sentindo ansiedade. Vamos trabalhar isso juntas. Primeiro, tente fazer 3 respirações profundas comigo. Agora me conte: onde você sente essa ansiedade no seu corpo? E quando ela costuma aparecer mais forte?";
  }
  
  if (emotions.includes('tristeza')) {
    const hasContext = previousMessages.some(m => 
      m.content.toLowerCase().includes('grupo') || 
      m.content.toLowerCase().includes('exclu') ||
      m.content.toLowerCase().includes('rejei')
    );
    
    if (hasContext) {
      return "Vejo que a situação do grupo ainda está pesando. A tristeza após uma exclusão é muito compreensível - mexe com nossa necessidade de pertencimento. Você já conversou com alguém próximo sobre isso? E que tipo de apoio você sente que precisa neste momento?";
    }
    
    return "Noto que você está se sentindo triste. Esses sentimentos são válidos e importantes. Você consegue me contar mais sobre o que está acontecendo na sua vida que pode estar contribuindo para essa tristeza?";
  }
  
  if (emotions.includes('raiva')) {
    return "Percebo que há raiva em suas palavras. A raiva muitas vezes é um sentimento secundário - pode estar mascarando dor, frustração ou injustiça. O que você acha que está por trás dessa raiva? É uma sensação familiar para você?";
  }
  
  // Respostas contextuais baseadas no histórico da conversa
  const recentContext = previousMessages.slice(-6).map(m => m.content.toLowerCase()).join(' ');
  
  if (recentContext.includes('grupo') && recentContext.includes('importante')) {
    return "Você mencionou que o grupo era importante para você. Isso torna a exclusão ainda mais significativa. Que tipo de conexão você tinha com essas pessoas? E o que esse grupo representava na sua vida?";
  }
  
  // Respostas baseadas no tempo de sessão com mais contexto
  if (timeElapsed < 300) { // Primeiros 5 minutos
    return "Obrigada por compartilhar isso comigo. Sinto que há muito por trás dessas palavras. Vamos com calma - você pode me contar um pouco mais sobre como tem sido seu dia a dia ultimamente?";
  } else if (timeElapsed < 900) { // 5-15 minutos
    return "Estamos construindo uma boa compreensão do que você está vivendo. Quando você pensa nessa situação, qual é a primeira sensação que vem? E o que você gostaria que fosse diferente?";
  } else { // Após 15 minutos
    return "Percebo que estamos aprofundando bem nossa conversa. Considerando tudo que conversamos até aqui, o que está mais claro para você agora? E que tipo de mudança você sente que seria mais importante?";
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    
    if (!body.message?.trim()) {
      return NextResponse.json({
        success: true,
        response: 'Por favor, compartilhe algo comigo para que eu possa ajudá-la melhor.'
      });
    }

    const userId = body.userId || 'default_user';
    const userMessage = body.message.trim();
    const timeElapsed = body.timeElapsed || 0;
    const sessionStartTime = body.sessionStartTime ? new Date(body.sessionStartTime) : new Date();
    const conversationHistory = body.conversationHistory || [];
    
    console.log(`User: ${userMessage}`);
    console.log(`Tempo decorrido: ${Math.floor(timeElapsed / 60)}min ${timeElapsed % 60}s`);
    console.log(`Histórico de mensagens: ${conversationHistory.length} mensagens`);
    
    // Cache de sessão aprimorado - usar histórico do frontend quando disponível
    if (!sessionCache.has(userId)) {
      sessionCache.set(userId, {
        startTime: sessionStartTime,
        messages: [],
        emotions: []
      });
    }
    
    const session = sessionCache.get(userId)!;
    
    // Usar histórico do frontend se disponível (mais confiável)
    const messageHistory = conversationHistory.length > 0 
      ? conversationHistory.map((m: any) => ({
          content: m.content,
          timestamp: new Date(m.timestamp)
        }))
      : session.messages;
    
    // Preparar contexto para OpenAI
    const conversationContext: ConversationContext = {
      messages: [
        ...messageHistory.map((m: {content: string; timestamp: Date}) => ({
          role: m.content.includes('Sou a ClaraMente') || m.content.includes('Clara') ? 'assistant' as const : 'user' as const,
          content: m.content,
          timestamp: m.timestamp
        })),
        { role: 'user' as const, content: userMessage, timestamp: new Date() }
      ],
      sessionStartTime: session.startTime,
      timeElapsed,
      identifiedEmotions: session.emotions,
      appliedTechniques: [], // Pode ser expandido para rastrear técnicas usadas
      riskHistory: [] // Histórico de avaliações de risco
    };

    // Verificar se deve usar OpenAI ou fallback
    const useOpenAI = process.env.OPENAI_API_KEY && process.env.NODE_ENV !== 'development';
    
    let response: string;
    let emotions: string[] = [];
    let riskLevel = 'minimal';
    let suggestedTechniques: string[] = [];
    
    if (useOpenAI) {
      try {
        console.log('🤖 Usando OpenAI GPT-4 para resposta terapêutica');
        
        const therapeuticResponse = await generateTherapeuticResponse(
          userMessage, 
          conversationContext
        );
        
        response = therapeuticResponse.message;
        emotions = therapeuticResponse.emotions || [];
        riskLevel = therapeuticResponse.riskLevel;
        suggestedTechniques = therapeuticResponse.suggestedTechniques || [];
        
        console.log(`✅ Resposta OpenAI gerada: ${emotions.join(', ')} | Risco: ${riskLevel}`);
        
      } catch (openaiError) {
        console.error('❌ Erro OpenAI, usando fallback:', openaiError);
        
        // Fallback para sistema programático
        emotions = analyzeEmotions(userMessage);
        response = generateResponse(userMessage, emotions, timeElapsed, messageHistory);
      }
    } else {
      console.log('🔧 Usando sistema programático (desenvolvimento ou sem API key)');
      
      // Sistema programático como fallback
      emotions = analyzeEmotions(userMessage);
      response = generateResponse(userMessage, emotions, timeElapsed, messageHistory);
    }
    
    // Atualizar cache da sessão
    session.messages.push({ content: userMessage, timestamp: new Date() });
    session.messages.push({ content: response, timestamp: new Date() });
    session.emotions.push(...emotions);
    
    const processingTime = Date.now() - startTime;
    console.log(`Resposta gerada em ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      response,
      emotions: emotions.slice(-3),
      riskLevel,
      suggestedTechniques,
      processingTime,
      aiPowered: useOpenAI
    });
    
  } catch (error) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json({
      success: true,
      response: 'Entendi. Pode me contar um pouco mais sobre isso?'
    });
  }
}