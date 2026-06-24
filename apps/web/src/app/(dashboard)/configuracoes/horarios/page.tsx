import type { Metadata } from 'next';
import { HorariosContent } from './horarios-content';

export const metadata: Metadata = { title: 'Horários de Funcionamento' };

export default function HorariosPage() {
  return <HorariosContent />;
}
