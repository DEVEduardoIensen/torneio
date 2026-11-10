'use client';

import React, { useState } from 'react';
import { PainelHeader } from './navigation/PainelHeader';
import { PainelSidebar } from './navigation/PainelSidebar';

export default function PainelShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060a13] text-[#f3f4f6] flex flex-col lg:flex-row">
      {/* Sidebar Desktop Fixa */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        <PainelSidebar />
      </aside>

      {/* Conteúdo Principal com Topbar */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <PainelHeader
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Menu Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] z-10 flex flex-col h-full">
              <PainelSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Conteúdo da Página com Container Centralizado */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
