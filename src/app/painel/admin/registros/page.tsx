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

  const labelMap = {
    pendente: 'Em análise',
    aprovado: 'Homologados',
    reprovado: 'Reprovados',
    todos: 'Todos',
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">Arbitragem</h1>

      <div
        role="tablist"
        aria-label="Filtrar por status"
        className="-mx-4 mt-4 flex overflow-x-auto border-b border-white/10 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {(['pendente', 'aprovado', 'reprovado', 'todos'] as const).map((st) => {
          const count =
            st === 'todos' ? registros.length : registros.filter((r) => r.status === st).length;
          const active = statusFilter === st;
          return (
            <button
              key={st}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStatusFilter(st)}
              className={`-mb-px h-12 shrink-0 cursor-pointer whitespace-nowrap border-b-2 px-3.5 text-sm font-semibold tabular-nums transition-colors ${
                active
                  ? 'border-[#e5c158] text-[#e5c158]'
                  : 'border-transparent text-[#a1a8b9] hover:text-[#f3f4f6]'
              }`}
            >
              {labelMap[st]} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[18rem_1fr]">
        {/* Fila Lateral de Submissões */}
        <CapturaQueueSidebar
          filtered={filtered}
          selectedReg={selectedReg}
          onSelect={(id) => setSelectedId(id)}
        />

        {/* Console Principal de Auditoria */}
        <div className="min-w-0">
          {!selectedReg ? (
            <p className="py-12 text-center text-sm text-[#a1a8b9]">
              Selecione uma captura na fila para auditar.
            </p>
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
