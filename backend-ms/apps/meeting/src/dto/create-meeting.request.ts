import { Transform } from 'class-transformer';
import { IsString, IsDate, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMeetingRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  startTime: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  endTime: Date;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  participants: string[];

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  userId?: string;
}