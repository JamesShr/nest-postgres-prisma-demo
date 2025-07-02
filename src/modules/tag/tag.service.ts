import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/common/services/prisma/prisma.service';
import {
  buildLimitOffset,
  buildPageQuery,
  PageQueryDto,
} from '@/utils/paging/paging';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  // findAll
  async findAll(query: { query: { name?: string }; paging: PageQueryDto }) {
    const page = buildPageQuery(query.paging.page, query.paging.limit);
    const limitOffset = buildLimitOffset(page);
    const data = await this.prisma.tag.findMany({
      where: {
        name: {
          contains: query.query.name,
        },
      },
      skip: limitOffset.offset,
      take: limitOffset.limit,
    });
    const totalCount = await this.prisma.tag.count();
    return {
      data,
      paging: {
        ...query.paging,
        totalCount,
        totalPages: Math.ceil(totalCount / query.paging.limit) || 1,
      },
    };
  }

  // createOne
  async createOne(data: Prisma.TagCreateInput) {
    return this.prisma.tag.create({ data });
  }

  // getOne
  async getOne(name: string) {
    return this.prisma.tag.findUnique({ where: { name } });
  }

  // deleteOne
  async deleteOne(name: string) {
    return this.prisma.tag.delete({ where: { name } });
  }

  // addPostToTag
  async addPostToTag(name: string, postId: number) {
    return this.prisma.tag.update({
      where: { name },
      data: { posts: { connect: { id: postId } } },
    });
  }
}
