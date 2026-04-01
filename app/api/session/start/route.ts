import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateString, validateRequired } from "@/lib/validate";
import { issueAuthToken } from "@/lib/auth-token";

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

    // Verificar se o usuário existe, se não existir, criar
    let user = await prisma.user.findUnique({
      where: { id: body.userId }
    });

    if (!user) {
      console.log(`Criando usuário com ID: ${body.userId}`);
      user = await prisma.user.create({
        data: {
          id: body.userId,
          locale: body.language || "pt-BR",
          ageConfirmed: true,
          freeSessionsUsed: 0,
        }
      });
    }

    const session = await prisma.session.create({
      data: {
        userId: body.userId,
        language: body.language,
        persona: body.persona,
        style: body.style,
        status: "active",
        startedAt: new Date(),
      },
    });
    
    const authToken = issueAuthToken(body.userId);
    console.log(`Sessão criada com sucesso: ${session.id}`);
    return NextResponse.json({ ...session, authToken });
  } catch (err: unknown) {
    console.error("Erro ao iniciar sessão:", err);
    return NextResponse.json({ error: "Erro ao iniciar sessão." }, { status: 500 });
  }
}