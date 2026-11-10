import { NextRequest, NextResponse } from 'next/server';
import {
  deleteEtapa,
  getActiveTemporada,
  getEtapasByTemporada,
  upsertEtapa,
} from '@/lib/db';

export async function GET() {
  const temp = getActiveTemporada();
  return NextResponse.json({
    etapas: getEtapasByTemporada(temp.id),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const temp = getActiveTemporada();
    const saved = upsertEtapa({
      ...body,
      temporada_id: body.temporada_id || temp.id,
    });
    return NextResponse.json({ etapa: saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao salvar etapa.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID da etapa é obrigatório.' }, { status: 400 });
  }
  deleteEtapa(id);
  return NextResponse.json({ ok: true });
}

