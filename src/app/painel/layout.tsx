import React from 'react';
import { PainelProvider } from '@/components/PainelContext';
import PainelShell from '@/components/PainelShell';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PainelProvider>
      <PainelShell>{children}</PainelShell>
    </PainelProvider>
  );
}
