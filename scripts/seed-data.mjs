import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('D:/torneio/data/torneio.db');

// Ensure Tiago Witeck is present
db.prepare(`
  INSERT OR REPLACE INTO pescadores (id, whatsapp, senha_hash, nome, apelido, cidade_uf, equipe, role, ativo)
  VALUES ('pesc-tiago', '5542999162340', '123456', 'Tiago Witeck', 'Witeck', 'Três Passos - RS', 'Direção Geral FisgaRank', 'admin', 1)
`).run();

// Seed Inscrições
const insertInscricao = db.prepare(`
  INSERT OR REPLACE INTO inscricoes (
    id, temporada_id, etapa_id, pescador_id, numero_inscricao,
    modalidade_principal, status_pagamento, valor_pago_centavos,
    comprovante_url, aprovado_por_id, aprovado_em
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', 'pesc-1', '2026-03-02T10:00:00Z')
`);

const temporadaId = 'temp-eldorado-2026';
insertInscricao.run('insc-tiago', temporadaId, 'etapa-1-outono', 'pesc-tiago', '#000', 'livre', 'isento', 0);
insertInscricao.run('insc-1', temporadaId, 'etapa-1-outono', 'pesc-1', '#001', 'embarcado', 'pago', 5000);
insertInscricao.run('insc-2', temporadaId, 'etapa-1-outono', 'pesc-2', '#002', 'caiaque', 'isento', 0);
insertInscricao.run('insc-3', temporadaId, 'etapa-1-outono', 'pesc-3', '#003', 'caiaque', 'pago', 5000);
insertInscricao.run('insc-4', temporadaId, 'etapa-1-outono', 'pesc-4', '#004', 'embarcado', 'pago', 5000);
insertInscricao.run('insc-5', temporadaId, 'etapa-1-outono', 'pesc-5', '#005', 'barranco_acude', 'pago', 5000);
insertInscricao.run('insc-6', temporadaId, 'etapa-1-outono', 'pesc-6', '#006', 'embarcado', 'pendente', 5000);

// Seed Registros de Captura
const insertRegistro = db.prepare(`
  INSERT OR REPLACE INTO registros (
    id, temporada_id, etapa_id, categoria_id, inscricao_id, pescador_id,
    especie_informada, medida_declarada, medida_aprovada, isca_marca, isca_modelo,
    captura_completa_sem_corte, local_captura, data_captura, palavra_chave_informada,
    foto_isca_url, video_medicao_url, status, checklist_juiz_json, parecer_juiz,
    motivo_reprovacao, avaliado_por_id, avaliado_por_nome, avaliado_em
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const allChecked = JSON.stringify({ '0': true, '1': true, '2': true, '3': true, '4': true });

const registros = [
  [
    'reg-101', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-4', 'pesc-4',
    'Dourado', 68.5, 68.5, 'Mathias Iscas', 'Crank Eldorado 90',
    1, 'Rio Uruguai: Porto Soberbo', '2026-04-12T08:30:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '/uploads/my-video.mp4', 'aprovado', allChecked,
    'Medição exemplar no batente zero e soltura imediata com fisgada registrada.', '',
    'pesc-1', 'Tiago Witeck', '2026-04-12T12:15:00Z',
  ],
  [
    'reg-102', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-4', 'pesc-4',
    'Dourado', 61.0, 61.0, 'Mathias Iscas', 'Minnow Deep 110',
    0, 'Rio Uruguai: Corredeira Grande', '2026-04-18T09:40:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
    'Boca fechada no marco zero e palavra-chave audível.', '',
    'pesc-1', 'Tiago Witeck', '2026-04-18T14:00:00Z',
  ],
  [
    'reg-103', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-4', 'pesc-4',
    'Dourado', 56.5, 56.0, 'Marine Sports', 'Inna Pro Tuned 110',
    0, 'Rio Uruguai: Ilha Redonda', '2026-05-02T16:20:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
    'Ajustado de 56,5 cm para 56,0 cm conforme alinhamento caudal na régua.', '',
    'pesc-1', 'Tiago Witeck', '2026-05-02T19:10:00Z',
  ],
  [
    'reg-104', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-3', 'pesc-3',
    'Dourado', 64.0, 64.0, 'Mathias Iscas', 'Jig Streamer Dourado',
    1, 'Rio Turvo: Poço das Pedras', '2026-04-15T07:15:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '/uploads/my-video.mp4', 'aprovado', allChecked,
    'Captura completa sem corte a bordo de caiaque. Homologada.', '',
    'pesc-1', 'Tiago Witeck', '2026-04-15T11:30:00Z',
  ],
  [
    'reg-105', temporadaId, 'etapa-1-outono', 'cat-dourado-caiaque', 'insc-3', 'pesc-3',
    'Dourado', 64.0, 64.0, 'Mathias Iscas', 'Jig Streamer Dourado',
    1, 'Rio Turvo: Poço das Pedras', '2026-04-15T07:15:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '/uploads/my-video.mp4', 'aprovado', allChecked,
    'Mesmo exemplar válido na categoria Caiaque conforme regulamento da temporada.', '',
    'pesc-1', 'Tiago Witeck', '2026-04-15T11:32:00Z',
  ],
  [
    'reg-107', temporadaId, 'etapa-1-outono', 'cat-traira-embarcado', 'insc-1', 'pesc-1',
    'Traíra Comum (Hoplias malabaricus)', 49.5, 49.5, 'Mathias Iscas', 'Frog Eldorado Weedless',
    1, 'Barragem Eldorado Lake', '2026-04-20T17:05:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '', 'aprovado', allChecked,
    'Queixo exibido com nitidez confirmando Hoplias malabaricus. Fisgada + medição + soltura.', '',
    'pesc-1', 'Tiago Witeck', '2026-04-20T20:00:00Z',
  ],
  [
    'reg-110', temporadaId, 'etapa-1-outono', 'cat-maior-exemplar-geral', 'insc-4', 'pesc-4',
    'Dourado', 68.5, 68.5, 'Mathias Iscas', 'Crank Eldorado 90',
    1, 'Rio Uruguai: Porto Soberbo', '2026-04-12T08:30:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '/uploads/my-video.mp4', 'aprovado', allChecked,
    'Maior exemplar homologado até o momento na temporada.', '',
    'pesc-1', 'Tiago Witeck', '2026-04-12T12:18:00Z',
  ],
  [
    'reg-111', temporadaId, 'etapa-1-outono', 'cat-dourado-geral', 'insc-4', 'pesc-4',
    'Dourado (Salminus brasiliensis)', 65.0, null, 'Mathias Iscas', 'Crank Eldorado 90',
    1, 'Rio Uruguai: Remanso do Ouro', '2026-05-10T09:15:00Z', 'ELDORADO-77',
    '/brand/peixe-dourado-tight.png', '/uploads/my-video.mp4', 'pendente', '{}',
    '', '', null, '', null,
  ],
];

for (const r of registros) {
  insertRegistro.run(...r);
}

// Update the user's submitted capture to also use my-video.mp4
db.prepare(`UPDATE registros SET video_medicao_url = '/uploads/my-video.mp4' WHERE video_medicao_url = '' OR video_medicao_url IS NULL`).run();

console.log('Seeding complete!');
console.log('Pescadores:', db.prepare('SELECT id, nome, role FROM pescadores').all());
console.log('Inscrições:', db.prepare('SELECT count(*) as c FROM inscricoes').get());
console.log('Registros com vídeo:', db.prepare("SELECT id, especie_informada, video_medicao_url, status FROM registros WHERE video_medicao_url != ''").all());

