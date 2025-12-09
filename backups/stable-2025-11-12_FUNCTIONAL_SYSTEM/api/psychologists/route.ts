import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const psychologists = await prisma.psychologist.findMany();
  return NextResponse.json(psychologists);
}
