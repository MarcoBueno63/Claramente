# 🧪 TESTE DE AVATAR - DIAGNÓSTICO

## Problema Atual
- Avatar estático (sem animação)
- Sem som
- Sistema não responsivo

## Possíveis Causas

### 1. useEffect não dispara
```tsx
useEffect(() => {
  if (!text && !audioUrl) return;
  startSpeaking();
}, [text, audioUrl]);
```

**Verificar**: O `text` está chegando? Console mostra logs?

### 2. speak() não executa
- ElevenLabs API pode estar falhando silenciosamente
- Web Speech API pode não ter vozes carregadas
- Áudio pode estar bloqueado pelo navegador

### 3. Canvas não renderiza
- canvasRef.current pode ser null
- Imagem pode não carregar
- Contexto pode não existir

## Solução IMEDIATA

Criar versão ULTRA SIMPLIFICADA que:
1. Recebe texto
2. Fala COM CERTEZA (Web Speech)
3. Anima COM CERTEZA (boca fake simples)
4. SEM APIs externas
5. SEM complexidade

## Teste Manual

No console do navegador:
```javascript
// Testar Web Speech API
const utterance = new SpeechSynthesisUtterance("Olá, teste de voz");
utterance.lang = 'pt-BR';
speechSynthesis.speak(utterance);

// Testar se vozes estão disponíveis
console.log(speechSynthesis.getVoices());
```
