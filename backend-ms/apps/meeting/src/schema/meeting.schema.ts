import { Types } from 'mongoose';
import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema( { versionKey: false } )
export class Meeting extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: [] })
  participants: string[];

  @Prop()
  description: string;

  @Prop({ required: true})
  userId: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);