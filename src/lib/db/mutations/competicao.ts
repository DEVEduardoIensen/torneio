import {
  Inscricao,
  Notificacao,
  Patrocinador,
  Pescador,
  RegistroCaptura,
} from '@/types/domain';
import { getDb } from '../connection';
import { mapInscricaoRow, mapNotificacaoRow, mapPatrocinadorRow } from '../mappers';
import { getPescadorById, getRegistros } from '../queries';

export function upsertPescador(data: Partial<Pescador> & { nome: string; whatsapp: string; senha?: string }): Pescador {
  const db = getDb();
  const digits = data.whatsapp.replace(/\D/g, '');
  const existing = db
    .prepare(`SELECT * FROM pescadores WHERE id = ? OR whatsapp = ? LIMIT 1`)
    .get(data.id || '', digits) as Record<string, unknown> | undefined;

  const id = existing ? String(existing.id) : data.id || `pesc-${Date.now()}`;

  if (existing) {
    db.prepare(`
      UPDATE pescadores SET
        whatsapp = ?,
        nome = ?,
        apelido = ?,
        cidade_uf = ?,
        equipe = ?,
        role = ?,
        ativo = ?
      WHERE id = ?
    `).run(
      digits,
      data.nome ?? String(existing.nome),
      data.apelido ?? String(existing.apelido || ''),
      data.cidade_uf ?? String(existing.cidade_uf || ''),
      data.equipe ?? String(existing.equipe || ''),
      data.role ?? String(existing.role || 'pescador'),
      (data.ativo ?? Boolean(existing.ativo)) ? 1 : 0,
      id
    );
  } else {
    db.prepare(`
      INSERT INTO pescadores (id, whatsapp, senha_hash, nome, apelido, cidade_uf, equipe, role, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      digits,
      data.senha || '123456',
      data.nome,
      data.apelido || data.nome.split(' ')[0],
      data.cidade_uf || '',
      data.equipe || 'Individual',
      data.role || 'pescador'
    );
  }

  return getPescadorById(id)!;
}

export function upsertInscricao(data: {
  id?: string;
  temporada_id: string;
  etapa_id?: string | null;
  pescador_id: string;
  modalidade_principal?: string;
  status_pagamento?: Inscricao['status_pagamento'];
  valor_pago_centavos?: number;
  comprovante_url?: string;
  aprovado_por_id?: string | null;
}): Inscricao {
  const db = getDb();
  const existing = db
    .prepare(`SELECT * FROM inscricoes WHERE id = ? OR (temporada_id = ? AND pescador_id = ?) LIMIT 1`)
    .get(data.id || '', data.temporada_id, data.pescador_id) as Record<string, unknown> | undefined;

  if (existing) {
    const id = String(existing.id);
    const status = data.status_pagamento ?? (existing.status_pagamento as Inscricao['status_pagamento']);
    const aprovadoEm = status === 'pago' || status === 'isento' ? new Date().toISOString() : null;
    db.prepare(`
      UPDATE inscricoes SET
        modalidade_principal = ?,
        status_pagamento = ?,
        valor_pago_centavos = ?,
        comprovante_url = ?,
        aprovado_por_id = ?,
        aprovado_em = ?
      WHERE id = ?
    `).run(
      data.modalidade_principal ?? String(existing.modalidade_principal),
      status,
      data.valor_pago_centavos ?? Number(existing.valor_pago_centavos),
      data.comprovante_url ?? String(existing.comprovante_url || ''),
      data.aprovado_por_id ?? (existing.aprovado_por_id ? String(existing.aprovado_por_id) : null),
      aprovadoEm,
      id
    );
    const updated = db
      .prepare(`
        SELECT i.*, p.nome as pescador_nome, p.whatsapp as pescador_whatsapp,
               p.cidade_uf as pescador_cidade_uf, p.equipe as pescador_equipe
        FROM inscricoes i
        JOIN pescadores p ON p.id = i.pescador_id
        WHERE i.id = ?
      `)
      .get(id) as Record<string, unknown>;
    return mapInscricaoRow(updated);
  }

  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM inscricoes WHERE temporada_id = ?`)
    .get(data.temporada_id) as { total: number };
  const numeroInscricao = `#${String(countRow.total + 1).padStart(3, '0')}`;
  const id = data.id || `insc-${Date.now()}`;
  const status = data.status_pagamento || 'pendente';

  db.prepare(`
    INSERT INTO inscricoes (
      id, temporada_id, etapa_id, pescador_id, numero_inscricao,
      modalidade_principal, status_pagamento, valor_pago_centavos,
      comprovante_url, aprovado_por_id, aprovado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.temporada_id,
    data.etapa_id || null,
    data.pescador_id,
    numeroInscricao,
    data.modalidade_principal || 'livre',
    status,
    data.valor_pago_centavos ?? 5000,
    data.comprovante_url || '',
    data.aprovado_por_id || null,
    status === 'pago' || status === 'isento' ? new Date().toISOString() : null
  );

  const inserted = db
    .prepare(`
      SELECT i.*, p.nome as pescador_nome, p.whatsapp as pescador_whatsapp,
             p.cidade_uf as pescador_cidade_uf, p.equipe as pescador_equipe
      FROM inscricoes i
      JOIN pescadores p ON p.id = i.pescador_id
      WHERE i.id = ?
    `)
    .get(id) as Record<string, unknown>;
  return mapInscricaoRow(inserted);
}

export function createRegistro(data: {
  temporada_id: string;
  etapa_id: string;
  categoria_id: string;
  pescador_id: string;
  especie_informada: string;
  medida_declarada: number;
  isca_marca: string;
  isca_modelo: string;
  captura_completa_sem_corte: boolean;
  local_captura: string;
  data_captura?: string;
  palavra_chave_informada: string;
  foto_isca_url: string;
  video_medicao_url: string;
}): RegistroCaptura {
  const db = getDb();
  const id = `reg-${Date.now()}`;
  const insc = db
    .prepare(`SELECT id FROM inscricoes WHERE temporada_id = ? AND pescador_id = ? LIMIT 1`)
    .get(data.temporada_id, data.pescador_id) as { id: string } | undefined;

  db.prepare(`
    INSERT INTO registros (
      id, temporada_id, etapa_id, categoria_id, inscricao_id, pescador_id,
      especie_informada, medida_declarada, medida_aprovada, isca_marca, isca_modelo,
      captura_completa_sem_corte, local_captura, data_captura, palavra_chave_informada,
      foto_isca_url, video_medicao_url, status, checklist_juiz_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente', '{}')
  `).run(
    id,
    data.temporada_id,
    data.etapa_id,
    data.categoria_id,
    insc ? insc.id : null,
    data.pescador_id,
    data.especie_informada,
    Number(data.medida_declarada),
    data.isca_marca,
    data.isca_modelo,
    data.captura_completa_sem_corte ? 1 : 0,
    data.local_captura,
    data.data_captura || new Date().toISOString(),
    data.palavra_chave_informada,
    data.foto_isca_url || '/brand/peixe-dourado-tight.png',
    data.video_medicao_url || ''
  );

  return getRegistros({ temporadaId: data.temporada_id }).find((r) => r.id === id)!;
}

export function evaluateRegistro(data: {
  id: string;
  status: 'aprovado' | 'reprovado' | 'pendente';
  medida_aprovada?: number | null;
  checklist_juiz?: Record<string, boolean>;
  parecer_juiz?: string;
  motivo_reprovacao?: string;
  avaliado_por_id?: string;
  avaliado_por_nome?: string;
}): RegistroCaptura {
  const db = getDb();
  const existing = db.prepare(`SELECT * FROM registros WHERE id = ?`).get(data.id) as Record<string, unknown>;
  const medidaFinal =
    data.status === 'aprovado'
      ? Number(data.medida_aprovada ?? existing.medida_declarada)
      : data.medida_aprovada ?? null;

  db.prepare(`
    UPDATE registros SET
      status = ?,
      medida_aprovada = ?,
      checklist_juiz_json = ?,
      parecer_juiz = ?,
      motivo_reprovacao = ?,
      avaliado_por_id = ?,
      avaliado_por_nome = ?,
      avaliado_em = ?
    WHERE id = ?
  `).run(
    data.status,
    medidaFinal,
    JSON.stringify(data.checklist_juiz || {}),
    data.parecer_juiz || '',
    data.motivo_reprovacao || '',
    data.avaliado_por_id || 'pesc-2',
    data.avaliado_por_nome || 'Arbitragem Oficial',
    new Date().toISOString(),
    data.id
  );

  return getRegistros().find((r) => r.id === data.id)!;
}

export function deleteRegistro(id: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM registros WHERE id = ?`).run(id);
}

export function upsertPatrocinador(data: Partial<Patrocinador> & { temporada_id: string; nome: string }): Patrocinador {
  const db = getDb();
  const id = data.id || `pat-${Date.now()}`;
  const existing = db.prepare(`SELECT * FROM patrocinadores WHERE id = ?`).get(id) as Record<string, unknown> | undefined;

  if (existing) {
    const cur = mapPatrocinadorRow(existing);
    db.prepare(`
      UPDATE patrocinadores SET
        nome = ?, cota = ?, segmento = ?, logo_url = ?, whatsapp_contato = ?,
        endereco_cidade = ?, beneficio_competidor = ?, premio_especial_isca = ?,
        ordem = ?, ativo = ?
      WHERE id = ?
    `).run(
      data.nome ?? cur.nome,
      data.cota ?? cur.cota,
      data.segmento ?? cur.segmento,
      data.logo_url ?? cur.logo_url,
      data.whatsapp_contato ?? cur.whatsapp_contato,
      data.endereco_cidade ?? cur.endereco_cidade,
      data.beneficio_competidor ?? cur.beneficio_competidor,
      data.premio_especial_isca ?? cur.premio_especial_isca,
      data.ordem ?? cur.ordem,
      (data.ativo ?? cur.ativo) ? 1 : 0,
      id
    );
  } else {
    db.prepare(`
      INSERT INTO patrocinadores (
        id, temporada_id, nome, cota, segmento, logo_url, whatsapp_contato,
        endereco_cidade, beneficio_competidor, premio_especial_isca, ordem, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      data.temporada_id,
      data.nome,
      data.cota || 'ouro',
      data.segmento || 'Parceiro Oficial',
      data.logo_url || '/brand/logo-eldorado-branco-tight.png',
      data.whatsapp_contato || '',
      data.endereco_cidade || '',
      data.beneficio_competidor || '15% de desconto à vista ou Pix para inscritos.',
      data.premio_especial_isca || '',
      data.ordem ?? 10
    );
  }

  return mapPatrocinadorRow(db.prepare(`SELECT * FROM patrocinadores WHERE id = ?`).get(id) as Record<string, unknown>);
}

export function deletePatrocinador(id: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM patrocinadores WHERE id = ?`).run(id);
}

export function createNotificacao(data: {
  temporada_id: string;
  etapa_id?: string | null;
  titulo: string;
  mensagem: string;
  tipo?: Notificacao['tipo'];
  fixado?: boolean;
  autor_nome?: string;
}): Notificacao {
  const db = getDb();
  const id = `not-${Date.now()}`;
  db.prepare(`
    INSERT INTO notificacoes (id, temporada_id, etapa_id, titulo, mensagem, tipo, fixado, autor_nome)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.temporada_id,
    data.etapa_id || null,
    data.titulo,
    data.mensagem,
    data.tipo || 'aviso',
    data.fixado ? 1 : 0,
    data.autor_nome || 'Comissão Organizadora'
  );
  return mapNotificacaoRow(db.prepare(`SELECT * FROM notificacoes WHERE id = ?`).get(id) as Record<string, unknown>);
}

export function deleteNotificacao(id: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM notificacoes WHERE id = ?`).run(id);
}
