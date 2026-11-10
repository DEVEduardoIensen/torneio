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
    <div className="el-card overflow-hidden">
      <div className="px-4 py-3.5 border-b border-white/10 bg-[#060a13] text-xs font-heading font-semibold text-[#e5c158]">
        Fila de Capturas ({filtered.length})
      </div>
      <div className="divide-y divide-white/10 max-h-[620px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#a1a8b9]">
            Nenhum registro encontrado neste filtro.
          </div>
        ) : (
          filtered.map((reg) => {
            const active = selectedReg?.id === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => onSelect(reg.id)}
                className={`w-full p-4 text-left transition-colors cursor-pointer ${
                  active ? 'bg-[#0c111c] border-l-2 border-[#e5c158]' : 'hover:bg-[#0c111c]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-heading font-bold text-[#f3f4f6]">{reg.pescador_nome}</span>
                  <span className="font-heading font-bold text-[#e5c158] tabular-nums">
                    {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)} cm
                  </span>
                </div>
                <div className="text-xs text-[#a1a8b9] mt-1">{reg.categoria_nome}</div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-[#a1a8b9]">{reg.isca_marca}</span>
                  <span
                    className={`font-semibold capitalize ${
                      reg.status === 'aprovado'
                        ? 'text-emerald-300'
                        : reg.status === 'reprovado'
                        ? 'text-red-300'
                        : 'text-[#e5c158]'
                    }`}
                  >
                    {reg.status}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

