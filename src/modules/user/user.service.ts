import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma/prisma.service';
import { RedisService } from '../common/services/redis/redis.service';
import { Cached } from '../common/decoractors/cached.decorator';
import { CacheClear } from '../common/decoractors/cache-clear.decorator';
import { Prisma } from '@prisma/client';

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

  async findAll() {
    return this.prisma.user.findMany();
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
}
