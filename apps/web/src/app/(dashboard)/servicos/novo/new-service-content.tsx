'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateService } from '@/hooks/use-services';
import { getApiError } from '@/lib/api';
import { SERVICE_CATEGORY_LABELS, type ServiceCategory } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toaster';

const SERVICE_COLORS = [
  '#f97316', '#3b82f6', '#10b981', '#8b5cf6',
  '#f59e0b', '#ec4899', '#14b8a6', '#ef4444',
];

const serviceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(15, 'Mín. 15 minutos').max(480),
  price: z.coerce.number().min(0, 'Valor não pode ser negativo'),
  maxCapacity: z.coerce.number().min(1, 'Capacidade mínima é 1').max(100),
  category: z.string().min(1, 'Selecione uma categoria'),
  color: z.string().min(1, 'Selecione uma cor'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export function NewServiceContent() {
  const router = useRouter();
  const createMutation = useCreateService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      durationMinutes: 60,
      price: 0,
      maxCapacity: 1,
      color: '#f97316',
    },
  });

  const selectedColor = watch('color');

  async function onSubmit(values: ServiceFormValues) {
    try {
      await createMutation.mutateAsync({
        ...values,
        category: values.category as ServiceCategory,
        isActive: true,
      });
      toast({ title: 'Serviço criado com sucesso!', variant: 'success' });
      router.push('/servicos');
    } catch (err) {
      toast({ title: 'Erro ao criar serviço', description: getApiError(err), variant: 'destructive' });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/servicos">
          <ArrowLeft className="h-4 w-4" />
          Serviços
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Novo Serviço</CardTitle>
          <CardDescription>
            Cadastre um novo serviço ou modalidade oferecida pela sua academia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                placeholder="Ex: BJJ Gi, Fisioterapia, Muay Thai..."
                className={cn(errors.name && 'border-red-500')}
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o serviço..."
                className="resize-none"
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select onValueChange={(v) => setValue('category', v)}>
                <SelectTrigger className={cn(errors.category && 'border-red-500')}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(SERVICE_CATEGORY_LABELS) as [ServiceCategory, string][]).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duração (min) *</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min={15}
                  max={480}
                  step={15}
                  className={cn(errors.durationMinutes && 'border-red-500')}
                  {...register('durationMinutes')}
                />
                {errors.durationMinutes && <p className="text-xs text-red-500">{errors.durationMinutes.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Valor (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0,00"
                  className={cn(errors.price && 'border-red-500')}
                  {...register('price')}
                />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Capacidade *</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min={1}
                  max={100}
                  className={cn(errors.maxCapacity && 'border-red-500')}
                  {...register('maxCapacity')}
                />
                {errors.maxCapacity && <p className="text-xs text-red-500">{errors.maxCapacity.message}</p>}
              </div>
            </div>

            {/* Color picker */}
            <div className="space-y-2">
              <Label>Cor do Serviço *</Label>
              <div className="flex items-center gap-2 flex-wrap">
                {SERVICE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue('color', color)}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-all',
                      selectedColor === color
                        ? 'border-slate-900 scale-110'
                        : 'border-transparent hover:scale-105',
                    )}
                    style={{ background: color }}
                    title={color}
                  />
                ))}
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setValue('color', e.target.value)}
                  className="h-8 w-16 cursor-pointer"
                  title="Cor personalizada"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Criar Serviço
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
