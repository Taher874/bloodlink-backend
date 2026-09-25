import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Donor,
  DonorSchema,
} from './schemas/donor.schema.js';

import { DonorsController } from './donors.controller.js';
import { DonorsService } from './donors.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema,
      },
    ]),
  ],

  controllers: [DonorsController],

  providers: [DonorsService],

  exports: [DonorsService],
})
export class DonorsModule {}