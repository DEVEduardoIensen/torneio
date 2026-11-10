export type FormulaRanking = 'soma_top_n' | 'maior_exemplar' | 'soma_total' | 'media_top_n';
export type CriterioDesempate = 'maior_peixe' | 'captura_mais_antiga';
export type ModalidadePesca = 'embarcado' | 'caiaque' | 'barranco_acude' | 'livre' | string;
export type UserRole = 'pescador' | 'admin';
export type StatusRegistro = 'pendente' | 'aprovado' | 'reprovado';

export interface PremioItem {
  colocacao: string;
  titulo: string;
  valor_ou_descricao: string;
}

export interface RegraGeralItem {
  titulo: string;
  descricao: string;
}

export interface Temporada {
  id: string;
  nome: string;
  slug: string;
  subtitulo: string;
  logo_url: string;
  descricao: string;
  regulamento_md: string;
  data_inicio: string;
  data_fim: string;
  status: 'rascunho' | 'ativa' | 'encerrada';
  valor_inscricao_padrao_centavos: number;
  chave_pix_padrao: string;
  beneficio_desconto_parceiros_pct: number;
  permite_mesmo_peixe_multiplas_categorias: boolean;
  inscricao_unica_todas_categorias: boolean;
  regras_gerais: RegraGeralItem[];
  premiacao_especial: PremioItem[];
  created_at: string;
}

export interface Categoria {
  id: string;
  temporada_id: string;
  nome: string;
  slug: string;
  especie: string;
  descricao_especie: string;
  modalidade: ModalidadePesca;
  unidade_medida: 'cm' | 'kg' | 'pontos';
  formula_ranking: FormulaRanking;
  top_n_peixes: number;
  criterio_desempate: CriterioDesempate;
  medida_minima: number;
  tempo_max_fora_agua_seg: number;
  tempo_max_video_seg: number;
  exige_foto_isca: boolean;
  exige_video_soltura: boolean;
  exige_palavra_chave: boolean;
  checklist_validacao: string[];
  premiacao: PremioItem[];
  ordem: number;
  ativa: boolean;
  created_at: string;
}

export interface Etapa {
  id: string;
  temporada_id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  local_pesca: string;
  cidade_uf: string;
  data_inicio: string;
  data_fim: string;
  palavra_chave: string;
  revelar_palavra_chave: boolean;
  valor_inscricao_centavos: number;
  chave_pix: string;
  status: 'agendada' | 'inscricoes_abertas' | 'em_andamento' | 'apuracao' | 'encerrada';
  observacoes: string;
  created_at: string;
}

export interface Pescador {
  id: string;
  whatsapp: string;
  nome: string;
  apelido: string;
  cidade_uf: string;
  equipe: string;
  role: UserRole;
  ativo: boolean;
  created_at: string;
  numero_inscricao?: string;
}

export interface Inscricao {
  id: string;
  temporada_id: string;
  etapa_id: string | null;
  pescador_id: string;
  pescador_nome?: string;
  pescador_whatsapp?: string;
  pescador_cidade_uf?: string;
  pescador_equipe?: string;
  numero_inscricao: string;
  modalidade_principal: string;
  status_pagamento: 'pendente' | 'pago' | 'isento' | 'cancelado';
  valor_pago_centavos: number;
  comprovante_url: string;
  aprovado_por_id: string | null;
  aprovado_em: string | null;
  created_at: string;
}

export interface RegistroCaptura {
  id: string;
  temporada_id: string;
  etapa_id: string;
  etapa_titulo?: string;
  categoria_id: string;
  categoria_nome?: string;
  categoria_unidade?: string;
  inscricao_id: string | null;
  pescador_id: string;
  pescador_nome?: string;
  pescador_apelido?: string;
  pescador_cidade_uf?: string;
  pescador_equipe?: string;
  numero_inscricao?: string;
  especie_informada: string;
  medida_declarada: number;
  medida_aprovada: number | null;
  isca_marca: string;
  isca_modelo: string;
  captura_completa_sem_corte: boolean;
  local_captura: string;
  data_captura: string;
  palavra_chave_informada: string;
  foto_isca_url: string;
  video_medicao_url: string;
  status: StatusRegistro;
  checklist_juiz: Record<string, boolean>;
  parecer_juiz: string;
  motivo_reprovacao: string;
  avaliado_por_id: string | null;
  avaliado_por_nome: string;
  avaliado_em: string | null;
  created_at: string;
}

export interface Patrocinador {
  id: string;
  temporada_id: string;
  nome: string;
  cota: 'master' | 'ouro' | 'prata' | 'apoio';
  segmento: string;
  logo_url: string;
  whatsapp_contato: string;
  endereco_cidade: string;
  beneficio_competidor: string;
  premio_especial_isca: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export interface Notificacao {
  id: string;
  temporada_id: string;
  etapa_id: string | null;
  titulo: string;
  mensagem: string;
  tipo: 'palavra_chave' | 'aviso' | 'resultado' | 'sorteio';
  fixado: boolean;
  autor_nome: string;
  created_at: string;
}

export interface RankingEntry {
  posicao: number;
  pescador_id: string;
  pescador_nome: string;
  pescador_apelido: string;
  cidade_uf: string;
  equipe: string;
  numero_inscricao: string;
  pontuacao_total: number;
  maior_exemplar: number;
  total_capturas_aprovadas: number;
  capturas_computadas: {
    id: string;
    medida: number;
    isca_marca: string;
    isca_modelo: string;
    local_captura: string;
    data_captura: string;
    foto_isca_url: string;
    captura_completa_sem_corte: boolean;
  }[];
}

export interface CategoryRankingResult {
  categoria: Categoria;
  entries: RankingEntry[];
}

