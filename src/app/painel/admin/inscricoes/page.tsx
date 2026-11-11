'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Inscricao } from '@/types/domain';

export default function AdminInscricoesPage() {
  const { temporada, inscricoes, refresh } = usePainel();
  const [updatingId, setUpdatingId] = useState<string>('');

  const handleUpdateStatus = async (
    insc: Inscricao,
    novoStatus: Inscricao['status_pagamento']
  ) => {
    if (!temporada) return;
    setUpdatingId(insc.id);
    try {
      await fetch('/api/inscricao', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: insc.id,
          temporada_id: temporada.id,
          pescador_id: insc.pescador_id,
          status_pagamento: novoStatus,
        }),
      });
      await refresh();
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">Inscrições</h1>

      <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {inscricoes.map((insc) => (
          <li key={insc.id} className="py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-base font-semibold text-[#f3f4f6]">{insc.pescador_nome}</span>
              <span className="text-sm font-semibold tabular-nums text-[#e5c158]">
                {insc.numero_inscricao}
              </span>
            </div>
            <p className="mt-0.5 text-sm tabular-nums text-[#a1a8b9]">
              {insc.pescador_whatsapp} · {insc.pescador_cidade_uf} ·{' '}
              <span className="capitalize">{insc.modalidade_principal.replace('_', '/')}</span>
            </p>
            <p
              className={`mt-1 text-sm font-medium ${
                insc.status_pagamento === 'pago'
                  ? 'text-emerald-400'
                  : insc.status_pagamento === 'cancelado'
                  ? 'text-rose-400'
                  : 'text-[#a1a8b9]'
              }`}
            >
              {insc.status_pagamento === 'pago' && 'Pago'}
              {insc.status_pagamento === 'isento' && 'Isento (Staff/Juiz)'}
              {insc.status_pagamento === 'pendente' && 'Aguardando Pix'}
              {insc.status_pagamento === 'cancelado' && 'Cancelado'}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={updatingId === insc.id}
                onClick={() => handleUpdateStatus(insc, 'pago')}
                className="h-12 w-full cursor-pointer rounded-xl bg-[#e5c158] px-5 text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60 sm:w-auto"
              >
                Confirmar pago
              </button>
              <button
                type="button"
                disabled={updatingId === insc.id}
                onClick={() => handleUpdateStatus(insc, 'pendente')}
                className="h-12 w-full cursor-pointer rounded-xl px-5 text-base font-semibold text-[#a1a8b9] transition-colors hover:text-[#f3f4f6] disabled:opacity-60 sm:w-auto"
              >
                Marcar pendente
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
