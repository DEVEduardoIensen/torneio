'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Fish } from 'lucide-react';
import { CategoryRankingResult } from '@/types/domain';

interface CategoryRankingTableProps {
  currentCatResult: CategoryRankingResult;
  describeFormula: (formula: string, topN: number, unidade: string) => string;
}

export function CategoryRankingTable({
  currentCatResult,
  describeFormula,
}: CategoryRankingTableProps) {
  return (
    <div className="space-y-6">
      {/* Ficha Paramétrica da Categoria Selecionada */}
      <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#e5c158] mb-1">
              <span>Espécie: {currentCatResult.categoria.especie}</span>
              <span>•</span>
              <span>Modalidade: {currentCatResult.categoria.modalidade}</span>
              <span>•</span>
              <span className="tabular-nums">
                Medida mínima: {currentCatResult.categoria.medida_minima}{' '}
                {currentCatResult.categoria.unidade_medida}
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold text-[#f3f4f6]">
              {currentCatResult.categoria.nome}
            </h2>
            <p className="text-sm text-[#a1a8b9] mt-1">
              {currentCatResult.categoria.descricao_especie}
            </p>
          </div>

          <div className="text-xs text-[#f3f4f6] space-y-1 shrink-0">
            <div>
              <span className="text-[#a1a8b9]">Fórmula de cálculo: </span>
              <strong className="text-[#e5c158]">
                {describeFormula(
                  currentCatResult.categoria.formula_ranking,
                  currentCatResult.categoria.top_n_peixes,
                  currentCatResult.categoria.unidade_medida
                )}
              </strong>
            </div>
            <div>
              <span className="text-[#a1a8b9]">Desempate oficial: </span>
              <strong className="text-[#f3f4f6]">
                {currentCatResult.categoria.criterio_desempate === 'maior_peixe'
                  ? 'Maior exemplar individual homologado'
                  : 'Captura homologada mais antiga'}
              </strong>
            </div>
          </div>
        </div>

        {currentCatResult.categoria.premiacao.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-6 text-xs">
            {currentCatResult.categoria.premiacao.map((premio, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#e5c158] shrink-0" />
                <span className="font-heading font-bold text-[#f3f4f6]">{premio.colocacao}:</span>
                <span className="text-[#a1a8b9]">{premio.valor_ou_descricao}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela Oficial de Classificação */}
      <div className="bg-[#080c14] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#080c14] text-xs font-medium text-[#a1a8b9]">
                <th scope="col" className="py-3 px-4 w-24">Colocação</th>
                <th scope="col" className="py-3 px-4">Competidor / Equipe</th>
                <th scope="col" className="py-3 px-4">
                  Exemplares Computados na Nota
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Maior Peixe (Desempate)
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Pontuação Final
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {currentCatResult.entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 px-4 text-center text-[#a1a8b9]">
                    Nenhum competidor possui capturas homologadas nesta categoria ainda.{' '}
                    <Link
                      href="/painel/registros"
                      className="text-[#e5c158] hover:text-[#cfab44] underline underline-offset-4 font-semibold"
                    >
                      Enviar primeira captura
                    </Link>
                  </td>
                </tr>
              ) : (
                currentCatResult.entries.map((entry) => (
                  <tr key={entry.pescador_id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 tabular-nums">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          entry.posicao === 1
                            ? 'bg-[#e5c158] text-[#060a13] font-bold'
                            : entry.posicao === 2
                            ? 'bg-zinc-800 text-zinc-200 border border-zinc-700/50'
                            : entry.posicao === 3
                            ? 'bg-zinc-800 text-[#e5c158] border border-[#e5c158]/30'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        {entry.posicao}º
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/painel/pescadores/${entry.pescador_id}`}
                        className="font-medium text-[#f3f4f6] hover:text-[#e5c158] block"
                      >
                        {entry.pescador_nome}
                      </Link>
                      <span className="text-xs text-[#a1a8b9]">
                        {entry.cidade_uf}{entry.equipe ? ` • ${entry.equipe}` : ''}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {entry.capturas_computadas.map((cap, idx) => (
                          <span
                            key={cap.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0d1626] border border-white/10 text-xs text-[#f3f4f6] tabular-nums"
                            title={`${cap.isca_marca} ${cap.isca_modelo} — ${cap.local_captura}`}
                          >
                            <Fish className="w-3.5 h-3.5 text-[#e5c158]" />
                            <strong className="font-semibold">
                              #{idx + 1}: {cap.medida.toFixed(1)}{' '}
                              {currentCatResult.categoria.unidade_medida}
                            </strong>
                            <span className="text-[#a1a8b9]">({cap.isca_marca})</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums font-semibold text-[#f3f4f6]">
                      {entry.maior_exemplar.toFixed(1)}{' '}
                      {currentCatResult.categoria.unidade_medida}
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums">
                      <span className="text-lg font-heading font-bold text-[#e5c158]">
                        {entry.pontuacao_total.toFixed(1)}{' '}
                        {currentCatResult.categoria.unidade_medida}
                      </span>
                      <span className="block text-xs text-[#a1a8b9]">
                        {entry.capturas_computadas.length} de{' '}
                        {currentCatResult.categoria.formula_ranking === 'maior_exemplar'
                          ? 1
                          : currentCatResult.categoria.top_n_peixes}{' '}
                        peixes
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

