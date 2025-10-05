import { Role } from '@prisma/client';
import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankAcc?: string;

  @IsOptional()
  @IsString()
  govIdUrl?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}