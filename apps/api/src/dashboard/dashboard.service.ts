import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const today = new Date();
    const startDay = startOfDay(today);
    const endDay = endOfDay(today);
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);

    const [
      todayAppointments,
      todayConfirmed,
      todayCancelled,
      monthAppointments,
      monthCompleted,
      monthRevenue,
      activeClients,
    ] = await Promise.all([
      this.prisma.appointment.count({ where: { startTime: { gte: startDay, lte: endDay } } }),
      this.prisma.appointment.count({ where: { startTime: { gte: startDay, lte: endDay }, status: 'CONFIRMED' } }),
      this.prisma.appointment.count({ where: { startTime: { gte: startDay, lte: endDay }, status: 'CANCELLED' } }),
      this.prisma.appointment.count({ where: { startTime: { gte: startMonth, lte: endMonth } } }),
      this.prisma.appointment.count({ where: { startTime: { gte: startMonth, lte: endMonth }, status: 'COMPLETED' } }),
      this.prisma.payment.aggregate({
        where: { status: { in: ['PAID', 'PARTIAL'] }, paidAt: { gte: startMonth, lte: endMonth } },
        _sum: { amountPaid: true },
      }),
      this.prisma.user.count({ where: { role: 'CLIENT', isActive: true } }),
    ]);

    const attendanceRate = monthAppointments > 0
      ? Math.round((monthCompleted / monthAppointments) * 100)
      : 0;

    return {
      today: { total: todayAppointments, confirmed: todayConfirmed, cancelled: todayCancelled },
      month: {
        appointments: monthAppointments,
        completed: monthCompleted,
        revenue: Number(monthRevenue._sum.amountPaid ?? 0),
        attendanceRate,
      },
      activeClients,
    };
  }

  async getTodayAppointments() {
    const today = new Date();
    return this.prisma.appointment.findMany({
      where: { startTime: { gte: startOfDay(today), lte: endOfDay(today) } },
      include: {
        service: { select: { name: true, color: true, durationMinutes: true } },
        professional: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, phone: true } },
        payment: { select: { status: true, amount: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getRevenueChart(year: number) {
    const data: { month: number; revenue: number; appointments: number }[] = [];
    for (let month = 0; month < 12; month++) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59);
      const [revenue, count] = await Promise.all([
        this.prisma.payment.aggregate({
          where: { status: { in: ['PAID', 'PARTIAL'] }, paidAt: { gte: start, lte: end } },
          _sum: { amountPaid: true },
        }),
        this.prisma.appointment.count({
          where: { startTime: { gte: start, lte: end }, status: 'COMPLETED' },
        }),
      ]);
      data.push({
        month: month + 1,
        revenue: Number(revenue._sum.amountPaid ?? 0),
        appointments: count,
      });
    }
    return data;
  }

  async getTopServices(startDate: string, endDate: string) {
    return this.prisma.appointment.groupBy({
      by: ['serviceId'],
      where: {
        startTime: { gte: new Date(startDate), lte: new Date(endDate) },
        status: 'COMPLETED',
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });
  }
}
