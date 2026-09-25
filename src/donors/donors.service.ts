import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Donor,
  DonorDocument,
  BloodGroup,
} from './schemas/donor.schema.js';

import { UpdateDonorDto } from './dto/update-donor.dto.js';

@Injectable()
export class DonorsService {
  constructor(
    @InjectModel(Donor.name)
    private readonly donorModel: Model<DonorDocument>,
  ) {}

  // ============================================================
  // CREATE DONOR
  // ============================================================

  async create(userId: string, data: any) {
    const existingDonor = await this.donorModel.findOne({
      userId,
    });

    if (existingDonor) {
      throw new ConflictException(
        'Donor profile already exists',
      );
    }

    const donor = await this.donorModel.create({
      userId,
      bloodGroup: data.bloodGroup,
      city: data.city,
      phone: data.phone,
      address: data.address,
      isAvailable: true,
      isActive: true,
    });

    return donor;
  }

  // ============================================================
  // GET MY PROFILE
  // ============================================================

  async getMyProfile(userId: string) {
    const donor = await this.donorModel
      .findOne({ userId })
      .populate('userId', 'name email');

    if (!donor) {
      throw new NotFoundException(
        'Donor profile not found',
      );
    }

    return donor;
  }

  // ============================================================
  // UPDATE MY PROFILE
  // ============================================================

  async updateProfile(
    userId: string,
    data: UpdateDonorDto,
  ) {
    const donor = await this.donorModel
      .findOneAndUpdate(
        { userId },
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate('userId', 'name email');

    if (!donor) {
      throw new NotFoundException(
        'Donor profile not found',
      );
    }

    return donor;
  }

  // ============================================================
  // UPDATE AVAILABILITY
  // ============================================================

  async updateAvailability(
    userId: string,
    isAvailable: boolean,
  ) {
    const donor = await this.donorModel
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            isAvailable,
          },
        },
        {
          new: true,
        },
      )
      .populate('userId', 'name email');

    if (!donor) {
      throw new NotFoundException(
        'Donor profile not found',
      );
    }

    return donor;
  }

  // ============================================================
  // SEARCH DONORS
  // ============================================================

  async search(
    bloodGroup?: BloodGroup,
    city?: string,
  ) {
    const filter: Record<string, any> = {
      isAvailable: true,
      isActive: true,
    };

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    if (city) {
      filter.city = {
        $regex: city,
        $options: 'i',
      };
    }

    return this.donorModel
      .find(filter)
      .populate('userId', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 });
  }

  // ============================================================
  // GET DONOR BY ID
  // ============================================================

  async findById(id: string) {
    const donor = await this.donorModel
      .findOne({
        _id: id,
        isActive: true,
        isAvailable: true,
      })
      .populate('userId', 'name email')
      .select('-__v');

    if (!donor) {
      throw new NotFoundException(
        'Donor not found',
      );
    }

    return donor;
  }

  // ============================================================
  // ADMIN - GET ALL DONORS
  // ============================================================

  async findAll() {
    return this.donorModel
      .find()
      .populate('userId', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 });
  }

  // ============================================================
  // ADMIN - COUNT ALL DONORS
  // ============================================================

  async count(): Promise<number> {
    return this.donorModel.countDocuments();
  }

  // ============================================================
  // ADMIN - COUNT AVAILABLE DONORS
  // ============================================================

  async countAvailable(): Promise<number> {
    return this.donorModel.countDocuments({
      isAvailable: true,
      isActive: true,
    });
  }
}