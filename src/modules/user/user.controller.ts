import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createOne(data);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getOne(parseInt(id));
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.updateOne(parseInt(id), data);
  }

  @Get('post-count')
  async getPostCount() {
    return this.userService.findPostCount();
  }
}
