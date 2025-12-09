import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const userId = (session.user as any).id

    // Calcular data de início baseada no período
    const startDate = calculateStartDate(period)

    // Buscar estatísticas do usuário (temporariamente comentado)
    const userStats = null // await prisma.userStatistics.findUnique({ where: { userId } })

    // Buscar sessões do período
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        startedAt: startDate ? { gte: startDate } : undefined
      },
      include: {
        messages: true
      },
      orderBy: { startedAt: 'desc' }
    })

    // Buscar avaliações psicométricas do período (temporariamente vazio)
    const assessments: any[] = [] // await prisma.psychometricAssessment.findMany(...)

    // Calcular métricas do período
    const stats = calculatePeriodStats(sessions, assessments, userStats)

    // Gerar relatório
    const report = generateProgressReport(stats, sessions, assessments, period)

    return NextResponse.json({
      success: true,
      stats,
      report,
      period
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas de progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Calcular data de início baseada no período
function calculateStartDate(period: string): Date | null {
  const now = new Date()
  
  switch (period) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    default:
      return null // 'all' - sem filtro de data
  }
}

// Calcular estatísticas do período
function calculatePeriodStats(sessions: any[], assessments: any[], userStats: any) {
  const totalSessions = sessions.length
  const totalAssessments = assessments.length
  
  // Calcular duração média das sessões
  const completedSessions = sessions.filter(s => s.endedAt)
  const averageSessionDuration = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((sum, session) => {
        const duration = (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / (1000 * 60)
        return sum + duration
      }, 0) / completedSessions.length)
    : 0

  // Extrair histórico de risco das avaliações
  const riskLevelHistory = assessments.map(a => a.overallRiskLevel).reverse()

  // Extrair técnicas aplicadas
  const appliedTechniques = extractAppliedTechniques(sessions)

  // Extrair emoções primárias
  const primaryEmotions = extractPrimaryEmotions(sessions)

  // Score de melhoria (do userStats ou calculado)
  const improvementScore = userStats?.improvementScore || calculateImprovementScore(riskLevelHistory)

  return {
    userId: userStats?.userId || null,
    totalSessions,
    totalAssessments,
    averageSessionDuration,
    lastAssessmentDate: assessments[0]?.completedAt || null,
    riskLevelHistory,
    improvementScore,
    appliedTechniques,
    primaryEmotions,
    progressMilestones: userStats?.progressMilestones || []
  }
}

// Extrair técnicas terapêuticas aplicadas
function extractAppliedTechniques(sessions: any[]): string[] {
  const techniques: { [key: string]: number } = {}
  
  sessions.forEach(session => {
    session.messages.forEach((message: any) => {
      if (message.technique) {
        techniques[message.technique] = (techniques[message.technique] || 0) + 1
      }
    })
    
    // Técnicas do nível da sessão
    session.appliedTechniques.forEach((technique: string) => {
      techniques[technique] = (techniques[technique] || 0) + 1
    })
  })

  // Retornar ordenado por frequência
  return Object.entries(techniques)
    .sort(([,a], [,b]) => b - a)
    .map(([technique]) => technique)
}

// Extrair emoções primárias detectadas
function extractPrimaryEmotions(sessions: any[]): string[] {
  const emotions: { [key: string]: number } = {}
  
  sessions.forEach(session => {
    session.detectedEmotions.forEach((emotion: string) => {
      emotions[emotion] = (emotions[emotion] || 0) + 1
    })
    
    session.messages.forEach((message: any) => {
      if (message.emotionalTone) {
        emotions[message.emotionalTone] = (emotions[message.emotionalTone] || 0) + 1
      }
    })
  })

  return Object.entries(emotions)
    .sort(([,a], [,b]) => b - a)
    .map(([emotion]) => emotion)
}

// Calcular score de melhoria baseado no histórico de risco
function calculateImprovementScore(riskHistory: string[]): number {
  if (riskHistory.length < 2) return 0

  const riskValues = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 4
  }

  let improvementSum = 0
  
  for (let i = 1; i < riskHistory.length; i++) {
    const previousRisk = riskValues[riskHistory[i - 1] as keyof typeof riskValues] || 2
    const currentRisk = riskValues[riskHistory[i] as keyof typeof riskValues] || 2
    
    // Redução no risco é positiva
    const improvement = previousRisk - currentRisk
    improvementSum += improvement
  }

  // Normalizar para escala de -100 a +100
  return Math.max(-100, Math.min(100, Math.round((improvementSum / riskHistory.length) * 25)))
}

