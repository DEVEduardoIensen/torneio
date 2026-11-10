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
  db.exec('PRAGMA journal_mode = DELETE;');
  db.exec('PRAGMA foreign_keys = ON;');
  
  initSchema(db);
  seedDatabase(db);
  
  global.__torneioDb = db;
  return db;
}
