import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateString, validateNumber, validateRequired } from "@/lib/validate";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = ["name", "crp", "specialty", "approach", "gender", "location", "price", "whatsapp", "rating", "experience"];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (!validateString(body.name) || !validateString(body.crp) || !validateString(body.specialty)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    if (!validateNumber(body.price) || !validateNumber(body.rating) || !validateNumber(body.experience)) {
      return NextResponse.json({ error: "Dados numéricos inválidos." }, { status: 400 });
    }
    const psychologist = await prisma.psychologist.create({
      data: {
        name: body.name,
        crp: body.crp,
        specialty: body.specialty,
        approach: body.approach,
        gender: body.gender,
        location: body.location,
        price: body.price,
        whatsapp: body.whatsapp,
        rating: body.rating,
        experience: body.experience,
      },
    });
    return NextResponse.json(psychologist);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao cadastrar psicólogo." }, { status: 500 });
  }
}
