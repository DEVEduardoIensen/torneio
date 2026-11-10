-- =============================================================================
-- ARQUITETURA DE BANCO DE DADOS 100% DESENGESSADA — PLATAFORMA TORNEIO DE PESCA
-- Compatível com PostgreSQL (Supabase) e espelhada no motor local SQLite
-- Zero regras, espécies, categorias ou checklists chumbados em código.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TEMPORADAS (Configuração Macro do Torneio / Ranking Anual ou Evento)
CREATE TABLE IF NOT EXISTS public.temporadas (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitulo TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '/brand/logo-eldorado-amarelo-tight.png',
  descricao TEXT NOT NULL DEFAULT '',
  regulamento_md TEXT NOT NULL DEFAULT '',
  data_inicio TEXT NOT NULL,
  data_fim TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('rascunho', 'ativa', 'encerrada')),
  valor_inscricao_padrao_centavos INTEGER NOT NULL DEFAULT 5000,
  chave_pix_padrao TEXT NOT NULL DEFAULT '',
  beneficio_desconto_parceiros_pct INTEGER NOT NULL DEFAULT 15,
  permite_mesmo_peixe_multiplas_categorias INTEGER NOT NULL DEFAULT 1,
  inscricao_unica_todas_categorias INTEGER NOT NULL DEFAULT 1,
  regras_gerais_json TEXT NOT NULL DEFAULT '[]',
  premiacao_especial_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- 2. CATEGORIAS DINÂMICAS (Qualquer Espécie, Modalidade, Fórmula e Checklist)
