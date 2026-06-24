import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePackageDto {
  @IsString() serviceId: string;
  @IsString() name: string;
  @IsInt() @Min(1) sessionCount: number;
  @Type(() => Number) @IsNumber() @Min(0) price: number;
  @IsOptional() @IsInt() @Min(1) validityDays?: number;
}
