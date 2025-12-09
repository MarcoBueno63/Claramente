import { NextRequest, NextResponse } from "next/server";
import { validateString, validateRequired } from "@/lib/validate";

// SISTEMA AVANÇADO DE CONVERSAÇÃO TCC COM CONTEXTO E MEMÓRIA
interface ConversationMemory {
  userEmotionalState: 'positive' | 'neutral' | 'negative' | 'mixed';
  previousTopics: string[];
  previousResponses: string[];
  establishedIssues: string[];
  conversationFlow: 'greeting' | 'exploration' | 'deepening' | 'intervention' | 'closure';
  messageCount: number;
  lastTechnique?: string;
  userPreferences: {
    communication_style?: 'direct' | 'gentle' | 'exploratory';
    engagement_level?: 'low' | 'medium' | 'high';
  };
}

// Sistema de memória conversacional (simulado - em produção seria banco de dados)
const conversationMemories: Map<string, ConversationMemory> = new Map();

function getConversationMemory(userId: string): ConversationMemory {
  if (!conversationMemories.has(userId)) {
    conversationMemories.set(userId, {
      userEmotionalState: 'neutral',
      previousTopics: [],
      previousResponses: [],
      establishedIssues: [],
      conversationFlow: 'greeting',
      messageCount: 0,
      userPreferences: {}
    });
  }
  return conversationMemories.get(userId)!;
}

function updateConversationMemory(userId: string, updates: Partial<ConversationMemory>) {
  const current = getConversationMemory(userId);
  conversationMemories.set(userId, { ...current, ...updates });
}

