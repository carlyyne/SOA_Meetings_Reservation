import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserRequest } from './dto/create-user.request';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(request: CreateUserRequest) {
    await this.validateCreateUserRequest(request);
    const user = await this.usersRepository.create({
      ...request,
      password: await bcrypt.hash(request.password, 10)
    });
    return user;
  }

  private async validateCreateUserRequest(request: CreateUserRequest) {
    // Vérification du username
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        username: request.username,
      });
    } catch (err) {}
  
    if (user) {
      throw new UnprocessableEntityException('Username already exists.');
    }
  
    // Vérification de l'email
    let emailUser: User;
    try {
      emailUser = await this.usersRepository.findOne({
        email: request.email,
      });
    } catch (err) {}
  
    if (emailUser) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({ username });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.usersRepository.findOne(getUserArgs);
  }

  async deleteUser(getUserArgs: Partial<User>) {
    return this.usersRepository.findOneAndDelete(getUserArgs);
  }

  async updateUser(getUserArgs: Partial<User>, update: Partial<User>) {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    return this.usersRepository.findOneAndUpdate(getUserArgs, update);
  }

  async getUsers() {
    return this.usersRepository.find({});
  }

  async validatePassword(userId: string, oldPassword: string) {
    const user = await this.usersRepository.findOne({ _id: userId });
    return bcrypt.compare(oldPassword, user.password);
  }

  async deleteAll() {
    return this.usersRepository.deleteAll();
  }

  async getAllExceptCurrent(userId: string) {
    return this.usersRepository.find({ _id: { $ne: userId } });
  }
}
