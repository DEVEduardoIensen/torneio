'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryRankingResult } from '@/types/domain';

interface CategoryLeaderCardsProps {
  categoryRankings: CategoryRankingResult[];
  formatFormula: (formula: string, topN: number, unidade: string) => string;
}

export function CategoryLeaderCards({ categoryRankings }: CategoryLeaderCardsProps) {
  return (
    <section aria-labelledby="lideres-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="lideres-title" className="text-lg font-bold text-[#f3f4f6]">
          Líderes
        </h2>
        <Link
          href="/painel/ranking"
          className="inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-[#e5c158] hover:text-[#cfab44]"
        >
          Classificação
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <ul className="divide-y divide-white/10 border-y border-white/10">
        {categoryRankings.map(({ categoria, entries }) => {
          const leader = entries[0];
          return (
            <li key={categoria.id}>
              <Link
                href={`/painel/ranking?categoria=${categoria.id}`}
                className="flex items-center justify-between gap-4 py-3.5 hover:bg-white/[0.03]"
              >
                <span className="min-w-0">
                  <span className="block text-sm text-[#a1a8b9]">{categoria.nome}</span>
                  <span className="block truncate text-base font-semibold text-[#f3f4f6]">
                    {leader ? leader.pescador_nome : 'Sem capturas'}
                  </span>
                </span>
                {leader && (
                  <span className="shrink-0 text-lg font-bold tabular-nums text-[#e5c158]">
                    {leader.pontuacao_total.toFixed(1)}{' '}
                    <span className="text-sm font-normal text-[#a1a8b9]">
                      {categoria.unidade_medida}
                    </span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
