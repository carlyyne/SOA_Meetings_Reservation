import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

describe('RoomController', () => {
  let roomController: RoomController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [RoomService],
    }).compile();

    roomController = app.get<RoomController>(RoomController);
  });

});
