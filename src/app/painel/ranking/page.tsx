'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sliders, Video } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';
import { CapturasSemCorteTable } from '@/components/ranking/CapturasSemCorteTable';
import { CategoryRankingTable } from '@/components/ranking/CategoryRankingTable';

function describeFormula(formula: string, topN: number, unidade: string) {
  if (formula === 'soma_top_n') return `Soma das ${topN} maiores capturas homologadas (${unidade})`;
  if (formula === 'maior_exemplar') return `Maior exemplar único homologado (${unidade})`;
  if (formula === 'soma_total') return `Soma total de todas as capturas (${unidade})`;
  if (formula === 'media_top_n') return `Média das ${topN} maiores capturas (${unidade})`;
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
        Calculando classificação oficial no banco de dados...
      </div>
    );
  }

  const isSpecialTab = selectedCatId === 'premiacao-especial-sem-corte';
  const effectiveCatId = selectedCatId || activeCategories[0]?.id;
  const currentCatResult =
    filteredRankings.categorias.find((c) => c.categoria.id === effectiveCatId) ||
    filteredRankings.categorias[0];

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtro de Etapa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
            Classificação Oficial em Tempo Real
          </h1>
          <p className="text-sm text-[#a1a8b9] mt-1">
            Apuração matemática calculada dinamicamente conforme a fórmula configurada em cada categoria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="etapa-filter" className="text-xs font-semibold text-[#a1a8b9]">
            Filtrar por Etapa:
          </label>
          <select
            id="etapa-filter"
            value={selectedEtapaId}
            onChange={(e) => setSelectedEtapaId(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-[#080c14] border border-white/10 text-sm text-[#f3f4f6] focus:outline-none focus:border-[#e5c158] cursor-pointer"
          >
            <option value="todas">Temporada Completa (Acumulado)</option>
            {etapas.map((et) => (
              <option key={et.id} value={et.id}>
                {et.titulo}
              </option>
            ))}
          </select>

          {currentUser?.role === 'admin' && (
            <Link
              href="/painel/admin/temporadas"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#0d1626] hover:bg-[#121c2e] border border-[#e5c158]/30 hover:border-[#e5c158] text-xs font-semibold text-[#e5c158] transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configurar Fórmulas</span>
            </Link>
          )}
        </div>
      </div>

      {/* Seletor de Categorias Dinâmicas + Aba de Captura Completa Sem Corte */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {activeCategories.map((cat) => {
          const active = !isSpecialTab && currentCatResult?.categoria.id === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-heading font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-[#e5c158] text-[#060a13] font-bold shadow-sm'
                  : 'bg-[#080c14] text-[#a1a8b9] hover:bg-white/5 hover:text-[#f3f4f6] border border-white/10'
              }`}
            >
              {cat.nome}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setSelectedCatId('premiacao-especial-sem-corte')}
          className={`px-4 py-2.5 rounded-xl text-sm font-heading font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            isSpecialTab
              ? 'bg-[#e5c158] text-[#060a13] font-bold shadow-sm'
              : 'bg-[#080c14] text-[#e5c158] hover:bg-white/5 border border-[#e5c158]/30'
          }`}
        >
          <Video className="w-4 h-4 shrink-0" />
          <span>Prêmio Captura Completa (Sem Corte)</span>
        </button>
      </div>

      {/* Conteúdo da Aba Selecionada */}
      {isSpecialTab ? (
        <CapturasSemCorteTable capturas={filteredRankings.capturasCompletasSemCorte} />
      ) : currentCatResult ? (
        <CategoryRankingTable
          currentCatResult={currentCatResult}
          describeFormula={describeFormula}
        />
      ) : null}
    </div>
  );
}
