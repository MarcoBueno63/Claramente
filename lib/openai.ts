import OpenAI from "openai";
import { checkApiKeyOrThrow } from "./env-validation";

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

export async function askOpenAI(prompt: string, model: string = "gpt-3.5-turbo") {
  try {
    const openaiClient = getClient();
    
    const response = await openaiClient.chat.completions.create({
      model,
      messages: [
        { 
          role: "system", 
          content: "Você é Clara, uma assistente de terapia empática e profissional. Responda de forma acolhedora e terapêutica." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.7,
    });
    
    const r = response as unknown as OAResponse;
    const reply = r.choices?.[0]?.message?.content ?? r.output?.[0]?.content ?? "";
    
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