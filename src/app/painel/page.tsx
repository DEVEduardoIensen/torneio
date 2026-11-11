'use client';

import React from 'react';
import Link from 'next/link';
import { Fish, Trophy } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';
import { CategoryLeaderCards } from '@/components/dashboard/CategoryLeaderCards';
import { OverviewIndicators } from '@/components/dashboard/OverviewIndicators';
import { RecentCatchesTable } from '@/components/dashboard/RecentCatchesTable';

function formatFormula(formula: string, topN: number, unidade: string) {
  switch (formula) {
    case 'soma_top_n':
      return `Soma dos ${topN} maiores (${unidade})`;
    case 'maior_exemplar':
      return `Maior exemplar único (${unidade})`;
    case 'soma_total':
      return `Soma total sem limite (${unidade})`;
    case 'media_top_n':
      return `Média dos ${topN} maiores (${unidade})`;
    default:
      return formula;
  }
}

export default function PainelOverviewPage() {
  const {
    temporada,
    etapaAtiva,
    categorias,
    registros,
    inscricoes,
    notificacoes,
    rankings,
    currentUser,
    loading,
  } = usePainel();

  if (loading || !temporada) {
    return (
      <div className="py-12 text-center text-sm text-[#a1a8b9]">
        Carregando...
      </div>
    );
  }

  const aprovados = registros.filter((r) => r.status === 'aprovado');
  const maiorPeixeTemporada =
    aprovados.length > 0
      ? Math.max(...aprovados.map((r) => r.medida_aprovada ?? r.medida_declarada))
      : 0;

  const inscritos = inscricoes.filter((i) => i.status_pagamento !== 'cancelado').length;

  return (
    <div className="max-w-3xl space-y-8">
      <section aria-labelledby="temporada-title">
        <p className="text-sm text-[#a1a8b9] tabular-nums">
          Temporada ativa · {inscritos} inscritos
        </p>
        <h1
          id="temporada-title"
          className="mt-1 text-2xl font-bold tracking-tight text-[#f3f4f6] sm:text-3xl"
        >
          {temporada.nome}
        </h1>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
          <Link
            href="/painel/registros"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#e5c158] text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44]"
          >
            <Fish className="h-5 w-5" aria-hidden />
            Enviar peixe
          </Link>
          <Link
            href="/painel/ranking"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e5c158] text-base font-semibold text-[#f3f4f6] transition-colors hover:bg-[#e5c158]/10"
          >
            <Trophy className="h-5 w-5 text-[#e5c158]" aria-hidden />
            Ranking
          </Link>
        </div>

        {etapaAtiva && (
          <div className="mt-5 flex items-center justify-between gap-4 border-y border-white/10 py-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#f3f4f6]">{etapaAtiva.titulo}</p>
              <p className="text-xs text-[#a1a8b9]">Palavra-chave no vídeo</p>
            </div>
            <strong className="shrink-0 font-mono text-xl font-bold tracking-wide text-[#e5c158]">
              {etapaAtiva.revelar_palavra_chave ? etapaAtiva.palavra_chave : 'Na largada'}
            </strong>
          </div>
        )}
      </section>

      <OverviewIndicators
        categorias={categorias}
        registros={registros}
        maiorPeixeTemporada={maiorPeixeTemporada}
        totalCompletasSemCorte={rankings.capturasCompletasSemCorte.length}
      />

      {notificacoes.length > 0 && (
        <section aria-labelledby="avisos-title">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="avisos-title" className="text-lg font-bold text-[#f3f4f6]">
              Avisos
            </h2>
            {currentUser?.role === 'admin' && (
              <Link
                href="/painel/admin/notificacao"
                className="inline-flex h-10 items-center text-sm font-semibold text-[#e5c158] hover:text-[#cfab44]"
              >
                Gerenciar
              </Link>
            )}
          </div>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {notificacoes.slice(0, 3).map((not) => (
              <li key={not.id} className="py-3.5">
                <h3 className="text-base font-semibold text-[#f3f4f6]">{not.titulo}</h3>
                <p className="mt-0.5 text-sm text-[#a1a8b9]">{not.mensagem}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CategoryLeaderCards categoryRankings={rankings.categorias} formatFormula={formatFormula} />

      <RecentCatchesTable registros={registros} />
    </div>
  );
}