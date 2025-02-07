import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, DatabaseModule, KafkaModule, RmqModule } from '@app/common';
import * as Joi from 'joi';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { MeetingRepository } from './meeting.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Meeting, MeetingSchema } from './schema/meeting.schema';
import { ROOM_SERVICE, NOTIFICATION_SERVICE_KAFKA } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        KAFKA_BROKER: Joi.string().required(),
        KAFKA_NOTIFICATION_GROUP_ID: Joi.string().required(),
      }),
      envFilePath: './apps/meeting/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    RmqModule.register({
      name: ROOM_SERVICE,
    }),
    KafkaModule.register({ 
      name: NOTIFICATION_SERVICE_KAFKA, 
    }),
    AuthModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingRepository],
})
export class MeetingModule {}