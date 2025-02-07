import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common";
import { Meeting } from "./schema/meeting.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

@Injectable()
export class MeetingRepository extends AbstractRepository<Meeting> {
    protected readonly logger = new Logger(MeetingRepository.name);
    
    constructor(
        @InjectModel(Meeting.name) meetingModel: Model<Meeting>,
        @InjectConnection() connection : Connection,
    ) {
        super(meetingModel, connection);
    }
}