// Sistema de Personalização da IA baseado no comportamento do usuário
export interface PersonalizationProfile {
  userId: string;
  communicationStyle: 'formal' | 'casual' | 'empathetic' | 'direct' | 'adaptive';
  preferredTechniques: string[];
  responseLength: 'short' | 'medium' | 'detailed';
  emotionalSensitivity: 'low' | 'medium' | 'high';
  learningPreferences: {
    likesExamples: boolean;
    prefersStepByStep: boolean;
    respondsToEncouragement: boolean;
    needsReassurance: boolean;
  };
  interactionPatterns: {
    averageResponseTime: number;
    sessionDuration: number;
    preferredTimeOfDay: string;
    engagementLevel: number; // 1-10
  };
  therapeuticProgress: {
    resistanceLevel: number; // 1-10
    openness: number; // 1-10
    selfAwareness: number; // 1-10
    motivationLevel: number; // 1-10
  };
  triggers: string[]; // Palavras ou temas que geram reações fortes
  strengths: string[]; // Pontos fortes identificados
  adaptations: {
    avoidTopics: string[];
    emphasizeTopics: string[];
    modifyTone: 'softer' | 'stronger' | 'neutral';
  };
}

export interface InteractionData {
  messageLength: number;
  responseTime: number;
  emotionalWords: string[];
  techniquesUsed: string[];
  userEngagement: number; // Baseado em tempo de resposta e comprimento
  sessionContext: string;
}

class PersonalizationEngine {
  private readonly PROFILE_KEY = 'claramente_personalization';

  // Inicializar perfil base
  createBaseProfile(userId: string): PersonalizationProfile {
    return {
      userId,
      communicationStyle: 'adaptive',
      preferredTechniques: [],
      responseLength: 'medium',
      emotionalSensitivity: 'medium',
      learningPreferences: {
        likesExamples: true,
        prefersStepByStep: true,
        respondsToEncouragement: true,
        needsReassurance: true
      },
      interactionPatterns: {
        averageResponseTime: 30000, // 30 segundos
        sessionDuration: 1800000, // 30 minutos
        preferredTimeOfDay: 'evening',
        engagementLevel: 5
      },
      therapeuticProgress: {
        resistanceLevel: 5,
        openness: 5,
        selfAwareness: 5,
        motivationLevel: 5
      },
      triggers: [],
      strengths: [],
      adaptations: {
        avoidTopics: [],
        emphasizeTopics: [],
        modifyTone: 'neutral'
      }
    };
  }

  // Verificar se estamos no cliente ou servidor
  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Carregar perfil de personalização
  loadProfile(userId: string): PersonalizationProfile {
    try {
      if (!this.isClient()) {
        // No servidor, retorna perfil base
        return this.createBaseProfile(userId);
      }
      
      const data = localStorage.getItem(`${this.PROFILE_KEY}_${userId}`);
      if (!data) return this.createBaseProfile(userId);
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar perfil de personalização:', error);
      return this.createBaseProfile(userId);
    }
  }

  // Salvar perfil atualizado
  saveProfile(profile: PersonalizationProfile): void {
    try {
      if (!this.isClient()) {
        // No servidor, apenas log (futuramente pode usar database)
        console.log('Perfil seria salvo:', profile.userId);
        return;
      }
      
      localStorage.setItem(`${this.PROFILE_KEY}_${profile.userId}`, JSON.stringify(profile));
    } catch (error) {
      console.error('Erro ao salvar perfil de personalização:', error);
    }
  }

