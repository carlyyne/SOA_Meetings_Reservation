import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common";
import { Room } from "./schema/room.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

@Injectable()
export class RoomRepository extends AbstractRepository<Room> {
    protected readonly logger = new Logger(RoomRepository.name);
    
    constructor(
        @InjectModel(Room.name) roomModel: Model<Room>,
        @InjectConnection() connection : Connection,
    ) {
        super(roomModel, connection);
    }
}