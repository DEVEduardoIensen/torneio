'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Compass, Fish, KeyRound, Trophy } from 'lucide-react';
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
        Carregando dados da temporada no banco de dados...
      </div>
    );
  }

  const aprovados = registros.filter((r) => r.status === 'aprovado');
  const maiorPeixeTemporada =
    aprovados.length > 0
      ? Math.max(...aprovados.map((r) => r.medida_aprovada ?? r.medida_declarada))
      : 0;

  return (
    <div className="space-y-8">
      {/* Banner Principal da Temporada e Etapa em Andamento */}
      <section className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src="/brand/logo_header.webp"
              alt={temporada.nome}
              className="hidden sm:block h-16 w-auto object-contain self-start sm:self-center shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#e5c158] mb-1">
                <span>Temporada Ativa</span>
                <span>•</span>
                <span className="tabular-nums">
                  {inscricoes.filter((i) => i.status_pagamento !== 'cancelado').length} competidores inscritos
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#f3f4f6] tracking-tight">
                {temporada.nome}
              </h1>
              <p className="text-xs sm:text-sm text-[#a1a8b9] mt-1 max-w-xl">
                Troféu Eldorado & Mathias Iscas — Pesque & Solte Oficial
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3 shrink-0 w-full lg:w-auto">
            <Link
              href="/painel/registros"
              className="flex items-center justify-center gap-2 h-11 sm:h-12 px-4 rounded-xl bg-gradient-to-r from-[#e5c158] to-[#f3cb63] hover:from-[#d9b142] hover:to-[#e5c158] text-[#060a13] font-bold text-xs sm:text-sm shadow-lg shadow-[#e5c158]/10 active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              <Fish className="w-4 h-4 shrink-0" />
              <span>Registrar Peixe</span>
            </Link>
            <Link
              href="/painel/ranking"
              className="flex items-center justify-center gap-2 h-11 sm:h-12 px-4 rounded-xl bg-[#0c1322] hover:bg-[#121c30] border border-[#e5c158]/40 hover:border-[#e5c158] text-[#f3f4f6] font-semibold text-xs sm:text-sm shadow-md active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              <Trophy className="w-4 h-4 text-[#e5c158] shrink-0" />
              <span>Ver Ranking</span>
            </Link>
          </div>
        </div>

        {etapaAtiva && (
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-[#e5c158]/10 text-[#e5c158] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-[#a1a8b9] block font-medium">Etapa Vigente</span>
                <strong className="text-[#f3f4f6] font-semibold text-sm truncate block">
                  {etapaAtiva.titulo}
                </strong>
                <span className="text-[11px] text-[#a1a8b9] block truncate">
                  {etapaAtiva.local_pesca}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#e5c158]/10 border border-[#e5c158]/25">
              <div className="flex items-center gap-2.5 min-w-0">
                <KeyRound className="w-4 h-4 text-[#e5c158] shrink-0" />
                <div>
                  <span className="text-[11px] text-[#e5c158]/80 block font-medium">Palavra-Chave no Vídeo</span>
                  <strong className="font-mono text-base text-[#e5c158] tabular-nums font-bold tracking-wider">
                    {etapaAtiva.revelar_palavra_chave ? etapaAtiva.palavra_chave : 'AGUARDANDO ABERTURA'}
                  </strong>
                </div>
              </div>
              <span className="text-[10px] text-[#a1a8b9] hidden sm:block text-right">
                Pronunciar na régua
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Indicadores Operacionais */}
      <OverviewIndicators
        categorias={categorias}
        registros={registros}
        maiorPeixeTemporada={maiorPeixeTemporada}
        totalCompletasSemCorte={rankings.capturasCompletasSemCorte.length}
      />

      {/* Comunicados Oficiais Fixados */}
      {notificacoes.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-bold text-[#f3f4f6] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#e5c158]" />
              <span>Comunicados Oficiais e Avisos da Arbitragem</span>
            </h2>
            {currentUser?.role === 'admin' && (
              <Link
                href="/painel/admin/notificacao"
                className="text-xs font-semibold text-[#e5c158] hover:text-[#cfab44]"
              >
                Gerenciar comunicados
              </Link>
            )}
          </div>
          <div className="bg-[#080c14] border border-white/10 rounded-2xl divide-y divide-white/10 overflow-hidden">
            {notificacoes.slice(0, 3).map((not) => (
              <div key={not.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#e5c158] mb-1">
                    <span>{not.autor_nome}</span>
                    <span>•</span>
                    <span className="uppercase">{not.tipo.replace('_', ' ')}</span>
                  </div>
                  <h3 className="text-sm font-heading font-bold text-[#f3f4f6]">{not.titulo}</h3>
                  <p className="text-sm text-[#a1a8b9] mt-1">{not.mensagem}</p>
                </div>
                <Link
                  href="/painel/etapas"
                  className="text-xs font-semibold text-[#e5c158] hover:text-[#cfab44] shrink-0 self-start"
                >
                  Ver regras da etapa
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Líderes Atuais por Categoria Dinâmica */}
      <CategoryLeaderCards
        categoryRankings={rankings.categorias}
        formatFormula={formatFormula}
      />

      {/* Últimas Capturas Enviadas e Auditadas */}
      <RecentCatchesTable registros={registros} />
    </div>
  );
}
