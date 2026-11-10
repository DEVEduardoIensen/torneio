'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Award,
  Bell,
  Calendar,
  CheckSquare,
  Compass,
  FileCheck2,
  Fish,
  Layers,
  MoreHorizontal,
  Sliders,
  Store,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { usePainel } from '../PainelContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { currentUser, registros } = usePainel();
  const [moreOpen, setMoreOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const pendentesCount = registros.filter((r) => r.status === 'pendente').length;

  const isMoreRouteActive =
    pathname.startsWith('/painel/etapas') ||
    pathname.startsWith('/painel/patrocinadores') ||
    pathname.startsWith('/painel/admin');

  const mainTabs = [
    {
      href: '/painel',
      label: 'Visão Geral',
      icon: Compass,
      isActive: pathname === '/painel',
    },
    {
      href: '/painel/ranking',
      label: 'Ranking',
      icon: Trophy,
      isActive: pathname.startsWith('/painel/ranking'),
    },
    {
      href: '/painel/registros',
      label: 'Enviar Peixe',
      icon: Fish,
      isSpecial: true,
      isActive: pathname.startsWith('/painel/registros'),
    },
    {
      href: '/painel/inscricoes',
      label: 'Inscrição',
      icon: FileCheck2,
      isActive: pathname.startsWith('/painel/inscricoes'),
    },
  ];

  const secondaryLinks = [
    {
      href: '/painel/etapas',
      label: 'Etapas e Regulamento',
      desc: 'Datas, rios habilitados e regras oficiais',
      icon: Calendar,
    },
    {
      href: '/painel/patrocinadores',
      label: 'Parceiros e Descontos',
      desc: 'Benefícios e descontos exclusivos aos inscritos',
      icon: Store,
    },
  ];

  const adminLinks = isAdmin
    ? [
        {
          href: '/painel/admin/registros',
          label: 'Mesa de Arbitragem',
          desc: 'Auditoria de vídeos na régua e homologação',
          icon: CheckSquare,
          badge: pendentesCount > 0 ? String(pendentesCount) : undefined,
        },
        {
          href: '/painel/admin/temporadas',
          label: 'Temporada e Categorias',
          desc: 'Fórmulas de apuração e medidas mínimas',
          icon: Sliders,
        },
        {
          href: '/painel/admin/etapas',
          label: 'Gestão de Etapas',
          desc: 'Palavra-chave, datas e locais de pesca',
          icon: Layers,
        },
        {
          href: '/painel/admin/inscricoes',
          label: 'Controle de Inscrições',
          desc: 'Homologação e comprovantes via Pix',
          icon: Award,
        },
        {
          href: '/painel/admin/pescadores',
          label: 'Pescadores e Acessos',
          desc: 'Cadastro e níveis de permissão',
          icon: Users,
        },
        {
          href: '/painel/admin/patrocinadores',
          label: 'Gestão de Patrocinadores',
          desc: 'Lojas parceiras e cotas de patrocínio',
          icon: Store,
        },
        {
          href: '/painel/admin/notificacao',
          label: 'Comunicados e Sorteios',
          desc: 'Envio de avisos e notificações oficiais',
          icon: Bell,
        },
      ]
    : [];

  return (
    <>
      {/* Barra Inferior Fixa (Estilo Instagram / Apps de Bancos) */}
      <nav
        aria-label="Navegação inferior mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c14]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 shadow-2xl"
      >
        <div className="grid grid-cols-5 items-center justify-around">
          {/* 4 Primeiras Abas Principais */}
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            if (tab.isSpecial) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center justify-center py-1 group focus:outline-none"
                  aria-label={tab.label}
                >
                  <div
                    className={`w-10 h-10 -mt-3 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
                      tab.isActive
                        ? 'bg-[#e5c158] text-[#060a13] ring-2 ring-[#e5c158]/50'
                        : 'bg-[#e5c158] text-[#060a13]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 font-bold truncate max-w-[60px] ${
                      tab.isActive ? 'text-[#e5c158]' : 'text-[#f3f4f6]'
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setMoreOpen(false)}
                className={`flex flex-col items-center justify-center py-1.5 transition-colors focus:outline-none ${
                  tab.isActive ? 'text-[#e5c158]' : 'text-[#a1a8b9] hover:text-[#f3f4f6]'
                }`}
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium truncate max-w-[60px]">
                  {tab.label}
                </span>
                {tab.isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#e5c158] mt-0.5" />
                )}
              </Link>
            );
          })}

          {/* 5ª Aba: Botão de 3 Pontos (Mais) */}
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer focus:outline-none ${
              moreOpen || isMoreRouteActive
                ? 'text-[#e5c158]'
                : 'text-[#a1a8b9] hover:text-[#f3f4f6]'
            }`}
            aria-label="Mais opções e outras abas"
            aria-expanded={moreOpen}
          >
            <div className="relative">
              <MoreHorizontal className="w-5 h-5 mb-0.5" />
              {pendentesCount > 0 && isAdmin && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#e5c158]" />
              )}
            </div>
            <span className="text-[10px] font-medium truncate">Mais</span>
            {(moreOpen || isMoreRouteActive) && (
              <span className="w-1 h-1 rounded-full bg-[#e5c158] mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Gaveta Inferior (Bottom Sheet) das Opções dos 3 Pontos */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Escuro */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Conteúdo do Sheet Inferior */}
          <div className="relative bg-[#080c14] border-t border-white/15 rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto space-y-5 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            {/* Cabeçalho do Sheet */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#f3f4f6]">Outras Seções</span>
                <span className="text-xs text-[#a1a8b9]">• Menu Completo</span>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a1a8b9] hover:text-[#f3f4f6] transition-colors cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links Secundários do Competidor */}
            <div className="space-y-1">
              <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-[#a1a8b9] mb-2">
                Competição e Benefícios
              </div>
              {secondaryLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl transition-colors ${
                      active
                        ? 'bg-[#e5c158] text-[#060a13]'
                        : 'bg-[#060a13] hover:bg-white/5 text-[#f3f4f6] border border-white/5'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? 'bg-[#060a13] text-[#e5c158]' : 'bg-white/5 text-[#e5c158]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-tight">{item.label}</div>
                      <div
                        className={`text-xs mt-0.5 truncate ${
                          active ? 'text-[#060a13]/80' : 'text-[#a1a8b9]'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Links de Gestão para Administrador */}
            {isAdmin && adminLinks.length > 0 && (
              <div className="space-y-1 pt-3 border-t border-white/10">
                <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-[#e5c158] mb-2 flex items-center justify-between">
                  <span>Direção do Torneio</span>
                  <span className="font-mono text-[10px] uppercase">Staff</span>
                </div>
                {adminLinks.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        active
                          ? 'bg-[#e5c158] text-[#060a13]'
                          : 'bg-[#060a13] hover:bg-white/5 text-[#f3f4f6] border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            active ? 'bg-[#060a13] text-[#e5c158]' : 'bg-white/5 text-[#e5c158]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium leading-tight">{item.label}</div>
                          <div
                            className={`text-xs mt-0.5 truncate ${
                              active ? 'text-[#060a13]/80' : 'text-[#a1a8b9]'
                            }`}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      {item.badge && (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-md text-xs font-bold tabular-nums ${
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
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
