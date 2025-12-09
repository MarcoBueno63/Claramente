"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface AvatarSimpleProps {
  text: string;
  avatarImage?: string;
}

export default function AvatarSimple({ text, avatarImage = '/clara-real.jpg' }: AvatarSimpleProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🎤 AvatarSimple recebeu texto:', text?.substring(0, 50));
    
    if (!text || text.trim().length === 0) {
      console.log('⚠️ Texto vazio, ignorando');
      return;
    }

    // LIMPAR FALA ANTERIOR
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // ESPERAR VOZES CARREGAREM
    const speakNow = () => {
      console.log('🎬 Iniciando fala SIMPLES...');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.2; // Voz mais feminina
      utterance.volume = 1.0;

      // Tentar voz feminina
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.lang.includes('pt') && v.name.toLowerCase().includes('female')
      ) || voices.find(v => v.lang.includes('pt'));
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('✅ Voz:', femaleVoice.name);
      }

      utterance.onstart = () => {
        console.log('▶️ Fala iniciada!');
        setIsSpeaking(true);
        
        // ANIMAR BOCA - SIMPLES E FUNCIONAL
        intervalRef.current = setInterval(() => {
          setMouthOpen(prev => !prev);
        }, 200); // Alterna a cada 200ms
      };

      utterance.onend = () => {
        console.log('✅ Fala concluída!');
        setIsSpeaking(false);
        setMouthOpen(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      utterance.onerror = (e) => {
        console.error('❌ Erro na fala:', e);
        setIsSpeaking(false);
        setMouthOpen(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      console.log('🔊 speak() chamado!');
    };

    // Se vozes já carregadas, falar imediatamente
    if (window.speechSynthesis.getVoices().length > 0) {
      speakNow();
    } else {
      // Aguardar vozes carregarem
      window.speechSynthesis.onvoiceschanged = () => {
        speakNow();
      };
    }

    // Cleanup
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text]);

  return (
    <div className="relative">
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <Image 
          src={avatarImage}
          alt="Clara - Avatar"
          width={200}
          height={200}
          className="w-full h-full object-cover"
          priority
        />
        
        {/* Boca Animada - OVERLAY SIMPLES */}
        {isSpeaking && (
          <div 
            className="absolute bottom-[30%] left-[50%] transform -translate-x-1/2"
            style={{
              width: mouthOpen ? '30px' : '20px',
              height: mouthOpen ? '15px' : '5px',
              background: '#e74c3c',
              borderRadius: mouthOpen ? '50%' : '10px',
              transition: 'all 0.2s ease-in-out'
            }}
          />
        )}
        
        {/* Indicador de Fala */}
        {isSpeaking && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            🔊 Falando
          </div>
        )}
      </div>
      
      {/* Debug Info */}
      <div className="mt-2 text-xs text-gray-600 font-mono">
        Status: {isSpeaking ? '🟢 Falando' : '⚪ Silêncio'}
        {' | '}
        Boca: {mouthOpen ? 'Aberta' : 'Fechada'}
      </div>
    </div>
  );
}
