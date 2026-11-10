'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
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
        Verificando permissões de acesso da comissão...
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
  const canAccess = isAdmin;

  if (!canAccess) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-[#080c14] border border-[#e5c158]/30 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#e5c158]/15 border border-[#e5c158]/30 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-[#e5c158]" />
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold text-[#f3f4f6]">
            Área Restrita à Direção do Torneio
          </h1>
          <p className="text-sm text-[#a1a8b9] mt-2">
            Você está conectado como <strong className="text-[#f3f4f6]">{currentUser?.nome || 'Competidor'}</strong> ({currentUser?.role || 'pescador'}).
            Este módulo de homologação e gestão técnica é exclusivo para os administradores do torneio.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/painel"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-[#e5c158] hover:bg-[#cfab44] text-[#060a13] font-heading font-bold text-sm transition-colors cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Minha Área de Competidor</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

