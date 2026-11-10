'use client';

import React from 'react';
import Link from 'next/link';
import { Award, MapPin, Phone, Sliders, Store } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function PainelPatrocinadoresPage() {
  const { temporada, patrocinadores, currentUser, loading } = usePainel();

  if (loading || !temporada) {
    return (
      <div className="py-12 text-center text-sm text-[#a1a8b9]">
        Carregando patrocinadores e parceiros...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
            Patrocinadores Oficiais e Prêmios de Isca
          </h1>
          <p className="text-sm text-[#a1a8b9] mt-1">
            Empresas que apoiam a pesca esportiva e oferecem {temporada.beneficio_desconto_parceiros_pct}% de desconto e premiações extras aos inscritos.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <Link
            href="/painel/admin/patrocinadores"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0d1626] hover:bg-[#121c2e] border border-[#e5c158]/30 hover:border-[#e5c158] text-xs font-semibold text-[#e5c158] transition-colors self-start"
          >
            <Sliders className="w-4 h-4" />
            <span>Gerenciar Patrocinadores</span>
          </Link>
        )}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {patrocinadores.map((pat) => (
          <div
            key={pat.id}
            className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-heading font-bold uppercase text-[#e5c158] tracking-wider">
                    Cota {pat.cota}
                  </span>
                  <h2 className="text-xl font-heading font-bold text-[#f3f4f6] mt-0.5">{pat.nome}</h2>
                  <p className="text-xs text-[#a1a8b9] mt-0.5">{pat.segmento}</p>
                </div>
                {pat.logo_url && (
                  <img
                    src={pat.logo_url}
                    alt={pat.nome}
                    className="h-12 w-auto object-contain shrink-0 rounded-lg p-1 bg-white/5 border border-white/10"
                  />
                )}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-[#e5c158] block">
                    Benefício Exclusivo para Inscritos:
                  </span>
                  <p className="text-[#f3f4f6] mt-0.5">{pat.beneficio_competidor}</p>
                </div>

                {pat.premio_especial_isca && (
                  <div>
                    <span className="text-xs font-semibold text-[#e5c158] flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Prêmio Especial / Bônus de Captura:</span>
                    </span>
                    <p className="text-[#a1a8b9] mt-0.5">{pat.premio_especial_isca}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-[#a1a8b9]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#e5c158]" />
                    <span>{pat.endereco_cidade}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#e5c158]" />
                    <span>WhatsApp: {pat.whatsapp_contato}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#a1a8b9]">Apresente seu Passaporte</span>
              <Link
                href="/painel/registros"
                className="font-heading font-bold text-[#e5c158] hover:text-[#cfab44]"
              >
                Registrar com esta marca →
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
