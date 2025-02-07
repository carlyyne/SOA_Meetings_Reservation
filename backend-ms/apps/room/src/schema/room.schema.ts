import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema( { versionKey: false } )
export class Room extends AbstractDocument {
  @Prop({ required: true, unique: [true, 'A room with this name already exists.'] })
  name: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ type: [String], default: [] })
  resources: string[];

  @Prop({
    type: [
      {
        meetindId: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
      },
    ],
    default: [],
  })
  reservations: {
    meetingId: string;
    date: Date;
    startTime: Date;
    endTime: Date;
  }[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);