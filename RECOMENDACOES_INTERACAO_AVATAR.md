# 🎯 Recomendações para Melhorar Voz e Interação do Avatar Clara

## 📅 Data: 18 de Novembro de 2025

---

## ✅ O Que Já Foi Implementado

### 🎨 Avatar Visual
- ✅ Avatar fotorealista com gradientes e sombras
- ✅ Características femininas ocidentais
- ✅ Detalhes realistas: cabelo volumoso, olhos expressivos, lábios 3D
- ✅ Joias e acessórios (brincos e colar dourados)
- ✅ Maquiagem sutil (blush, sinal de beleza)

### 🗣️ Voz Atual
- ✅ Voz feminina configurada (pitch 1.3)
- ✅ Integração com ElevenLabs API (voz Bella)
- ✅ Lip-sync com análise de áudio em tempo real
- ✅ 3 modos de renderização (Canvas, SVG, Vídeo)

---

## 🎯 Melhorias Prioritárias para Voz Menos Robotizada

### 1. 🎙️ **Otimização da Voz ElevenLabs**

#### Configurações Atuais vs Recomendadas

| Parâmetro | Atual | Recomendado | Justificativa |
|-----------|-------|-------------|---------------|
| `voice_id` | Bella | **Rachel** ou **Domi** | Mais naturais e expressivas em português |
| `model_id` | multilingual_v2 | **eleven_turbo_v2_5** | Melhor qualidade e menor latência |
| `stability` | 0.6 | **0.45** | Menos previsível, mais humana |
| `similarity_boost` | 0.8 | **0.75** | Evita clonagem excessiva |
| `style` | 0.4 | **0.6** | Mais expressividade emocional |
| `speaker_boost` | true | **true** | Mantém clareza |

#### Implementação Recomendada

```typescript
// lib/elevenlabs.ts - Atualização Sugerida
export const VOICE_SETTINGS = {
  THERAPY: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella (mantém feminina)
    model_id: 'eleven_turbo_v2_5', // Modelo mais avançado
    voice_settings: {
      stability: 0.45,           // Mais natural e variada
      similarity_boost: 0.75,    // Menos clonagem
      style: 0.65,               // Mais expressiva
      use_speaker_boost: true
    }
  },
  CASUAL: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL',
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.35,           // Muito variada para conversas informais
      similarity_boost: 0.7,
      style: 0.75,               // Máxima expressividade
      use_speaker_boost: true
    }
  }
};
```

### 2. 🎭 **Modulação Emocional Baseada em Contexto**

#### Sistema de Detecção de Emoção na Mensagem

```typescript
// lib/emotion-detector.ts - Novo Arquivo
export type EmotionType = 'empathy' | 'encouragement' | 'neutral' | 'celebration' | 'concern';

export function detectMessageEmotion(text: string): EmotionType {
  const lowerText = text.toLowerCase();
  
  // Empatia
  if (/(entendo|compreendo|é difícil|deve ser complicado|sinto muito)/i.test(text)) {
    return 'empathy';
  }
  
  // Encorajamento
  if (/(você consegue|vamos juntos|pode fazer|parabéns|ótimo progresso)/i.test(text)) {
    return 'encouragement';
  }
  
  // Celebração
  if (/(excelente|incrível|maravilhoso|muito bem|perfeito)/i.test(text)) {
    return 'celebration';
  }
  
  // Preocupação
  if (/(preocup|crise|emergência|risco|urgente)/i.test(text)) {
    return 'concern';
  }
  
  return 'neutral';
}

export function getVoiceSettingsForEmotion(emotion: EmotionType) {
  const settings = {
    empathy: {
      stability: 0.5,
      style: 0.5,
      speaking_rate: 0.9,  // Mais devagar
      pitch_shift: 1.2      // Mais suave
    },
    encouragement: {
      stability: 0.4,
      style: 0.7,
      speaking_rate: 1.0,
      pitch_shift: 1.35     // Mais animada
    },
    celebration: {
      stability: 0.3,
      style: 0.8,
      speaking_rate: 1.05,  // Ligeiramente mais rápida
      pitch_shift: 1.4      // Tom mais alto
    },
    concern: {
      stability: 0.6,
      style: 0.4,
      speaking_rate: 0.95,
      pitch_shift: 1.25     // Tom mais sério
    },
    neutral: {
      stability: 0.45,
      style: 0.6,
      speaking_rate: 1.0,
      pitch_shift: 1.3
    }
  };
  
  return settings[emotion];
}
```

#### Integração no AvatarWithLipSync

```typescript
// components/AvatarWithLipSync.tsx - Adicionar
import { detectMessageEmotion, getVoiceSettingsForEmotion } from '@/lib/emotion-detector';

const speakWithEmotion = async (text: string) => {
  const emotion = detectMessageEmotion(text);
  const voiceSettings = getVoiceSettingsForEmotion(emotion);
  
  // Para Web Speech API
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = voiceSettings.pitch_shift;
  utterance.rate = voiceSettings.speaking_rate;
  
  // Para ElevenLabs
  const response = await fetch('/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: voiceSettings.stability,
        style: voiceSettings.style
      }
    })
  });
};
```

