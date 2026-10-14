
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI');

        if (!uri) {
          throw new Error(
            'MONGODB_URI environment variable is missing',
          );
        }

        return { uri };
      },
    }),

    AuthModule,
    UsersModule,
    DonorsModule,
    RequestsModule,
    AdminModule,
  ],
})
export class AppModule {}
