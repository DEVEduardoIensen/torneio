'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MapPin, Users } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function PescadorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { pescadores, registros, rankings, loading } = usePainel();

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-[#a1a8b9]">
        Carregando ficha do competidor...
      </div>
    );
  }

  const pescador = pescadores.find((p) => p.id === id);
  if (!pescador) {
    return (
      <div className="bg-[#080c14] border border-white/10 rounded-2xl p-8 text-center space-y-4">
        <h1 className="text-xl font-heading font-bold text-[#f3f4f6]">Competidor não encontrado</h1>
        <Link
          href="/painel/ranking"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#e5c158] hover:text-[#cfab44]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Classificação Oficial</span>
        </Link>
      </div>
    );
  }

  const capturasHomologadas = registros.filter(
    (r) => r.pescador_id === pescador.id && r.status === 'aprovado'
  );
  const maiorPeixe =
    capturasHomologadas.length > 0
      ? Math.max(...capturasHomologadas.map((r) => r.medida_aprovada ?? r.medida_declarada))
      : 0;

  const posicoesCategorias = rankings.categorias
    .map((catRes) => {
      const found = catRes.entries.find((e) => e.pescador_id === pescador.id);
      return found ? { categoria: catRes.categoria, entry: found } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/painel/ranking"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e5c158] hover:text-[#cfab44] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Classificação</span>
        </Link>
        <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#e5c158] text-[#060a13] font-heading font-bold text-2xl flex items-center justify-center shrink-0 shadow-lg">
              {pescador.nome.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#e5c158] mb-1">
                <span>Inscrição Oficial</span>
                <span>•</span>
                <span className="font-mono tabular-nums">{pescador.numero_inscricao || '#001'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#f3f4f6]">
                {pescador.nome}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#a1a8b9] mt-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>{pescador.cidade_uf}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>Equipe: {pescador.equipe || 'Individual'}</span>
                </span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                  {pescador.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
            <span className="text-xs text-[#a1a8b9]">Capturas Homologadas</span>
            <span className="text-3xl font-heading font-bold text-[#e5c158] tabular-nums">
              {capturasHomologadas.length}
            </span>
            <span className="text-xs text-[#a1a8b9] mt-1 tabular-nums">
              Maior exemplar: {maiorPeixe > 0 ? `${maiorPeixe.toFixed(1)} cm` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Posições Atuais por Categoria */}
      <section className="space-y-4">
        <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
          Desempenho por Categoria
        </h2>
        {posicoesCategorias.length === 0 ? (
          <div className="bg-[#080c14] border border-white/10 rounded-2xl p-6 text-sm text-[#a1a8b9]">
            Este competidor ainda não pontuou em nenhuma categoria oficial.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posicoesCategorias.map(({ categoria, entry }) => (
              <div
                key={categoria.id}
                className="bg-[#080c14] border border-white/10 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#e5c158]">{categoria.especie}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-heading font-bold tabular-nums ${
                      entry.posicao === 1
                        ? 'bg-[#e5c158] text-[#060a13]'
                        : 'bg-[#0d1626] text-[#f3f4f6] border border-white/10'
                    }`}
                  >
                    {entry.posicao}º Lugar
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-[#f3f4f6]">{categoria.nome}</h3>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-xs text-[#a1a8b9]">Pontuação Oficial:</span>
                  <strong className="text-lg font-heading font-bold text-[#e5c158] tabular-nums">
                    {entry.pontuacao_total.toFixed(1)} {categoria.unidade_medida}
                  </strong>
                </div>
                <div className="text-xs text-[#a1a8b9] tabular-nums">
                  {entry.capturas_computadas.length} capturas somadas • Maior peixe:{' '}
                  {entry.maior_exemplar.toFixed(1)} {categoria.unidade_medida}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Histórico Completo de Peixes Homologados */}
      <section className="space-y-4">
        <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
          Histórico de Capturas Homologadas ({capturasHomologadas.length})
        </h2>
        <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                  <th scope="col" className="py-3.5 px-4">Espécie / Categoria</th>
                  <th scope="col" className="py-3.5 px-4">Medida Homologada</th>
                  <th scope="col" className="py-3.5 px-4">Isca Artificial</th>
                  <th scope="col" className="py-3.5 px-4">Local</th>
                  <th scope="col" className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {capturasHomologadas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-[#a1a8b9]">
                      Nenhuma captura homologada pela comissão para este competidor até o momento.
                    </td>
                  </tr>
                ) : (
                  capturasHomologadas.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-semibold text-[#f3f4f6]">{c.categoria_nome}</div>
                        <div className="text-xs text-[#a1a8b9]">{c.especie_informada}</div>
                      </td>
                      <td className="py-3.5 px-4 font-heading font-bold text-[#e5c158] tabular-nums text-base">
                        {(c.medida_aprovada ?? c.medida_declarada).toFixed(1)} cm
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#f3f4f6] font-medium">{c.isca_marca}</div>
                        <div className="text-xs text-[#a1a8b9]">{c.isca_modelo}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#a1a8b9]">{c.local_captura}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Homologado</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
