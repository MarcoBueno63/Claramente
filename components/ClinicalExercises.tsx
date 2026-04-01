import React, { useState, useEffect } from 'react';
import { ClinicalExercise, ClinicalExercisePrescription } from '@/lib/clinical-exercises';

interface ClinicalExercisesProps {
  protocolCode?: string;
  sessionNumber: number;
  patientSymptoms: string[];
  onExerciseComplete: (exerciseId: string, results: Record<string, unknown>) => void;
  onExerciseStart: (exerciseId: string) => void;
}

interface ExerciseSession {
  exerciseId: string;
  startTime: Date;
  responses: Record<string, unknown>;
  completed: boolean;
}

export const ClinicalExercisesComponent: React.FC<ClinicalExercisesProps> = ({
  protocolCode = '',
  sessionNumber,
  patientSymptoms,
  onExerciseComplete,
  onExerciseStart
}) => {
  const [prescribedExercises, setPrescribedExercises] = useState<ClinicalExercise[]>([]);
  const [activeExercise, setActiveExercise] = useState<ClinicalExercise | null>(null);
  const [exerciseSession, setExerciseSession] = useState<ExerciseSession | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (protocolCode) {
      const exercises = ClinicalExercisePrescription.prescribeExercises(
        protocolCode,
        sessionNumber,
        patientSymptoms,
        'basic'
      );
      setPrescribedExercises(exercises);
    }
  }, [protocolCode, sessionNumber, patientSymptoms]);

  const startExercise = (exercise: ClinicalExercise) => {
    setActiveExercise(exercise);
    setExerciseSession({
      exerciseId: exercise.id,
      startTime: new Date(),
      responses: {},
      completed: false
    });
    setCurrentStep(0);
    onExerciseStart(exercise.id);
  };

  const completeExercise = () => {
    if (exerciseSession && activeExercise) {
      const completedSession = {
        ...exerciseSession,
        completed: true,
        endTime: new Date(),
        duration: Date.now() - exerciseSession.startTime.getTime()
      };
      
      onExerciseComplete(activeExercise.id, completedSession);
      setActiveExercise(null);
      setExerciseSession(null);
      setCurrentStep(0);
    }
  };

  const updateResponse = (key: string, value: unknown) => {
    if (exerciseSession) {
      setExerciseSession(prev => ({
        ...prev!,
        responses: { ...prev!.responses, [key]: value as unknown }
      }));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive': return '🧠';
      case 'behavioral': return '🎯';
      case 'exposure': return '🔥';
      case 'mindfulness': return '🧘';
      case 'interpersonal': return '👥';
      case 'self-assessment': return '📝';
      default: return '📋';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeExercise && exerciseSession) {
    const anxietyLevel = Number(exerciseSession.responses.anxietyLevel ?? 50);
    const observations = String(exerciseSession.responses.observations ?? '');

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
        {/* Cabeçalho do Exercício */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {getCategoryIcon(activeExercise.category)} {activeExercise.name}
            </h3>
            <p className="text-gray-600 mt-1">{activeExercise.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>⏱️ {activeExercise.duration}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activeExercise.difficulty)}`}>
                {activeExercise.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Avisos de Contraindicações */}
        {activeExercise.contraindicationsWarnings && activeExercise.contraindicationsWarnings.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex items-start">
              <span className="text-amber-400 mt-0.5 mr-3 text-lg">⚠️</span>
              <div>
                <h4 className="text-amber-800 font-semibold mb-2">Avisos Importantes</h4>
                <ul className="text-amber-700 text-sm space-y-1">
                  {activeExercise.contraindicationsWarnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Instruções do Exercício */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            📖 Instruções - Passo {currentStep + 1} de {activeExercise.instructions.length}
          </h4>
          
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              {activeExercise.instructions[currentStep]}
            </p>
          </div>

          {/* Barra de Progresso */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Progresso</span>
              <span>{Math.round(((currentStep + 1) / activeExercise.instructions.length) * 100)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / activeExercise.instructions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Área de Entrada do Usuário */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h5 className="font-semibold text-blue-900 mb-3">📊 Registre sua experiência:</h5>
          
          {/* Campo de Ansiedade/Humor (0-100) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Nível de Ansiedade/Desconforto (0-100):
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={anxietyLevel}
              onChange={(e) => updateResponse('anxietyLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-blue-600 mt-1">
              <span>Muito calmo</span>
              <span className="font-semibold">{anxietyLevel}</span>
              <span>Muito ansioso</span>
            </div>
          </div>

          {/* Campo de Observações */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Pensamentos e observações:
            </label>
            <textarea
              value={observations}
              onChange={(e) => updateResponse('observations', e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Como se sentiu durante este passo? Que pensamentos surgiram?"
            />
          </div>
        </div>

        {/* Controles */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ⬅️ Passo Anterior
          </button>

          <div className="flex gap-3">
            {currentStep < activeExercise.instructions.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Próximo Passo ▶️
              </button>
            ) : (
              <button
                onClick={completeExercise}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ✅ Concluir Exercício
              </button>
            )}
          </div>
        </div>

        {/* Questões de Follow-up */}
        {currentStep === activeExercise.instructions.length - 1 && activeExercise.followUpQuestions && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <h5 className="font-semibold text-green-900 mb-3">🤔 Questões de reflexão:</h5>
            <ul className="text-green-800 text-sm space-y-2">
              {activeExercise.followUpQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        🎯 Exercícios Clínicos Recomendados
      </h3>

      {prescribedExercises.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Nenhum exercício específico prescrito ainda.</p>
          <p className="text-gray-500 text-sm mt-2">
            Continue conversando para que eu possa sugerir exercícios personalizados.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prescribedExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    {getCategoryIcon(exercise.category)} {exercise.name}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{exercise.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>⏱️ {exercise.duration}</span>
                    <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>

                  {/* Sintomas Alvo */}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Sintomas trabalhados:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.targetSymptoms.slice(0, 3).map((symptom, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startExercise(exercise)}
                  className="ml-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ▶️ Iniciar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicalExercisesComponent;