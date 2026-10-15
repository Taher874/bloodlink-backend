import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';
import { UserRole } from '../users/enums/role.enum.js';
import { DonorsService } from '../donors/donors.service.js';
import { BLOOD_GROUP_BY_CODE } from '../donors/schemas/donor.schema.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly donorsService: DonorsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.isDonor ? UserRole.DONOR : UserRole.SEEKER,
      isDonor: dto.isDonor,
      isActive: true,
    });

    const donorProfile = dto.isDonor
      ? await this.donorsService.create(user._id.toString(), {
          bloodGroup: dto.bloodGroup
            ? BLOOD_GROUP_BY_CODE[dto.bloodGroup]
            : undefined,
          city: dto.city,
          phone: dto.phone,
          address: dto.address,
        })
      : undefined;

    return {
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isDonor: user.isDonor,
      },
      ...(donorProfile ? { donorProfile } : {}),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      isDonor: user.isDonor,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isDonor: user.isDonor,
      },
    };
  }
}
