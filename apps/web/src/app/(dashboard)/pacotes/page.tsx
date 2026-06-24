import type { Metadata } from 'next';
import { PacotesContent } from './pacotes-content';

export const metadata: Metadata = { title: 'Pacotes' };

export default function PacotesPage() {
  return <PacotesContent />;
}
