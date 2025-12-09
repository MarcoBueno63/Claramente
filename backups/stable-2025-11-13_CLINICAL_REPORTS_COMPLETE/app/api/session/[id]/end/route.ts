import { NextResponse } from 'next/server';

// Minimal, self-contained handler for ending a session.
// Keep it DB-free for build stability; replace with real Prisma logic in production.
export async function POST(req: Request, context: unknown) {
  try {
    const params = (context as { params?: { id?: string } })?.params;
    const id = params?.id ?? null;
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const summary = body?.summary ?? `Session ${id} finalized`;
    return NextResponse.json({ ok: true, id, summary });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Invalid request' }, { status: 400 });
  }
}
