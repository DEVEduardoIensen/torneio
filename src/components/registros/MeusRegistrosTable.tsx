'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { RegistroCaptura } from '@/types/domain';

interface MeusRegistrosTableProps {
  registros: RegistroCaptura[];
  currentUserName?: string;
}

const STATUS = {
  aprovado: { label: 'Homologado', className: 'text-emerald-400' },
  pendente: { label: 'Em análise', className: 'text-[#a1a8b9]' },
  reprovado: { label: 'Reprovado', className: 'text-rose-400' },
} as const;

export function MeusRegistrosTable({ registros, currentUserName }: MeusRegistrosTableProps) {
  return (
    <section aria-labelledby="minhas-title">
      <h2 id="minhas-title" className="text-lg font-bold text-[#f3f4f6]">
        Minhas capturas ({registros.length})
      </h2>

      {registros.length === 0 ? (
        <p className="mt-2 text-sm text-[#a1a8b9]">
          {currentUserName || 'Você'} ainda não enviou capturas.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
          {registros.map((reg) => {
            const st = STATUS[reg.status as keyof typeof STATUS] ?? STATUS.pendente;
            const nota = reg.motivo_reprovacao || reg.parecer_juiz;
            return (
              <li key={reg.id} className="py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 truncate font-semibold text-[#f3f4f6]">
                    {reg.categoria_nome}
                  </p>
                  <p className="shrink-0 text-lg font-bold tabular-nums text-[#e5c158]">
                    {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)} cm
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-[#a1a8b9]">
                  {reg.isca_marca} {reg.isca_modelo} · {reg.local_captura}
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-4 text-sm">
                  <span className={`font-semibold ${st.className}`}>{st.label}</span>
                  {reg.video_medicao_url && (
                    <a
                      href={reg.video_medicao_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 font-semibold text-[#e5c158] hover:underline"
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden />
                      Vídeo
                    </a>
                  )}
                </p>
                {nota && <p className="mt-1 text-sm text-[#a1a8b9]">{nota}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
