import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsString()
  serviceId: string;

  @ApiProperty()
  @IsString()
  spaceId: string;

  @ApiProperty()
  @IsString()
  professionalId: string;

  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty({ example: '2024-07-15T09:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  packagePurchaseId?: string;
}
