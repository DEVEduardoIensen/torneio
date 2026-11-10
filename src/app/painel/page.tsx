'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Fish, KeyRound, Trophy } from 'lucide-react';
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
      <section className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src="/brand/logo_header.webp"
              alt={temporada.nome}
              className="h-20 w-auto object-contain self-start sm:self-center shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#e5c158] mb-1">
                <span>Temporada Oficial Ativa</span>
                <span>•</span>
                <span className="tabular-nums">
                  {inscricoes.filter((i) => i.status_pagamento !== 'cancelado').length} competidores inscritos
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#f3f4f6] tracking-tight">
                {temporada.nome}
              </h1>
              <p className="text-sm text-[#a1a8b9] mt-1 max-w-2xl">
                {temporada.subtitulo} — {temporada.descricao}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/painel/registros"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#e5c158] hover:bg-[#cfab44] text-[#060a13] font-heading font-bold text-sm transition-colors shadow-md cursor-pointer"
            >
              <Fish className="w-4 h-4 shrink-0" />
              <span>Registrar Nova Captura</span>
            </Link>
            <Link
              href="/painel/ranking"
              className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[#0d1626] hover:bg-[#121c2e] border border-[#e5c158]/30 hover:border-[#e5c158] text-[#f3f4f6] font-heading font-semibold text-sm transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#e5c158]" />
              <span>Ver Classificação</span>
            </Link>
          </div>
        </div>

        {etapaAtiva && (
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs text-[#a1a8b9] block">Etapa Vigente</span>
              <strong className="text-[#f3f4f6] font-heading font-semibold text-base">{etapaAtiva.titulo}</strong>
              <span className="text-xs text-[#a1a8b9] block mt-0.5">{etapaAtiva.local_pesca}</span>
            </div>
            <div>
              <span className="text-xs text-[#a1a8b9] block">
                Palavra-Chave Obrigatória no Vídeo
              </span>
              <div className="inline-flex items-center gap-2 mt-0.5">
                <KeyRound className="w-4 h-4 text-[#e5c158]" />
                <strong className="font-mono text-base text-[#e5c158] tabular-nums font-bold">
                  {etapaAtiva.revelar_palavra_chave ? etapaAtiva.palavra_chave : 'AGUARDANDO ABERTURA'}
                </strong>
              </div>
              <span className="text-xs text-[#a1a8b9] block mt-0.5">
                Pronunciar de forma audível com o peixe na régua
              </span>
            </div>
            <div>
              <span className="text-xs text-[#a1a8b9] block">Benefício Competidor Inscrito</span>
              <strong className="text-[#e5c158] font-semibold tabular-nums">
                {temporada.beneficio_desconto_parceiros_pct}% de desconto à vista ou Pix
              </strong>
              <span className="text-xs text-[#a1a8b9] block mt-0.5">
                Nas lojas e parceiros oficiais da temporada
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
