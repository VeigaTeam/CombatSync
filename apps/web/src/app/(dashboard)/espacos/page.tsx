import type { Metadata } from 'next';
import { EspacosContent } from './espacos-content';

export const metadata: Metadata = { title: 'Espaços' };

export default function EspacosPage() {
  return <EspacosContent />;
}
