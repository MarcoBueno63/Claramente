// lib/did-avatar.ts - D-ID Avatar API Integration
// Gera vídeos realistas com expressões faciais usando D-ID API

interface DIDConfig {
  apiKey: string;
  apiUrl: string;
}

interface DIDTalkRequest {
  script: {
    type: 'text' | 'audio';
    input: string;
    provider?: {
      type: string;
      voice_id: string;
    };
  };
  source_url: string;
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    driver_expressions?: {
      expressions: Array<{
        start_frame: number;
        expression: string;
        intensity: number;
      }>;
    };
  };
}

interface DIDTalkResponse {
  id: string;
  status: 'created' | 'started' | 'done' | 'error';
  result_url?: string;
  error?: string;
}

// Mapeamento de emoções para expressões D-ID
export const EMOTION_EXPRESSIONS = {
  empathy: {
    expression: 'serious',
    intensity: 0.7,
    description: 'Expressão empática e atenciosa'
  },
  celebration: {
    expression: 'happy',
    intensity: 1.0,
    description: 'Feliz e celebrando conquista'
  },
  concern: {
    expression: 'sad',
    intensity: 0.6,
    description: 'Preocupada e cuidadosa'
  },
  encouragement: {
    expression: 'happy',
    intensity: 0.8,
    description: 'Encorajadora e motivadora'
  },
  neutral: {
    expression: 'neutral',
    intensity: 0.5,
    description: 'Neutra e profissional'
  },
  surprise: {
    expression: 'surprise',
    intensity: 0.9,
    description: 'Surpresa positiva'
  },
  thinking: {
    expression: 'serious',
    intensity: 0.5,
    description: 'Pensativa e reflexiva'
  }
} as const;

export type EmotionType = keyof typeof EMOTION_EXPRESSIONS;

class DIDService {
  private config: DIDConfig;
  private cache: Map<string, string> = new Map();

  constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_DID_API_KEY || '',
      apiUrl: 'https://api.d-id.com'
    };
  }

  /**
   * Gera um vídeo de avatar falando com expressão facial
   */
  async generateAvatarVideo(
    text: string,
    emotion: EmotionType = 'neutral',
    sourceImageUrl: string = '/clara-real.jpg'
  ): Promise<string | null> {
    try {
      // Verificar cache
      const cacheKey = `${text}-${emotion}`;
      if (this.cache.has(cacheKey)) {
        console.log('🎥 Vídeo D-ID encontrado no cache');
        return this.cache.get(cacheKey)!;
      }

      // Verificar se API key está configurada
      if (!this.config.apiKey) {
        console.warn('⚠️ D-ID API key não configurada, usando fallback');
        return null;
      }

      const emotionConfig = EMOTION_EXPRESSIONS[emotion];

      // Criar request para D-ID
      const requestBody: DIDTalkRequest = {
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: 'pt-BR-FranciscaNeural' // Voz feminina brasileira
          }
        },
        source_url: sourceImageUrl,
        config: {
          fluent: true,
          pad_audio: 0,
          driver_expressions: {
            expressions: [
              {
                start_frame: 0,
                expression: emotionConfig.expression,
                intensity: emotionConfig.intensity
              }
            ]
          }
        }
      };

      // Iniciar geração do vídeo
      const createResponse = await fetch(`${this.config.apiUrl}/talks`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!createResponse.ok) {
        throw new Error(`D-ID API error: ${createResponse.statusText}`);
      }

      const createData: DIDTalkResponse = await createResponse.json();
      const talkId = createData.id;

      console.log(`🎬 D-ID talk iniciado: ${talkId} (${emotionConfig.description})`);

      // Polling para aguardar conclusão
      const videoUrl = await this.pollForVideo(talkId);

      if (videoUrl) {
        this.cache.set(cacheKey, videoUrl);
        console.log('✅ Vídeo D-ID gerado com sucesso');
      }

      return videoUrl;
    } catch (error) {
      console.error('❌ Erro ao gerar vídeo D-ID:', error);
      return null;
    }
  }

  /**
   * Polling para aguardar conclusão do vídeo
   */
  private async pollForVideo(talkId: string, maxAttempts = 30): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`${this.config.apiUrl}/talks/${talkId}`, {
          headers: {
            'Authorization': `Basic ${this.config.apiKey}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to get talk status: ${response.statusText}`);
        }

        const data: DIDTalkResponse = await response.json();

        if (data.status === 'done' && data.result_url) {
          return data.result_url;
        }

        if (data.status === 'error') {
          throw new Error(`Video generation failed: ${data.error}`);
        }

        // Aguardar 2 segundos antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Polling attempt ${i + 1} failed:`, error);
      }
    }

    console.error('❌ Timeout aguardando vídeo D-ID');
    return null;
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache D-ID limpo');
  }

  /**
   * Detectar emoção do texto (simples análise de palavras-chave)
   */
  static detectEmotionFromText(text: string): EmotionType {
    const lowerText = text.toLowerCase();

    // Palavras de celebração
    if (/parabéns|ótimo|excelente|perfeito|incrível|conquista|sucesso/i.test(lowerText)) {
      return 'celebration';
    }

    // Palavras de preocupação
    if (/preocup|difícil|problema|crise|ansiedade|medo/i.test(lowerText)) {
      return 'concern';
    }

    // Palavras de encorajamento
    if (/você consegue|vamos|juntos|força|coragem|pode/i.test(lowerText)) {
      return 'encouragement';
    }

    // Palavras de empatia
    if (/entendo|compreendo|sinto|percebo|validado/i.test(lowerText)) {
      return 'empathy';
    }

    // Palavras de surpresa
    if (/uau|nossa|incrível|surpreendente/i.test(lowerText)) {
      return 'surprise';
    }

    // Palavras pensativas
    if (/vamos refletir|pensar|analisar|considerar/i.test(lowerText)) {
      return 'thinking';
    }

    return 'neutral';
  }
}

// Exportar instância singleton
export const didService = new DIDService();

// Helper function para uso em componentes
export async function generateAvatarSpeech(
  text: string,
  autoDetectEmotion: boolean = true
): Promise<string | null> {
  const emotion = autoDetectEmotion 
    ? DIDService.detectEmotionFromText(text)
    : 'neutral';

  return didService.generateAvatarVideo(text, emotion);
}
