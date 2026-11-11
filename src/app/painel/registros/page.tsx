'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { CategoriaChecklistCard } from '@/components/registros/CategoriaChecklistCard';
import { MeusRegistrosTable } from '@/components/registros/MeusRegistrosTable';
import { RegistroEnvioForm } from '@/components/registros/RegistroEnvioForm';
import { Categoria } from '@/types/domain';

export default function PainelRegistrosPage() {
  const { etapaAtiva, categorias, etapas, registros, currentUser, refresh } = usePainel();

  const activeCategories = categorias.filter((c) => c.ativa);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    activeCategories[0] || null
  );

  const meusRegistros = registros.filter((r) => r.pescador_id === currentUser?.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">Enviar captura</h1>
      <p className="mt-1 text-sm text-[#a1a8b9]">
        Foto da isca e vídeo sem cortes na régua, para a arbitragem validar.
      </p>

      <div className="mt-4">
        {selectedCategoria && <CategoriaChecklistCard categoria={selectedCategoria} />}
        <RegistroEnvioForm
          currentUser={currentUser}
          activeCategories={activeCategories}
          etapaAtiva={etapaAtiva}
          etapas={etapas}
          onSubmitted={refresh}
          onSelectedCategoriaChange={setSelectedCategoria}
        />
      </div>

      <div className="mt-10">
        <MeusRegistrosTable registros={meusRegistros} currentUserName={currentUser?.nome} />
      </div>
    </div>
  );
}