// Gerar relatório de progresso
function generateProgressReport(stats: any, sessions: any[], assessments: any[], period: string) {
  const insights: string[] = []
  const recommendations: string[] = []

  // Análise de engajamento
  if (stats.totalSessions === 0) {
    insights.push("Primeira sessão - seja bem-vindo à sua jornada de autocuidado!")
    recommendations.push("Complete sua primeira sessão para estabelecer uma linha de base")
  } else if (stats.totalSessions < 3) {
    insights.push("Você está no início de sua jornada terapêutica")
    recommendations.push("Considere sessões regulares para melhores resultados")
  } else {
    insights.push(`Você tem mantido um bom engajamento com ${stats.totalSessions} sessões`)
  }

  // Análise de duração
  if (stats.averageSessionDuration > 0) {
    if (stats.averageSessionDuration < 15) {
      insights.push("Suas sessões têm sido relativamente breves")
      recommendations.push("Sessões mais longas podem proporcionar maior aprofundamento")
    } else if (stats.averageSessionDuration >= 25) {
      insights.push("Você tem aproveitado bem o tempo de sessão completo")
    }
  }

  // Análise de melhoria
  if (stats.improvementScore > 20) {
    insights.push("Excelente! Você está mostrando sinais claros de melhoria")
    recommendations.push("Continue praticando as estratégias que têm funcionado")
  } else if (stats.improvementScore < -10) {
    insights.push("Você pode estar enfrentando alguns desafios recentemente")
    recommendations.push("Considere buscar suporte profissional adicional")
    recommendations.push("Não hesite em entrar em contato se precisar de ajuda")
  } else {
    insights.push("Você está mantendo estabilidade em seu processo")
    recommendations.push("Continue monitorando seu bem-estar regularmente")
  }

  // Análise de avaliações
  if (stats.totalAssessments === 0) {
    recommendations.push("Considere fazer uma avaliação psicométrica para mapear seu estado atual")
  } else if (stats.totalAssessments >= 2) {
    insights.push("Ótimo! Você tem acompanhado seu progresso com avaliações regulares")
  }

  // Análise de técnicas
  if (stats.appliedTechniques.length > 0) {
    const topTechnique = stats.appliedTechniques[0]
    insights.push(`A técnica "${topTechnique}" tem sido mais utilizada em suas sessões`)
    
    if (stats.appliedTechniques.length >= 3) {
      insights.push("Você tem explorado diferentes abordagens terapêuticas")
    }
  }

  return {
    period,
    insights,
    recommendations,
    summary: generateSummary(stats, period),
    nextSteps: generateNextSteps(stats, assessments)
  }
}

// Gerar resumo do período
function generateSummary(stats: any, period: string): string {
  const periodText = {
    '7d': 'nos últimos 7 dias',
    '30d': 'no último mês', 
    '90d': 'nos últimos 3 meses',
    'all': 'desde o início'
  }[period] || period

  const sessions = stats.totalSessions
  const assessments = stats.totalAssessments
  const improvement = stats.improvementScore

  if (sessions === 0) {
    return `Você ainda não iniciou suas sessões. Que tal começar hoje?`
  }

  const improvementText = improvement > 0 
    ? `com melhoria de ${improvement} pontos`
    : improvement < 0 
    ? `com alguns desafios recentes`
    : 'mantendo estabilidade'

  return `${periodText}, você completou ${sessions} sessão${sessions !== 1 ? 'ões' : ''} e ${assessments} avaliação${assessments !== 1 ? 'ões' : ''}, ${improvementText}.`
}

// Gerar próximos passos
function generateNextSteps(stats: any, assessments: any[]): string[] {
  const steps: string[] = []

  // Baseado no último nível de risco
  const lastRisk = stats.riskLevelHistory[stats.riskLevelHistory.length - 1]
  
  if (lastRisk === 'critical' || lastRisk === 'high') {
    steps.push("Considere buscar suporte profissional presencial")
    steps.push("Mantenha contato regular com sua rede de apoio")
  }

  if (stats.totalSessions < 5) {
    steps.push("Continue suas sessões regularmente para estabelecer um padrão")
  }

  if (stats.totalAssessments === 0 || (assessments.length > 0 && 
      (Date.now() - new Date(assessments[0].completedAt).getTime()) > 30 * 24 * 60 * 60 * 1000)) {
    steps.push("Faça uma nova avaliação para acompanhar seu progresso")
  }

  steps.push("Continue praticando as técnicas aprendidas no dia a dia")
  steps.push("Monitore seus sentimentos e busque ajuda quando necessário")

  return steps
}