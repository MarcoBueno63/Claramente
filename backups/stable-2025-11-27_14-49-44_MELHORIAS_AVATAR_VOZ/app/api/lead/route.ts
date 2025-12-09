import { NextRequest, NextResponse } from 'next/server'
// Lead capture simplificado

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone, message } = body

    // 🚀 LEAD MOCK - Em produção integrar com CRM/Email service
    console.log('📧 New Lead:', {
      email,
      name,
      phone,
      message,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Lead registrado com sucesso' 
    })

  } catch (error) {
    console.error('Erro ao processar lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}