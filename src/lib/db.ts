/**
 * Facade de banco de dados do FisgaRank
 * Arquitetura desmembrada em módulos desacoplados (Vibe-Coding Standard <= 350 linhas):
 * - connection.ts: Inicialização SQLite e Pragma
 * - schema.ts: Definições DDL das tabelas
 * - seed.ts: Carga inicial de temporadas, categorias e admin
 * - mappers.ts: Conversão de linhas SQL para entidades de domínio tipadas
 * - queries.ts: Consultas de leitura (ActiveTemporada, Rankings, etc.)
 * - mutations.ts: Operações de escrita e auditoria
 * - auth.ts: Rotinas de autenticação via WhatsApp
 * - ranking.ts: Motor de cálculo e desempate de pontuação
 */

export * from './db/connection';
export * from './db/schema';
export * from './db/seed';
export * from './db/mappers';
export * from './db/queries';
export * from './db/mutations';
export * from './db/auth';
export * from './db/ranking';
