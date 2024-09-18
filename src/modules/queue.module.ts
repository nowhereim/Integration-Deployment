import { Module } from '@nestjs/common';
import { QueueService } from 'src/domain/queue/queue.service';
import { QueueController } from 'src/presentation/queue/queue.controller';
import { ActiveQueueScheduler } from 'src/presentation/queue/scheduler/active.queue.scheduler';
import { QueueRepositoryImpl } from 'src/infrastructure/core/queue/queue.repository';
import { RedisModule } from './redis.module';
import { QueueFacadeApp } from 'src/application/queue/queue.facade';

@Module({
  imports: [RedisModule],
  controllers: [QueueController],
  providers: [
    QueueService,
    {
      provide: 'IQueueRepository',
      useClass: QueueRepositoryImpl,
    },
    ActiveQueueScheduler,
    QueueFacadeApp,
  ],
  exports: [QueueService],
})
export class QueueModule {}
