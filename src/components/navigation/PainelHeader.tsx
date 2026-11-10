'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Fish, KeyRound, Menu, User, X } from 'lucide-react';
import { usePainel } from '../PainelContext';

interface PainelHeaderProps {
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function PainelHeader({ mobileMenuOpen, onToggleMobileMenu }: PainelHeaderProps) {
  const { etapaAtiva, pescadores, currentUser, switchUser } = usePainel();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-[#080c14]/95 backdrop-blur-md border-b border-[#e5c158]/20 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* Botão Hambúrguer Mobile */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#060a13] text-[#f3f4f6] hover:text-[#e5c158] border border-white/10"
          aria-label="Abrir menu de navegação"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

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
          <div className="hidden sm:flex items-center gap-3 bg-[#060a13] border border-[#e5c158]/25 rounded-lg px-3.5 py-1.5 shadow-sm">
            <span className="text-xs font-medium text-[#a1a8b9] truncate">
              {etapaAtiva.titulo}:
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f3f4f6]">
              <KeyRound className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Palavra-chave:</span>
              <strong className="font-mono text-[#e5c158] tabular-nums font-bold">
                {etapaAtiva.revelar_palavra_chave ? etapaAtiva.palavra_chave : 'OCULTA'}
              </strong>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Botão Rápido de Enviar Captura */}
        <Link
          href="/painel/registros"
          className="hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#e5c158] hover:bg-[#cfab44] text-[#060a13] text-xs font-bold transition-colors shadow-sm cursor-pointer"
        >
          <Fish className="w-4 h-4 shrink-0" />
          <span>Enviar Captura</span>
        </Link>

        {/* Seletor Rápido de Perfil de Usuário */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 bg-[#060a13] hover:bg-white/5 border border-white/10 hover:border-[#e5c158]/30 rounded-lg px-3 py-1.5 text-left transition-colors cursor-pointer"
            aria-expanded={userDropdownOpen}
            aria-label="Alternar perfil ativo"
          >
            <User className="w-4 h-4 text-[#e5c158] shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-[#f3f4f6] leading-tight">
                {currentUser?.nome || 'Selecionar Perfil'}
              </div>
              <div className="text-xs text-[#a1a8b9] leading-tight">
                {currentUser?.role === 'admin' ? 'Administrador' : currentUser?.cidade_uf || 'Atleta'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#e5c158]" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#080c14] border border-[#e5c158]/35 rounded-xl shadow-2xl p-2.5 z-50">
              <div className="px-3 py-2 border-b border-white/10 text-xs font-semibold text-[#a1a8b9]">
                Alternar usuário ativo (Simulador de Perfis)
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-white/5 my-1">
                {pescadores.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      switchUser(p.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                      currentUser?.id === p.id
                        ? 'bg-[#e5c158] text-[#060a13] font-bold'
                        : 'text-[#f3f4f6] hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.nome}</div>
                      <div
                        className={`text-xs ${
                          currentUser?.id === p.id ? 'text-[#060a13]/80' : 'text-[#a1a8b9]'
                        }`}
                      >
                        {p.role === 'admin' ? 'Administrador' : p.cidade_uf}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-mono uppercase font-bold ${
                        currentUser?.id === p.id
                          ? 'bg-[#060a13] text-[#e5c158]'
                          : 'bg-[#060a13] text-[#a1a8b9] border border-white/10'
                      }`}
                    >
                      {p.role}
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

