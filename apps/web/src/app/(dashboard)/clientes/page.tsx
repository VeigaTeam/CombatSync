import type { Metadata } from 'next';
import { ClientsContent } from './clients-content';

export const metadata: Metadata = { title: 'Clientes' };

export default function ClientesPage() {
  return <ClientsContent />;
}
