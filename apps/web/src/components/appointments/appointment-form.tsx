'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateAppointment } from '@/hooks/use-appointments';
import { useServices } from '@/hooks/use-services';
import { getApiError } from '@/lib/api';
import { PAYMENT_METHOD_LABELS } from '@/types';
import type { PaymentMethod } from '@/types';

const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Selecione um cliente'),
  serviceId: z.string().min(1, 'Selecione um serviço'),
  instructorId: z.string().optional(),
  spaceId: z.string().optional(),
  date: z.string().min(1, 'Selecione a data'),
  startTime: z.string().min(1, 'Informe o horário'),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  defaultDate?: Date;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AppointmentForm({
  defaultDate,
  onSuccess,
  onCancel,
}: AppointmentFormProps) {
  const { data: services } = useServices();
  const createMutation = useCreateAppointment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
      startTime: defaultDate ? format(defaultDate, 'HH:mm') : '',
    },
  });

  const selectedServiceId = watch('serviceId');
  const selectedService = services?.find((s) => s.id === selectedServiceId);

  async function onSubmit(values: AppointmentFormValues) {
    const startTime = new Date(`${values.date}T${values.startTime}:00`);
    const durationMinutes = selectedService?.durationMinutes ?? 60;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    try {
      await createMutation.mutateAsync({
        clientId: values.clientId,
        serviceId: values.serviceId,
        instructorId: values.instructorId,
        spaceId: values.spaceId,
        startTime: startTime.toISOString(),
        notes: values.notes,
        paymentMethod: values.paymentMethod as PaymentMethod | undefined,
      });
      onSuccess?.();
    } catch {
      // error shown below
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {createMutation.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {getApiError(createMutation.error)}
        </div>
      )}

      {/* Client */}
      <div className="space-y-2">
        <Label htmlFor="clientId">Cliente *</Label>
        {/* In production, this would be a searchable combobox */}
        <Input
          id="clientId"
          placeholder="ID do cliente (busca em breve)"
          {...register('clientId')}
        />
        {errors.clientId && (
          <p className="text-xs text-red-500">{errors.clientId.message}</p>
        )}
      </div>

      {/* Service */}
      <div className="space-y-2">
        <Label>Serviço *</Label>
        <Select
          onValueChange={(v) => setValue('serviceId', v)}
          defaultValue=""
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent>
            {services?.filter((s) => s.isActive).map((service) => (
              <SelectItem key={service.id} value={service.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: service.color }}
                  />
                  {service.name} ({service.durationMinutes}min)
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceId && (
          <p className="text-xs text-red-500">{errors.serviceId.message}</p>
        )}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Horário *</Label>
          <Input id="startTime" type="time" {...register('startTime')} />
          {errors.startTime && (
            <p className="text-xs text-red-500">{errors.startTime.message}</p>
          )}
        </div>
      </div>

      {/* Duration hint */}
      {selectedService && (
        <p className="text-xs text-slate-500">
          Duração: {selectedService.durationMinutes} minutos — Valor:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(selectedService.price)}
        </p>
      )}

      {/* Payment method */}
      <div className="space-y-2">
        <Label>Forma de pagamento</Label>
        <Select onValueChange={(v) => setValue('paymentMethod', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar (opcional)" />
          </SelectTrigger>
          <SelectContent>
            {(
              Object.entries(PAYMENT_METHOD_LABELS) as [PaymentMethod, string][]
            ).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Informações adicionais..."
          className="resize-none"
          rows={3}
          {...register('notes')}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={createMutation.isPending}>
          {createMutation.isPending ? 'Salvando...' : 'Criar Agendamento'}
        </Button>
      </div>
    </form>
  );
}
