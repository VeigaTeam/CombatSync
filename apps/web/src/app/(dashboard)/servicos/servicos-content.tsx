'use client';

import Link from 'next/link';
import { Plus, Clock, DollarSign, MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useServices, useDeleteService } from '@/hooks/use-services';
import { formatCurrency } from '@/lib/utils';
import { SERVICE_CATEGORY_LABELS } from '@/types';
import { hexToRgba } from '@/lib/utils';
import { toast } from '@/components/ui/toaster';

export function ServicosContent() {
  const { data: services, isLoading } = useServices();
  const deleteMutation = useDeleteService();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deseja realmente excluir o serviço "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Serviço excluído', variant: 'success' });
    } catch {
      toast({ title: 'Erro ao excluir serviço', variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {services?.length ?? 0} serviço{(services?.length ?? 0) !== 1 ? 's' : ''} cadastrado{(services?.length ?? 0) !== 1 ? 's' : ''}
        </p>
        <Button asChild>
          <Link href="/servicos/novo">
            <Plus className="h-4 w-4" />
            Novo Serviço
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-3 w-full mb-1.5" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !services?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <p className="text-base font-medium">Nenhum serviço cadastrado</p>
          <p className="text-sm mt-1">Crie seu primeiro serviço para começar a agendar</p>
          <Button asChild className="mt-4">
            <Link href="/servicos/novo">
              <Plus className="h-4 w-4" />
              Criar Serviço
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow overflow-hidden">
              {/* Color strip */}
              <div
                className="h-1"
                style={{ background: service.color }}
              />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: service.color }}
                    >
                      {service.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 leading-tight">
                        {service.name}
                      </h3>
                      <Badge variant="secondary" className="text-[10px] mt-0.5">
                        {SERVICE_CATEGORY_LABELS[service.category]}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-700 p-0.5 rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/servicos/${service.id}/editar`}>Editar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(service.id, service.name)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {service.description && (
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {service.durationMinutes}min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {service.maxCapacity}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(service.price)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Badge variant={service.isActive ? 'success' : 'secondary'} className="text-[10px]">
                    {service.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
