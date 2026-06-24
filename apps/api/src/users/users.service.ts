import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(role?: Role) {
    return this.prisma.user.findMany({
      where: { ...(role && { role }), isActive: true },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, avatarUrl: true, isActive: true, createdAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, avatarUrl: true, isActive: true, createdAt: true,
        appointmentsAsClient: {
          take: 10,
          orderBy: { startTime: 'desc' },
          include: { service: { select: { name: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true, name: true, email: true, phone: true, role: true, avatarUrl: true,
      },
    });
  }

  deactivate(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  findProfessionals() {
    return this.findAll(Role.PROFESSIONAL);
  }
}
