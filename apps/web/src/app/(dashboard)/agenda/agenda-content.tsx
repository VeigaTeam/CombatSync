'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { CalendarToolbar } from '@/components/calendar/calendar-toolbar';
import { WeekView } from '@/components/calendar/week-view';
import { DayView } from '@/components/calendar/day-view';
import { MonthView } from '@/components/calendar/month-view';
import { AppointmentDetailModal } from '@/components/appointments/appointment-detail-modal';
import { useCalendarStore } from '@/store/calendar.store';
import { useAppointments, useUpdateAppointment } from '@/hooks/use-appointments';
import type { Appointment } from '@/types';
import { toast } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function AgendaContent() {
  const { view, currentDate, openDetailModal, closeDetailModal, selectedAppointmentId, isDetailModalOpen } =
    useCalendarStore();
  const [activeAppt, setActiveAppt] = useState<Appointment | null>(null);

  // Build date range for the query based on current view
  const dateRange = (() => {
    if (view === 'day') {
      return {
        startDate: format(currentDate, 'yyyy-MM-dd'),
        endDate: format(currentDate, 'yyyy-MM-dd'),
      };
    }
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      return {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(addDays(start, 6), 'yyyy-MM-dd'),
      };
    }
    return {
      startDate: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
    };
  })();

  const { data: appointments = [], isLoading } = useAppointments(dateRange);
  const updateMutation = useUpdateAppointment();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const appt = event.active.data.current?.appointment as Appointment;
    setActiveAppt(appt ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveAppt(null);
    const { active, over } = event;
    if (!over || !active.data.current?.appointment) return;

    const appt = active.data.current.appointment as Appointment;
    const newSlotDate: Date | undefined = over.data.current?.date;
    if (!newSlotDate) return;

    try {
      await updateMutation.mutateAsync({
        id: appt.id,
        data: { startTime: newSlotDate.toISOString() },
      });
      toast({
        title: 'Agendamento movido',
        description: `Movido para ${format(newSlotDate, "dd/MM 'às' HH:mm")}`,
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Erro ao mover agendamento',
        variant: 'destructive',
      });
    }
  }

  function handleSlotClick(date: Date) {
    // Could open quick-create modal
    // For now navigate to the form
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CalendarToolbar />
        <Button asChild size="sm" className="ml-4">
          <Link href="/agenda/novo">
            <Plus className="h-4 w-4" />
            Novo
          </Link>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-96 rounded-xl border bg-white">
            <div className="text-center text-slate-400">
              <div className="animate-spin h-8 w-8 border-2 border-[#f97316] border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm">Carregando agenda...</p>
            </div>
          </div>
        ) : (
          <>
            {view === 'week' && (
              <WeekView
                appointments={appointments}
                onAppointmentClick={(a) => openDetailModal(a.id)}
                onSlotClick={handleSlotClick}
              />
            )}
            {view === 'day' && (
              <DayView
                appointments={appointments}
                onAppointmentClick={(a) => openDetailModal(a.id)}
                onSlotClick={handleSlotClick}
              />
            )}
            {view === 'month' && (
              <MonthView
                appointments={appointments}
                onAppointmentClick={(a) => openDetailModal(a.id)}
                onSlotClick={handleSlotClick}
              />
            )}
          </>
        )}
      </DndContext>

      <AppointmentDetailModal
        appointmentId={selectedAppointmentId}
        open={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </div>
  );
}
