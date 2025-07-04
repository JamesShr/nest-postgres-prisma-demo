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

  async findAll(query: {
    query: { name?: string; email?: string };
    paging: PageQueryDto;
  }) {
    const page = buildPageQuery(query.paging.page, query.paging.limit);
    const limitOffset = buildLimitOffset(page);
    const data = await this.prisma.user.findMany({
      where: {
        name: {
          contains: query.query.name, // like
          mode: 'insensitive', // 👈 加上這行即可忽略大小寫
        },
        email: {
          contains: query.query.email,
          mode: 'insensitive',
        },
      },
      skip: limitOffset.offset,
      take: limitOffset.limit,
      orderBy: {
        createdAt: 'desc',
      },
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

  async findPostCount(query: {
    query: { upperLimit?: number; lowerLimit?: number };
    paging: PageQueryDto;
  }) {
    const page = buildPageQuery(query.paging.page, query.paging.limit);
    const limitOffset = buildLimitOffset(page);

    const data = await this.prisma.userPostCount.findMany({
      skip: limitOffset.offset,
      take: limitOffset.limit,
      where: {
        postCount: {
          gte: query.query.upperLimit,
          lte: query.query.lowerLimit,
        },
      },
    });
    const totalCount = await this.prisma.userPostCount.count();
    return {
      data,
      paging: {
        ...query.paging,
        totalCount,
        totalPages: Math.ceil(totalCount / query.paging.limit) || 1,
      },
    };
  }

  @CacheClear('cache:user')
  async deleteOne(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
