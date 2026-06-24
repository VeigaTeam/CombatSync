import type { Metadata } from 'next';
import { ConfiguracoesContent } from './configuracoes-content';

export const metadata: Metadata = { title: 'Configurações' };

export default function ConfiguracoesPage() {
  return <ConfiguracoesContent />;
}
