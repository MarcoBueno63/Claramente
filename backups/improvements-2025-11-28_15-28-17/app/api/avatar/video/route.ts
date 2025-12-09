import { NextRequest, NextResponse } from 'next/server';
import { createVideoFromAudio } from '@/lib/did';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64, script } = body;
    if (!audioBase64 && !script) return NextResponse.json({ error: 'audioBase64 or script required' }, { status: 400 });
    
    try {
      const data = await createVideoFromAudio(audioBase64, script);
      return NextResponse.json({ result: data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message || 'D-ID error' }, { status: 502 });
    }
  } catch (parseErr: unknown) {
    console.error('[api/avatar/video] request parse error:', parseErr);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}