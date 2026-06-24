'use client';

import React, { useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { addDays, isSameDay, parseISO, isToday } from 'date-fns';
import { cn, formatShortWeekDay } from '@/lib/utils';
import { AppointmentCard } from './appointment-card';
import { useCalendarStore } from '@/store/calendar.store';
import type { Appointment } from '@/types';

const HOUR_START = 7;
const HOUR_END = 22;
const HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => i + HOUR_START,
);
const SLOT_HEIGHT = 60; // px per hour

interface WeekViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date) => void;
}

function DroppableSlot({
  date,
  hour,
  children,
  onClick,
}: {
  date: Date;
  hour: number;
  children?: React.ReactNode;
  onClick: (date: Date) => void;
}) {
  const slotDate = new Date(date);
  slotDate.setHours(hour, 0, 0, 0);

  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slotDate.toISOString()}`,
    data: { date: slotDate },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative border-b border-slate-100 cursor-pointer transition-colors',
        isOver && 'bg-orange-50',
      )}
      style={{ height: SLOT_HEIGHT }}
      onClick={() => onClick(slotDate)}
    >
      {children}
    </div>
  );
}

export function WeekView({ appointments, onAppointmentClick, onSlotClick }: WeekViewProps) {
  const { currentDate } = useCalendarStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 7 days starting from currentDate (Mon-Sun)
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentDate, i));

  // Scroll to 8am on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = (8 - HOUR_START) * SLOT_HEIGHT;
    }
  }, []);

  // Helper: position appointment block within the column
  function getAppointmentStyle(appt: Appointment): React.CSSProperties {
    const start = parseISO(appt.startTime);
    const end = parseISO(appt.endTime);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const top = (startHour - HOUR_START) * SLOT_HEIGHT;
    const height = Math.max((endHour - startHour) * SLOT_HEIGHT - 2, 20);
    return {
      position: 'absolute',
      top,
      height,
      left: '2px',
      right: '2px',
      zIndex: 10,
    };
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Day headers */}
      <div className="grid border-b bg-slate-50" style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}>
        <div className="border-r" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              'flex flex-col items-center justify-center py-3 border-r text-sm last:border-r-0',
              isToday(day) && 'bg-orange-50',
            )}
          >
            <span className="text-xs font-medium text-slate-400 uppercase">
              {formatShortWeekDay(day)}
            </span>
            <span
              className={cn(
                'mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                isToday(day)
                  ? 'bg-[#f97316] text-white'
                  : 'text-slate-700',
              )}
            >
              {day.getDate()}
            </span>
          </div>
        ))}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        <div className="grid" style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}>
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              {/* Hour label */}
              <div
                className="border-r border-b border-slate-100 flex items-start justify-end pr-3 pt-1"
                style={{ height: SLOT_HEIGHT }}
              >
                <span className="text-[11px] font-medium text-slate-400 -translate-y-2">
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>

              {/* Day columns */}
              {days.map((day) => {
                // Find appointments for this day and hour
                const dayAppts = appointments.filter((a) => {
                  const start = parseISO(a.startTime);
                  return isSameDay(start, day) && start.getHours() === hour;
                });

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'relative border-r border-b border-slate-100 last:border-r-0',
                      isToday(day) && 'bg-orange-50/30',
                    )}
                    style={{ height: SLOT_HEIGHT }}
                    onClick={() => {
                      const slotDate = new Date(day);
                      slotDate.setHours(hour, 0, 0, 0);
                      onSlotClick(slotDate);
                    }}
                  >
                    {dayAppts.map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        style={getAppointmentStyle(appt)}
                        onClick={onAppointmentClick}
                      />
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
