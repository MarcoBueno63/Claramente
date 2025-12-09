import { NextRequest, NextResponse } from "next/server";

// Imports otimizados - carregamento lazy quando necessário
let ConversationFlow: any;
let DSM5_PROTOCOLS: any;
let TCC_TECHNIQUES: any;
let ProtocolDetectionSystem: any;
let SessionManager: any;

// Interface para contexto da sessão (exportada para session-manager)
export interface SessionContext {
  userId: string;
  startTime: Date;
  messages: string[];
  detectedEmotions: string[];
  appliedTechniques: string[];
  conversationStage: 'greeting' | 'exploration' | 'deepening' | 'intervention' | 'closure';
  userSymptoms: string[];
  suggestedProtocols: any[];
}

// Armazenamento em memória das sessões - MANTIDO para compatibilidade temporária
const activeSessions = new Map<string, SessionContext>();

// Sistema de análise emocional otimizado
class EmotionalAnalyzer {
  private static emotionPatterns = {
    ansiedade: ['ansioso', 'nervoso', 'preocupado', 'tenso'],
    tristeza: ['triste', 'deprimido', 'down', 'melancólico'],
    raiva: ['raiva', 'irritado', 'bravo', 'furioso'],
    medo: ['medo', 'assustado', 'receoso', 'amedrontado'],
    vazio: ['vazio', 'sem sentido', 'perdido', 'desconectado']
  };

  private static symptomPatterns = {
    insônia: ['não consigo dormir', 'insônia', 'acordar', 'sono'],
    pânico: ['pânico', 'ataque', 'coração acelera', 'falta de ar'],
    pensamentos: ['pensamentos ruins', 'ruminação', 'não consigo parar'],
    evitação: ['evito', 'fujo', 'não saio', 'isolado'],
    compulsão: ['compulsão', 'ritual', 'repetir', 'verificar']
  };

  static analyzeMessage(message: string) {
    const lower = message.toLowerCase();
    
    const emotions = Object.entries(this.emotionPatterns)
      .filter(([_, patterns]) => patterns.some(p => lower.includes(p)))
      .map(([emotion]) => emotion);
    
    const symptoms = Object.entries(this.symptomPatterns)
      .filter(([_, patterns]) => patterns.some(p => lower.includes(p)))
      .map(([symptom]) => symptom);
    
    let urgencyLevel: 'low' | 'medium' | 'high' | 'crisis' = 'low';
    if (lower.includes('suicídio') || lower.includes('me matar')) {
      urgencyLevel = 'crisis';
    } else if (lower.includes('desesperado') || lower.includes('não aguento')) {
      urgencyLevel = 'high';
    } else if (emotions.length >= 2 || symptoms.length >= 1) {
      urgencyLevel = 'medium';
    }
    
    // Detectar temas chave
    const keyThemes = [];
    if (lower.includes('trabalho') || lower.includes('carreira')) keyThemes.push('trabalho');
    if (lower.includes('relacionamento') || lower.includes('namorado') || lower.includes('família')) keyThemes.push('relacionamentos');
    if (lower.includes('autoestima') || lower.includes('me sinto inútil')) keyThemes.push('autoestima');
    
    return { emotions, symptoms, urgencyLevel, keyThemes };
  }
}

