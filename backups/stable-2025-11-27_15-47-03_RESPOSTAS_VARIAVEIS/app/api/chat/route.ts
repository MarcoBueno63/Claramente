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
  const messageCount = previousMessages.length;
  
  // Extrair apenas mensagens do usuário (não incluir respostas da Clara)
  const userMessages = previousMessages.filter(m => 
    !m.content.includes('Sou a ClaraMente') && 
    !m.content.includes('Obrigada por compartilhar') &&
    !m.content.includes('Percebo que') &&
    !m.content.includes('Entendo que')
  );
  
  const lastUserMessages = userMessages.slice(-3).map(m => m.content.toLowerCase());
  const fullContext = userMessages.map(m => m.content.toLowerCase()).join(' ');
  
  // Respostas de crise
  if (lower.match(/suicídio|me matar|acabar com tudo|não aguento mais/)) {
    return "Percebo que você está passando por um momento muito difícil. É importante buscar ajuda profissional imediata. Você tem alguém de confiança com quem pode conversar agora?";
  }
  
  // Saudações iniciais
  if (lower.match(/^(oi|olá|ola|hey|hello)$/)) {
    return "Olá! É um prazer te conhecer. Sou a Clara, sua terapeuta virtual. Estou aqui para te ouvir sem julgamentos. O que te traz aqui hoje?";
  }
  
  // Respostas mais contextuais e menos repetitivas
  const topics = {
    exclusao: fullContext.includes('exclu') || fullContext.includes('rejei') || fullContext.includes('grupo'),
    trabalho: fullContext.includes('trabalho') || fullContext.includes('emprego') || fullContext.includes('chefe'),
    estudo: fullContext.includes('estudo') || fullContext.includes('faculdade') || fullContext.includes('prova'),
    relacionamento: fullContext.includes('namorad') || fullContext.includes('casament') || fullContext.includes('relacion'),
    familia: fullContext.includes('familia') || fullContext.includes('pai') || fullContext.includes('mãe') || fullContext.includes('irmão'),
    solidao: fullContext.includes('sozinho') || fullContext.includes('solidão') || fullContext.includes('solitár'),
    autoestima: fullContext.includes('autoestima') || fullContext.includes('não sou bom') || fullContext.includes('incapaz')
  };
  
  // Gerar resposta baseada no tópico principal e no progresso da conversa
  if (messageCount < 4) {
    // Fase inicial: exploração e validação
    if (emotions.includes('tristeza')) {
      return `Agradeço por compartilhar como você está se sentindo. A tristeza que você está experimentando é válida e importante de ser expressa. ${
        topics.exclusao ? 'Situações de exclusão podem ser especialmente dolorosas.' : ''
      } Me conte mais: quando foi a primeira vez que você notou esse sentimento? Ele aparece em momentos específicos?`;
    }
    
    if (emotions.includes('ansiedade')) {
      return `Percebo a ansiedade em suas palavras. Esse é um sentimento que muitas pessoas experimentam, especialmente em momentos de incerteza. Vamos respirar juntos por um momento - inspire profundamente e solte o ar devagar. Agora me diga: em que momentos do dia essa ansiedade fica mais intensa?`;
    }
    
    return `Estou aqui para te ouvir e te apoiar. O que você acabou de compartilhar é significativo. ${
      lower.length > 50 ? 'Vejo que há bastante coisa acontecendo.' : 'Poderia me contar um pouco mais sobre isso?'
    } Que aspecto dessa situação te afeta mais?`;
    
  } else if (messageCount < 8) {
    // Fase intermediária: aprofundamento e identificação de padrões
    if (topics.exclusao) {
      const variations = [
        "Entendo que essa situação de exclusão continua presente em seus pensamentos. Isso é completamente normal - nosso cérebro tende a revisitar experiências dolorosas tentando processá-las. Me diga: além do grupo em si, o que mais você perdeu com essa exclusão? Conexões específicas? Um senso de pertencimento?",
        "Vejo que a exclusão do grupo ainda está impactando você. Vamos explorar isso de forma diferente: se você pudesse voltar no tempo, o que gostaria de ter dito ou feito diferente? E mais importante - por que você acha que se importa tanto com isso?",
        "A exclusão que você viveu claramente tocou em algo profundo. Muitas vezes, essas situações ativam feridas antigas. Você já passou por experiências similares de rejeição antes? Como você lidou naquelas vezes?"
      ];
      return variations[messageCount % 3];
    }
    
    if (emotions.includes('tristeza')) {
      const variations = [
        "A tristeza que você está sentindo parece ter várias camadas. Vamos tentar identificá-las: qual é a parte mais difícil? É a perda em si, ou talvez a incerteza sobre o futuro? Ou algo mais?",
        "Percebo que a tristeza continua presente. Isso me diz que o que você está vivendo é realmente significativo para você. Como essa tristeza se manifesta no seu corpo? E o que você tem feito para cuidar de si mesmo nesse momento?",
        "Vejo que os sentimentos de tristeza persistem. Vamos pensar juntos: quando você se sente um pouco melhor, mesmo que temporariamente? O que está acontecendo nesses momentos?"
      ];
      return variations[messageCount % 3];
    }
    
    return `Estamos construindo uma compreensão mais profunda do que você está vivendo. ${
      lower.includes('sim') || lower.includes('isso') ? 'Vejo que isso ressoa com você.' : 'Ouço o que você está dizendo.'
    } Agora me ajude a entender: como essa situação está afetando seu dia a dia? Seu sono, apetite, energia para as atividades?`;
    
  } else {
    // Fase avançada: síntese, recursos e próximos passos
    if (topics.exclusao) {
      return `Conversamos bastante sobre essa exclusão do grupo, e percebo como isso foi impactante para você. Agora quero mudar um pouco o foco: quais recursos você tem usado para lidar com isso? Amigos próximos, hobbies, outras comunidades? E o que você aprendeu sobre si mesmo através dessa experiência difícil?`;
    }
    
    if (emotions.includes('tristeza')) {
      return `Você compartilhou muita coisa importante comigo hoje. A tristeza que você sente é compreensível dadas as circunstâncias. Agora vamos pensar em estratégias: o que seria um pequeno passo que você poderia dar hoje para se sentir um pouquinho melhor? Não precisa ser grande - pode ser algo simples.`;
    }
    
    const variations = [
      `Vejo que conversamos sobre ${topics.exclusao ? 'exclusão e pertencimento' : topics.trabalho ? 'trabalho e suas desafios profissionais' : 'várias questões importantes'}. O que ficou mais claro para você nessa nossa conversa? E o que ainda parece confuso ou difícil de processar?`,
      `Chegamos a um ponto importante da nossa conversa. Considerando tudo que você compartilhou, o que você gostaria de fazer diferente daqui para frente? Mesmo que seja algo pequeno - cada passo conta.`,
      `Você trouxe questões muito relevantes hoje. Vamos pensar juntos: que tipo de apoio você sente que precisa agora? Pode ser emocional, prático, ou até mesmo apenas alguém que te ouça, como estou fazendo agora.`
    ];
    
    return variations[messageCount % 3];
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