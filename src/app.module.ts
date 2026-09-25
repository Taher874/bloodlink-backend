import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { DonorsModule } from './donors/donors.module.js';
import { RequestsModule } from './requests/requests.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI!,
    ),

    AuthModule,
    UsersModule,
    DonorsModule,
    RequestsModule,
    AdminModule,
  ],
})
export class AppModule {}