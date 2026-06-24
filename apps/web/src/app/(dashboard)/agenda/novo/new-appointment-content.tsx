'use client';

import { useRouter } from 'next/navigation';
import { AppointmentForm } from '@/components/appointments/appointment-form';
import { toast } from '@/components/ui/toaster';

export function NewAppointmentContent() {
  const router = useRouter();

  return (
    <AppointmentForm
      onSuccess={() => {
        toast({
          title: 'Agendamento criado!',
          description: 'O agendamento foi criado com sucesso.',
          variant: 'success',
        });
        router.push('/agenda');
      }}
      onCancel={() => router.back()}
    />
  );
}
