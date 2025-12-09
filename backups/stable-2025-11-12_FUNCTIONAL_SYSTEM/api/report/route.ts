import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Relatório simples: sessões por usuário
    const users = await prisma.user.findMany({
      include: { sessions: true }
    });
    return NextResponse.json(users);
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao gerar relatório." }, { status: 500 });
  }
}
