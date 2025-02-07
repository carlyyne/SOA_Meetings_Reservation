import { User } from "./user.model";

export interface Meeting {
    _id?: string;
    title: string;
    roomId: string;
    startTime: Date;
    endTime: Date;
    participants: string[];
    description: string;
    userId: string;
  }