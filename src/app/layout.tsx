import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Eldorado Lake | Plataforma Oficial do Torneio de Pesca',
  description:
    'Classificação em tempo real, registro de capturas em vídeo sem cortes e arbitragem oficial do Torneio Eldorado Lake.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#060a13] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}

