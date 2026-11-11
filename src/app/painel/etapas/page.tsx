'use client';

import React from 'react';
import Link from 'next/link';
import { Settings2 } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

const REGRAS = [
  {
    titulo: 'No vídeo',
    texto:
      'Diga em voz alta a palavra-chave da etapa. A boca do peixe encostada no zero da régua, corpo esticado e a ponta da cauda visível na graduação.',
  },
  {
    titulo: 'Soltura',
    texto:
      'O peixe volta à água com vitalidade e nada ativamente. Peixe que boiar sem reação é desclassificado.',
  },
  {
    titulo: 'Isca e foto',
    texto:
      'Só isca artificial. Envie uma foto nítida da isca ao lado do peixe para validar e concorrer aos prêmios das marcas.',
  },
];

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

export default function PainelEtapasPage() {
  const { temporada, etapas, currentUser, loading } = usePainel();

  if (loading || !temporada) {
    return <div className="py-12 text-center text-sm text-[#a1a8b9]">Carregando etapas...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Etapas</h1>
        {currentUser?.role === 'admin' && (
          <Link
            href="/painel/admin/etapas"
            aria-label="Editar etapas"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#a1a8b9] hover:text-[#e5c158] transition-colors"
          >
            <Settings2 className="w-5 h-5" />
          </Link>
        )}
      </div>

      <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
        {etapas.map((etapa) => (
          <li key={etapa.id} className="py-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-bold text-[#f3f4f6]">{etapa.titulo}</h2>
              <span className="shrink-0 text-sm font-semibold capitalize text-[#e5c158]">
                {statusLabel(etapa.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#a1a8b9] tabular-nums">
              {etapa.data_inicio} a {etapa.data_fim} · {etapa.local_pesca} ({etapa.cidade_uf})
            </p>

            <p className="mt-3 text-sm text-[#a1a8b9]">
              Palavra-chave{' '}
              {etapa.revelar_palavra_chave ? (
                <strong className="ml-1 text-base font-bold tracking-wide text-[#e5c158]">
                  {etapa.palavra_chave}
                </strong>
              ) : (
                <span className="ml-1 text-[#f3f4f6]">liberada na largada</span>
              )}
            </p>

            <Link
              href="/painel/registros"
              className="mt-3 inline-flex h-10 items-center text-sm font-semibold text-[#e5c158] hover:text-[#cfab44]"
            >
              Registrar peixe →
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-10" aria-labelledby="regras-title">
        <h2 id="regras-title" className="text-lg font-bold text-[#f3f4f6]">
          Regras
        </h2>
        <dl className="mt-3 space-y-4">
          {REGRAS.map((r) => (
            <div key={r.titulo}>
              <dt className="text-sm font-semibold text-[#f3f4f6]">{r.titulo}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-[#a1a8b9]">{r.texto}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
