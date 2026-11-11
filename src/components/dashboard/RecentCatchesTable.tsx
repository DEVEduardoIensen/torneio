'use client';

import React from 'react';
import Link from 'next/link';
import { RegistroCaptura } from '@/types/domain';

interface RecentCatchesTableProps {
  registros: RegistroCaptura[];
}

const STATUS = {
  aprovado: { label: 'Homologado', className: 'text-emerald-400' },
  pendente: { label: 'Em análise', className: 'text-[#a1a8b9]' },
  reprovado: { label: 'Reprovado', className: 'text-rose-400' },
} as const;

export function RecentCatchesTable({ registros }: RecentCatchesTableProps) {
  return (
    <section aria-labelledby="recentes-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="recentes-title" className="text-lg font-bold text-[#f3f4f6]">
          Últimas capturas
        </h2>
        <Link
          href="/painel/registros"
          className="inline-flex h-10 items-center text-sm font-semibold text-[#e5c158] hover:text-[#cfab44]"
        >
          Minhas capturas →
        </Link>
      </div>

      <ul className="divide-y divide-white/10 border-y border-white/10">
        {registros.slice(0, 8).map((reg) => {
          const st = STATUS[reg.status as keyof typeof STATUS] ?? STATUS.pendente;
          return (
            <li key={reg.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <Link
                  href={`/painel/pescadores/${reg.pescador_id}`}
                  className="block truncate text-base font-semibold text-[#f3f4f6] hover:text-[#e5c158]"
                >
                  {reg.pescador_nome}
                </Link>
                <p className="truncate text-sm text-[#a1a8b9]">
                  {reg.categoria_nome} · <span className={st.className}>{st.label}</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold tabular-nums text-[#e5c158]">
                  {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)}{' '}
                  <span className="text-sm font-normal text-[#a1a8b9]">
                    {reg.categoria_unidade || 'cm'}
                  </span>
                </p>
                {reg.captura_completa_sem_corte && (
                  <p className="text-xs text-[#a1a8b9]">sem corte</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
