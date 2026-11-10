import type { Metadata } from 'next';
import { Outfit, DM_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
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
      className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#060a13] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}
