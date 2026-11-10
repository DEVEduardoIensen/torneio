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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Controle Financeiro de Inscrições
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Homologue pagamentos via Pix e gerencie a liberação do Passaporte do Competidor.
        </p>
      </div>

      <div className="el-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#060a13] text-xs font-heading font-semibold text-[#a1a8b9]">
                <th scope="col" className="py-3.5 px-4">Inscrição</th>
                <th scope="col" className="py-3.5 px-4">Competidor</th>
                <th scope="col" className="py-3.5 px-4">Modalidade</th>
                <th scope="col" className="py-3.5 px-4">Status Atual</th>
                <th scope="col" className="py-3.5 px-4 text-right">Ações Financeiras</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {inscricoes.map((insc) => (
                <tr key={insc.id} className="hover:bg-[#0c111c]">
                  <td className="py-3.5 px-4 font-heading font-bold text-[#e5c158] tabular-nums">
                    {insc.numero_inscricao}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#f3f4f6]">{insc.pescador_nome}</div>
                    <div className="text-xs text-[#a1a8b9] tabular-nums">
                      WhatsApp: {insc.pescador_whatsapp} • {insc.pescador_cidade_uf}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-[#f3f4f6]">
                    {insc.modalidade_principal.replace('_', '/')}
                  </td>
                  <td className="py-3.5 px-4">
                    {insc.status_pagamento === 'pago' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Pago
                      </span>
                    )}
                    {insc.status_pagamento === 'isento' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#060a13] text-[#e5c158] border border-[#e5c158]/40">
                        Isento (Staff/Juiz)
                      </span>
                    )}
                    {insc.status_pagamento === 'pendente' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                        Aguardando Pix
                      </span>
                    )}
                    {insc.status_pagamento === 'cancelado' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800">
                        Cancelado
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      disabled={updatingId === insc.id}
                      onClick={() => handleUpdateStatus(insc, 'pago')}
                      className="el-btn-gold h-8 px-3.5 text-xs"
                    >
                      Confirmar Pago
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === insc.id}
                      onClick={() => handleUpdateStatus(insc, 'pendente')}
                      className="el-btn-outline h-8 px-3.5 text-xs"
                    >
                      Marcar Pendente
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
