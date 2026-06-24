import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessHoursDto } from './dto/create-business-hours.dto';
import { CreateBlockDto } from './dto/create-block.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  // Business Hours
  upsertBusinessHours(dto: CreateBusinessHoursDto) {
    return this.prisma.businessHours.upsert({
      where: { dayOfWeek_openTime: { dayOfWeek: dto.dayOfWeek, openTime: dto.openTime } },
      create: dto,
      update: { closeTime: dto.closeTime, isActive: dto.isActive ?? true },
    });
  }

  findBusinessHours() {
    return this.prisma.businessHours.findMany({
      orderBy: [{ dayOfWeek: 'asc' }, { openTime: 'asc' }],
    });
  }

  // Schedule Blocks
  createBlock(dto: CreateBlockDto, createdById: string) {
    return this.prisma.scheduleBlock.create({
      data: {
        professionalId: dto.professionalId,
        spaceId: dto.spaceId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        reason: dto.reason,
        createdById,
      },
    });
  }

  findBlocks(filters: { professionalId?: string; spaceId?: string; from?: string; to?: string }) {
    return this.prisma.scheduleBlock.findMany({
      where: {
        ...(filters.professionalId && { professionalId: filters.professionalId }),
        ...(filters.spaceId && { spaceId: filters.spaceId }),
        ...(filters.from || filters.to
          ? {
              startTime: {
                ...(filters.from && { gte: new Date(filters.from) }),
                ...(filters.to && { lte: new Date(filters.to) }),
              },
            }
          : {}),
      },
      include: {
        professional: { select: { id: true, name: true } },
        space: { select: { id: true, name: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  deleteBlock(id: string) {
    return this.prisma.scheduleBlock.delete({ where: { id } });
  }

  // Returns available time slots for a given date/service
  async getAvailableSlots(date: string, serviceId: string, professionalId: string, spaceId: string) {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return [];

    const d = new Date(date);
    const dayOfWeek = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'][d.getDay()];
    const hours = await this.prisma.businessHours.findMany({
      where: { dayOfWeek: dayOfWeek as any, isActive: true },
    });
    if (!hours.length) return [];

    const appointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        startTime: { gte: new Date(`${date}T00:00:00`), lt: new Date(`${date}T23:59:59`) },
      },
    });

    const blocks = await this.prisma.scheduleBlock.findMany({
      where: {
        OR: [{ professionalId }, { spaceId }],
        startTime: { lt: new Date(`${date}T23:59:59`) },
        endTime: { gt: new Date(`${date}T00:00:00`) },
      },
    });

    const slots: string[] = [];
    const duration = service.durationMinutes + service.bufferMinutes;

    for (const period of hours) {
      const [openH, openM] = period.openTime.split(':').map(Number);
      const [closeH, closeM] = period.closeTime.split(':').map(Number);
      let current = new Date(d);
      current.setHours(openH, openM, 0, 0);
      const close = new Date(d);
      close.setHours(closeH, closeM, 0, 0);

      while (current < close) {
        const slotEnd = new Date(current.getTime() + duration * 60000);
        if (slotEnd > close) break;

        const hasConflict = [
          ...appointments.map(a => ({ s: a.startTime, e: a.endTime })),
          ...blocks.map(b => ({ s: b.startTime, e: b.endTime })),
        ].some(({ s, e }) => current < e && slotEnd > s);

        if (!hasConflict) {
          slots.push(current.toISOString());
        }
        current = new Date(current.getTime() + 30 * 60000); // 30 min step
      }
    }

    return slots;
  }
}
