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
    required: true,
    enum: BloodGroup,
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