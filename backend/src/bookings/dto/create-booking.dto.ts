import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  clientAddress?: string;

  @IsOptional()
  @IsNumber()
  clientLatitude?: number;

  @IsOptional()
  @IsNumber()
  clientLongitude?: number;
}
