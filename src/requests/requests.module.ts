import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BloodRequest,
  BloodRequestSchema,
} from './schemas/request.schema.js';

import {
  Donor,
  DonorSchema,
} from '../donors/schemas/donor.schema.js';

import { RequestsController } from './requests.controller.js';
import { RequestsService } from './requests.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BloodRequest.name,
        schema: BloodRequestSchema,
      },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
    ]),
  ],

  controllers: [RequestsController],

  providers: [RequestsService],

  exports: [RequestsService],
})
export class RequestsModule {}