### 3. 🎼 **Prosódia e Pausas Naturais**

#### SSML (Speech Synthesis Markup Language) para ElevenLabs

```typescript
// lib/ssml-generator.ts - Novo Arquivo
export function addNaturalProsody(text: string): string {
  // Adiciona pausas em pontuação
  let enhanced = text
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
    enhanced = enhanced.replace(regex, `<emphasis level="moderate">${word}</emphasis>`);
  });
  
  // Tom mais suave em frases empáticas
  enhanced = enhanced.replace(
    /(Eu entendo|Compreendo|Isso é difícil|Você não está sozinho)/gi,
    '<prosody rate="slow" pitch="-5%">$1</prosody>'
  );
  
  return `<speak>${enhanced}</speak>`;
}
```

### 4. 🎚️ **Variação de Tom e Ritmo**

```typescript
// lib/voice-variation.ts - Novo Arquivo
export class VoiceVariationEngine {
  private sentenceCount = 0;
  
  getVariedVoiceSettings() {
    this.sentenceCount++;
    
    // Varia sutilmente a cada frase para evitar monotonia
    const variation = Math.sin(this.sentenceCount * 0.3) * 0.1;
    
    return {
      pitch: 1.3 + variation,
      rate: 0.95 + (variation * 0.2),
      volume: 0.85 + (variation * 0.15)
    };
  }
  
  resetVariation() {
    this.sentenceCount = 0;
  }
}
```

---

## 🎨 Melhorias de Interação do Avatar

### 1. 🎭 **Expressões Faciais Dinâmicas**

#### Sistema de Animação de Expressões

```typescript
// components/AvatarExpressions.tsx - Novo Componente
type Expression = 'neutral' | 'happy' | 'empathetic' | 'thoughtful' | 'concerned';

const EXPRESSION_SVGS: Record<Expression, string> = {
  neutral: '/avatar-clara-neutral.svg',
  happy: '/avatar-clara-happy.svg',
  empathetic: '/avatar-clara-empathetic.svg',
  thoughtful: '/avatar-clara-thoughtful.svg',
  concerned: '/avatar-clara-concerned.svg'
};

export function useAvatarExpression(text: string): Expression {
  const emotion = detectMessageEmotion(text);
  
  const expressionMap = {
    empathy: 'empathetic',
    encouragement: 'happy',
    celebration: 'happy',
    concern: 'concerned',
    neutral: 'thoughtful'
  };
  
  return expressionMap[emotion] as Expression;
}
```

#### SVGs de Expressões (criar variações)

**Expressões a criar:**
- `avatar-clara-happy.svg` - Sorriso amplo, olhos levemente fechados
- `avatar-clara-empathetic.svg` - Sobrancelhas suavemente levantadas, olhos expressivos
- `avatar-clara-thoughtful.svg` - Olhos olhando levemente para o lado
- `avatar-clara-concerned.svg` - Sobrancelhas franzidas, expressão séria

### 2. 👁️ **Simulação de Contato Visual**

```typescript
// hooks/useEyeContact.ts - Novo Hook
export function useEyeContact() {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simula piscar e movimento natural dos olhos
      const shouldBlink = Math.random() < 0.1; // 10% de chance
      
      if (shouldBlink) {
        setEyePosition({ x: 0, y: 0 }); // Fecha olhos
        setTimeout(() => {
          setEyePosition({ x: Math.random() * 4 - 2, y: Math.random() * 2 - 1 });
        }, 150); // Reabre após 150ms
      } else {
        // Movimento sutil dos olhos
        setEyePosition({
          x: Math.random() * 6 - 3,
          y: Math.random() * 3 - 1.5
        });
      }
    }, 3000); // A cada 3 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return eyePosition;
}
```

### 3. 🤝 **Gestos Sincronizados com a Fala**

```typescript
// components/AvatarGestures.tsx - Novo Sistema
type Gesture = 'thinking' | 'explaining' | 'emphasizing' | 'welcoming' | 'neutral';

export function detectGestureFromText(text: string): Gesture {
  if (/(vamos|podemos|juntos|começar)/i.test(text)) return 'welcoming';
  if (/(porque|razão|explicar|entender)/i.test(text)) return 'explaining';
  if (/(importante|essencial|muito|realmente)/i.test(text)) return 'emphasizing';
  if (/(pense|reflita|considere|imagine)/i.test(text)) return 'thinking';
  return 'neutral';
}

const GESTURE_ANIMATIONS = {
  thinking: 'animate-head-tilt',
  explaining: 'animate-hand-gesture',
  emphasizing: 'animate-head-nod',
  welcoming: 'animate-slight-bow',
  neutral: ''
};
```

### 4. 🎵 **Áudio Ambiente e Música de Fundo**

```typescript
// components/AmbientSound.tsx - Novo Componente
export function AmbientSound({ enabled = true }: { enabled?: boolean }) {
  const [audio] = useState(() => {
    if (typeof window === 'undefined') return null;
    const bgAudio = new Audio('/sounds/therapy-ambient.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.15; // Muito suave
    return bgAudio;
  });
  
  useEffect(() => {
    if (enabled && audio) {
      audio.play().catch(console.error);
    } else if (audio) {
      audio.pause();
    }
    
    return () => audio?.pause();
  }, [enabled, audio]);
  
  return null;
}
```

