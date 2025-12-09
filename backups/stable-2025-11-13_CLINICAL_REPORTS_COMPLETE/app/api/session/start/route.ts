import { NextRequest, NextResponse } from "next/server";

// Cache simples em memória para sessões (temporário até configurar banco)
const sessions = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validações básicas
    if (!body.userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    // Criar sessão simples
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const session = {
      id: sessionId,
      userId: body.userId,
      language: body.language || "pt-BR",
      persona: body.persona || "empática",
      style: body.style || "conversacional",
      status: "active",
      startedAt: new Date().toISOString(),
      messages: []
    };

    // Salvar na memória
    sessions.set(sessionId, session);
    
    console.log(`Sessão criada com sucesso: ${sessionId}`);
    return NextResponse.json(session);
    
  } catch (err: unknown) {
    console.error("Erro ao iniciar sessão:", err);
    return NextResponse.json({ 
      error: "Erro ao iniciar sessão",
      id: `temp_${Date.now()}`,
      status: "active",
      startedAt: new Date().toISOString()
    }, { status: 200 }); // Retornar 200 para não quebrar o fluxo
  }
}