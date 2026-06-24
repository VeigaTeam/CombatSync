import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async send(userId: string, type: string, title: string, body: string, appointmentId?: string) {
    return this.prisma.notification.create({
      data: { userId, type, title, body, appointmentId },
    });
  }

  async sendAppointmentConfirmed(appointmentId: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        service: true,
        professional: true,
      },
    });
    if (!appt) return;

    const dateStr = appt.startTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    await this.send(
      appt.clientId,
      'APPOINTMENT_CONFIRMED',
      'Agendamento Confirmado',
      `Seu agendamento de ${appt.service.name} com ${appt.professional.name} foi confirmado para ${dateStr}.`,
      appointmentId,
    );
  }

  async sendReminder24h(appointmentId: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true, service: true },
    });
    if (!appt) return;

    await this.send(
      appt.clientId,
      'REMINDER_24H',
      'Lembrete de Consulta',
      `Lembrete: você tem ${appt.service.name} amanhã às ${appt.startTime.toLocaleTimeString('pt-BR')}.`,
      appointmentId,
    );
  }

  findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
  }

  markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  markAllRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  }
}
