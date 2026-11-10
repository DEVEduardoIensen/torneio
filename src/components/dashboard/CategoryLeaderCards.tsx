'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryRankingResult } from '@/types/domain';

interface CategoryLeaderCardsProps {
  categoryRankings: CategoryRankingResult[];
  formatFormula: (formula: string, topN: number, unidade: string) => string;
}

export function CategoryLeaderCards({ categoryRankings, formatFormula }: CategoryLeaderCardsProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
            Líderes por Categoria ({categoryRankings.length} modalidades ativas)
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
        {categoryRankings.map(({ categoria, entries }) => {
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
  );
}

