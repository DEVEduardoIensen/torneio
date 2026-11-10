'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  Fish,
  KeyRound,
  Ruler,
  Sliders,
  Trophy,
  Video,
} from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

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
  const pendentes = registros.filter((r) => r.status === 'pendente');
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
      <section aria-label="Resumo numérico da temporada" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-2xl p-5 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
            <span>Categorias Dinâmicas</span>
            <Sliders className="w-4 h-4 text-[#e5c158]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[#f3f4f6] mt-2 tabular-nums">
            {categorias.filter((c) => c.ativa).length}
          </div>
          <div className="text-xs text-[#a1a8b9] mt-1">
            Configuradas no motor da temporada
          </div>
        </div>

        <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-2xl p-5 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
            <span>Capturas Homologadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-bold text-[#f3f4f6] mt-2 tabular-nums">
            {aprovados.length}
          </div>
          <div className="text-xs text-[#a1a8b9] mt-1 tabular-nums">
            {pendentes.length} aguardando mesa de arbitragem
          </div>
        </div>

        <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-5 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
            <span>Maior Exemplar Homologado</span>
            <Ruler className="w-4 h-4 text-[#e5c158]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[#e5c158] mt-2 tabular-nums">
            {maiorPeixeTemporada > 0 ? `${maiorPeixeTemporada.toFixed(1)} cm` : '—'}
          </div>
          <div className="text-xs text-[#a1a8b9] mt-1">
            Validado na régua oficial sem cortes
          </div>
        </div>

        <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-2xl p-5 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
            <span>Capturas Completas (Sem Corte)</span>
            <Video className="w-4 h-4 text-[#e5c158]" />
          </div>
          <div className="text-2xl font-heading font-bold text-[#f3f4f6] mt-2 tabular-nums">
            {rankings.capturasCompletasSemCorte.length}
          </div>
          <div className="text-xs text-[#a1a8b9] mt-1">
            Fisgada + medição + soltura no mesmo vídeo
          </div>
        </div>
      </section>

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
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
              Líderes por Categoria ({categorias.filter((c) => c.ativa).length} modalidades ativas)
            </h2>
            <p className="text-xs text-[#a1a8b9]">
              Cada categoria abaixo possui sua própria fórmula de pontuação e critério de desempate configuráveis no banco.
            </p>
          </div>
          <Link
            href="/painel/ranking"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e5c158] hover:text-[#cfab44]"
          >
            <span>Abrir tabela completa de classificação</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankings.categorias.map(({ categoria, entries }) => {
            const leader = entries[0];
            return (
              <div
                key={categoria.id}
                className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/35 rounded-2xl p-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#a1a8b9] mb-2">
                    <span className="font-medium text-[#e5c158]">{categoria.especie}</span>
                    <span className="font-mono tabular-nums">
                      Mín. {categoria.medida_minima} {categoria.unidade_medida}
                    </span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-[#f3f4f6]">{categoria.nome}</h3>
                  <p className="text-xs text-[#a1a8b9] mt-1">
                    Regra: {formatFormula(categoria.formula_ranking, categoria.top_n_peixes, categoria.unidade_medida)}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    {leader ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#e5c158]">
                            1º Colocado Atual
                          </span>
                          <span className="text-base font-heading font-bold text-[#e5c158] tabular-nums">
                            {leader.pontuacao_total.toFixed(1)} {categoria.unidade_medida}
                          </span>
                        </div>
                        <Link
                          href={`/painel/pescadores/${leader.pescador_id}`}
                          className="text-sm font-heading font-bold text-[#f3f4f6] hover:text-[#e5c158] block mt-1"
                        >
                          {leader.pescador_nome} ({leader.numero_inscricao})
                        </Link>
                        <div className="text-xs text-[#a1a8b9] mt-0.5 tabular-nums">
                          {leader.cidade_uf} • Maior peixe: {leader.maior_exemplar.toFixed(1)}{' '}
                          {categoria.unidade_medida} ({leader.capturas_computadas.length} peixes na nota)
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-[#a1a8b9] py-2">
                        Nenhuma captura homologada nesta categoria até o momento.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#a1a8b9] tabular-nums">
                    {entries.length} {entries.length === 1 ? 'competidor pontuando' : 'competidores pontuando'}
                  </span>
                  <Link
                    href={`/painel/ranking?categoria=${categoria.id}`}
                    className="font-semibold text-[#e5c158] hover:text-[#cfab44]"
                  >
                    Ver ranking
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Últimas Capturas Enviadas e Auditadas */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
              Últimos Registros de Captura Recebidos
            </h2>
            <p className="text-xs text-[#a1a8b9]">
              Histórico em tempo real de submissões com status de validação da Mesa de Arbitragem.
            </p>
          </div>
          <Link
            href="/painel/registros"
            className="text-xs font-semibold text-[#e5c158] hover:text-[#cfab44]"
          >
            Enviar ou consultar minhas capturas
          </Link>
        </div>

        <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                  <th scope="col" className="py-3.5 px-4">Pescador</th>
                  <th scope="col" className="py-3.5 px-4">Categoria</th>
                  <th scope="col" className="py-3.5 px-4">Medida</th>
                  <th scope="col" className="py-3.5 px-4">Isca Utilizada</th>
                  <th scope="col" className="py-3.5 px-4">Local e Palavra-Chave</th>
                  <th scope="col" className="py-3.5 px-4">Status Arbitragem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {registros.slice(0, 8).map((reg) => {
                  const medidaExibida = reg.medida_aprovada ?? reg.medida_declarada;
                  return (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/painel/pescadores/${reg.pescador_id}`}
                          className="font-heading font-semibold text-[#f3f4f6] hover:text-[#e5c158] block"
                        >
                          {reg.pescador_nome}
                        </Link>
                        <span className="text-xs text-[#a1a8b9] tabular-nums">
                          {reg.numero_inscricao || 'S/N'} • {reg.pescador_cidade_uf}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#f3f4f6]">{reg.categoria_nome}</div>
                        <div className="text-xs text-[#a1a8b9]">{reg.especie_informada}</div>
                      </td>
                      <td className="py-3.5 px-4 tabular-nums">
                        <span className="font-heading font-bold text-[#e5c158]">
                          {medidaExibida.toFixed(1)} {reg.categoria_unidade || 'cm'}
                        </span>
                        {reg.captura_completa_sem_corte && (
                          <span className="block text-xs text-[#e5c158]/80 font-medium">
                            Vídeo completo s/ corte
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#f3f4f6] font-medium">{reg.isca_marca || '—'}</div>
                        <div className="text-xs text-[#a1a8b9]">{reg.isca_modelo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#f3f4f6] text-xs">{reg.local_captura}</div>
                        <div className="text-xs font-mono text-[#a1a8b9] tabular-nums mt-0.5">
                          Chave: {reg.palavra_chave_informada}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {reg.status === 'aprovado' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Homologado</span>
                          </span>
                        )}
                        {reg.status === 'pendente' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-[#e5c158] border border-amber-800/80">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Em Análise</span>
                          </span>
                        )}
                        {reg.status === 'reprovado' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/80">
                            <span>Reprovado</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
