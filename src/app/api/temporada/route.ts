import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  computeAllRankings,
  getActiveTemporada,
  getAllPescadores,
  getCategoriasByTemporada,
  getEtapasByTemporada,
  getInscricoesByTemporada,
  getNotificacoesByTemporada,
  getPatrocinadoresByTemporada,
  getPescadorById,
  getRegistros,
  updateTemporada,
} from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeInactive = searchParams.get('all') === '1';

  const temporada = getActiveTemporada();
  const categorias = getCategoriasByTemporada(temporada.id, includeInactive);
  const etapas = getEtapasByTemporada(temporada.id);
  const inscricoes = getInscricoesByTemporada(temporada.id);
  const registros = getRegistros({ temporadaId: temporada.id });
  const patrocinadores = getPatrocinadoresByTemporada(temporada.id);
  const notificacoes = getNotificacoesByTemporada(temporada.id);
  const pescadores = getAllPescadores(temporada.id);
  const rankings = computeAllRankings(temporada.id);

  const cookieStore = await cookies();
  const userId = cookieStore.get('torneio_user_id')?.value || 'pesc-1';
  const currentUser = getPescadorById(userId, temporada.id) || pescadores[0];

  const etapaAtiva =
    etapas.find((e) => e.status === 'em_andamento') ||
    etapas.find((e) => e.status === 'inscricoes_abertas') ||
    etapas[0] ||
    null;

  return NextResponse.json({
    temporada,
    etapaAtiva,
    categorias,
    etapas,
    inscricoes,
    registros,
    patrocinadores,
    notificacoes,
    pescadores,
    rankings,
    currentUser,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const active = getActiveTemporada();
    const updated = updateTemporada({
      ...body,
      id: body.id || active.id,
    });
    return NextResponse.json({ temporada: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao atualizar temporada.' },
      { status: 500 }
    );
  }
}

