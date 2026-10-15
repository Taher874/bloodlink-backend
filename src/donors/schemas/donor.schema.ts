import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DonorDocument = HydratedDocument<Donor>;

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export const BloodGroupCode = {
  A_POSITIVE: 1,
  A_NEGATIVE: 2,
  B_POSITIVE: 3,
  B_NEGATIVE: 4,
  AB_POSITIVE: 5,
  AB_NEGATIVE: 6,
  O_POSITIVE: 7,
  O_NEGATIVE: 8,
} as const;

export type BloodGroupCode =
  (typeof BloodGroupCode)[keyof typeof BloodGroupCode];

export const BLOOD_GROUP_BY_CODE: Record<BloodGroupCode, BloodGroup> = {
  [BloodGroupCode.A_POSITIVE]: BloodGroup.A_POSITIVE,
  [BloodGroupCode.A_NEGATIVE]: BloodGroup.A_NEGATIVE,
  [BloodGroupCode.B_POSITIVE]: BloodGroup.B_POSITIVE,
  [BloodGroupCode.B_NEGATIVE]: BloodGroup.B_NEGATIVE,
  [BloodGroupCode.AB_POSITIVE]: BloodGroup.AB_POSITIVE,
  [BloodGroupCode.AB_NEGATIVE]: BloodGroup.AB_NEGATIVE,
  [BloodGroupCode.O_POSITIVE]: BloodGroup.O_POSITIVE,
  [BloodGroupCode.O_NEGATIVE]: BloodGroup.O_NEGATIVE,
};

@Schema({
  timestamps: true,
  collection: 'donors',
})
export class Donor {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

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

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop({
    default: true,
  })
  isAvailable: boolean;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const DonorSchema = SchemaFactory.createForClass(Donor);
