import {
  Categoria,
  Etapa,
  Inscricao,
  Notificacao,
  Patrocinador,
  Pescador,
  RegistroCaptura,
  Temporada,
} from '@/types/domain';
import { getDb } from './connection';
import {
  mapCategoriaRow,
  mapEtapaRow,
  mapInscricaoRow,
  mapNotificacaoRow,
  mapPatrocinadorRow,
  mapPescadorRow,
  mapRegistroRow,
  mapTemporadaRow,
} from './mappers';
import { initSchema } from './schema';
import { seedDatabase } from './seed';

export function getActiveTemporada(): Temporada {
  const db = getDb();
  let row = db
    .prepare(`SELECT * FROM temporadas WHERE status = 'ativa' ORDER BY created_at DESC LIMIT 1`)
    .get() as Record<string, unknown> | undefined;
  if (!row) {
    initSchema(db);
    seedDatabase(db);
    row = db
      .prepare(`SELECT * FROM temporadas ORDER BY created_at DESC LIMIT 1`)
      .get() as Record<string, unknown> | undefined;
  }
  return mapTemporadaRow(row!);
}

export function getAllTemporadas(): Temporada[] {
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM temporadas ORDER BY created_at DESC`).all() as Record<string, unknown>[];
  return rows.map(mapTemporadaRow);
}

export function getCategoriasByTemporada(temporadaId: string, includeInactive = false): Categoria[] {
  const db = getDb();
  const sql = includeInactive
    ? `SELECT * FROM categorias WHERE temporada_id = ? ORDER BY ordem ASC, nome ASC`
    : `SELECT * FROM categorias WHERE temporada_id = ? AND ativa = 1 ORDER BY ordem ASC, nome ASC`;
  const rows = db.prepare(sql).all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapCategoriaRow);
}

export function getEtapasByTemporada(temporadaId: string): Etapa[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM etapas WHERE temporada_id = ? ORDER BY numero ASC, data_inicio ASC`)
    .all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapEtapaRow);
}

export function getAllPescadores(temporadaId?: string): Pescador[] {
  const db = getDb();
  const activeTempId = temporadaId || getActiveTemporada().id;
  const rows = db
    .prepare(`
      SELECT p.*, i.numero_inscricao
      FROM pescadores p
      LEFT JOIN inscricoes i ON i.pescador_id = p.id AND i.temporada_id = ?
      ORDER BY p.nome ASC
    `)
    .all(activeTempId) as Record<string, unknown>[];
  return rows.map(mapPescadorRow);
}

export function getPescadorById(id: string, temporadaId?: string): Pescador | null {
  const db = getDb();
  const activeTempId = temporadaId || getActiveTemporada().id;
  const row = db
    .prepare(`
      SELECT p.*, i.numero_inscricao
      FROM pescadores p
      LEFT JOIN inscricoes i ON i.pescador_id = p.id AND i.temporada_id = ?
      WHERE p.id = ?
      LIMIT 1
    `)
    .get(activeTempId, id) as Record<string, unknown> | undefined;
  return row ? mapPescadorRow(row) : null;
}

export function getInscricoesByTemporada(temporadaId: string): Inscricao[] {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT i.*, p.nome as pescador_nome, p.whatsapp as pescador_whatsapp,
             p.cidade_uf as pescador_cidade_uf, p.equipe as pescador_equipe
      FROM inscricoes i
      JOIN pescadores p ON p.id = i.pescador_id
      WHERE i.temporada_id = ?
      ORDER BY i.numero_inscricao ASC
    `)
    .all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapInscricaoRow);
}

export function getRegistros(filters?: {
  temporadaId?: string;
  etapaId?: string;
  categoriaId?: string;
  pescadorId?: string;
  status?: string;
}): RegistroCaptura[] {
  const db = getDb();
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.temporadaId) {
    clauses.push('r.temporada_id = ?');
    params.push(filters.temporadaId);
  }
  if (filters?.etapaId) {
    clauses.push('r.etapa_id = ?');
    params.push(filters.etapaId);
  }
  if (filters?.categoriaId) {
    clauses.push('r.categoria_id = ?');
    params.push(filters.categoriaId);
  }
  if (filters?.pescadorId) {
    clauses.push('r.pescador_id = ?');
    params.push(filters.pescadorId);
  }
  if (filters?.status) {
    clauses.push('r.status = ?');
    params.push(filters.status);
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = db
    .prepare(`
      SELECT r.*,
             p.nome as pescador_nome,
             p.apelido as pescador_apelido,
             p.cidade_uf as pescador_cidade_uf,
             p.equipe as pescador_equipe,
             c.nome as categoria_nome,
             c.unidade_medida as categoria_unidade,
             e.titulo as etapa_titulo,
             i.numero_inscricao
      FROM registros r
      JOIN pescadores p ON p.id = r.pescador_id
      JOIN categorias c ON c.id = r.categoria_id
      JOIN etapas e ON e.id = r.etapa_id
      LEFT JOIN inscricoes i ON i.pescador_id = r.pescador_id AND i.temporada_id = r.temporada_id
      ${whereSql}
      ORDER BY r.data_captura DESC, r.created_at DESC
    `)
    .all(...params) as Record<string, unknown>[];

  return rows.map(mapRegistroRow);
}

export function getPatrocinadoresByTemporada(temporadaId: string): Patrocinador[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM patrocinadores WHERE temporada_id = ? ORDER BY ordem ASC, nome ASC`)
    .all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapPatrocinadorRow);
}

export function getNotificacoesByTemporada(temporadaId: string): Notificacao[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM notificacoes WHERE temporada_id = ? ORDER BY fixado DESC, created_at DESC`)
    .all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapNotificacaoRow);
}

