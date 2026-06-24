'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { AppointmentsToday } from '@/components/dashboard/appointments-today';
import { dashboardApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';

export function DashboardContent() {
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 2 * 60 * 1000,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['dashboard', 'revenue'],
    queryFn: () => dashboardApi.getRevenueChart(6),
    staleTime: 5 * 60 * 1000,
  });

  const { data: todayAppts, isLoading: todayLoading } = useQuery({
    queryKey: ['dashboard', 'appointments-today'],
    queryFn: dashboardApi.getAppointmentsToday,
    staleTime: 60 * 1000,
  });

  // Fallback stats when API is unavailable
  const displayStats = stats ?? {
    appointmentsToday: 12,
    appointmentsTodayChange: 8.3,
    revenueThisMonth: 14800,
    revenueChange: 12.1,
    attendanceRate: 87.5,
    attendanceRateChange: 2.4,
    activeClients: 143,
    activeClientsChange: 5.7,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Olá, {user?.name?.split(' ')[0] ?? 'Bem-vindo'} 👋
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {formatDate(new Date(), "EEEE, d 'de' MMMM 'de' yyyy")}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Agendamentos Hoje"
          value={displayStats.appointmentsToday}
          change={displayStats.appointmentsTodayChange}
          changeLabel="vs ontem"
          icon={Calendar}
          iconColor="text-[#f97316]"
          iconBg="bg-orange-50"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Receita do Mês"
          value={formatCurrency(displayStats.revenueThisMonth)}
          change={displayStats.revenueChange}
          changeLabel="vs mês anterior"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Taxa de Comparecimento"
          value={`${displayStats.attendanceRate.toFixed(1)}%`}
          change={displayStats.attendanceRateChange}
          changeLabel="este mês"
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Clientes Ativos"
          value={displayStats.activeClients}
          change={displayStats.activeClientsChange}
          changeLabel="este mês"
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          isLoading={statsLoading}
        />
      </div>

      {/* Charts + Today list */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RevenueChart data={revenueData} isLoading={revenueLoading} />
        </div>
        <div className="xl:col-span-2">
          <AppointmentsToday
            appointments={todayAppts}
            isLoading={todayLoading}
          />
        </div>
      </div>
    </div>
  );
}
