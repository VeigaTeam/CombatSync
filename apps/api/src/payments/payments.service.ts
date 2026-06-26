import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async register(dto: CreatePaymentDto) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        OR: [
          dto.appointmentId ? { appointmentId: dto.appointmentId } : {},
          dto.packagePurchaseId ? { packagePurchaseId: dto.packagePurchaseId } : {},
        ],
      },
    });

    if (payment) {
      return this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          amountPaid: dto.amountPaid,
          method: dto.method,
          status: (dto.amountPaid ?? 0) >= Number(payment.amount) ? 'PAID' : 'PARTIAL',
          paidAt: new Date(),
          notes: dto.notes,
        },
      });
    }

    return this.prisma.payment.create({
      data: {
        appointmentId: dto.appointmentId,
        packagePurchaseId: dto.packagePurchaseId,
        clientId: dto.clientId,
        amount: dto.amount,
        amountPaid: dto.amountPaid ?? 0,
        method: dto.method,
        status: dto.amountPaid && dto.amountPaid >= dto.amount ? 'PAID' : 'PENDING',
        paidAt: dto.amountPaid ? new Date() : null,
        notes: dto.notes,
      },
    });
  }

  findAll(filters: { clientId?: string; status?: string; startDate?: string; endDate?: string }) {
    return this.prisma.payment.findMany({
      where: {
        ...(filters.clientId && { clientId: filters.clientId }),
        ...(filters.status && { status: filters.status as any }),
        ...(filters.startDate || filters.endDate
          ? {
              createdAt: {
                ...(filters.startDate && { gte: new Date(filters.startDate) }),
                ...(filters.endDate && { lte: new Date(filters.endDate) }),
              },
            }
          : {}),
      },
      include: {
        client: { select: { id: true, name: true } },
        appointment: { include: { service: { select: { name: true } } } },
        packagePurchase: { include: { package: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async refund(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    return this.prisma.payment.update({ where: { id }, data: { status: 'REFUNDED' } });
  }

  async summary(startDate: string, endDate: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: { in: ['PAID', 'PARTIAL'] },
        paidAt: { gte: new Date(startDate), lte: new Date(endDate) },
      },
    });

    const total = payments.reduce((acc, p) => acc + Number(p.amountPaid), 0);
    const count = payments.length;

    return { total, count, payments };
  }
}
