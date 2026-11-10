import { NextRequest, NextResponse } from 'next/server';
import {
  createNotificacao,
  deleteNotificacao,
  getActiveTemporada,
  getNotificacoesByTemporada,
} from '@/lib/db';

export async function GET() {
  const temp = getActiveTemporada();
  return NextResponse.json({
    notificacoes: getNotificacoesByTemporada(temp.id),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const temp = getActiveTemporada();
    const created = createNotificacao({
      temporada_id: body.temporada_id || temp.id,
      etapa_id: body.etapa_id || null,
      titulo: String(body.titulo || 'Comunicado Oficial'),
      mensagem: String(body.mensagem || ''),
      tipo: body.tipo || 'aviso',
      fixado: Boolean(body.fixado),
      autor_nome: String(body.autor_nome || 'Comissão Organizadora'),
    });
    return NextResponse.json({ notificacao: created });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao publicar comunicado.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID da notificação é obrigatório.' }, { status: 400 });
  }
  deleteNotificacao(id);
  return NextResponse.json({ ok: true });
}

