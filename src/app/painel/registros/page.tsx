'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { CategoriaChecklistCard } from '@/components/registros/CategoriaChecklistCard';
import { MeusRegistrosTable } from '@/components/registros/MeusRegistrosTable';
import { RegistroEnvioForm } from '@/components/registros/RegistroEnvioForm';
import { Categoria } from '@/types/domain';

export default function PainelRegistrosPage() {
  const {
    temporada,
    etapaAtiva,
    categorias,
    etapas,
    registros,
    currentUser,
    refresh,
  } = usePainel();

  const activeCategories = categorias.filter((c) => c.ativa);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    activeCategories[0] || null
  );

  const meusRegistros = registros.filter((r) => r.pescador_id === currentUser?.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Registro Oficial de Captura e Soltura
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Submeta a foto na régua e o vídeo sem cortes para validação pela comissão de arbitragem.
          {temporada?.permite_mesmo_peixe_multiplas_categorias
            ? ' O regulamento ativo permite registrar o mesmo exemplar em múltiplas categorias compatíveis.'
            : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <RegistroEnvioForm
          currentUser={currentUser}
          activeCategories={activeCategories}
          etapaAtiva={etapaAtiva}
          etapas={etapas}
          onSubmitted={refresh}
          onSelectedCategoriaChange={setSelectedCategoria}
        />

        {selectedCategoria && <CategoriaChecklistCard categoria={selectedCategoria} />}
      </div>

      <MeusRegistrosTable
        registros={meusRegistros}
        currentUserName={currentUser?.nome}
      />
    </div>
  );
}
