'use client';

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { RegistroCaptura } from '@/types/domain';

interface CapturasSemCorteTableProps {
  capturas: RegistroCaptura[];
}

export function CapturasSemCorteTable({ capturas }: CapturasSemCorteTableProps) {
  return (
    <section aria-labelledby="sem-corte-title">
      <h2 id="sem-corte-title" className="text-lg font-bold text-[#f3f4f6]">
        Captura Completa Sem Corte
      </h2>
      <p className="mt-1 text-sm text-[#a1a8b9]">
        Fisgada, medição e soltura no mesmo vídeo, sem edição.
      </p>

      {capturas.length === 0 ? (
        <p className="mt-10 text-center text-sm text-[#a1a8b9]">
          Nenhuma captura sem corte homologada.
        </p>
      ) : (
        <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {capturas.map((reg, index) => (
            <li key={reg.id} className="flex items-center gap-4 py-4">
              <span
                className={`w-9 shrink-0 text-center text-2xl font-bold tabular-nums ${
                  index === 0 ? 'text-[#e5c158]' : index < 3 ? 'text-[#f3f4f6]' : 'text-[#a1a8b9]'
                }`}
              >
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/painel/pescadores/${reg.pescador_id}`}
                  className="block truncate text-base font-semibold text-[#f3f4f6] hover:text-[#e5c158]"
                >
                  {reg.pescador_nome}
                </Link>
                <p className="mt-0.5 text-sm text-[#a1a8b9]">
                  {reg.especie_informada} · {reg.isca_marca} {reg.isca_modelo}
                </p>
              </div>

              <div className="shrink-0 text-right tabular-nums">
                <span className="text-xl font-bold text-[#e5c158]">
                  {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-[#a1a8b9]">cm</span>
                {reg.video_medicao_url && (
                  <a
                    href={reg.video_medicao_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center justify-end gap-1 text-sm font-semibold text-[#e5c158] hover:underline"
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden />
                    Vídeo
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
