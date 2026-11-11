'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Categoria } from '@/types/domain';

interface CategoriaChecklistCardProps {
  categoria: Categoria;
}

export function CategoriaChecklistCard({ categoria }: CategoriaChecklistCardProps) {
  return (
    <details className="group max-w-xl">
      <summary className="flex h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#e5c158] [&::-webkit-details-marker]:hidden">
        Regras desta categoria
        <span className="text-[#a1a8b9] transition-transform group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="pb-2 text-sm text-[#a1a8b9]">
        <p className="tabular-nums">
          Mín. {categoria.medida_minima} {categoria.unidade_medida} · fora da água até{' '}
          {categoria.tempo_max_fora_agua_seg}s · vídeo até {categoria.tempo_max_video_seg}s
        </p>
        <ul className="mt-3 space-y-2">
          {categoria.checklist_validacao.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
