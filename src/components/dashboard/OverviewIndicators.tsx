'use client';

import React from 'react';
import { Categoria, RegistroCaptura } from '@/types/domain';

interface OverviewIndicatorsProps {
  categorias: Categoria[];
  registros: RegistroCaptura[];
  maiorPeixeTemporada: number;
  totalCompletasSemCorte: number;
}

export function OverviewIndicators({
  categorias,
  registros,
  maiorPeixeTemporada,
  totalCompletasSemCorte,
}: OverviewIndicatorsProps) {
  const aprovados = registros.filter((r) => r.status === 'aprovado').length;
  const pendentes = registros.filter((r) => r.status === 'pendente').length;

  const stats = [
    { label: 'Categorias', value: String(categorias.filter((c) => c.ativa).length), gold: false },
    { label: 'Homologadas', value: String(aprovados), gold: false },
    {
      label: 'Maior peixe',
      value: maiorPeixeTemporada > 0 ? maiorPeixeTemporada.toFixed(1) : '—',
      gold: true,
    },
    { label: 'Sem corte', value: String(totalCompletasSemCorte), gold: false },
  ];

  return (
    <section aria-label="Resumo da temporada">
      <dl className="grid grid-cols-4 divide-x divide-white/10 border-y border-white/10 py-4">
        {stats.map((s) => (
          <div key={s.label} className="px-1 text-center first:pl-0 last:pr-0 sm:px-2">
            <dd
              className={`text-xl font-bold tabular-nums sm:text-3xl ${
                s.gold ? 'text-[#e5c158]' : 'text-[#f3f4f6]'
              }`}
            >
              {s.value}
            </dd>
            <dt className="mt-0.5 text-xs text-[#a1a8b9] sm:text-sm">{s.label}</dt>
          </div>
        ))}
      </dl>
      {pendentes > 0 && (
        <p className="mt-2 text-sm text-[#a1a8b9]">{pendentes} em análise pela arbitragem.</p>
      )}
    </section>
  );
}
