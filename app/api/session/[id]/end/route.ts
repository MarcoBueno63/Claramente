import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateString, validateRequired } from '@/lib/validate';
import { verifyAuthToken } from '@/lib/auth-token';

const prisma = new PrismaClient();

export async function POST(req: Request, context: unknown) {
  try {
    const params = (context as { params?: { id?: string } })?.params;
    const sessionId = params?.id;
    const body = await req.json();
    const requiredFields = ['summary'];

    if (!validateRequired(body, requiredFields)) {
      return NextResponse.json({ error: 'Campo resumo obrigatório.' }, { status: 400 });
    }

    if (!validateString(sessionId) || !validateString(body.summary)) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const requestUserIdHeader = req.headers.get('x-user-id');
    const authTokenHeader = req.headers.get('x-auth-token');
    if (typeof requestUserIdHeader !== 'string' || requestUserIdHeader.length === 0) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    if (typeof authTokenHeader !== 'string' || authTokenHeader.length === 0) {
      return NextResponse.json({ error: 'Token ausente.' }, { status: 401 });
    }

    const requestUserId = requestUserIdHeader;
    const authToken = authTokenHeader;

    const tokenPayload = verifyAuthToken(authToken);
    if (!tokenPayload || tokenPayload.sub !== requestUserId) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ error: 'Sessão não encontrada.' }, { status: 404 });
    }

    if (session.userId !== requestUserId) {
      return NextResponse.json({ error: 'Acesso negado para esta sessão.' }, { status: 403 });
    }

    const durationMin = Math.max(
      0,
      Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)
    );

    const updated = await prisma.session.update({
      where: { id: sessionId as string },
      data: {
        status: 'ended',
        endedAt: new Date(),
        summary: body.summary,
        durationMin,
      },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Erro ao encerrar sessão.' }, { status: 500 });
  }
}
