import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty({ message: 'Username is required.' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'A password is required.' })
  password: string;

  @IsEmail({}, { message: 'Invalid email address: user@domain.' })
  @IsNotEmpty({ message: 'An email address is required.' })
  email: string;
}
