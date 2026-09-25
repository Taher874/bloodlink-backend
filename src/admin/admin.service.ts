import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service.js';
import { DonorsService } from '../donors/donors.service.js';
import { RequestsService } from '../requests/requests.service.js';

import { RequestStatus } from '../requests/schemas/request.schema.js';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly donorsService: DonorsService,
    private readonly requestsService: RequestsService,
  ) {}

  // ============================================================
  // DASHBOARD
  // ============================================================

  async getDashboard() {
    const [
      users,
      donors,
      availableDonors,
      requests,
      pendingRequests,
      acceptedRequests,
      declinedRequests,
    ] = await Promise.all([
      // Users
      this.usersService.count(),

      // Donors
      this.donorsService.count(),

      // Available donors
      this.donorsService.countAvailable(),

      // Requests
      this.requestsService.count(),

      // Pending
      this.requestsService.countByStatus(
        RequestStatus.PENDING,
      ),

      // Accepted
      this.requestsService.countByStatus(
        RequestStatus.ACCEPTED,
      ),

      // Declined
      this.requestsService.countByStatus(
        RequestStatus.DECLINED,
      ),
    ]);

    return {
      users,
      donors,
      availableDonors,
      requests,
      pendingRequests,
      acceptedRequests,
      declinedRequests,
    };
  }

  // ============================================================
  // USERS
  // ============================================================

  async getUsers() {
    return this.usersService.findAll();
  }

  async deactivateUser(id: string) {
    return this.usersService.deactivate(id);
  }

  async activateUser(id: string) {
    return this.usersService.activate(id);
  }

  async deleteUser(id: string) {
    return this.usersService.delete(id);
  }

  // ============================================================
  // DONORS
  // ============================================================

  async getDonors() {
    return this.donorsService.findAll();
  }

  // ============================================================
  // REQUESTS
  // ============================================================

  async getRequests() {
    return this.requestsService.findAll();
  }
}