function analyzeMessage(message: string, memory: ConversationMemory) {
  const lowerMessage = message.toLowerCase();
  
  // Detectar tom emocional com mais nuances
  const positiveWords = ['bem', 'bom', 'ótimo', 'feliz', 'alegre', 'melhor', 'legal', 'massa', 'animado', 'aliviado', 'grato', 'esperançoso', 'confiante', 'tranquilo', 'calmo', 'satisfeito'];
  const negativeWords = ['mal', 'ruim', 'péssimo', 'triste', 'deprimido', 'ansioso', 'preocupado', 'nervoso', 'cansado', 'difícil', 'problema', 'chateado', 'estressado', 'frustrado', 'irritado', 'perdido', 'confuso', 'desesperado', 'sozinho', 'vazio', 'inútil', 'culpado'];
  const intensityWords = ['muito', 'demais', 'extremamente', 'super', 'completamente', 'totalmente'];
  
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  const intensityCount = intensityWords.filter(word => lowerMessage.includes(word)).length;
  
  let emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed' = 'neutral';
  let intensity = intensityCount > 0 ? 'high' : 'medium';
  
  if (positiveCount > negativeCount && positiveCount > 0) emotionalTone = 'positive';
  else if (negativeCount > positiveCount && negativeCount > 0) emotionalTone = 'negative';
  else if (positiveCount > 0 && negativeCount > 0) emotionalTone = 'mixed';
  
  // Detectar tópicos importantes com mais contexto
  const topics: string[] = [];
  if (lowerMessage.match(/trabalho|emprego|chefe|colega|empresa|carreira|demissão|promoção/)) topics.push('trabalho');
  if (lowerMessage.match(/família|pai|mãe|irmão|irmã|filho|filha|parente|casa/)) topics.push('família');
  if (lowerMessage.match(/relacionamento|namorado|namorada|parceiro|casamento|divórcio|amor|paixão/)) topics.push('relacionamento');
  if (lowerMessage.match(/dinheiro|financeiro|conta|salário|dívida|gasto|economia/)) topics.push('finanças');
  if (lowerMessage.match(/saúde|doença|médico|remédio|dor|sintoma|hospital/)) topics.push('saúde');
  if (lowerMessage.match(/amigo|amizade|social|festa|sair|pessoas|solidão/)) topics.push('social');
  if (lowerMessage.match(/estudo|escola|faculdade|prova|curso|aprender|ensino/)) topics.push('educação');
  if (lowerMessage.match(/futuro|plano|meta|objetivo|sonho|expectativa/)) topics.push('futuro');
  if (lowerMessage.match(/passado|infância|memória|lembrança|aconteceu|antes/)) topics.push('passado');
  
  // Detectar padrões cognitivos mais específicos
  const clinicalPatterns: string[] = [];
  if (lowerMessage.match(/sempre|nunca|todo mundo|ninguém|tudo|nada|impossível|certeza/)) 
    clinicalPatterns.push('pensamento_dicotomico');
  if (lowerMessage.match(/culpa minha|minha culpa|eu que|por minha causa|eu estraguei/)) 
    clinicalPatterns.push('auto_culpabilizacao');
  if (lowerMessage.match(/vai dar errado|vai ser terrível|tenho certeza que|vai acontecer o pior/)) 
    clinicalPatterns.push('catastrofizacao');
  if (lowerMessage.match(/eu deveria|tinha que|preciso ser|tenho que ser perfeito/)) 
    clinicalPatterns.push('perfeccionismo');
  if (lowerMessage.match(/ninguém me ama|sou um fracasso|não sirvo|sou inútil|não valho nada/)) 
    clinicalPatterns.push('rotulacao_negativa');
  if (lowerMessage.match(/ele pensou|ela deve estar|com certeza acham|sei que pensam/)) 
    clinicalPatterns.push('leitura_mental');
  
  // Detectar sinais específicos de condições
  const clinicalSigns: string[] = [];
  if (lowerMessage.match(/não consigo sair da cama|sem energia|não tenho vontade|perdi interesse/))
    clinicalSigns.push('depression_signs');
  if (lowerMessage.match(/coração acelerado|suando|nervoso|preocupado|vai dar errado/))
    clinicalSigns.push('anxiety_signs');
  if (lowerMessage.match(/abandono|vazio|relacionamentos instáveis|raiva intensa|humor muda/))
    clinicalSigns.push('borderline_signs');
  if (lowerMessage.match(/perfeitamente|controle total|não posso errar|tem que ser assim/))
    clinicalSigns.push('ocd_signs');
  
  // Detectar nível de engajamento mais preciso
  const wordCount = message.split(' ').length;
  const questionMarks = (message.match(/\?/g) || []).length;
  const personalSharing = lowerMessage.match(/eu|me|minha|meu|minha vida|aconteceu comigo/) ? 1 : 0;
  
  let engagement: 'low' | 'medium' | 'high' = 'medium';
  if (wordCount > 50 || questionMarks > 1 || personalSharing) engagement = 'high';
  else if (wordCount < 10 && questionMarks === 0) engagement = 'low';
  
  // Detectar tipo de pergunta/necessidade
  let userNeed = 'exploration';
  if (lowerMessage.match(/como|o que fazer|me ajuda|não sei|preciso/)) userNeed = 'guidance';
  if (lowerMessage.match(/por que|entender|razão|causa|motivo/)) userNeed = 'understanding';
  if (lowerMessage.match(/melhorar|parar|mudar|resolver|sair|conseguir/)) userNeed = 'change';
  if (lowerMessage.match(/\?/) && engagement === 'low') userNeed = 'clarification';
  
  return { 
    emotionalTone, 
    intensity, 
    topics, 
    clinicalPatterns, 
    clinicalSigns,
    engagement, 
    userNeed,
    wordCount,
    questionMarks
  };
}

