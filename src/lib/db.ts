import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  Categoria,
  CategoryRankingResult,
  Etapa,
  Inscricao,
  Notificacao,
  Patrocinador,
  Pescador,
  RankingEntry,
  RegistroCaptura,
  Temporada,
} from '@/types/domain';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const DB_PATH = path.join(DATA_DIR, 'torneio.db');

declare global {
  // eslint-disable-next-line no-var
  var __torneioDb: DatabaseSync | undefined;
}

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function getDb(): DatabaseSync {
  if (global.__torneioDb) {
    return global.__torneioDb;
  }
  ensureDirectories();
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = DELETE;');
  db.exec('PRAGMA foreign_keys = ON;');
  initSchemaAndSeed(db);
  global.__torneioDb = db;
  return db;
}

function parseJsonSafe<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string' || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function initSchemaAndSeed(db: DatabaseSync) {
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
  `);

  const countRow = db.prepare('SELECT COUNT(*) as total FROM temporadas').get() as { total: number };
  if (countRow.total > 0) {
    return;
  }

  // Seed inicial 100% editável pelo painel administrativo
  const temporadaId = 'temp-eldorado-2026';
  const regrasGerais = [
    {
      titulo: 'Inscrição Única Multi-Categorias',
      descricao:
        'Com uma única inscrição ativa na temporada, o pescador participa automaticamente de todas as categorias compatíveis com sua captura e modalidade.',
    },
    {
      titulo: 'Captura e Soltura Obrigatória (Pesque e Solte)',
      descricao:
        'O vídeo de medição e soltura deve ser contínuo, sem cortes ou edições, com duração máxima de 60 segundos e tempo máximo do peixe fora da água de 45 segundos.',
    },
    {
      titulo: 'Padrão de Medição na Régua Oficial',
      descricao:
        'A boca do peixe deve estar fechada e encostada no marco zero (batente) da régua plana e esticada. A leitura considera a extremidade mais longa da nadadeira caudal.',
    },
    {
      titulo: 'Validação de Espécie e Palavra-Chave',
      descricao:
        'O pescador deve pronunciar em voz alta a Palavra-Chave Oficial vigente da etapa durante o vídeo. Na categoria Traíra, é obrigatório exibir a parte inferior da mandíbula (queixo) para comprovar a espécie Hoplias malabaricus.',
    },
  ];

  const premiacaoEspecial = [
    {
      colocacao: 'Prêmio Especial Mathias Iscas',
      titulo: 'Maior Captura Completa sem Corte (Fisgada + Medição + Soltura)',
      valor_ou_descricao: 'Kit Oficial Mathias Iscas + Troféu Destaque de Cena',
    },
    {
      colocacao: 'Passaporte do Competidor',
      titulo: 'Desconto Imediato nas Lojas Parceiras',
      valor_ou_descricao: '15% de desconto em compras à vista ou Pix apresentando a inscrição ativa',
    },
  ];

  db.prepare(`
    INSERT INTO temporadas (
      id, nome, slug, subtitulo, logo_url, descricao, regulamento_md,
      data_inicio, data_fim, status, valor_inscricao_padrao_centavos,
      chave_pix_padrao, beneficio_desconto_parceiros_pct,
      permite_mesmo_peixe_multiplas_categorias, inscricao_unica_todas_categorias,
      regras_gerais_json, premiacao_especial_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    temporadaId,
    'Ranking Eldorado Pesca 2026',
    'ranking-eldorado-pesca-2026',
    'Circuito Oficial de Pesca Esportiva: Troféu Eldorado & Mathias Iscas',
    '/brand/logo-eldorado-amarelo-tight.png',
    'Campeonato oficial de pesca esportiva na modalidade pesque e solte com apuração por vídeo sem cortes, régua oficial e arbitragem auditada.',
    'O Ranking Eldorado Pesca valoriza o esporte, a preservação das espécies nativas e o comércio regional. Todas as regras, categorias, fórmulas de pontuação e checklists abaixo são dinâmicos e gerenciados pela comissão organizadora.',
    '2026-03-01',
    '2026-11-30',
    'ativa',
    5000,
    'pix@eldoradopesca.com.br',
    15,
    1,
    1,
    JSON.stringify(regrasGerais),
    JSON.stringify(premiacaoEspecial)
  );

  // Categorias dinâmicas iniciais
  const categoriasSeed = [
    {
      id: 'cat-dourado-geral',
      nome: 'Dourado: Geral',
      slug: 'dourado-geral',
      especie: 'Dourado (Salminus brasiliensis)',
      descricao_especie: 'Válido para capturas de Dourado em qualquer modalidade permitida (embarcado, caiaque ou barranco).',
      modalidade: 'livre',
      unidade_medida: 'cm',
      formula_ranking: 'soma_top_n',
      top_n_peixes: 3,
      criterio_desempate: 'maior_peixe',
      medida_minima: 45,
      tempo_max_fora_agua_seg: 45,
      tempo_max_video_seg: 60,
      checklist: [
        'Vídeo sem cortes (máx. 60s) e peixe fora da água por no máx. 45s',
        'Citou a Palavra-Chave Oficial da etapa de forma audível',
        'Boca fechada encostada no batente (marco zero) da régua plana',
        'Foto nítida do peixe com a isca artificial visível',
        'Soltura concluída com o Dourado nadando ativamente',
      ],
      premiacao: [
        { colocacao: '1º Lugar', titulo: 'Campeão Dourado Geral', valor_ou_descricao: 'Troféu Oficial + R$ 1.500,00 em prêmios' },
        { colocacao: '2º Lugar', titulo: 'Vice-Campeão Dourado Geral', valor_ou_descricao: 'Troféu Oficial + Kit Patrocinadores' },
        { colocacao: '3º Lugar', titulo: '3º Colocado Dourado Geral', valor_ou_descricao: 'Troféu Oficial + Kit Iscas' },
      ],
      ordem: 1,
    },
    {
      id: 'cat-dourado-caiaque',
      nome: 'Dourado: Caiaque',
      slug: 'dourado-caiaque',
      especie: 'Dourado (Salminus brasiliensis)',
      descricao_especie: 'Exclusivo para capturas realizadas a bordo de caiaque (propulsão a remo ou pedal).',
      modalidade: 'caiaque',
      unidade_medida: 'cm',
      formula_ranking: 'soma_top_n',
      top_n_peixes: 3,
      criterio_desempate: 'maior_peixe',
      medida_minima: 45,
      tempo_max_fora_agua_seg: 45,
      tempo_max_video_seg: 60,
      checklist: [
        'Comprovação visual de pescaria embarcada em caiaque',
        'Citou a Palavra-Chave Oficial da etapa de forma audível',
        'Boca fechada encostada no marco zero da régua plana',
        'Foto nítida com a isca artificial utilizada',
        'Soltura limpa com o exemplar vivo',
      ],
      premiacao: [
        { colocacao: '1º Lugar', titulo: 'Campeão Dourado Caiaque', valor_ou_descricao: 'Troféu Oficial + R$ 1.000,00 em equipamentos' },
        { colocacao: '2º Lugar', titulo: 'Vice-Campeão Dourado Caiaque', valor_ou_descricao: 'Troféu Oficial + Kit Caiaqueiro' },
      ],
      ordem: 2,
    },
    {
      id: 'cat-traira-embarcado',
      nome: 'Traíra: Embarcado',
      slug: 'traira-embarcado',
      especie: 'Traíra Comum (Hoplias malabaricus)',
      descricao_especie: 'Válido apenas para Hoplias malabaricus (linhas da mandíbula que quase se tocam sob o queixo). Não é válido Trairão.',
      modalidade: 'embarcado',
      unidade_medida: 'cm',
      formula_ranking: 'soma_top_n',
      top_n_peixes: 3,
      criterio_desempate: 'maior_peixe',
      medida_minima: 35,
      tempo_max_fora_agua_seg: 45,
      tempo_max_video_seg: 60,
      checklist: [
        'Exibiu a parte inferior do queixo comprovando Hoplias malabaricus',
        'Citou a Palavra-Chave Oficial da etapa de forma audível',
        'Boca fechada no marco zero e leitura exata na nadadeira caudal',
        'Foto da captura com a isca artificial',
        'Soltura sem cortes com o peixe vivo',
      ],
      premiacao: [
        { colocacao: '1º Lugar', titulo: 'Campeão Traíra Embarcado', valor_ou_descricao: 'Troféu Oficial + Carretilha Perfil Baixo + Kit Frog' },
        { colocacao: '2º Lugar', titulo: 'Vice-Campeão Traíra Embarcado', valor_ou_descricao: 'Troféu Oficial + Vara Custom + Iscas' },
      ],
      ordem: 3,
    },
    {
      id: 'cat-traira-caiaque',
      nome: 'Traíra: Caiaque',
      slug: 'traira-caiaque',
      especie: 'Traíra Comum (Hoplias malabaricus)',
      descricao_especie: 'Capturas de Hoplias malabaricus realizadas em caiaque.',
      modalidade: 'caiaque',
      unidade_medida: 'cm',
      formula_ranking: 'soma_top_n',
      top_n_peixes: 3,
      criterio_desempate: 'maior_peixe',
      medida_minima: 35,
      tempo_max_fora_agua_seg: 45,
      tempo_max_video_seg: 60,
      checklist: [
        'Comprovação de caiaque e exibição do queixo (Hoplias malabaricus)',
        'Citou a Palavra-Chave Oficial da etapa de forma audível',
        'Boca fechada encostada no marco zero da régua plana',
        'Soltura integral registrada sem edição',
      ],
      premiacao: [
        { colocacao: '1º Lugar', titulo: 'Campeão Traíra Caiaque', valor_ou_descricao: 'Troféu Oficial + Kit Mathias Iscas Pro' },
      ],
      ordem: 4,
    },
    {
      id: 'cat-traira-barranco',
      nome: 'Traíra: Barranco / Açude',
      slug: 'traira-barranco-acude',
      especie: 'Traíra Comum (Hoplias malabaricus)',
      descricao_especie: 'Capturas desembarcadas (barranco, margens de rios, lagos e açudes).',
      modalidade: 'barranco_acude',
      unidade_medida: 'cm',
      formula_ranking: 'soma_top_n',
      top_n_peixes: 3,
      criterio_desempate: 'maior_peixe',
      medida_minima: 32,
      tempo_max_fora_agua_seg: 45,
      tempo_max_video_seg: 60,
      checklist: [
        'Comprovação de pesca desembarcada (barranco ou margem)',
        'Exibição da parte inferior do queixo (Hoplias malabaricus)',
        'Citou a Palavra-Chave Oficial da etapa',
        'Régua plana no chão nivelado com boca fechada no zero',
        'Soltura do peixe em perfeitas condições',
      ],
      premiacao: [
        { colocacao: '1º Lugar', titulo: 'Campeão Traíra Barranco/Açude', valor_ou_descricao: 'Troféu Oficial + Kit Completo de Pesca' },
      ],
      ordem: 5,
    },
    {
      id: 'cat-maior-exemplar-geral',
      nome: 'Troféu Maior Peixe da Temporada',
      slug: 'maior-exemplar-geral',
      especie: 'Dourado ou Traíra',
      descricao_especie: 'Categoria especial decidida pelo único maior exemplar homologado na temporada (fórmula Maior Exemplar).',
      modalidade: 'livre',
      unidade_medida: 'cm',
      formula_ranking: 'maior_exemplar',
      top_n_peixes: 1,
      criterio_desempate: 'captura_mais_antiga',
      medida_minima: 40,
      tempo_max_fora_agua_seg: 45,
      tempo_max_video_seg: 60,
      checklist: [
        'Medição irretocável com leitura milimétrica na régua oficial',
        'Palavra-Chave Oficial pronunciada com clareza',
        'Soltura integral sem cortes',
      ],
      premiacao: [
        { colocacao: 'Campeão Absoluto', titulo: 'Troféu Gigante do Rio', valor_ou_descricao: 'Troféu Especial Eldorado Lake + Voucher R$ 800,00' },
      ],
      ordem: 6,
    },
  ];

  const insertCategoria = db.prepare(`
    INSERT INTO categorias (
      id, temporada_id, nome, slug, especie, descricao_especie, modalidade,
      unidade_medida, formula_ranking, top_n_peixes, criterio_desempate,
      medida_minima, tempo_max_fora_agua_seg, tempo_max_video_seg,
      exige_foto_isca, exige_video_soltura, exige_palavra_chave,
      checklist_validacao_json, premiacao_json, ordem, ativa
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1, ?, ?, ?, 1)
  `);

  for (const c of categoriasSeed) {
    insertCategoria.run(
      c.id,
      temporadaId,
      c.nome,
      c.slug,
      c.especie,
      c.descricao_especie,
      c.modalidade,
      c.unidade_medida,
      c.formula_ranking,
      c.top_n_peixes,
      c.criterio_desempate,
      c.medida_minima,
      c.tempo_max_fora_agua_seg,
      c.tempo_max_video_seg,
      JSON.stringify(c.checklist),
      JSON.stringify(c.premiacao),
      c.ordem
    );
  }

  // Etapas iniciais
  const insertEtapa = db.prepare(`
    INSERT INTO etapas (
      id, temporada_id, numero, titulo, subtitulo, local_pesca, cidade_uf,
      data_inicio, data_fim, palavra_chave, revelar_palavra_chave,
      valor_inscricao_centavos, chave_pix, status, observacoes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEtapa.run(
    'etapa-1-outono',
    temporadaId,
    1,
    '1ª Etapa: Abertura de Outono',
    'Bacia do Rio Uruguai, Turvo e Açudes da Região',
    'Rios e Açudes Habilitados no Regulamento',
    'Região Sul / MS',
    '2026-03-01',
    '2026-06-30',
    'ELDORADO-77',
    1,
    5000,
    'pix@eldoradopesca.com.br',
    'em_andamento',
    'Palavra-chave oficial liberada. Obrigatório falar de forma audível durante a gravação na régua.'
  );

  insertEtapa.run(
    'etapa-2-primavera',
    temporadaId,
    2,
    '2ª Etapa: Desafio de Primavera',
    'Temporada de Alta Atividade de Superfície',
    'Rios, Represas e Açudes Habilitados',
    'Região Sul / MS',
    '2026-08-01',
    '2026-11-30',
    'AGUARDANDO-SORTEIO',
    0,
    5000,
    'pix@eldoradopesca.com.br',
    'agendada',
    'A palavra-chave da 2ª Etapa será revelada às 05h00 do dia de abertura.'
  );

  // Pescadores, Juízes e Administradores iniciais
  const insertPescador = db.prepare(`
    INSERT INTO pescadores (id, whatsapp, senha_hash, nome, apelido, cidade_uf, equipe, role, ativo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const pescadoresSeed = [
    ['pesc-tiago', '5542999162340', '123456', 'Tiago Witeck', 'Witeck', 'Três Passos - RS', 'Direção Geral FisgaRank', 'admin'],
    ['pesc-1', '55999110001', '123456', 'Lucas Zanardini', 'Zanardini', 'Três Passos - RS', 'Equipe Eldorado Pro', 'admin'],
    ['pesc-2', '55999220002', '123456', 'Mathias Ferreira', 'Mathias Iscas', 'Crissiumal - RS', 'Mathias Custom Lures', 'pescador'],
    ['pesc-3', '55999330003', '123456', 'Rafael Antunes', 'Rafinha', 'Tenente Portela - RS', 'Caiaqueiros do Turvo', 'pescador'],
    ['pesc-4', '55999440004', '123456', 'Diego Belmonte', 'Belmonte', 'Santa Rosa - RS', 'Predadores do Uruguai', 'pescador'],
    ['pesc-5', '55999550005', '123456', 'Fernando Kroth', 'Kroth', 'Horizontina - RS', 'Traíra Insana', 'pescador'],
    ['pesc-6', '55999660006', '123456', 'Gustavo Scherer', 'Scherer', 'Ijuí - RS', 'Amigos do Rio', 'pescador'],
  ];

  for (const p of pescadoresSeed) {
    insertPescador.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
  }

  // Inscrições iniciais
  const insertInscricao = db.prepare(`
    INSERT INTO inscricoes (
      id, temporada_id, etapa_id, pescador_id, numero_inscricao,
      modalidade_principal, status_pagamento, valor_pago_centavos,
      comprovante_url, aprovado_por_id, aprovado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', 'pesc-1', '2026-03-02T10:00:00Z')
  `);

  insertInscricao.run('insc-1', temporadaId, 'etapa-1-outono', 'pesc-1', '#001', 'embarcado', 'pago', 5000);
  insertInscricao.run('insc-2', temporadaId, 'etapa-1-outono', 'pesc-2', '#002', 'caiaque', 'isento', 0);
  insertInscricao.run('insc-3', temporadaId, 'etapa-1-outono', 'pesc-3', '#003', 'caiaque', 'pago', 5000);
  insertInscricao.run('insc-4', temporadaId, 'etapa-1-outono', 'pesc-4', '#004', 'embarcado', 'pago', 5000);
  insertInscricao.run('insc-5', temporadaId, 'etapa-1-outono', 'pesc-5', '#005', 'barranco_acude', 'pago', 5000);
  insertInscricao.run('insc-6', temporadaId, 'etapa-1-outono', 'pesc-6', '#006', 'embarcado', 'pendente', 5000);

  // Registros de captura iniciais (aprovados + pendentes para arbitragem)
  const insertRegistro = db.prepare(`
    INSERT INTO registros (
      id, temporada_id, etapa_id, categoria_id, inscricao_id, pescador_id,
      especie_informada, medida_declarada, medida_aprovada, isca_marca, isca_modelo,
      captura_completa_sem_corte, local_captura, data_captura, palavra_chave_informada,
      foto_isca_url, video_medicao_url, status, checklist_juiz_json, parecer_juiz,
      motivo_reprovacao, avaliado_por_id, avaliado_por_nome, avaliado_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const allChecked = JSON.stringify({
    '0': true,
    '1': true,
    '2': true,
    '3': true,
    '4': true,
  });

  const registrosSeed = [
    [
      'reg-101', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-4', 'pesc-4',
      'Dourado', 68.5, 68.5, 'Mathias Iscas', 'Crank Eldorado 90',
      1, 'Rio Uruguai: Porto Soberbo', '2026-04-12T08:30:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '/uploads/my-video.mp4', 'aprovado', allChecked,
      'Medição exemplar no batente zero e soltura imediata com fisgada registrada.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-12T12:15:00Z',
    ],
    [
      'reg-102', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-4', 'pesc-4',
      'Dourado', 61.0, 61.0, 'Mathias Iscas', 'Minnow Deep 110',
      0, 'Rio Uruguai: Corredeira Grande', '2026-04-18T09:40:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Boca fechada no marco zero e palavra-chave audível.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-18T14:00:00Z',
    ],
    [
      'reg-103', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-4', 'pesc-4',
      'Dourado', 56.5, 56.0, 'Marine Sports', 'Inna Pro Tuned 110',
      0, 'Rio Uruguai: Ilha Redonda', '2026-05-02T16:20:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Ajustado de 56,5 cm para 56,0 cm conforme alinhamento caudal na régua.', '',
      'pesc-2', 'Mathias Ferreira', '2026-05-02T19:10:00Z',
    ],
    [
      'reg-104', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-3', 'pesc-3',
      'Dourado', 64.0, 64.0, 'Mathias Iscas', 'Jig Streamer Dourado',
      1, 'Rio Turvo: Poço das Pedras', '2026-04-15T07:15:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Captura completa sem corte a bordo de caiaque. Homologada.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-15T11:30:00Z',
    ],
    [
      'reg-105', temporadaId, 'etapa-1-outono', 'cat-dourado-caiaque', 'insc-3', 'pesc-3',
      'Dourado', 64.0, 64.0, 'Mathias Iscas', 'Jig Streamer Dourado',
      1, 'Rio Turvo: Poço das Pedras', '2026-04-15T07:15:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Mesmo exemplar válido na categoria Caiaque conforme regulamento da temporada.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-15T11:32:00Z',
    ],
    [
      'reg-106', temporadaId, 'etapa-1-outono', 'cat-dourado-caiaque', 'insc-3', 'pesc-3',
      'Dourado', 58.0, 58.0, 'Nelson Nakamura', 'Curisco 90',
      0, 'Rio Turvo: Volta Grande', '2026-04-29T10:10:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Leitura limpa em 58,0 cm.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-29T15:00:00Z',
    ],
    [
      'reg-107', temporadaId, 'etapa-1-outono', 'cat-traira-embarcado', 'insc-1', 'pesc-1',
      'Traíra Comum (Hoplias malabaricus)', 49.5, 49.5, 'Mathias Iscas', 'Frog Eldorado Weedless',
      1, 'Barragem Eldorado Lake', '2026-04-20T17:05:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Queixo exibido com nitidez confirmando Hoplias malabaricus. Fisgada + medição + soltura.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-20T20:00:00Z',
    ],
    [
      'reg-108', temporadaId, 'etapa-1-outono', 'cat-traira-embarcado', 'insc-1', 'pesc-1',
      'Traíra Comum (Hoplias malabaricus)', 46.0, 46.0, 'Mathias Iscas', 'Popper Mathias 75',
      0, 'Barragem Eldorado Lake', '2026-05-01T08:00:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Homologado sem ressalvas.', '',
      'pesc-2', 'Mathias Ferreira', '2026-05-01T13:20:00Z',
    ],
    [
      'reg-109', temporadaId, 'etapa-1-outono', 'cat-traira-barranco', 'insc-5', 'pesc-5',
      'Traíra Comum (Hoplias malabaricus)', 47.0, 47.0, 'Mathias Iscas', 'Ratão Mathias',
      1, 'Açude São José: Margem Norte', '2026-04-25T16:40:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Excelente captura de barranco com vídeo integral desde o ataque na superfície.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-25T21:00:00Z',
    ],
    [
      'reg-110', temporadaId, 'etapa-1-outono', 'cat-maior-exemplar-geral', 'insc-4', 'pesc-4',
      'Dourado', 68.5, 68.5, 'Mathias Iscas', 'Crank Eldorado 90',
      1, 'Rio Uruguai: Porto Soberbo', '2026-04-12T08:30:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Maior exemplar homologado até o momento na temporada.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-12T12:18:00Z',
    ],
    [
      'reg-111', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-1', 'pesc-1',
      'Dourado', 63.5, null, 'Mathias Iscas', 'Crank Eldorado 90',
      1, 'Rio Uruguai: Remanso do Ouro', '2026-05-10T09:15:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '/uploads/my-video.mp4', 'pendente', '{}',
      '', '', null, '', null,
    ],
    [
      'reg-112', temporadaId, 'etapa-1-outono', 'cat-traira-caiaque', 'insc-3', 'pesc-3',
      'Traíra Comum (Hoplias malabaricus)', 44.0, null, 'Mathias Iscas', 'Frog Mathias Pro',
      0, 'Lagoa dos Patos: Braço Sul', '2026-05-10T11:30:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'pendente', '{}',
      '', '', null, '', null,
    ],
  ];

  for (const r of registrosSeed) {
    insertRegistro.run(
      r[0], r[1], r[2], r[3], r[4], r[5],
      r[6], r[7], r[8], r[9], r[10],
      r[11], r[12], r[13], r[14],
      r[15], r[16], r[17], r[18], r[19],
      r[20], r[21], r[22], r[23]
    );
  }

  // Patrocinadores iniciais
  const insertPatrocinador = db.prepare(`
    INSERT INTO patrocinadores (
      id, temporada_id, nome, cota, segmento, logo_url, whatsapp_contato,
      endereco_cidade, beneficio_competidor, premio_especial_isca, ordem, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  insertPatrocinador.run(
    'pat-1',
    temporadaId,
    'Eldorado Pesca & Camping',
    'master',
    'Artigos de Pesca, Caiaques, Náutica e Camping',
    '/brand/logo-eldorado-amarelo-tight.png',
    '55999110001',
    'Três Passos - RS',
    '15% de desconto em toda a linha de pesca e camping para pagamentos à vista ou Pix com inscrição ativa.',
    'Troféu Oficial + Vale-Compras de R$ 1.500,00 para o Campeão Geral.',
    1
  );

  insertPatrocinador.run(
    'pat-2',
    temporadaId,
    'Mathias Iscas Artesanais',
    'master',
    'Fabricação de Iscas Artificiais de Alta Performance',
    '/brand/peixe-dourado-tight.png',
    '55999220002',
    'Crissiumal - RS',
    '15% de desconto em iscas customizadas e kits de torneio.',
    'Prêmio Especial Captura Completa sem Corte: Kit Oficial Mathias Iscas para o vídeo contínuo (fisgada + medição + soltura) usando isca da marca.',
    2
  );

  insertPatrocinador.run(
    'pat-3',
    temporadaId,
    'Náutica & Motores Rio Uruguai',
    'ouro',
    'Manutenção de Motores de Popa e Acessórios Náuticos',
    '/brand/isotipo-branco-tight.png',
    '55999770007',
    'Tenente Portela - RS',
    '15% de desconto em revisão preventiva de motor de popa e lubrificantes náuticos.',
    'Kit Segurança Náutica para sorteio entre todos os pescadores que homologarem ao menos 1 peixe.',
    3
  );

  insertPatrocinador.run(
    'pat-4',
    temporadaId,
    'Pousada & Porto Recanto do Dourado',
    'apoio',
    'Hospedagem, Rampa de Barcos e Guia de Pesca',
    '/brand/logo-eldorado-branco-tight.png',
    '55999880008',
    'Derrubadas - RS',
    'Diária com 15% de desconto e descida de barco gratuita para inscritos no Ranking Eldorado.',
    'Final de semana completo com acompanhante sorteado no encerramento da etapa.',
    4
  );

  // Notificações iniciais
  const insertNotificacao = db.prepare(`
    INSERT INTO notificacoes (
      id, temporada_id, etapa_id, titulo, mensagem, tipo, fixado, autor_nome
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertNotificacao.run(
    'not-1',
    temporadaId,
    'etapa-1-outono',
    'Palavra-Chave Oficial da 1ª Etapa Liberada: ELDORADO-77',
    'Atenção pescadores! Em todos os vídeos de medição e soltura da 1ª Etapa é obrigatório pronunciar de forma clara a palavra-chave ELDORADO-77 enquanto o peixe estiver posicionado sobre a régua oficial.',
    'palavra_chave',
    1,
    'Comissão de Arbitragem'
  );

  insertNotificacao.run(
    'not-2',
    temporadaId,
    'etapa-1-outono',
    'Identificação Obrigatória na Categoria Traíra (Hoplias malabaricus)',
    'Lembramos que para todas as categorias de Traíra (Embarcado, Caiaque e Barranco/Açude) o competidor deve mostrar brevemente a parte inferior da mandíbula (queixo) do peixe no vídeo para comprovar a espécie Hoplias malabaricus.',
    'aviso',
    1,
    'Direção Técnica'
  );
}

// ============================================================================
// MAPPERS E REPOSITÓRIO DE DADOS
// ============================================================================

function mapTemporadaRow(row: Record<string, unknown>): Temporada {
  return {
    id: String(row.id),
    nome: String(row.nome),
    slug: String(row.slug),
    subtitulo: String(row.subtitulo || ''),
    logo_url: String(row.logo_url || '/brand/logo-eldorado-amarelo-tight.png'),
    descricao: String(row.descricao || ''),
    regulamento_md: String(row.regulamento_md || ''),
    data_inicio: String(row.data_inicio),
    data_fim: String(row.data_fim),
    status: (row.status as Temporada['status']) || 'ativa',
    valor_inscricao_padrao_centavos: Number(row.valor_inscricao_padrao_centavos || 0),
    chave_pix_padrao: String(row.chave_pix_padrao || ''),
    beneficio_desconto_parceiros_pct: Number(row.beneficio_desconto_parceiros_pct || 15),
    permite_mesmo_peixe_multiplas_categorias: Boolean(row.permite_mesmo_peixe_multiplas_categorias),
    inscricao_unica_todas_categorias: Boolean(row.inscricao_unica_todas_categorias),
    regras_gerais: parseJsonSafe(row.regras_gerais_json, []),
    premiacao_especial: parseJsonSafe(row.premiacao_especial_json, []),
    created_at: String(row.created_at || ''),
  };
}

function mapCategoriaRow(row: Record<string, unknown>): Categoria {
  return {
    id: String(row.id),
    temporada_id: String(row.temporada_id),
    nome: String(row.nome),
    slug: String(row.slug),
    especie: String(row.especie),
    descricao_especie: String(row.descricao_especie || ''),
    modalidade: String(row.modalidade || 'livre'),
    unidade_medida: (row.unidade_medida as Categoria['unidade_medida']) || 'cm',
    formula_ranking: (row.formula_ranking as Categoria['formula_ranking']) || 'soma_top_n',
    top_n_peixes: Number(row.top_n_peixes || 3),
    criterio_desempate: (row.criterio_desempate as Categoria['criterio_desempate']) || 'maior_peixe',
    medida_minima: Number(row.medida_minima || 0),
    tempo_max_fora_agua_seg: Number(row.tempo_max_fora_agua_seg || 45),
    tempo_max_video_seg: Number(row.tempo_max_video_seg || 60),
    exige_foto_isca: Boolean(row.exige_foto_isca),
    exige_video_soltura: Boolean(row.exige_video_soltura),
    exige_palavra_chave: Boolean(row.exige_palavra_chave),
    checklist_validacao: parseJsonSafe<string[]>(row.checklist_validacao_json, []),
    premiacao: parseJsonSafe(row.premiacao_json, []),
    ordem: Number(row.ordem || 1),
    ativa: Boolean(row.ativa),
    created_at: String(row.created_at || ''),
  };
}

function mapEtapaRow(row: Record<string, unknown>): Etapa {
  return {
    id: String(row.id),
    temporada_id: String(row.temporada_id),
    numero: Number(row.numero || 1),
    titulo: String(row.titulo),
    subtitulo: String(row.subtitulo || ''),
    local_pesca: String(row.local_pesca || ''),
    cidade_uf: String(row.cidade_uf || ''),
    data_inicio: String(row.data_inicio),
    data_fim: String(row.data_fim),
    palavra_chave: String(row.palavra_chave || ''),
    revelar_palavra_chave: Boolean(row.revelar_palavra_chave),
    valor_inscricao_centavos: Number(row.valor_inscricao_centavos || 5000),
    chave_pix: String(row.chave_pix || ''),
    status: (row.status as Etapa['status']) || 'em_andamento',
    observacoes: String(row.observacoes || ''),
    created_at: String(row.created_at || ''),
  };
}

function mapPescadorRow(row: Record<string, unknown>): Pescador {
  return {
    id: String(row.id),
    whatsapp: String(row.whatsapp),
    nome: String(row.nome),
    apelido: String(row.apelido || ''),
    cidade_uf: String(row.cidade_uf || ''),
    equipe: String(row.equipe || ''),
    role: (row.role as Pescador['role']) || 'pescador',
    ativo: Boolean(row.ativo),
    created_at: String(row.created_at || ''),
    numero_inscricao: row.numero_inscricao ? String(row.numero_inscricao) : undefined,
  };
}

function mapInscricaoRow(row: Record<string, unknown>): Inscricao {
  return {
    id: String(row.id),
    temporada_id: String(row.temporada_id),
    etapa_id: row.etapa_id ? String(row.etapa_id) : null,
    pescador_id: String(row.pescador_id),
    pescador_nome: row.pescador_nome ? String(row.pescador_nome) : undefined,
    pescador_whatsapp: row.pescador_whatsapp ? String(row.pescador_whatsapp) : undefined,
    pescador_cidade_uf: row.pescador_cidade_uf ? String(row.pescador_cidade_uf) : undefined,
    pescador_equipe: row.pescador_equipe ? String(row.pescador_equipe) : undefined,
    numero_inscricao: String(row.numero_inscricao),
    modalidade_principal: String(row.modalidade_principal || 'livre'),
    status_pagamento: (row.status_pagamento as Inscricao['status_pagamento']) || 'pendente',
    valor_pago_centavos: Number(row.valor_pago_centavos || 0),
    comprovante_url: String(row.comprovante_url || ''),
    aprovado_por_id: row.aprovado_por_id ? String(row.aprovado_por_id) : null,
    aprovado_em: row.aprovado_em ? String(row.aprovado_em) : null,
    created_at: String(row.created_at || ''),
  };
}

function mapRegistroRow(row: Record<string, unknown>): RegistroCaptura {
  return {
    id: String(row.id),
    temporada_id: String(row.temporada_id),
    etapa_id: String(row.etapa_id),
    etapa_titulo: row.etapa_titulo ? String(row.etapa_titulo) : undefined,
    categoria_id: String(row.categoria_id),
    categoria_nome: row.categoria_nome ? String(row.categoria_nome) : undefined,
    categoria_unidade: row.categoria_unidade ? String(row.categoria_unidade) : 'cm',
    inscricao_id: row.inscricao_id ? String(row.inscricao_id) : null,
    pescador_id: String(row.pescador_id),
    pescador_nome: row.pescador_nome ? String(row.pescador_nome) : undefined,
    pescador_apelido: row.pescador_apelido ? String(row.pescador_apelido) : undefined,
    pescador_cidade_uf: row.pescador_cidade_uf ? String(row.pescador_cidade_uf) : undefined,
    pescador_equipe: row.pescador_equipe ? String(row.pescador_equipe) : undefined,
    numero_inscricao: row.numero_inscricao ? String(row.numero_inscricao) : undefined,
    especie_informada: String(row.especie_informada),
    medida_declarada: Number(row.medida_declarada || 0),
    medida_aprovada: row.medida_aprovada !== null && row.medida_aprovada !== undefined ? Number(row.medida_aprovada) : null,
    isca_marca: String(row.isca_marca || ''),
    isca_modelo: String(row.isca_modelo || ''),
    captura_completa_sem_corte: Boolean(row.captura_completa_sem_corte),
    local_captura: String(row.local_captura || ''),
    data_captura: String(row.data_captura),
    palavra_chave_informada: String(row.palavra_chave_informada || ''),
    foto_isca_url: String(row.foto_isca_url || ''),
    video_medicao_url: String(row.video_medicao_url || ''),
    status: (row.status as RegistroCaptura['status']) || 'pendente',
    checklist_juiz: parseJsonSafe<Record<string, boolean>>(row.checklist_juiz_json, {}),
    parecer_juiz: String(row.parecer_juiz || ''),
    motivo_reprovacao: String(row.motivo_reprovacao || ''),
    avaliado_por_id: row.avaliado_por_id ? String(row.avaliado_por_id) : null,
    avaliado_por_nome: String(row.avaliado_por_nome || ''),
    avaliado_em: row.avaliado_em ? String(row.avaliado_em) : null,
    created_at: String(row.created_at || ''),
  };
}

function mapPatrocinadorRow(row: Record<string, unknown>): Patrocinador {
  return {
    id: String(row.id),
    temporada_id: String(row.temporada_id),
    nome: String(row.nome),
    cota: (row.cota as Patrocinador['cota']) || 'ouro',
    segmento: String(row.segmento || ''),
    logo_url: String(row.logo_url || ''),
    whatsapp_contato: String(row.whatsapp_contato || ''),
    endereco_cidade: String(row.endereco_cidade || ''),
    beneficio_competidor: String(row.beneficio_competidor || ''),
    premio_especial_isca: String(row.premio_especial_isca || ''),
    ordem: Number(row.ordem || 1),
    ativo: Boolean(row.ativo),
    created_at: String(row.created_at || ''),
  };
}

function mapNotificacaoRow(row: Record<string, unknown>): Notificacao {
  return {
    id: String(row.id),
    temporada_id: String(row.temporada_id),
    etapa_id: row.etapa_id ? String(row.etapa_id) : null,
    titulo: String(row.titulo),
    mensagem: String(row.mensagem),
    tipo: (row.tipo as Notificacao['tipo']) || 'aviso',
    fixado: Boolean(row.fixado),
    autor_nome: String(row.autor_nome || 'Comissão Organizadora'),
    created_at: String(row.created_at || ''),
  };
}

// ============================================================================
// CONSULTAS E OPERAÇÕES DO DOMÍNIO
// ============================================================================

export function getActiveTemporada(): Temporada {
  const db = getDb();
  let row = db
    .prepare(`SELECT * FROM temporadas WHERE status = 'ativa' ORDER BY created_at DESC LIMIT 1`)
    .get() as Record<string, unknown> | undefined;
  if (!row) {
    initSchemaAndSeed(db);
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

export function updateTemporada(data: Partial<Temporada> & { id: string }): Temporada {
  const db = getDb();
  const current = mapTemporadaRow(
    db.prepare(`SELECT * FROM temporadas WHERE id = ?`).get(data.id) as Record<string, unknown>
  );

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
}

export function getCategoriasByTemporada(temporadaId: string, includeInactive = false): Categoria[] {
  const db = getDb();
  const sql = includeInactive
    ? `SELECT * FROM categorias WHERE temporada_id = ? ORDER BY ordem ASC, nome ASC`
    : `SELECT * FROM categorias WHERE temporada_id = ? AND ativa = 1 ORDER BY ordem ASC, nome ASC`;
  const rows = db.prepare(sql).all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapCategoriaRow);
}

export function upsertCategoria(data: Partial<Categoria> & { temporada_id: string; nome: string }): Categoria {
  const db = getDb();
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
}

export function deleteCategoria(id: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM categorias WHERE id = ?`).run(id);
}

export function getEtapasByTemporada(temporadaId: string): Etapa[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM etapas WHERE temporada_id = ? ORDER BY numero ASC, data_inicio ASC`)
    .all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapEtapaRow);
}

export function upsertEtapa(data: Partial<Etapa> & { temporada_id: string; titulo: string }): Etapa {
  const db = getDb();
  const id = data.id || `etapa-${Date.now()}`;
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
      data.local_pesca || 'Local Oficial',
      data.cidade_uf || 'RS',
      data.data_inicio || '2026-03-01',
      data.data_fim || '2026-11-30',
      data.palavra_chave || 'ELDORADO',
      (data.revelar_palavra_chave ?? true) ? 1 : 0,
      data.valor_inscricao_centavos ?? 5000,
      data.chave_pix || 'pix@eldoradopesca.com.br',
      data.status || 'em_andamento',
      data.observacoes || ''
    );
  }

  return mapEtapaRow(db.prepare(`SELECT * FROM etapas WHERE id = ?`).get(id) as Record<string, unknown>);
}

export function deleteEtapa(id: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM etapas WHERE id = ?`).run(id);
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

export function authenticatePescador(whatsapp: string, senha: string): Pescador | null {
  const db = getDb();
  const digits = whatsapp.replace(/\D/g, '');
  const suffix8 = digits.slice(-8);
  const row = db
    .prepare(`
      SELECT * FROM pescadores 
      WHERE (whatsapp = ? OR (length(?) >= 8 AND whatsapp LIKE ?) OR (? LIKE '%' || whatsapp))
        AND senha_hash = ? 
        AND ativo = 1 
      LIMIT 1
    `)
    .get(digits, digits, `%${suffix8}`, digits, senha) as Record<string, unknown> | undefined;
  if (!row) return null;
  return getPescadorById(String(row.id));
}

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

export function getPatrocinadoresByTemporada(temporadaId: string): Patrocinador[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM patrocinadores WHERE temporada_id = ? ORDER BY ordem ASC, nome ASC`)
    .all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapPatrocinadorRow);
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

export function getNotificacoesByTemporada(temporadaId: string): Notificacao[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM notificacoes WHERE temporada_id = ? ORDER BY fixado DESC, created_at DESC`)
    .all(temporadaId) as Record<string, unknown>[];
  return rows.map(mapNotificacaoRow);
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

// ============================================================================
// MOTOR DE RANKING 100% PARAMETRIZADO E DESENGESSADO
// ============================================================================

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
    // Ordena capturas da maior medida para a menor; em empate, mais antiga primeiro
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

  // Ordenação final parametrizada pelo critério de desempate da categoria
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
