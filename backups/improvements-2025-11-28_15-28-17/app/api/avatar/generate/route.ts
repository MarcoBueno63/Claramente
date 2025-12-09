// app/api/avatar/generate/route.ts - API Route para gerar vídeos D-ID
import { NextRequest, NextResponse } from 'next/server';

interface GenerateAvatarRequest {
  text: string;
  emotion?: string;
  sourceImageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateAvatarRequest = await request.json();
    const { text, emotion = 'neutral', sourceImageUrl = '/clara-real.jpg' } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DID_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'D-ID API key not configured' },
        { status: 500 }
      );
    }

    // Mapeamento de emoções
    const emotionExpressions: Record<string, { expression: string; intensity: number }> = {
      empathy: { expression: 'serious', intensity: 0.7 },
      celebration: { expression: 'happy', intensity: 1.0 },
      concern: { expression: 'sad', intensity: 0.6 },
      encouragement: { expression: 'happy', intensity: 0.8 },
      neutral: { expression: 'neutral', intensity: 0.5 },
      surprise: { expression: 'surprise', intensity: 0.9 },
      thinking: { expression: 'serious', intensity: 0.5 }
    };

    const emotionConfig = emotionExpressions[emotion] || emotionExpressions.neutral;

    // Criar talk com D-ID
    const createResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: 'pt-BR-FranciscaNeural'
          }
        },
        source_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}${sourceImageUrl}`,
        config: {
          fluent: true,
          pad_audio: 0,
          driver_expressions: {
            expressions: [
              {
                start_frame: 0,
                expression: emotionConfig.expression,
                intensity: emotionConfig.intensity
              }
            ]
          }
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('D-ID API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create D-ID talk', details: errorText },
        { status: createResponse.status }
      );
    }

    const data = await createResponse.json();

    return NextResponse.json({
      success: true,
      talkId: data.id,
      status: data.status
    });
  } catch (error) {
    console.error('Error generating avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Endpoint para verificar status do vídeo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const talkId = searchParams.get('talkId');

    if (!talkId) {
      return NextResponse.json(
        { error: 'talkId is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DID_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'D-ID API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.d-id.com/talks/${talkId}`, {
      headers: {
        'Authorization': `Basic ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to get talk status', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data.status,
      resultUrl: data.result_url,
      error: data.error
    });
  } catch (error) {
    console.error('Error checking talk status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
