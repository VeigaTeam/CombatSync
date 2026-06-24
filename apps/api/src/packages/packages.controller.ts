import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';

@ApiTags('Packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('packages')
export class PackagesController {
  constructor(private service: PackagesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  createPackage(@Body() dto: CreatePackageDto) {
    return this.service.createPackage(dto);
  }

  @Get()
  findPackages(@Query('serviceId') serviceId?: string) {
    return this.service.findPackages(serviceId);
  }

  @Post('purchase/:packageId')
  purchase(@Param('packageId') packageId: string, @CurrentUser() user: User) {
    return this.service.purchase(user.id, packageId);
  }

  @Get('my-purchases')
  myPurchases(@CurrentUser() user: User) {
    return this.service.findClientPurchases(user.id);
  }

  @Get('client/:clientId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PROFESSIONAL)
  clientPurchases(@Param('clientId') clientId: string) {
    return this.service.findClientPurchases(clientId);
  }
}
