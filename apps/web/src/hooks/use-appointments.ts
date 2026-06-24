import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi, getApiError } from '@/lib/api';
import type {
  AppointmentFilters,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/types';

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters?: AppointmentFilters) =>
    [...appointmentKeys.lists(), filters] as const,
  detail: (id: string) => [...appointmentKeys.all, 'detail', id] as const,
};

export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentsApi.list(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentRequest }) =>
      appointmentsApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(appointmentKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentsApi.cancel(id, reason),
    onSuccess: (updated) => {
      queryClient.setQueryData(appointmentKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.complete(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(appointmentKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.confirm(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(appointmentKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}
