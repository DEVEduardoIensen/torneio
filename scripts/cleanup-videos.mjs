/**
 * FisgaRank — Política de Retenção e Limpeza Automática de Vídeos
 * 
 * Finalidade: Liberar espaço em disco (NVMe) na nuvem da Oracle Cloud
 * apagando vídeos brutos de medição de etapas encerradas há mais de 30 dias.
 * 
 * Regra de Ouro:
 * - O ranking, os pontos, os troféus, a homologação e a foto da isca NUNCA são apagados.
 * - Apenas o arquivo de vídeo pesado (.mp4) é removido do disco.
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbPath = path.join(rootDir, 'data', 'torneio.db');
const uploadsDir = path.join(rootDir, 'public', 'uploads');

const RETENTION_DAYS = parseInt(process.env.VIDEO_RETENTION_DAYS || '30', 10);

console.log('====================================================');
console.log(`[FisgaRank Purge] Iniciando política de retenção (${RETENTION_DAYS} dias)...`);
console.log(`[FisgaRank Purge] Data/Hora: ${new Date().toISOString()}`);

if (!fs.existsSync(dbPath)) {
  console.log(`[FisgaRank Purge] Banco de dados não encontrado em ${dbPath}. Encerrando.`);
  process.exit(0);
}

const db = new DatabaseSync(dbPath);

// Calcula data limite
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
const cutoffIso = cutoffDate.toISOString();

console.log(`[FisgaRank Purge] Removendo vídeos de etapas finalizadas antes de: ${cutoffIso}`);

// Busca etapas encerradas ou cuja data_fim já passou do período de carência
const sqlEtapas = `
  SELECT id, titulo, data_fim, status 
  FROM etapas 
  WHERE data_fim < ? OR status = 'encerrada'
`;

const etapasEncerradas = db.prepare(sqlEtapas).all(cutoffIso);

if (etapasEncerradas.length === 0) {
  console.log('[FisgaRank Purge] Nenhuma etapa encerrada além do prazo de retenção. Espaço em disco otimizado.');
  process.exit(0);
}

const etapaIds = etapasEncerradas.map((e) => e.id);
console.log(`[FisgaRank Purge] Etapas elegíveis para limpeza (${etapaIds.length}):`, etapaIds);

// Busca registros dessas etapas que ainda tenham vídeo em disco
const placeholders = etapaIds.map(() => '?').join(',');
const sqlRegistros = `
  SELECT id, especie_informada, video_medicao_url, status
  FROM registros
  WHERE etapa_id IN (${placeholders})
    AND video_medicao_url != ''
    AND video_medicao_url NOT LIKE '[EXPIRADO%'
`;

const registrosComVideo = db.prepare(sqlRegistros).all(...etapaIds);

console.log(`[FisgaRank Purge] Encontrados ${registrosComVideo.length} registros com vídeos a expirar.`);

let bytesLiberados = 0;
let videosApagados = 0;

const updateRegistro = db.prepare(`
  UPDATE registros 
  SET video_medicao_url = '[EXPIRADO_RETENCAO_30_DIAS]' 
  WHERE id = ?
`);

for (const reg of registrosComVideo) {
  const relativeUrl = reg.video_medicao_url.replace(/^\//, '');
  const filePath = path.join(rootDir, 'public', relativeUrl);

  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      bytesLiberados += stats.size;
      fs.unlinkSync(filePath);
      videosApagados++;
      console.log(`[OK] Vídeo removido: ${relativeUrl} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    } else {
      console.log(`[AVISO] Arquivo não existia no disco: ${relativeUrl}`);
    }

    updateRegistro.run(reg.id);
  } catch (err) {
    console.error(`[ERRO] Falha ao processar arquivo ${filePath}:`, err);
  }
}

const mbLiberados = (bytesLiberados / (1024 * 1024)).toFixed(2);
console.log('====================================================');
console.log(`[FisgaRank Purge] Concluído com sucesso!`);
console.log(`[FisgaRank Purge] Total de vídeos expurgados: ${videosApagados}`);
console.log(`[FisgaRank Purge] Espaço em disco liberado: ${mbLiberados} MB`);
console.log(`[FisgaRank Purge] Histórico de classificação e troféus 100% preservado no banco.`);
console.log('====================================================');
