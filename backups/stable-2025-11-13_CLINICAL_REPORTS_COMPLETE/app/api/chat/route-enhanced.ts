import { NextRequest, NextResponse } from "next/server";

// Sistema expandido mas estável
const conversations = new Map();

function getTherapeuticResponse(count, userMessage, history) {
  const lower = userMessage.toLowerCase().trim();
  const concern = detectConcern(lower);
  
  switch (count) {
    case 1:
      return {
        message: `Olá! Muito obrigada por estar aqui. Percebo que você quer conversar sobre algo importante.

**${concern ? getInitialConcernResponse(concern) : 'Me conte: o que te trouxe aqui hoje? O que está mais presente na sua mente?'}**`,
        technique: 'Estabelecimento de rapport terapêutico'
      };
      
    case 2:
      return {
        message: `Entendo melhor agora. ${getConcernValidation(concern, lower)}

**Vamos aprofundar:** quando você sente isso, o que geralmente passa pela sua cabeça? Que tipo de pensamentos aparecem?`,
        technique: 'Identificação de pensamentos automáticos (TCC)'
      };
      
    case 3:
      return {
        message: `Percebo que esses pensamentos têm um padrão. ${getThoughtAnalysis(concern)}

**Vamos fazer um exercício:** se um bom amigo seu tivesse exatamente os mesmos pensamentos, o que você diria para ele?`,
        technique: 'Distanciamento cognitivo e autocompaixão'
      };
      
    case 4:
      return {
        message: `Interessante como conseguimos ter mais gentileza com outros, né? ${getReframingTechnique(concern)}

**Agora uma técnica prática:** ${getPracticalTechnique(concern)}

Que tal tentarmos isso?`,
        technique: getSpecificTechnique(concern)
      };
      
    case 5:
      return {
        message: `Ótimo! Você está se conectando bem com o processo. ${getProgressValidation(concern)}

**Vamos trabalhar o momento presente:** feche os olhos por um momento e respire fundo 3 vezes. Como você se sente agora, depois da nossa conversa?`,
        technique: 'Mindfulness e regulação emocional'
      };
      
    case 6:
      return {
        message: `Percebo uma mudança positiva em como você está processando isso. ${getIntegrationMessage(concern)}

**Para levar daqui:** qual dessas técnicas que praticamos fez mais sentido para você? O que você pode usar no seu dia a dia?`,
        technique: 'Integração e planejamento de autocuidado'
      };
      
    case 7:
      return {
        message: `Nossa conversa foi muito rica e você mostrou muita coragem em se abrir. ${getFinalReflection(concern)}

**Sua "tarefa de casa":** pratique a técnica que mais ressoou com você. Lembre-se: mudanças pequenas e consistentes geram grandes transformações.

Existe algo que ainda gostaria de me perguntar?`,
        technique: 'Consolidação e planejamento futuro'
      };
      
    case 8:
      return {
        message: `Muito obrigada por compartilhar essa jornada comigo hoje. Você tem todas as ferramentas necessárias dentro de si.

**Mensagem final:** seja paciente consigo mesmo. O crescimento é um processo, não um destino. Cuide-se bem e lembre-se: você é mais forte do que imagina. 💙

**Recursos de emergência:** Se precisar de apoio imediato, ligue 188 (CVV) ou busque ajuda profissional.`,
        technique: 'Encerramento terapêutico e recursos de apoio'
      };
      
    default:
      // Finalização gentil para conversas muito longas
      return {
        message: `Nossa sessão de hoje foi muito valiosa. Para absorver melhor tudo que conversamos, sugiro que você reflita sobre nossas técnicas antes de continuarmos.

Volte quando quiser explorar mais! 🌟`,
        technique: 'Pausa para integração'
      };
  }
}

function detectConcern(text) {
  if (text.includes('ansio') || text.includes('nervos') || text.includes('preocup') || text.includes('medo')) return 'ansiedade';
  if (text.includes('trist') || text.includes('deprim') || text.includes('vazio') || text.includes('down')) return 'tristeza';
  if (text.includes('autoestima') || text.includes('confia') || text.includes('insegur') || text.includes('valor')) return 'autoestima';
  if (text.includes('raiva') || text.includes('irritad') || text.includes('bravo') || text.includes('ódio')) return 'raiva';
  if (text.includes('relacionamento') || text.includes('família') || text.includes('sozinho')) return 'relacionamentos';
  return 'geral';
}

function getInitialConcernResponse(concern) {
  const responses = {
    ansiedade: 'Percebo que a ansiedade tem estado presente na sua vida. É muito corajoso buscar apoio.',
    tristeza: 'Vejo que você está passando por um momento difícil. Estar aqui já é um primeiro passo importante.',
    autoestima: 'Questões de autoestima podem ser muito dolorosas. Vamos trabalhar isso juntos.',
    raiva: 'Sentimentos de raiva podem ser overwhelmantes. É importante entender de onde vêm.',
    relacionamentos: 'Relacionamentos podem ser uma fonte tanto de alegria quanto de dificuldade.',
    geral: 'Vejo que você tem algo importante para compartilhar.'
  };
  return responses[concern];
}

