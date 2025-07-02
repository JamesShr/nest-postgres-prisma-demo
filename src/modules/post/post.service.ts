import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/common/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  buildLimitOffset,
  buildPageQuery,
  PageQueryDto,
} from '@/utils/paging/paging';
import { CacheClear } from '../common/decorators/cacheClear.decorator';
import { Cached } from '../common/decorators/cached.decorator';
import { TagService } from '../tag/tag.service';
import { RedisService } from '../common/services/redis/redis.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private tagService: TagService,
  ) {}

  // findAll by userId
  async findAllByUserId(query: {
    query: { userId: number };
    paging: PageQueryDto;
  }) {
    const page = buildPageQuery(query.paging.page, query.paging.limit);
    const limitOffset = buildLimitOffset(page);
    const data = await this.prisma.post.findMany({
      where: {
        author: {
          id: query.query.userId,
        },
      },
      skip: limitOffset.offset,
      take: limitOffset.limit,
    });
    const totalCount = await this.prisma.post.count({
      where: {
        author: {
          id: query.query.userId,
        },
      },
    });
    return {
      data,
      paging: {
        ...query.paging,
        totalCount,
        totalPages: Math.ceil(totalCount / query.paging.limit) || 1,
      },
    };
  }

  // get one by id
  @Cached('cache:post', 300)
  async getOneById(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  // create one
  async createOne(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  // update one
  @CacheClear('cache:post')
  async updateOne(id: number, data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  // delete one
  @CacheClear('cache:post')
  async deleteOne(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  // add tag to post
  async addTagToPost(postId: number, tagName: string) {
    const tag = await this.tagService.getOne(tagName);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return this.prisma.post.update({
      where: { id: postId },
      data: { tags: { connect: { name: tagName } } },
    });
  }
}
