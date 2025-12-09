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
    const { sessionId, eventType, eventData } = body
    const userId = (session.user as any).id

    // Salvar evento de analytics
    await saveAnalyticsEvent(userId, sessionId, eventType, eventData)

    // Atualizar estatísticas do usuário se necessário
    if (eventType === 'session_end') {
      await updateUserStatistics(userId, eventData)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao rastrear evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function saveAnalyticsEvent(userId: string, sessionId: string, eventType: string, eventData: any) {
  // Como não temos uma tabela específica de analytics, vamos usar estratégias alternativas
  
  switch (eventType) {
    case 'session_start':
      // Atualizar sessão existente ou criar entrada de log
      await prisma.session.updateMany({
        where: { id: sessionId },
        data: {
          // Dados já estão sendo salvos na criação da sessão
        }
      })
      break
      
    case 'session_end':
      // Atualizar sessão com dados de finalização
      await prisma.session.updateMany({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          durationMin: eventData.durationMinutes || 0,
          status: 'ended'
        }
      })
      break
      
    case 'technique_applied':
      // Salvar como mensagem do sistema para tracking
      await prisma.message.create({
        data: {
          sessionId,
          role: 'system',
          content: `Técnica aplicada: ${eventData.technique}`,
          createdAt: new Date()
        }
      })
      break
      
    case 'emotion_detected':
      // Atualizar sessão com emoção detectada
      const currentSession = await prisma.session.findUnique({
        where: { id: sessionId }
      })
      
      if (currentSession) {
        const updatedEmotions = [...(currentSession.detectedEmotions || []), eventData.emotion]
        await prisma.session.update({
          where: { id: sessionId },
          data: {
            detectedEmotions: updatedEmotions
          }
        })
      }
      break
      
    case 'assessment_completed':
      // Os dados da avaliação já são salvos pela API específica
      console.log('Avaliação completada:', eventData)
      break
      
    default:
      console.log('Evento de analytics não específico:', eventType, eventData)
  }
}

async function updateUserStatistics(userId: string, sessionData: any) {
  try {
    // Por enquanto, apenas log dos dados - implementar quando o modelo UserStatistics estiver funcionando
    console.log('Atualizando estatísticas do usuário:', userId, sessionData)
    
    // TODO: Implementar quando resolver problemas de Prisma com UserStatistics
    // const currentStats = await prisma.userStatistics.findUnique({
    //   where: { userId }
    // })
  } catch (error) {
    console.error('Erro ao atualizar estatísticas do usuário:', error)
  }
}