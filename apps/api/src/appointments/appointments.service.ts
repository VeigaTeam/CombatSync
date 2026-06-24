import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AppointmentStatus } from '@prisma/client';
import { addMinutes } from 'date-fns';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto, createdById: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service) throw new NotFoundException('Serviço não encontrado');

    const startTime = new Date(dto.startTime);
    const endTime = addMinutes(startTime, service.durationMinutes + service.bufferMinutes);

    // Check professional availability
    await this.assertNoProfessionalConflict(dto.professionalId, startTime, endTime);

    // Check space availability
    await this.assertNoSpaceConflict(dto.spaceId, startTime, endTime);

    // Check schedule blocks
    await this.assertNoScheduleBlock(dto.professionalId, dto.spaceId, startTime, endTime);

    const appointment = await this.prisma.appointment.create({
      data: {
        serviceId: dto.serviceId,
        spaceId: dto.spaceId,
        professionalId: dto.professionalId,
        clientId: dto.clientId,
        startTime,
        endTime,
        notes: dto.notes,
        packagePurchaseId: dto.packagePurchaseId,
        statusHistory: {
          create: {
            status: 'SCHEDULED',
            changedById: createdById,
          },
        },
      },
      include: {
        service: true,
        space: true,
        professional: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, phone: true } },
      },
    });

    // Create payment record if no package
    if (!dto.packagePurchaseId) {
      await this.prisma.payment.create({
        data: {
          appointmentId: appointment.id,
          clientId: dto.clientId,
          amount: service.price,
        },
      });
    }

    return appointment;
  }

  async findAll(filters: {
    startDate?: string;
    endDate?: string;
    professionalId?: string;
    clientId?: string;
    status?: AppointmentStatus;
    spaceId?: string;
  }) {
    return this.prisma.appointment.findMany({
      where: {
        ...(filters.professionalId && { professionalId: filters.professionalId }),
        ...(filters.clientId && { clientId: filters.clientId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.spaceId && { spaceId: filters.spaceId }),
        ...(filters.startDate || filters.endDate
          ? {
              startTime: {
                ...(filters.startDate && { gte: new Date(filters.startDate) }),
                ...(filters.endDate && { lte: new Date(filters.endDate) }),
              },
            }
          : {}),
      },
      include: {
        service: { select: { id: true, name: true, color: true, durationMinutes: true } },
        space: { select: { id: true, name: true } },
        professional: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, phone: true } },
        payment: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
        space: true,
        professional: { select: { id: true, name: true, email: true } },
        client: { select: { id: true, name: true, email: true, phone: true } },
        statusHistory: {
          include: { changedBy: { select: { id: true, name: true } } },
          orderBy: { changedAt: 'asc' },
        },
        payment: true,
      },
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado');
    return appointment;
  }

  async updateStatus(id: string, dto: UpdateAppointmentStatusDto, changedById: string) {
    const appointment = await this.findOne(id);

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
        statusHistory: {
          create: {
            status: dto.status,
            changedById,
            notes: dto.notes,
          },
        },
      },
    });
  }

  async cancel(id: string, userId: string, reason?: string) {
    return this.updateStatus(
      id,
      { status: AppointmentStatus.CANCELLED, notes: reason },
      userId,
    );
  }

  private async assertNoProfessionalConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string,
  ) {
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        professionalId,
        id: excludeId ? { not: excludeId } : undefined,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });
    if (conflict) throw new BadRequestException('Profissional já possui agendamento neste horário');
  }

  private async assertNoSpaceConflict(
    spaceId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string,
  ) {
    const space = await this.prisma.space.findUnique({ where: { id: spaceId } });
    if (!space) throw new NotFoundException('Espaço não encontrado');

    const overlapping = await this.prisma.appointment.count({
      where: {
        spaceId,
        id: excludeId ? { not: excludeId } : undefined,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });

    if (overlapping >= space.capacity) {
      throw new BadRequestException('Espaço sem capacidade disponível neste horário');
    }
  }

  private async assertNoScheduleBlock(
    professionalId: string,
    spaceId: string,
    startTime: Date,
    endTime: Date,
  ) {
    const block = await this.prisma.scheduleBlock.findFirst({
      where: {
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        OR: [{ professionalId }, { spaceId }],
      },
    });
    if (block) throw new BadRequestException(`Horário bloqueado: ${block.reason}`);
  }
}
