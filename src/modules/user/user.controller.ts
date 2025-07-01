import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { OkInterceptor } from '../common/interceptors/ok.interceptor';
import { PagingInterceptor } from '../common/interceptors/paging.interceptor';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseInterceptors(PagingInterceptor)
  async getUsers() {
    return this.userService.findAll();
  }

  @Post()
  @UseInterceptors(OkInterceptor)
  async createUser(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createOne(data);
  }

  @Get(':id')
  @UseInterceptors(OkInterceptor)
  async getUser(@Param('id') id: string) {
    return this.userService.getOne(parseInt(id));
  }

  @Patch(':id')
  @UseInterceptors(OkInterceptor)
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    return this.userService.updateOne(parseInt(id), data);
  }

  @Get('post-count')
  @UseInterceptors(PagingInterceptor)
  async getPostCount() {
    return this.userService.findPostCount();
  }
}
