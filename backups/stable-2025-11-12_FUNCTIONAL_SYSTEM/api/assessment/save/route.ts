import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { assessments, overallAssessment, completedAt } = body

    // Salvar a avaliação psicométrica geral
    const psychometricAssessment = await prisma.psychometricAssessment.create({
      data: {
        userId: (session.user as any).id,
        overallRiskLevel: overallAssessment.riskLevel,
        primaryConcerns: overallAssessment.primaryConcerns,
        recommendations: overallAssessment.recommendations,
        urgentAction: overallAssessment.urgentAction,
        completedAt: new Date(completedAt)
      }
    })

    // Salvar os resultados individuais das escalas
    const scaleResults = await Promise.all(
      assessments.map(async (assessment: any) => {
        return prisma.psychometricScaleResult.create({
          data: {
            psychometricAssessmentId: psychometricAssessment.id,
            scaleId: assessment.scaleId,
            scaleName: assessment.scaleName,
            score: assessment.score,
            interpretation: assessment.interpretation,
            riskLevel: assessment.riskLevel,
            recommendations: assessment.recommendations
          }
        })
      })
    )

    // Atualizar estatísticas do usuário
    await updateUserStats((session.user as any).id, overallAssessment)

    return NextResponse.json({
      success: true,
      assessmentId: psychometricAssessment.id,
      scaleResults: scaleResults.map(r => r.id)
    })

  } catch (error) {
    console.error('Erro ao salvar avaliação psicométrica:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = (session.user as any).id

    // Buscar avaliações psicométricas do usuário
    const assessments = await prisma.psychometricAssessment.findMany({
      where: { userId },
      include: {
        scaleResults: true
      },
      orderBy: { completedAt: 'desc' },
      take: limit
    })

    return NextResponse.json({ assessments })

  } catch (error) {
    console.error('Erro ao buscar avaliações psicométricas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function updateUserStats(userId: string, overallAssessment: any) {
  try {
    // Buscar estatísticas atuais do usuário
    const currentStats = await prisma.userStatistics.findUnique({
      where: { userId }
    })

    if (!currentStats) {
      // Criar estatísticas iniciais
      await prisma.userStatistics.create({
        data: {
          userId,
          totalSessions: 0,
          totalAssessments: 1,
          averageSessionDuration: 0,
          lastAssessmentDate: new Date(),
          riskLevelHistory: [overallAssessment.riskLevel],
          improvementScore: 0
        }
      })
    } else {
      // Atualizar estatísticas existentes
      const newRiskHistory = [...(currentStats.riskLevelHistory || []), overallAssessment.riskLevel]
      
      // Calcular score de melhoria baseado na evolução do risco
      const improvementScore = calculateImprovementScore(newRiskHistory)

      await prisma.userStatistics.update({
        where: { userId },
        data: {
          totalAssessments: currentStats.totalAssessments + 1,
          lastAssessmentDate: new Date(),
          riskLevelHistory: newRiskHistory,
          improvementScore
        }
      })
    }
  } catch (error) {
    console.error('Erro ao atualizar estatísticas do usuário:', error)
  }
}

function calculateImprovementScore(riskHistory: string[]): number {
  if (riskHistory.length < 2) return 0

  const riskValues = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 4
  }

  // Comparar últimas 5 avaliações para calcular tendência
  const recentHistory = riskHistory.slice(-5)
  let improvementSum = 0
  
  for (let i = 1; i < recentHistory.length; i++) {
    const previousRisk = riskValues[recentHistory[i - 1] as keyof typeof riskValues] || 2
    const currentRisk = riskValues[recentHistory[i] as keyof typeof riskValues] || 2
    
    // Redução no risco é positiva
    const improvement = previousRisk - currentRisk
    improvementSum += improvement
  }

  // Normalizar para escala de -100 a +100
  return Math.max(-100, Math.min(100, (improvementSum / recentHistory.length) * 25))
}