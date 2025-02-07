import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingRequest } from './create-meeting.request';

export class UpdateMeetingRequest extends PartialType(CreateMeetingRequest) {}