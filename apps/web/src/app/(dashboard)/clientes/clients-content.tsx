'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, MoreVertical, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { clientsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { initials, formatDate } from '@/lib/utils';
import type { Client } from '@/types';

// Mock data for display
const MOCK_CLIENTS: Client[] = [
  {
    id: '1', clinicId: 'c1', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-1111',
    isActive: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z',
    tags: ['BJJ', 'Fisioterapia'],
  },
  {
    id: '2', clinicId: 'c1', name: 'Bruno Mendes', email: 'bruno@email.com', phone: '(11) 99999-2222',
    isActive: true, createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z',
    tags: ['Muay Thai'],
  },
  {
    id: '3', clinicId: 'c1', name: 'Carla Ferreira', email: 'carla@email.com', phone: '(11) 99999-3333',
    isActive: true, createdAt: '2024-03-05T00:00:00Z', updatedAt: '2024-03-05T00:00:00Z',
    tags: ['Yoga'],
  },
  {
    id: '4', clinicId: 'c1', name: 'Daniel Souza', email: 'daniel@email.com', phone: '(11) 99999-4444',
    isActive: false, createdAt: '2023-11-20T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    tags: ['Personal'],
  },
  {
    id: '5', clinicId: 'c1', name: 'Elena Ramos', email: 'elena@email.com', phone: '(11) 99999-5555',
    isActive: true, createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-04-01T00:00:00Z',
    tags: ['BJJ'],
  },
];

export function ClientsContent() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['clients', { search }],
    queryFn: () => clientsApi.list({ search, limit: 50 }),
    staleTime: 2 * 60 * 1000,
  });

  const clients = data?.data ?? MOCK_CLIENTS;
  const filtered = search
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search),
      )
    : clients;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button asChild className="sm:ml-auto">
          <Link href="/clientes/novo">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      {/* Client count */}
      <p className="text-sm text-slate-500">
        {filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Clients grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <p className="text-base font-medium">Nenhum cliente encontrado</p>
          <p className="text-sm mt-1">Tente outra busca ou cadastre um novo cliente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={client.avatarUrl} />
            <AvatarFallback className="text-sm font-medium">
              {initials(client.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/clientes/${client.id}`}
                className="font-semibold text-slate-900 hover:text-[#f97316] truncate leading-tight"
              >
                {client.name}
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <Badge variant={client.isActive ? 'success' : 'secondary'} className="text-[10px]">
                  {client.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-slate-400 hover:text-slate-700 p-0.5 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/clientes/${client.id}`}>Ver perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/agenda/novo?clientId=${client.id}`}>Agendar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Desativar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {client.phone && (
              <div className="flex items-center gap-1.5 mt-1">
                <Phone className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-500">{client.phone}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-500 truncate">{client.email}</span>
              </div>
            )}

            {client.tags && client.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[10px] text-slate-400 mt-2">
              Cliente desde {formatDate(client.createdAt, 'MMM yyyy')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
