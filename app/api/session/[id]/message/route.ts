import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateString, validateRequired } from "@/lib/validate";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const sessionId = params.id;
    const requiredFields = ["content", "role"];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (!validateString(sessionId) || !validateString(body.content) || !validateString(body.role)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: {
        sessionId,
        content: body.content,
        role: body.role,
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao enviar mensagem." }, { status: 500 });
  }
}
