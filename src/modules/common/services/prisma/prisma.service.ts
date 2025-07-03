// src/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from '../../../../config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect()
      .then(() => {
        Logger.debug('Prisma connected');
      })
      .catch((error) => {
        Logger.error('Prisma connection error', error);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
