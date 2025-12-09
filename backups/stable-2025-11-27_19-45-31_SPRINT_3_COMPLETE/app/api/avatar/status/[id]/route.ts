import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const key = process.env.DID_API_KEY;
    
    if (!key) {
      return NextResponse.json({ error: 'DID_API_KEY not configured' }, { status: 500 });
    }
    
    const res = await fetch(`https://api.d-id.com/talks/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `D-ID error: ${res.status} ${txt}` }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[api/avatar/status] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
