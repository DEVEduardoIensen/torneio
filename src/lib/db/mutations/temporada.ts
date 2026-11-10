import { Categoria, Etapa, Temporada } from '@/types/domain';
import { withTransaction } from '../connection';
import { mapCategoriaRow, mapEtapaRow, mapTemporadaRow } from '../mappers';
import { getActiveTemporada } from '../queries';

export function updateTemporada(data: Partial<Temporada> & { id: string }): Temporada {
  return withTransaction((db) => {
    const row = db.prepare(`SELECT * FROM temporadas WHERE id = ?`).get(data.id) as Record<string, unknown> | undefined;
    if (!row) {
      throw new Error(`Temporada com ID '${data.id}' não encontrada.`);
    }
    const current = mapTemporadaRow(row);

    const merged: Temporada = {
      ...current,
      ...data,
      regras_gerais: data.regras_gerais ?? current.regras_gerais,
      premiacao_especial: data.premiacao_especial ?? current.premiacao_especial,
    };

    db.prepare(`
      UPDATE temporadas SET
        nome = ?,
        subtitulo = ?,
        logo_url = ?,
        descricao = ?,
        regulamento_md = ?,
        data_inicio = ?,
        data_fim = ?,
        status = ?,
        valor_inscricao_padrao_centavos = ?,
        chave_pix_padrao = ?,
        beneficio_desconto_parceiros_pct = ?,
        permite_mesmo_peixe_multiplas_categorias = ?,
        inscricao_unica_todas_categorias = ?,
        regras_gerais_json = ?,
        premiacao_especial_json = ?
      WHERE id = ?
    `).run(
      merged.nome,
      merged.subtitulo,
      merged.logo_url,
      merged.descricao,
      merged.regulamento_md,
      merged.data_inicio,
      merged.data_fim,
      merged.status,
      merged.valor_inscricao_padrao_centavos,
      merged.chave_pix_padrao,
      merged.beneficio_desconto_parceiros_pct,
      merged.permite_mesmo_peixe_multiplas_categorias ? 1 : 0,
      merged.inscricao_unica_todas_categorias ? 1 : 0,
      JSON.stringify(merged.regras_gerais),
      JSON.stringify(merged.premiacao_especial),
      merged.id
    );

    return getActiveTemporada();
  });
}

