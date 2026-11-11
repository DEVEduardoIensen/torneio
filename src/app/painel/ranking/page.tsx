'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings2 } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';
import { CapturasSemCorteTable } from '@/components/ranking/CapturasSemCorteTable';
import { CategoryRankingTable } from '@/components/ranking/CategoryRankingTable';

const SPECIAL_TAB = 'premiacao-especial-sem-corte';

function describeFormula(formula: string, topN: number) {
  if (formula === 'soma_top_n') return `Soma dos ${topN} maiores`;
  if (formula === 'maior_exemplar') return 'Maior exemplar';
  if (formula === 'soma_total') return 'Soma total';
  if (formula === 'media_top_n') return `Média dos ${topN} maiores`;
  return formula;
}

export default function PainelRankingPage() {
  const { temporada, categorias, etapas, rankings, loading, currentUser } = usePainel();
  const activeCategories = categorias.filter((c) => c.ativa);

  const [selectedCatId, setSelectedCatId] = useState<string>(activeCategories[0]?.id || '');
  const [selectedEtapaId, setSelectedEtapaId] = useState<string>('todas');
  const [etapaRankings, setEtapaRankings] = useState<typeof rankings | null>(null);

  const filteredRankings = selectedEtapaId === 'todas' ? rankings : (etapaRankings || rankings);

  useEffect(() => {
    if (selectedEtapaId === 'todas') {
      return;
    }
    let cancelled = false;
    fetch(`/api/ranking?etapaId=${encodeURIComponent(selectedEtapaId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setEtapaRankings(data);
      })
      .catch(() => {
        if (!cancelled) setEtapaRankings(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedEtapaId]);

  if (loading || !temporada) {
    return (
      <div className="py-12 text-center text-sm text-[#a1a8b9]">
        Calculando classificação...
      </div>
    );
  }

  const isSpecialTab = selectedCatId === SPECIAL_TAB;
  const effectiveCatId = selectedCatId || activeCategories[0]?.id;
  const currentCatResult =
    filteredRankings.categorias.find((c) => c.categoria.id === effectiveCatId) ||
    filteredRankings.categorias[0];

  const tabClass = (active: boolean) =>
    `shrink-0 h-12 px-3.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer ${
      active
        ? 'border-[#e5c158] text-[#e5c158]'
        : 'border-transparent text-[#a1a8b9] hover:text-[#f3f4f6]'
    }`;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Classificação</h1>
        {currentUser?.role === 'admin' && (
          <Link
            href="/painel/admin/temporadas"
            aria-label="Configurar fórmulas"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#a1a8b9] hover:text-[#e5c158] transition-colors"
          >
            <Settings2 className="w-5 h-5" />
          </Link>
        )}
      </div>

      <label htmlFor="etapa-filter" className="sr-only">
        Filtrar por etapa
      </label>
      <select
        id="etapa-filter"
        value={selectedEtapaId}
        onChange={(e) => setSelectedEtapaId(e.target.value)}
        className="mt-3 h-11 w-full sm:w-72 px-3 rounded-xl bg-transparent border border-white/15 text-sm text-[#f3f4f6] focus:outline-none focus:border-[#e5c158] cursor-pointer"
      >
        <option value="todas">Temporada completa</option>
        {etapas.map((et) => (
          <option key={et.id} value={et.id}>
            {et.titulo}
          </option>
        ))}
      </select>

      <div
        role="tablist"
        aria-label="Categorias"
        className="mt-4 -mx-4 px-4 sm:mx-0 sm:px-0 flex overflow-x-auto border-b border-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {activeCategories.map((cat) => {
          const active = !isSpecialTab && currentCatResult?.categoria.id === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCatId(cat.id)}
              className={tabClass(active)}
            >
              {cat.nome}
            </button>
          );
        })}
        <button
          type="button"
          role="tab"
          aria-selected={isSpecialTab}
          onClick={() => setSelectedCatId(SPECIAL_TAB)}
          className={tabClass(isSpecialTab)}
        >
          Sem Corte
        </button>
      </div>

      <div className="mt-6">
        {isSpecialTab ? (
          <CapturasSemCorteTable capturas={filteredRankings.capturasCompletasSemCorte} />
        ) : currentCatResult ? (
          <CategoryRankingTable
            currentCatResult={currentCatResult}
            describeFormula={describeFormula}
          />
        ) : null}
      </div>
    </div>
  );
}
