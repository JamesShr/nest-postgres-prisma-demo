import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma/prisma.service';
import { RedisService } from '../common/services/redis/redis.service';
import { Cached } from '../common/decorators/cached.decorator';
import { CacheClear } from '../common/decorators/cacheClear.decorator';
import { Prisma } from '@prisma/client';
import {
  buildLimitOffset,
  buildPageQuery,
  PageQueryDto,
} from '@/utils/paging/paging';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  async onApplicationBootstrap() {
    // setInterval(async () => {
    //   await this.prisma.user.create({
    //     data: { email: `test-${Date.now()}@test.com`, name: `test-${Date.now()}` },
    //   });
    // }, 1000);
  }

  async findAll(query: { query: { name?: string }; paging: PageQueryDto }) {
    const page = buildPageQuery(query.paging.page, query.paging.limit);
    const limitOffset = buildLimitOffset(page);
    const data = await this.prisma.user.findMany({
      where: {
        name: {
          contains: query.query.name, // like
        },
      },
      skip: limitOffset.offset,
      take: limitOffset.limit,
    });
    const totalCount = await this.prisma.user.count();
    return {
      data,
      paging: {
        ...query.paging,
        totalCount,
        totalPages: Math.ceil(totalCount / query.paging.limit) || 1,
      },
    };
  }

  async createOne(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  @Cached('cache:user', 300)
  async getOne(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: {
          include: {
            tags: true,
          },
        },
      },
    });
  }

  @CacheClear('cache:user')
  async updateOne(userId: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async findPostCount() {
    return this.prisma.userPostCount.findMany();
  }

  @CacheClear('cache:user')
  async deleteOne(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
