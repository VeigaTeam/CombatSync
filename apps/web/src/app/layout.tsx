import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CombatSync',
    template: '%s | CombatSync',
  },
  description: 'Sistema de agendamento para academias de artes marciais e clínicas de fisioterapia',
  keywords: ['agendamento', 'academia', 'artes marciais', 'fisioterapia', 'gestão'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
