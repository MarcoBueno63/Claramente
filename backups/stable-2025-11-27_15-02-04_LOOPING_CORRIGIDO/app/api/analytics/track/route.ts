import { NextRequest, NextResponse } from 'next/server'
// Analytics otimizado sem dependências pesadas

export async function POST(request: NextRequest) {
  try {
    // 🚀 ANALYTICS MOCK - Em produção usar sistema de analytics escolhido
    const body = await request.json()
    const { event, userId, data } = body

    // Simular gravação de analytics
    console.log('📊 Analytics Event:', {
      event,
      userId,
      timestamp: new Date().toISOString(),
      data
    })

    // Mock de resposta de sucesso
    return NextResponse.json({ 
      success: true, 
      message: 'Evento registrado com sucesso',
      eventId: `evt_${Date.now()}`
    })

  } catch (error) {
    console.error('Erro no analytics:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}