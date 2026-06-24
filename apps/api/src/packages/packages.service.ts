import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { addDays } from 'date-fns';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  createPackage(dto: CreatePackageDto) {
    return this.prisma.servicePackage.create({
      data: {
        serviceId: dto.serviceId,
        name: dto.name,
        sessionCount: dto.sessionCount,
        price: dto.price,
        validityDays: dto.validityDays ?? 90,
      },
      include: { service: { select: { name: true } } },
    });
  }

  findPackages(serviceId?: string) {
    return this.prisma.servicePackage.findMany({
      where: { isActive: true, ...(serviceId && { serviceId }) },
      include: { service: { select: { id: true, name: true } } },
      orderBy: { sessionCount: 'asc' },
    });
  }

  async purchase(clientId: string, packageId: string) {
    const pkg = await this.prisma.servicePackage.findUnique({ where: { id: packageId } });
    if (!pkg || !pkg.isActive) throw new NotFoundException('Pacote não encontrado');

    const purchase = await this.prisma.packagePurchase.create({
      data: {
        clientId,
        packageId,
        expiresAt: addDays(new Date(), pkg.validityDays),
        sessionsTotal: pkg.sessionCount,
      },
    });

    await this.prisma.payment.create({
      data: {
        packagePurchaseId: purchase.id,
        clientId,
        amount: pkg.price,
      },
    });

    return purchase;
  }

  findClientPurchases(clientId: string) {
    return this.prisma.packagePurchase.findMany({
      where: { clientId },
      include: {
        package: { include: { service: { select: { name: true } } } },
        payment: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async getPurchase(id: string) {
    const p = await this.prisma.packagePurchase.findUnique({
      where: { id },
      include: { package: true, payment: true },
    });
    if (!p) throw new NotFoundException('Compra de pacote não encontrada');
    return p;
  }

  async validateAndDecrementSession(packagePurchaseId: string) {
    const purchase = await this.getPurchase(packagePurchaseId);
    if (purchase.sessionsUsed >= purchase.sessionsTotal) {
      throw new BadRequestException('Pacote sem sessões disponíveis');
    }
    if (new Date() > purchase.expiresAt) {
      throw new BadRequestException('Pacote expirado');
    }
    return this.prisma.packagePurchase.update({
      where: { id: packagePurchaseId },
      data: { sessionsUsed: { increment: 1 } },
    });
  }
}
