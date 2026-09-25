import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';

import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  getMyProfile(@Req() req: any) {
    return this.usersService.findById(
      req.user.sub,
    );
  }

  @Get(':id')
  getUser(
    @Param('id') id: string,
  ) {
    return this.usersService.findById(id);
  }
}