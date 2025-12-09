
import { NextRequest, NextResponse } from "next/server";
import { validateString, validateRequired } from "@/lib/validate";
import { askOpenAI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = ["userId", "message"];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (!validateString(body.userId) || !validateString(body.message)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    // Integração real com OpenAI
    const reply = await askOpenAI(body.message);
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao processar mensagem." }, { status: 500 });
  }
}
