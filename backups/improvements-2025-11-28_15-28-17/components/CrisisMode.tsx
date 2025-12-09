'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics, useBreathingHaptics, useGroundingHaptics } from '@/hooks/useHaptics';

export default function CrisisMode() {
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const haptics = useHaptics();

  const activateCrisisMode = () => {
    haptics.warning();
    setIsActive(true);
  };

  const deactivateCrisisMode = () => {
    haptics.tap();
    setIsActive(false);
    setCurrentExercise(null);
  };

  const startExercise = (exercise: string) => {
    haptics.tap();
    setCurrentExercise(exercise);
  };

  return (
    <>
      {/* SOS Button - Always visible */}
      {!isActive && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={activateCrisisMode}
          className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg font-bold hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">🆘</span>
          <span className="hidden sm:inline">Modo Crise</span>
        </motion.button>
      )}

      {/* Crisis Mode Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-red-900/95 to-purple-900/95 backdrop-blur-sm"
          >
            <div className="h-full overflow-y-auto">
              <div className="min-h-full flex flex-col items-center justify-center p-4">
                {!currentExercise ? (
                  <ExerciseMenu
                    onSelect={startExercise}
                    onClose={deactivateCrisisMode}
                  />
                ) : (
                  <ExerciseView
                    exercise={currentExercise}
                    onBack={() => setCurrentExercise(null)}
                    onClose={deactivateCrisisMode}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ExerciseMenu({
  onSelect,
  onClose,
}: {
  onSelect: (exercise: string) => void;
  onClose: () => void;
}) {
  const haptics = useHaptics();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="max-w-2xl w-full"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="inline-block mb-4"
        >
          <span className="text-6xl">🆘</span>
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Modo Crise Ativado</h1>
        <p className="text-red-100 text-lg">
          Você não está sozinho(a). Vamos passar por isso juntos.
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📞</span>
          Precisa de Ajuda Urgente?
        </h2>
        <div className="space-y-3">
          <EmergencyContact
            name="CVV - Centro de Valorização da Vida"
            number="188"
            description="24h - Chat, telefone e email gratuitos"
            onClick={() => {
              haptics.tap();
              window.open('https://www.cvv.org.br/', '_blank');
            }}
          />
          <EmergencyContact
            name="SAMU"
            number="192"
            description="Emergências médicas"
            onClick={() => {
              haptics.warning();
              window.location.href = 'tel:192';
            }}
          />
          <EmergencyContact
            name="Polícia Militar"
            number="190"
            description="Emergências policiais"
            onClick={() => {
              haptics.warning();
              window.location.href = 'tel:190';
            }}
          />
        </div>
      </div>

      {/* Grounding Exercises */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Escolha um Exercício
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ExerciseCard
            icon="🫁"
            title="Respiração 4-7-8"
            description="Técnica calmante para ansiedade"
            onClick={() => onSelect('breathing')}
          />
          <ExerciseCard
            icon="🧘"
            title="Grounding 5-4-3-2-1"
            description="Conecte-se com o presente"
            onClick={() => onSelect('grounding')}
          />
          <ExerciseCard
            icon="💭"
            title="Pensamentos Automáticos"
            description="Desafie seus pensamentos"
            onClick={() => onSelect('thoughts')}
          />
          <ExerciseCard
            icon="🎯"
            title="Foco no Agora"
            description="Mindfulness guiado"
            onClick={() => onSelect('mindfulness')}
          />
        </div>
      </div>

      {/* Close button */}
      <div className="text-center">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors backdrop-blur-md"
        >
          Estou Melhor Agora
        </button>
      </div>
    </motion.div>
  );
}

