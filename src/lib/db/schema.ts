import { DatabaseSync } from 'node:sqlite';

export function initSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS temporadas (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitulo TEXT NOT NULL DEFAULT '',
      logo_url TEXT NOT NULL DEFAULT '/brand/logo-eldorado-amarelo-tight.png',
      descricao TEXT NOT NULL DEFAULT '',
      regulamento_md TEXT NOT NULL DEFAULT '',
      data_inicio TEXT NOT NULL,
      data_fim TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ativa',
      valor_inscricao_padrao_centavos INTEGER NOT NULL DEFAULT 5000,
      chave_pix_padrao TEXT NOT NULL DEFAULT '',
      beneficio_desconto_parceiros_pct INTEGER NOT NULL DEFAULT 15,
      permite_mesmo_peixe_multiplas_categorias INTEGER NOT NULL DEFAULT 1,
      inscricao_unica_todas_categorias INTEGER NOT NULL DEFAULT 1,
      regras_gerais_json TEXT NOT NULL DEFAULT '[]',
      premiacao_especial_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS categorias (
      id TEXT PRIMARY KEY,
      temporada_id TEXT NOT NULL REFERENCES temporadas(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      slug TEXT NOT NULL,
      especie TEXT NOT NULL,
      descricao_especie TEXT NOT NULL DEFAULT '',
      modalidade TEXT NOT NULL DEFAULT 'livre',
      unidade_medida TEXT NOT NULL DEFAULT 'cm',
      formula_ranking TEXT NOT NULL DEFAULT 'soma_top_n',
      top_n_peixes INTEGER NOT NULL DEFAULT 3,
      criterio_desempate TEXT NOT NULL DEFAULT 'maior_peixe',
      medida_minima REAL NOT NULL DEFAULT 30.0,
      tempo_max_fora_agua_seg INTEGER NOT NULL DEFAULT 45,
      tempo_max_video_seg INTEGER NOT NULL DEFAULT 60,
      exige_foto_isca INTEGER NOT NULL DEFAULT 1,
      exige_video_soltura INTEGER NOT NULL DEFAULT 1,
      exige_palavra_chave INTEGER NOT NULL DEFAULT 1,
      checklist_validacao_json TEXT NOT NULL DEFAULT '[]',
      premiacao_json TEXT NOT NULL DEFAULT '[]',
      ordem INTEGER NOT NULL DEFAULT 1,
      ativa INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS etapas (
      id TEXT PRIMARY KEY,
      temporada_id TEXT NOT NULL REFERENCES temporadas(id) ON DELETE CASCADE,
      numero INTEGER NOT NULL DEFAULT 1,
      titulo TEXT NOT NULL,
      subtitulo TEXT NOT NULL DEFAULT '',
      local_pesca TEXT NOT NULL,
      cidade_uf TEXT NOT NULL,
      data_inicio TEXT NOT NULL,
      data_fim TEXT NOT NULL,
      palavra_chave TEXT NOT NULL,
      revelar_palavra_chave INTEGER NOT NULL DEFAULT 1,
      valor_inscricao_centavos INTEGER NOT NULL DEFAULT 5000,
      chave_pix TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'em_andamento',
      observacoes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS pescadores (
      id TEXT PRIMARY KEY,
      whatsapp TEXT UNIQUE NOT NULL,
      senha_hash TEXT NOT NULL DEFAULT '123456',
      nome TEXT NOT NULL,
      apelido TEXT NOT NULL DEFAULT '',
      cidade_uf TEXT NOT NULL DEFAULT '',
      equipe TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'pescador',
      ativo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS inscricoes (
      id TEXT PRIMARY KEY,
      temporada_id TEXT NOT NULL REFERENCES temporadas(id) ON DELETE CASCADE,
      etapa_id TEXT REFERENCES etapas(id) ON DELETE SET NULL,
      pescador_id TEXT NOT NULL REFERENCES pescadores(id) ON DELETE CASCADE,
      numero_inscricao TEXT NOT NULL,
      modalidade_principal TEXT NOT NULL DEFAULT 'livre',
      status_pagamento TEXT NOT NULL DEFAULT 'pago',
      valor_pago_centavos INTEGER NOT NULL DEFAULT 5000,
      comprovante_url TEXT NOT NULL DEFAULT '',
      aprovado_por_id TEXT REFERENCES pescadores(id) ON DELETE SET NULL,
      aprovado_em TEXT,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS registros (
      id TEXT PRIMARY KEY,
      temporada_id TEXT NOT NULL REFERENCES temporadas(id) ON DELETE CASCADE,
      etapa_id TEXT NOT NULL REFERENCES etapas(id) ON DELETE CASCADE,
      categoria_id TEXT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
      inscricao_id TEXT REFERENCES inscricoes(id) ON DELETE SET NULL,
      pescador_id TEXT NOT NULL REFERENCES pescadores(id) ON DELETE CASCADE,
      especie_informada TEXT NOT NULL,
      medida_declarada REAL NOT NULL,
      medida_aprovada REAL,
      isca_marca TEXT NOT NULL DEFAULT '',
      isca_modelo TEXT NOT NULL DEFAULT '',
      captura_completa_sem_corte INTEGER NOT NULL DEFAULT 0,
      local_captura TEXT NOT NULL DEFAULT '',
      data_captura TEXT NOT NULL,
      palavra_chave_informada TEXT NOT NULL DEFAULT '',
      foto_isca_url TEXT NOT NULL DEFAULT '',
      video_medicao_url TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pendente',
      checklist_juiz_json TEXT NOT NULL DEFAULT '{}',
      parecer_juiz TEXT NOT NULL DEFAULT '',
      motivo_reprovacao TEXT NOT NULL DEFAULT '',
      avaliado_por_id TEXT REFERENCES pescadores(id) ON DELETE SET NULL,
      avaliado_por_nome TEXT NOT NULL DEFAULT '',
      avaliado_em TEXT,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS patrocinadores (
      id TEXT PRIMARY KEY,
      temporada_id TEXT NOT NULL REFERENCES temporadas(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      cota TEXT NOT NULL DEFAULT 'ouro',
      segmento TEXT NOT NULL DEFAULT '',
      logo_url TEXT NOT NULL DEFAULT '',
      whatsapp_contato TEXT NOT NULL DEFAULT '',
      endereco_cidade TEXT NOT NULL DEFAULT '',
      beneficio_competidor TEXT NOT NULL DEFAULT '',
      premio_especial_isca TEXT NOT NULL DEFAULT '',
      ordem INTEGER NOT NULL DEFAULT 1,
      ativo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS notificacoes (
      id TEXT PRIMARY KEY,
      temporada_id TEXT NOT NULL REFERENCES temporadas(id) ON DELETE CASCADE,
      etapa_id TEXT REFERENCES etapas(id) ON DELETE SET NULL,
      titulo TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'aviso',
      fixado INTEGER NOT NULL DEFAULT 0,
      autor_nome TEXT NOT NULL DEFAULT 'Comissão Organizadora',
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    -- =========================================================================
    -- ÍNDICES B-TREE DE ALTA PERFORMANCE (SPEEDUP & BUSCAS SUB-MILISSEGUNDO)
    -- =========================================================================
    CREATE INDEX IF NOT EXISTS idx_registros_ranking 
      ON registros(temporada_id, categoria_id, status, medida_aprovada DESC);

    CREATE INDEX IF NOT EXISTS idx_registros_pescador 
      ON registros(pescador_id, temporada_id);

    CREATE INDEX IF NOT EXISTS idx_registros_etapa 
      ON registros(etapa_id, status);

    CREATE INDEX IF NOT EXISTS idx_registros_status_date 
      ON registros(status, data_captura DESC);

    CREATE INDEX IF NOT EXISTS idx_inscricoes_temp_pesc 
      ON inscricoes(temporada_id, pescador_id);

    CREATE INDEX IF NOT EXISTS idx_inscricoes_numero 
      ON inscricoes(temporada_id, numero_inscricao);

    CREATE INDEX IF NOT EXISTS idx_categorias_temporada 
      ON categorias(temporada_id, ativa, ordem);

    CREATE INDEX IF NOT EXISTS idx_etapas_temporada 
      ON etapas(temporada_id, status);

    CREATE INDEX IF NOT EXISTS idx_patrocinadores_ordem 
      ON patrocinadores(temporada_id, ativo, ordem);

    CREATE INDEX IF NOT EXISTS idx_notificacoes_temp 
      ON notificacoes(temporada_id, fixado DESC, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_pescadores_whatsapp 
      ON pescadores(whatsapp, ativo);
  `);
}
