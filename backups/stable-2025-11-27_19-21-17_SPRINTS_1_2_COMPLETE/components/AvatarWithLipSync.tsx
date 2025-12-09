"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { detectMessageEmotion, getVoiceSettingsForEmotion } from '@/lib/emotion-detector';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarWithLipSyncProps {
  text?: string;
  audioUrl?: string;
  onSpeakingComplete?: () => void;
  avatarImage?: string;
  className?: string;
}

type LipSyncMode = 'canvas' | 'video' | 'svg';

export default function AvatarWithLipSync({
  text,
  audioUrl,
  onSpeakingComplete,
  avatarImage = '/clara-real.jpg',
  className = ''
}: AvatarWithLipSyncProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<LipSyncMode>('canvas');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<'empathy' | 'celebration' | 'concern' | 'encouragement' | 'neutral'>('neutral');
  
  // 🎯 Posição calibrada da boca (valores ajustados pelo usuário)
  const mouthX = 0.45;  // 45% horizontal
  const mouthY = 0.60;  // 60% vertical
  const mouthSize = 0.6; // Tamanho 0.6x
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const voicesLoadedRef = useRef(false);
  const speakingRef = useRef(false); // Flag para evitar múltiplas chamadas simultâneas

  // 🎨 Estilos de overlay emocional
  const EMOTION_STYLES = {
    empathy: {
      border: '3px solid #FFB6C1',
      boxShadow: '0 0 20px rgba(255,182,193,0.5)',
      icon: '💙',
      bgGradient: 'from-pink-50 to-blue-50',
      label: 'Empatia'
    },
    celebration: {
      border: '3px solid #FFD700',
      boxShadow: '0 0 25px rgba(255,215,0,0.6)',
      icon: '🎉',
      bgGradient: 'from-yellow-50 to-orange-50',
      animation: 'pulse 1.5s ease-in-out infinite',
      label: 'Celebração'
    },
    concern: {
      border: '3px solid #FFA500',
      boxShadow: '0 0 15px rgba(255,165,0,0.4)',
      icon: '🤝',
      bgGradient: 'from-orange-50 to-red-50',
      label: 'Atenção'
    },
    encouragement: {
      border: '3px solid #32CD32',
      boxShadow: '0 0 20px rgba(50,205,50,0.5)',
      icon: '💪',
      bgGradient: 'from-green-50 to-emerald-50',
      label: 'Encorajamento'
    },
    neutral: {
      border: '2px solid #E5E7EB',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      icon: '💬',
      bgGradient: 'from-gray-50 to-slate-50',
      label: 'Conversando'
    }
  };

  // Pré-carregar vozes ao montar o componente
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
        console.log(`✅ ${voices.length} vozes carregadas`, voices.map(v => v.name));
      }
    };
    
    // Tentar carregar imediatamente
    loadVoices();
    
    // E também no evento
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // 🎥 Tentar gerar vídeo D-ID quando houver novo texto
  useEffect(() => {
    async function tryGenerateDIDVideo() {
      if (!text || text.length === 0) return;
      
      // Detectar emoção do texto
      const detectedEmotion = detectMessageEmotion(text);
      setCurrentEmotion(detectedEmotion);
      
      try {
        setIsLoading(true);
        
        // Tentar gerar vídeo D-ID
        const response = await fetch('/api/avatar/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.substring(0, 500), // Limitar tamanho
            emotion: detectedEmotion
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.talkId) {
            // Polling para aguardar vídeo
            const videoUrl = await pollForDIDVideo(data.talkId);
            if (videoUrl) {
              setVideoUrl(videoUrl);
              setMode('video');
              console.log('✅ Vídeo D-ID pronto:', videoUrl);
            } else {
              // Fallback para canvas
              setMode('canvas');
            }
          }
        } else {
          // Fallback para canvas se D-ID falhar
          setMode('canvas');
        }
      } catch (error) {
        console.log('⚠️ D-ID indisponível, usando canvas:', error);
        setMode('canvas');
      } finally {
        setIsLoading(false);
      }
    }
    
    tryGenerateDIDVideo();
  }, [text]);
  
  // Função para polling do vídeo D-ID
  async function pollForDIDVideo(talkId: string, maxAttempts = 15): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`/api/avatar/generate?talkId=${talkId}`);
        const data = await response.json();
        
        if (data.status === 'done' && data.resultUrl) {
          return data.resultUrl;
        }
        
        if (data.status === 'error') {
          console.error('Erro D-ID:', data.error);
          return null;
        }
        
        // Aguardar 2 segundos antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Polling attempt ${i + 1} failed:`, error);
      }
    }
    return null;
  }

  // Análise de áudio em tempo real para lip-sync
  const setupAudioAnalysis = useCallback((audio: HTMLAudioElement) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyserRef.current = analyser;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateMouth = () => {
      if (!analyserRef.current || !isSpeaking) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calcular média de volume para determinar abertura da boca
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const normalized = Math.min(average / 128, 1);
      
      setMouthOpenness(normalized);
      
      animationFrameRef.current = requestAnimationFrame(updateMouth);
    };
    
    updateMouth();
  }, [isSpeaking]);

  // Gerar vídeo com D-ID API
  const generateDIDVideo = async (textToSpeak: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/avatar/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: textToSpeak })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao gerar vídeo do avatar');
      }
      
      const data = await response.json();
      
      // D-ID retorna um ID, precisamos fazer polling para obter o vídeo
      if (data.result?.id) {
        await pollForVideo(data.result.id);
      }
    } catch (err) {
      console.error('Erro ao gerar vídeo D-ID:', err);
      setError('Não foi possível gerar o avatar em vídeo. Usando modo alternativo.');
      setMode('canvas'); // Fallback para modo canvas
    } finally {
      setIsLoading(false);
    }
  };

  // Polling para obter vídeo do D-ID
  const pollForVideo = async (talkId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const checkStatus = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        throw new Error('Timeout ao gerar vídeo');
      }
      
      try {
        const response = await fetch(`/api/avatar/status/${talkId}`);
        const data = await response.json();
        
        if (data.status === 'done' && data.result_url) {
          setVideoUrl(data.result_url);
          setMode('video');
        } else if (data.status === 'error') {
          throw new Error('Erro ao processar vídeo');
        } else {
          attempts++;
          setTimeout(checkStatus, 2000); // Tentar novamente em 2s
        }
      } catch (err) {
        console.error('Erro no polling:', err);
        setMode('canvas'); // Fallback
      }
    };
    
    await checkStatus();
  };

  // 🎤 SISTEMA DE FALA OTIMIZADO (ElevenLabs First)
  const speak = useCallback(async (textToSpeak: string) => {
    if (!textToSpeak) return;
    
    // Evitar múltiplas chamadas simultâneas
    if (speakingRef.current) {
      console.log('⏸️ Fala já em andamento, ignorando nova chamada');
      return;
    }
    
    speakingRef.current = true;
    
    // Limpar áudio anterior e cancelar speech synthesis
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Detectar e atualizar emoção atual
    const emotion = detectMessageEmotion(textToSpeak);
    setCurrentEmotion(emotion as any);
    setIsSpeaking(true);
    
    // 🏆 TENTATIVA 1: ElevenLabs (Voz Natural)
    try {
      console.log('🎙️ Tentando ElevenLabs...');
      
      const response = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToSpeak,
          emotion
        })
      });
      
      if (response.ok) {
        const { audioBase64 } = await response.json();
        
        if (audioBase64) {
          console.log('✅ ElevenLabs sucesso! Reproduzindo...');
          
          const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
          audioRef.current = audio;
          
          audio.onloadeddata = () => {
            setupAudioAnalysis(audio);
            audio.play();
          };
          
          audio.onended = () => {
            setIsSpeaking(false);
            setMouthOpenness(0);
            speakingRef.current = false;
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            onSpeakingComplete?.();
          };
          
          audio.onerror = (err) => {
            console.error('❌ Erro ao reproduzir áudio ElevenLabs:', err);
            speakingRef.current = false;
            fallbackToWebSpeech(textToSpeak);
          };
          
          return; // ✅ Sucesso! Não precisa fallback
        }
      }
    } catch (error) {
      console.warn('⚠️ ElevenLabs falhou, usando Web Speech:', error);
    }
    
    // 🔄 FALLBACK: Web Speech API
    fallbackToWebSpeech(textToSpeak);
  }, [onSpeakingComplete]);

  // 🔊 Fallback para Web Speech API
  const fallbackToWebSpeech = (textToSpeak: string) => {
    if (!window.speechSynthesis) {
      console.error('❌ Web Speech API não suportada');
      setIsSpeaking(false);
      return;
    }
    
    console.log('🔄 Usando Web Speech API (fallback)');
    
    // Função para criar e configurar utterance
    const createUtterance = () => {
      // Detectar emoção e obter configurações de voz apropriadas
      const emotion = detectMessageEmotion(textToSpeak);
      const voiceSettings = getVoiceSettingsForEmotion(emotion);
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-BR';
      utterance.rate = voiceSettings.speaking_rate;
      utterance.pitch = voiceSettings.pitch_shift;
      utterance.volume = 1.0;
      
      // Log da emoção detectada (útil para debugging)
      console.log(`🎭 Emoção detectada: ${emotion}, Pitch: ${voiceSettings.pitch_shift}, Rate: ${voiceSettings.speaking_rate}`);
      
      // Tentar selecionar uma voz feminina em português
      const voices = window.speechSynthesis.getVoices();
      
      // Priorizar vozes femininas explícitas
      const femaleVoice = voices.find(voice => 
        voice.lang.includes('pt') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('feminino') ||
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('luciana') ||
         voice.name.toLowerCase().includes('maria') ||
         voice.name.toLowerCase().includes('daniela') ||
         voice.name.toLowerCase().includes('fernanda'))
      ) || voices.find(voice => voice.lang.includes('pt'));
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log(`🎤 Voz selecionada: ${femaleVoice.name}`);
      } else {
        console.log(`⚠️ Nenhuma voz feminina encontrada. Usando voz padrão com pitch alto.`);
      }
      
      // Simular lip-sync baseado em eventos de fala
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onboundary = (event) => {
        // Animar boca em boundaries de palavras
        setMouthOpenness(Math.random() * 0.8 + 0.2);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
        speakingRef.current = false;
        onSpeakingComplete?.();
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
        speakingRef.current = false;
      };
      
      return utterance;
    };
    
    // Garantir que vozes estão carregadas antes de falar
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0 && !voicesLoadedRef.current) {
      // Se vozes não carregadas, aguardar evento uma única vez
      const handler = () => {
        const utterance = createUtterance();
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.onvoiceschanged = null;
      };
      window.speechSynthesis.onvoiceschanged = handler;
    } else {
      // Vozes já carregadas, falar imediatamente
      const utterance = createUtterance();
      window.speechSynthesis.speak(utterance);
    }
  };

  // Tocar áudio e fazer lip-sync
  const playAudioWithLipSync = async (url: string) => {
    // Limpar áudio anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.onloadeddata = () => {
      setIsSpeaking(true);
      setupAudioAnalysis(audio);
      audio.play();
    };
    
    audio.onended = () => {
      setIsSpeaking(false);
      setMouthOpenness(0);
      speakingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      onSpeakingComplete?.();
    };
    
    audio.onerror = (err) => {
      console.error('Erro ao tocar áudio:', err);
      setIsSpeaking(false);
      speakingRef.current = false;
      setError('Erro ao reproduzir áudio');
    };
  };

  // Efeito para iniciar fala quando texto muda
  useEffect(() => {
    console.log('👂 Avatar recebeu props:', { 
      hasText: !!text, 
      textLength: text?.length || 0,
      textPreview: text?.substring(0, 30),
      hasAudio: !!audioUrl,
      isSpeakingNow: speakingRef.current 
    });
    
    if (!text && !audioUrl) return;
    
    const startSpeaking = async () => {
      if (audioUrl) {
        // Áudio externo fornecido
        console.log('🎵 Iniciando com áudio URL');
        setMode('canvas');
        await playAudioWithLipSync(audioUrl);
      } else if (text) {
        // Usar sistema de fala otimizado (ElevenLabs first)
        console.log('🎤 Iniciando com texto:', text.substring(0, 50));
        setMode('canvas');
        await speak(text);
      }
    };
    
    startSpeaking();
    
    // Cleanup: parar fala quando componente desmontar ou texto mudar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      speakingRef.current = false;
      setIsSpeaking(false);
      setMouthOpenness(0);
    };
  }, [text, audioUrl]); // Removido 'speak' da dependência

  // 🎯 CONFIGURAÇÃO PRECISA DA BOCA (medida na foto clara-real.jpg)
  const MOUTH_CONFIG = {
    centerX: 0.50,        // 50% horizontal (centro)
    centerY: 0.76,        // 76% vertical (posição ajustada para foto real)
    widthRatio: 0.10,     // 10% da largura do canvas
    maxHeightRatio: 0.06  // 6% da altura do canvas quando totalmente aberta
  };

  // Renderizar avatar com boca animada sincronizada
  useEffect(() => {
    if (mode !== 'canvas' || !canvasRef.current) {
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.src = avatarImage;
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const animate = () => {
        // Limpar e redesenhar a imagem base
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Coordenadas ajustáveis da boca
        const mouthCenterX = canvas.width * mouthX;
        const mouthCenterY = canvas.height * mouthY;
        const mouthBaseWidth = canvas.width * 0.12 * mouthSize;
        const mouthBaseHeight = canvas.height * 0.015 * mouthSize;
        
        // Apagar a boca original com cor de pele
        ctx.fillStyle = '#f5c4b0'; // Tom de pele (ajustar se necessário)
        ctx.beginPath();
        ctx.ellipse(mouthCenterX, mouthCenterY, mouthBaseWidth * 1.2, mouthBaseHeight * 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar boca animada
        if (isSpeaking) {
          const openness = mouthOpenness;
          const mouthWidth = mouthBaseWidth;
          const mouthHeight = mouthBaseHeight + (openness * canvas.height * 0.04);
          
          // Lábios externos
          ctx.fillStyle = '#c97276';
          ctx.beginPath();
          ctx.ellipse(mouthCenterX, mouthCenterY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Interior da boca (quando aberta)
          if (openness > 0.2) {
            const gradient = ctx.createRadialGradient(
              mouthCenterX, mouthCenterY, 0,
              mouthCenterX, mouthCenterY, mouthWidth * 0.8
            );
            gradient.addColorStop(0, '#4a2020');
            gradient.addColorStop(1, '#1a0a0a');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(mouthCenterX, mouthCenterY, mouthWidth * 0.7, mouthHeight * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Brilho labial
          ctx.fillStyle = 'rgba(255, 200, 200, 0.3)';
          ctx.beginPath();
          ctx.ellipse(mouthCenterX, mouthCenterY - mouthHeight * 0.2, mouthWidth * 0.6, mouthHeight * 0.4, 0, 0, Math.PI);
          ctx.fill();
        } else {
          // Boca fechada
          ctx.fillStyle = '#c97276';
          ctx.beginPath();
          ctx.ellipse(mouthCenterX, mouthCenterY, mouthBaseWidth, mouthBaseHeight, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Linha central dos lábios
          ctx.strokeStyle = '#a85f63';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(mouthCenterX - mouthBaseWidth, mouthCenterY);
          ctx.lineTo(mouthCenterX + mouthBaseWidth, mouthCenterY);
          ctx.stroke();
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    img.onerror = () => {
      console.error('Erro ao carregar imagem do avatar');
    };
  }, [mode, avatarImage, isSpeaking, mouthOpenness]);

  // Modo SVG (usa imagem externa realista)
  const renderSVGAvatar = () => (
    <div className="relative w-full h-full">
      <img
        src={`${avatarImage}?t=${Date.now()}`}
        alt="Clara - Assistente Terapêutica"
        className={`w-full h-full object-cover rounded-full ${className}`}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      />
      {/* Indicador de fala */}
      {isSpeaking && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </div>
  );

  const emotionStyle = EMOTION_STYLES[currentEmotion];

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Container com overlay emocional */}
      <motion.div 
        className={`relative rounded-lg overflow-hidden transition-all duration-500 bg-gradient-to-br ${emotionStyle.bgGradient}`}
        style={{
          border: emotionStyle.border,
          boxShadow: emotionStyle.boxShadow,
          animation: (emotionStyle as any).animation || 'none'
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Ícone de emoção */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentEmotion}
            className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md flex items-center gap-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xl">{emotionStyle.icon}</span>
            <span className="text-xs font-medium text-gray-700">{emotionStyle.label}</span>
          </motion.div>
        </AnimatePresence>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Gerando avatar...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-2 left-2 right-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-xs z-10">
          {error}
        </div>
      )}

      {/* Video mode (D-ID) */}
      {mode === 'video' && videoUrl && (
        <video 
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={false}
          className="w-full h-full rounded-lg object-cover"
          onEnded={onSpeakingComplete}
        />
      )}

      {/* Canvas mode (real-time lip sync) */}
      {mode === 'canvas' && (
        <div className="relative w-full h-full">
          <canvas 
            ref={canvasRef}
            width={300}
            height={300}
            className="w-full h-full rounded-lg"
            style={{ display: 'block' }}
          />
        </div>
      )}

      {/* SVG mode (fallback) */}
      {mode === 'svg' && renderSVGAvatar()}

      {/* Controls */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={() => setMode('canvas')}
          className={`px-2 py-1 rounded text-xs ${mode === 'canvas' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          title="Modo Canvas"
        >
          🎨
        </button>
        <button
          onClick={() => setMode('svg')}
          className={`px-2 py-1 rounded text-xs ${mode === 'svg' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          title="Modo SVG"
        >
          ⚡
        </button>
        {process.env.NEXT_PUBLIC_DID_API_KEY && (
          <button
            onClick={() => text && generateDIDVideo(text)}
            className={`px-2 py-1 rounded text-xs ${mode === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            title="Modo Vídeo (D-ID)"
            disabled={isLoading}
          >
            🎥
          </button>
        )}
      </div>

      </motion.div> {/* Fim do container com overlay emocional */}
    </motion.div>
  );
}
