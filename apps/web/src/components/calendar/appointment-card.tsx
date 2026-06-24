'use client';

import { useDraggable } from '@dnd-kit/core';
import { cn, formatTime, hexToRgba } from '@/lib/utils';
import type { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  style?: React.CSSProperties;
  onClick?: (appointment: Appointment) => void;
  isDragging?: boolean;
}

export function AppointmentCard({
  appointment,
  style,
  onClick,
  isDragging,
}: AppointmentCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: appointment.id,
    data: { appointment },
  });

  const color = appointment.service?.color ?? '#f97316';
  const bgColor = hexToRgba(color, 0.15);
  const borderColor = hexToRgba(color, 0.5);

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        opacity: 0.9,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        ...dragStyle,
        background: bgColor,
        borderLeft: `3px solid ${color}`,
      }}
      className={cn(
        'appointment-block',
        isDragging && 'shadow-xl ring-2 ring-white',
      )}
      onClick={() => onClick?.(appointment)}
      title={`${appointment.client?.name} — ${appointment.service?.name}`}
    >
      <p
        className="font-semibold truncate leading-tight"
        style={{ color }}
      >
        {appointment.client?.name ?? 'Cliente'}
      </p>
      <p className="text-slate-600 truncate text-[10px] mt-0.5 leading-tight">
        {appointment.service?.name}
      </p>
      <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">
        {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
      </p>
    </div>
  );
}
