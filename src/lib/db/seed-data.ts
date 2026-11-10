export const SEED_TEMPORADA_ID = 'temp-eldorado-2026';

export const SEED_REGRAS_GERAIS = [
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

export const SEED_PREMIACAO_ESPECIAL = [
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

export const SEED_CATEGORIAS = [
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

export const SEED_PESCADORES = [
  ['pesc-tiago', '5542999162340', '123456', 'Tiago Witeck', 'Witeck', 'Três Passos - RS', 'Direção Geral FisgaRank', 'admin'],
  ['pesc-1', '55999110001', '123456', 'Lucas Zanardini', 'Zanardini', 'Três Passos - RS', 'Equipe Eldorado Pro', 'admin'],
  ['pesc-2', '55999220002', '123456', 'Mathias Ferreira', 'Mathias Iscas', 'Crissiumal - RS', 'Mathias Custom Lures', 'pescador'],
  ['pesc-3', '55999330003', '123456', 'Rafael Antunes', 'Rafinha', 'Tenente Portela - RS', 'Caiaqueiros do Turvo', 'pescador'],
  ['pesc-4', '55999440004', '123456', 'Diego Belmonte', 'Belmonte', 'Santa Rosa - RS', 'Predadores do Uruguai', 'pescador'],
  ['pesc-5', '55999550005', '123456', 'Fernando Kroth', 'Kroth', 'Horizontina - RS', 'Traíra Insana', 'pescador'],
  ['pesc-6', '55999660006', '123456', 'Gustavo Scherer', 'Scherer', 'Ijuí - RS', 'Amigos do Rio', 'pescador'],
];

