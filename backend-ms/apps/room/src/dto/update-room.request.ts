import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomRequest } from './create-room.request';

export class UpdateRoomRequest extends PartialType(CreateRoomRequest) {}