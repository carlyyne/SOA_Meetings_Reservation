import { Controller } from '@nestjs/common';
import { KafkaService } from '@app/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  @MessagePattern('send_invitation')
  handleEvent(@Payload() message: any, @Ctx() context: KafkaContext) {
    const { title, startTime, endTime, participants } = message;

    for (const participantId of participants) {
      const notificationPayload = {
        title,
        startTime,
        endTime,
        message: `Participant with id ${participantId} is invited to the meeting ${title}`,
      };
      console.log(notificationPayload);
    }
  }
}