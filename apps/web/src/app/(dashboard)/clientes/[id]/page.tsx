import type { Metadata } from 'next';
import { ClientDetailContent } from './client-detail-content';

export const metadata: Metadata = { title: 'Perfil do Cliente' };

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return <ClientDetailContent clientId={params.id} />;
}
