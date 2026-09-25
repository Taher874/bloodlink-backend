import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BloodGroup } from '../schemas/donor.schema.js';

export class CreateDonorDto {
  @ApiProperty({
    enum: BloodGroup,
    example: BloodGroup.O_POSITIVE,
    description: 'Donor blood group',
  })
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @ApiProperty({
    example: 'Jaipur',
    description: 'Donor city',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

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