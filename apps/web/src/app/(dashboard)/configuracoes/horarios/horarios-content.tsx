'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { settingsApi } from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import type { BusinessHours } from '@/types';
import { cn } from '@/lib/utils';

const DAYS = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado',
];

const DEFAULT_HOURS: BusinessHours[] = DAYS.map((_, i) => ({
  dayOfWeek: i,
  isOpen: i >= 1 && i <= 6,
  openTime: '07:00',
  closeTime: '22:00',
}));

export function HorariosContent() {
  const queryClient = useQueryClient();

  const { data: savedHours } = useQuery({
    queryKey: ['settings', 'business-hours'],
    queryFn: settingsApi.getBusinessHours,
  });

  const [hours, setHours] = useState<BusinessHours[]>(
    savedHours ?? DEFAULT_HOURS,
  );

  const saveMutation = useMutation({
    mutationFn: (h: BusinessHours[]) => settingsApi.updateBusinessHours(h),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'business-hours'] });
      toast({ title: 'Horários salvos com sucesso!', variant: 'success' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar horários', variant: 'destructive' });
    },
  });

  function toggleDay(dayOfWeek: number) {
    setHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, isOpen: !h.isOpen } : h,
      ),
    );
  }

  function updateTime(dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) {
    setHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h,
      ),
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/configuracoes">
          <ArrowLeft className="h-4 w-4" />
          Configurações
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Horários de Funcionamento</CardTitle>
          <CardDescription>
            Configure os dias e horários de atendimento da sua academia
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {hours.map((h, idx) => (
            <div key={h.dayOfWeek}>
              <div className="flex items-center gap-4 px-6 py-4">
                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggleDay(h.dayOfWeek)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0',
                    h.isOpen ? 'bg-[#f97316]' : 'bg-slate-200',
                  )}
                  aria-checked={h.isOpen}
                  role="switch"
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                      h.isOpen ? 'translate-x-6' : 'translate-x-1',
                    )}
                  />
                </button>

                {/* Day name */}
                <span
                  className={cn(
                    'w-36 text-sm font-medium shrink-0',
                    h.isOpen ? 'text-slate-900' : 'text-slate-400',
                  )}
                >
                  {DAYS[h.dayOfWeek]}
                </span>

                {/* Time inputs */}
                {h.isOpen ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={h.openTime}
                      onChange={(e) => updateTime(h.dayOfWeek, 'openTime', e.target.value)}
                      className="h-8 text-sm w-28"
                    />
                    <span className="text-slate-400 text-sm">até</span>
                    <Input
                      type="time"
                      value={h.closeTime}
                      onChange={(e) => updateTime(h.dayOfWeek, 'closeTime', e.target.value)}
                      className="h-8 text-sm w-28"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 flex-1">Fechado</span>
                )}
              </div>
              {idx < hours.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => saveMutation.mutate(hours)}
          isLoading={saveMutation.isPending}
        >
          <Save className="h-4 w-4" />
          Salvar Horários
        </Button>
      </div>
    </div>
  );
}
