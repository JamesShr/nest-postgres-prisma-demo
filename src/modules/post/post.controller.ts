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
import { PostService } from './post.service';
import { PagingInterceptor } from '@/modules/common/interceptors/paging.interceptor';
import { OkInterceptor } from '@/modules/common/interceptors/ok.interceptor';
import { Prisma } from '@prisma/client';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @UseInterceptors(PagingInterceptor)
  async getPosts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('userIds') userIds: string, //split by ','
  ) {
    return this.postService.findAllByUserId({
      query: { userIds: userIds?.split(',').map(Number) || [] },
      paging: { page: parseInt(page) || 1, limit: parseInt(limit) || 10 },
    });
  }

  @Get(':id')
  @UseInterceptors(OkInterceptor)
  async getPost(@Param('id') id: string) {
    return this.postService.getOneById(parseInt(id));
  }

  @Post()
  @UseInterceptors(OkInterceptor)
  async createPost(@Body() data: Prisma.PostCreateInput) {
    return this.postService.createOne(data);
  }

  @Patch(':id')
  @UseInterceptors(OkInterceptor)
  async updatePost(
    @Param('id') id: string,
    @Body() data: Prisma.PostUpdateInput,
  ) {
    return this.postService.updateOne(parseInt(id), data);
  }

  @Delete(':id')
  @UseInterceptors(OkInterceptor)
  async deletePost(@Param('id') id: string) {
    return this.postService.deleteOne(parseInt(id));
  }

  @Post('tag')
  @UseInterceptors(OkInterceptor)
  async addTagToPost(@Body() data: { ids: number[]; tag: string }) {
    return this.postService.addTagToPost(data.ids, data.tag);
  }

  @Post('like')
  @UseInterceptors(OkInterceptor)
  async likePost(@Body() data: { id: number }) {
    return this.postService.likePost(data.id);
  }
}
