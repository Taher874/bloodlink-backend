import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from './admin.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/enums/role.enum.js';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // ============================================================
  // Dashboard
  // ============================================================

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get admin dashboard statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 403,
    description: 'Only admin users can access this endpoint',
  })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  // ============================================================
  // Users
  // ============================================================

  @Get('users')
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
  })
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/deactivate')
  @ApiOperation({
    summary: 'Deactivate a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  deactivateUser(
    @Param('id') id: string,
  ) {
    return this.adminService.deactivateUser(id);
  }

  @Patch('users/:id/activate')
  @ApiOperation({
    summary: 'Activate a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  activateUser(
    @Param('id') id: string,
  ) {
    return this.adminService.activateUser(id);
  }

  @Delete('users/:id')
  @ApiOperation({
    summary: 'Delete a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  deleteUser(
    @Param('id') id: string,
  ) {
    return this.adminService.deleteUser(id);
  }

  // ============================================================
  // Donors
  // ============================================================

  @Get('donors')
  @ApiOperation({
    summary: 'Get all donors',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all donors',
  })
  getDonors() {
    return this.adminService.getDonors();
  }

  // ============================================================
  // Requests
  // ============================================================

  @Get('requests')
  @ApiOperation({
    summary: 'Get all blood requests',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all blood requests',
  })
  getRequests() {
    return this.adminService.getRequests();
  }
}