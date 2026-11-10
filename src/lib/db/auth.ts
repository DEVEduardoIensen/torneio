import { Pescador } from '@/types/domain';
import { getDb } from './connection';
import { getPescadorById } from './queries';

export function authenticatePescador(whatsapp: string, senha: string): Pescador | null {
  if (!whatsapp || !senha) return null;
  const digits = whatsapp.replace(/\D/g, '');
  if (!digits) return null;

  const db = getDb();
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
