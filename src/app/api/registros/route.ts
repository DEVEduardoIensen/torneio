import { NextRequest, NextResponse } from 'next/server';
import {
  createRegistro,
  deleteRegistro,
  evaluateRegistro,
  getActiveTemporada,
  getCategoriasByTemporada,
  getEtapasByTemporada,
  getRegistros,
} from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const temp = getActiveTemporada();
  const registros = getRegistros({
    temporadaId: searchParams.get('temporadaId') || temp.id,
    etapaId: searchParams.get('etapaId') || undefined,
    categoriaId: searchParams.get('categoriaId') || undefined,
    pescadorId: searchParams.get('pescadorId') || undefined,
    status: searchParams.get('status') || undefined,
  });
  return NextResponse.json({ registros });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const temp = getActiveTemporada();
    const etapas = getEtapasByTemporada(temp.id);
    const categorias = getCategoriasByTemporada(temp.id, true);

    const categoria = categorias.find((c) => c.id === body.categoria_id) || categorias[0];
    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada.' }, { status: 400 });
    }

    const medida = Number(body.medida_declarada || 0);
    if (medida < categoria.medida_minima) {
      return NextResponse.json(
        {
          error: `A medida declarada (${medida} ${categoria.unidade_medida}) é inferior à medida mínima da categoria ${categoria.nome} (${categoria.medida_minima} ${categoria.unidade_medida}).`,
        },
        { status: 400 }
      );
    }

    const etapaAtiva =
      etapas.find((e) => e.id === body.etapa_id) ||
      etapas.find((e) => e.status === 'em_andamento') ||
      etapas[0];

    const created = createRegistro({
      temporada_id: temp.id,
      etapa_id: etapaAtiva.id,
      categoria_id: categoria.id,
      pescador_id: String(body.pescador_id || 'pesc-1'),
      especie_informada: String(body.especie_informada || categoria.especie),
      medida_declarada: medida,
      isca_marca: String(body.isca_marca || ''),
      isca_modelo: String(body.isca_modelo || ''),
      captura_completa_sem_corte: Boolean(body.captura_completa_sem_corte),
      local_captura: String(body.local_captura || ''),
      data_captura: body.data_captura ? String(body.data_captura) : new Date().toISOString(),
      palavra_chave_informada: String(body.palavra_chave_informada || etapaAtiva.palavra_chave),
      foto_isca_url: String(body.foto_isca_url || '/brand/peixe-dourado-tight.png'),
      video_medicao_url: String(body.video_medicao_url || ''),
    });

    return NextResponse.json({ registro: created });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao registrar captura.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'ID e status da avaliação são obrigatórios.' }, { status: 400 });
    }
    const evaluated = evaluateRegistro({
      id: String(body.id),
      status: body.status,
      medida_aprovada: body.medida_aprovada !== undefined ? Number(body.medida_aprovada) : undefined,
      checklist_juiz: body.checklist_juiz,
      parecer_juiz: body.parecer_juiz,
      motivo_reprovacao: body.motivo_reprovacao,
      avaliado_por_id: body.avaliado_por_id,
      avaliado_por_nome: body.avaliado_por_nome,
    });
    return NextResponse.json({ registro: evaluated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao julgar captura.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID do registro é obrigatório.' }, { status: 400 });
  }
  deleteRegistro(id);
  return NextResponse.json({ ok: true });
}