function ExerciseView({
  exercise,
  onBack,
  onClose,
}: {
  exercise: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const exercises: Record<string, React.ReactElement> = {
    breathing: <BreathingExercise />,
    grounding: <GroundingExercise />,
    thoughts: <ThoughtsExercise />,
    mindfulness: <MindfulnessExercise />,
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="max-w-2xl w-full"
    >
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
        >
          <span className="text-white text-2xl">←</span>
        </button>
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors backdrop-blur-md"
        >
          Sair
        </button>
      </div>

      {exercises[exercise]}
    </motion.div>
  );
}

function BreathingExercise() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const haptics = useHaptics();

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next phase
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') {
              haptics.breatheIn();
              return 'hold';
            } else if (currentPhase === 'hold') {
              return 'exhale';
            } else if (currentPhase === 'exhale') {
              haptics.breatheOut();
              return 'rest';
            } else {
              setCycle((c) => c + 1);
              return 'inhale';
            }
          });

          // Set countdown for next phase
          if (phase === 'inhale') return 7; // hold
          if (phase === 'hold') return 8; // exhale
          if (phase === 'exhale') return 2; // rest
          return 4; // inhale
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, haptics]);

  const phaseConfig = {
    inhale: { text: 'Inspire pelo nariz', color: 'from-blue-500 to-cyan-500', scale: 1.2 },
    hold: { text: 'Segure a respiração', color: 'from-purple-500 to-pink-500', scale: 1.2 },
    exhale: { text: 'Expire pela boca', color: 'from-green-500 to-emerald-500', scale: 0.8 },
    rest: { text: 'Pausa', color: 'from-gray-500 to-gray-600', scale: 1 },
  };

  const current = phaseConfig[phase];

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Respiração 4-7-8</h2>
      <p className="text-red-100 mb-8">
        Esta técnica acalma o sistema nervoso e reduz a ansiedade
      </p>

      <div className="mb-8">
        <motion.div
          animate={{ scale: current.scale }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${current.color} flex items-center justify-center shadow-2xl`}
        >
          <div className="text-center">
            <div className="text-8xl font-bold text-white mb-2">{countdown}</div>
            <div className="text-xl text-white/90">{current.text}</div>
          </div>
        </motion.div>
      </div>

      <div className="mb-8 text-white text-lg">
        Ciclo {cycle} de 4
      </div>

      {!isActive ? (
        <button
          onClick={() => setIsActive(true)}
          className="px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-red-50 transition-colors shadow-lg"
        >
          🫁 Começar Exercício
        </button>
      ) : (
        <button
          onClick={() => setIsActive(false)}
          className="px-8 py-4 bg-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/30 transition-colors backdrop-blur-md"
        >
          ⏸️ Pausar
        </button>
      )}
    </div>
  );
}

function GroundingExercise() {
  const steps = [
    { number: 5, text: '5 coisas que você VÊ', icon: '👀', examples: ['Cadeira', 'Parede', 'Janela', 'Mesa', 'Planta'] },
    { number: 4, text: '4 coisas que você TOCA', icon: '✋', examples: ['Roupa', 'Cabelo', 'Chão', 'Cadeira'] },
    { number: 3, text: '3 coisas que você OUVE', icon: '👂', examples: ['Respiração', 'Ar condicionado', 'Passos'] },
    { number: 2, text: '2 coisas que você CHEIRA', icon: '👃', examples: ['Ar', 'Perfume'] },
    { number: 1, text: '1 coisa que você GOSTA em você', icon: '❤️', examples: ['Resiliência'] },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const haptics = useGroundingHaptics();

  const handleAddItem = () => {
    if (inputValue.trim()) {
      haptics.isSupported && navigator.vibrate(100);
      setItems([...items, inputValue.trim()]);
      setInputValue('');

      if (items.length + 1 >= steps[currentStep].number) {
        setTimeout(() => {
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setItems([]);
          }
        }, 500);
      }
    }
  };

  const current = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Grounding 5-4-3-2-1</h2>
      <p className="text-red-100 mb-8">
        Técnica para se conectar com o presente e reduzir ansiedade
      </p>

      {/* Progress */}
      <div className="mb-8">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
          />
        </div>
      </div>

      {/* Current step */}
      <motion.div
        key={currentStep}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <div className="text-6xl mb-4">{current.icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{current.text}</h3>
        <p className="text-red-100">
          {items.length} de {current.number}
        </p>
      </motion.div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder={`Digite algo... (ex: ${current.examples[items.length] || 'Digite aqui'})`}
            className="flex-1 px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            autoFocus
          />
          <button
            onClick={handleAddItem}
            className="px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Items listed */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full"
          >
            {item}
          </motion.div>
        ))}
      </div>

      {currentStep === steps.length - 1 && items.length >= 1 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-8 p-6 bg-green-500/20 border-2 border-green-400 rounded-2xl"
        >
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">Exercício Completo!</h3>
          <p className="text-white/90">Você conseguiu se reconectar com o presente</p>
        </motion.div>
      )}
    </div>
  );
}

function ThoughtsExercise() {
  const [thought, setThought] = useState('');
  const [evidence, setEvidence] = useState('');
  const [alternative, setAlternative] = useState('');
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        Desafie Seus Pensamentos
      </h2>
      <p className="text-red-100 mb-8 text-center">
        Identifique e questione pensamentos automáticos negativos
      </p>

      <div className="space-y-6">
        {/* Step 1: Identify thought */}
        <div className={`p-6 rounded-2xl ${step === 1 ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-md`}>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span>1️⃣</span> Qual é o pensamento?
          </h3>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Ex: Eu sempre falho em tudo..."
            className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white resize-none"
            rows={3}
            disabled={step !== 1}
          />
          {step === 1 && thought && (
            <button
              onClick={() => setStep(2)}
              className="mt-3 px-6 py-2 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors w-full"
            >
              Próximo →
            </button>
          )}
        </div>

        {/* Step 2: Evidence */}
        {step >= 2 && (
          <div className={`p-6 rounded-2xl ${step === 2 ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-md`}>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>2️⃣</span> Quais evidências reais você tem?
            </h3>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Ex: Consegui concluir o projeto X, recebi elogios por Y..."
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white resize-none"
              rows={3}
              disabled={step !== 2}
            />
            {step === 2 && evidence && (
              <button
                onClick={() => setStep(3)}
                className="mt-3 px-6 py-2 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors w-full"
              >
                Próximo →
              </button>
            )}
          </div>
        )}

        {/* Step 3: Alternative thought */}
        {step >= 3 && (
          <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>3️⃣</span> Pensamento alternativo mais realista
            </h3>
            <textarea
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              placeholder="Ex: Às vezes tenho dificuldades, mas também tenho sucessos..."
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white resize-none"
              rows={3}
            />
            {alternative && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-6 p-4 bg-green-500/20 border-2 border-green-400 rounded-xl"
              >
                <div className="text-3xl mb-2 text-center">✨</div>
                <h4 className="text-lg font-bold text-white text-center mb-2">
                  Ótimo Trabalho!
                </h4>
                <p className="text-white/90 text-center text-sm">
                  Você questionou com sucesso um pensamento automático negativo
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MindfulnessExercise() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const haptics = useHaptics();

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
      if (time % 5 === 0) {
        haptics.calm();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, time, haptics]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-white mb-4">Foco no Agora</h2>
      <p className="text-red-100 mb-8">
        Mindfulness guiado para trazer você ao momento presente
      </p>

      <div className="mb-8">
        <motion.div
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 4,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
        >
          <div className="text-4xl font-bold text-white">{formatTime(time)}</div>
        </motion.div>
      </div>

      {!isActive ? (
        <>
          <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl text-left">
            <h3 className="text-xl font-bold text-white mb-4">Instruções:</h3>
            <ul className="space-y-2 text-red-100">
              <li>• Sente-se confortavelmente</li>
              <li>• Feche os olhos se possível</li>
              <li>• Respire naturalmente</li>
              <li>• Observe seus pensamentos sem julgamento</li>
              <li>• Sempre que se distrair, volte suavemente à respiração</li>
            </ul>
          </div>
          <button
            onClick={() => setIsActive(true)}
            className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
          >
            🧘 Começar Meditação
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setIsActive(false);
            haptics.success();
          }}
          className="px-8 py-4 bg-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/30 transition-colors backdrop-blur-md"
        >
          ✅ Finalizar
        </button>
      )}
    </div>
  );
}

function ExerciseCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  const haptics = useHaptics();

  return (
    <motion.button
      onClick={() => {
        haptics.tap();
        onClick();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-left"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-red-100 text-sm">{description}</p>
    </motion.button>
  );
}

function EmergencyContact({
  name,
  number,
  description,
  onClick,
}: {
  name: string;
  number: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-left"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-white">{name}</span>
        <span className="text-2xl font-bold text-white bg-red-600 px-3 py-1 rounded-lg">
          {number}
        </span>
      </div>
      <p className="text-red-100 text-sm">{description}</p>
    </button>
  );
}
