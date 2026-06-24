import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBlockDto {
  @IsOptional() @IsString() professionalId?: string;
  @IsOptional() @IsString() spaceId?: string;
  @IsDateString() startTime: string;
  @IsDateString() endTime: string;
  @IsString() reason: string;
}
