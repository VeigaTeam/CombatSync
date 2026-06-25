import { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { api } from '@/lib/api';

interface DashboardStats {
  totalRevenue: number;
  appointmentsToday: number;
  appointmentsMonth: number;
  newClientsMonth: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-card rounded-xl p-4 border border-border flex-1">
      <Text className="text-muted text-sm mb-1">{label}</Text>
      <Text className="text-foreground font-bold text-xl">{value}</Text>
    </View>
  );
}

export default function FinanceiroScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchStats() {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchStats(); }}
          tintColor="#0ea5e9"
        />
      }
    >
      <Text className="text-foreground font-bold text-xl mb-4">Resumo</Text>

      <View className="flex-row gap-3 mb-3">
        <StatCard
          label="Receita do mês"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
        />
      </View>

      <View className="flex-row gap-3 mb-3">
        <StatCard
          label="Hoje"
          value={String(stats?.appointmentsToday ?? 0)}
        />
        <StatCard
          label="Este mês"
          value={String(stats?.appointmentsMonth ?? 0)}
        />
      </View>

      <View className="flex-row gap-3">
        <StatCard
          label="Novos clientes"
          value={String(stats?.newClientsMonth ?? 0)}
        />
      </View>
    </ScrollView>
  );
}