function generateContextualResponse(message: string, analysis: any, memory: ConversationMemory): string {
  const { emotionalTone, topics, clinicalPatterns, engagement, userNeed, intensity, clinicalSigns, wordCount } = analysis;
  const conversationLength = memory.messageCount || 0;
  const recentResponses = memory.previousResponses?.slice(-3) || [];
  
  // Evitar repetições - verificar se a resposta é muito similar às recentes
  const isResponseSimilar = (newResponse: string) => {
    return recentResponses.some(prev => {
      const newWords = newResponse.toLowerCase().split(' ').slice(0, 8);
      const prevWords = prev.toLowerCase().split(' ').slice(0, 8);
      const similarity = newWords.filter(word => prevWords.includes(word)).length / newWords.length;
      return similarity > 0.6; // Se mais de 60% das palavras são iguais, é muito similar
    });
  };

  // PRIMEIRA INTERAÇÃO - Calorosa e estabelecimento de rapport
  if (conversationLength === 0) {
    if (message.match(/oi|olá|boa|hey|primeiro|início|teste/i)) {
      const timeOfDay = new Date().getHours() < 12 ? 'Bom dia' : 
                       new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
      
      return `${timeOfDay}! 😊 Que prazer te conhecer!

Sou a Clara, sua terapeuta virtual. Pode ficar totalmente à vontade comigo - nosso espaço aqui é seguro e sem julgamentos.

Como você está se sentindo hoje? O que te trouxe até aqui?`;
    } else {
      return `Olá! 😊 Obrigada por confiar em mim logo de cara com algo tão pessoal.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Estou aqui para te acompanhar. Como posso te ajudar a entender melhor essa situação?`;
    }
  }

  // DETECÇÃO DE CRISE - Prioridade máxima
  if (message.match(/suicídio|me matar|não aguento mais|acabar com tudo|não vale a pena viver/i)) {
    return `${generateEmpatheticResponse('negative', 'high', 'high')}

Obrigada por confiar em mim com algo tão doloroso. Sua coragem para compartilhar isso é admirável. 💙

Primeiro: você não está sozinho nisso. Esses pensamentos são sinais de uma dor emocional intensa, mas existem caminhos para aliviá-la.

Você está em segurança neste momento? E tem alguém próximo que pode te acompanhar hoje?

*Centro de Valorização da Vida (CVV): 188 - 24h disponível
*CAPS (Centro de Atenção Psicossocial): busque o mais próximo

Como podemos trabalhar juntos para tornar esse momento um pouco mais suportável?`;
  }

  // ANÁLISE CONTEXTUAL INTELIGENTE
  const getResponseStrategy = () => {
    // Identificar se há sinais clínicos específicos
    if (clinicalSigns.includes('depression_signs')) return 'depression_support';
    if (clinicalSigns.includes('anxiety_signs')) return 'anxiety_management';
    if (clinicalSigns.includes('borderline_signs')) return 'emotional_regulation';
    if (clinicalSigns.includes('ocd_signs')) return 'compulsion_awareness';
    
    // Identificar se há padrões cognitivos disfuncionais
    if (clinicalPatterns.length > 0) return 'cognitive_restructuring';
    
    // Baseado na necessidade do usuário
    if (userNeed === 'guidance' || userNeed === 'change') return 'action_oriented';
    if (userNeed === 'understanding') return 'insight_building';
    if (userNeed === 'clarification') return 'clarifying_questions';
    
    // Baseado no fluxo da conversa
    if (conversationLength > 10) return 'synthesis_integration';
    if (engagement === 'low') return 'engagement_building';
    if (engagement === 'high' && wordCount > 100) return 'deep_exploration';
    
    return 'supportive_exploration';
  };

  const strategy = getResponseStrategy();
  let response = '';

  switch (strategy) {
    case 'depression_support':
      const depressionResponses = [
        `Essa falta de energia e motivação que você está sentindo é muito real e válida. Depressão pode fazer até as tarefas mais simples parecerem montanhas.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Me conta: existem momentos do dia, mesmo que pequenos, onde você sente uma pontinha a mais de disposição? Às vezes são nestes momentos que encontramos pistas para começar.`,

        `Reconheço que sair da cama alguns dias parece impossível. Isso não é falta de vontade - é como se o cérebro estivesse em modo de proteção extrema.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Que tal pensarmos em micro-objetivos? O que seria possível para você hoje - algo tão simples que seria quase impossível não conseguir fazer?`,

        `Perder o interesse nas coisas que antes davam prazer é um dos sinais mais claros de depressão. Você não é preguiçoso ou fraco - seu cérebro está lutando uma batalha invisível.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Quando você lembra da última vez que sentiu prazer genuíno em algo? Mesmo que tenha sido algo pequeno?`
      ];
      response = depressionResponses[Math.floor(Math.random() * depressionResponses.length)];
      break;

    case 'anxiety_management':
      const anxietyResponses = [
        `Esse coração disparado e essa sensação de que algo terrível vai acontecer... Ansiedade é como um alarme de incêndio que dispara até quando é só fumaça de torrada.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Quando isso acontece, você consegue identificar qual foi o pensamento que veio primeiro? Às vezes capturar esse primeiro pensamento é a chave.`,

        `A preocupação com o futuro pode ser absolutamente consumidora. Nossa mente tenta nos "proteger" imaginando todos os cenários ruins possíveis.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Vamos fazer um exercício: qual é a probabilidade REAL do seu maior medo se concretizar? E se acontecesse, que recursos você teria para lidar?`,

        `Percebo que sua mente está em estado de alerta constante. É como viver com o acelerador pisado o tempo todo - é exaustivo.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Quando você se permite relaxar completamente? Que situações ou pessoas te trazem uma sensação de segurança?`
      ];
      response = anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
      break;

    case 'emotional_regulation':
      const borderlineResponses = [
        `Essas emoções intensas que você está sentindo... É como se fosse tudo em volume máximo, né? Raiva, tristeza, alegria - tudo muito forte, muito rápido.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Como você tem lidado com essa intensidade? Existe algo que te ajuda a "diminuir o volume" quando fica demais?`,

        `Relacionamentos podem ser um campo minado quando nossas emoções estão tão à flor da pele. É normal querer se proteger, mas às vezes acabamos nos isolando justamente de quem poderia nos ajudar.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Como você gostaria que as pessoas próximas reagissem quando você está em um momento mais difícil?`
      ];
      response = borderlineResponses[Math.floor(Math.random() * borderlineResponses.length)];
      break;

    case 'cognitive_restructuring':
      if (clinicalPatterns.includes('pensamento_dicotomico')) {
        response = `Hmm, percebi que você usou algumas palavras bem absolutas... "sempre", "nunca", "impossível"...

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Nossa mente adora criar essas regras rígidas, mas a vida raramente é tão preto no branco. Que cores você consegue enxergar no meio dessa situação?`;
      } else if (clinicalPatterns.includes('catastrofizacao')) {
        response = `Sua mente está se preparando para o pior cenário possível. É uma forma de tentar se proteger, mas às vezes acaba criando mais sofrimento do que a situação real.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Vamos explorar: qual seria o cenário mais provável? E qual seria o melhor cenário possível? A realidade geralmente fica em algum lugar no meio.`;
      } else {
        response = `Percebo alguns padrões interessantes na forma como você interpreta as situações...

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

E se questionássemos juntos essas primeiras impressões? Às vezes nossa mente nos conta uma versão da história que não é a única possível.`;
      }
      break;

    case 'action_oriented':
      const actionResponses = [
        `Admiro sua disposição para mudança! Isso já é um primeiro passo enorme. 

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Vamos pensar estrategicamente: qual seria a MENOR mudança que você poderia fazer hoje que te levaria na direção certa? Às vezes começamos pequeno para criar impulso.`,

        `Percebo que você quer orientação prática. Antes de pensarmos em estratégias, me ajuda a visualizar: como seria sua vida se esse problema estivesse resolvido? Que diferenças você notaria primeiro?`,

        `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Do que você me contou, qual aspecto parece mais possível de influenciar ou mudar? Às vezes a alavanca certa pode mover montanhas.`
      ];
      response = actionResponses[Math.floor(Math.random() * actionResponses.length)];
      break;

    case 'insight_building':
      const insightResponses = [
        `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Vou te fazer uma pergunta que pode parecer estranha: se um amigo muito querido estivesse na sua situação exata, o que você diria para ele? Às vezes é mais fácil ter clareza quando não somos nós no centro do problema.`,

        `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Que padrões você consegue identificar entre essa situação e outras que já viveu? Nossa história pessoal tem pistas valiosas sobre nossos recursos e nossa resiliência.`,

        `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

O que essa situação te ensina sobre seus valores mais profundos? Às vezes o que mais nos incomoda revela o que mais valorizamos.`
      ];
      response = insightResponses[Math.floor(Math.random() * insightResponses.length)];
      break;

    case 'synthesis_integration':
      response = `Nossa conversa já está rica de insights e reflexões importantes. 

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Olhando para tudo que conversamos, qual tema ou descoberta ressoa mais com você? O que gostaria de levar como reflexão para sua vida?`;
      break;

    case 'engagement_building':
      const engagementResponses = [
        `Percebo que você está sendo conciso. Às vezes é difícil encontrar palavras para sentimentos complexos.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Que tal tentarmos de outro ângulo? Como você se sentiria se um amigo próximo estivesse passando pela mesma situação?`,

        `Sinto que há mais camadas por trás do que você compartilhou.

${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

O que mais está passando pela sua mente sobre isso? Estou aqui para te ouvir sem pressa.`
      ];
      response = engagementResponses[Math.floor(Math.random() * engagementResponses.length)];
      break;

    case 'deep_exploration':
      response = `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Percebo a profundidade e a riqueza do que você está compartilhando. Isso mostra muita coragem e autoconhecimento.

Qual dessas camadas que você trouxe parece mais urgente para explorarmos? Ou há algo que conecta todas essas experiências?`;
      break;

    default: // supportive_exploration
      response = `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

${generateTopicSpecificQuestion(topics, memory, emotionalTone)}`;
      break;
  }

  // Verificar se a resposta é muito similar às anteriores
  if (isResponseSimilar(response)) {
    const alternativeResponses = [
      `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Como você tem processado tudo isso? Que sentimentos estão mais presentes para você neste momento?`,

      `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

O que mais te chama atenção quando você para para pensar sobre essa situação?`,

      `${generateEmpatheticResponse(emotionalTone, engagement, intensity)}

Estou curiosa sobre sua perspectiva. Como essa experiência tem te afetado no dia a dia?`
    ];
    response = alternativeResponses[Math.floor(Math.random() * alternativeResponses.length)];
  }

  return response;
}

