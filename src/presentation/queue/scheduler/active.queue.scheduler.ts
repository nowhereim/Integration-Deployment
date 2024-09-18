import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueFacadeApp } from 'src/application/queue/queue.facade';

@Injectable()
export class ActiveQueueScheduler {
  constructor(private readonly queueFacadeApp: QueueFacadeApp) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.queueFacadeApp.activateWaitingRecords();
  }
}
