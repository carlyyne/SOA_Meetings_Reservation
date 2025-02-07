import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaContext, KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(topic: string): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [this.configService.get<string>('KAFKA_BROKER')],
        },
        consumer: {
          groupId: this.configService.get<string>(`KAFKA_${topic}_GROUP_ID`),
        },
      },
    };
  }

  ack(context: KafkaContext) {
    const originalMessage = context.getMessage();
    const topic = context.getTopic();
    const response =
    `Receiving a new message from the topic ` + topic + ': '+
    JSON.stringify(originalMessage.value);
    console.log(response);
  }
}