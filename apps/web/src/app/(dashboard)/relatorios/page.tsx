import type { Metadata } from 'next';
import { RelatoriosContent } from './relatorios-content';

export const metadata: Metadata = { title: 'Relatórios' };

export default function RelatoriosPage() {
  return <RelatoriosContent />;
}
