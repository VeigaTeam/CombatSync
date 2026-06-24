import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSpaceDto) {
    return this.prisma.space.create({ data: dto });
  }

  findAll() {
    return this.prisma.space.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const space = await this.prisma.space.findUnique({ where: { id } });
    if (!space) throw new NotFoundException('Espaço não encontrado');
    return space;
  }

  update(id: string, dto: Partial<CreateSpaceDto>) {
    return this.prisma.space.update({ where: { id }, data: dto });
  }

  deactivate(id: string) {
    return this.prisma.space.update({ where: { id }, data: { isActive: false } });
  }
}
