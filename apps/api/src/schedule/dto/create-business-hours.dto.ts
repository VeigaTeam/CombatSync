import { IsBoolean, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

export class CreateBusinessHoursDto {
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  openTime: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  closeTime: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
