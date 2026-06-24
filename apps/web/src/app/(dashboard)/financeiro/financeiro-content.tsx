'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { financialApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PAYMENT_METHOD_LABELS } from '@/types';
import type { Transaction } from '@/types';
import { cn } from '@/lib/utils';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', clinicId: 'c1', type: 'income', category: 'Agendamento', description: 'BJJ Gi — Ana Costa', amount: 120, method: 'pix', date: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '2', clinicId: 'c1', type: 'income', category: 'Pacote', description: 'Pacote 10 aulas — Bruno Mendes', amount: 950, method: 'credit_card', date: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '3', clinicId: 'c1', type: 'expense', category: 'Aluguel', description: 'Aluguel do espaço — Junho', amount: 2500, date: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '4', clinicId: 'c1', type: 'income', category: 'Agendamento', description: 'Fisioterapia — Carla Ferreira', amount: 180, method: 'cash', date: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '5', clinicId: 'c1', type: 'expense', category: 'Equipamentos', description: 'Compra de equipamentos', amount: 750, date: new Date().toISOString(), createdAt: new Date().toISOString() },
];

export function FinanceiroContent() {
  const [period, setPeriod] = useState<'month' | 'week' | 'year'>('month');

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', period],
    queryFn: () => financialApi.list(),
    staleTime: 2 * 60 * 1000,
  });

  const transactions = data?.data ?? MOCK_TRANSACTIONS;

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        {(['week', 'month', 'year'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500',
            )}
          >
            {p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Receita</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Despesas</p>
                <p className="text-2xl font-bold text-red-500 mt-1">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Saldo</p>
                <p
                  className={cn(
                    'text-2xl font-bold mt-1',
                    balance >= 0 ? 'text-slate-900' : 'text-red-500',
                  )}
                >
                  {formatCurrency(balance)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#f97316]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Transações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-6 w-6 rounded-full flex items-center justify-center shrink-0',
                            t.type === 'income' ? 'bg-green-100' : 'bg-red-100',
                          )}
                        >
                          {t.type === 'income' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        {t.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {t.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {t.method ? PAYMENT_METHOD_LABELS[t.method] : '—'}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {formatDate(t.date, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-semibold',
                        t.type === 'income' ? 'text-green-600' : 'text-red-500',
                      )}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
