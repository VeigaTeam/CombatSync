import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Post()
  register(@Body() dto: CreatePaymentDto) {
    return this.service.register(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('summary')
  summary(@Query('startDate') start: string, @Query('endDate') end: string) {
    return this.service.summary(start, end);
  }

  @Patch(':id/refund')
  refund(@Param('id') id: string) {
    return this.service.refund(id);
  }
}
