import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DonorsService } from './donors.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { AvailabilityDto } from './dto/availability.dto.js';
import { CreateDonorDto } from './dto/create-donor.dto.js';
import { UpdateDonorDto } from './dto/update-donor.dto.js';

import { BloodGroup } from './schemas/donor.schema.js';

@ApiTags('Donors')
@Controller('donors')
export class DonorsController {
  constructor(
    private readonly donorsService: DonorsService,
  ) {}

  // ============================================================
  // CREATE DONOR
  // ============================================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create donor profile',
  })
  @ApiResponse({
    status: 201,
    description: 'Donor profile created successfully',
  })
  create(
    @Req() req: any,
    @Body() dto: CreateDonorDto,
  ) {
    return this.donorsService.create(
      req.user.sub,
      dto,
    );
  }

  // ============================================================
  // SEARCH DONORS
  // ============================================================

  @Get('search')
  @ApiOperation({
    summary: 'Search available donors',
  })
  @ApiQuery({
    name: 'bloodGroup',
    required: false,
    enum: BloodGroup,
    example: BloodGroup.O_POSITIVE,
  })
  @ApiQuery({
    name: 'city',
    required: false,
    example: 'Jaipur',
  })
  search(
    @Query('bloodGroup') bloodGroup?: string,
    @Query('city') city?: string,
  ) {
    let bloodGroupEnum:
      | BloodGroup
      | undefined;

    if (bloodGroup) {
      if (
        !Object.values(BloodGroup).includes(
          bloodGroup as BloodGroup,
        )
      ) {
        throw new BadRequestException(
          'Invalid blood group',
        );
      }

      bloodGroupEnum =
        bloodGroup as BloodGroup;
    }

    return this.donorsService.search(
      bloodGroupEnum,
      city,
    );
  }

  // ============================================================
  // MY PROFILE
  // ============================================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get my donor profile',
  })
  getMyProfile(@Req() req: any) {
    return this.donorsService.getMyProfile(
      req.user.sub,
    );
  }

  // ============================================================
  // UPDATE PROFILE
  // ============================================================

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update donor profile',
  })
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateDonorDto,
  ) {
    return this.donorsService.updateProfile(
      req.user.sub,
      dto,
    );
  }

  // ============================================================
  // UPDATE AVAILABILITY
  // ============================================================

  @Patch('availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update donor availability',
  })
  updateAvailability(
    @Req() req: any,
    @Body() dto: AvailabilityDto,
  ) {
    return this.donorsService.updateAvailability(
      req.user.sub,
      dto.isAvailable,
    );
  }

  // ============================================================
  // GET DONOR
  // ============================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get donor by ID',
  })
  findOne(@Param('id') id: string) {
    return this.donorsService.findById(id);
  }
}