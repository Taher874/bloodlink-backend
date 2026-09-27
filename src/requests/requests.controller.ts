import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RequestsService } from './requests.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { CreateRequestDto } from './dto/create-request.dto.js';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto.js';

@ApiTags('Requests')
@ApiBearerAuth('access-token')
@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
  ) {}

  // Create blood request
  @Post()
  @ApiOperation({
    summary: 'Create a blood request',
  })
  @ApiResponse({
    status: 201,
    description: 'Blood request created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid',
  })
  create(
    @Req() req: any,
    @Body() dto: CreateRequestDto,
  ) {
    return this.requestsService.create(
      req.user.sub,
      dto,
    );
  }

  // Get requests sent by logged-in user
  @Get('sent')
  @ApiOperation({
    summary: 'Get blood requests sent by the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'Sent blood requests retrieved successfully',
  })
  getMyRequests(@Req() req: any) {
    return this.requestsService.getMyRequests(
      req.user.sub,
    );
  }

  // Get requests received by logged-in donor
  @Get('received')
  @ApiOperation({
    summary: 'Get blood requests received by the logged-in donor',
  })
  @ApiResponse({
    status: 200,
    description: 'Received blood requests retrieved successfully',
  })
  getReceivedRequests(@Req() req: any) {
    return this.requestsService.getReceivedRequests(
      req.user.sub,
    );
  }

  // Accept or decline a request
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Accept or decline a blood request',
  })
  @ApiResponse({
    status: 200,
    description: 'Request status updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Only pending requests can be updated',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
  })
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.requestsService.updateStatus(
      id,
      req.user.sub,
      dto.status,
    );
  }
}