import { NextRequest, NextResponse } from "next/server";
import { validateString, validateRequired } from "@/lib/validate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = ["userId", "plan"];
    
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    
    if (!validateString(body.userId) || !validateString(body.plan)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Simulação de processamento de pagamento
    const result = {
      success: true,
      message: "Pagamento processado com sucesso",
      transactionId: `txn_${Date.now()}`
    };
    
    return NextResponse.json({ 
      status: "success",
      message: result.message,
      transactionId: result.transactionId,
      userId: body.userId, 
      plan: body.plan 
    });
    
  } catch (err: unknown) {
    console.error("Erro no checkout:", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}