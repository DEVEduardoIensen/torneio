import {
  Categoria,
  CategoryRankingResult,
  RankingEntry,
  RegistroCaptura,
} from '@/types/domain';
import { getCategoriasByTemporada, getRegistros } from './queries';

export function computeCategoryRanking(
  temporadaId: string,
  categoria: Categoria,
  etapaId?: string
): CategoryRankingResult {
  const approved = getRegistros({
    temporadaId,
    categoriaId: categoria.id,
    etapaId: etapaId || undefined,
    status: 'aprovado',
  }).filter((r) => {
    const val = r.medida_aprovada ?? r.medida_declarada;
    return val >= categoria.medida_minima;
  });

  const byAngler = new Map<string, RegistroCaptura[]>();
  for (const reg of approved) {
    const list = byAngler.get(reg.pescador_id) || [];
    list.push(reg);
    byAngler.set(reg.pescador_id, list);
  }

  const entries: RankingEntry[] = [];

  for (const [pescadorId, catches] of byAngler.entries()) {
    const sorted = [...catches].sort((a, b) => {
      const ma = a.medida_aprovada ?? a.medida_declarada;
      const mb = b.medida_aprovada ?? b.medida_declarada;
      if (mb !== ma) return mb - ma;
      return new Date(a.data_captura).getTime() - new Date(b.data_captura).getTime();
    });

    const topN = Math.max(1, categoria.top_n_peixes || 3);
    let selected: RegistroCaptura[] = sorted;

    if (categoria.formula_ranking === 'maior_exemplar') {
      selected = sorted.slice(0, 1);
    } else if (categoria.formula_ranking === 'soma_top_n' || categoria.formula_ranking === 'media_top_n') {
      selected = sorted.slice(0, topN);
    }

    const sumSelected = selected.reduce((acc, item) => acc + (item.medida_aprovada ?? item.medida_declarada), 0);
    const pontuacao =
      categoria.formula_ranking === 'media_top_n' && selected.length > 0
        ? Number((sumSelected / selected.length).toFixed(2))
        : Number(sumSelected.toFixed(2));

    const maiorExemplar = sorted.length > 0 ? Number((sorted[0].medida_aprovada ?? sorted[0].medida_declarada).toFixed(2)) : 0;
    const ref = sorted[0];

    entries.push({
      posicao: 0,
      pescador_id: pescadorId,
      pescador_nome: ref.pescador_nome || 'Pescador',
      pescador_apelido: ref.pescador_apelido || '',
      cidade_uf: ref.pescador_cidade_uf || '',
      equipe: ref.pescador_equipe || '',
      numero_inscricao: ref.numero_inscricao || 'S/N',
      pontuacao_total: pontuacao,
      maior_exemplar: maiorExemplar,
      total_capturas_aprovadas: sorted.length,
      capturas_computadas: selected.map((c) => ({
        id: c.id,
        medida: Number((c.medida_aprovada ?? c.medida_declarada).toFixed(1)),
        isca_marca: c.isca_marca,
        isca_modelo: c.isca_modelo,
        local_captura: c.local_captura,
        data_captura: c.data_captura,
        foto_isca_url: c.foto_isca_url,
        captura_completa_sem_corte: c.captura_completa_sem_corte,
      })),
    });
  }

  entries.sort((a, b) => {
    if (b.pontuacao_total !== a.pontuacao_total) {
      return b.pontuacao_total - a.pontuacao_total;
    }
    if (categoria.criterio_desempate === 'maior_peixe' && b.maior_exemplar !== a.maior_exemplar) {
      return b.maior_exemplar - a.maior_exemplar;
    }
    const earliestA = a.capturas_computadas[0]?.data_captura || '';
    const earliestB = b.capturas_computadas[0]?.data_captura || '';
    return new Date(earliestA).getTime() - new Date(earliestB).getTime();
  });

  entries.forEach((entry, idx) => {
    entry.posicao = idx + 1;
  });

  return {
    categoria,
    entries,
  };
}

export function computeAllRankings(temporadaId: string, etapaId?: string): {
  categorias: CategoryRankingResult[];
  capturasCompletasSemCorte: RegistroCaptura[];
} {
  const categorias = getCategoriasByTemporada(temporadaId, false);
  const results = categorias.map((cat) => computeCategoryRanking(temporadaId, cat, etapaId));

  const allApproved = getRegistros({
    temporadaId,
    etapaId: etapaId || undefined,
    status: 'aprovado',
  })
    .filter((r) => r.captura_completa_sem_corte)
    .sort((a, b) => {
      const ma = a.medida_aprovada ?? a.medida_declarada;
      const mb = b.medida_aprovada ?? b.medida_declarada;
      return mb - ma;
    });

  return {
    categorias: results,
    capturasCompletasSemCorte: allApproved,
  };
}
