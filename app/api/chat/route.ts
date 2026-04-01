import { NextResponse } from "next/server";
import { validateString, validateRequired } from "@/lib/validate";

// SISTEMA SIMPLIFICADO E MELHORADO DE CONVERSAÇÃO TCC
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

    const message = body.message.toLowerCase();
    // Delay terapêutico para sensação de reflexão
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    let reply = "";
    let technique = "conversational";

    // SAUDAÇÕES - Mais calorosas e naturais
    if (message.match(/oi|olá|boa tarde|boa noite|bom dia|hey|e aí|primeiro contato/)) {
      const timeOfDay = new Date().getHours() < 12 ? 'Bom dia' : 
                       new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
      
      reply = `${timeOfDay}! 😊 

Que bom te ver aqui! Sou a Clara, e estou aqui para te acompanhar. 

Como você está se sentindo hoje? Pode ficar à vontade para me contar o que está passando pela sua cabeça.`;
    }
    
    // DETECÇÃO DE PADRÕES BORDERLINE - Sugere protocolo DBT
    else if (message.includes('abandono') || message.includes('vazio') || message.includes('impulsiv') ||
             message.includes('relacionamentos difíceis') || message.includes('autolesão') || 
             message.includes('mudanças de humor') || message.includes('raiva intensa')) {
      
      reply = `Percebo que você está lidando com sentimentos muito intensos. É corajoso compartilhar isso. 💙

Esses padrões que você descreve são mais comuns do que imagina, e existem abordagens muito eficazes para trabalhar com eles.

Me conta: como esses sentimentos afetam seus relacionamentos? E como você tem tentado lidar quando eles ficam muito intensos?

💡 *Nota clínica: Padrões compatíveis com protocolo DBT (Terapia Comportamental Dialética) - especialmente eficaz para regulação emocional e habilidades interpessoais.*`;
      technique = "dbt_screening";
    }
    
    // DETECÇÃO DE LUTO COMPLICADO - Sugere protocolo ACT
    else if (message.includes('morreu') || message.includes('faleceu') || message.includes('perdi') ||
             message.includes('luto') || message.includes('saudade') || message.includes('não consigo seguir')) {
      
      const griefResponses = [
        `Sinto muito pela sua perda. O luto é uma das experiências mais difíceis que podemos enfrentar. 💙

Não existe uma forma "certa" de sentir luto. Cada pessoa tem seu próprio tempo e processo.

Me conta: como tem sido carregar essa dor? E o que mais te ajuda nos momentos mais difíceis?

✨ *Abordagem ACT para luto pode ser muito útil - foca em aceitar a dor como expressão do amor, mantendo conexão com valores importantes.*`,

        `Perder alguém importante deixa uma marca profunda. É natural sentir essa dor intensa.

O luto não é algo que "superamos", mas algo que aprendemos a carregar de forma mais gentil.

Como você tem conseguido honrar a memória dessa pessoa? E que valores vocês compartilhavam?

✨ *Protocolo ACT para luto trabalha com aceitação da dor e reconexão com valores significativos.*`
      ];
      
      reply = griefResponses[Math.floor(Math.random() * griefResponses.length)];
      technique = "act_grief_screening";
    }
    
    // SENTIMENTOS NEGATIVOS - Mais empática
    else if (message.includes('triste') || message.includes('deprimido') || message.includes('down') || 
             message.includes('mal') || message.includes('ruim') || message.includes('péssimo')) {
      
      const empathicResponses = [
        `Posso imaginar como deve ser difícil se sentir assim. É muito corajoso da sua parte compartilhar isso comigo. 💙

Me conte um pouco mais... quando você começou a se sentir assim? Tem alguma coisa específica que você acha que pode ter contribuído?`,
        
        `Entendo que você está passando por um momento difícil. Obrigada por confiar em mim para dividir isso.

O que mais está pesando no seu coração nesse momento? Às vezes só falar sobre isso já ajuda a organizar os sentimentos.`,

        `É normal se sentir assim às vezes, e não há nada de errado com você por estar passando por isso.

Me ajuda a entender: como tem sido o seu dia a dia com esses sentimentos? O que você tem feito para tentar se cuidar?`
      ];
      
      reply = empathicResponses[Math.floor(Math.random() * empathicResponses.length)];
      technique = "empathic_support";
    }
    
    // ANSIEDADE E PREOCUPAÇÃO - Mais acolhedora
    else if (message.includes('ansioso') || message.includes('nervoso') || message.includes('preocupado') ||
             message.includes('medo') || message.includes('pânico') || message.includes('agitado')) {
      
      const anxietyResponses = [
        `Entendo que você está sentindo essa ansiedade... É uma sensação muito desconfortável mesmo. 🌟

Vamos respirar um pouquinho juntos primeiro? Respira comigo: inspira... segura... expira...

Agora me conte: o que está te deixando mais preocupado neste momento?`,
        
        `Posso sentir essa energia de preocupação no que você está me contando. É normal se sentir assim às vezes.

Que tal me contar mais detalhes sobre essa situação? Às vezes quando colocamos tudo "no papel", fica mais claro o que realmente está acontecendo.`,

        `A ansiedade pode ser realmente intensa. Você não está sozinho nisso, e é muito bom que você esteja buscando conversar sobre isso.

Me conta: essa ansiedade aparece mais em situações específicas ou é algo mais geral que você sente?`
      ];
      
      reply = anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
      technique = "anxiety_support";
    }
    
    // PENSAMENTOS EXTREMOS - Questionamento gentil
    else if (message.includes('sempre') || message.includes('nunca') || message.includes('todo mundo') ||
             message.includes('ninguém') || message.includes('impossível') || message.includes('terrível')) {
      
      reply = `Hmm, notei algo interessante no que você disse... 🤔

"${body.message.substring(0, 80)}..."

Será que podemos olhar para isso de outro ângulo? Às vezes nossa mente nos prega umas peças e nos faz ver as coisas de um jeito muito categórico.

Me ajuda a entender: como você chegou a essa conclusão? Tem alguma coisa que talvez contradiga essa ideia?`;
      technique = "gentle_cognitive_work";
    }
    
    // EXPRESSÃO DE SENTIMENTOS POSITIVOS
    else if (message.includes('bem') || message.includes('bom') || message.includes('melhor') || 
             message.includes('feliz') || message.includes('alegre') || message.includes('ótimo')) {
      
      const positiveResponses = [
        `Que bom ouvir isso! É ótimo perceber essa energia positiva em você. ✨

O que você acha que contribuiu para você se sentir assim? Me conta mais sobre essa sensação boa.`,

        `Fico muito feliz em saber! É maravilhoso ver você se sentindo assim. 😊

Como podemos manter essa energia positiva? O que tem te ajudado ultimamente?`,

        `Que legal! É bom demais ver você assim. 

Me conta: que outras coisas têm trazido essa sensação boa na sua vida?`
      ];
      
      reply = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
      technique = "positive_reinforcement";
    }
    
    // RESPOSTA PADRÃO - Mais natural e exploratória
    else {
      const exploratoryResponses = [
        `Estou te ouvindo... 👂

Me ajuda a entender melhor: como você está se sentindo sobre essa situação? O que mais está te incomodando?`,

        `Entendi... Parece que tem bastante coisa passando pela sua cabeça.

Me conta: quando você pensa nessa situação, que sensação aparece no seu corpo? E que pensamentos vêm à sua mente?`,

        `Obrigada por compartilhar isso comigo. 💙

Essa situação te lembra de alguma outra coisa que já aconteceu antes? Ou é algo completamente novo para você?`,

        `Posso imaginar que não deve ser fácil...

Se um amigo seu estivesse passando exatamente pela mesma situação, o que você diria para ele? Que conselho daria?`,

        `Hmm, interessante... 

Me conte mais detalhes. Às vezes quando falamos sobre o que nos incomoda, conseguimos ver as coisas com mais clareza.`
      ];
      
      reply = exploratoryResponses[Math.floor(Math.random() * exploratoryResponses.length)];
      technique = "open_exploration";
    }

    // Análise simples do tempo de resposta
    const endTime = Date.now();
    const actualResponseTime = endTime - startTime;

    return NextResponse.json({ 
      reply,
      tccContext: {
        technique: technique,
        responseTime: actualResponseTime,
        conversational: true
      },
      suggestions: []
    });

  } catch (err: unknown) {
    console.error('Erro na API de chat:', err);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        reply: "Desculpe, tive um probleminha técnico. Pode tentar novamente? Estou aqui para te ajudar. 😊"
      }, 
      { status: 500 }
    );
  }
}