function generateEmpatheticResponse(
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed', 
  engagement: 'low' | 'medium' | 'high',
  intensity?: 'low' | 'medium' | 'high'
): string {
  const actualIntensity = intensity || engagement;
  
  const responses = {
    positive: {
      high: "Que energia boa! É ótimo sentir você assim animado. ✨",
      medium: "Que bom te ver assim! 😊",
      low: "Legal! 😊"
    },
    negative: {
      high: "Posso imaginar o quanto isso deve ser pesado para você. Obrigada por dividir comigo algo tão íntimo. 💙",
      medium: "Entendo que não está sendo fácil...",
      low: "Percebo que você está passando por uma dificuldade."
    },
    mixed: {
      high: "Percebo sentimentos bem complexos no que você está me contando. É normal ter emoções conflitantes às vezes.",
      medium: "Parece que você tem sentimentos mistos sobre isso.",
      low: "Vejo que é uma situação complexa."
    },
    neutral: {
      high: "Estou te ouvindo com atenção... Me ajuda a entender melhor?",
      medium: "Entendi. Conte mais sobre isso.",
      low: "Entendi."
    }
  };
  
  return responses[emotionalTone]?.[actualIntensity] || responses[emotionalTone]?.[engagement] || "Estou te ouvindo.";
}

