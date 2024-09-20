import { Module, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisRedLockRepository } from '../infrastructure/redis/redis-redlock.repository';
import { RedisPubSubLockRepository } from 'src/infrastructure/redis/redis-pub-sub-lock.repository';
import { RedisQueueRepositoryImpl } from 'src/infrastructure/redis/redis-queue.repository';
import { RedisQueueRepositoryImplV2 } from 'src/infrastructure/redis/redis-queue.repository.v2';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT) || 6379,
        });
      },
    },
    {
      provide: 'IRedisRepository',
      useClass: RedisRedLockRepository,
    },
    RedisRedLockRepository,
    RedisPubSubLockRepository,
    RedisQueueRepositoryImpl,
    RedisQueueRepositoryImplV2,
  ],
  exports: [
    'IRedisRepository',
    RedisRedLockRepository,
    RedisPubSubLockRepository,
    RedisQueueRepositoryImpl,
    RedisQueueRepositoryImplV2,
    'REDIS_CLIENT',
  ],
})
export class RedisModule {}
