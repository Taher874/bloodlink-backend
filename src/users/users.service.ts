import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // Create user
  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  // Find user by email
  async findByEmail(email: string) {
    return this.userModel.findOne({
      email: email.toLowerCase(),
    });
  }

  // Find user by ID
  async findById(id: string) {
    return this.userModel
      .findById(id)
      .select('-password');
  }

  // Get all users
  async findAll() {
    return this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 });
  }

  // Count all users
  async count() {
    return this.userModel.countDocuments();
  }

  // Deactivate user
  async deactivate(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isActive: false,
          },
        },
        {
          new: true,
        },
      )
      .select('-password');

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return {
      message: 'User deactivated successfully',
      user,
    };
  }

  // Activate user
  async activate(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isActive: true,
          },
        },
        {
          new: true,
        },
      )
      .select('-password');

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return {
      message: 'User activated successfully',
      user,
    };
  }

  // Delete user
  async delete(id: string) {
    const user =
      await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return {
      message: 'User deleted successfully',
    };
  }
}