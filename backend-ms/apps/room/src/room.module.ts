import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import * as Joi from 'joi';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomRepository } from './room.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schema/room.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ROOM_QUEUE: Joi.string().required(),
        // KAFKA_BROKER: Joi.string().required(),
        // KAFKA_ROOM_GROUP_ID: Joi.string().required(),
      }),
      envFilePath: './apps/room/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    AuthModule,
    RmqModule,
    // KafkaModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomRepository],
})
export class RoomModule {}
