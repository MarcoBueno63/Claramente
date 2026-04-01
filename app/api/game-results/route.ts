import { NextRequest, NextResponse } from 'next/server';

// Simples armazenamento em memória (substitua por banco de dados em produção)
interface GameResult {
  userId: string;
  game: string;
  score: number;
  details?: {
    moves?: number;
    round?: number;
    responses?: unknown[];
  };
  timestamp: string;
}

const results: GameResult[] = [];

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Espera: { userId, game, score, details, timestamp }
  results.push({ ...data, timestamp: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Retorna todos os resultados salvos
  return NextResponse.json(results);
}