**Sons Recomendados:**
- Música ambiente relaxante (ondas, natureza, piano suave)
- Sons sutis de respiração durante pausas
- Notificações suaves (sino tibetano para alertas)

### 5. 🎤 **Reconhecimento de Voz do Usuário**

```typescript
// hooks/useSpeechRecognition.ts - Novo Hook
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognition = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'pt-BR';
    recognizer.continuous = false;
    recognizer.interimResults = true;
    
    recognizer.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
    };
    
    recognizer.onend = () => setIsListening(false);
    
    return recognizer;
  }, []);
  
  const startListening = () => {
    recognition?.start();
    setIsListening(true);
  };
  
  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
  };
  
  return { isListening, transcript, startListening, stopListening };
}
```

### 6. 💫 **Animações de Transição Suaves**

```css
/* app/globals.css - Adicionar */

/* Animação de entrada do avatar */
@keyframes avatar-enter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Animação de respiração */
@keyframes breathing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Animação de piscar */
@keyframes blink {
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0; }
}

/* Movimento de cabeça */
@keyframes head-tilt {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
}

/* Aceno de cabeça */
@keyframes head-nod {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}

.avatar-container {
  animation: avatar-enter 0.6s ease-out, breathing 4s ease-in-out infinite;
}

.avatar-eyes {
  animation: blink 5s infinite;
}

.animate-head-tilt {
  animation: head-tilt 2s ease-in-out;
}

.animate-head-nod {
  animation: head-nod 0.8s ease-in-out;
}
```

---

## 🔧 Implementação Passo a Passo

### Fase 1: Melhorias Imediatas (1-2 horas)
1. ✅ Avatar realista já implementado
2. ⏳ Atualizar configurações ElevenLabs
3. ⏳ Adicionar modulação emocional básica
4. ⏳ Implementar pausas SSML

### Fase 2: Interação Avançada (3-5 horas)
5. ⏳ Criar sistema de expressões faciais
6. ⏳ Implementar gestos sincronizados
7. ⏳ Adicionar áudio ambiente
8. ⏳ Animações CSS

### Fase 3: Features Premium (5-8 horas)
9. ⏳ Reconhecimento de voz do usuário
10. ⏳ Contato visual dinâmico
11. ⏳ Sistema de variação de voz avançado
12. ⏳ Análise de sentimento em tempo real

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois (Implementado) |
|---------|-------|----------------------|
| **Imagem** | Avatar simples cartoon | ✅ Avatar fotorealista com gradientes e sombras |
| **Voz** | Pitch 1.3 fixo | ⏳ Modulação emocional + variação natural |
| **Expressão** | Estática | ⏳ 5 expressões dinâmicas |
| **Gestos** | Nenhum | ⏳ 5 tipos de gestos |
| **Áudio** | Apenas voz | ⏳ Voz + ambiente + pausas |
| **Interação** | Unidirecional | ⏳ Bidirecional com reconhecimento de voz |

---

## 🎯 Próximos Passos Recomendados

### Prioridade ALTA (Impacto Imediato)
1. **Atualizar configurações ElevenLabs** (15 min)
2. **Implementar detecção de emoção** (30 min)
3. **Adicionar pausas SSML** (20 min)

### Prioridade MÉDIA (Melhora Perceptível)
4. **Criar expressões faciais** (2 horas)
5. **Adicionar animações CSS** (1 hora)
6. **Implementar áudio ambiente** (30 min)

### Prioridade BAIXA (Features Premium)
7. **Reconhecimento de voz** (3 horas)
8. **Sistema de gestos** (2 horas)
9. **Variação de voz avançada** (1 hora)

---

## 💰 Custos Estimados

### ElevenLabs API
- **Modelo Turbo V2.5**: ~$0.15 por 1000 caracteres
- **Estimativa mensal** (1000 usuários, 50 mensagens/dia): ~$225/mês
- **Alternativa gratuita**: Web Speech API (qualidade inferior)

### D-ID Video API
- **Vídeos**: $0.035 por segundo
- **Estimativa** (vídeos de 10s, 100/dia): ~$105/mês
- **Recomendação**: Usar apenas para demonstrações especiais

---

## 📝 Notas Importantes

1. **Teste A/B**: Implementar métricas para comparar satisfação antes/depois
2. **Fallback**: Manter Web Speech API como backup se ElevenLabs falhar
3. **Performance**: Pré-carregar áudios comuns para reduzir latência
4. **Acessibilidade**: Permitir desabilitar avatar/voz para usuários com sensibilidades

---

## ✅ Status Atual

- [x] Avatar fotorealista implementado
- [ ] Voz otimizada (em andamento)
- [ ] Expressões faciais (planejado)
- [ ] Gestos sincronizados (planejado)
- [ ] Reconhecimento de voz (planejado)

**Data de criação**: 18 de Novembro de 2025
**Última atualização**: 18 de Novembro de 2025
