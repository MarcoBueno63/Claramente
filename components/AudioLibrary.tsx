'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioLibrary, getAudioByCategory, formatDuration, type AudioScript } from '@/lib/audioScripts';
import { useHaptics } from '@/hooks/useHaptics';

export default function AudioLibrary() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | AudioScript['category']>('all');
  const [playingAudio, setPlayingAudio] = useState<AudioScript | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const haptics = useHaptics();

  const categories = [
    { id: 'all' as const, name: 'Todos', icon: '🎵' },
    { id: 'breathing' as const, name: 'Respiração', icon: '🫁' },
    { id: 'meditation' as const, name: 'Meditação', icon: '🧘' },
    { id: 'grounding' as const, name: 'Grounding', icon: '🌿' },
    { id: 'sleep' as const, name: 'Sono', icon: '😴' },
  ];

  const filteredAudios = selectedCategory === 'all'
    ? audioLibrary
    : getAudioByCategory(selectedCategory);

  const playAudio = (audio: AudioScript) => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta síntese de voz');
      return;
    }

    haptics.tap();
    setPlayingAudio(audio);
    setCurrentSegment(0);
    setIsPlaying(true);
    setProgress(0);
    playSeg(audio, 0);
  };

  const playSegment = (audio: AudioScript, segmentIndex: number) => {
    if (segmentIndex >= audio.script.length) {
      // Finished
      haptics.success();
      setIsPlaying(false);
      setCurrentSegment(0);
      setProgress(100);
      return;
    }

    const segment = audio.script[segmentIndex];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    
    // Configure voice
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85; // Slightly slower for calmness
    utterance.pitch = 1;
    utterance.volume = 1;

    // Select voice based on segment preference
    const voices = speechSynthesis.getVoices();
    const ptVoices = voices.filter(v => v.lang.includes('pt'));
    if (ptVoices.length > 0) {
      utterance.voice = ptVoices[0];
    }

    utterance.onend = () => {
      // Pause after speaking
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        setCurrentSegment(segmentIndex + 1);
        setProgress(((segmentIndex + 1) / audio.script.length) * 100);
        playSegment(audio, segmentIndex + 1);
      }, segment.pause * 1000);
    };

    speechSynthesis.speak(utterance);
    audioRef.current = utterance;
  };

  const playSeg = playSegment;

  const pauseAudio = () => {
    haptics.tap();
    speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    if (!playingAudio) return;
    haptics.tap();
    setIsPlaying(true);
    playSegment(playingAudio, currentSegment);
  };

  const stopAudio = () => {
    haptics.tap();
    speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setPlayingAudio(null);
    setCurrentSegment(0);
    setProgress(0);
  };

  useEffect(() => {
    // Load voices
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }

    return () => {
      speechSynthesis.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!showLibrary && !playingAudio) {
    return (
      <button
        onClick={() => {
          haptics.tap();
          setShowLibrary(true);
        }}
        className="fixed bottom-36 right-4 z-40 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <span className="text-2xl">🎵</span>
      </button>
    );
  }

  return (
    <>
      {/* Audio Player (always visible when playing) */}
      <AnimatePresence>
        {playingAudio && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-6 max-w-lg mx-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">{playingAudio.title}</h3>
                <p className="text-purple-100 text-sm">
                  Segmento {currentSegment + 1} de {playingAudio.script.length}
                </p>
              </div>
              <button
                onClick={stopAudio}
                className="text-white hover:text-purple-200 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>

            {/* Current text */}
            {isPlaying && currentSegment < playingAudio.script.length && (
              <motion.div
                key={currentSegment}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm"
              >
                <p className="text-white text-center">
                  {playingAudio.script[currentSegment].text}
                </p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={isPlaying ? pauseAudio : resumeAudio}
                className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center text-2xl hover:bg-purple-50 transition-colors shadow-lg"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={stopAudio}
                className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center text-xl hover:bg-white/30 transition-colors"
              >
                ⏹️
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Library Modal */}
      <AnimatePresence>
        {showLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowLibrary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🎵</span>
                    Biblioteca de Áudio
                  </h2>
                  <button
                    onClick={() => {
                      haptics.tap();
                      setShowLibrary(false);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Category filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        haptics.selection();
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio list */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredAudios.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Nenhum áudio encontrado nesta categoria
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredAudios.map((audio) => (
                      <AudioCard
                        key={audio.id}
                        audio={audio}
                        isPlaying={playingAudio?.id === audio.id && isPlaying}
                        onPlay={() => playAudio(audio)}
                        onPause={pauseAudio}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AudioCard({
  audio,
  isPlaying,
  onPlay,
  onPause,
}: {
  audio: AudioScript;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}) {
  const categoryIcons = {
    breathing: '🫁',
    meditation: '🧘',
    grounding: '🌿',
    sleep: '😴',
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl">{categoryIcons[audio.category]}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">{audio.title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {formatDuration(audio.duration)}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[audio.difficulty]}`}>
              {audio.difficulty === 'beginner' ? 'Iniciante' : audio.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={isPlaying ? onPause : onPlay}
        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
          isPlaying
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
        }`}
      >
        {isPlaying ? '⏸️ Pausar' : '▶️ Reproduzir'}
      </button>
    </motion.div>
  );
}
