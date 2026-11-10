import { NextRequest, NextResponse } from 'next/server';
import {
  deleteCategoria,
  getActiveTemporada,
  getCategoriasByTemporada,
  upsertCategoria,
} from '@/lib/db';

export async function GET() {
  const temp = getActiveTemporada();
  return NextResponse.json({
    categorias: getCategoriasByTemporada(temp.id, true),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const temp = getActiveTemporada();
    const saved = upsertCategoria({
      ...body,
      temporada_id: body.temporada_id || temp.id,
    });
    return NextResponse.json({ categoria: saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao salvar categoria.' },
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
      return NextResponse.json({ error: 'ID da categoria é obrigatório.' }, { status: 400 });
    }
    deleteCategoria(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao excluir categoria.' },
      { status: 500 }
    );
  }
}
