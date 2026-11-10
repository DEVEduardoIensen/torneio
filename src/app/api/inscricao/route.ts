import { NextRequest, NextResponse } from 'next/server';
import {
  getActiveTemporada,
  getInscricoesByTemporada,
  upsertInscricao,
} from '@/lib/db';

export async function GET() {
  const temp = getActiveTemporada();
  return NextResponse.json({
    inscricoes: getInscricoesByTemporada(temp.id),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const temp = getActiveTemporada();
    const saved = upsertInscricao({
      ...body,
      temporada_id: body.temporada_id || temp.id,
    });
    return NextResponse.json({ inscricao: saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao processar inscrição.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

