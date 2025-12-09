'use client'

import React, { useState, useEffect } from 'react'
// CSS animations nativas - sem Framer Motion para performance otimizada
// Tipos simplificados para funcionamento sem dependências externas
interface SimpleScale {
  id: string
  name: string
  description: string
  questions: SimpleQuestion[]
  interpretationRules: InterpretationRule[]
}

interface SimpleQuestion {
  id: string
  text: string
  scale: AnswerOption[]
}

interface AnswerOption {
  value: number
  label: string
}

interface InterpretationRule {
  minScore: number
  maxScore: number
  level: 'baixo' | 'médio' | 'alto'
  interpretation: string
}

interface PsychometricAssessmentProps {
  suggestedScales?: string[]
  onComplete: (results: AssessmentResults) => void
  onCancel: () => void
}

interface AssessmentResults {
  scaleId: string
  scaleName: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: 'baixo' | 'médio' | 'alto'
  interpretation: string
  recommendations: string[]
  responses: { questionId: string; answer: number }[]
  completedAt: string
}

export default function PsychometricAssessmentComponent({
  suggestedScales = [],
  onComplete,
  onCancel
}: PsychometricAssessmentProps) {
  // 🚀 MOCK: Substituir por sistema de auth escolhido
  const session = { user: { id: 'mock-user', name: 'Usuário Teste' } };

  const [selectedScale, setSelectedScale] = useState<SimpleScale | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<{ [questionId: string]: number }>({})
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  // Escalas disponíveis (mock para funcionamento)
  const availableScales: SimpleScale[] = [
    {
      id: 'phq9',
      name: 'PHQ-9 - Rastreio de Depressão',
      description: 'Avaliação rápida de sintomas depressivos',
      questions: [
        {
          id: 'phq9_1',
          text: 'Pouco interesse ou prazer em fazer as coisas',
          scale: [
            { value: 0, label: 'Nenhuma vez' },
            { value: 1, label: 'Vários dias' },
            { value: 2, label: 'Mais da metade dos dias' },
            { value: 3, label: 'Quase todos os dias' }
          ]
        },
        {
          id: 'phq9_2',
          text: 'Sentir-se para baixo, deprimido(a) ou sem esperança',
          scale: [
            { value: 0, label: 'Nenhuma vez' },
            { value: 1, label: 'Vários dias' },
            { value: 2, label: 'Mais da metade dos dias' },
            { value: 3, label: 'Quase todos os dias' }
          ]
        },
        {
          id: 'phq9_3',
          text: 'Dificuldade para adormecer, permanecer dormindo ou dormir demais',
          scale: [
            { value: 0, label: 'Nenhuma vez' },
            { value: 1, label: 'Vários dias' },
            { value: 2, label: 'Mais da metade dos dias' },
            { value: 3, label: 'Quase todos os dias' }
          ]
        }
      ],
      interpretationRules: [
        { minScore: 0, maxScore: 4, level: 'baixo', interpretation: 'Sintomas mínimos' },
        { minScore: 5, maxScore: 9, level: 'médio', interpretation: 'Sintomas leves' },
        { minScore: 10, maxScore: 27, level: 'alto', interpretation: 'Sintomas moderados a graves' }
      ]
    },
    {
      id: 'gad7',
      name: 'GAD-7 - Rastreio de Ansiedade',
      description: 'Avaliação de sintomas de ansiedade generalizada',
      questions: [
        {
          id: 'gad7_1',
          text: 'Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)',
          scale: [
            { value: 0, label: 'Nenhuma vez' },
            { value: 1, label: 'Vários dias' },
            { value: 2, label: 'Mais da metade dos dias' },
            { value: 3, label: 'Quase todos os dias' }
          ]
        },
        {
          id: 'gad7_2',
          text: 'Não conseguir parar ou controlar as preocupações',
          scale: [
            { value: 0, label: 'Nenhuma vez' },
            { value: 1, label: 'Vários dias' },
            { value: 2, label: 'Mais da metade dos dias' },
            { value: 3, label: 'Quase todos os dias' }
          ]
        }
      ],
      interpretationRules: [
        { minScore: 0, maxScore: 4, level: 'baixo', interpretation: 'Ansiedade mínima' },
        { minScore: 5, maxScore: 9, level: 'médio', interpretation: 'Ansiedade leve' },
        { minScore: 10, maxScore: 21, level: 'alto', interpretation: 'Ansiedade moderada a grave' }
      ]
    }
  ];

  const calculateResults = (scale: SimpleScale, responses: { [key: string]: number }): AssessmentResults => {
    const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0)
    const maxScore = scale.questions.length * 3 // Assumindo escala 0-3
    const percentage = Math.round((totalScore / maxScore) * 100)

    const interpretation = scale.interpretationRules.find(
      rule => totalScore >= rule.minScore && totalScore <= rule.maxScore
    )

    return {
      scaleId: scale.id,
      scaleName: scale.name,
      totalScore,
      maxScore,
      percentage,
      riskLevel: interpretation?.level || 'médio',
      interpretation: interpretation?.interpretation || 'Interpretação não disponível',
      recommendations: [
        'Continue acompanhando seus sintomas',
        'Considere buscar apoio profissional se necessário',
        'Pratique técnicas de bem-estar diariamente'
      ],
      responses: Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      })),
      completedAt: new Date().toISOString()
    }
  }

  const handleScaleSelection = (scale: SimpleScale) => {
    setSelectedScale(scale)
    setShowInstructions(false)
    setCurrentQuestionIndex(0)
    setResponses({})
  }

  const handleResponse = (questionId: string, value: number) => {
    const newResponses = { ...responses, [questionId]: value }
    setResponses(newResponses)

    // Auto-avançar para próxima questão
    setTimeout(() => {
      if (currentQuestionIndex < selectedScale!.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // Completar avaliação
        const assessmentResults = calculateResults(selectedScale!, newResponses)
        setResults(assessmentResults)
        setIsComplete(true)
      }
    }, 500)
  }

  const handleComplete = () => {
    if (results) {
      onComplete(results)
    }
  }

  const resetAssessment = () => {
    setSelectedScale(null)
    setCurrentQuestionIndex(0)
    setResponses({})
    setIsComplete(false)
    setResults(null)
    setShowInstructions(true)
  }

  // Tela de seleção de escala
  if (showInstructions && !selectedScale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="animate-fade-in bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📋</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Avaliação Psicométrica
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Escolha uma escala de avaliação para monitorar seu bem-estar emocional. 
                Este questionário é confidencial e ajudará a entender melhor como você está se sentindo.
              </p>
            </div>

            <div className="space-y-4">
              {availableScales.map((scale, index) => (
                <div 
                  key={scale.id}
                  className="animate-stagger-item border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-200 cursor-pointer hover-lift"
                  onClick={() => handleScaleSelection(scale)}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {scale.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {scale.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-600 font-medium">
                      {scale.questions.length} questões • ~{Math.ceil(scale.questions.length * 0.5)} min
                    </span>
                    <div className="text-purple-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tela de resultados
  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="animate-scale-in bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {results.riskLevel === 'baixo' ? '😊' : 
                 results.riskLevel === 'médio' ? '😐' : '😔'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Avaliação Concluída
              </h2>
              <p className="text-gray-600">{results.scaleName}</p>
            </div>

            {/* Score Display */}
            <div className="animate-slide-up bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {results.totalScore}/{results.maxScore}
                </div>
                <div className="text-lg text-gray-700 font-medium mb-2">
                  {results.interpretation}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  results.riskLevel === 'baixo' ? 'bg-green-100 text-green-700' :
                  results.riskLevel === 'médio' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Nível: {results.riskLevel}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="animate-slide-up mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Recomendações:</h3>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="animate-stagger-item flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-500 mt-0.5">•</div>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={handleComplete}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-xl font-medium hover-lift transition-all duration-200 hover:bg-purple-700"
              >
                Salvar Resultados
              </button>
              <button
                onClick={resetAssessment}
                className="flex-1 bg-white text-purple-600 py-3 px-6 rounded-xl font-medium hover-lift transition-all duration-200 border-2 border-purple-600 hover:bg-purple-50"
              >
                Nova Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tela de questões
  if (selectedScale && !isComplete) {
    const currentQuestion = selectedScale.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / selectedScale.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="animate-fade-in bg-white rounded-2xl shadow-xl p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Questão {currentQuestionIndex + 1} de {selectedScale.questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="animate-slide-up mb-8">
              <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.scale.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleResponse(currentQuestion.id, option.value)}
                  className="animate-stagger-item w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 hover-lift"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-purple-300 rounded-full flex items-center justify-center text-purple-600 font-medium">
                      {option.value}
                    </div>
                    <span className="text-gray-700">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={currentQuestionIndex > 0 ? () => setCurrentQuestionIndex(currentQuestionIndex - 1) : onCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {currentQuestionIndex > 0 ? '← Anterior' : 'Cancelar'}
              </button>
              <div className="text-sm text-gray-400">
                Selecione uma resposta para continuar
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}