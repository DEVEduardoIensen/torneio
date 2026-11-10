'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Categoria,
  CategoryRankingResult,
  Etapa,
  Inscricao,
  Notificacao,
  Patrocinador,
  Pescador,
  RegistroCaptura,
  Temporada,
} from '@/types/domain';

interface PainelData {
  temporada: Temporada | null;
  etapaAtiva: Etapa | null;
  categorias: Categoria[];
  etapas: Etapa[];
  inscricoes: Inscricao[];
  registros: RegistroCaptura[];
  patrocinadores: Patrocinador[];
  notificacoes: Notificacao[];
  pescadores: Pescador[];
  rankings: {
    categorias: CategoryRankingResult[];
    capturasCompletasSemCorte: RegistroCaptura[];
  };
  currentUser: Pescador | null;
  loading: boolean;
  refresh: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
}

const PainelContext = createContext<PainelData | null>(null);

export function PainelProvider({ children }: { children: React.ReactNode }) {
  const [temporada, setTemporada] = useState<Temporada | null>(null);
  const [etapaAtiva, setEtapaAtiva] = useState<Etapa | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [registros, setRegistros] = useState<RegistroCaptura[]>([]);
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [pescadores, setPescadores] = useState<Pescador[]>([]);
  const [rankings, setRankings] = useState<{
    categorias: CategoryRankingResult[];
    capturasCompletasSemCorte: RegistroCaptura[];
  }>({
    categorias: [],
    capturasCompletasSemCorte: [],
  });
  const [currentUser, setCurrentUser] = useState<Pescador | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/temporada?all=1', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setTemporada(data.temporada);
      setEtapaAtiva(data.etapaAtiva);
      setCategorias(data.categorias || []);
      setEtapas(data.etapas || []);
      setInscricoes(data.inscricoes || []);
      setRegistros(data.registros || []);
      setPatrocinadores(data.patrocinadores || []);
      setNotificacoes(data.notificacoes || []);
      setPescadores(data.pescadores || []);
      setRankings(
        data.rankings || {
          categorias: [],
          capturasCompletasSemCorte: [],
        }
      );
      setCurrentUser(data.currentUser || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const switchUser = useCallback(
    async (userId: string) => {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ switchUserId: userId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } finally {
        await refresh();
      }
    },
    [refresh]
  );

  return (
    <PainelContext.Provider
      value={{
        temporada,
        etapaAtiva,
        categorias,
        etapas,
        inscricoes,
        registros,
        patrocinadores,
        notificacoes,
        pescadores,
        rankings,
        currentUser,
        loading,
        refresh,
        switchUser,
      }}
    >
      {children}
    </PainelContext.Provider>
  );
}

export function usePainel() {
  const ctx = useContext(PainelContext);
  if (!ctx) {
    throw new Error('usePainel deve ser utilizado dentro de PainelProvider');
  }
  return ctx;
}

