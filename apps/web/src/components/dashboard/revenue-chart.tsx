'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import type { RevenueChartData } from '@/types';

interface RevenueChartProps {
  data?: RevenueChartData[];
  isLoading?: boolean;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-900 mb-2 capitalize">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: entry.color }}
          />
          <span className="text-slate-600">
            {entry.name === 'revenue' ? 'Receita' : 'Agendamentos'}:{' '}
          </span>
          <span className="font-medium text-slate-900">
            {entry.name === 'revenue'
              ? formatCurrency(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Mock data for when API is unavailable
const MOCK_DATA: RevenueChartData[] = [
  { month: 'Jan', revenue: 8400, appointments: 62 },
  { month: 'Fev', revenue: 9200, appointments: 70 },
  { month: 'Mar', revenue: 11500, appointments: 85 },
  { month: 'Abr', revenue: 10800, appointments: 78 },
  { month: 'Mai', revenue: 13200, appointments: 96 },
  { month: 'Jun', revenue: 14800, appointments: 110 },
];

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const chartData = data ?? MOCK_DATA;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Receita Mensal</CardTitle>
        <CardDescription>Receita e agendamentos dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`
                }
              />
              <YAxis
                yAxisId="appointments"
                orientation="right"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                name="revenue"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                yAxisId="appointments"
                dataKey="appointments"
                name="appointments"
                fill="#e2e8f0"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
