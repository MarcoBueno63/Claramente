import OpenAI from "openai";
import { checkApiKeyOrThrow } from "./env-validation";
import { CLARA_SYSTEM_PROMPT } from "./prompts";

let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    const apiKey = checkApiKeyOrThrow("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
    client = new OpenAI({ apiKey });
  }
  return client;
}

type OAResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  output?: Array<{ content?: string }>;
};

// Tipos para estruturar respostas terapêuticas
export interface TherapeuticResponse {
  message: string;
  emotions: string[];
  riskLevel: 'minimal' | 'moderate' | 'high' | 'critical';
  suggestedTechniques?: string[];
  exerciseSuggestion?: string;
  needsAssessment?: boolean;
}

export interface ConversationContext {
  messages: Array<{role: 'user' | 'assistant', content: string, timestamp?: Date}>;
  sessionStartTime: Date;
  timeElapsed: number;
  identifiedEmotions: string[];
  appliedTechniques: string[];
  riskHistory: string[];
}

// Função principal para chat terapêutico
export async function generateTherapeuticResponse(
  userMessage: string, 
  context: ConversationContext,
  model: string = "gpt-4"
): Promise<TherapeuticResponse> {
  try {
    const openaiClient = getClient();
    
    // 1. Análise de risco primeiro
    const riskAssessment = await analyzeRisk(userMessage, context);
    
    if (riskAssessment.riskLevel === 'critical') {
      return {
        message: riskAssessment.response || `Percebo que você está passando por um momento muito difícil e importante buscar ajuda profissional imediata. 

🆘 **Se você está pensando em se machucar:**
- Ligue 188 (CVV - Centro de Valorização da Vida) 
- Procure o pronto-socorro mais próximo
- Entre em contato com alguém de confiança

Você não está sozinho(a) e sua vida tem valor. Há pessoas preparadas para ajudá-lo(a) neste momento.`,
        emotions: [],
        riskLevel: 'critical'
      };
    }
    
    // 2. Análise emocional e seleção de técnica
    const emotionalAnalysis = await analyzeEmotionalContext(userMessage, context);
    const selectedTechnique = await selectTechnique(emotionalAnalysis, context);
    
    // 3. Gerar resposta terapêutica contextual
    const therapeuticMessage = await generateContextualResponse(
      userMessage, 
      context, 
      emotionalAnalysis, 
      selectedTechnique
    );
    
    return {
      message: therapeuticMessage,
      emotions: emotionalAnalysis.emotions,
      riskLevel: riskAssessment.riskLevel,
      suggestedTechniques: [selectedTechnique],
      needsAssessment: shouldSuggestAssessment(emotionalAnalysis, context)
    };
    
  } catch (error) {
    console.error("Erro na resposta terapêutica:", error);
    
    // Fallback para resposta empática básica
    return {
      message: "Entendo que você está compartilhando algo importante comigo. Embora eu esteja enfrentando algumas dificuldades técnicas no momento, quero que saiba que estou aqui para apoiá-lo(a). Pode me contar um pouco mais sobre como você está se sentindo?",
      emotions: [],
      riskLevel: 'minimal'
    };
  }
}

// Análise de risco específica
async function analyzeRisk(message: string, context: ConversationContext) {
  const openaiClient = getClient();
  
  const riskPrompt = `
Analise esta mensagem quanto a indicadores de risco de autolesão ou suicídio:

Mensagem: "${message}"

Contexto da conversa: ${context.messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

Classifique como:
- minimal: Sem indicadores de risco
- moderate: Sintomas preocupantes mas sem risco imediato
- high: Sintomas severos, possível ideação sem plano
- critical: Ideação suicida clara, planos ou meios

Retorne JSON: {"riskLevel": "...", "indicators": ["..."], "response": "resposta se crítico"}`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: riskPrompt }],
      max_tokens: 300,
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Erro na análise de risco:", error);
    return { riskLevel: 'moderate', indicators: [], response: null };
  }
}