  // Analisar interação e atualizar perfil
  analyzeInteraction(
    userId: string, 
    userMessage: string, 
    _aiResponse: string, 
    tccContext: Record<string, unknown>, 
    responseTime: number
  ): PersonalizationProfile {
    const profile = this.loadProfile(userId);
    
    // Análise do padrão de comunicação
    const messageLength = userMessage.length;
    const isDetailedMessage = messageLength > 100;
    const isQuickResponse = responseTime < 10000; // 10 segundos

    // Detectar estilo de comunicação preferido
    if (isDetailedMessage && !isQuickResponse) {
      profile.responseLength = 'detailed';
      profile.learningPreferences.prefersStepByStep = true;
    } else if (isQuickResponse && messageLength < 50) {
      profile.responseLength = 'short';
      profile.communicationStyle = 'direct';
    }

    // Análise emocional
    const emotionalWords = this.detectEmotionalWords(userMessage);
    const emotionalIntensity = this.calculateEmotionalIntensity(emotionalWords);
    
    if (emotionalIntensity > 7) {
      profile.emotionalSensitivity = 'high';
      profile.learningPreferences.needsReassurance = true;
    } else if (emotionalIntensity < 3) {
      profile.emotionalSensitivity = 'low';
      profile.communicationStyle = 'direct';
    }

    // Detectar resistência terapêutica
    const resistanceIndicators = ['não sei', 'talvez', 'não tenho certeza', 'não funciona', 'já tentei'];
    const resistanceLevel = resistanceIndicators.filter(indicator => 
      userMessage.toLowerCase().includes(indicator)
    ).length;
    
    if (resistanceLevel > 0) {
      profile.therapeuticProgress.resistanceLevel = Math.min(10, profile.therapeuticProgress.resistanceLevel + 1);
      profile.adaptations.modifyTone = 'softer';
      profile.learningPreferences.respondsToEncouragement = true;
    } else {
      profile.therapeuticProgress.resistanceLevel = Math.max(1, profile.therapeuticProgress.resistanceLevel - 0.5);
    }

    // Identificar técnicas preferidas
    const technique = tccContext?.technique;
    if (typeof technique === 'string' && responseTime < 15000) {
      if (!profile.preferredTechniques.includes(technique)) {
        profile.preferredTechniques.push(technique);
      }
    }

    // Detectar triggers pessoais
    const potentialTriggers = this.identifyTriggers(userMessage, emotionalIntensity);
    profile.triggers = [...new Set([...profile.triggers, ...potentialTriggers])];

    // Identificar pontos fortes
    const strengths = this.identifyStrengths(userMessage, tccContext);
    profile.strengths = [...new Set([...profile.strengths, ...strengths])];

    // Atualizar padrões de interação
    profile.interactionPatterns.averageResponseTime = 
      (profile.interactionPatterns.averageResponseTime + responseTime) / 2;

    // Calcular nível de engajamento
    const engagementScore = this.calculateEngagement(messageLength, responseTime, emotionalIntensity);
    profile.interactionPatterns.engagementLevel = 
      (profile.interactionPatterns.engagementLevel + engagementScore) / 2;

    // Determinar hora preferida
    const currentHour = new Date().getHours();
    if (currentHour < 12) profile.interactionPatterns.preferredTimeOfDay = 'morning';
    else if (currentHour < 18) profile.interactionPatterns.preferredTimeOfDay = 'afternoon';
    else profile.interactionPatterns.preferredTimeOfDay = 'evening';

    this.saveProfile(profile);
    return profile;
  }

  // Gerar resposta personalizada
  personalizeResponse(baseResponse: string, profile: PersonalizationProfile, _context: unknown): string {
    void _context;
    let personalizedResponse = baseResponse;

    // Ajustar tom baseado no perfil
    if (profile.adaptations.modifyTone === 'softer') {
      personalizedResponse = this.softenTone(personalizedResponse, profile);
    } else if (profile.adaptations.modifyTone === 'stronger') {
      personalizedResponse = this.strengthenTone(personalizedResponse);
    }

    // Ajustar comprimento da resposta
    if (profile.responseLength === 'short') {
      personalizedResponse = this.shortenResponse(personalizedResponse);
    } else if (profile.responseLength === 'detailed') {
      personalizedResponse = this.expandResponse(personalizedResponse, profile);
    }

    // Adicionar encorajamento se necessário
    if (profile.learningPreferences.respondsToEncouragement && 
        profile.therapeuticProgress.motivationLevel < 6) {
      personalizedResponse += this.addEncouragement(profile);
    }

    // Incluir reasseguramento se necessário
    if (profile.learningPreferences.needsReassurance && 
        profile.emotionalSensitivity === 'high') {
      personalizedResponse = this.addReassurance(personalizedResponse);
    }

    // Usar técnicas preferidas
    if (profile.preferredTechniques.length > 0 && Math.random() > 0.7) {
      personalizedResponse += this.suggestPreferredTechnique(profile);
    }

    return personalizedResponse;
  }

  // Métodos auxiliares
  private detectEmotionalWords(message: string): string[] {
    const emotionalLexicon = {
      high: ['desesperado', 'terrível', 'horrível', 'devastado', 'destruído', 'perdido'],
      medium: ['triste', 'ansioso', 'preocupado', 'frustrado', 'confuso', 'cansado'],
      low: ['ok', 'bem', 'normal', 'tranquilo', 'estável']
    };

    const words = message.toLowerCase().split(/\s+/);
    const foundEmotions: string[] = [];

    Object.entries(emotionalLexicon).forEach(([intensity, emotionWords]) => {
      emotionWords.forEach(word => {
        if (words.includes(word)) {
          foundEmotions.push(`${intensity}:${word}`);
        }
      });
    });

    return foundEmotions;
  }