function generateTopicSpecificQuestion(
  topics: string[], 
  memory: ConversationMemory, 
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed'
): string {
  if (topics.length > 0) {
    const topic = topics[0];
    const questions = {
      trabalho: [
        "Como o trabalho tem afetado seu bem-estar emocional?",
        "O que seria diferente se a situação no trabalho melhorasse?",
        "Como você se vê profissionalmente daqui a um tempo?"
      ],
      família: [
        "Como essa dinâmica familiar ressoa com você?",
        "O que você gostaria que fosse diferente nessa relação?",
        "Que papéis você sente que desempenha na família?"
      ],
      relacionamento: [
        "Como vocês se conectam nos momentos bons?",
        "O que você mais valoriza nessa relação?",
        "Como essa situação afeta sua forma de se relacionar?"
      ],
      finanças: [
        "Como a questão financeira tem impactado seu dia a dia?",
        "O que essa situação financeira desperta em você?",
        "Qual seria sua prioridade se pudesse melhorar isso?"
      ],
      saúde: [
        "Como você tem cuidado de si mesmo nesse processo?",
        "O que essa situação de saúde te ensina sobre você?",
        "Que recursos você tem descoberto em si mesmo?"
      ]
    };
    
    const topicQuestions = questions[topic as keyof typeof questions] || [
      "Me conta mais sobre como isso ressoa com você.",
      "Como isso se conecta com outras áreas da sua vida?",
      "O que essa situação revela sobre o que é importante para você?"
    ];
    
    return topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
  }
  
  const generalQuestions = [
    "O que mais está ecoando em seus pensamentos?",
    "Como sua intuição está te guiando nessa situação?",
    "Que insights estão surgindo para você?",
    "O que seu coração está te dizendo sobre isso?"
  ];
  
  return generalQuestions[Math.floor(Math.random() * generalQuestions.length)];
}