export function upsertCategoria(data: Partial<Categoria> & { temporada_id: string; nome: string }): Categoria {
  return withTransaction((db) => {
    const id = data.id || `cat-${Date.now()}`;
    const slug =
      data.slug ||
      data.nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const existing = db.prepare(`SELECT * FROM categorias WHERE id = ?`).get(id) as Record<string, unknown> | undefined;

    if (existing) {
      const cur = mapCategoriaRow(existing);
      db.prepare(`
        UPDATE categorias SET
          nome = ?, slug = ?, especie = ?, descricao_especie = ?, modalidade = ?,
          unidade_medida = ?, formula_ranking = ?, top_n_peixes = ?, criterio_desempate = ?,
          medida_minima = ?, tempo_max_fora_agua_seg = ?, tempo_max_video_seg = ?,
          exige_foto_isca = ?, exige_video_soltura = ?, exige_palavra_chave = ?,
          checklist_validacao_json = ?, premiacao_json = ?, ordem = ?, ativa = ?
        WHERE id = ?
      `).run(
        data.nome ?? cur.nome,
        slug,
        data.especie ?? cur.especie,
        data.descricao_especie ?? cur.descricao_especie,
        data.modalidade ?? cur.modalidade,
        data.unidade_medida ?? cur.unidade_medida,
        data.formula_ranking ?? cur.formula_ranking,
        data.top_n_peixes ?? cur.top_n_peixes,
        data.criterio_desempate ?? cur.criterio_desempate,
        data.medida_minima ?? cur.medida_minima,
        data.tempo_max_fora_agua_seg ?? cur.tempo_max_fora_agua_seg,
        data.tempo_max_video_seg ?? cur.tempo_max_video_seg,
        (data.exige_foto_isca ?? cur.exige_foto_isca) ? 1 : 0,
        (data.exige_video_soltura ?? cur.exige_video_soltura) ? 1 : 0,
        (data.exige_palavra_chave ?? cur.exige_palavra_chave) ? 1 : 0,
        JSON.stringify(data.checklist_validacao ?? cur.checklist_validacao),
        JSON.stringify(data.premiacao ?? cur.premiacao),
        data.ordem ?? cur.ordem,
        (data.ativa ?? cur.ativa) ? 1 : 0,
        id
      );
    } else {
      db.prepare(`
        INSERT INTO categorias (
          id, temporada_id, nome, slug, especie, descricao_especie, modalidade,
          unidade_medida, formula_ranking, top_n_peixes, criterio_desempate,
          medida_minima, tempo_max_fora_agua_seg, tempo_max_video_seg,
          exige_foto_isca, exige_video_soltura, exige_palavra_chave,
          checklist_validacao_json, premiacao_json, ordem, ativa
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        data.temporada_id,
        data.nome,
        slug,
        data.especie || 'Espécie Livre',
        data.descricao_especie || '',
        data.modalidade || 'livre',
        data.unidade_medida || 'cm',
        data.formula_ranking || 'soma_top_n',
        data.top_n_peixes ?? 3,
        data.criterio_desempate || 'maior_peixe',
        data.medida_minima ?? 30,
        data.tempo_max_fora_agua_seg ?? 45,
        data.tempo_max_video_seg ?? 60,
        (data.exige_foto_isca ?? true) ? 1 : 0,
        (data.exige_video_soltura ?? true) ? 1 : 0,
        (data.exige_palavra_chave ?? true) ? 1 : 0,
        JSON.stringify(
          data.checklist_validacao ?? [
            'Citou a Palavra-Chave Oficial da etapa',
            'Boca fechada encostada no marco zero da régua plana',
            'Vídeo sem cortes com soltura do exemplar vivo',
          ]
        ),
        JSON.stringify(data.premiacao ?? []),
        data.ordem ?? 10,
        (data.ativa ?? true) ? 1 : 0
      );
    }

    return mapCategoriaRow(db.prepare(`SELECT * FROM categorias WHERE id = ?`).get(id) as Record<string, unknown>);
  });
}

export function deleteCategoria(id: string): void {
  withTransaction((db) => {
    db.prepare(`DELETE FROM categorias WHERE id = ?`).run(id);
  });
}

export function upsertEtapa(data: Partial<Etapa> & { temporada_id: string; titulo: string }): Etapa {
  return withTransaction((db) => {
    const id = data.id || `etp-${Date.now()}`;
    const existing = db.prepare(`SELECT * FROM etapas WHERE id = ?`).get(id) as Record<string, unknown> | undefined;

    if (existing) {
      const cur = mapEtapaRow(existing);
      db.prepare(`
        UPDATE etapas SET
          numero = ?, titulo = ?, subtitulo = ?, local_pesca = ?, cidade_uf = ?,
          data_inicio = ?, data_fim = ?, palavra_chave = ?, revelar_palavra_chave = ?,
          valor_inscricao_centavos = ?, chave_pix = ?, status = ?, observacoes = ?
        WHERE id = ?
      `).run(
        data.numero ?? cur.numero,
        data.titulo ?? cur.titulo,
        data.subtitulo ?? cur.subtitulo,
        data.local_pesca ?? cur.local_pesca,
        data.cidade_uf ?? cur.cidade_uf,
        data.data_inicio ?? cur.data_inicio,
        data.data_fim ?? cur.data_fim,
        data.palavra_chave ?? cur.palavra_chave,
        (data.revelar_palavra_chave ?? cur.revelar_palavra_chave) ? 1 : 0,
        data.valor_inscricao_centavos ?? cur.valor_inscricao_centavos,
        data.chave_pix ?? cur.chave_pix,
        data.status ?? cur.status,
        data.observacoes ?? cur.observacoes,
        id
      );
    } else {
      db.prepare(`
        INSERT INTO etapas (
          id, temporada_id, numero, titulo, subtitulo, local_pesca, cidade_uf,
          data_inicio, data_fim, palavra_chave, revelar_palavra_chave,
          valor_inscricao_centavos, chave_pix, status, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        data.temporada_id,
        data.numero ?? 1,
        data.titulo,
        data.subtitulo || '',
        data.local_pesca || 'Lago do Torneio',
        data.cidade_uf || 'Castro - PR',
        data.data_inicio || new Date().toISOString(),
        data.data_fim || new Date(Date.now() + 86400000 * 30).toISOString(),
        data.palavra_chave || 'ELDORADO-2026',
        (data.revelar_palavra_chave ?? true) ? 1 : 0,
        data.valor_inscricao_centavos ?? 5000,
        data.chave_pix || '',
        data.status || 'em_andamento',
        data.observacoes || ''
      );
    }

    return mapEtapaRow(db.prepare(`SELECT * FROM etapas WHERE id = ?`).get(id) as Record<string, unknown>);
  });
}

export function deleteEtapa(id: string): void {
  withTransaction((db) => {
    db.prepare(`DELETE FROM etapas WHERE id = ?`).run(id);
  });
}
