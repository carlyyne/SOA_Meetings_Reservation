import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { UpdateRoomRequest } from './dto/update-room.request';
import { RoomRepository } from './room.repository';
import { Types } from 'mongoose';

@Injectable()
export class RoomService {
  constructor( private readonly roomRepository: RoomRepository ) {}
  private readonly logger = new Logger(RoomService.name);

  async handleMeetingCreated(data:any) {
    const { _id, roomId, startTime, endTime, participants } = data.meeting;
    const nbParticipants = participants.length;
    const room = await this.roomRepository.findOne({_id: roomId});
    
    const existRoom = await this.roomRepository.existOne({_id: roomId});
    if (!existRoom) {
      this.logger.log(`Room ${roomId} not found`);
      return;
    }

    const capacity = room.capacity;
    if (nbParticipants > capacity) {
      this.logger.log(`Room ${roomId} is full: ${nbParticipants} > ${capacity} (Capacity max)`);
      return;
    }

    const roomUpdated = {
      ...room,
      reservations: [
        ...room.reservations,
        {
          _id,
          startTime,
          endTime
        },
      ],
    }

    this.roomRepository.findOneAndUpdate({ _id: roomId }, roomUpdated);
    this.logger.log('Meeting Created !');
  }


  async create(createRoomRequest: CreateRoomRequest) {
    this.logger.log('Creating a new room');
    
    const existingRoom = await this.roomRepository.existOne({ name: createRoomRequest.name });    
    if (existingRoom) {
      throw new ConflictException('A room with this name already exists.');
    }
    const roomData = {
      ...createRoomRequest,
      reservations: [],
    };
    return this.roomRepository.create(roomData);
  }

  async update(roomId: string, request: UpdateRoomRequest) {
    if (request.name) {
      const existingRoom = await this.roomRepository.existOne({ name: request.name });    
      if (existingRoom) {
        throw new ConflictException('A room with this name already exists.');
      }
    }
    return this.roomRepository.findOneAndUpdate({ _id: roomId },request);
  }

  async delete(roomId: string) {
    if (!Types.ObjectId.isValid(roomId)) {
        throw new NotFoundException(`Room with id '${roomId}' not found`);
    }
    return this.roomRepository.findOneAndDelete({ _id: roomId });
  }

  async getRooms() {
    return this.roomRepository.find({});;
  }

  async getRoomById(roomId: string) {
    return this.roomRepository.findOne({ _id: roomId });
  }

  async isRoomAvailable(data:any): Promise<boolean> {
    const {roomId, startTime, endTime} = data;
    const room = await this.roomRepository.findOne({_id :roomId});
    const start =  new Date(startTime);
    const end = new Date(endTime);
    for (const reservation of room.reservations) {
      const isConflicting =
        (start >= reservation.startTime && start < reservation.endTime) ||
        (end > reservation.startTime && end <= reservation.endTime)
      if (isConflicting) {
        return false;
      }
    }
    return true;
  }

  async getRoomByName(name: string) {
    return this.roomRepository.findOne({ name });
  }

  async deleteAll() {
    return this.roomRepository.deleteAll();
  }
}

