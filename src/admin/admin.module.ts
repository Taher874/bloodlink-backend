import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

import { UsersModule } from '../users/users.module.js';
import { DonorsModule } from '../donors/donors.module.js';
import { RequestsModule } from '../requests/requests.module.js';

@Module({
  imports: [
    UsersModule,
    DonorsModule,
    RequestsModule,
  ],

  controllers: [
    AdminController,
  ],

  providers: [
    AdminService,
  ],
})
export class AdminModule {}