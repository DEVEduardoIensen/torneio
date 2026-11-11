'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Fish } from 'lucide-react';
import { usePainel } from '../PainelContext';

interface PainelHeaderProps {
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export function PainelHeader({}: PainelHeaderProps = {}) {
  const { etapaAtiva, pescadores, currentUser, switchUser } = usePainel();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-[#080c14]/95 backdrop-blur-md border-b border-[#e5c158]/20 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* Logo Mobile */}
        <Link href="/painel" className="flex lg:hidden items-center gap-2.5">
          <img
            src="/brand/logo_header.webp"
            alt="Eldorado Lake"
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Palavra-Chave da Etapa Ativa */}
        {etapaAtiva && (
          <p className="hidden sm:block truncate text-sm text-[#a1a8b9]">
            {etapaAtiva.titulo} · palavra-chave{' '}
            <strong className="ml-1 font-bold tracking-wide text-[#e5c158]">
              {etapaAtiva.revelar_palavra_chave ? etapaAtiva.palavra_chave : 'na largada'}
            </strong>
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Botão Rápido de Enviar Captura */}
        <Link
          href="/painel/registros"
          className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#e5c158] hover:bg-[#cfab44] text-[#060a13] text-sm font-bold transition-colors cursor-pointer"
        >
          <Fish className="w-4 h-4 shrink-0" />
          <span>Enviar captura</span>
        </Link>

        {/* Seletor Rápido de Perfil de Usuário */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 hover:bg-white/5 rounded-xl px-3 h-11 text-left transition-colors cursor-pointer"
            aria-expanded={userDropdownOpen}
            aria-label="Alternar perfil ativo"
          >
            <div className="text-sm">
              <div className="font-medium text-[#f3f4f6] leading-tight">
                {currentUser?.nome || 'Selecionar Perfil'}
              </div>
              <div className="text-xs text-[#a1a8b9] leading-tight">
                {currentUser?.role === 'admin' ? 'Administrador' : currentUser?.cidade_uf || 'Atleta'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#a1a8b9]" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0c1322] border border-white/15 rounded-xl shadow-2xl p-1.5 z-50">
              <div className="max-h-64 overflow-y-auto">
                {pescadores.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      switchUser(p.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between min-h-12 px-3 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                      currentUser?.id === p.id
                        ? 'text-[#e5c158] font-semibold bg-white/[0.06]'
                        : 'text-[#f3f4f6] hover:bg-white/5'
                    }`}
                  >
                    <span className="font-medium">{p.nome}</span>
                    <span className="text-xs text-[#a1a8b9]">
                      {p.role === 'admin' ? 'Admin' : p.cidade_uf}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

