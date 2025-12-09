// Sistema de fluxo de conversa melhorado
// Torna as interações mais naturais e empáticas

export interface ConversationContext {
  previousMessages: string[];
  userEmotionalState: 'positive' | 'neutral' | 'negative' | 'mixed';
  conversationStage: 'greeting' | 'exploration' | 'deepening' | 'intervention' | 'closure';
  userEngagement: 'low' | 'medium' | 'high';
  sessionCount: number;
}

export class ConversationFlow {
  
  // Detectar tom emocional da mensagem
  static detectEmotionalTone(message: string): 'positive' | 'neutral' | 'negative' | 'mixed' {
    const positiveWords = ['bem', 'bom', 'ótimo', 'feliz', 'alegre', 'animado', 'melhor', 'legal', 'massa'];
    const negativeWords = ['mal', 'ruim', 'péssimo', 'triste', 'deprimido', 'ansioso', 'preocupado', 'nervoso', 'cansado', 'difícil', 'problema'];
    
    const lowerMessage = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount && positiveCount > 0) return 'positive';
    if (negativeCount > positiveCount && negativeCount > 0) return 'negative';
    if (positiveCount > 0 && negativeCount > 0) return 'mixed';
    return 'neutral';
  }

  // Detectar nível de engajamento baseado na mensagem
  static detectEngagement(message: string): 'low' | 'medium' | 'high' {
    if (message.length < 10) return 'low';
    if (message.length > 100) return 'high';
    
    const engagementIndicators = ['porque', 'como', 'quando', 'sinto', 'penso', 'acho', 'gostaria'];
    const indicators = engagementIndicators.filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    
    if (indicators >= 3) return 'high';
    if (indicators >= 1) return 'medium';
    return 'low';
  }

  // Gerar resposta empática baseada no contexto
  static generateEmpathicResponse(
    message: string, 
    emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed',
    engagement: 'low' | 'medium' | 'high'
  ): string {
    
    const responses = {
      positive: {
        high: [
          "Que bom ouvir isso! É ótimo perceber essa energia positiva em você. ✨",
          "Fico feliz em ver você assim! Parece que você está em um momento bom. 😊",
          "É maravilhoso ver você se sentindo assim! Conta mais sobre o que está contribuindo para isso."
        ],
        medium: [
          "Que legal! É bom ver você assim. 😊",
          "Fico feliz em saber! Como está sendo isso para você?",
          "Que bom! Me conta mais sobre essa sensação."
        ],
        low: [
          "Que bom! 😊",
          "Legal!",
          "Fico feliz em saber."
        ]
      },
      negative: {
        high: [
          "Entendo que você está passando por um momento difícil. Obrigada por confiar em mim para compartilhar isso. 💙",
          "Posso imaginar como isso deve ser pesado para você. Estou aqui para te acompanhar nesse processo.",
          "Percebo que as coisas não estão fáceis. É corajoso da sua parte se abrir sobre isso."
        ],
        medium: [
          "Entendo que não está sendo fácil para você.",
          "Posso ver que você está enfrentando algumas dificuldades.",
          "Obrigada por compartilhar isso comigo."
        ],
        low: [
          "Entendo.",
          "Percebo que não está fácil.",
          "Estou aqui para te ouvir."
        ]
      },
      neutral: {
        high: [
          "Estou te ouvindo... Me ajuda a entender melhor o que está passando pela sua cabeça?",
          "Entendi. Que tal explorarmos isso um pouco mais fundo?",
          "Interessante. Me conte mais sobre como você enxerga essa situação."
        ],
        medium: [
          "Entendi. Me conte mais sobre isso.",
          "Como você está se sentindo sobre isso?",
          "O que mais você gostaria de compartilhar?"
        ],
        low: [
          "Entendi.",
          "Certo.",
          "Como assim?"
        ]
      },
      mixed: {
        high: [
          "Percebo sentimentos mistos no que você está me contando. É normal ter emoções conflitantes às vezes.",
          "Vejo que você está lidando com sentimentos bem complexos. Vamos destrinchar isso juntos?",
          "Parece que há muita coisa acontecendo ao mesmo tempo. Como podemos organizar esses pensamentos?"
        ],
        medium: [
          "Percebo que você tem sentimentos mistos sobre isso.",
          "Parece que é uma situação complexa para você.",
          "Como você está lidando com esses sentimentos diferentes?"
        ],
        low: [
          "Entendo que é complicado.",
          "Parece complexo.",
          "Como você vê isso?"
        ]
      }
    };

    const options = responses[emotionalTone][engagement];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Gerar perguntas de follow-up naturais
  static generateFollowUpQuestion(
    message: string, 
    emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed'
  ): string {
    
    const followUps = {
      positive: [
        "O que você acha que contribuiu para você se sentir assim?",
        "Como podemos manter essa energia positiva?",
        "Que outras coisas têm te ajudado ultimamente?"
      ],
      negative: [
        "Há quanto tempo você vem se sentindo assim?",
        "O que você acha que pode estar contribuindo para isso?",
        "Como essa situação está afetando o seu dia a dia?",
        "Tem alguma coisa específica que dispara esses sentimentos?"
      ],
      neutral: [
        "Me conte mais detalhes sobre essa situação.",
        "Como você costuma lidar com situações assim?",
        "O que mais está na sua mente sobre isso?"
      ],
      mixed: [
        "Que sentimento é mais forte para você nesse momento?",
        "Como você tem lidado com essas emoções conflitantes?",
        "O que você gostaria de explorar primeiro?"
      ]
    };

    const questions = followUps[emotionalTone];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  // Detectar quando transitar para intervenção
  static shouldTransitionToIntervention(
    message: string,
    conversationStage: string,
    messageCount: number
  ): boolean {
    // Após 3-4 trocas de mensagem, começar a introduzir técnicas
    if (messageCount >= 3) return true;
    
    // Se o usuário expressou problema específico claramente
    const problemIndicators = ['problema', 'dificuldade', 'não consigo', 'preciso de ajuda'];
    const hasSpecificProblem = problemIndicators.some(indicator => 
      message.toLowerCase().includes(indicator)
    );
    
    return hasSpecificProblem && conversationStage === 'exploration';
  }

  // Gerar transição suave para técnicas TCC
  static generateTechniqueBridge(technique: string): string {
    const bridges = {
      cognitive_restructuring: [
        "Que tal olharmos isso de outro ângulo? Às vezes nossa mente nos prega umas peças...",
        "Vamos investigar esses pensamentos juntos? Pode ser que encontremos uma perspectiva diferente.",
        "Hmm, notei algo interessante no que você disse. Vamos explorar isso?"
      ],
      behavioral_activation: [
        "Que tal pensarmos em alguma ação pequena que poderia te ajudar?",
        "E se experimentássemos fazer alguma coisa diferente? Às vezes pequenas mudanças fazem grande diferença.",
        "Vamos ver o que você poderia colocar em prática?"
      ],
      relaxation: [
        "Que tal fazermos um exercício de respiração juntos primeiro?",
        "Vamos diminuir um pouco o ritmo? Às vezes relaxar o corpo ajuda a clarear a mente.",
        "E se pausássemos um momento para você se conectar com o presente?"
      ]
    };

    const options = bridges[technique as keyof typeof bridges] || [
      "Vamos tentar uma abordagem diferente para isso.",
      "Que tal explorarmos isso de uma forma mais prática?",
      "Tenho uma ideia de como podemos trabalhar com isso."
    ];

    return options[Math.floor(Math.random() * options.length)];
  }
}

// Mensagens de validação empática
export const validationResponses = [
  "É totalmente compreensível você se sentir assim.",
  "Faz muito sentido essa sua reação.",
  "Qualquer pessoa passando por isso se sentiria da mesma forma.",
  "Você não está errado em se sentir assim.",
  "É uma reação muito humana diante dessa situação."
];

// Frases de encorajamento natural
export const encouragementPhrases = [
  "Você está sendo muito corajoso ao falar sobre isso.",
  "É um grande passo conseguir expressar esses sentimentos.",
  "Admiro sua honestidade comigo.",
  "Você está no caminho certo ao buscar entender isso.",
  "É impressionante sua disposição para olhar para dentro de si."
];