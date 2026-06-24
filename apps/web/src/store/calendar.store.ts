import { create } from 'zustand';
import { startOfWeek, startOfDay } from 'date-fns';
import type { CalendarView, Appointment } from '@/types';

interface CalendarState {
  view: CalendarView;
  currentDate: Date;
  selectedDate: Date | null;
  selectedAppointmentId: string | null;
  isDetailModalOpen: boolean;
  isCreateModalOpen: boolean;
  createSlotStart: Date | null;

  setView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  navigatePrev: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  selectDate: (date: Date | null) => void;
  openDetailModal: (appointmentId: string) => void;
  closeDetailModal: () => void;
  openCreateModal: (slotStart?: Date) => void;
  closeCreateModal: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  view: 'week',
  currentDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
  selectedDate: null,
  selectedAppointmentId: null,
  isDetailModalOpen: false,
  isCreateModalOpen: false,
  createSlotStart: null,

  setView: (view) => {
    const { currentDate } = get();
    const base =
      view === 'week'
        ? startOfWeek(currentDate, { weekStartsOn: 1 })
        : startOfDay(currentDate);
    set({ view, currentDate: base });
  },

  setCurrentDate: (date) => set({ currentDate: date }),

  navigatePrev: () => {
    const { view, currentDate } = get();
    const delta = view === 'day' ? 1 : view === 'week' ? 7 : 30;
    const next = new Date(currentDate);
    next.setDate(next.getDate() - delta);
    set({ currentDate: next });
  },

  navigateNext: () => {
    const { view, currentDate } = get();
    const delta = view === 'day' ? 1 : view === 'week' ? 7 : 30;
    const next = new Date(currentDate);
    next.setDate(next.getDate() + delta);
    set({ currentDate: next });
  },

  navigateToday: () => {
    const { view } = get();
    const today = new Date();
    const base =
      view === 'week'
        ? startOfWeek(today, { weekStartsOn: 1 })
        : startOfDay(today);
    set({ currentDate: base });
  },

  selectDate: (date) => set({ selectedDate: date }),

  openDetailModal: (appointmentId) =>
    set({ selectedAppointmentId: appointmentId, isDetailModalOpen: true }),

  closeDetailModal: () =>
    set({ selectedAppointmentId: null, isDetailModalOpen: false }),

  openCreateModal: (slotStart) =>
    set({ createSlotStart: slotStart ?? null, isCreateModalOpen: true }),

  closeCreateModal: () =>
    set({ createSlotStart: null, isCreateModalOpen: false }),
}));
