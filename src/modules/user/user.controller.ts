import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { OkInterceptor } from '../common/interceptors/ok.interceptor';
import { PagingInterceptor } from '../common/interceptors/paging.interceptor';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('post-count')
  @UseInterceptors(PagingInterceptor)
  async getPostCount(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.userService.findPostCount({
      query: {},
      paging: { limit: parseInt(limit) || 10, page: parseInt(page) || 1 },
    });
  }
  
  @Get()
  @UseInterceptors(PagingInterceptor)
  async getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('name') name: string,
  ) {
    return this.userService.findAll({
      query: { name: name || undefined },
      paging: { limit: parseInt(limit) || 10, page: parseInt(page) || 1 },
    });
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

  @Delete(':id')
  @UseInterceptors(OkInterceptor)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteOne(parseInt(id));
  }

 
}
