import type { Metadata } from 'next';
import { NewServiceContent } from './new-service-content';

export const metadata: Metadata = { title: 'Novo Serviço' };

export default function NovoServicoPage() {
  return <NewServiceContent />;
}
