import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    example: '68b123456789abcdef123456',
    description: 'Donor ID',
  })
  @IsString()
  @IsNotEmpty()
  donorId: string;

  @ApiProperty({
    example: 'O+',
    description: 'Required blood group',
  })
  @IsString()
  @IsNotEmpty()
  bloodGroup: string;

  @ApiProperty({
    example: 'Jaipur',
    description: 'City where blood is required',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'Urgently required for surgery',
    description: 'Message to donor',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    example: '9876543210',
    description: 'Contact phone number',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    example: 'SMS Hospital',
    description: 'Hospital name',
  })
  @IsOptional()
  @IsString()
  hospitalName?: string;

  @ApiPropertyOptional({
    example: '2026-09-28',
    description: 'Required blood date',
  })
  @IsOptional()
  @IsDateString()
  requiredDate?: Date;
}