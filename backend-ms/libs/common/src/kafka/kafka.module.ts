import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from './kafka.service';

interface KafkaModuleOptions {
  name: string;
}

@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {
  
  static register({ name }: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  brokers: [configService.get<string>('KAFKA_BROKER')],
                },
                consumer: {
                  groupId: configService.get<string>(`KAFKA_${name}_GROUP_ID`),
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}