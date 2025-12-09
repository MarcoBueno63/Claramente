import { NextRequest, NextResponse } from "next/server";

interface SimpleMemory {
  messages: Array<{user: string, assistant: string}>;
  userConcern: string;
  count: number;
}

const sessions = new Map<string, SimpleMemory>();

function getSession(userId: string): SimpleMemory {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      messages: [],
      userConcern: '',
      count: 0
    });
  }
  return sessions.get(userId)!;
}

function analyzeMessage(message: string, session: SimpleMemory): string {
  const lower = message.toLowerCase();
  const history = session.messages.map(m => m.user).join(' ').toLowerCase();
  
  // Primeira mensagem - identificar problema principal
  if (session.count === 0) {
    if (lower.includes('ansioso') || lower.includes('nervoso') || lower.includes('preocupado')) {
      session.userConcern = 'ansiedade';
      return `Entendo que você está se sentindo ansioso. Isso pode ser muito desconfortável.

Me conte mais: **em que situações você mais sente essa ansiedade?** No trabalho, em casa, com pessoas?`;
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
    
    return `Obrigada por compartilhar isso comigo. Estou aqui para te escutar.

**Me conte mais sobre o que te trouxe aqui.** O que está mais te incomodando no momento?`;
  }
  
  // Analisar resposta anterior do usuário
  const lastAssistant = session.messages[session.messages.length - 1]?.assistant || '';
  
  // Se perguntei sobre situações de ansiedade
  if (lastAssistant.includes('em que situações você mais sente')) {
    if (lower.includes('trabalho') || lower.includes('chefe')) {
      return `Entendo, o ambiente de trabalho está sendo um gatilho importante para sua ansiedade.

**Quando isso acontece no trabalho, que pensamentos passam pela sua cabeça?** Por exemplo, você pensa "vou ser demitido" ou "não sou bom o suficiente"?

Identificar esses pensamentos automáticos é fundamental na TCC.`;
    }
    
    if (lower.includes('pessoas') || lower.includes('social')) {
      return `Vejo que situações sociais despertam sua ansiedade. Isso é muito comum.

**Quando você está com outras pessoas e se sente ansioso, o que você mais teme que aconteça?** Que as pessoas te julguem? Que você diga algo errado?`;
    }
    
    return `Entendo que ${message.substring(0, 30)}... é uma situação desafiadora.

**E quando isso acontece, qual é geralmente sua primeira reação?** Você tenta evitar? Se afasta? Ou força a barra mesmo sentindo ansiedade?`;
  }
  
  // Se perguntei sobre pensamentos
  if (lastAssistant.includes('que pensamentos passam')) {
    return `Esses pensamentos que você compartilhou são muito reveladores. Na TCC, chamamos isso de "pensamentos automáticos".

**Vamos fazer um exercício:** se um amigo seu estivesse na mesma situação e tivesse esse mesmo pensamento, o que você diria para ele?

Às vezes conseguimos ver clareza quando olhamos de fora.`;
  }
  
  // Se perguntei sobre como tem sido os dias
  if (lastAssistant.includes('Como tem sido seus dias')) {
    return `Percebo que realmente tem sido pesado para você.

**Uma pergunta importante:** quando você se sente assim, você costuma se isolar ou busca companhia? Como você tem lidado com esses momentos difíceis?

Entender seus padrões me ajuda a te orientar melhor.`;
  }
  
  // Se perguntei sobre autoestima
  if (lastAssistant.includes('O que aconteceu que te fez sentir')) {
    return `Isso deve ter sido muito difícil. Obrigada por compartilhar algo tão pessoal.

**Vou te ensinar algo importante:** muitas vezes não é a situação em si que nos afeta mais, mas o significado que damos a ela.

**Quando isso aconteceu, qual foi o primeiro pensamento sobre VOCÊ MESMO que veio na sua cabeça?**`;
  }
  
  // Se estou ensinando exercício da TCC
  if (lastAssistant.includes('se um amigo seu estivesse')) {
    return `Ótima reflexão! Percebeu como conseguimos ser mais gentis com outros do que conosco?

**Agora vamos praticar isso:** na próxima vez que esse pensamento vier, tente se falar como falaria com esse amigo.

**Uma técnica prática:** escreva o pensamento negativo e, do lado, escreva uma versão mais equilibrada. Quer tentar isso agora com algum pensamento que te incomoda?`;
  }
  
  // Se perguntei sobre reações/padrões
  if (lastAssistant.includes('qual é geralmente sua primeira reação') || lastAssistant.includes('como você tem lidado')) {
    return `Entendo seu padrão. ${lower.includes('evito') || lower.includes('afasto') ? 'Evitar é natural quando algo nos causa sofrimento' : 'Percebo que você tenta enfrentar as situações'}.

**Vamos trabalhar uma estratégia:** na próxima vez que isso acontecer, que tal tentar a técnica da respiração 4-7-8?

Inspire por 4 segundos, segure por 7, expire por 8. Isso acalma o sistema nervoso.

**Você quer que eu te ensine outras técnicas práticas ou prefere aprofundar mais algum aspecto?**`;
  }
  
  // Resposta geral inteligente
  const userWords = message.split(' ').slice(0, 8).join(' ');
  return `Entendo o que você está me dizendo sobre "${userWords}...". 

Percebo que você está sendo muito honesto sobre sua experiência, e isso é importante para nosso trabalho juntos.

**Com base em tudo que conversamos, o que você acha que seria um primeiro pequeno passo para se sentir um pouco melhor nessa situação?**

Não precisa ser algo grande - às vezes mudanças pequenas têm grandes impactos.`;
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

    // Gerar resposta contextual
    const response = analyzeMessage(userMessage, session);
    
    // Atualizar sessão
    session.messages.push({
      user: userMessage,
      assistant: response
    });
    session.count++;
    
    sessions.set(userId, session);

    const guidanceMessages = [
      "💙 Estou escutando com atenção o que você compartilha",
      "🧠 Analisando suas respostas para te orientar melhor", 
      "🔍 Identificando padrões importantes na sua experiência",
      "🎯 Aplicando técnicas de TCC baseadas no que você me conta",
      "🌱 Trabalhando estratégias práticas para sua situação"
    ];

    return NextResponse.json({
      success: true,
      message: response,
      guidance: guidanceMessages[Math.min(session.count - 1, 4)],
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