import { NextRequest, NextResponse } from "next/server";

interface SimpleMemory {
  messages: Array<{user: string, assistant: string}>;
  userConcern: string;
  count: number;
  lastUserInput: string;
}

const sessions = new Map<string, SimpleMemory>();

function getSession(userId: string): SimpleMemory {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      messages: [],
      userConcern: '',
      count: 0,
      lastUserInput: ''
    });
  }
  return sessions.get(userId)!;
}

function analyzeMessage(message: string, session: SimpleMemory): string {
  const lower = message.toLowerCase().trim();
  
  // Debug: Log da sessão atual
  console.log('=== DEBUG SESSION ===');
  console.log('Count:', session.count);
  console.log('User message:', message);
  console.log('Last user input:', session.lastUserInput);
  console.log('Messages history:', session.messages.length);
  
  // Prevenir loops - se a mensagem é igual à anterior
  if (session.lastUserInput === message && session.count > 0) {
    console.log('LOOP DETECTADO - Mensagem repetida!');
    return `Percebo que você está repetindo a mesma mensagem. Vamos continuar nossa conversa de forma diferente.

**Me fale sobre algo novo:** O que mais está na sua mente agora? Como você está se sentindo neste momento?`;
  }
  
  // Primeira mensagem - identificar problema principal
  if (session.count === 0) {
    console.log('Primeira mensagem - identificando problema');
    
    if (lower.includes('ansioso') || lower.includes('nervoso') || lower.includes('preocupado')) {
      session.userConcern = 'ansiedade';
      return `Entendo que você está se sentindo ansioso. Isso pode ser muito desconfortável.

**Me conte mais:** em que situações você mais sente essa ansiedade? No trabalho, em casa, com pessoas?`;
    }
    
    if (lower.includes('triste') || lower.includes('deprimido') || lower.includes('vazio')) {
      session.userConcern = 'tristeza';
      return `Percebo que você está passando por um momento difícil. É corajoso buscar ajuda.

**Como tem sido seus dias recentemente?** O que mais tem te afetado?`;
    }
    
    if (lower.includes('autoestima') || lower.includes('confiança') || lower.includes('inseguro')) {
      session.userConcern = 'autoestima';
      return `Questões de autoestima podem ser dolorosas. Entendo que você está questionando seu valor.

**O que aconteceu que te fez se sentir assim?** Houve alguma situação específica?`;
    }
    
    // Resposta genérica para primeira mensagem
    session.userConcern = 'geral';
    return `Obrigada por compartilhar isso comigo. Estou aqui para te escutar.

**Me conte mais sobre o que te trouxe aqui.** O que está mais te incomodando no momento?`;
  }
  
  // Segunda mensagem em diante - ser mais simples e direto
  if (session.count === 1) {
    console.log('Segunda mensagem - aprofundando');
    
    if (session.userConcern === 'ansiedade') {
      return `Entendo melhor agora. A ansiedade realmente afeta nossa qualidade de vida.

**Vou te ensinar uma técnica simples:** quando sentir ansiedade, respire fundo por 4 segundos, segure por 4, e solte por 6. 

Como você se sente quando pratica exercícios de respiração?`;
    }
    
    if (session.userConcern === 'tristeza') {
      return `Percebo que tem sido difícil mesmo. Obrigada por compartilhar isso comigo.

**Uma pergunta importante:** quando você se sente assim, o que costuma te dar um pouco de alívio? Pode ser algo pequeno, como uma música, um lugar, ou até um pensamento.`;
    }
    
    if (session.userConcern === 'autoestima') {
      return `Isso deve ter sido realmente doloroso para você.

**Vou te fazer uma pergunta diferente:** se um bom amigo seu passasse pela mesma situação, o que você diria para ele? Às vezes conseguimos ser mais gentis com outros do que conosco.`;
    }
    
    // Resposta geral para segunda mensagem
    return `Entendo o que você está me contando. Percebo que isso tem te afetado bastante.

**Me ajude a entender melhor:** quando essa situação acontece, qual é normalmente sua primeira reação? Você tenta resolver na hora ou prefere se afastar um pouco?`;
  }
  
  // Terceira mensagem em diante - técnicas práticas
  if (session.count === 2) {
    console.log('Terceira mensagem - técnicas práticas');
    
    return `Obrigada por ser tão honesto comigo. Isso mostra muita coragem.

**Vamos trabalhar com algo prático:** baseado em tudo que você me contou, qual seria UM pequeno passo que você poderia dar hoje para se sentir um pouco melhor?

Pode ser algo bem simples - às vezes os pequenos passos fazem toda a diferença.`;
  }
  
  // Quarta mensagem - consolidação
  if (session.count === 3) {
    console.log('Quarta mensagem - consolidação');
    
    return `Percebo que você está realmente se esforçando para entender e melhorar sua situação.

**Para nossa próxima conversa:** gostaria que você praticasse uma coisa - quando se sentir ${session.userConcern === 'ansiedade' ? 'ansioso' : session.userConcern === 'tristeza' ? 'triste' : 'inseguro'}, pare por um momento e se pergunte: "O que eu preciso agora?"

Às vezes a resposta é simples: um copo d'água, uma caminhada, ou apenas respirar fundo.

Como você se sente com essa nossa conversa até agora?`;
  }
  
  // Quinta mensagem em diante - manutenção da conversa
  console.log('Mensagem de manutenção');
  
  const responses = [
    `Muito bem, vejo que você está se conectando com o processo. 

**Continue me contando:** como você tem se sentido ao longo da nossa conversa? Alguma coisa fez mais sentido para você?`,
    
    `Percebo que você está sendo muito reflexivo sobre tudo isso.

**Uma última pergunta por hoje:** qual foi a parte da nossa conversa que mais tocou você? O que você vai levar daqui?`,
    
    `Agradeço muito sua abertura e honestidade hoje. 

**Para finalizar:** existe algo que você gostaria de me perguntar ou algo que ainda está na sua mente que não conseguimos abordar?`
  ];
  
  const responseIndex = Math.min(session.count - 4, responses.length - 1);
  return responses[responseIndex];
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
    const session = getSession(userId);

    console.log(`\n=== API CALL ===`);
    console.log(`User ID: ${userId}`);
    console.log(`Message: "${userMessage}"`);
    console.log(`Session count before: ${session.count}`);

    // Gerar resposta contextual
    const response = analyzeMessage(userMessage, session);
    
    // Atualizar sessão DEPOIS de gerar a resposta
    session.lastUserInput = userMessage;
    session.messages.push({
      user: userMessage,
      assistant: response
    });
    session.count++;
    
    sessions.set(userId, session);

    console.log(`Session count after: ${session.count}`);
    console.log(`Response: "${response.substring(0, 100)}..."`);

    const guidanceMessages = [
      "💙 Estou escutando com atenção o que você compartilha",
      "🧠 Analisando suas respostas para te orientar melhor", 
      "🔍 Identificando padrões importantes na sua experiência",
      "🎯 Aplicando técnicas de TCC baseadas no que você me conta",
      "🌱 Trabalhando estratégias práticas para sua situação",
      "✨ Consolidando os insights da nossa conversa",
      "🤝 Finalizando nossa sessão com orientações práticas"
    ];

    return NextResponse.json({
      success: true,
      message: response,
      guidance: guidanceMessages[Math.min(session.count - 1, guidanceMessages.length - 1)],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}