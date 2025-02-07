import { NestFactory } from '@nestjs/core';
import { RoomModule } from './room.module';
import { RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RoomModule);
  app.enableCors({
    origin: 'http://localhost:4200',  // URL frontend (Angular)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Methods allowed
    credentials: true,  // Allow cookies to be sent and received
  });

  const rmqService = app.get<RmqService>(RmqService);
  // const kafkaService = app.get<KafkaService>(KafkaService);

  app.connectMicroservice(rmqService.getOptions('ROOM'));
  // app.connectMicroservice(kafkaService.getOptions('ROOM'));

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
