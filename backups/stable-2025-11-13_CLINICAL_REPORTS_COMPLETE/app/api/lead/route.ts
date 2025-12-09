import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateString, validateRequired } from "@/lib/validate";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = ["userId", "psychologistId"];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (!validateString(body.userId) || !validateString(body.psychologistId)) {
      return NextResponse.json({ error: "IDs inválidos." }, { status: 400 });
    }
    const lead = await prisma.lead.create({
      data: {
        userId: body.userId,
        psychologistId: body.psychologistId,
        status: "new",
      },
    });
    return NextResponse.json(lead);
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar lead." }, { status: 500 });
  }
}
