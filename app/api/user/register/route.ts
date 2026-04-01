import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateRequired } from "@/lib/validate";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = ["id", "locale"];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    // Verifica se o usuário já existe
    let user = await prisma.user.findUnique({ where: { id: body.id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: body.id,
          locale: body.locale,
          ageConfirmed: body.ageConfirmed || false,
          freeSessionsUsed: body.freeSessionsUsed || 0,
        },
      });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao registrar usuário." }, { status: 500 });
  }
}
