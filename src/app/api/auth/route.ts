import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  authenticatePescador,
  getAllPescadores,
  getPescadorById,
} from '@/lib/db';

const COOKIE_NAME = 'torneio_user_id';

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value || 'pesc-1';
  const currentUser = getPescadorById(userId) || getAllPescadores()[0];
  const pescadores = getAllPescadores();
  return NextResponse.json({
    user: currentUser,
    pescadores,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Troca rápida de usuário (para homologação / demonstração de perfis)
    if (body.switchUserId) {
      const target = getPescadorById(String(body.switchUserId));
      if (!target) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
      }
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, target.id, { path: '/', maxAge: 60 * 60 * 24 * 30 });
      return NextResponse.json({ user: target });
    }

    const whatsapp = String(body.whatsapp || '');
    const senha = String(body.senha || '123456');
    const user = authenticatePescador(whatsapp, senha);
    if (!user) {
      return NextResponse.json(
        { error: 'WhatsApp ou senha inválidos. Verifique os dígitos informados.' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, user.id, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao autenticar.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}

