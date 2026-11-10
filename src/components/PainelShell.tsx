'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Award,
  Bell,
  Calendar,
  CheckSquare,
  ChevronDown,
  Compass,
  FileCheck2,
  Fish,
  Layers,
  LogOut,
  Menu,
  Sliders,
  Store,
  Trophy,
  User,
  Users,
  X,
  KeyRound,
} from 'lucide-react';
import { usePainel } from './PainelContext';

export default function PainelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { temporada, etapaAtiva, registros, pescadores, currentUser, switchUser } = usePainel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const canAccessAdmin = isAdmin;

  const pendentesCount = registros.filter((r) => r.status === 'pendente').length;

  const navCompetidor = [
    { href: '/painel', label: 'Visão Geral', icon: Compass },
    { href: '/painel/ranking', label: 'Classificação Oficial', icon: Trophy },
    { href: '/painel/registros', label: 'Registrar Captura', icon: Fish },
    { href: '/painel/etapas', label: 'Etapas e Regulamento', icon: Calendar },
    { href: '/painel/inscricoes', label: 'Minha Inscrição', icon: FileCheck2 },
    { href: '/painel/patrocinadores', label: 'Parceiros e Descontos', icon: Store },
  ];

  // Itens de gestão liberados apenas para Admin
  const navAdmin = isAdmin
    ? [
        {
          href: '/painel/admin/registros',
          label: 'Mesa de Arbitragem',
          icon: CheckSquare,
          badge: pendentesCount > 0 ? String(pendentesCount) : undefined,
        },
        { href: '/painel/admin/temporadas', label: 'Temporada e Categorias', icon: Sliders },
        { href: '/painel/admin/etapas', label: 'Gestão de Etapas', icon: Layers },
        { href: '/painel/admin/inscricoes', label: 'Controle de Inscrições', icon: Award },
        { href: '/painel/admin/pescadores', label: 'Pescadores e Acessos', icon: Users },
        { href: '/painel/admin/patrocinadores', label: 'Gestão de Patrocinadores', icon: Store },
        { href: '/painel/admin/notificacao', label: 'Comunicados e Sorteios', icon: Bell },
      ]
    : [];

  const isRouteActive = (href: string) => {
    if (href === '/painel') return pathname === '/painel';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-[#f3f4f6] flex flex-col lg:flex-row">
      {/* Sidebar Desktop Fixa */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#080c14] border-r border-[#e5c158]/20 z-30">
        {/* Topo da Sidebar com Logo Oficial */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3.5">
          <img
            src="/brand/logo_header.webp"
            alt={temporada?.nome || 'Eldorado Lake'}
            className="h-12 w-auto object-contain shrink-0"
          />
          <div className="min-w-0">
            <div className="font-heading font-bold text-sm text-[#f3f4f6] truncate">
              {temporada?.nome || 'Ranking Eldorado'}
            </div>
            <div className="text-xs text-[#a1a8b9] truncate mt-0.5">
              {canAccessAdmin ? 'Painel de Gestão' : 'Área do Atleta'}
            </div>
          </div>
        </div>

        {/* Links de Navegação com Ícones */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#a1a8b9]">
              Área do Competidor
            </div>
            <nav className="space-y-1">
              {navCompetidor.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#e5c158] text-[#060a13] font-bold shadow-sm'
                        : 'text-[#a1a8b9] hover:bg-white/5 hover:text-[#f3f4f6]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#060a13]' : 'text-[#e5c158]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Seção Exclusiva da Arbitragem e Direção (Oculta para Competidores Comuns) */}
          {canAccessAdmin && navAdmin.length > 0 && (
            <div>
              <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#a1a8b9] flex items-center justify-between">
                <span>Direção do Torneio</span>
                <span className="text-xs font-mono text-[#e5c158] uppercase font-bold">
                  {currentUser?.role}
                </span>
              </div>
              <nav className="space-y-1">
                {navAdmin.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-[#e5c158] text-[#060a13] font-bold shadow-sm'
                          : 'text-[#a1a8b9] hover:bg-white/5 hover:text-[#f3f4f6]'
                      }`}
                    >
                      <span className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#060a13]' : 'text-[#e5c158]'}`} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                            active
                              ? 'bg-[#060a13] text-[#e5c158]'
                              : 'bg-[#e5c158]/15 text-[#e5c158] border border-[#e5c158]/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Rodapé da Sidebar - Usuário Ativo */}
        <div className="p-4 border-t border-white/10 bg-[#060a13]/80">
          <div className="flex items-center justify-between text-xs text-[#a1a8b9] mb-2">
            <span>Usuário conectado</span>
            <Link href="/login" className="text-[#e5c158] hover:text-[#cfab44] flex items-center gap-1 font-medium">
              <LogOut className="w-3.5 h-3.5" />
              <span>Trocar</span>
            </Link>
          </div>
          <div className="text-sm font-heading font-semibold text-[#f3f4f6] truncate">
            {currentUser?.nome || 'Lucas Zanardini'}
          </div>
          <div className="text-xs text-[#a1a8b9] flex items-center gap-2 mt-0.5">
            <span className="capitalize">{currentUser?.role || 'pescador'}</span>
            <span>•</span>
            <span className="font-mono text-[#e5c158] tabular-nums font-semibold">
              {currentUser?.numero_inscricao || '#001'}
            </span>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal com Topbar */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar Operacional Oficial */}
        <header className="sticky top-0 z-20 bg-[#080c14]/95 backdrop-blur-md border-b border-[#e5c158]/20 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botão Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              <div className="hidden sm:flex items-center gap-3 bg-[#060a13] border border-[#e5c158]/25 rounded-full px-4 py-1.5 shadow-sm">
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
              className="hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#e5c158] hover:bg-[#cfab44] text-[#060a13] text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              <Fish className="w-4 h-4 shrink-0" />
              <span>Enviar Captura</span>
            </Link>

            {/* Seletor Rápido de Perfil de Usuário */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 bg-[#060a13] hover:bg-white/5 border border-white/10 hover:border-[#e5c158]/30 rounded-full px-3.5 py-1.5 text-left transition-colors cursor-pointer"
                aria-expanded={userDropdownOpen}
                aria-label="Alternar perfil ativo"
              >
                <User className="w-4 h-4 text-[#e5c158] shrink-0" />
                <div className="text-xs">
                  <div className="font-heading font-semibold text-[#f3f4f6] leading-tight">
                    {currentUser?.nome || 'Selecionar Perfil'}
                  </div>
                  <div className="text-xs text-[#a1a8b9] capitalize leading-tight">
                    {currentUser?.role || 'pescador'} • {currentUser?.numero_inscricao || '#001'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#e5c158]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#080c14] border border-[#e5c158]/35 rounded-2xl shadow-2xl p-2.5 z-50">
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
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs rounded-xl transition-colors cursor-pointer ${
                          currentUser?.id === p.id
                            ? 'bg-[#e5c158] text-[#060a13] font-bold'
                            : 'text-[#f3f4f6] hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-heading font-semibold">{p.nome}</div>
                          <div
                            className={`text-xs ${
                              currentUser?.id === p.id ? 'text-[#060a13]/80' : 'text-[#a1a8b9]'
                            }`}
                          >
                            {p.cidade_uf} • {p.numero_inscricao || 'S/N'}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-mono uppercase font-bold ${
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
                  <div className="pt-2 border-t border-white/10">
                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-center text-xs font-semibold text-[#e5c158] hover:text-[#cfab44]"
                    >
                      Ir para a tela de Login (/login)
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Menu Mobile Deslizante */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#080c14] border-b border-[#e5c158]/20 px-4 py-4 space-y-4 shadow-xl">
            {etapaAtiva && (
              <div className="bg-[#060a13] border border-[#e5c158]/25 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-[#a1a8b9] font-medium">{etapaAtiva.titulo}</span>
                <span className="font-mono font-bold text-[#e5c158] tabular-nums">
                  {etapaAtiva.revelar_palavra_chave ? etapaAtiva.palavra_chave : 'OCULTA'}
                </span>
              </div>
            )}
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#a1a8b9] px-2 pb-1">
                Área do Competidor
              </div>
              {navCompetidor.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      active
                        ? 'bg-[#e5c158] text-[#060a13] font-bold'
                        : 'text-[#f3f4f6] hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#060a13]' : 'text-[#e5c158]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Menu Admin no Mobile (Apenas para Admin) */}
            {canAccessAdmin && navAdmin.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-white/10">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#a1a8b9] px-2 pb-1">
                  Direção do Torneio
                </div>
                {navAdmin.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                        active
                          ? 'bg-[#e5c158] text-[#060a13] font-bold'
                          : 'text-[#f3f4f6] hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#060a13]' : 'text-[#e5c158]'}`} />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#e5c158]/15 text-[#e5c158] border border-[#e5c158]/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Área Principal da Página */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10">
          {children}
        </main>

        {/* Navegação Inferior Mobile Dinâmica por Perfil */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-[#080c14]/95 backdrop-blur-md border-t border-[#e5c158]/20 grid grid-cols-5 z-20">
          <Link
            href="/painel"
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
              pathname === '/painel' ? 'text-[#e5c158] font-bold' : 'text-[#a1a8b9]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Painel</span>
          </Link>
          <Link
            href="/painel/ranking"
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
              pathname.startsWith('/painel/ranking') ? 'text-[#e5c158] font-bold' : 'text-[#a1a8b9]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Ranking</span>
          </Link>
          <Link
            href="/painel/registros"
            className={`flex flex-col items-center justify-center gap-1 text-xs font-semibold ${
              pathname.startsWith('/painel/registros') ? 'text-[#e5c158] font-bold' : 'text-[#f3f4f6]'
            }`}
          >
            <Fish className="w-4 h-4" />
            <span>Captura</span>
          </Link>
          {canAccessAdmin ? (
            <Link
              href="/painel/inscricoes"
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                pathname.startsWith('/painel/inscricoes') ? 'text-[#e5c158] font-bold' : 'text-[#a1a8b9]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Inscrição</span>
            </Link>
          ) : (
            <Link
              href="/painel/etapas"
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                pathname.startsWith('/painel/etapas') ? 'text-[#e5c158] font-bold' : 'text-[#a1a8b9]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Etapas</span>
            </Link>
          )}
          {canAccessAdmin ? (
            <Link
              href="/painel/admin/registros"
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                pathname.startsWith('/painel/admin') ? 'text-[#e5c158] font-bold' : 'text-[#a1a8b9]'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Admin ({pendentesCount})</span>
            </Link>
          ) : (
            <Link
              href="/painel/inscricoes"
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                pathname.startsWith('/painel/inscricoes') ? 'text-[#e5c158] font-bold' : 'text-[#a1a8b9]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Inscrição</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
