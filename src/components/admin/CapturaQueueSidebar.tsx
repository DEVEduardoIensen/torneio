'use client';

import React from 'react';
import { RegistroCaptura } from '@/types/domain';

interface CapturaQueueSidebarProps {
  filtered: RegistroCaptura[];
  selectedReg: RegistroCaptura | null;
  onSelect: (id: string) => void;
}

export function CapturaQueueSidebar({
  filtered,
  selectedReg,
  onSelect,
}: CapturaQueueSidebarProps) {
  return (
    <section aria-label="Fila de capturas">
      <h2 className="text-base font-semibold text-[#f3f4f6]">Fila ({filtered.length})</h2>
      {filtered.length === 0 ? (
        <p className="mt-3 text-sm text-[#a1a8b9]">Nenhum registro neste filtro.</p>
      ) : (
        <ul className="mt-3 max-h-80 divide-y divide-white/10 overflow-y-auto border-y border-white/10 lg:max-h-[620px]">
          {filtered.map((reg) => {
            const active = selectedReg?.id === reg.id;
            return (
              <li key={reg.id}>
                <button
                  type="button"
                  onClick={() => onSelect(reg.id)}
                  aria-current={active}
                  className={`block min-h-12 w-full cursor-pointer border-l-2 py-3 pl-3 pr-1 text-left transition-colors ${
                    active
                      ? 'border-[#e5c158] bg-white/5'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-base font-semibold text-[#f3f4f6]">
                      {reg.pescador_nome}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-[#e5c158]">
                      {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)} cm
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-baseline justify-between gap-2 text-sm text-[#a1a8b9]">
                    <span>
                      {reg.categoria_nome} · {reg.isca_marca}
                    </span>
                    <span
                      className={
                        reg.status === 'aprovado'
                          ? 'text-emerald-400'
                          : reg.status === 'reprovado'
                          ? 'text-rose-400'
                          : 'text-[#a1a8b9]'
                      }
                    >
                      {reg.status === 'aprovado'
                        ? 'Homologado'
                        : reg.status === 'reprovado'
                        ? 'Reprovado'
                        : 'Em análise'}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
