import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { initSchema } from './schema';
import { seedDatabase } from './seed';

export const DATA_DIR = path.join(process.cwd(), 'data');
export const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
export const DB_PATH = path.join(DATA_DIR, 'torneio.db');

declare global {
  var __torneioDb: DatabaseSync | undefined;
  var __torneioInTransaction: boolean | undefined;
}

export function ensureDirectories(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function parseJsonSafe<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string' || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getDb(): DatabaseSync {
  if (global.__torneioDb) {
    return global.__torneioDb;
  }
  ensureDirectories();
  const db = new DatabaseSync(DB_PATH);

  // Pragmas de alta performance e concorrência segura (WAL)
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec('PRAGMA cache_size = -64000;'); // 64 MB em RAM para cache de páginas
  db.exec('PRAGMA temp_store = MEMORY;');
  db.exec('PRAGMA mmap_size = 268435456;'); // 256 MB memory-mapped I/O
  db.exec('PRAGMA foreign_keys = ON;');

  initSchema(db);
  seedDatabase(db);

  global.__torneioDb = db;
  return db;
}

/**
 * Executa uma operação em bloco atômico transacional (ACID).
 * Utiliza BEGIN IMMEDIATE para prevenir lock contention no SQLite WAL mode,
 * e suporta savepoints aninhados se já houver uma transação ativa.
 */
export function withTransaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  if (global.__torneioInTransaction) {
    const sp = `sp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    db.exec(`SAVEPOINT ${sp};`);
    try {
      const result = fn(db);
      db.exec(`RELEASE SAVEPOINT ${sp};`);
      return result;
    } catch (err) {
      db.exec(`ROLLBACK TO SAVEPOINT ${sp};`);
      throw err;
    }
  }

  global.__torneioInTransaction = true;
  db.exec('BEGIN IMMEDIATE;');
  try {
    const result = fn(db);
    db.exec('COMMIT;');
    return result;
  } catch (err) {
    try {
      db.exec('ROLLBACK;');
    } catch {
      // Ignora se já revertido
    }
    throw err;
  } finally {
    global.__torneioInTransaction = false;
  }
}
