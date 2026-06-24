'use client';

import { formatTime, initials } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/appointments/status-badge';
import type { Appointment } from '@/types';

interface AppointmentsTodayProps {
  appointments?: Appointment[];
  isLoading?: boolean;
}

// Mock appointments for display
const MOCK_APPOINTMENTS: Partial<Appointment>[] = [
  {
    id: '1',
    startTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T07:00'),
    endTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T08:00'),
    status: 'completed',
    client: { name: 'Ana Costa', phone: '' } as never,
    service: { name: 'BJJ Gi', color: '#3b82f6' } as never,
  },
  {
    id: '2',
    startTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T09:00'),
    endTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T10:00'),
    status: 'confirmed',
    client: { name: 'Bruno Mendes', phone: '' } as never,
    service: { name: 'Fisioterapia', color: '#10b981' } as never,
  },
  {
    id: '3',
    startTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T11:00'),
    endTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T12:00'),
    status: 'scheduled',
    client: { name: 'Carla Ferreira', phone: '' } as never,
    service: { name: 'Muay Thai', color: '#f59e0b' } as never,
  },
  {
    id: '4',
    startTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T14:00'),
    endTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T15:00'),
    status: 'scheduled',
    client: { name: 'Daniel Souza', phone: '' } as never,
    service: { name: 'Personal', color: '#8b5cf6' } as never,
  },
  {
    id: '5',
    startTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T16:00'),
    endTime: new Date(Date.now()).toISOString().replace(/T\d+:\d+/, 'T17:00'),
    status: 'cancelled',
    client: { name: 'Elena Ramos', phone: '' } as never,
    service: { name: 'Yoga', color: '#ec4899' } as never,
  },
];

export function AppointmentsToday({ appointments, isLoading }: AppointmentsTodayProps) {
  const list = (appointments ?? MOCK_APPOINTMENTS) as Appointment[];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Agendamentos de Hoje
          </CardTitle>
          <span className="text-xs text-slate-400 font-medium">
            {list.length} no total
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 px-6 pb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <p className="text-sm">Nenhum agendamento para hoje</p>
          </div>
        ) : (
          <ul className="divide-y">
            {list.map((appt) => (
              <li
                key={appt.id}
                className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors"
              >
                {/* Time */}
                <div className="w-12 shrink-0 text-right">
                  <span className="text-xs font-semibold text-slate-500">
                    {formatTime(appt.startTime)}
                  </span>
                </div>

                {/* Service color dot */}
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: appt.service?.color ?? '#f97316' }}
                />

                {/* Client avatar */}
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={appt.client?.avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {appt.client ? initials(appt.client.name) : '??'}
                  </AvatarFallback>
                </Avatar>

                {/* Client + service */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {appt.client?.name ?? '—'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {appt.service?.name ?? '—'}
                  </p>
                </div>

                {/* Status */}
                <StatusBadge status={appt.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
