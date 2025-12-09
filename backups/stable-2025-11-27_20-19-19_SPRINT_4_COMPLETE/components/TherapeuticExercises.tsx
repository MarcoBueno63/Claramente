// components/TherapeuticExercises.tsx - Interface dos Exercícios Terapêuticos
// Sistema completo de exercícios personalizados baseados na formulação de caso

"use client";
import React, { useState, useEffect } from 'react';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { 
  therapeuticExerciseService, 
  TherapeuticExercise, 
  ExerciseRecommendation,
  ExerciseCompletion,
  ExerciseInstruction
} from '../lib/therapeutic-exercises';
import { caseFormulationService } from '../lib/case-formulation';

interface ExerciseState {
  currentStep: number;
  responses: Record<string, any>;
  startTime: Date;
  completed: boolean;
}

export default function TherapeuticExercises() {
  const userAuth = useAuthenticatedUser();
  const [selectedExercise, setSelectedExercise] = useState<TherapeuticExercise | null>(null);
  const [exerciseState, setExerciseState] = useState<ExerciseState | null>(null);
  const [recommendations, setRecommendations] = useState<ExerciseRecommendation[]>([]);
  const [progressStats, setProgressStats] = useState<any>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filter, setFilter] = useState<{phase?: 1|2|3, type?: string, difficulty?: string}>({});

  // Carregar dados iniciais
  useEffect(() => {
    if (userAuth.user?.id) {
      loadRecommendations();
      loadProgressStats();
    }
  }, [userAuth.user?.id]);

  const loadRecommendations = () => {
    if (!userAuth.user?.id) return;
    
    const formulation = caseFormulationService.loadFormulation(userAuth.user.id);
    if (formulation) {
      const recs = therapeuticExerciseService.generateRecommendations(formulation, 2);
      setRecommendations(recs);
    }
  };

  const loadProgressStats = () => {
    if (!userAuth.user?.id) return;
    
    const stats = therapeuticExerciseService.getProgressStats(userAuth.user.id);
    setProgressStats(stats);
  };

  const startExercise = (exercise: TherapeuticExercise) => {
    setSelectedExercise(exercise);
    setExerciseState({
      currentStep: 0,
      responses: {},
      startTime: new Date(),
      completed: false
    });
  };

  const nextStep = () => {
    if (!exerciseState || !selectedExercise) return;
    
    if (exerciseState.currentStep < selectedExercise.instructions.length - 1) {
      setExerciseState(prev => ({
        ...prev!,
        currentStep: prev!.currentStep + 1
      }));
    } else {
      completeExercise();
    }
  };

  const previousStep = () => {
    if (!exerciseState) return;
    
    if (exerciseState.currentStep > 0) {
      setExerciseState(prev => ({
        ...prev!,
        currentStep: prev!.currentStep - 1
      }));
    }
  };

  const updateResponse = (key: string, value: any) => {
    setExerciseState(prev => ({
      ...prev!,
      responses: {
        ...prev!.responses,
        [key]: value
      }
    }));
  };

  const completeExercise = () => {
    if (!selectedExercise || !exerciseState || !userAuth.user?.id) return;
    
    setShowCompleted(true);
  };

  const submitCompletion = (completionData: {
    difficulty: number;
    helpfulness: number;
    insights: string[];
    challenges: string[];
    nextSteps: string[];
  }) => {
    if (!selectedExercise || !exerciseState || !userAuth.user?.id) return;
    
    const completion: ExerciseCompletion = {
      exerciseId: selectedExercise.id,
      userId: userAuth.user.id,
      sessionId: userAuth.currentSession?.id,
      completedAt: new Date(),
      timeSpent: Math.round((Date.now() - exerciseState.startTime.getTime()) / 60000),
      responses: exerciseState.responses,
      difficulty: completionData.difficulty as 1|2|3|4|5,
      helpfulness: completionData.helpfulness as 1|2|3|4|5,
      insights: completionData.insights,
      challenges: completionData.challenges,
      nextSteps: completionData.nextSteps
    };
    
    therapeuticExerciseService.saveExerciseCompletion(completion);
    
    // Reset state
    setSelectedExercise(null);
    setExerciseState(null);
    setShowCompleted(false);
    
    // Reload stats
    loadProgressStats();
  };

  const getExerciseIcon = (type: string) => {
    const icons = {
      'cognitive_restructuring': '🧠',
      'behavioral_experiment': '🧪',
      'mindfulness': '🧘',
      'exposure': '⚡',
      'homework': '📝',
      'reflection': '💭',
      'grounding': '🌱',
      'activity_scheduling': '📅'
    };
    return icons[type as keyof typeof icons] || '🎯';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'border-gray-300',
      medium: 'border-yellow-400',
      high: 'border-red-400'
    };
    return colors[urgency as keyof typeof colors] || 'border-gray-300';
  };

  if (showCompleted && selectedExercise) {
    return <CompletionForm exercise={selectedExercise} onSubmit={submitCompletion} />;
  }

  if (selectedExercise && exerciseState) {
    return (
      <ExerciseInterface 
        exercise={selectedExercise}
        state={exerciseState}
        onNext={nextStep}
        onPrevious={previousStep}
        onUpdateResponse={updateResponse}
        onComplete={completeExercise}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Exercícios Terapêuticos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Exercícios personalizados baseados na sua formulação de caso para acelerar seu progresso terapêutico
          </p>
        </div>

        {/* Estatísticas de Progresso */}
        {progressStats && progressStats.totalCompleted > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Seu Progresso</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{progressStats.totalCompleted}</div>
                <div className="text-sm text-gray-600">Exercícios Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{progressStats.averageHelpfulness}/5</div>
                <div className="text-sm text-gray-600">Utilidade Média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {progressStats.weeklyProgress.reduce((a: number, b: number) => a + b, 0)}
                </div>
                <div className="text-sm text-gray-600">Esta Semana</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {getExerciseIcon(progressStats.favoriteTypes[0])}
                </div>
                <div className="text-sm text-gray-600">Tipo Favorito</div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendações Personalizadas */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">⭐</span>
              Recomendados para Você
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 6).map((rec) => (
                <ExerciseCard
                  key={rec.exercise.id}
                  exercise={rec.exercise}
                  recommendation={rec}
                  onStart={() => startExercise(rec.exercise)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filtrar Exercícios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filter.phase || ''}
              onChange={(e) => setFilter(prev => ({...prev, phase: e.target.value ? parseInt(e.target.value) as 1|2|3 : undefined}))}
            >
              <option value="">Todas as Fases</option>
              <option value="1">Fase 1: Estabilização</option>
              <option value="2">Fase 2: Intervenção Ativa</option>
              <option value="3">Fase 3: Consolidação</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filter.difficulty || ''}
              onChange={(e) => setFilter(prev => ({...prev, difficulty: e.target.value || undefined}))}
            >
              <option value="">Todas as Dificuldades</option>
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filter.type || ''}
              onChange={(e) => setFilter(prev => ({...prev, type: e.target.value || undefined}))}
            >
              <option value="">Todos os Tipos</option>
              <option value="cognitive_restructuring">Reestruturação Cognitiva</option>
              <option value="behavioral_experiment">Experimento Comportamental</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="exposure">Exposição</option>
              <option value="grounding">Técnicas de Grounding</option>
              <option value="activity_scheduling">Agenda de Atividades</option>
            </select>
          </div>
        </div>

        {/* Biblioteca Completa */}
        <AllExercisesGrid filter={filter} onStart={startExercise} />
      </div>
    </div>
  );
}

