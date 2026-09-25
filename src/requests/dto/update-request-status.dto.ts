import { IsEnum } from 'class-validator';

import { RequestStatus } from '../schemas/request.schema.js';

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}