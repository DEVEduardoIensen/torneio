'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Settings2 } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function PainelPatrocinadoresPage() {
  const { temporada, patrocinadores, currentUser, loading } = usePainel();

  if (loading || !temporada) {
    return <div className="py-12 text-center text-sm text-[#a1a8b9]">Carregando parceiros...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Parceiros</h1>
        {currentUser?.role === 'admin' && (
          <Link
            href="/painel/admin/patrocinadores"
            aria-label="Gerenciar patrocinadores"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#a1a8b9] hover:text-[#e5c158] transition-colors"
          >
            <Settings2 className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Único destaque da página: o desconto do inscrito */}
      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#e5c158]/40 bg-[#e5c158]/10 p-4 sm:p-5">
        <div>
          <p className="text-lg font-bold text-[#f3f4f6]">
            {temporada.beneficio_desconto_parceiros_pct}% de desconto à vista ou no Pix
          </p>
          <p className="mt-0.5 text-sm text-[#a1a8b9]">Para inscritos, em todos os parceiros.</p>
        </div>
        <Link
          href="/painel/inscricoes"
          className="inline-flex h-11 shrink-0 items-center rounded-xl bg-[#e5c158] px-4 text-sm font-bold text-[#060a13] transition-colors hover:bg-[#cfab44]"
        >
          Passaporte
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {patrocinadores.map((pat) => (
          <li key={pat.id} className="py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#f3f4f6]">{pat.nome}</h2>
                <p className="text-sm text-[#a1a8b9]">
                  {pat.segmento} · Cota {pat.cota}
                </p>
              </div>
              {pat.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pat.logo_url}
                  alt={pat.nome}
                  className="h-10 w-auto shrink-0 object-contain"
                />
              )}
            </div>

            <p className="mt-3 text-sm text-[#f3f4f6]">{pat.beneficio_competidor}</p>
            {pat.premio_especial_isca && (
              <p className="mt-1 text-sm text-[#a1a8b9]">
                <span className="font-semibold text-[#e5c158]">Prêmio:</span>{' '}
                {pat.premio_especial_isca}
              </p>
            )}

            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#a1a8b9]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden />
                {pat.endereco_cidade}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" aria-hidden />
                {pat.whatsapp_contato}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