// Sistema de geração de respostas terapêuticas
class TherapeuticResponseGenerator {
  static generateResponse(
    userMessage: string,
    sessionContext: SessionContext,
    timeElapsed: number
  ): {
    message: string;
    technique?: string;
    guidance?: string;
    intervention?: string;
  } {
    const analysis = EmotionalAnalyzer.analyzeMessage(userMessage);
    
    // Resposta de crise
    if (analysis.urgencyLevel === 'crisis') {
      return {
        message: "**⚠️ IMPORTANTE:** Percebo que você está passando por um momento muito difícil. Sua segurança é prioridade.\n\n**Por favor, procure ajuda imediata:**\n• CVV: 188 (24h, gratuito)\n• SAMU: 192\n• Emergência: 190\n\n**Você não está sozinho(a).** Profissionais estão disponíveis para te ajudar agora mesmo.",
        guidance: "Situação de crise identificada - encaminhamento para recursos de emergência",
        technique: "Intervenção de Crise"
      };
    }
    
    // Determinar estágio da conversa baseado no tempo
    const stage = timeElapsed < 300 ? 'greeting' : 
                  timeElapsed < 900 ? 'exploration' :
                  timeElapsed < 1500 ? 'deepening' : 'intervention';
    
    sessionContext.conversationStage = stage;
    
    // Detectar tom emocional
    const emotionalTone = ConversationFlow.detectEmotionalTone(userMessage);
    const engagement = ConversationFlow.detectEngagement(userMessage);
    
    // Resposta empática base
    let baseResponse = ConversationFlow.generateEmpathicResponse(userMessage, emotionalTone, engagement);
    
    // Aplicar técnicas baseadas no estágio e análise
    let technique = '';
    let intervention = '';
    
    if (stage === 'exploration') {
      // Questionamento socrático e exploração
      const followUp = ConversationFlow.generateFollowUpQuestion(userMessage, emotionalTone);
      baseResponse += `\n\n${followUp}`;
      technique = 'Exploração Empática';
      
    } else if (stage === 'deepening') {
      // Identificação de padrões e crenças
      if (analysis.symptoms.includes('pensamentos intrusivos')) {
        baseResponse += '\n\n**Vamos explorar esses pensamentos:** Quando você tem esses pensamentos, como você costuma reagir? Você acredita que esses pensamentos são sempre verdadeiros?';
        technique = 'Identificação de Pensamentos Automáticos';
      }
      
    } else if (stage === 'intervention') {
      // Aplicar técnicas específicas
      if (analysis.emotions.includes('ansiedade')) {
        baseResponse += '\n\n**Técnica de Respiração:** Vamos fazer juntos: inspire por 4 segundos, segure por 4, expire por 6. Isso ajuda a acalmar o sistema nervoso.';
        technique = 'Respiração Diafragmática';
        intervention = 'Técnica de Regulação Emocional';
      } else if (analysis.emotions.includes('tristeza')) {
        baseResponse += '\n\n**Ativação Comportamental:** Que atividade pequena você poderia fazer hoje que costumava te dar prazer? Às vezes começar com pequenas ações ajuda a melhorar o humor.';
        technique = 'Ativação Comportamental';
        intervention = 'Técnica Comportamental TCC';
      }
    }
    
    // Adicionar elementos específicos de DBT/ACT quando apropriado
    if (analysis.emotions.includes('raiva') && timeElapsed > 600) {
      baseResponse += '\n\n**💡 Mindfulness:** Quando sentir raiva, tente nomear: "Estou sentindo raiva agora". Observar a emoção sem julgamento já é o primeiro passo para lidar com ela.';
      technique = 'Mindfulness DBT';
    }
    
    // Atualizar contexto da sessão
    sessionContext.detectedEmotions.push(...analysis.emotions);
    sessionContext.userSymptoms.push(...analysis.symptoms);
    if (technique) sessionContext.appliedTechniques.push(technique);
    
    return {
      message: baseResponse,
      technique: technique || undefined,
      guidance: `Estágio: ${stage} | Técnica aplicada: ${technique || 'Escuta empática'}`,
      intervention: intervention || undefined
    };
  }
}

