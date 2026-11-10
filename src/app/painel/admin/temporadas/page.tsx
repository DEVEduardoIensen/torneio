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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Motor de Configuração da Temporada e Categorias Dinâmicas
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Crie ou altere espécies, modalidades, fórmulas matemáticas de ranking, medidas mínimas e itens do checklist de arbitragem sem precisar alterar uma única linha de código.
        </p>
      </div>

      {statusMsg && (
        <div
          role="status"
          className="rounded-xl bg-emerald-950/90 border border-emerald-800 px-4 py-3 text-sm font-medium text-emerald-200"
        >
          {statusMsg}
        </div>
      )}

      {/* Configuração Geral da Temporada */}
      {temporada && (
        <TemporadaGeralForm
          temporada={temporada}
          onSaved={() => {
            refresh();
            setStatusMsg('Parâmetros da temporada salvos com sucesso!');
          }}
        />
      )}

      {/* Construtor de Categorias Dinâmicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="el-card overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#060a13]">
            <span className="text-xs font-heading font-semibold text-[#e5c158]">
              Categorias Cadastradas ({categorias.length})
            </span>
            <button
              type="button"
              onClick={() => setSelectedCat(null)}
              className="el-btn-gold h-8 px-3.5 text-xs"
            >
              Nova Categoria
            </button>
          </div>

          <div className="divide-y divide-white/10">
            {categorias.map((cat) => (
              <div
                key={cat.id}
                className={`p-4 flex items-center justify-between gap-2 ${
                  selectedCat?.id === cat.id ? 'bg-[#0c111c] border-l-2 border-[#e5c158]' : 'hover:bg-[#0c111c]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className="text-left flex-1 cursor-pointer"
                >
                  <div className="text-sm font-heading font-bold text-[#f3f4f6]">{cat.nome}</div>
                  <div className="text-xs text-[#a1a8b9] mt-0.5 tabular-nums">
                    {cat.especie} • Fórmula: {cat.formula_ranking} ({cat.top_n_peixes}) • Mín.{' '}
                    {cat.medida_minima} {cat.unidade_medida}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategoria(cat.id)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-red-300 hover:bg-red-950 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Paramétrico da Categoria Selecionada */}
        {temporada && (
          <CategoriaConfigForm
            key={selectedCat ? selectedCat.id : 'nova'}
            temporadaId={temporada.id}
            categoryToEdit={selectedCat}
            onSaved={(msg) => {
              refresh();
              setStatusMsg(msg);
            }}
          />
        )}
      </div>
    </div>
  );
}
