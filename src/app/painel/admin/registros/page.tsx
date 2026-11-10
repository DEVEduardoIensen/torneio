'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { CapturaQueueSidebar } from '@/components/admin/CapturaQueueSidebar';
import { RegistroAuditoriaConsole } from '@/components/admin/RegistroAuditoriaConsole';

export default function AdminRegistrosPage() {
  const { categorias, etapas, registros, currentUser, refresh } = usePainel();
  const [statusFilter, setStatusFilter] = useState<'pendente' | 'aprovado' | 'reprovado' | 'todos'>('pendente');
  const [selectedId, setSelectedId] = useState<string>('');

  const filtered = registros.filter((r) =>
    statusFilter === 'todos' ? true : r.status === statusFilter
  );

  const selectedReg =
    filtered.find((r) => r.id === selectedId) ||
    registros.find((r) => r.id === selectedId) ||
    filtered[0] ||
    null;

  const selectedCategoria = categorias.find((c) => c.id === selectedReg?.categoria_id);
  const selectedEtapa = etapas.find((e) => e.id === selectedReg?.etapa_id);

  const handleDelete = async (id: string) => {
    await fetch(`/api/registros?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
            Mesa de Arbitragem e Homologação de Capturas
          </h1>
          <p className="text-sm text-[#a1a8b9] mt-1">
            Inspeção de vídeo em câmera lenta, conferência da régua oficial e aplicação do checklist dinâmico da categoria.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['pendente', 'aprovado', 'reprovado', 'todos'] as const).map((st) => {
            const count =
              st === 'todos'
                ? registros.length
                : registros.filter((r) => r.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-semibold capitalize transition-colors cursor-pointer tabular-nums ${
                  statusFilter === st
                    ? 'bg-[#e5c158] text-[#060a13]'
                    : 'bg-[#080c14] text-[#f3f4f6] hover:border-[#e5c158]/50 border border-white/10'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Fila Lateral de Submissões */}
        <CapturaQueueSidebar
          filtered={filtered}
          selectedReg={selectedReg}
          onSelect={(id) => setSelectedId(id)}
        />

        {/* Console Principal de Auditoria */}
        <div className="lg:col-span-2 el-card-gold p-6">
          {!selectedReg ? (
            <div className="py-12 text-center text-sm text-[#a1a8b9]">
              Selecione uma captura na fila ao lado para iniciar a auditoria técnica.
            </div>
          ) : (
            <RegistroAuditoriaConsole
              key={selectedReg.id}
              selectedReg={selectedReg}
              selectedCategoria={selectedCategoria}
              selectedEtapa={selectedEtapa}
              currentUserId={currentUser?.id}
              currentUserName={currentUser?.nome}
              onRefresh={refresh}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
