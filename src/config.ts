import config from 'config';
import { RedisOptions } from 'ioredis';


export const INFO_VERSION = config.get('version') as string;

// port
export const PORT = config.get('port') as number;

export const DATABASE_URL = config.get('database.url') as string;

// redis
export const REDIS_CONFIG = config.get('redis') as RedisOptions;