export async function POST(req: NextRequest) {
  console.log("\n=== NOVA MENSAGEM TERAPÊUTICA ===");
  
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
    const sessionStartTime = body.sessionStartTime ? new Date(body.sessionStartTime) : new Date();
    const timeElapsed = body.timeElapsed || 0;
    
    console.log(`\n=== NOVA MENSAGEM TERAPÊUTICA ===`);
    console.log(`User: ${userMessage}`);
    console.log(`Tempo decorrido: ${Math.floor(timeElapsed / 60)}min ${timeElapsed % 60}s`);
    
    // 🆕 SISTEMA DE PERSISTÊNCIA INTEGRADO
    // Garantir que o usuário existe
    await SessionManager.getOrCreateUser(userId);
    
    // Obter sessão ativa ou criar nova
    let persistentSession = await SessionManager.getActiveSession(userId);
    if (!persistentSession) {
      persistentSession = await SessionManager.createSession(userId);
      console.log(`🆕 Nova sessão persistente criada: ${persistentSession.id}`);
    }

    // Salvar mensagem do usuário
    await SessionManager.saveMessage(
      persistentSession.id,
      'user',
      userMessage,
      {
        emotionalTone: ConversationFlow.detectEmotionalTone(userMessage),
        urgencyLevel: EmotionalAnalyzer.analyzeMessage(userMessage).urgencyLevel
      }
    );
    
    // 🔄 COMPATIBILIDADE com sistema em memória existente
    let sessionContext = activeSessions.get(userId);
    if (!sessionContext) {
      sessionContext = {
        userId,
        startTime: sessionStartTime,
        messages: [],
        detectedEmotions: persistentSession.detectedEmotions,
        appliedTechniques: persistentSession.appliedTechniques,
        conversationStage: persistentSession.conversationStage,
        userSymptoms: persistentSession.userSymptoms,
        suggestedProtocols: []
      };
      activeSessions.set(userId, sessionContext);
    }
    
    // Adicionar mensagem ao contexto
    sessionContext.messages.push(userMessage);
    
    // Analisar e gerar resposta terapêutica
    const response = TherapeuticResponseGenerator.generateResponse(
      userMessage,
      sessionContext,
      timeElapsed
    );
    
    // 💾 SALVAR resposta e contexto atualizado
    await SessionManager.saveMessage(
      persistentSession.id,
      'assistant',
      response.message,
      {
        technique: response.technique,
        intervention: response.intervention
      }
    );

    // Atualizar sessão persistente com dados atualizados
    await SessionManager.updateSessionContext(persistentSession.id, {
      detectedEmotions: sessionContext.detectedEmotions,
      appliedTechniques: sessionContext.appliedTechniques,
      conversationStage: sessionContext.conversationStage,
      userSymptoms: sessionContext.userSymptoms,
      urgencyLevel: EmotionalAnalyzer.analyzeMessage(userMessage).urgencyLevel,
      primaryConcern: sessionContext.userSymptoms.length > 0 ? sessionContext.userSymptoms[0] : undefined
    });
    
    console.log(`Emoções detectadas: ${sessionContext.detectedEmotions.join(', ')}`);
    console.log(`Técnicas aplicadas: ${sessionContext.appliedTechniques.join(', ')}`);
    console.log(`Estágio: ${sessionContext.conversationStage}`);
    console.log(`💾 Dados salvos na sessão: ${persistentSession.id}`);
    
    // Mensagem de finalização quando próximo dos 30 minutos
    if (timeElapsed > 25 * 60) {
      response.message += '\n\n**🕐 Preparando finalização:** Vamos começar a sintetizar os insights de hoje para que você possa levar algo prático dessa nossa conversa.';
      
      // Finalizar sessão persistente se estiver no fim
      if (timeElapsed >= 30 * 60) {
        await SessionManager.endSession(persistentSession.id, 'Sessão completada com sucesso após 30 minutos de terapia interativa.');
        console.log(`🔚 Sessão ${persistentSession.id} finalizada automaticamente`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: response.message,
      guidance: response.guidance,
      technique: response.technique,
      intervention: response.intervention,
      timestamp: new Date().toISOString(),
      sessionContext: {
        stage: sessionContext.conversationStage,
        emotionsDetected: sessionContext.detectedEmotions.length,
        techniquesUsed: sessionContext.appliedTechniques.length,
        timeRemaining: Math.max(0, 1800 - timeElapsed), // 30 minutos em segundos
        sessionId: persistentSession.id // 🆕 ID da sessão persistente
      }
    });

  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}