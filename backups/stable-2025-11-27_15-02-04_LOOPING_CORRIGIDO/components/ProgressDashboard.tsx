'use client'

import React, { useState, useEffect } from 'react'
// CSS animations nativas - sem Framer Motion para performance

interface ProgressData {
  userId: string
  totalSessions: number
  totalAssessments: number
  averageSessionDuration: number
  lastAssessmentDate: string | null
  riskLevelHistory: string[]
  improvementScore: number
  appliedTechniques: string[]
  primaryEmotions: string[]
  progressMilestones: any[]
}

interface AssessmentHistory {
  id: string
  date: string
  mood: number
  riskLevel: string
  primaryEmotion: string
  appliedTechniques: string[]
  sessionDuration: number
  insights: string[]
}

export default function ProgressDashboard() {
  // 🚀 MOCK: Substituir por sistema de auth escolhido
  const session = { user: { id: 'mock-user', name: 'Usuário Teste' } };

  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month')

  useEffect(() => {
    const loadProgressData = async () => {
      if (!session?.user?.id) return

      setLoading(true)
      try {
        // Mock data para demonstração
        const mockProgress: ProgressData = {
          userId: session.user.id,
          totalSessions: 12,
          totalAssessments: 15,
          averageSessionDuration: 28,
          lastAssessmentDate: new Date().toISOString(),
          riskLevelHistory: ['baixo', 'baixo', 'médio', 'baixo', 'baixo'],
          improvementScore: 78,
          appliedTechniques: ['Reestruturação Cognitiva', 'Mindfulness', 'Respiração Consciente'],
          primaryEmotions: ['ansiedade', 'tristeza', 'gratidão'],
          progressMilestones: [
            { type: 'streak', value: 7, date: '2025-11-10' },
            { type: 'technique_mastery', value: 'mindfulness', date: '2025-11-08' }
          ]
        }

        const mockHistory: AssessmentHistory[] = [
          {
            id: '1',
            date: '2025-11-13',
            mood: 7,
            riskLevel: 'baixo',
            primaryEmotion: 'calma',
            appliedTechniques: ['Mindfulness'],
            sessionDuration: 30,
            insights: ['Maior consciência corporal']
          },
          {
            id: '2', 
            date: '2025-11-12',
            mood: 6,
            riskLevel: 'baixo',
            primaryEmotion: 'ansiedade',
            appliedTechniques: ['Respiração Consciente'],
            sessionDuration: 25,
            insights: ['Técnicas de respiração eficazes']
          }
        ]

        setProgressData(mockProgress)
        setAssessmentHistory(mockHistory)
      } catch (error) {
        console.error('Erro ao carregar dados de progresso:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [session?.user?.id, selectedTimeframe])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu progresso...</p>
        </div>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados não disponíveis</h2>
            <p className="text-gray-600">Complete algumas sessões para ver seu progresso aqui.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Seu Progresso</h1>
          <p className="text-gray-600">Acompanhe sua jornada de autoconhecimento e bem-estar</p>
        </div>

        {/* Timeframe Selector */}
        <div className="animate-slide-up mb-6">
          <div className="flex space-x-4">
            {(['week', 'month', 'quarter'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover-lift ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                {timeframe === 'week' ? 'Última Semana' :
                 timeframe === 'month' ? 'Último Mês' : 'Últimos 3 Meses'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="animate-scale-in animate-delay-100 bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total de Sessões</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{progressData.totalSessions}</div>
            <p className="text-sm text-gray-500 mt-1">+2 esta semana</p>
          </div>

          <div className="animate-scale-in animate-delay-200 bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avaliações</h3>
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{progressData.totalAssessments}</div>
            <p className="text-sm text-gray-500 mt-1">Última: hoje</p>
          </div>

          <div className="animate-scale-in animate-delay-300 bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Duração Média</h3>
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{progressData.averageSessionDuration}min</div>
            <p className="text-sm text-gray-500 mt-1">Ideal: 25-30min</p>
          </div>

          <div className="animate-scale-in animate-delay-500 bg-white rounded-xl p-6 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Score de Melhoria</h3>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{progressData.improvementScore}%</div>
            <p className="text-sm text-gray-500 mt-1">Excelente progresso!</p>
          </div>
        </div>

        {/* Progress Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Risk Level Trend */}
          <div className="animate-slide-up bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              📈 Tendência de Risco
            </h3>
            <div className="space-y-3">
              {progressData.riskLevelHistory.slice(-5).map((level, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500 w-16">
                    -{5-index} dias
                  </div>
                  <div className="flex-1">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      level === 'baixo' ? 'bg-green-100 text-green-700' :
                      level === 'médio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applied Techniques */}
          <div className="animate-slide-up bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🛠️ Técnicas Aplicadas
            </h3>
            <div className="space-y-3">
              {progressData.appliedTechniques.map((technique, index) => (
                <div key={index} className="animate-stagger-item flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">{technique}</span>
                  <span className="text-sm text-blue-600 font-medium">
                    {Math.floor(Math.random() * 10) + 5}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent History */}
          <div className="animate-slide-up lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              📅 Histórico Recente
            </h3>
            <div className="space-y-4">
              {assessmentHistory.map((assessment, index) => (
                <div key={assessment.id} className="animate-stagger-item border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg hover-lift">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          {formatDate(assessment.date)}
                        </span>
                        <span className="text-2xl">
                          {assessment.mood >= 7 ? '😊' : assessment.mood >= 4 ? '😐' : '😔'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assessment.riskLevel === 'baixo' ? 'bg-green-100 text-green-700' :
                          assessment.riskLevel === 'médio' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Risco: {assessment.riskLevel}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <strong>Emoção:</strong> {assessment.primaryEmotion} | 
                        <strong> Duração:</strong> {assessment.sessionDuration}min
                      </div>
                      {assessment.insights.length > 0 && (
                        <div className="text-sm text-blue-600">
                          💡 {assessment.insights[0]}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {assessment.mood}/10
                      </div>
                      <div className="text-xs text-gray-500">
                        Humor
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="animate-fade-in mt-8 flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover-lift transition-all duration-200 hover:bg-blue-700">
            📊 Ver Relatório Completo
          </button>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover-lift transition-all duration-200 border-2 border-blue-600 hover:bg-blue-50">
            💾 Exportar Dados
          </button>
        </div>
      </div>
    </div>
  )
}