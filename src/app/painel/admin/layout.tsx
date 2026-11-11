'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function AdminLayoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = usePainel();

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-[#a1a8b9]">
        Verificando permissões...
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
  const canAccess = isAdmin;

  if (!canAccess) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Acesso restrito</h1>
        <p className="mt-2 text-base text-[#a1a8b9]">
          Você está conectado como{' '}
          <strong className="text-[#f3f4f6]">{currentUser?.nome || 'Competidor'}</strong> (
          {currentUser?.role || 'pescador'}). Esta área é exclusiva para administradores.
        </p>
        <Link
          href="/painel"
          className="mt-4 inline-flex h-12 items-center gap-2 text-base font-semibold text-[#e5c158] hover:text-[#cfab44]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao painel</span>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
