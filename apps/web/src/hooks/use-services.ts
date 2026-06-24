import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/types';

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  detail: (id: string) => [...serviceKeys.all, 'detail', id] as const,
};

export function useServices() {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: servicesApi.list,
    staleTime: 5 * 60 * 1000, // 5 minutes — services change rarely
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => servicesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Service>) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      servicesApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(serviceKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}
