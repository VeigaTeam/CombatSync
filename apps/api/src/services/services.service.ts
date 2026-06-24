import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        name: dto.name,
        description: dto.description,
        categoryId: dto.categoryId,
        spaceId: dto.spaceId,
        professionalId: dto.professionalId,
        durationMinutes: dto.durationMinutes,
        bufferMinutes: dto.bufferMinutes ?? 0,
        price: dto.price,
        maxParticipants: dto.maxParticipants ?? 1,
        color: dto.color ?? '#3B82F6',
      },
      include: { category: true, space: true, professional: { select: { id: true, name: true } } },
    });
  }

  findAll() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      include: {
        category: true,
        space: { select: { id: true, name: true } },
        professional: { select: { id: true, name: true } },
        packages: { where: { isActive: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        space: true,
        professional: { select: { id: true, name: true } },
        packages: true,
      },
    });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    return service;
  }

  update(id: string, dto: Partial<CreateServiceDto>) {
    return this.prisma.service.update({ where: { id }, data: dto as any });
  }

  deactivate(id: string) {
    return this.prisma.service.update({ where: { id }, data: { isActive: false } });
  }

  findCategories() {
    return this.prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } });
  }

  createCategory(name: string, description?: string) {
    return this.prisma.serviceCategory.create({ data: { name, description } });
  }
}
