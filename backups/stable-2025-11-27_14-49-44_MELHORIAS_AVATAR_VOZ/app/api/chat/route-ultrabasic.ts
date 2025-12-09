import { NextRequest, NextResponse } from "next/server";

// Sistema ultra-simples para evitar loops
const conversations = new Map();

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
    
    console.log(`\n=== NOVA MENSAGEM ===`);
    console.log(`User: ${userMessage}`);
    
    // Pega ou cria conversa
    if (!conversations.has(userId)) {
      conversations.set(userId, { count: 0, history: [] });
    }
    
    const conv = conversations.get(userId);
    conv.count++;
    conv.history.push(userMessage);
    
    console.log(`Count: ${conv.count}`);
    console.log(`History: ${conv.history.slice(-3)}`); // últimas 3 mensagens
    
    let response = '';
    
    // Respostas baseadas APENAS no contador - SEM análise complexa
    switch (conv.count) {
      case 1:
        response = `Olá! Entendo que você quer compartilhar algo comigo. 

**Me conte:** o que está te trazendo aqui hoje? O que você gostaria de conversar?`;
        break;
        
      case 2:
        response = `Obrigada por compartilhar isso. Percebo que é algo importante para você.

**Uma pergunta simples:** como você está se sentindo agora, neste momento, enquanto falamos sobre isso?`;
        break;
        
      case 3:
        response = `Entendo. É normal sentir assim diante da situação que você descreveu.

**Vou te ensinar algo útil:** quando se sentir assim, respire fundo 3 vezes e se pergunte: "O que eu posso fazer agora para me cuidar?"

Como você se sente com essa ideia?`;
        break;
        
      case 4:
        response = `Muito bem! Percebo que você está refletindo sobre nossa conversa.

**Para levar daqui:** lembre-se de que pequenos passos fazem diferença. Você não precisa resolver tudo de uma vez.

Existe algo específico que você gostaria de me perguntar antes de finalizarmos?`;
        break;
        
      case 5:
        response = `Agradeço muito nossa conversa hoje. Você mostrou coragem ao compartilhar suas experiências.

**Mensagem final:** seja gentil consigo mesmo. Mudanças acontecem gradualmente, e você está no caminho certo.

Cuide-se bem! 💙`;
        break;
        
      default:
        // Após 5 mensagens, sempre finaliza gentilmente
        response = `Nossa conversa de hoje foi muito valiosa. 

**Para hoje é isso:** recomendo que você pratique o que conversamos e volte quando quiser compartilhar mais.

Até a próxima! 🌟`;
        
        // Opcional: limpar a conversa após muitas mensagens
        if (conv.count > 7) {
          conversations.delete(userId);
          console.log('Conversa resetada após 7 mensagens');
        }
        break;
    }
    
    console.log(`Response: ${response.substring(0, 50)}...`);
    
    return NextResponse.json({
      success: true,
      message: response,
      guidance: `💬 Mensagem ${conv.count}/5 - Conversa terapêutica estruturada`,
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