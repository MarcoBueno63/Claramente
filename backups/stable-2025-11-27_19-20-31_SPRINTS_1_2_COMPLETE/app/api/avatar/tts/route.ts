import { NextRequest, NextResponse } from 'next/server';
import { ttsToBase64 } from '@/lib/elevenlabs';

export async function POST(req: NextRequest) {
  // Basic request logging to help debug 5xx/502 responses locally
  try {
    const body = await req.json();
    const { text, voice } = body;
    console.log('[api/avatar/tts] request body:', { text: text ? '[redacted]' : text, voice });

    if (!text) {
      console.warn('[api/avatar/tts] missing text in request');
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    // Ensure ElevenLabs API key is present before calling external service
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenKey) {
      console.error('[api/avatar/tts] missing ELEVENLABS_API_KEY in environment');
      return NextResponse.json({ error: 'Server misconfiguration: missing ELEVENLABS_API_KEY' }, { status: 500 });
    }

    try {
      const b64 = await ttsToBase64(text, voice || 'alloy');
      console.log('[api/avatar/tts] TTS success, bytes:', b64 ? b64.length : 0);
      return NextResponse.json({ audioBase64: b64 });
    } catch (err: unknown) {
      // Log the full error (message + stack when available) for diagnosis
      if (err instanceof Error) {
        console.error('[api/avatar/tts] TTS error:', err.message);
        console.error(err.stack);
      } else {
        console.error('[api/avatar/tts] TTS unexpected error:', err);
      }
      const message = err instanceof Error ? err.message : String(err);
      // Propagate 502 to client but include a short message
      return NextResponse.json({ error: message || 'TTS error' }, { status: 502 });
    }
  } catch (parseErr) {
    console.error('[api/avatar/tts] request parse error:', parseErr);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
