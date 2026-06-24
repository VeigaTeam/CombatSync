'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Package, Clock, DollarSign, Users } from 'lucide-react';
import { packagesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import type { Package as PackageType } from '@/types';

const MOCK_PACKAGES: PackageType[] = [
  {
    id: '1', clinicId: 'c1', name: '10 Aulas BJJ', description: 'Pacote de 10 aulas de BJJ Gi ou No-Gi',
    serviceId: 's1', totalSessions: 10, price: 850, validityDays: 90, isActive: true,
    createdAt: '', updatedAt: '',
    service: { name: 'BJJ Gi', color: '#3b82f6' } as never,
  },
  {
    id: '2', clinicId: 'c1', name: '5 Sessões Fisio', description: '5 sessões de fisioterapia',
    serviceId: 's2', totalSessions: 5, price: 750, validityDays: 60, isActive: true,
    createdAt: '', updatedAt: '',
    service: { name: 'Fisioterapia', color: '#10b981' } as never,
  },
  {
    id: '3', clinicId: 'c1', name: 'Mensal Muay Thai', description: 'Aulas ilimitadas de Muay Thai por 30 dias',
    serviceId: 's3', totalSessions: 20, price: 320, validityDays: 30, isActive: true,
    createdAt: '', updatedAt: '',
    service: { name: 'Muay Thai', color: '#f59e0b' } as never,
  },
];

export function PacotesContent() {
  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: packagesApi.list,
    staleTime: 5 * 60 * 1000,
  });

  const displayPackages = packages ?? MOCK_PACKAGES;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {displayPackages.length} pacote{displayPackages.length !== 1 ? 's' : ''} disponível{displayPackages.length !== 1 ? 'is' : ''}
        </p>
        <Button asChild>
          <Link href="/pacotes/novo">
            <Plus className="h-4 w-4" />
            Novo Pacote
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-3 w-full mb-1.5" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayPackages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Package className="h-4.5 w-4.5 text-[#f97316]" style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 leading-tight">{pkg.name}</h3>
                      {pkg.service && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{
                            background: `${pkg.service.color}20`,
                            color: pkg.service.color,
                          }}
                        >
                          {pkg.service.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={pkg.isActive ? 'success' : 'secondary'} className="text-[10px]">
                    {pkg.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                {pkg.description && (
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{pkg.description}</p>
                )}

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      {pkg.totalSessions} sessões
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {pkg.validityDays} dias
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {formatCurrency(pkg.price / pkg.totalSessions)}/sessão
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(pkg.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
