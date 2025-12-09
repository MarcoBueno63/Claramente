// components/CaseFormulationAssessment.tsx - Assessment Clínico Estruturado
// Interface para conduzir assessment terapêutico e gerar formulação de caso

"use client";
import React, { useState, useEffect } from 'react';
import { caseFormulationService, AssessmentQuestion, CaseFormulation } from '../lib/case-formulation';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';

interface AssessmentState {
  currentQuestionIndex: number;
  responses: Record<string, any>;
  completed: boolean;
  formulation?: CaseFormulation;
}

export default function CaseFormulationAssessment() {
  const userAuth = useAuthenticatedUser();
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    currentQuestionIndex: 0,
    responses: {},
    completed: false
  });
  
  const [questions] = useState<AssessmentQuestion[]>(() => 
    caseFormulationService['getAssessmentQuestions']()
  );
  
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const currentQuestion = questions[assessmentState.currentQuestionIndex];
  const progress = ((assessmentState.currentQuestionIndex + 1) / questions.length) * 100;

  // Carregar formulação existente se houver
  useEffect(() => {
    if (userAuth.user?.id) {
      const existing = caseFormulationService.loadFormulation(userAuth.user.id);
      if (existing) {
        setShowResults(true);
        setAssessmentState(prev => ({
          ...prev,
          completed: true,
          formulation: existing
        }));
      }
    }
  }, [userAuth.user?.id]);

  const handleResponse = (value: any) => {
    const newResponses = {
      ...assessmentState.responses,
      [currentQuestion.id]: value
    };
    
    setAssessmentState(prev => ({
      ...prev,
      responses: newResponses
    }));
  };

  const nextQuestion = () => {
    if (assessmentState.currentQuestionIndex < questions.length - 1) {
      setAssessmentState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      completeAssessment();
    }
  };

  const previousQuestion = () => {
    if (assessmentState.currentQuestionIndex > 0) {
      setAssessmentState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const completeAssessment = async () => {
    if (!userAuth.user?.id) return;
    
    setIsProcessing(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar formulação inicial
      const initialFormulation = caseFormulationService.generateInitialFormulation(assessmentState.responses);
      
      const fullFormulation: CaseFormulation = {
        userId: userAuth.user.id,
        sessionId: userAuth.currentSession?.id || 'assessment',
        ...initialFormulation,
        createdAt: new Date(),
        lastUpdated: new Date()
      } as CaseFormulation;
      
      // Gerar hipóteses terapêuticas
      const hypotheses = caseFormulationService.generateTherapeuticHypotheses(fullFormulation);
      
      // Gerar plano de tratamento
      const interventionPlan = caseFormulationService.generateTreatmentPlan(fullFormulation, hypotheses);
      fullFormulation.interventionPlan = interventionPlan;
      
      // Salvar formulação
      caseFormulationService.saveFormulation(fullFormulation);
      
      setAssessmentState(prev => ({
        ...prev,
        completed: true,
        formulation: fullFormulation
      }));
      
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao processar assessment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'open':
        return (
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={assessmentState.responses[currentQuestion.id] || ''}
            onChange={(e) => handleResponse(e.target.value)}
          />
        );
        
      case 'scale':
        const scale = currentQuestion.scale!;
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{scale.labels[0]}</span>
              <span className="text-sm text-gray-600">{scale.labels[scale.labels.length - 1]}</span>
            </div>
            <input
              type="range"
              min={scale.min}
              max={scale.max}
              value={assessmentState.responses[currentQuestion.id] || scale.min}
              onChange={(e) => handleResponse(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">
                {assessmentState.responses[currentQuestion.id] || scale.min}
              </span>
            </div>
          </div>
        );
        
      case 'checklist':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(assessmentState.responses[currentQuestion.id] || []).includes(option)}
                  onChange={(e) => {
                    const current = assessmentState.responses[currentQuestion.id] || [];
                    const updated = e.target.checked 
                      ? [...current, option]
                      : current.filter((item: string) => item !== option);
                    handleResponse(updated);
                  }}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={assessmentState.responses[currentQuestion.id] === option}
                  onChange={(e) => handleResponse(e.target.value)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderFormulationResults = () => {
    if (!assessmentState.formulation) return null;
    
    const formulation = assessmentState.formulation;
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Concluído
          </h2>
          <p className="text-gray-600">
            Sua formulação de caso foi gerada com sucesso
          </p>
        </div>

        {/* Problemas Principais */}
        {formulation.presentingProblems && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              Problemas Principais
            </h3>
            <div className="space-y-2">
              {formulation.presentingProblems.primary.map((problem, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-blue-800">{problem}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center space-x-4 text-sm">
              <span className="text-blue-700">
                <strong>Severidade:</strong> {formulation.presentingProblems.severity}/10
              </span>
              <span className="text-blue-700">
                <strong>Duração:</strong> {formulation.presentingProblems.duration}
              </span>
            </div>
          </div>
        )}

        {/* Fatores Perpetuadores */}
        {formulation.perpetuatingFactors && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
              <span className="mr-2">🔄</span>
              Fatores que Mantêm o Problema
            </h3>
            
            {formulation.perpetuatingFactors.cognitive?.cognitive_distortions?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">Padrões de Pensamento:</h4>
                <div className="flex flex-wrap gap-2">
                  {formulation.perpetuatingFactors.cognitive.cognitive_distortions.map((distortion, index) => (
                    <span key={index} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                      {distortion}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {formulation.perpetuatingFactors.behavioral?.avoidance_patterns?.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Padrões Comportamentais:</h4>
                <div className="space-y-1">
                  {formulation.perpetuatingFactors.behavioral.avoidance_patterns.map((pattern, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span className="text-yellow-800">{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recursos e Forças */}
        {formulation.protectiveFactors && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <span className="mr-2">💪</span>
              Seus Recursos e Forças
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formulation.protectiveFactors.personal?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Recursos Pessoais:</h4>
                  <div className="space-y-1">
                    {formulation.protectiveFactors.personal.map((resource, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-green-800">{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formulation.protectiveFactors.social?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Apoio Social:</h4>
                  <div className="space-y-1">
                    {formulation.protectiveFactors.social.map((support, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-green-800">{support}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Plano de Tratamento */}
        {formulation.interventionPlan && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Plano de Tratamento Personalizado
            </h3>
            
            <div className="space-y-6">
              {/* Fase 1 */}
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Fase 1: {formulation.interventionPlan.phase1.focus}
                </h4>
                <p className="text-sm text-purple-700 mb-2">
                  <strong>Duração:</strong> {formulation.interventionPlan.phase1.duration}
                </p>
                <div className="space-y-1">
                  {formulation.interventionPlan.phase1.goals.map((goal, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">→</span>
                      <span className="text-purple-800 text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fase 2 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Fase 2: {formulation.interventionPlan.phase2.focus}
                </h4>
                <p className="text-sm text-purple-700 mb-2">
                  <strong>Duração:</strong> {formulation.interventionPlan.phase2.duration}
                </p>
                <div className="space-y-1">
                  {formulation.interventionPlan.phase2.goals.map((goal, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">→</span>
                      <span className="text-purple-800 text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fase 3 */}
              <div className="border-l-4 border-purple-600 pl-4">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Fase 3: {formulation.interventionPlan.phase3.focus}
                </h4>
                <p className="text-sm text-purple-700 mb-2">
                  <strong>Duração:</strong> {formulation.interventionPlan.phase3.duration}
                </p>
                <div className="space-y-1">
                  {formulation.interventionPlan.phase3.goals.map((goal, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">→</span>
                      <span className="text-purple-800 text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowResults(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Revisar Assessment
          </button>
          <button
            onClick={() => window.location.href = '/chat'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Terapia Personalizada
          </button>
        </div>
      </div>
    );
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processando Assessment
          </h2>
          <p className="text-gray-600 mb-4">
            Analisando suas respostas e gerando formulação personalizada...
          </p>
          <div className="text-sm text-gray-500">
            Isso pode levar alguns segundos
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {renderFormulationResults()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Terapêutico
          </h1>
          <p className="text-gray-600 mb-4">
            Este questionário me ajuda a entender melhor sua situação e personalizar nossa terapia
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Pergunta {assessmentState.currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">
                  {assessmentState.currentQuestionIndex + 1}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentQuestion?.question}
                </h2>
                {currentQuestion?.clinical_significance === 'high' && (
                  <div className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                    <span className="mr-1">🔍</span>
                    Pergunta clínica importante
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            {renderQuestion()}
          </div>

          {/* Follow-up questions */}
          {currentQuestion?.follow_up && assessmentState.responses[currentQuestion.id] && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-900 mb-2">Para reflexão:</h4>
              <ul className="space-y-1">
                {currentQuestion.follow_up.map((followUp, index) => (
                  <li key={index} className="text-blue-800 text-sm flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{followUp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={assessmentState.currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="text-sm text-gray-500">
              {assessmentState.currentQuestionIndex + 1} / {questions.length}
            </div>

            <button
              onClick={nextQuestion}
              disabled={!assessmentState.responses[currentQuestion?.id]}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assessmentState.currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>
            💡 Suas respostas são confidenciais e usadas apenas para personalizar sua experiência terapêutica
          </p>
        </div>
      </div>
    </div>
  );
}