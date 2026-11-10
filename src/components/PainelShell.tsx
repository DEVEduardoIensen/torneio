'use client';

import React from 'react';
import { PainelHeader } from './navigation/PainelHeader';
import { PainelSidebar } from './navigation/PainelSidebar';
import { MobileBottomNav } from './navigation/MobileBottomNav';

export default function PainelShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060a13] text-[#f3f4f6] flex flex-col lg:flex-row">
      {/* Sidebar Desktop Fixa */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        <PainelSidebar />
      </aside>

      {/* Conteúdo Principal com Topbar e Barra Inferior Mobile */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <PainelHeader />

        {/* Conteúdo da Página com Padding Inferior Extra para o Menu de Abas Mobile */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Barra de Navegação Inferior Mobile (Estilo Apps de Bancos e Instagram) */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
