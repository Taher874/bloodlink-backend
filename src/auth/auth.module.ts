import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

import { UsersModule } from '../users/users.module.js';
import { DonorsModule } from '../donors/donors.module.js';

@Global()
@Module({
  imports: [
    UsersModule,
    DonorsModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'bloodlink-secret-key',

      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
  ],

  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}
