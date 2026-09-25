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

import { RequestsService } from './requests.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { CreateRequestDto } from './dto/create-request.dto.js';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto.js';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
  ) {}

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateRequestDto,
  ) {
    return this.requestsService.create(
      req.user.sub,
      dto,
    );
  }

  @Get('sent')
  getMyRequests(@Req() req: any) {
    return this.requestsService.getMyRequests(
      req.user.sub,
    );
  }

  @Get('received')
  getReceivedRequests(@Req() req: any) {
    return this.requestsService.getReceivedRequests(
      req.user.sub,
    );
  }

  @Patch(':id/status')
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