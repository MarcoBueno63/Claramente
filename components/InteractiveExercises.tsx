// Componentes interativos para exercícios terapêuticos
"use client";
import React, { useState, useEffect, useRef } from 'react';

// Exercício de Respiração Guiada
export const BreathingExercise: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases = {
    inhale: { duration: 4, next: 'hold', instruction: 'Inspire devagar pelo nariz' },
    hold: { duration: 4, next: 'exhale', instruction: 'Segure a respiração' },
    exhale: { duration: 6, next: 'pause', instruction: 'Expire lentamente pela boca' },
    pause: { duration: 2, next: 'inhale', instruction: 'Pausa natural' }
  };

  const startExercise = () => {
    setIsActive(true);
    setCycle(0);
    setPhase('inhale');
    setCountdown(4);
  };

  const stopExercise = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            const currentPhase = phases[phase];
            const nextPhase = currentPhase.next as keyof typeof phases;
            setPhase(nextPhase);
            
            if (nextPhase === 'inhale') {
              setCycle(prev => {
                const newCycle = prev + 1;
                if (newCycle >= 5) { // 5 ciclos completos
                  setIsActive(false);
                  onComplete?.();
                }
                return newCycle;
              });
            }
            
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase, onComplete]);

  const getCircleClass = () => {
    switch (phase) {
      case 'inhale': return 'scale-150 bg-blue-400';
      case 'hold': return 'scale-150 bg-green-400';
      case 'exhale': return 'scale-75 bg-purple-400';
      case 'pause': return 'scale-100 bg-gray-300';
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🫁 Respiração 4-4-6</h3>
      
      <div className="relative mb-6">
        <div 
          className={`w-32 h-32 rounded-full transition-all duration-1000 ease-in-out ${getCircleClass()}`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{countdown}</span>
        </div>
      </div>

      <p className="text-center text-gray-700 mb-4 h-12">
        {isActive ? phases[phase].instruction : 'Clique em iniciar para começar o exercício'}
      </p>

      <div className="mb-4">
        <span className="text-sm text-gray-600">Ciclo: {cycle}/5</span>
      </div>

      <div className="flex gap-3">
        {!isActive ? (
          <button
            onClick={startExercise}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🫁 Iniciar
          </button>
        ) : (
          <button
            onClick={stopExercise}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ⏹️ Parar
          </button>
        )}
      </div>
    </div>
  );
};

// Diário de Humor
export const MoodTracker: React.FC<{ onSave?: (mood: MoodEntry) => void }> = ({ onSave }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [triggers, setTriggers] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const moods = [
    { emoji: '😢', name: 'triste', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😟', name: 'ansioso', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😠', name: 'irritado', color: 'bg-red-100 text-red-800' },
    { emoji: '😌', name: 'calmo', color: 'bg-green-100 text-green-800' },
    { emoji: '😊', name: 'feliz', color: 'bg-purple-100 text-purple-800' },
    { emoji: '😴', name: 'cansado', color: 'bg-gray-100 text-gray-800' },
    { emoji: '😕', name: 'confuso', color: 'bg-orange-100 text-orange-800' },
    { emoji: '😇', name: 'esperançoso', color: 'bg-pink-100 text-pink-800' }
  ];

  const handleSave = () => {
    if (!selectedMood) return;

    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      intensity,
      triggers,
      notes,
      timestamp: new Date()
    };

    onSave?.(moodEntry);
    
    // Reset form
    setSelectedMood('');
    setIntensity(5);
    setTriggers('');
    setNotes('');
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Como você está se sentindo?</h3>
      
      {/* Seleção de Humor */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Selecione seu humor principal:</p>
        <div className="grid grid-cols-4 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(mood.name)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedMood === mood.name 
                  ? `border-blue-500 ${mood.color}` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs">{mood.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Intensidade */}
      {selectedMood && (
        <>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Intensidade: {intensity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Leve</span>
              <span>Moderado</span>
              <span>Intenso</span>
            </div>
          </div>

          {/* Gatilhos */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              O que pode ter causado esse sentimento?
            </label>
            <input
              type="text"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="Ex: trabalho, relacionamento, saúde..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notas */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Observações (opcional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi seu dia? O que você aprendeu sobre si mesmo?"
              className="w-full p-2 border border-gray-300 rounded h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            💾 Salvar Registro
          </button>
        </>
      )}
    </div>
  );
};

// Mindfulness Timer
export const MindfulnessTimer: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [duration, setDuration] = useState(5); // minutos
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'setup' | 'running' | 'complete'>('setup');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const mindfulnessPrompts = [
    "Concentre-se na sua respiração natural...",
    "Observe os pensamentos sem julgamento...",
    "Sinta seu corpo relaxando...",
    "Perceba os sons ao seu redor...",
    "Retorne gentilmente à respiração...",
    "Observe as sensações do momento presente..."
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);

  const startTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    setPhase('running');
    setCurrentPrompt(0);
  };

  const stopTimer = () => {
    setIsActive(false);
    setPhase('setup');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setPhase('complete');
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
        
        // Mudar prompt a cada 30 segundos
        if (timeLeft % 30 === 0 && timeLeft < duration * 60) {
          setCurrentPrompt(prev => (prev + 1) % mindfulnessPrompts.length);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, duration, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = timeLeft > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">🧘 Mindfulness</h3>
      
      {phase === 'setup' && (
        <>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Duração: {duration} minutos
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 min</span>
              <span>15 min</span>
              <span>30 min</span>
            </div>
          </div>
          
          <button
            onClick={startTimer}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🧘 Começar Meditação
          </button>
        </>
      )}

      {phase === 'running' && (
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercent / 100)}`}
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-700">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <p className="text-center text-gray-700 mb-4 h-12 italic">
            {mindfulnessPrompts[currentPrompt]}
          </p>

          <button
            onClick={stopTimer}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ⏹️ Parar
          </button>
        </div>
      )}

      {phase === 'complete' && (
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Parabéns!</h4>
          <p className="text-gray-600 mb-4">Você completou {duration} minutos de mindfulness.</p>
          <button
            onClick={() => setPhase('setup')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🔄 Nova Sessão
          </button>
        </div>
      )}
    </div>
  );
};

// Progressive Muscle Relaxation
export const MuscleRelaxation: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'tense' | 'relax' | 'rest'>('tense');
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const muscleGroups = [
    { name: 'Pés e panturrilhas', instruction: 'Contraia os músculos dos pés e panturrilhas' },
    { name: 'Coxas e glúteos', instruction: 'Tensione as coxas e glúteos' },
    { name: 'Abdômen', instruction: 'Contraia os músculos abdominais' },
    { name: 'Mãos e braços', instruction: 'Feche os punhos e contraia os braços' },
    { name: 'Ombros e pescoço', instruction: 'Levante os ombros até as orelhas' },
    { name: 'Rosto', instruction: 'Contraia todos os músculos do rosto' }
  ];

  const startExercise = () => {
    setIsActive(true);
    setCurrentStep(0);
    setPhase('tense');
    setCountdown(5);
  };

  const stopExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (phase === 'tense') {
              setPhase('relax');
              return 10; // 10 segundos para relaxar
            } else if (phase === 'relax') {
              setPhase('rest');
              return 3; // 3 segundos de descanso
            } else { // rest
              if (currentStep < muscleGroups.length - 1) {
                setCurrentStep(prev => prev + 1);
                setPhase('tense');
                return 5; // 5 segundos para tensionar próximo grupo
              } else {
                setIsActive(false);
                onComplete?.();
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase, currentStep, onComplete]);

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'tense': return `${muscleGroups[currentStep].instruction}`;
      case 'relax': return 'Agora relaxe completamente esses músculos';
      case 'rest': return 'Respire normalmente e descanse';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'tense': return 'bg-red-400';
      case 'relax': return 'bg-green-400';
      case 'rest': return 'bg-blue-400';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">💪 Relaxamento Muscular</h3>
      
      {!isActive ? (
        <>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Exercício de tensão e relaxamento progressivo dos músculos
          </p>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Grupos musculares:</h4>
            <ol className="text-xs text-gray-600 space-y-1">
              {muscleGroups.map((group, index) => (
                <li key={index}>{index + 1}. {group.name}</li>
              ))}
            </ol>
          </div>
          <button
            onClick={startExercise}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            💪 Iniciar Relaxamento
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Grupo {currentStep + 1}/{muscleGroups.length}: {muscleGroups[currentStep].name}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / muscleGroups.length) * 100}%` }}
              />
            </div>
          </div>

          <div className={`w-24 h-24 mx-auto rounded-full mb-4 flex items-center justify-center transition-all duration-500 ${getPhaseColor()}`}>
            <span className="text-2xl font-bold text-white">{countdown}</span>
          </div>

          <p className="text-center text-gray-700 mb-4 h-12">
            {getPhaseInstruction()}
          </p>

          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              phase === 'tense' ? 'bg-red-100 text-red-800' :
              phase === 'relax' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {phase === 'tense' ? '🔴 Tensionar' :
               phase === 'relax' ? '🟢 Relaxar' : '🔵 Descansar'}
            </span>
          </div>

          <button
            onClick={stopExercise}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ⏹️ Parar
          </button>
        </div>
      )}
    </div>
  );
};

// Interfaces
export interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  triggers: string;
  notes: string;
  timestamp: Date;
}