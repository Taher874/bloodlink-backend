import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BloodGroupCode } from '../../donors/schemas/donor.schema.js';

export class RegisterDto {
  @ApiProperty({
    example: 'Taher Itawa',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'taheritawa@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user wants to donate blood',
  })
  @IsBoolean()
  isDonor: boolean;

  @ApiProperty({
    enum: BloodGroupCode,
    example: BloodGroupCode.O_POSITIVE,
    description: 'Required when isDonor is true',
  })
  @ValidateIf((dto: RegisterDto) => dto.isDonor)
  @IsIn(Object.values(BloodGroupCode))
  bloodGroup?: BloodGroupCode;

  @ApiProperty({
    example: 'Jaipur',
    description: 'Required when isDonor is true',
  })
  @ValidateIf((dto: RegisterDto) => dto.isDonor)
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({
    example: '9876543210',
    description: 'Donor phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Malviya Nagar, Jaipur',
    description: 'Donor address',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
