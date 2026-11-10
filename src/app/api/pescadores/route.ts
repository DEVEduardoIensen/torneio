import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPescadores,
  getPescadorById,
  upsertPescador,
} from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const pescador = getPescadorById(id);
    if (!pescador) {
      return NextResponse.json({ error: 'Pescador não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ pescador });
  }
  return NextResponse.json({ pescadores: getAllPescadores() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nome || !body.whatsapp) {
      return NextResponse.json({ error: 'Nome e WhatsApp são obrigatórios.' }, { status: 400 });
    }
    const saved = upsertPescador(body);
    return NextResponse.json({ pescador: saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao salvar pescador.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