// Componente para Card de Exercício
function ExerciseCard({ 
  exercise, 
  recommendation, 
  onStart 
}: { 
  exercise: TherapeuticExercise; 
  recommendation?: ExerciseRecommendation;
  onStart: () => void;
}) {
  const getExerciseIcon = (type: string) => {
    const icons = {
      'cognitive_restructuring': '🧠',
      'behavioral_experiment': '🧪',
      'mindfulness': '🧘',
      'exposure': '⚡',
      'homework': '📝',
      'reflection': '💭',
      'grounding': '🌱',
      'activity_scheduling': '📅'
    };
    return icons[type as keyof typeof icons] || '🎯';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'border-gray-300',
      medium: 'border-yellow-400',
      high: 'border-red-400'
    };
    return colors[urgency as keyof typeof colors] || 'border-gray-300';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-2 ${recommendation ? getUrgencyColor(recommendation.urgency) : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getExerciseIcon(exercise.type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{exercise.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty === 'beginner' ? 'Iniciante' : 
                 exercise.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </span>
              <span className="text-xs text-gray-500">Fase {exercise.phase}</span>
            </div>
          </div>
        </div>
        {recommendation && (
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">
              {recommendation.relevanceScore}% relevante
            </div>
            <div className={`text-xs ${
              recommendation.urgency === 'high' ? 'text-red-600' :
              recommendation.urgency === 'medium' ? 'text-yellow-600' : 'text-gray-500'
            }`}>
              {recommendation.urgency === 'high' ? 'Alta prioridade' :
               recommendation.urgency === 'medium' ? 'Prioridade média' : 'Baixa prioridade'}
            </div>
          </div>
        )}
      </div>

      {/* Descrição */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {exercise.description}
      </p>

      {/* Raciocínio da Recomendação */}
      {recommendation && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <div className="text-xs text-blue-800">
            <strong>Por que recomendamos:</strong> {recommendation.reasoning}
          </div>
        </div>
      )}

      {/* Detalhes */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>⏱️ {exercise.estimatedDuration} min</span>
        <span>🎯 {exercise.targetIssues.slice(0, 2).join(', ')}</span>
      </div>

      {/* Ação */}
      <button
        onClick={onStart}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Iniciar Exercício
      </button>
    </div>
  );
}

// Componente para Grade de Todos os Exercícios
function AllExercisesGrid({ 
  filter, 
  onStart 
}: { 
  filter: {phase?: 1|2|3, type?: string, difficulty?: string};
  onStart: (exercise: TherapeuticExercise) => void;
}) {
  const [exercises, setExercises] = useState<TherapeuticExercise[]>([]);

  useEffect(() => {
    const filtered = therapeuticExerciseService.filterExercises(filter);
    setExercises(filtered);
  }, [filter]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📚</span>
        Biblioteca Completa ({exercises.length} exercícios)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStart={() => onStart(exercise)}
          />
        ))}
      </div>
    </div>
  );
}

