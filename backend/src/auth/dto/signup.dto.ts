import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['CLIENT', 'PROVIDER'])
  role?: 'CLIENT' | 'PROVIDER';
}
