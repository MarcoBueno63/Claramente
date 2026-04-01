import { checkApiKeyOrThrow } from "./env-validation";

const ELEVEN_API = "https://api.elevenlabs.io/v1/text-to-speech";

export async function ttsToBase64(text: string, voice = "alloy") {
  try {
    const key = checkApiKeyOrThrow("ELEVENLABS_API_KEY", process.env.ELEVENLABS_API_KEY);

    const url = `${ELEVEN_API}/${voice}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ text }),
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