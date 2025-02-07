import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@app/common';
import { User } from './schemas/user.schema';
import { UpdateUserRequest } from './dto/update-user.request';
import { Types } from 'mongoose';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req, @Body() request: UpdateUserRequest) {
    const userId = req.user['_id'];    
    return this.usersService.updateUser({_id:userId}, request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllExceptCurrent(@Request() req) {
    return await this.usersService.getAllExceptCurrent(req.user['_id']);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    return req.user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser({_id: new Types.ObjectId(id)});
  }

  @Get('/name/:username')
  @UseGuards(JwtAuthGuard)
  async getUserByName(@Param('username') username: string): Promise<User> {
    return this.usersService.getUser({username: username});
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req) {
    const userId = req.user['_id'];
    return this.usersService.deleteUser({_id:userId});
  }

  @Delete('all')
  @UseGuards(JwtAuthGuard)
  async deleteAllUsers() {
    return this.usersService.deleteAll()
  }

  @Post('validate-password')
  @UseGuards(JwtAuthGuard)
  async validatePassword(@Request() req, @Body() body: { oldPassword: string }): Promise<boolean> {
    const userId = req.user.id; // Extraire l'ID utilisateur depuis le JWT
    const isValid = await this.usersService.validatePassword(userId, body.oldPassword);
    return isValid;
  }
}
