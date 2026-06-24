'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  ArrowLeft,
  Edit,
  Plus,
} from 'lucide-react';
import { clientsApi } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/appointments/status-badge';
import { formatDate, formatDateTime, formatCurrency, initials } from '@/lib/utils';
import type { Appointment, ClientPackage } from '@/types';

interface ClientDetailContentProps {
  clientId: string;
}

export function ClientDetailContent({ clientId }: ClientDetailContentProps) {
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => clientsApi.get(clientId),
  });

  const { data: stats } = useQuery({
    queryKey: ['clients', clientId, 'stats'],
    queryFn: () => clientsApi.getStats(clientId),
    enabled: !!client,
  });

  const { data: appointments } = useQuery({
    queryKey: ['clients', clientId, 'appointments'],
    queryFn: () => clientsApi.getAppointments(clientId),
    enabled: !!client,
  });

  const { data: packages } = useQuery({
    queryKey: ['clients', clientId, 'packages'],
    queryFn: () => clientsApi.getPackages(clientId),
    enabled: !!client,
  });

  if (clientLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Cliente não encontrado.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/clientes">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/clientes">
            <ArrowLeft className="h-4 w-4" />
            Clientes
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/agenda/novo?clientId=${clientId}`}>
              <Plus className="h-4 w-4" />
              Agendar
            </Link>
          </Button>
          <Button variant="outline" size="icon-sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={client.avatarUrl} />
          <AvatarFallback className="text-2xl font-bold">
            {initials(client.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">{client.name}</h2>
            <Badge variant={client.isActive ? 'success' : 'secondary'}>
              {client.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            {client.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {client.phone}
              </span>
            )}
            {client.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {client.email}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Cliente desde {formatDate(client.createdAt, "MMM 'de' yyyy")}
            </span>
          </div>
          {client.tags && client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {client.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total de Sessões', value: stats.totalAppointments },
            { label: 'Comparecimentos', value: stats.completedAppointments },
            { label: 'Cancelamentos', value: stats.cancelledAppointments },
            { label: 'Total Gasto', value: formatCurrency(stats.totalRevenue) },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent appointments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              Histórico de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!appointments || appointments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                Nenhum agendamento encontrado
              </p>
            ) : (
              <ul className="divide-y">
                {appointments.slice(0, 8).map((appt: Appointment) => (
                  <li key={appt.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {appt.service?.name ?? '—'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(appt.startTime)}
                      </p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Packages */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-400" />
                Pacotes Ativos
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href={`/pacotes?clientId=${clientId}`}>
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!packages || packages.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                Nenhum pacote ativo
              </p>
            ) : (
              <ul className="divide-y">
                {packages.map((pkg: ClientPackage) => (
                  <li key={pkg.id} className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">
                        {pkg.package?.name ?? 'Pacote'}
                      </p>
                      <Badge variant={pkg.isActive ? 'success' : 'secondary'}>
                        {pkg.isActive ? 'Ativo' : 'Expirado'}
                      </Badge>
                    </div>
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>
                          {pkg.usedSessions}/{pkg.totalSessions} sessões
                        </span>
                        <span>Expira {formatDate(pkg.expiryDate)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#f97316] rounded-full"
                          style={{
                            width: `${(pkg.usedSessions / pkg.totalSessions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
