import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateString, validateRequired } from '@/lib/validate';

const prisma = new PrismaClient();

export async function POST(req: Request, context: unknown) {
  try {
    const params = (context as { params?: { id?: string } })?.params;
    const sessionId = params?.id;
    const body = await req.json();
    const requiredFields = ['content', 'role'];
    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }
    if (!validateString(sessionId) || !validateString(body.content) || !validateString(body.role)) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: {
        sessionId: sessionId as string,
        content: body.content,
        role: body.role,
      },
    });
    return NextResponse.json(message);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Erro ao enviar mensagem.' }, { status: 500 });
  }
}
