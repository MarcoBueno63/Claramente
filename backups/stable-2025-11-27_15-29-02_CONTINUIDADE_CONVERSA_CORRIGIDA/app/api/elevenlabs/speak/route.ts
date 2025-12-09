import { NextRequest, NextResponse } from 'next/server';
import { ttsToBase64 } from '@/lib/elevenlabs';
import { detectMessageEmotion, getVoiceSettingsForEmotion } from '@/lib/emotion-detector';

export async function POST(request: NextRequest) {
  try {
    const { text, emotion } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Texto não fornecido' },
        { status: 400 }
      );
    }
    
    // Detectar emoção se não fornecida
    const detectedEmotion = emotion || detectMessageEmotion(text);
    const voiceSettings = getVoiceSettingsForEmotion(detectedEmotion);
    
    // Configurações ElevenLabs otimizadas para voz mais natural
    const elevenLabsSettings = {
      stability: 0.35,           // REDUZIDO: mais variação natural (era 0.45)
      similarity_boost: 0.80,    // AUMENTADO: mais fidelidade à voz original
      style: 0.75,               // AUMENTADO: mais expressividade (era 0.65)
      use_speaker_boost: true
    };
    
    console.log(`🎭 Gerando fala com emoção: ${detectedEmotion}`, elevenLabsSettings);
    
    // Gerar áudio
    const audioBase64 = await ttsToBase64(
      text,
      undefined, // Usar voz padrão (Bella)
      elevenLabsSettings
    );
    
    return NextResponse.json({
      success: true,
      audioBase64,
      emotion: detectedEmotion,
      settings: elevenLabsSettings
    });
    
  } catch (error) {
    console.error('❌ Erro no endpoint ElevenLabs:', error);
    
    return NextResponse.json(
      { 
        error: 'Falha ao gerar áudio',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
