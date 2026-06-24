import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ctveigateam.com.br' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@ctveigateam.com.br',
      passwordHash: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
      phone: '11999990000',
    },
  });

  // Fisioterapeuta
  const fisio = await prisma.user.upsert({
    where: { email: 'fisio@ctveigateam.com.br' },
    update: {},
    create: {
      name: 'Dr. Rafael Veiga',
      email: 'fisio@ctveigateam.com.br',
      passwordHash: await bcrypt.hash('fisio123', 12),
      role: 'PROFESSIONAL',
      phone: '11999990001',
    },
  });

  // Espaços
  const salaFisio = await prisma.space.upsert({
    where: { id: 'sala-fisio-001' },
    update: {},
    create: {
      id: 'sala-fisio-001',
      name: 'Sala de Fisioterapia',
      description: 'Sala equipada para fisioterapia e preparação física',
      capacity: 3,
    },
  });

  const salaArtes = await prisma.space.upsert({
    where: { id: 'sala-artes-001' },
    update: {},
    create: {
      id: 'sala-artes-001',
      name: 'Sala de Artes Marciais',
      description: 'Tatame para Muay Thai, Jiu-Jitsu e Judô',
      capacity: 20,
    },
  });

  // Categorias
  const catFisio = await prisma.serviceCategory.upsert({
    where: { name: 'Fisioterapia' },
    update: {},
    create: { name: 'Fisioterapia', description: 'Serviços de fisioterapia e reabilitação' },
  });

  const catLuta = await prisma.serviceCategory.upsert({
    where: { name: 'Artes Marciais' },
    update: {},
    create: { name: 'Artes Marciais', description: 'Muay Thai, Jiu-Jitsu, Judô' },
  });

  const catPersonal = await prisma.serviceCategory.upsert({
    where: { name: 'Personal' },
    update: {},
    create: { name: 'Personal', description: 'Personal trainer e preparação física' },
  });

  // Serviços
  const fisioterapia = await prisma.service.upsert({
    where: { id: 'fisio-001' },
    update: {},
    create: {
      id: 'fisio-001',
      name: 'Fisioterapia',
      description: 'Sessão de fisioterapia individual',
      categoryId: catFisio.id,
      spaceId: salaFisio.id,
      professionalId: fisio.id,
      durationMinutes: 50,
      bufferMinutes: 10,
      price: 120,
      maxParticipants: 1,
      color: '#10B981',
    },
  });

  await prisma.service.upsert({
    where: { id: 'aval-001' },
    update: {},
    create: {
      id: 'aval-001',
      name: 'Avaliação Física',
      description: 'Avaliação física completa',
      categoryId: catFisio.id,
      spaceId: salaFisio.id,
      professionalId: fisio.id,
      durationMinutes: 30,
      bufferMinutes: 5,
      price: 80,
      maxParticipants: 1,
      color: '#6366F1',
    },
  });

  await prisma.service.upsert({
    where: { id: 'mt-part-001' },
    update: {},
    create: {
      id: 'mt-part-001',
      name: 'Muay Thai Particular',
      categoryId: catLuta.id,
      spaceId: salaArtes.id,
      professionalId: fisio.id,
      durationMinutes: 60,
      bufferMinutes: 0,
      price: 100,
      maxParticipants: 1,
      color: '#F97316',
    },
  });

  await prisma.service.upsert({
    where: { id: 'prep-001' },
    update: {},
    create: {
      id: 'prep-001',
      name: 'Preparação Física',
      categoryId: catPersonal.id,
      spaceId: salaFisio.id,
      professionalId: fisio.id,
      durationMinutes: 60,
      bufferMinutes: 0,
      price: 90,
      maxParticipants: 2,
      color: '#3B82F6',
    },
  });

  // Pacotes de Fisioterapia
  await prisma.servicePackage.upsert({
    where: { id: 'pkg-fisio-5' },
    update: {},
    create: {
      id: 'pkg-fisio-5',
      serviceId: fisioterapia.id,
      name: 'Pacote 5 Sessões',
      sessionCount: 5,
      price: 550,
      validityDays: 60,
    },
  });

  await prisma.servicePackage.upsert({
    where: { id: 'pkg-fisio-10' },
    update: {},
    create: {
      id: 'pkg-fisio-10',
      serviceId: fisioterapia.id,
      name: 'Pacote 10 Sessões',
      sessionCount: 10,
      price: 1000,
      validityDays: 90,
    },
  });

  await prisma.servicePackage.upsert({
    where: { id: 'pkg-fisio-20' },
    update: {},
    create: {
      id: 'pkg-fisio-20',
      serviceId: fisioterapia.id,
      name: 'Pacote 20 Sessões',
      sessionCount: 20,
      price: 1800,
      validityDays: 120,
    },
  });

  // Horários de funcionamento
  const businessHours = [
    { dayOfWeek: 'MONDAY', openTime: '08:00', closeTime: '12:00' },
    { dayOfWeek: 'MONDAY', openTime: '14:00', closeTime: '21:00' },
    { dayOfWeek: 'TUESDAY', openTime: '08:00', closeTime: '21:00' },
    { dayOfWeek: 'WEDNESDAY', openTime: '08:00', closeTime: '12:00' },
    { dayOfWeek: 'WEDNESDAY', openTime: '14:00', closeTime: '21:00' },
    { dayOfWeek: 'THURSDAY', openTime: '08:00', closeTime: '21:00' },
    { dayOfWeek: 'FRIDAY', openTime: '08:00', closeTime: '19:00' },
    { dayOfWeek: 'SATURDAY', openTime: '09:00', closeTime: '13:00' },
  ];

  for (const bh of businessHours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek_openTime: { dayOfWeek: bh.dayOfWeek as any, openTime: bh.openTime } },
      update: { closeTime: bh.closeTime },
      create: bh as any,
    });
  }

  console.log('✓ Seed completo!');
  console.log('Admin:', admin.email, '| Senha: admin123');
  console.log('Profissional:', fisio.email, '| Senha: fisio123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
