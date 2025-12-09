type LipSyncMode = 'canvas' | 'video' | 'svg';
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { detectMessageEmotion, getVoiceSettingsForEmotion } from '@/lib/emotion-detector';
import { motion, AnimatePresence } from 'framer-motion';

// Estilos emocionais para overlay e ícones
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

interface AvatarWithLipSyncProps {
  text?: string;
  audioUrl?: string;
  onSpeakingComplete?: () => void;
  avatarImage?: string;

  className?: string;
}

// Removido tipo duplicado

// Removido tipo duplicado

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const voicesLoadedRef = useRef(false);
  const speakingRef = useRef(false);

  // Função para análise de áudio e animação da boca
  const setupAudioAnalysis = useCallback((audio: HTMLAudioElement) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    function updateMouth() {
      if (!audio.paused) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalized = Math.min(average / 128, 1);
        setMouthOpenness(normalized);
        requestAnimationFrame(updateMouth);
      }
    }
    updateMouth();
  }, [setMouthOpenness]);

  // Fallback para Web Speech API
    const fallbackToWebSpeech = useCallback((textToSpeak: string) => {
      if (!window.speechSynthesis) {
        setIsSpeaking(false);
        return;
      }
      const emotion = detectMessageEmotion(textToSpeak);
      const voiceSettings = getVoiceSettingsForEmotion(emotion);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-BR';
      utterance.rate = voiceSettings.speaking_rate;
      utterance.pitch = voiceSettings.pitch_shift;
      utterance.volume = 1.0;
      const voices = window.speechSynthesis.getVoices();
      let lipSyncInterval: NodeJS.Timeout | null = null;
      utterance.onstart = () => {
        setIsSpeaking(true);
        lipSyncInterval = setInterval(() => {
          setMouthOpenness(Math.random() * 0.7 + 0.3);
        }, 100);
      };
      utterance.onboundary = () => {
        setMouthOpenness(Math.random() * 0.8 + 0.2);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
        speakingRef.current = false;
        onSpeakingComplete?.();
        if (lipSyncInterval) clearInterval(lipSyncInterval);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
        speakingRef.current = false;
        if (lipSyncInterval) clearInterval(lipSyncInterval);
      };
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
      } else {
        utterance.pitch = 1.5;
      }
      window.speechSynthesis.speak(utterance);
    }, [setIsSpeaking, setMouthOpenness, onSpeakingComplete]);
  // Tocar áudio e fazer lip-sync
  const playAudioWithLipSync = async (url: string) => {
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
    audio.onerror = () => {
      setIsSpeaking(false);
      speakingRef.current = false;
      setError('Erro ao reproduzir áudio');
    };
  };

  // Efeito para iniciar fala quando texto muda
  useEffect(() => {
    if (!text && !audioUrl) return;
    if (speakingRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      speakingRef.current = false;
      setIsSpeaking(false);
      setMouthOpenness(0);
    }
    const startSpeaking = async () => {
      speakingRef.current = true;
      setIsSpeaking(true);
      if (audioUrl) {
        setMode('canvas');
        await playAudioWithLipSync(audioUrl);
      } else if (text && text.trim().length > 0) {
        setMode('canvas');
        fallbackToWebSpeech(text);
      }
      speakingRef.current = false;
      setIsSpeaking(false);
    };
    startSpeaking();
  }, [text, audioUrl]);

  // Modo SVG (usa imagem externa realista)
  useEffect(() => {
    if (mode !== 'canvas' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new window.Image();
    img.src = avatarImage || '/clara-real.jpg';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Boca centralizada e mais acima
      // Parâmetros da boca (ajuste fino)
      const mouthX = canvas.width * 0.47; // levemente à esquerda
      const mouthY = canvas.height * 0.60; // altura correta
      const mouthWidth = canvas.width * 0.22; // largura proporcional
      const mouthHeight = Math.max(8, Math.min(16, mouthOpenness * 16)); // animação discreta
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(mouthX, mouthY, mouthWidth / 2, mouthHeight / 2, 0, 0, 2 * Math.PI);
      ctx.fillStyle = '#ff69b4';
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.restore();
    };
  }, [mode, avatarImage, mouthOpenness]);

  const emotionStyle = EMOTION_STYLES[currentEmotion];

  return (
    <motion.div className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}>
      <motion.div className={`relative rounded-lg overflow-hidden transition-all duration-500 bg-gradient-to-br ${emotionStyle.bgGradient}`}
        style={{
          border: emotionStyle.border,
          boxShadow: emotionStyle.boxShadow,
          animation: (emotionStyle as any).animation || 'none'
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}>
        <AnimatePresence mode="wait">
          <motion.div key={currentEmotion}
            className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md flex items-center gap-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}>
            <span className="text-xl">{emotionStyle.icon}</span>
            <span className="text-xs font-medium text-gray-700">{emotionStyle.label}</span>
          </motion.div>
        </AnimatePresence>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Gerando avatar...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute top-2 left-2 right-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-xs z-10">
            {error}
          </div>
        )}
        {mode === 'video' && videoUrl && (
          <video ref={videoRef}
            src={videoUrl ?? ''}
            autoPlay
            loop
            muted={false}
            className="w-full h-full rounded-lg object-cover"
            onEnded={onSpeakingComplete} />
        )}
        {mode === 'canvas' && (
          <div className="relative w-full h-full">
            <canvas ref={canvasRef}
              width={300}
              height={300}
              className="w-full h-full rounded-lg"
              style={{ display: 'block' }} />
          </div>
        )}
        {mode === 'svg' && (
          <div className="relative w-full h-full">
            <img src={avatarImage} alt="Clara - SVG" className="w-full h-full object-cover rounded-full" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button onClick={() => setMode('canvas')}
            className={`px-2 py-1 rounded text-xs ${mode === 'canvas' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            title="Modo Canvas">
            🎨
          </button>
          <button onClick={() => setMode('svg')}
            className={`px-2 py-1 rounded text-xs ${mode === 'svg' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            title="Modo SVG">
            ⚡
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
