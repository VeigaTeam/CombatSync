import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function ClientesScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchClients() {
    try {
      const { data } = await api.get('/clients');
      const list = data.data ?? data;
      setClients(list);
      setFiltered(list);
    } catch {
      setClients([]);
      setFiltered([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchClients(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(clients.filter((c) => c.name.toLowerCase().includes(q)));
  }, [search, clients]);

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
        <View className="flex-row items-center bg-card border border-border rounded-xl px-3 py-2">
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput
            className="flex-1 text-foreground ml-2 text-base"
            placeholder="Buscar cliente..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchClients(); }}
            tintColor="#0ea5e9"
          />
        }
        ListEmptyComponent={() => (
          <View className="items-center py-20">
            <Text className="text-muted text-base">Nenhum cliente encontrado</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-card rounded-xl p-4 border border-border flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
              <Text className="text-primary font-bold text-base">
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-medium">{item.name}</Text>
              <Text className="text-muted text-sm">{item.email}</Text>
              {item.phone && (
                <Text className="text-muted text-sm">{item.phone}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
