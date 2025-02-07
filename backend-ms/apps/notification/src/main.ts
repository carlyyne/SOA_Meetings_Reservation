import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { KafkaService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  app.enableCors({
    origin: 'http://localhost:4200',  // URL frontend (Angular)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Methods allowed
    credentials: true,  // Allow cookies to be sent and received
  });
  const kafkaService = app.get<KafkaService>(KafkaService)
  app.connectMicroservice(kafkaService.getOptions('NOTIFICATION'));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();