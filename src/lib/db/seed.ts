import { DatabaseSync } from 'node:sqlite';
import {
  SEED_CATEGORIAS,
  SEED_PESCADORES,
  SEED_PREMIACAO_ESPECIAL,
  SEED_REGRAS_GERAIS,
  SEED_TEMPORADA_ID,
} from './seed-data';

export function seedDatabase(db: DatabaseSync): void {
  const countRow = db.prepare('SELECT COUNT(*) as total FROM temporadas').get() as { total: number };
  if (countRow.total > 0) {
    return;
  }

  const temporadaId = SEED_TEMPORADA_ID;

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
    JSON.stringify(SEED_REGRAS_GERAIS),
    JSON.stringify(SEED_PREMIACAO_ESPECIAL)
  );

  const insertCategoria = db.prepare(`
    INSERT INTO categorias (
      id, temporada_id, nome, slug, especie, descricao_especie, modalidade,
      unidade_medida, formula_ranking, top_n_peixes, criterio_desempate,
      medida_minima, tempo_max_fora_agua_seg, tempo_max_video_seg,
      exige_foto_isca, exige_video_soltura, exige_palavra_chave,
      checklist_validacao_json, premiacao_json, ordem, ativa
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1, ?, ?, ?, 1)
  `);

  for (const c of SEED_CATEGORIAS) {
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

  const insertPescador = db.prepare(`
    INSERT INTO pescadores (id, whatsapp, senha_hash, nome, apelido, cidade_uf, equipe, role, ativo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  for (const p of SEED_PESCADORES) {
    insertPescador.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
  }

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
      1, 'Rio Turvo: Salto Pirapó', '2026-04-21T07:15:00Z', 'ELDORADO-77',
      '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
      'Captura a bordo de caiaque homologada.', '',
      'pesc-2', 'Mathias Ferreira', '2026-04-21T11:00:00Z',
    ],
  ];

  for (const r of registrosSeed) {
    insertRegistro.run(
      r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10],
      r[11], r[12], r[13], r[14], r[15], r[16], r[17], r[18], r[19], r[20], r[21], r[22], r[23]
    );
  }

  const insertPatrocinador = db.prepare(`
    INSERT INTO patrocinadores (
      id, temporada_id, nome, cota, segmento, logo_url, whatsapp_contato,
      endereco_cidade, beneficio_competidor, premio_especial_isca, ordem, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  insertPatrocinador.run(
    'pat-eldorado',
    temporadaId,
    'Eldorado Pesca & Camping',
    'master',
    'Loja Especializada & Artigos de Pesca',
    '/brand/logo-eldorado-amarelo-tight.png',
    '5555999990001',
    'Três Passos - RS',
    '15% de desconto à vista ou Pix em qualquer compra mediante apresentação da inscrição ativa.',
    'Troféu Gigante da Temporada + Vara Custom Carbono',
    1
  );

  insertPatrocinador.run(
    'pat-mathias',
    temporadaId,
    'Mathias Custom Lures',
    'ouro',
    'Fabricação Artesanal de Iscas Artificiais',
    '/brand/logo-eldorado-branco-tight.png',
    '5555999990002',
    'Crissiumal - RS',
    '10% de desconto em kits personalizados de iscas para dourado e traíra.',
    'Prêmio Especial: Kit Mathias Iscas para a Maior Captura sem Corte',
    2
  );

  const insertNotificacao = db.prepare(`
    INSERT INTO notificacoes (id, temporada_id, etapa_id, titulo, mensagem, tipo, fixado, autor_nome)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