  private calculateEmotionalIntensity(emotionalWords: string[]): number {
    let intensity = 0;
    emotionalWords.forEach(word => {
      if (word.startsWith('high:')) intensity += 3;
      else if (word.startsWith('medium:')) intensity += 2;
      else if (word.startsWith('low:')) intensity += 1;
    });
    return Math.min(10, intensity);
  }

  private identifyTriggers(message: string, emotionalIntensity: number): string[] {
    if (emotionalIntensity < 7) return [];
    
    // Palavras que podem ser triggers quando associadas a alta intensidade emocional
    const potentialTriggers = [
      'trabalho', 'família', 'relacionamento', 'dinheiro', 'saúde', 
      'futuro', 'passado', 'rejeição', 'abandono', 'fracasso'
    ];
    
    const triggers: string[] = [];
    potentialTriggers.forEach(trigger => {
      if (message.toLowerCase().includes(trigger)) {
        triggers.push(trigger);
      }
    });
    
    return triggers;
  }

  private identifyStrengths(message: string, tccContext: Record<string, unknown>): string[] {
    const strengths: string[] = [];
    
    // Indicadores de autoconhecimento
    if (message.includes('percebo que') || message.includes('notei que')) {
      strengths.push('autoconhecimento');
    }
    
    // Indicadores de resiliência
    if (message.includes('vou tentar') || message.includes('vou fazer')) {
      strengths.push('determinação');
    }
    
    // Uso espontâneo de técnicas TCC
    if (typeof tccContext.technique === 'string' && message.includes('evidência')) {
      strengths.push('pensamento_crítico');
    }
    
    return strengths;
  }

  private calculateEngagement(messageLength: number, responseTime: number, emotionalIntensity: number): number {
    let engagement = 5; // Base
    
    // Mensagens mais longas indicam maior engajamento
    if (messageLength > 100) engagement += 2;
    else if (messageLength > 50) engagement += 1;
    
    // Resposta rápida pode indicar engajamento ou pressa
    if (responseTime < 5000) engagement += 1;
    else if (responseTime > 60000) engagement -= 1;
    
    // Intensidade emocional moderada indica engajamento saudável
    if (emotionalIntensity >= 3 && emotionalIntensity <= 7) engagement += 1;
    
    return Math.max(1, Math.min(10, engagement));
  }

  private softenTone(response: string, _profile: PersonalizationProfile): string {
    void _profile;
    // Adicionar frases suavizantes
    const softeningPhrases = [
      'Entendo que isso pode ser difícil',
      'É compreensível que você se sinta assim',
      'Vamos com calma',
      'Sem pressão'
    ];
    
    const phrase = softeningPhrases[Math.floor(Math.random() * softeningPhrases.length)];
    return `${phrase}. ${response}`;
  }

  private strengthenTone(response: string): string {
    // Tornar mais direto e motivacional
    return response
      .replace('talvez', 'certamente')
      .replace('pode ser', 'é')
      .replace('tente', 'faça');
  }

  private shortenResponse(response: string): string {
    // Pegar apenas a primeira parte da resposta
    const sentences = response.split('.');
    return sentences.slice(0, 2).join('.') + (sentences.length > 2 ? '.' : '');
  }

  private expandResponse(response: string, profile: PersonalizationProfile): string {
    // Adicionar exemplos se o usuário gosta
    if (profile.learningPreferences.likesExamples) {
      response += '\n\n**Exemplo prático:** Imagine uma situação similar onde...';
    }
    
    // Adicionar passos detalhados se preferir
    if (profile.learningPreferences.prefersStepByStep) {
      response += '\n\n**Passo a passo:**\n1. Primeiro, identifique...\n2. Em seguida, questione...\n3. Por fim, reformule...';
    }
    
    return response;
  }

  private addEncouragement(_profile: PersonalizationProfile): string {
    void _profile;
    const encouragements = [
      '\n\n💪 Você está fazendo um ótimo trabalho ao explorar esses sentimentos!',
      '\n\n🌟 Cada insight que você tem é um passo importante na sua jornada.',
      '\n\n🚀 Sua abertura para mudança já é um grande avanço!',
      '\n\n❤️ Lembre-se: progresso, não perfeição.'
    ];
    
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  private addReassurance(response: string): string {
    const reassurance = 'Lembre-se: você está em um espaço seguro e suas reações são completamente válidas. ';
    return reassurance + response;
  }

  private suggestPreferredTechnique(profile: PersonalizationProfile): string {
    const technique = profile.preferredTechniques[
      Math.floor(Math.random() * profile.preferredTechniques.length)
    ];
    
    return `\n\n💡 **Dica:** Como você costuma responder bem a **${technique}**, que tal tentarmos isso agora?`;
  }
}

export const personalizationEngine = new PersonalizationEngine();