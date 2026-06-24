'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { dashboardApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const ATTENDANCE_DATA = [
  { day: 'Seg', compareceu: 18, faltou: 3 },
  { day: 'Ter', compareceu: 22, faltou: 2 },
  { day: 'Qua', compareceu: 15, faltou: 5 },
  { day: 'Qui', compareceu: 20, faltou: 1 },
  { day: 'Sex', compareceu: 25, faltou: 3 },
  { day: 'Sáb', compareceu: 12, faltou: 1 },
  { day: 'Dom', compareceu: 5, faltou: 0 },
];

const SERVICE_DATA = [
  { name: 'BJJ', value: 35, color: '#3b82f6' },
  { name: 'Muay Thai', value: 25, color: '#f59e0b' },
  { name: 'Fisioterapia', value: 20, color: '#10b981' },
  { name: 'Personal', value: 12, color: '#8b5cf6' },
  { name: 'Outros', value: 8, color: '#e2e8f0' },
];

const MONTHLY_CLIENTS = [
  { month: 'Jan', novos: 8, ativos: 120 },
  { month: 'Fev', novos: 12, ativos: 128 },
  { month: 'Mar', novos: 6, ativos: 130 },
  { month: 'Abr', novos: 15, ativos: 138 },
  { month: 'Mai', novos: 9, ativos: 140 },
  { month: 'Jun', novos: 11, ativos: 143 },
];

export function RelatoriosContent() {
  const { data: revenueData } = useQuery({
    queryKey: ['dashboard', 'revenue'],
    queryFn: () => dashboardApi.getRevenueChart(6),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-6">
      {/* Revenue + attendance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Receita Mensal</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Distribuição por Serviço</CardTitle>
            <CardDescription>% de agendamentos no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={SERVICE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {SERVICE_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend
                  formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance + client growth */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attendance by weekday */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Comparecimento por Dia</CardTitle>
            <CardDescription>Média da semana atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ATTENDANCE_DATA} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="compareceu" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={32} name="Compareceu" />
                <Bar dataKey="faltou" fill="#fca5a5" radius={[3, 3, 0, 0]} maxBarSize={32} name="Faltou" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Client growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Crescimento de Clientes</CardTitle>
            <CardDescription>Novos clientes x total ativo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_CLIENTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="ativos" stroke="#f97316" strokeWidth={2} dot={false} name="Ativos" />
                <Line type="monotone" dataKey="novos" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Novos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