function generateCuriousQuestion(topics: string[], memory: ConversationMemory): string {
  if (topics.length > 0) {
    const topic = topics[0];
    const questions = {
      trabalho: [
        "Como o trabalho tem afetado outras áreas da sua vida?",
        "O que seria diferente se essa situação no trabalho melhorasse?",
        "Que parte do trabalho mais te incomoda atualmente?"
      ],
      família: [
        "Como essa dinâmica familiar afeta seu dia a dia?",
        "O que você gostaria que fosse diferente nessa situação?",
        "Como você se sente quando está com sua família?"
      ],
      relacionamento: [
        "Como vocês costumam lidar com conflitos?",
        "O que você valoriza mais nessa relação?",
        "Como você se sente quando está com essa pessoa?"
      ]
    };
    
    const topicQuestions = questions[topic as keyof typeof questions] || [
      "Me conta mais sobre essa situação.",
      "Como isso tem afetado você?",
      "O que mais te preocupa sobre isso?"
    ];
    
    return topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
  }
  
  return [
    "O que mais está passando pela sua cabeça?",
    "Como você tem se sentido ultimamente?",
    "Tem alguma coisa específica que você gostaria de explorar?",
    "O que está pesando mais no seu coração hoje?"
  ][Math.floor(Math.random() * 4)];
}

function generateTechniqueIntroduction(patterns: string[], emotionalTone: string): string {
  if (patterns.length > 0) {
    return "Que tal olharmos isso de um ângulo um pouco diferente? Às vezes nossa mente nos prega umas peças e podemos encontrar perspectivas mais gentis.";
  }
  
  if (emotionalTone === 'negative') {
    return "Vamos ver se conseguimos encontrar algumas ferramentas para lidar com isso de uma forma mais suave?";
  }
  
  return "Que tal explorarmos algumas estratégias que podem te ajudar?";
}

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

    const message = body.message;
    const userId = body.userId;
    
    // Buscar memória da conversa
    const memory = getConversationMemory(userId);
    
    // Analisar mensagem atual
    const analysis = analyzeMessage(message, memory);
    
    // Delay terapêutico mais natural (variável baseado na complexidade)
    const delayTime = analysis.engagement === 'high' ? 1800 : analysis.engagement === 'medium' ? 1200 : 800;
    await new Promise(resolve => setTimeout(resolve, delayTime + Math.random() * 600));
    
    // Gerar resposta contextual
    const reply = generateContextualResponse(message, analysis, memory);
    
    // Atualizar memória da conversa
    const updatedTopics = [...new Set([...memory.previousTopics, ...analysis.topics])].slice(-3); // Últimos 3 tópicos
    const updatedResponses = [...(memory.previousResponses || []), reply].slice(-3); // Últimas 3 respostas
    
    let newFlow = memory.conversationFlow;
    if (memory.messageCount >= 2 && newFlow === 'greeting') newFlow = 'exploration';
    if (memory.messageCount >= 4 && newFlow === 'exploration') newFlow = 'deepening';
    
    updateConversationMemory(userId, {
      userEmotionalState: analysis.emotionalTone,
      previousTopics: updatedTopics,
      previousResponses: updatedResponses,
      establishedIssues: analysis.clinicalPatterns.length > 0 ? 
        [...new Set([...memory.establishedIssues, ...analysis.clinicalPatterns])] : 
        memory.establishedIssues,
      conversationFlow: newFlow,
      messageCount: memory.messageCount + 1,
      userPreferences: {
        ...memory.userPreferences,
        engagement_level: analysis.engagement as 'low' | 'medium' | 'high'
      }
    });
    
    // Determinar técnica aplicada
    let technique = 'conversational';
    if (analysis.clinicalPatterns.includes('pensamento_dicotomico')) technique = 'cognitive_restructuring';
    if (analysis.clinicalPatterns.includes('auto_culpabilizacao')) technique = 'self_compassion';
    if (message.match(/abandono|vazio|relacionamentos difíceis/i)) technique = 'dbt_suggestion';
    if (message.match(/morreu|faleceu|luto/i)) technique = 'act_grief_suggestion';

    const endTime = Date.now();
    
    return NextResponse.json({ 
      reply,
      tccContext: {
        technique: technique,
        category: newFlow,
        responseTime: endTime - startTime,
        conversational: true,
        emotionalTone: analysis.emotionalTone,
        topicsDiscussed: updatedTopics
      },
      suggestions: []
    });

  } catch (err: unknown) {
    console.error('Erro na API de chat:', err);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        reply: "Nossa, tive um pequeno problema técnico aqui... 😅 Pode tentar me falar de novo? Estou aqui para te ouvir!"
      }, 
      { status: 500 }
    );
  }
}