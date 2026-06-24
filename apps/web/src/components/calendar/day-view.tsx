'use client';

import React, { useRef, useEffect } from 'react';
import { parseISO, isSameDay, isToday } from 'date-fns';
import { cn, formatDate } from '@/lib/utils';
import { AppointmentCard } from './appointment-card';
import { useCalendarStore } from '@/store/calendar.store';
import type { Appointment } from '@/types';

const HOUR_START = 7;
const HOUR_END = 22;
const HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => i + HOUR_START,
);
const SLOT_HEIGHT = 64;

interface DayViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date) => void;
}

export function DayView({ appointments, onAppointmentClick, onSlotClick }: DayViewProps) {
  const { currentDate } = useCalendarStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = (8 - HOUR_START) * SLOT_HEIGHT;
    }
  }, []);

  const dayAppts = appointments.filter((a) =>
    isSameDay(parseISO(a.startTime), currentDate),
  );

  function getAppointmentStyle(appt: Appointment): React.CSSProperties {
    const start = parseISO(appt.startTime);
    const end = parseISO(appt.endTime);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const top = (startHour - HOUR_START) * SLOT_HEIGHT;
    const height = Math.max((endHour - startHour) * SLOT_HEIGHT - 4, 24);
    return { position: 'absolute', top, height, left: '4px', right: '4px', zIndex: 10 };
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Day header */}
      <div className="flex items-center justify-center border-b bg-slate-50 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold',
              isToday(currentDate)
                ? 'bg-[#f97316] text-white'
                : 'bg-slate-100 text-slate-700',
            )}
          >
            {currentDate.getDate()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 capitalize">
              {formatDate(currentDate, 'EEEE')}
            </p>
            <p className="text-xs text-slate-400">
              {dayAppts.length} agendamento{dayAppts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Time grid */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <div className="grid" style={{ gridTemplateColumns: '64px 1fr' }}>
          {HOURS.map((hour) => {
            const hourAppts = dayAppts.filter((a) => {
              const start = parseISO(a.startTime);
              return start.getHours() === hour;
            });

            return (
              <React.Fragment key={hour}>
                <div
                  className="border-r border-b border-slate-100 flex items-start justify-end pr-3 pt-1"
                  style={{ height: SLOT_HEIGHT }}
                >
                  <span className="text-[11px] font-medium text-slate-400 -translate-y-2">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>
                <div
                  className="relative border-b border-slate-100 cursor-pointer hover:bg-orange-50/30 transition-colors"
                  style={{ height: SLOT_HEIGHT }}
                  onClick={() => {
                    const slot = new Date(currentDate);
                    slot.setHours(hour, 0, 0, 0);
                    onSlotClick(slot);
                  }}
                >
                  {hourAppts.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      style={getAppointmentStyle(appt)}
                      onClick={onAppointmentClick}
                    />
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
