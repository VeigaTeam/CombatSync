import type { Metadata } from 'next';
import { ServicosContent } from './servicos-content';

export const metadata: Metadata = { title: 'Serviços' };

export default function ServicosPage() {
  return <ServicosContent />;
}
