import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  bookingId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  clientId: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @IsOptional()
  @IsString()
  receipt?: string;
}