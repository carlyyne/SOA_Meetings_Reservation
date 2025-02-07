import { Controller, Post, Body, UseGuards, Request, Get, Param, NotFoundException, Put, ForbiddenException, Delete, Query, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService } from '@app/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { UpdateRoomRequest } from './dto/update-room.request';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly rmqService: RmqService,
    // private readonly kafkaService: KafkaService,
   ) {}

   @MessagePattern('is_room_available')
   async isRoomAvailable(@Payload() data: any, @Ctx() context: RmqContext) {
      return this.roomService.isRoomAvailable(data);
   }

   @EventPattern('meeting_created')
   @UseGuards(JwtAuthGuard)
   async handleMeetingCreated(@Payload() data: any, @Ctx() context: RmqContext) {
     this.roomService.handleMeetingCreated(data);
     this.rmqService.ack(context);
   }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() request: CreateRoomRequest) {
    return this.roomService.create(request);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async getRooms() {
    return await this.roomService.getRooms();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getRoomById(@Param('id') roomId: string) {
    return this.roomService.getRoomById(roomId);
  }
  
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') roomId: string,
    @Body() request: UpdateRoomRequest,
  ) {    
    return this.roomService.update(
      roomId,
      request
    );
  }

  @Delete('all')
  async deleteAll() {
    return this.roomService.deleteAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') roomId: string,
  ) {
    return this.roomService.delete(
      roomId
    );
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  async getRoomByName(@Param('name') name: string) {
    return this.roomService.getRoomByName(name);
  }


}
