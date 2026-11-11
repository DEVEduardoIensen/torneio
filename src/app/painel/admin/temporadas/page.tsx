'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { CategoriaConfigForm } from '@/components/admin/CategoriaConfigForm';
import { TemporadaGeralForm } from '@/components/admin/TemporadaGeralForm';
import { Categoria } from '@/types/domain';

export default function AdminTemporadasPage() {
  const { temporada, categorias, refresh } = usePainel();
  const [selectedCat, setSelectedCat] = useState<Categoria | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleDeleteCategoria = async (id: string) => {
    await fetch(`/api/temporada/categorias?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await refresh();
    setSelectedCat(null);
  };

  return (
    <div className="max-w-3xl space-y-10">
      <h1 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">Temporada e categorias</h1>

      {statusMsg && (
        <p role="status" className="text-sm font-medium text-emerald-300">
          {statusMsg}
        </p>
      )}

      {temporada && (
        <TemporadaGeralForm
          temporada={temporada}
          onSaved={() => {
            refresh();
            setStatusMsg('Temporada salva.');
          }}
        />
      )}

      <section aria-labelledby="categorias-title" className="border-t border-white/10 pt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 id="categorias-title" className="text-lg font-bold text-[#f3f4f6]">
            Categorias ({categorias.length})
          </h2>
          <button
            type="button"
            onClick={() => setSelectedCat(null)}
            className="inline-flex h-12 cursor-pointer items-center px-1 text-base font-semibold text-[#e5c158] hover:text-[#cfab44]"
          >
            Nova categoria
          </button>
        </div>

        <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
          {categorias.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between gap-2 py-1">
              <button
                type="button"
                onClick={() => setSelectedCat(cat)}
                aria-current={selectedCat?.id === cat.id}
                className="min-h-12 flex-1 cursor-pointer py-2 text-left"
              >
                <span
                  className={`block text-base font-semibold ${
                    selectedCat?.id === cat.id ? 'text-[#e5c158]' : 'text-[#f3f4f6]'
                  }`}
                >
                  {cat.nome}
                </span>
                <span className="mt-0.5 block text-sm text-[#a1a8b9] tabular-nums">
                  {cat.especie} · {cat.formula_ranking} ({cat.top_n_peixes}) · mín.{' '}
                  {cat.medida_minima} {cat.unidade_medida}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategoria(cat.id)}
                className="h-12 shrink-0 cursor-pointer px-3 text-sm font-semibold text-red-300 hover:text-red-200"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </section>

      {temporada && (
        <section className="border-t border-white/10 pt-8">
          <CategoriaConfigForm
            key={selectedCat ? selectedCat.id : 'nova'}
            temporadaId={temporada.id}
            categoryToEdit={selectedCat}
            onSaved={(msg) => {
              refresh();
              setStatusMsg(msg);
            }}
          />
        </section>
      )}
    </div>
  );
}