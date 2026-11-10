import { NextRequest, NextResponse } from 'next/server';
import {
  deletePatrocinador,
  getActiveTemporada,
  getPatrocinadoresByTemporada,
  upsertPatrocinador,
} from '@/lib/db';

export async function GET() {
  const temp = getActiveTemporada();
  return NextResponse.json({
    patrocinadores: getPatrocinadoresByTemporada(temp.id),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const temp = getActiveTemporada();
    const saved = upsertPatrocinador({
      ...body,
      temporada_id: body.temporada_id || temp.id,
    });
    return NextResponse.json({ patrocinador: saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao salvar patrocinador.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID do patrocinador é obrigatório.' }, { status: 400 });
    }
    deletePatrocinador(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao excluir patrocinador.' },
      { status: 500 }
    );
  }
}
