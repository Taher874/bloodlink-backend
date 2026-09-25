import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BloodGroup } from '../schemas/donor.schema.js';

export class UpdateDonorDto {
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}