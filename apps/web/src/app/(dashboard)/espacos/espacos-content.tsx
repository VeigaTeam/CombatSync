'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, MoreVertical, Users, Pencil, Trash2 } from 'lucide-react';
import { spacesApi, getApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toaster';
import type { Space } from '@/types';

const spaceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  description: z.string().optional(),
  capacity: z.coerce.number().min(1, 'Capacidade mínima é 1'),
  color: z.string().min(1, 'Selecione uma cor'),
});

type SpaceFormValues = z.infer<typeof spaceSchema>;

const SPACE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

export function EspacosContent() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);

  const { data: spaces, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: spacesApi.list,
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Space>) => spacesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast({ title: 'Espaço criado!', variant: 'success' });
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: spacesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast({ title: 'Espaço excluído.', variant: 'success' });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceSchema),
    defaultValues: { capacity: 10, color: '#f97316' },
  });

  const selectedColor = watch('color');

  function openCreate() {
    reset({ capacity: 10, color: '#f97316' });
    setEditingSpace(null);
    setDialogOpen(true);
  }

  async function onSubmit(values: SpaceFormValues) {
    try {
      await createMutation.mutateAsync({ ...values, isActive: true });
    } catch (err) {
      toast({ title: getApiError(err), variant: 'destructive' });
    }
  }

  // Mock data for display
  const displaySpaces = spaces ?? [
    { id: '1', clinicId: 'c1', name: 'Tatame Principal', description: 'Sala principal de artes marciais', capacity: 20, color: '#f97316', isActive: true, createdAt: '', updatedAt: '' },
    { id: '2', clinicId: 'c1', name: 'Sala de Fisioterapia', description: 'Sala equipada para fisioterapia', capacity: 4, color: '#10b981', isActive: true, createdAt: '', updatedAt: '' },
    { id: '3', clinicId: 'c1', name: 'Sala Multiuso', description: 'Sala de yoga e pilates', capacity: 12, color: '#8b5cf6', isActive: true, createdAt: '', updatedAt: '' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {displaySpaces.length} espaço{displaySpaces.length !== 1 ? 's' : ''} cadastrado{displaySpaces.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Espaço
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
          {displaySpaces.map((space) => (
            <Card key={space.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-1.5" style={{ background: space.color }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-8 w-8 rounded-lg shrink-0"
                      style={{ background: `${space.color}20`, border: `2px solid ${space.color}` }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{space.name}</h3>
                      <Badge variant={space.isActive ? 'success' : 'secondary'} className="text-[10px]">
                        {space.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-700 p-0.5">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteMutation.mutate(space.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {space.description && (
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{space.description}</p>
                )}
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  <span>Capacidade: {space.capacity} pessoa{space.capacity !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSpace ? 'Editar Espaço' : 'Novo Espaço'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spaceName">Nome *</Label>
              <Input
                id="spaceName"
                placeholder="Ex: Tatame Principal"
                className={cn(errors.name && 'border-red-500')}
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="spaceDesc">Descrição</Label>
              <Textarea id="spaceDesc" className="resize-none" rows={2} {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spaceCapacity">Capacidade *</Label>
              <Input id="spaceCapacity" type="number" min={1} {...register('capacity')} />
              {errors.capacity && <p className="text-xs text-red-500">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center gap-2">
                {SPACE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue('color', color)}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-all',
                      selectedColor === color ? 'border-slate-900 scale-110' : 'border-transparent',
                    )}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                {editingSpace ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
