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
    <section aria-label="Resumo numérico da temporada" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span>Categorias Dinâmicas</span>
          <Sliders className="w-4 h-4 text-[#e5c158]" />
        </div>
        <div className="text-2xl font-bold text-[#f3f4f6] mt-2 tabular-nums">
          {categorias.filter((c) => c.ativa).length}
        </div>
        <div className="text-xs text-[#a1a8b9] mt-1">
          Configuradas no motor da temporada
        </div>
      </div>

      <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span>Capturas Homologadas</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-[#f3f4f6] mt-2 tabular-nums">
          {aprovados.length}
        </div>
        <div className="text-xs text-[#a1a8b9] mt-1 tabular-nums">
          {pendentes.length} aguardando mesa de arbitragem
        </div>
      </div>

      <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span>Maior Exemplar Homologado</span>
          <Ruler className="w-4 h-4 text-[#e5c158]" />
        </div>
        <div className="text-2xl font-bold text-[#e5c158] mt-2 tabular-nums">
          {maiorPeixeTemporada > 0 ? `${maiorPeixeTemporada.toFixed(1)} cm` : '—'}
        </div>
        <div className="text-xs text-[#a1a8b9] mt-1">
          Validado na régua oficial sem cortes
        </div>
      </div>

      <div className="bg-[#080c14] border border-white/10 hover:border-[#e5c158]/30 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs font-medium text-[#a1a8b9]">
          <span>Capturas Completas (Sem Corte)</span>
          <Video className="w-4 h-4 text-[#e5c158]" />
        </div>
        <div className="text-2xl font-bold text-[#f3f4f6] mt-2 tabular-nums">
          {totalCompletasSemCorte}
        </div>
        <div className="text-xs text-[#a1a8b9] mt-1">
          Fisgada + medição + soltura no mesmo vídeo
        </div>
      </div>
    </section>
  );
}

