import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateString, validateRequired } from "@/lib/validate";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = ["userId", "language", "persona", "style"];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (!validateString(body.userId) || !validateString(body.language) || !validateString(body.persona) || !validateString(body.style)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const session = await prisma.session.create({
      data: {
        userId: body.userId,
        language: body.language,
        persona: body.persona,
        style: body.style,
        status: "active",
      },
    });
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao iniciar sessão." }, { status: 500 });
  }
}
