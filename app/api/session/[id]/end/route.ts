import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateString, validateRequired } from "@/lib/validate";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;
    const body = await req.json();
    const requiredFields = ["summary"];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campo resumo obrigatório." }, { status: 400 });
    }
    if (!validateString(sessionId) || !validateString(body.summary)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "ended",
        endedAt: new Date(),
        summary: body.summary,
      },
    });
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao encerrar sessão." }, { status: 500 });
  }
}
