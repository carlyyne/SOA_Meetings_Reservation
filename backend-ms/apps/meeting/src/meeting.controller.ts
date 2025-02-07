import { Body, Controller, Get, Param, Post, Put, Req, Delete, UseGuards } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingRequest } from './dto/create-meeting.request';
import { JwtAuthGuard } from '@app/common';
import { UpdateMeetingRequest } from './dto/update-meeting-request';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() request: CreateMeetingRequest, @Req() req: any) {
    return this.meetingService.create(request, req.cookies?.Authentication);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') meetingId: string,
    @Body() request: UpdateMeetingRequest,
  ) {    
    return this.meetingService.update(
      meetingId,
      request
    );
  }

  @Delete('all')
  async deleteAll() {
    return this.meetingService.deleteAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') meetingId: string,
  ) {
    return this.meetingService.cancel(
      meetingId
    );
  }

  @Get('created')
  @UseGuards(JwtAuthGuard)
  async getCreated(@Req() req) {
    return this.meetingService.getMeetingsCreated(req.cookies?.Authentication);
  }

  @Get('participant')
  @UseGuards(JwtAuthGuard)
  async getParticipant(@Req() req) {
    return this.meetingService.getMeetingsParticipant(req.cookies?.Authentication);
  }
  
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getMeetings() {
    return this.meetingService.getMeetings();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMeeting(
    @Param('id') meetingId: string,
  ) {
    return this.meetingService.getMeeting(meetingId);
  }
}