// Interface do Exercício
function ExerciseInterface({
  exercise,
  state,
  onNext,
  onPrevious,
  onUpdateResponse,
  onComplete
}: {
  exercise: TherapeuticExercise;
  state: ExerciseState;
  onNext: () => void;
  onPrevious: () => void;
  onUpdateResponse: (key: string, value: any) => void;
  onComplete: () => void;
}) {
  const currentInstruction = exercise.instructions[state.currentStep];
  const progress = ((state.currentStep + 1) / exercise.instructions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{exercise.title}</h1>
            <div className="text-sm text-gray-500">
              Passo {state.currentStep + 1} de {exercise.instructions.length}
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instrução Atual */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {currentInstruction.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {currentInstruction.content}
            </p>
            
            {currentInstruction.example && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Exemplo:</h4>
                <p className="text-blue-800 italic">{currentInstruction.example}</p>
              </div>
            )}
            
            {currentInstruction.tip && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <h4 className="font-medium text-yellow-900 mb-2">💡 Dica:</h4>
                <p className="text-yellow-800">{currentInstruction.tip}</p>
              </div>
            )}
          </div>

          {/* Área de Resposta */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suas reflexões para este passo:
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Anote suas reflexões, observações ou respostas..."
              value={state.responses[`step_${state.currentStep}`] || ''}
              onChange={(e) => onUpdateResponse(`step_${state.currentStep}`, e.target.value)}
            />
          </div>

          {/* Timer */}
          {currentInstruction.timeEstimate && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⏱️</span>
                <span className="text-sm text-gray-600">
                  Tempo sugerido: {currentInstruction.timeEstimate} minutos
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navegação */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={state.currentStep === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <div className="text-sm text-gray-500">
              {state.currentStep + 1} / {exercise.instructions.length}
            </div>

            {state.currentStep < exercise.instructions.length - 1 ? (
              <button
                onClick={onNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Próximo →
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Concluir ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulário de Conclusão
function CompletionForm({
  exercise,
  onSubmit
}: {
  exercise: TherapeuticExercise;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    difficulty: 3,
    helpfulness: 5,
    insights: [''],
    challenges: [''],
    nextSteps: ['']
  });

  const updateList = (field: 'insights' | 'challenges' | 'nextSteps', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addItem = (field: 'insights' | 'challenges' | 'nextSteps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeItem = (field: 'insights' | 'challenges' | 'nextSteps', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtrar itens vazios
    const cleanData = {
      ...formData,
      insights: formData.insights.filter(item => item.trim() !== ''),
      challenges: formData.challenges.filter(item => item.trim() !== ''),
      nextSteps: formData.nextSteps.filter(item => item.trim() !== '')
    };
    
    onSubmit(cleanData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exercício Concluído!
          </h1>
          <p className="text-gray-600">
            Como foi sua experiência com: <strong>{exercise.title}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Avaliações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Qual foi o nível de dificuldade?
              </label>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <label key={level} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={formData.difficulty === level}
                      onChange={(e) => setFormData(prev => ({...prev, difficulty: parseInt(e.target.value)}))}
                      className="text-blue-600"
                    />
                    <span className="text-sm">
                      {level === 1 ? '1 - Muito fácil' :
                       level === 2 ? '2 - Fácil' :
                       level === 3 ? '3 - Moderado' :
                       level === 4 ? '4 - Difícil' : '5 - Muito difícil'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quão útil foi este exercício?
              </label>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <label key={level} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="helpfulness"
                      value={level}
                      checked={formData.helpfulness === level}
                      onChange={(e) => setFormData(prev => ({...prev, helpfulness: parseInt(e.target.value)}))}
                      className="text-blue-600"
                    />
                    <span className="text-sm">
                      {level === 1 ? '1 - Nada útil' :
                       level === 2 ? '2 - Pouco útil' :
                       level === 3 ? '3 - Moderadamente útil' :
                       level === 4 ? '4 - Muito útil' : '5 - Extremamente útil'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              💡 Que insights ou aprendizados você teve?
            </label>
            {formData.insights.map((insight, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={insight}
                  onChange={(e) => updateList('insights', index, e.target.value)}
                  placeholder="Ex: Percebi que meus pensamentos são mais flexíveis do que imaginava"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {formData.insights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('insights', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem('insights')}
              className="text-blue-600 text-sm hover:text-blue-800"
            >
              + Adicionar insight
            </button>
          </div>

          {/* Desafios */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ⚠️ Que desafios ou dificuldades você encontrou?
            </label>
            {formData.challenges.map((challenge, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => updateList('challenges', index, e.target.value)}
                  placeholder="Ex: Foi difícil manter o foco durante a respiração"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {formData.challenges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('challenges', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem('challenges')}
              className="text-blue-600 text-sm hover:text-blue-800"
            >
              + Adicionar desafio
            </button>
          </div>

          {/* Próximos Passos */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              🎯 Quais são seus próximos passos baseados neste exercício?
            </label>
            {formData.nextSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateList('nextSteps', index, e.target.value)}
                  placeholder="Ex: Praticar esta técnica toda manhã por uma semana"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {formData.nextSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('nextSteps', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem('nextSteps')}
              className="text-blue-600 text-sm hover:text-blue-800"
            >
              + Adicionar próximo passo
            </button>
          </div>

          {/* Perguntas de Acompanhamento */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-blue-900 mb-3">Perguntas para Reflexão:</h3>
            <ul className="space-y-2">
              {exercise.followUpQuestions.map((question, index) => (
                <li key={index} className="text-blue-800 text-sm flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
          >
            Salvar e Continuar 🎉
          </button>
        </form>
      </div>
    </div>
  );
}