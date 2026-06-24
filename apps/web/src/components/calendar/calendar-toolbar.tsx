'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/store/calendar.store';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { CalendarView } from '@/types';

const VIEW_LABELS: Record<CalendarView, string> = {
  day: 'Dia',
  week: 'Semana',
  month: 'Mês',
};

export function CalendarToolbar() {
  const { view, currentDate, setView, navigatePrev, navigateNext, navigateToday } =
    useCalendarStore();

  function getTitle(): string {
    if (view === 'day') {
      return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
    if (view === 'week') {
      const end = addDays(currentDate, 6);
      const startStr = format(currentDate, 'd MMM', { locale: ptBR });
      const endStr = format(end, 'd MMM yyyy', { locale: ptBR });
      return `${startStr} – ${endStr}`;
    }
    return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToday}
          className="hidden sm:flex"
        >
          Hoje
        </Button>
        <Button variant="outline" size="icon-sm" onClick={navigatePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon-sm" onClick={navigateNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold text-slate-900 capitalize ml-1">
          {getTitle()}
        </h2>
      </div>

      {/* View switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {(Object.entries(VIEW_LABELS) as [CalendarView, string][]).map(
          ([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                view === v
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
