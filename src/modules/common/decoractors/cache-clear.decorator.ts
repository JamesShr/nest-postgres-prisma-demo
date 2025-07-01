// cache-clear.decorator.ts

import Redis from 'ioredis';

export function CacheClear(prefix: string): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const redis: Redis = this.redis.getClient();
      // const cacheKey = `${prefix}:${args.join(':')}`;
      const cacheKey = `${prefix}:${args[0]}`;
      await redis.del(cacheKey);

      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
