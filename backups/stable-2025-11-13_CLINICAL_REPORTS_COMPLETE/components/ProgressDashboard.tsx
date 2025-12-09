'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

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
  completedAt: string
  overallRiskLevel: string
  primaryConcerns: string[]
  scaleResults: {
    scaleId: string
    scaleName: string
    score: number
    riskLevel: string
  }[]
}

export default function ProgressDashboard() {
  const { data: session } = useSession()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    if (session?.user) {
      fetchProgressData()
      fetchAssessmentHistory()
    }
  }, [session, selectedPeriod])

  const fetchProgressData = async () => {
    try {
      const response = await fetch(`/api/progress/stats?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setProgressData(data.stats)
      }
    } catch (error) {
      console.error('Erro ao buscar dados de progresso:', error)
    }
  }

  const fetchAssessmentHistory = async () => {
    try {
      const response = await fetch(`/api/assessment/save?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setAssessmentHistory(data.assessments)
      }
    } catch (error) {
      console.error('Erro ao buscar histórico de avaliações:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-100',
      'medium': 'text-yellow-600 bg-yellow-100', 
      'high': 'text-orange-600 bg-orange-100',
      'critical': 'text-red-600 bg-red-100'
    }
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const getRiskLevelText = (level: string) => {
    const texts = {
      'low': 'Baixo',
      'medium': 'Moderado',
      'high': 'Alto', 
      'critical': 'Crítico'
    }
    return texts[level as keyof typeof texts] || level
  }

  const calculateProgressTrend = (): 'improving' | 'stable' | 'declining' => {
    if (!progressData || progressData.riskLevelHistory.length < 2) return 'stable'
    
    const recent = progressData.riskLevelHistory.slice(-3)
    const riskValues = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 }
    
    const trend = recent.reduce((sum, level, index) => {
      if (index === 0) return 0
      const prev = riskValues[recent[index-1] as keyof typeof riskValues]
      const curr = riskValues[level as keyof typeof riskValues]
      return sum + (prev - curr) // Redução no risco = positivo
    }, 0)
    
    if (trend > 0) return 'improving'
    if (trend < 0) return 'declining'
    return 'stable'
  }

  const getProgressIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving': return '📈'
      case 'declining': return '📉'
      default: return '📊'
    }
  }

  const generateInsights = (): string[] => {
    if (!progressData) return []
    
    const insights: string[] = []
    
    // Análise de frequência
    if (progressData.totalSessions < 3) {
      insights.push("Considere sessões mais regulares para melhores resultados terapêuticos")
    }
    
    // Análise de melhoria
    if (progressData.improvementScore > 20) {
      insights.push("Você está mostrando sinais claros de melhoria! Continue o bom trabalho.")
    } else if (progressData.improvementScore < -10) {
      insights.push("Parece que você pode estar enfrentando alguns desafios. Considere buscar suporte adicional.")
    }
    
    // Análise de técnicas
    const topTechnique = progressData.appliedTechniques[0]
    if (topTechnique) {
      insights.push(`A técnica "${topTechnique}" tem sido mais utilizada em suas sessões`)
    }
    
    // Análise de duração
    if (progressData.averageSessionDuration < 20) {
      insights.push("Sessões mais longas podem proporcionar maior aprofundamento terapêutico")
    }
    
    return insights
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const trend = calculateProgressTrend()
  const insights = generateInsights()

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatório de Progresso</h1>
          <p className="text-gray-600 mt-2">Acompanhe sua evolução terapêutica</p>
        </div>
        
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === '7d' ? '7 dias' : 
               period === '30d' ? '30 dias' :
               period === '90d' ? '90 dias' : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Sessões</p>
              <p className="text-3xl font-bold text-gray-900">{progressData?.totalSessions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avaliações Feitas</p>
              <p className="text-3xl font-bold text-gray-900">{progressData?.totalAssessments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Duração Média</p>
              <p className="text-3xl font-bold text-gray-900">{progressData?.averageSessionDuration || 0}min</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Score de Melhoria</p>
              <p className={`text-3xl font-bold ${
                (progressData?.improvementScore || 0) > 0 ? 'text-green-600' : 
                (progressData?.improvementScore || 0) < 0 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {(progressData?.improvementScore || 0) > 0 ? '+' : ''}{progressData?.improvementScore || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{getProgressIcon(trend)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gráfico de Evolução do Risco */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Nível de Risco</h3>
        
        {progressData?.riskLevelHistory && progressData.riskLevelHistory.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {progressData.riskLevelHistory.map((level, index) => (
                <div key={index} className="flex flex-col items-center min-w-0 flex-shrink-0">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(level)}`}>
                    {getRiskLevelText(level)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Sessão {index + 1}
                  </div>
                  {index < progressData.riskLevelHistory.length - 1 && (
                    <div className="flex items-center mt-2">
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <span className="text-xs text-gray-400 mx-1">→</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className={`p-4 rounded-lg ${
              trend === 'improving' ? 'bg-green-50 border border-green-200' :
              trend === 'declining' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <p className="text-sm font-medium">
                {trend === 'improving' ? '📈 Tendência de Melhoria' :
                 trend === 'declining' ? '📉 Necessita Atenção' :
                 '📊 Estabilidade Mantida'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">📊</span>
            <p>Nenhuma avaliação de risco ainda.</p>
            <p className="text-sm">Complete uma avaliação psicométrica para ver sua evolução.</p>
          </div>
        )}
      </motion.div>

      {/* Histórico de Avaliações */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Avaliações</h3>
        
        {assessmentHistory.length > 0 ? (
          <div className="space-y-4">
            {assessmentHistory.slice(0, 5).map((assessment) => (
              <div key={assessment.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(assessment.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                      getRiskLevelColor(assessment.overallRiskLevel)
                    }`}>
                      Risco: {getRiskLevelText(assessment.overallRiskLevel)}
                    </div>
                    {assessment.primaryConcerns.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Áreas: {assessment.primaryConcerns.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {assessment.scaleResults.length} escala{assessment.scaleResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">📋</span>
            <p>Nenhuma avaliação realizada ainda.</p>
            <p className="text-sm">Faça sua primeira avaliação psicométrica durante uma sessão.</p>
          </div>
        )}
      </motion.div>

      {/* Insights e Recomendações */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights e Recomendações</h3>
        
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 mt-0.5">💡</span>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">🔍</span>
            <p>Complete mais sessões para gerar insights personalizados.</p>
          </div>
        )}
      </motion.div>

      {/* Técnicas Mais Utilizadas */}
      {progressData?.appliedTechniques && progressData.appliedTechniques.length > 0 && (
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Técnicas Terapêuticas Utilizadas</h3>
          <div className="flex flex-wrap gap-2">
            {progressData.appliedTechniques.slice(0, 10).map((technique, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {technique}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}