import { Injectable, Inject, Logger } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import { Subject } from 'rxjs';
import { REDIS_CONFIG } from '@/config';

const connectConfig: RedisOptions = REDIS_CONFIG;
@Injectable()
export class RedisService {
  private client: Redis;
  //   private sub: Redis;
  private readonly expireSubject = new Subject<string>();

  constructor() {
    this.startRedis();
  }

  async startRedis(): Promise<void> {
    this.client = new Redis(connectConfig);
    // await this.client.connect();
    // this.sub = new Redis(connectConfig);
    // await this.sub.connect() ;
    this.client.on('connect', () => {
      Logger.debug('Connect to redis Successfully.');
    });
    // this.client.config('SET', 'notify-keyspace-events', 'Ex');
    // this.sub.subscribe(`__keyevent@0__:expired`);
    // this.sub.on('message', (channel, message) => {
    //   this.logger.system().debug(`expired : ${message}`, {
    //     label: RedisService.name,
    //     meta: { label: RedisService.name },
    //   });
    //   this.expireSubject.next(message);
    // });
  }

  getClient(): Redis {
    return this.client;
  }

  getExpireSubject(): Subject<string> {
    return this.expireSubject;
  }
}
