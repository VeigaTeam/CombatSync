import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '@/lib/api';

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  client: { name: string };
  service: { name: string };
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: '#0ea5e9',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
  IN_PROGRESS: '#f59e0b',
};

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Agendado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  IN_PROGRESS: 'Em andamento',
};

export default function AgendaScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const today = new Date();

  async function fetchAppointments() {
    try {
      const dateStr = format(today, 'yyyy-MM-dd');
      const { data } = await api.get(`/appointments?date=${dateStr}`);
      setAppointments(data.data ?? data);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchAppointments(); }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">
          {format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </Text>
        <Text className="text-muted text-sm">{appointments.length} agendamentos</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchAppointments(); }}
            tintColor="#0ea5e9"
          />
        }
        ListEmptyComponent={() => (
          <View className="items-center py-20">
            <Text className="text-muted text-base">Nenhum agendamento hoje</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-card rounded-xl p-4 border border-border">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base">
                  {item.client?.name ?? 'Cliente'}
                </Text>
                <Text className="text-muted text-sm mt-0.5">
                  {item.service?.name ?? 'Serviço'}
                </Text>
              </View>
              <View
                className="px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${STATUS_COLORS[item.status]}20` }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: STATUS_COLORS[item.status] }}
                >
                  {STATUS_LABELS[item.status] ?? item.status}
                </Text>
              </View>
            </View>
            <Text className="text-muted text-sm mt-2">
              {format(new Date(item.startTime), 'HH:mm')} –{' '}
              {format(new Date(item.endTime), 'HH:mm')}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
