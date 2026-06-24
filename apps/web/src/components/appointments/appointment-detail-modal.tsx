'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from './status-badge';
import { useAppointment, useCancelAppointment, useCompleteAppointment, useConfirmAppointment } from '@/hooks/use-appointments';
import { formatDateTime, formatCurrency, initials } from '@/lib/utils';
import { PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/types';
import { Clock, User, Dumbbell, Building2, DollarSign, FileText } from 'lucide-react';

interface AppointmentDetailModalProps {
  appointmentId: string | null;
  open: boolean;
  onClose: () => void;
}

export function AppointmentDetailModal({
  appointmentId,
  open,
  onClose,
}: AppointmentDetailModalProps) {
  const { data: appt, isLoading } = useAppointment(appointmentId ?? '');
  const cancelMutation = useCancelAppointment();
  const completeMutation = useCompleteAppointment();
  const confirmMutation = useConfirmAppointment();

  const isBusy =
    cancelMutation.isPending ||
    completeMutation.isPending ||
    confirmMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
        </DialogHeader>

        {isLoading || !appt ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Client */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={appt.client?.avatarUrl} />
                <AvatarFallback>
                  {appt.client ? initials(appt.client.name) : '??'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900">
                  {appt.client?.name ?? '—'}
                </p>
                <p className="text-sm text-slate-500">
                  {appt.client?.phone ?? '—'}
                </p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={appt.status} />
              </div>
            </div>

            <Separator />

            {/* Details grid */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-700">Horário</p>
                  <p className="text-slate-500">
                    {formatDateTime(appt.startTime)} →{' '}
                    {new Date(appt.endTime).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Dumbbell className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-700">Serviço</p>
                  <p className="text-slate-500">
                    {appt.service?.name ?? '—'}
                  </p>
                </div>
              </div>

              {appt.space && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Espaço</p>
                    <p className="text-slate-500">{appt.space.name}</p>
                  </div>
                </div>
              )}

              {appt.instructor && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Instrutor</p>
                    <p className="text-slate-500">{appt.instructor.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-700">Pagamento</p>
                  <p className="text-slate-500">
                    {formatCurrency(appt.price)} —{' '}
                    {PAYMENT_STATUS_LABELS[appt.paymentStatus]}
                    {appt.paymentMethod
                      ? ` (${PAYMENT_METHOD_LABELS[appt.paymentMethod]})`
                      : ''}
                  </p>
                </div>
              </div>

              {appt.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Observações</p>
                    <p className="text-slate-500">{appt.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {appt.status === 'scheduled' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => confirmMutation.mutate(appt.id)}
                  disabled={isBusy}
                >
                  Confirmar
                </Button>
              )}
              {(appt.status === 'scheduled' || appt.status === 'confirmed') && (
                <>
                  <Button
                    size="sm"
                    onClick={() => completeMutation.mutate(appt.id)}
                    disabled={isBusy}
                    isLoading={completeMutation.isPending}
                  >
                    Concluir
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => cancelMutation.mutate({ id: appt.id })}
                    disabled={isBusy}
                    isLoading={cancelMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={onClose}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
