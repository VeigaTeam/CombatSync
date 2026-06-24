import type { Metadata } from 'next';
import { FinanceiroContent } from './financeiro-content';

export const metadata: Metadata = { title: 'Financeiro' };

export default function FinanceiroPage() {
  return <FinanceiroContent />;
}
