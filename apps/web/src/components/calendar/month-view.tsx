'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { cn, formatShortWeekDay } from '@/lib/utils';
import { useCalendarStore } from '@/store/calendar.store';
import type { Appointment } from '@/types';
import { hexToRgba } from '@/lib/utils';

const WEEKDAY_HEADERS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2024, 0, 1 + i); // Jan 1 2024 is Mon
  return formatShortWeekDay(d);
});

interface MonthViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date) => void;
}

export function MonthView({ appointments, onAppointmentClick, onSlotClick }: MonthViewProps) {
  const { currentDate } = useCalendarStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function getDayAppointments(day: Date) {
    return appointments.filter((a) =>
      isSameDay(parseISO(a.startTime), day),
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b bg-slate-50">
        {WEEKDAY_HEADERS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold text-slate-400 uppercase border-r last:border-r-0"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayAppts = getDayAppointments(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[100px] border-r border-b border-slate-100 p-1.5 cursor-pointer hover:bg-slate-50 transition-colors last:border-r-0',
                !isCurrentMonth && 'bg-slate-50/50',
              )}
              onClick={() => onSlotClick(day)}
            >
              {/* Day number */}
              <div className="flex justify-end mb-1">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    today
                      ? 'bg-[#f97316] text-white'
                      : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-300',
                  )}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Appointments (max 3 visible) */}
              <div className="space-y-0.5">
                {dayAppts.slice(0, 3).map((appt) => {
                  const color = appt.service?.color ?? '#f97316';
                  return (
                    <div
                      key={appt.id}
                      className="flex items-center gap-1 rounded px-1 py-0.5 text-[11px] font-medium truncate cursor-pointer hover:opacity-80"
                      style={{
                        background: hexToRgba(color, 0.15),
                        color,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(appt);
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: color }}
                      />
                      {appt.client?.name ?? 'Cliente'}
                    </div>
                  );
                })}
                {dayAppts.length > 3 && (
                  <div className="text-[10px] text-slate-400 pl-1">
                    +{dayAppts.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
