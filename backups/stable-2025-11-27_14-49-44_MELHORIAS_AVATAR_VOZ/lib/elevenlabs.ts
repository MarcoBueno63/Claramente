import { checkApiKeyOrThrow } from "./env-validation";

const ELEVEN_API = "https://api.elevenlabs.io/v1/text-to-speech";

// Voz feminina em português - Clara (personalizável)
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"; // Voz feminina Bella

// Configurações de voz otimizadas para som mais natural
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.45,           // Menos previsível = mais humana
  similarity_boost: 0.75,    // Evita clonagem excessiva
  style: 0.65,               // Mais expressividade emocional
  use_speaker_boost: true    // Mantém clareza
};

export async function ttsToBase64(text: string, voice = DEFAULT_VOICE_ID, customSettings?: Partial<typeof DEFAULT_VOICE_SETTINGS>) {
  try {
    const key = checkApiKeyOrThrow("ELEVENLABS_API_KEY", process.env.ELEVENLABS_API_KEY);

    const voiceSettings = { ...DEFAULT_VOICE_SETTINGS, ...customSettings };

    const url = `${ELEVEN_API}/${voice}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ 
        text,
        model_id: "eleven_turbo_v2_5",  // Modelo mais avançado e rápido
        voice_settings: voiceSettings
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error(`ElevenLabs API error: ${res.status} ${txt}`);
      throw new Error(`ElevenLabs error: ${res.status} ${txt}`);
    }

    const buffer = await res.arrayBuffer();
    const b64 = Buffer.from(buffer).toString("base64");
    
    if (!b64) {
      throw new Error("Resposta de áudio vazia do ElevenLabs");
    }
    
    return b64;
  } catch (error) {
    console.error("Erro na integração ElevenLabs:", error);
    if (error instanceof Error && error.message.includes("ELEVENLABS_API_KEY")) {
      throw new Error("Chave do ElevenLabs não configurada. Configure ELEVENLABS_API_KEY no arquivo .env");
    }
    throw error;
  }
}