// Análise emocional contextual
async function analyzeEmotionalContext(message: string, context: ConversationContext) {
  const openaiClient = getClient();
  
  const emotionalPrompt = `
Analise o contexto emocional desta mensagem:

Mensagem atual: "${message}"

Histórico recente: ${context.messages.slice(-2).map(m => `${m.role}: ${m.content}`).join('\n')}

Identifique:
1. Emoções primárias (ansiedade, tristeza, raiva, medo, vazio, confusão)
2. Intensidade emocional (1-10)
3. Possíveis pensamentos automáticos
4. Padrões cognitivos disfuncionais presentes

Retorne JSON: {"emotions": ["..."], "intensity": 0, "automaticThoughts": ["..."], "cognitiveDistortions": ["..."]}`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: emotionalPrompt }],
      max_tokens: 200,
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Erro na análise emocional:", error);
    return { emotions: ['neutro'], intensity: 5, automaticThoughts: [], cognitiveDistortions: [] };
  }
}

// Seleção de técnica terapêutica
async function selectTechnique(emotionalAnalysis: any, context: ConversationContext): Promise<string> {
  // Lógica simples baseada nas emoções identificadas
  const { emotions, intensity } = emotionalAnalysis;
  
  if (emotions.includes('ansiedade') && intensity > 7) {
    return 'mindfulness_respiracao';
  }
  if (emotions.includes('tristeza')) {
    return 'ativacao_comportamental';
  }
  if (emotions.includes('raiva')) {
    return 'regulacao_emocional';
  }
  if (context.timeElapsed > 20 * 60) { // Últimos 10 minutos
    return 'sintese_encerramento';
  }
  
  return 'questionamento_socratico';
}

// Geração de resposta contextual
async function generateContextualResponse(
  message: string, 
  context: ConversationContext, 
  emotionalAnalysis: any, 
  technique: string
): Promise<string> {
  const openaiClient = getClient();
  
  const contextPrompt = `
${CLARA_SYSTEM_PROMPT}

CONTEXTO ATUAL:
- Tempo de sessão: ${Math.floor(context.timeElapsed / 60)} minutos de 30
- Emoções identificadas: ${emotionalAnalysis.emotions.join(', ')}
- Intensidade emocional: ${emotionalAnalysis.intensity}/10
- Técnica selecionada: ${technique}

MENSAGEM DO USUÁRIO: "${message}"

HISTÓRICO RECENTE:
${context.messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

INSTRUÇÃO:
Responda de forma terapêutica usando a técnica selecionada. Mantenha o foco na validação emocional + exploração + intervenção prática. Seja empático, faça uma pergunta poderosa e ofereça uma técnica ou exercício quando apropriado.

Máximo 200 palavras.`;

  const response = await openaiClient.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: contextPrompt }],
    max_tokens: 300,
    temperature: 0.7,
  });
  
  return response.choices[0]?.message?.content || "Entendi o que você compartilhou. Como posso ajudá-lo(a) melhor neste momento?";
}

// Determinar se deve sugerir avaliação
function shouldSuggestAssessment(emotionalAnalysis: any, context: ConversationContext): boolean {
  const { emotions, intensity } = emotionalAnalysis;
  
  // Sugerir avaliação se:
  // - Alta intensidade emocional persistente
  // - Múltiplas emoções negativas
  // - Tempo de sessão > 15 minutos sem avaliação prévia
  
  return (
    intensity > 7 || 
    emotions.length > 2 || 
    (context.timeElapsed > 15 * 60 && !context.appliedTechniques.includes('assessment'))
  );
}

// Função simplificada para compatibilidade
export async function askOpenAI(prompt: string, model: string = "gpt-4") {
  try {
    const openaiClient = getClient();
    
    const response = await openaiClient.chat.completions.create({
      model,
      messages: [
        { role: "system", content: CLARA_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    
    const reply = response.choices[0]?.message?.content || "";
    
    if (!reply) {
      throw new Error("Resposta vazia da OpenAI");
    }
    
    return reply;
  } catch (error) {
    console.error("Erro na integração OpenAI:", error);
    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      throw new Error("Chave da OpenAI não configurada. Configure OPENAI_API_KEY no arquivo .env");
    }
    throw new Error("Erro ao comunicar com a IA. Verifique sua conexão e tente novamente.");
  }
}