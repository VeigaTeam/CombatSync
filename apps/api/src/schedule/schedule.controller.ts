import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { CreateBusinessHoursDto } from './dto/create-business-hours.dto';
import { CreateBlockDto } from './dto/create-block.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';

@ApiTags('Schedule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private service: ScheduleService) {}

  @Post('business-hours')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  upsertBusinessHours(@Body() dto: CreateBusinessHoursDto) {
    return this.service.upsertBusinessHours(dto);
  }

  @Get('business-hours')
  findBusinessHours() {
    return this.service.findBusinessHours();
  }

  @Post('blocks')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PROFESSIONAL)
  createBlock(@Body() dto: CreateBlockDto, @CurrentUser() user: User) {
    return this.service.createBlock(dto, user.id);
  }

  @Get('blocks')
  findBlocks(@Query() query: any) {
    return this.service.findBlocks(query);
  }

  @Delete('blocks/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PROFESSIONAL)
  deleteBlock(@Param('id') id: string) {
    return this.service.deleteBlock(id);
  }

  @Get('available-slots')
  getAvailableSlots(
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
    @Query('professionalId') professionalId: string,
    @Query('spaceId') spaceId: string,
  ) {
    return this.service.getAvailableSlots(date, serviceId, professionalId, spaceId);
  }
}
