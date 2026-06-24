import type { Metadata } from 'next';
import { AgendaContent } from './agenda-content';

export const metadata: Metadata = { title: 'Agenda' };

export default function AgendaPage() {
  return <AgendaContent />;
}
