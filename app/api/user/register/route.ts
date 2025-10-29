import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.locale) {
      return NextResponse.json({ error: "Dados obrigatórios ausentes." }, { status: 400 });
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
    return NextResponse.json({ error: "Erro ao registrar usuário." }, { status: 500 });
  }
}