CREATE TABLE IF NOT EXISTS public.categorias (
  id TEXT PRIMARY KEY,
  temporada_id TEXT NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  especie TEXT NOT NULL,
  descricao_especie TEXT NOT NULL DEFAULT '',
  modalidade TEXT NOT NULL DEFAULT 'livre', -- 'embarcado', 'caiaque', 'barranco_acude', 'livre', etc.
  unidade_medida TEXT NOT NULL DEFAULT 'cm', -- 'cm', 'kg', 'pontos'
  formula_ranking TEXT NOT NULL DEFAULT 'soma_top_n', -- 'soma_top_n', 'maior_exemplar', 'soma_total', 'media_top_n'
  top_n_peixes INTEGER NOT NULL DEFAULT 3,
  criterio_desempate TEXT NOT NULL DEFAULT 'maior_peixe', -- 'maior_peixe', 'captura_mais_antiga'
  medida_minima REAL NOT NULL DEFAULT 30.0,
  tempo_max_fora_agua_seg INTEGER NOT NULL DEFAULT 45,
  tempo_max_video_seg INTEGER NOT NULL DEFAULT 60,
  exige_foto_isca INTEGER NOT NULL DEFAULT 1,
  exige_video_soltura INTEGER NOT NULL DEFAULT 1,
  exige_palavra_chave INTEGER NOT NULL DEFAULT 1,
  checklist_validacao_json TEXT NOT NULL DEFAULT '[]', -- Lista de itens auditados pelo juiz nesta categoria
  premiacao_json TEXT NOT NULL DEFAULT '[]',           -- Premiação configurável para 1º, 2º, 3º, etc.
  ordem INTEGER NOT NULL DEFAULT 1,
  ativa INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- 3. ETAPAS (Fases, Janelas de Competição e Palavra-Chave Oficial)
CREATE TABLE IF NOT EXISTS public.etapas (
  id TEXT PRIMARY KEY,
  temporada_id TEXT NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
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
  status TEXT NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('agendada', 'inscricoes_abertas', 'em_andamento', 'apuracao', 'encerrada')),
  observacoes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- 4. PESCADORES E USUÁRIOS (Pescadores, Juízes de Arbitragem e Administradores)
CREATE TABLE IF NOT EXISTS public.pescadores (
  id TEXT PRIMARY KEY,
  whatsapp TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL DEFAULT '123456',
  nome TEXT NOT NULL,
  apelido TEXT NOT NULL DEFAULT '',
  cidade_uf TEXT NOT NULL DEFAULT '',
  equipe TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'pescador' CHECK (role IN ('pescador', 'juiz', 'admin')),
  ativo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- 5. INSCRIÇÕES (Vínculo Pescador <-> Temporada/Etapa e Controle de Pagamento)
CREATE TABLE IF NOT EXISTS public.inscricoes (
  id TEXT PRIMARY KEY,
  temporada_id TEXT NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
  etapa_id TEXT REFERENCES public.etapas(id) ON DELETE SET NULL,
  pescador_id TEXT NOT NULL REFERENCES public.pescadores(id) ON DELETE CASCADE,
  numero_inscricao TEXT NOT NULL,
  modalidade_principal TEXT NOT NULL DEFAULT 'livre',
  status_pagamento TEXT NOT NULL DEFAULT 'pago' CHECK (status_pagamento IN ('pendente', 'pago', 'isento', 'cancelado')),
  valor_pago_centavos INTEGER NOT NULL DEFAULT 5000,
  comprovante_url TEXT NOT NULL DEFAULT '',
  aprovado_por_id TEXT REFERENCES public.pescadores(id) ON DELETE SET NULL,
  aprovado_em TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- 6. REGISTROS DE CAPTURA (Submissões de Fotos/Vídeos e Parecer de Arbitragem)
CREATE TABLE IF NOT EXISTS public.registros (
  id TEXT PRIMARY KEY,
  temporada_id TEXT NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
  etapa_id TEXT NOT NULL REFERENCES public.etapas(id) ON DELETE CASCADE,
  categoria_id TEXT NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
  inscricao_id TEXT REFERENCES public.inscricoes(id) ON DELETE SET NULL,
  pescador_id TEXT NOT NULL REFERENCES public.pescadores(id) ON DELETE CASCADE,
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
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'reprovado')),
  checklist_juiz_json TEXT NOT NULL DEFAULT '{}',
  parecer_juiz TEXT NOT NULL DEFAULT '',
  motivo_reprovacao TEXT NOT NULL DEFAULT '',
  avaliado_por_id TEXT REFERENCES public.pescadores(id) ON DELETE SET NULL,
  avaliado_por_nome TEXT NOT NULL DEFAULT '',
  avaliado_em TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- 7. PATROCINADORES E COMÉRCIO PARCEIRO (Descontos e Prêmios de Isca)
CREATE TABLE IF NOT EXISTS public.patrocinadores (
  id TEXT PRIMARY KEY,
  temporada_id TEXT NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cota TEXT NOT NULL DEFAULT 'ouro' CHECK (cota IN ('master', 'ouro', 'prata', 'apoio')),
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

-- 8. NOTIFICAÇÕES E COMUNICADOS OFICIAIS (Palavra-Chave, Avisos e Sorteios)
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id TEXT PRIMARY KEY,
  temporada_id TEXT NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
  etapa_id TEXT REFERENCES public.etapas(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'aviso' CHECK (tipo IN ('palavra_chave', 'aviso', 'resultado', 'sorteio')),
  fixado INTEGER NOT NULL DEFAULT 0,
  autor_nome TEXT NOT NULL DEFAULT 'Comissão Organizadora',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_categorias_temporada ON public.categorias(temporada_id, ordem);
CREATE INDEX IF NOT EXISTS idx_etapas_temporada ON public.etapas(temporada_id, numero);
CREATE INDEX IF NOT EXISTS idx_inscricoes_temporada ON public.inscricoes(temporada_id, pescador_id);
CREATE INDEX IF NOT EXISTS idx_registros_ranking ON public.registros(temporada_id, categoria_id, status);
CREATE INDEX IF NOT EXISTS idx_registros_pescador ON public.registros(pescador_id, created_at DESC);
