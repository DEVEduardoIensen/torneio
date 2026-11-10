'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Categoria } from '@/types/domain';

interface CategoriaChecklistCardProps {
  categoria: Categoria;
}

export function CategoriaChecklistCard({ categoria }: CategoriaChecklistCardProps) {
  return (
    <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 space-y-4 shadow-xl">
      <div>
        <span className="text-xs font-semibold text-[#e5c158]">
          Regras Auditadas na Categoria
        </span>
        <h2 className="text-lg font-heading font-bold text-[#f3f4f6] mt-0.5">
          {categoria.nome}
        </h2>
        <p className="text-xs text-[#a1a8b9] mt-1">
          {categoria.descricao_especie}
        </p>
      </div>

      <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-[#f3f4f6] tabular-nums">
        <div className="flex justify-between">
          <span className="text-[#a1a8b9]">Medida mínima exigida:</span>
          <strong className="text-[#e5c158]">
            {categoria.medida_minima} {categoria.unidade_medida}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a8b9]">Tempo máx. fora da água:</span>
          <strong>{categoria.tempo_max_fora_agua_seg} segundos</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a1a8b9]">Duração máx. do vídeo:</span>
          <strong>{categoria.tempo_max_video_seg} segundos</strong>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10">
        <h3 className="text-xs font-semibold text-[#f3f4f6] mb-2.5">
          Checklist que o Juiz verificará no seu envio:
        </h3>
        <ul className="space-y-2 text-xs text-[#a1a8b9]">
          {categoria.checklist_validacao.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
