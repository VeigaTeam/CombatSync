import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('overview')
  getOverview() {
    return this.service.getOverview();
  }

  @Get('today-appointments')
  getTodayAppointments() {
    return this.service.getTodayAppointments();
  }

  @Get('revenue-chart')
  getRevenueChart(@Query('year') year: string) {
    return this.service.getRevenueChart(parseInt(year) || new Date().getFullYear());
  }

  @Get('top-services')
  getTopServices(@Query('startDate') start: string, @Query('endDate') end: string) {
    return this.service.getTopServices(start, end);
  }
}
