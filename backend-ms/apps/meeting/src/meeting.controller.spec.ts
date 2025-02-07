import { Test, TestingModule } from '@nestjs/testing';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';

describe('MeetingController', () => {
  let meetingController: MeetingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [MeetingService],
    }).compile();

    meetingController = app.get<MeetingController>(MeetingController);
  });

});
