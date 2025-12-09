/**
 * Sistema de Detecção de Emoção em Mensagens
 * Analisa o conteúdo textual para determinar o tom emocional apropriado
 */

export type EmotionType = 'empathy' | 'encouragement' | 'neutral' | 'celebration' | 'concern';

export interface VoiceSettings {
  stability: number;
  style: number;
  speaking_rate: number;
  pitch_shift: number;
}

/**
 * Detecta a emoção predominante em uma mensagem de texto
 */
export function detectMessageEmotion(text: string): EmotionType {
  const lowerText = text.toLowerCase();
  
  // Empatia - mensagens de compreensão e validação
  const empathyPatterns = [
    /entendo/i,
    /compreendo/i,
    /é difícil/i,
    /deve ser complicado/i,
    /sinto muito/i,
    /válido/i,
    /normal sentir/i,
    /faz sentido/i,
    /reconheço/i
  ];
  
  if (empathyPatterns.some(pattern => pattern.test(lowerText))) {
    return 'empathy';
  }
  
  // Encorajamento - mensagens motivacionais
  const encouragementPatterns = [
    /você consegue/i,
    /vamos juntos/i,
    /pode fazer/i,
    /parabéns/i,
    /ótimo progresso/i,
    /continue assim/i,
    /está indo bem/i,
    /orgulho/i,
    /força/i,
    /capaz/i
  ];
  
  if (encouragementPatterns.some(pattern => pattern.test(lowerText))) {
    return 'encouragement';
  }
  
  // Celebração - conquistas e vitórias
  const celebrationPatterns = [
    /excelente/i,
    /incrível/i,
    /maravilhoso/i,
    /muito bem/i,
    /perfeito/i,
    /fantástico/i,
    /sucesso/i,
    /conquista/i,
    /alcançou/i
  ];
  
  if (celebrationPatterns.some(pattern => pattern.test(lowerText))) {
    return 'celebration';
  }
  
  // Preocupação - situações que requerem atenção especial
  const concernPatterns = [
    /preocup/i,
    /crise/i,
    /emergência/i,
    /risco/i,
    /urgente/i,
    /grave/i,
    /sério/i,
    /atenção/i,
    /cuidado/i
  ];
  
  if (concernPatterns.some(pattern => pattern.test(lowerText))) {
    return 'concern';
  }
  
  return 'neutral';
}

/**
 * Retorna as configurações de voz apropriadas para cada emoção
 */
export function getVoiceSettingsForEmotion(emotion: EmotionType): VoiceSettings {
  const settings: Record<EmotionType, VoiceSettings> = {
    // Empatia: voz mais suave e lenta, transmitindo calma e compreensão
    empathy: {
      stability: 0.5,
      style: 0.5,
      speaking_rate: 0.9,  // Mais devagar
      pitch_shift: 1.5      // Tom feminino suave (aumentado de 1.2)
    },
    
    // Encorajamento: voz animada e confiante
    encouragement: {
      stability: 0.4,
      style: 0.7,
      speaking_rate: 1.0,   // Velocidade normal
      pitch_shift: 1.6      // Tom feminino animado (aumentado de 1.35)
    },
    
    // Celebração: voz alegre e energética
    celebration: {
      stability: 0.3,
      style: 0.8,
      speaking_rate: 1.05,  // Ligeiramente mais rápida
      pitch_shift: 1.7      // Tom feminino alto (aumentado de 1.4)
    },
    
    // Preocupação: voz séria e focada
    concern: {
      stability: 0.6,
      style: 0.4,
      speaking_rate: 0.95,  // Um pouco mais lenta
      pitch_shift: 1.5      // Tom feminino sério (aumentado de 1.25)
    },
    
    // Neutro: configuração balanceada
    neutral: {
      stability: 0.45,
      style: 0.6,
      speaking_rate: 1.0,
      pitch_shift: 1.6      // Tom feminino neutro (aumentado de 1.3)
    }
  };
  
  return settings[emotion];
}

/**
 * Gera descrição textual da emoção (útil para debugging)
 */
export function getEmotionDescription(emotion: EmotionType): string {
  const descriptions: Record<EmotionType, string> = {
    empathy: 'Tom empático e compreensivo',
    encouragement: 'Tom motivacional e encorajador',
    celebration: 'Tom celebratório e alegre',
    concern: 'Tom sério e atento',
    neutral: 'Tom neutro e equilibrado'
  };
  
  return descriptions[emotion];
}

/**
 * Adiciona marcações SSML para prosódia natural
 */
export function addNaturalProsody(text: string, emotion: EmotionType): string {
  let enhanced = text;
  
  // Adiciona pausas em pontuação
  enhanced = enhanced
    .replace(/\./g, '.<break time="400ms"/>')
    .replace(/,/g, ',<break time="200ms"/>')
    .replace(/\?/g, '?<break time="500ms"/>')
    .replace(/!/g, '!<break time="450ms"/>');
  
  // Ênfase em palavras-chave terapêuticas
  const emphasisWords = [
    'importante', 'essencial', 'fundamental', 'sempre', 'nunca',
    'você', 'seu', 'sua', 'sentir', 'pensar', 'agir'
  ];
  
  emphasisWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    enhanced = enhanced.replace(regex, match => 
      `<emphasis level="moderate">${match}</emphasis>`
    );
  });
  
  // Ajusta prosódia baseado na emoção
  if (emotion === 'empathy') {
    // Tom mais suave em frases empáticas
    enhanced = enhanced.replace(
      /(Eu entendo|Compreendo|Isso é difícil|Você não está sozinho)/gi,
      '<prosody rate="slow" pitch="-5%">$1</prosody>'
    );
  } else if (emotion === 'celebration') {
    // Tom mais animado em celebrações
    enhanced = enhanced.replace(
      /(Parabéns|Excelente|Muito bem|Fantástico)/gi,
      '<prosody rate="fast" pitch="+10%">$1</prosody>'
    );
  }
  
  return `<speak>${enhanced}</speak>`;
}
