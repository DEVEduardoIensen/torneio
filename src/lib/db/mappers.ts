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
import { parseJsonSafe } from './connection';

export function mapTemporadaRow(row: Record<string, unknown>): Temporada {
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

export function mapCategoriaRow(row: Record<string, unknown>): Categoria {
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

export function mapEtapaRow(row: Record<string, unknown>): Etapa {
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

export function mapPescadorRow(row: Record<string, unknown>): Pescador {
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

export function mapInscricaoRow(row: Record<string, unknown>): Inscricao {
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

export function mapRegistroRow(row: Record<string, unknown>): RegistroCaptura {
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

export function mapPatrocinadorRow(row: Record<string, unknown>): Patrocinador {
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

export function mapNotificacaoRow(row: Record<string, unknown>): Notificacao {
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