function getConcernValidation(concern, text) {
  const validations = {
    ansiedade: 'A ansiedade pode realmente afetar muito nossa qualidade de vida.',
    tristeza: 'Momentos difíceis fazem parte da experiência humana, e não há problema em se sentir assim.',
    autoestima: 'Nossa relação conosco mesmos é fundamental para nosso bem-estar.',
    raiva: 'A raiva é uma emoção válida que geralmente indica que algo importante foi violado.',
    relacionamentos: 'Nossos vínculos com outros são fundamentais para nossa saúde emocional.',
    geral: 'Cada pessoa tem sua própria jornada e desafios únicos.'
  };
  return validations[concern] || validations.geral;
}

function getThoughtAnalysis(concern) {
  const analyses = {
    ansiedade: 'Na ansiedade, nossos pensamentos tendem a focar no "e se..." e em cenários futuros negativos.',
    tristeza: 'Quando estamos tristes, nossa mente pode ficar presa em pensamentos de inadequação ou desesperança.',
    autoestima: 'Problemas de autoestima geralmente vêm com uma voz interna muito crítica.',
    raiva: 'A raiva muitas vezes mascara sentimentos de injustiça, frustração ou vulnerabilidade.',
    relacionamentos: 'Dificuldades relacionais ativam pensamentos sobre rejeição, abandono ou inadequação.',
    geral: 'Nossos pensamentos automáticos refletem padrões profundos de como vemos o mundo.'
  };
  return analyses[concern] || analyses.geral;
}

function getPracticalTechnique(concern) {
  const techniques = {
    ansiedade: 'quando sentir ansiedade, use a técnica 5-4-3-2-1: nomeie 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia. Isso te traz para o presente.',
    tristeza: 'pratique a técnica da autocompaixão: coloque a mão no coração e diga "Este é um momento de sofrimento. Sofrimento faz parte da vida. Posso ser gentil comigo mesmo agora."',
    autoestima: 'toda vez que sua voz interna for crítica, pergunte: "Eu falaria assim com meu melhor amigo?" Se não, reformule com gentileza.',
    raiva: 'quando sentir raiva, respire fundo e pergunte: "O que essa raiva está tentando me proteger?" Geralmente há uma necessidade não atendida por trás.',
    relacionamentos: 'pratique comunicação não-violenta: "Eu sinto X quando Y acontece, porque preciso de Z. Você poderia W?"',
    geral: 'use a respiração consciente: inspire por 4, segure por 4, expire por 6. Isso acalma o sistema nervoso.'
  };
  return techniques[concern] || techniques.geral;
}

function getSpecificTechnique(concern) {
  const techniqueNames = {
    ansiedade: 'Técnica de grounding 5-4-3-2-1 (TCC)',
    tristeza: 'Autocompaixão mindful (ACT/Mindfulness)',
    autoestima: 'Reestruturação cognitiva compassiva (TCC)',
    raiva: 'Exploração de necessidades subjacentes (DBT)',
    relacionamentos: 'Comunicação não-violenta (DBT)',
    geral: 'Respiração consciente para regulação emocional'
  };
  return techniqueNames[concern] || techniqueNames.geral;
}

function getProgressValidation(concern) {
  return 'Você está demonstrando muita coragem ao explorar esses padrões e se abrir para novas perspectivas.';
}

function getIntegrationMessage(concern) {
  return 'O insight que você teve hoje é valioso. Pequenas mudanças de perspectiva podem ter grandes impactos.';
}

function getFinalReflection(concern) {
  return 'Você mostrou hoje que tem a capacidade de olhar para si mesmo com curiosidade e gentileza - isso é o início de toda mudança positiva.';
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
    
    console.log(`\n=== SESSÃO TERAPÊUTICA ===`);
    console.log(`User: ${userMessage}`);
    
    // Pega ou cria conversa
    if (!conversations.has(userId)) {
      conversations.set(userId, { count: 0, history: [], concern: null });
    }
    
    const conv = conversations.get(userId);
    conv.count++;
    conv.history.push(userMessage);
    
    console.log(`Interação: ${conv.count}/8`);
    
    const response = getTherapeuticResponse(conv.count, userMessage, conv.history);
    
    console.log(`Técnica: ${response.technique}`);
    console.log(`Response: ${response.message.substring(0, 60)}...`);
    
    // Reset após 10 mensagens para evitar conversas infinitas
    if (conv.count >= 10) {
      conversations.delete(userId);
      console.log('Conversa resetada após 10 mensagens');
    }
    
    return NextResponse.json({
      success: true,
      message: response.message,
      guidance: `${response.technique} | Interação ${conv.count}/8`,
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