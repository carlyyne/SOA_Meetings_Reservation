import { IsNotEmpty, IsString, IsNumber, IsMultibyte } from 'class-validator';

export class CreateRoomRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsString({ each: true })
  resources: string[];
}