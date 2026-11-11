'use client';

import React from 'react';
import { CheckCircle2, Ruler, Sliders, Video } from 'lucide-react';
import { Categoria, RegistroCaptura } from '@/types/domain';

interface OverviewIndicatorsProps {
  categorias: Categoria[];
  registros: RegistroCaptura[];
  maiorPeixeTemporada: number;
  totalCompletasSemCorte: number;
}

export function OverviewIndicators({
  categorias,
  registros,
  maiorPeixeTemporada,
  totalCompletasSemCorte,
}: OverviewIndicatorsProps) {
  const aprovados = registros.filter((r) => r.status === 'aprovado');
  const pendentes = registros.filter((r) => r.status === 'pendente');

  return (
    <section aria-label="Resumo numérico da temporada" className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-xl p-3.5 sm:p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span className="truncate">Categorias</span>
          <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5c158] shrink-0" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-[#f3f4f6] mt-1.5 sm:mt-2 tabular-nums">
          {categorias.filter((c) => c.ativa).length}
        </div>
        <div className="text-[11px] text-[#a1a8b9] mt-0.5 sm:mt-1 truncate">
          Modalidades ativas
        </div>
      </div>

      <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-xl p-3.5 sm:p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span className="truncate">Homologadas</span>
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-[#f3f4f6] mt-1.5 sm:mt-2 tabular-nums">
          {aprovados.length}
        </div>
        <div className="text-[11px] text-[#a1a8b9] mt-0.5 sm:mt-1 tabular-nums truncate">
          {pendentes.length > 0 ? `${pendentes.length} em análise` : 'Todas auditadas'}
        </div>
      </div>

      <div className="bg-[#080c14] border border-[#e5c158]/30 rounded-xl p-3.5 sm:p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span className="truncate">Maior Peixe</span>
          <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5c158] shrink-0" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-[#e5c158] mt-1.5 sm:mt-2 tabular-nums">
          {maiorPeixeTemporada > 0 ? `${maiorPeixeTemporada.toFixed(1)} cm` : '—'}
        </div>
        <div className="text-[11px] text-[#a1a8b9] mt-0.5 sm:mt-1 truncate">
          Validado na régua
        </div>
      </div>

      <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-xl p-3.5 sm:p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span className="truncate">Sem Cortes</span>
          <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5c158] shrink-0" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-[#f3f4f6] mt-1.5 sm:mt-2 tabular-nums">
          {totalCompletasSemCorte}
        </div>
        <div className="text-[11px] text-[#a1a8b9] mt-0.5 sm:mt-1 truncate">
          Fisgada e soltura
        </div>
      </div>
    </section>
  );
}

