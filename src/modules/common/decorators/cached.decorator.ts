// cached.decorator.ts

import Redis from 'ioredis';

export function Cached(prefix: string, ttl = 60): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const redis: Redis = this.redis.getClient();
      const cacheKey = `${prefix}:${args.join(':')}`;
      const cached = await redis.get(cacheKey);

      if (cached) return JSON.parse(cached);

      const result = await originalMethod.apply(this, args);
      await redis.set(cacheKey, JSON.stringify(result), 'EX', ttl);
      return result;
    };

    return descriptor;
  };
}
