'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { CategoryRankingResult } from '@/types/domain';

interface CategoryRankingTableProps {
  currentCatResult: CategoryRankingResult;
  describeFormula: (formula: string, topN: number, unidade: string) => string;
}

export function CategoryRankingTable({
  currentCatResult,
  describeFormula,
}: CategoryRankingTableProps) {
  const { categoria, entries } = currentCatResult;
  const unit = categoria.unidade_medida;
  const tiebreak =
    categoria.criterio_desempate === 'maior_peixe' ? 'maior peixe' : 'captura mais antiga';

  return (
    <section aria-labelledby="cat-title">
      <h2 id="cat-title" className="text-lg font-bold text-[#f3f4f6]">
        {categoria.nome}
      </h2>
      <p className="mt-1 text-sm text-[#a1a8b9]">
        Mín. {categoria.medida_minima} {unit} ·{' '}
        {describeFormula(categoria.formula_ranking, categoria.top_n_peixes, unit)}
      </p>

      <details className="group mt-3 text-sm">
        <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-1.5 font-semibold text-[#e5c158] [&::-webkit-details-marker]:hidden">
          Premiação e desempate
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <ul className="space-y-1.5 pb-1 text-[#a1a8b9]">
          {categoria.premiacao.map((premio, idx) => (
            <li key={idx}>
              <span className="font-semibold text-[#f3f4f6]">{premio.colocacao}</span>{' '}
              {premio.valor_ou_descricao}
            </li>
          ))}
          <li>
            <span className="font-semibold text-[#f3f4f6]">Desempate</span> {tiebreak}
          </li>
        </ul>
      </details>

      {entries.length === 0 ? (
        <p className="mt-10 text-center text-sm text-[#a1a8b9]">
          Nenhuma captura homologada nesta categoria.{' '}
          <Link
            href="/painel/registros"
            className="text-[#e5c158] font-semibold underline underline-offset-4"
          >
            Enviar captura
          </Link>
        </p>
      ) : (
        <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {entries.map((entry) => {
            const first = entry.posicao === 1;
            return (
              <li key={entry.pescador_id} className="flex items-center gap-4 py-4">
                <span
                  className={`w-9 shrink-0 text-center text-2xl font-bold tabular-nums ${
                    first ? 'text-[#e5c158]' : entry.posicao <= 3 ? 'text-[#f3f4f6]' : 'text-[#a1a8b9]'
                  }`}
                >
                  {entry.posicao}
                </span>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/painel/pescadores/${entry.pescador_id}`}
                    className="block truncate text-base font-semibold text-[#f3f4f6] hover:text-[#e5c158]"
                  >
                    {entry.pescador_nome}
                  </Link>
                  <p className="mt-0.5 truncate text-sm text-[#a1a8b9]">{entry.cidade_uf}</p>
                </div>

                <div className="shrink-0 text-right tabular-nums">
                  <p>
                    <span
                      className={`text-xl font-bold ${first ? 'text-[#e5c158]' : 'text-[#f3f4f6]'}`}
                    >
                      {entry.pontuacao_total.toFixed(1)}
                    </span>
                    <span className="ml-1 text-sm text-[#a1a8b9]">{unit}</span>
                  </p>
                  {entry.capturas_computadas.length > 1 && (
                    <p className="mt-0.5 text-xs text-[#a1a8b9]">
                      {entry.capturas_computadas.map((c) => c.medida.toFixed(1)).join(' + ')}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
