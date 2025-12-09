"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { detectMessageEmotion, getVoiceSettingsForEmotion } from '@/lib/emotion-detector';

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const voicesLoadedRef = useRef(false);

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

  // Sintetizar fala usando Web Speech API com modulação emocional
  const speakWithWebSpeech = (textToSpeak: string) => {
    if (!window.speechSynthesis) {
      console.error('Web Speech API não suportada');
      return;
    }
    
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
        onSpeakingComplete?.();
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      onSpeakingComplete?.();
    };
    
    audio.onerror = (err) => {
      console.error('Erro ao tocar áudio:', err);
      setIsSpeaking(false);
      setError('Erro ao reproduzir áudio');
    };
  };

  // Efeito para iniciar fala quando texto muda
  useEffect(() => {
    if (!text && !audioUrl) return;
    
    const speak = async () => {
      // Prioridade: audioUrl > D-ID video > Web Speech
      if (audioUrl) {
        setMode('canvas');
        await playAudioWithLipSync(audioUrl);
      } else if (text && process.env.NEXT_PUBLIC_DID_API_KEY) {
        await generateDIDVideo(text);
      } else if (text) {
        setMode('canvas');
        speakWithWebSpeech(text);
      }
    };
    
    speak();
  }, [text, audioUrl]);

  // Renderizar avatar em canvas com boca animada
  useEffect(() => {
    if (mode !== 'canvas' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.src = avatarImage;
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar avatar base
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Desenhar boca animada por cima (se estiver falando)
        if (isSpeaking && mouthOpenness > 0) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height * 0.72; // Posição da boca
          const mouthWidth = 30;
          const mouthHeight = 5 + (mouthOpenness * 25);
          
          // Boca (tons de rosa/vermelho femininos)
          ctx.fillStyle = '#d97b8f';
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Interior da boca quando mais aberta
          if (mouthOpenness > 0.3) {
            ctx.fillStyle = '#8b4545';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + 2, mouthWidth * 0.7, mouthHeight * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Dentes quando muito aberta
          if (mouthOpenness > 0.5) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY - mouthHeight * 0.4, mouthWidth * 0.6, 3, 0, 0, Math.PI);
            ctx.fill();
          }
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    img.onerror = () => {
      console.error('Erro ao carregar imagem do avatar');
    };
  }, [mode, mouthOpenness, avatarImage, isSpeaking]);

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

  return (
    <div className={`relative ${className}`}>
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
        <div className="relative">
          <canvas 
            ref={canvasRef}
            width={300}
            height={300}
            className="w-full h-full rounded-lg"
          />
          {isSpeaking && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
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

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Falando...
        </div>
      )}
    </div>
  );
}
