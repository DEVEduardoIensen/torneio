'use client';

import React from 'react';
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
  LogOut,
  Sliders,
  Store,
  Trophy,
  Users,
} from 'lucide-react';
import { usePainel } from '../PainelContext';

interface PainelSidebarProps {
  onCloseMobile?: () => void;
}

export function PainelSidebar({ onCloseMobile }: PainelSidebarProps) {
  const pathname = usePathname();
  const { temporada, registros, currentUser } = usePainel();

  const isAdmin = currentUser?.role === 'admin';
  const pendentesCount = registros.filter((r) => r.status === 'pendente').length;

  const navCompetidor = [
    { href: '/painel', label: 'Visão Geral', icon: Compass },
    { href: '/painel/ranking', label: 'Classificação Oficial', icon: Trophy },
    { href: '/painel/registros', label: 'Registrar Captura', icon: Fish },
    { href: '/painel/etapas', label: 'Etapas e Regulamento', icon: Calendar },
    { href: '/painel/inscricoes', label: 'Minha Inscrição', icon: FileCheck2 },
    { href: '/painel/patrocinadores', label: 'Parceiros e Descontos', icon: Store },
  ];

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
    <div className="flex flex-col h-full bg-[#080c14] border-r border-[#e5c158]/20">
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
            {isAdmin ? 'Painel de Gestão' : 'Área do Atleta'}
          </div>
        </div>
      </div>

      {/* Links de Navegação */}
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
                  onClick={onCloseMobile}
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

        {isAdmin && navAdmin.length > 0 && (
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
                    onClick={onCloseMobile}
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

      {/* Rodapé da Sidebar */}
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
    </div>
  );
}
