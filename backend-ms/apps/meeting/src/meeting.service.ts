import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMeetingRequest } from './dto/create-meeting.request';
import { MeetingRepository } from './meeting.repository';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { ROOM_SERVICE, AUTH_SERVICE, NOTIFICATION_SERVICE_KAFKA } from './constants/services';
import { lastValueFrom } from 'rxjs';
import { UpdateMeetingRequest } from './dto/update-meeting-request';
import { Types } from 'mongoose';

@Injectable()
export class MeetingService {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    @Inject(ROOM_SERVICE) private roomClient: ClientProxy,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE_KAFKA) private readonly notificationClient: ClientKafka,
  ) {}

  async create(request: CreateMeetingRequest, authentication: string) {
    try {
      const user = await lastValueFrom(
        this.authClient.send('validate_user', { Authentication: authentication })
      );
      request.userId = user._id;
  
      const isRoomAvailable = await lastValueFrom(
        this.roomClient.send('is_room_available', {
          roomId: request.roomId,
          startTime: request.startTime,
          endTime: request.endTime,
        })
      );
  
      console.log("✅ Réponse de is_room_available:", isRoomAvailable);
      
      if (!isRoomAvailable) {
        throw new BadRequestException('The room is not available at this time');
      }
  
      const meeting = await this.meetingRepository.create({
        ...request,
        userId: user._id,
      });
  
      await lastValueFrom(
        this.roomClient.emit('meeting_created', {
          meeting,
          Authentication: authentication,
        })
      );

      const notificationData = {
        meetingId: meeting._id,
        title: meeting.title,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        participants: request.participants,
      };

      this.notificationClient.emit('send_invitation', notificationData);
  
      return meeting;
    } catch (error) {
      console.error("🔥 Erreur capturée:", error);
      throw error; // Vérifie bien que Nest gère correctement cette erreur
    }
  }

  async update(meetingId: string, request: UpdateMeetingRequest) {
    if (!Types.ObjectId.isValid(meetingId)) {
        throw new NotFoundException(`Meeting with id '${meetingId}' not found`);
    }    
    return this.meetingRepository.findOneAndUpdate({ _id: meetingId },request);
  }

  async cancel(meetingId: string) {
    if (!Types.ObjectId.isValid(meetingId)) {
        throw new NotFoundException(`Meeting with id '${meetingId}' not found`);
    }
    return this.meetingRepository.findOneAndDelete({ _id: meetingId });
  }

  async getMeetings() {
    return this.meetingRepository.find({});;
  }

  async getMeetingsCreated(auth: string) {
    try {
      const user = await lastValueFrom(this.authClient.send('validate_user', { Authentication: auth }));
      return this.meetingRepository.find({ userId: user._id });
    } catch (error) {
      console.error('Error validating user:', error);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  async getMeetingsParticipant(auth: string) {
    try {
      const user = await lastValueFrom(this.authClient.send('validate_user', { Authentication: auth }));
      return this.meetingRepository.find({ participants: user._id });
    } catch (error) {
      console.error('Error validating user:', error);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  async deleteAll() {
    return this.meetingRepository.deleteAll();
  }

  async getMeeting(meetingId: string) {
    if (!Types.ObjectId.isValid(meetingId)) {
        throw new NotFoundException(`Meeting with id '${meetingId}' not found`);
    }
    return this.meetingRepository.findOne({ _id: meetingId });
  }
}
