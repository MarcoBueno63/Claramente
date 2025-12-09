"use client";
import { useState, useEffect } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    title: 'Bem-vindo à ClaraMente 💙',
    description: 'Sua jornada de autocuidado emocional começa aqui',
    content: 'A ClaraMente oferece terapia cognitivo-comportamental (TCC) baseada em evidências científicas para ajudá-lo a desenvolver habilidades emocionais e alcançar seus objetivos.',
    icon: '🌟',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    title: 'Conheça a Clara',
    description: 'Sua terapeuta virtual disponível 24/7',
    content: 'Clara é uma IA treinada em TCC, DBT e ACT. Ela oferece conversas empáticas, exercícios terapêuticos personalizados e acompanhamento do seu progresso.',
    icon: '👩‍⚕️',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Exercícios Terapêuticos',
    description: 'Biblioteca completa de técnicas validadas',
    content: 'Acesse exercícios de respiração, mindfulness, reestruturação cognitiva, exposição gradual e muito mais. Cada técnica é explicada passo a passo.',
    icon: '🧘',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Acompanhe seu Progresso',
    description: 'Dashboard com insights e analytics',
    content: 'Visualize sua evolução através de gráficos, relatórios clínicos e avaliações psicométricas. Celebre conquistas e identifique padrões.',
    icon: '📊',
    gradient: 'from-rose-500 to-orange-600',
  },
  {
    title: 'Comece sua Jornada',
    description: 'Tudo pronto para iniciar!',
    content: 'Suas sessões são ilimitadas e totalmente privadas. Você pode conversar com a Clara sempre que precisar. Vamos começar?',
    icon: '🚀',
    gradient: 'from-orange-500 to-amber-600',
  },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Icon */}
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
            <span className="text-5xl">{step.icon}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-center text-blue-600 dark:text-blue-400 font-medium mb-6">
            {step.description}
          </p>

          {/* Content */}
          <p className="text-center text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            {step.content}
          </p>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : index < currentStep
                    ? 'w-2 bg-blue-400'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Pular
            </button>
            <button
              onClick={handleNext}
              className={`flex-1 px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 bg-gradient-to-r ${step.gradient}`}
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Começar! 🎉' : 'Próximo'}
            </button>
          </div>

          {/* Step Counter */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Passo {currentStep + 1} de {ONBOARDING_STEPS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
