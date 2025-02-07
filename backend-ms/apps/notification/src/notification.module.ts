import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@app/common';
import * as Joi from 'joi';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        KAFKA_BROKER: Joi.string().required(),
        KAFKA_NOTIFICATION_GROUP_ID: Joi.string().required(),
      }),
      envFilePath: './apps/notification/.env',
    }),
    KafkaModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
