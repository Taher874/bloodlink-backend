import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  BloodRequest,
  BloodRequestDocument,
  RequestStatus,
} from './schemas/request.schema.js';

import { Donor, DonorDocument } from '../donors/schemas/donor.schema.js';

import { CreateRequestDto } from './dto/create-request.dto.js';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(BloodRequest.name)
    private readonly requestModel: Model<BloodRequestDocument>,

    @InjectModel(Donor.name)
    private readonly donorModel: Model<DonorDocument>,
  ) {}

  // ============================================================
  // CREATE REQUEST
  // ============================================================

  async create(seekerId: string, data: CreateRequestDto) {
    const donor = await this.donorModel.findOne({
      _id: data.donorId,
      isAvailable: true,
      isActive: true,
    });

    if (!donor) {
      throw new NotFoundException(
        'Donor not found or currently unavailable',
      );
    }

    const request = await this.requestModel.create({
      seekerId,
      donorId: data.donorId,
      bloodGroup: data.bloodGroup,
      city: data.city,
      message: data.message,
      contactPhone: data.contactPhone,
      hospitalName: data.hospitalName,
      requiredDate: data.requiredDate,
      status: RequestStatus.PENDING,
    });

    return request;
  }

  // ============================================================
  // GET MY SENT REQUESTS
  // ============================================================

  async getMyRequests(seekerId: string) {
    return this.requestModel
      .find({ seekerId })
      .populate('donorId')
      .sort({ createdAt: -1 });
  }

  // ============================================================
  // GET REQUESTS RECEIVED BY DONOR
  // ============================================================

  async getReceivedRequests(donorId: string) {
    return this.requestModel
      .find({ donorId })
      .populate('seekerId', 'name email')
      .sort({ createdAt: -1 });
  }

  // ============================================================
  // UPDATE REQUEST STATUS
  // ============================================================

  async updateStatus(
    requestId: string,
    donorId: string,
    status: RequestStatus,
  ) {
    const request = await this.requestModel.findOne({
      _id: requestId,
      donorId,
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(
        'Only pending requests can be updated',
      );
    }

    request.status = status;

    return request.save();
  }

  // ============================================================
  // ADMIN - GET ALL REQUESTS
  // ============================================================

  async findAll() {
    return this.requestModel
      .find()
      .populate('seekerId', 'name email')
      .populate('donorId')
      .sort({ createdAt: -1 });
  }

  // ============================================================
  // ADMIN - COUNT ALL REQUESTS
  // ============================================================

  async count(): Promise<number> {
    return this.requestModel.countDocuments();
  }

  // ============================================================
  // ADMIN - COUNT REQUESTS BY STATUS
  // ============================================================

  async countByStatus(status: RequestStatus): Promise<number> {
    return this.requestModel.countDocuments({
      status,
    });
  }
}