import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BloodGroup } from '../../donors/schemas/donor.schema.js';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Schema({
  timestamps: true,
  collection: 'requests',
})
export class BloodRequest {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  seekerId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Donor',
    required: true,
  })
  donorId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(BloodGroup),
  })
  bloodGroup: BloodGroup;

  @Prop({
    required: true,
    trim: true,
  })
  city: string;

  @Prop({
    required: true,
    trim: true,
  })
  message: string;

  @Prop({
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Prop()
  contactPhone?: string;

  @Prop()
  hospitalName?: string;

  @Prop()
  requiredDate?: Date;
}

export type BloodRequestDocument =
  HydratedDocument<BloodRequest>;

export const BloodRequestSchema =
  SchemaFactory.createForClass(BloodRequest);