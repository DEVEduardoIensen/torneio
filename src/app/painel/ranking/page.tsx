'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, Fish, Ruler, Sliders, Trophy, Video } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

function describeFormula(formula: string, topN: number, unidade: string) {
  if (formula === 'soma_top_n') return `Soma das ${topN} maiores capturas homologadas (${unidade})`;
  if (formula === 'maior_exemplar') return `Maior exemplar único homologado (${unidade})`;
  if (formula === 'soma_total') return `Soma total de todas as capturas (${unidade})`;
  if (formula === 'media_top_n') return `Média das ${topN} maiores capturas (${unidade})`;
  return formula;
}

export default function PainelRankingPage() {
  const { temporada, categorias, etapas, rankings, loading, currentUser } = usePainel();
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [selectedEtapaId, setSelectedEtapaId] = useState<string>('todas');
  const [filteredRankings, setFilteredRankings] = useState(rankings);

  const activeCategories = categorias.filter((c) => c.ativa);

  useEffect(() => {
    if (!selectedCatId && activeCategories.length > 0) {
      setSelectedCatId(activeCategories[0].id);
    }
  }, [activeCategories, selectedCatId]);

  useEffect(() => {
    if (selectedEtapaId === 'todas') {
      setFilteredRankings(rankings);
      return;
    }
    fetch(`/api/ranking?etapaId=${encodeURIComponent(selectedEtapaId)}`)
      .then((r) => r.json())
      .then((data) => setFilteredRankings(data))
      .catch(() => setFilteredRankings(rankings));
  }, [selectedEtapaId, rankings]);

  if (loading || !temporada) {
    return (
      <div className="py-12 text-center text-sm text-[#a1a8b9]">
        Calculando classificação oficial no banco de dados...
      </div>
    );
  }

  const isSpecialTab = selectedCatId === 'premiacao-especial-sem-corte';
  const currentCatResult =
    filteredRankings.categorias.find((c) => c.categoria.id === selectedCatId) ||
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
        <div className="space-y-6">
          <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-5 sm:p-6 shadow-xl">
            <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
              Prêmio Especial — Captura Completa sem Corte (Fisgada + Medição + Soltura)
            </h2>
            <p className="text-sm text-[#a1a8b9] mt-1.5">
              Concorrem a esta premiação especial todos os vídeos contínuos homologados que registram a fisgada do peixe, a medição na régua oficial e a soltura em uma única tomada sem edições, destacando a marca e o modelo da isca artificial utilizada.
            </p>
          </div>

          <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                    <th scope="col" className="py-3.5 px-4">Posição</th>
                    <th scope="col" className="py-3.5 px-4">Competidor</th>
                    <th scope="col" className="py-3.5 px-4">Espécie e Categoria</th>
                    <th scope="col" className="py-3.5 px-4">Isca Artificial</th>
                    <th scope="col" className="py-3.5 px-4">Local da Captura</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Medida Homologada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredRankings.capturasCompletasSemCorte.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 px-4 text-center text-[#a1a8b9]">
                        Nenhuma captura completa sem corte homologada para este filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredRankings.capturasCompletasSemCorte.map((reg, index) => (
                      <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-heading font-bold tabular-nums text-[#e5c158]">
                          {index + 1}º
                        </td>
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/painel/pescadores/${reg.pescador_id}`}
                            className="font-heading font-semibold text-[#f3f4f6] hover:text-[#e5c158] block"
                          >
                            {reg.pescador_nome}
                          </Link>
                          <span className="text-xs text-[#a1a8b9] tabular-nums">
                            {reg.numero_inscricao} • {reg.pescador_cidade_uf}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#f3f4f6]">{reg.especie_informada}</div>
                          <div className="text-xs text-[#a1a8b9]">{reg.categoria_nome}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#e5c158]">{reg.isca_marca}</span>
                          <span className="block text-xs text-[#a1a8b9]">{reg.isca_modelo}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#f3f4f6]">
                          {reg.local_captura}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-heading font-bold text-[#e5c158] tabular-nums text-base">
                            {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)} cm
                          </div>
                          {reg.video_medicao_url && (
                            <a
                              href={reg.video_medicao_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#e5c158] hover:underline"
                            >
                              <Video className="w-3 h-3" />
                              <span>Assistir Vídeo</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : currentCatResult ? (
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
          <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                    <th scope="col" className="py-3.5 px-4 w-24">Colocação</th>
                    <th scope="col" className="py-3.5 px-4">Competidor / Equipe</th>
                    <th scope="col" className="py-3.5 px-4">
                      Exemplares Computados na Nota
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-right">
                      Maior Peixe (Desempate)
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-right">
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
                        <td className="py-4 px-4 tabular-nums">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-heading font-bold ${
                              entry.posicao === 1
                                ? 'bg-[#e5c158] text-[#060a13] shadow-sm'
                                : entry.posicao === 2
                                ? 'bg-[#0d1626] border border-white/20 text-[#f3f4f6]'
                                : entry.posicao === 3
                                ? 'bg-[#0d1626] border border-[#e5c158]/35 text-[#e5c158]'
                                : 'bg-[#060a13] border border-white/10 text-[#a1a8b9]'
                            }`}
                          >
                            {entry.posicao}º Lugar
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/painel/pescadores/${entry.pescador_id}`}
                            className="font-heading font-bold text-[#f3f4f6] hover:text-[#e5c158] block"
                          >
                            {entry.pescador_nome}
                          </Link>
                          <span className="text-xs text-[#a1a8b9] tabular-nums">
                            {entry.numero_inscricao} • {entry.cidade_uf} • {entry.equipe}
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
      ) : null}
    </div>
  );
}
