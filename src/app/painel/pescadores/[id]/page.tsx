'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function PescadorProfilePage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { pescadores, registros, rankings, loading } = usePainel();

  if (loading) {
    return <div className="py-12 text-center text-sm text-[#a1a8b9]">Carregando competidor...</div>;
  }

  const pescador = pescadores.find((p) => p.id === id);
  if (!pescador) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-xl font-bold text-[#f3f4f6]">Competidor não encontrado</h1>
        <Link
          href="/painel/ranking"
          className="mt-3 inline-flex h-10 items-center gap-2 text-sm font-semibold text-[#e5c158] hover:text-[#cfab44]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Voltar para a classificação
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

  const subtitulo = [
    pescador.role !== 'admin' ? pescador.cidade_uf : null,
    pescador.role !== 'admin' ? pescador.equipe || 'Individual' : 'Administrador',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="max-w-3xl">
      <Link
        href="/painel/ranking"
        className="inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-[#e5c158] hover:text-[#cfab44]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Classificação
      </Link>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#f3f4f6] sm:text-3xl">
        {pescador.nome}
      </h1>
      <p className="mt-1 text-sm text-[#a1a8b9]">{subtitulo}</p>

      <p className="mt-4 text-sm text-[#a1a8b9] tabular-nums">
        <span className="text-2xl font-bold text-[#e5c158]">{capturasHomologadas.length}</span>{' '}
        capturas homologadas
        {maiorPeixe > 0 && (
          <>
            {' · '}maior{' '}
            <span className="font-semibold text-[#f3f4f6]">{maiorPeixe.toFixed(1)} cm</span>
          </>
        )}
      </p>

      <section className="mt-8" aria-labelledby="desempenho-title">
        <h2 id="desempenho-title" className="text-lg font-bold text-[#f3f4f6]">
          Posição por categoria
        </h2>
        {posicoesCategorias.length === 0 ? (
          <p className="mt-2 text-sm text-[#a1a8b9]">Ainda não pontuou em nenhuma categoria.</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
            {posicoesCategorias.map(({ categoria, entry }) => (
              <li key={categoria.id} className="flex items-center gap-4 py-3.5">
                <span
                  className={`w-9 shrink-0 text-center text-2xl font-bold tabular-nums ${
                    entry.posicao === 1 ? 'text-[#e5c158]' : 'text-[#f3f4f6]'
                  }`}
                >
                  {entry.posicao}º
                </span>
                <span className="min-w-0 flex-1 truncate font-semibold text-[#f3f4f6]">
                  {categoria.nome}
                </span>
                <span className="shrink-0 font-bold tabular-nums text-[#f3f4f6]">
                  {entry.pontuacao_total.toFixed(1)}{' '}
                  <span className="text-sm font-normal text-[#a1a8b9]">
                    {categoria.unidade_medida}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8" aria-labelledby="historico-title">
        <h2 id="historico-title" className="text-lg font-bold text-[#f3f4f6]">
          Capturas homologadas
        </h2>
        {capturasHomologadas.length === 0 ? (
          <p className="mt-2 text-sm text-[#a1a8b9]">Nenhuma captura homologada até agora.</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
            {capturasHomologadas.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#f3f4f6]">{c.categoria_nome}</p>
                  <p className="truncate text-sm text-[#a1a8b9]">
                    {c.isca_marca} {c.isca_modelo} · {c.local_captura}
                  </p>
                </div>
                <span className="shrink-0 text-lg font-bold tabular-nums text-[#e5c158]">
                  {(c.medida_aprovada ?? c.medida_declarada).toFixed(1)} cm
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
