import {
  BadRequestException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QueueFacadeApp } from 'src/application/queue/queue.facade';
import { QueueModule } from 'src/modules/queue.module';
// import { SeederService } from 'src/seed/seeder.service';

describe('QueueFacade Integration Test', () => {
  let app: INestApplication;
  let queueFacadeApp: QueueFacadeApp;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [QueueModule],
    }).compile();

    queueFacadeApp = module.get<QueueFacadeApp>(QueueFacadeApp);

    app = module.createNestApplication();
    await app.init();
    // await seederService.seed();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('대기열 등록', () => {
    it('대기열 등록 성공', async () => {
      const userId = 2;
      const queue = await queueFacadeApp.registerQueue({ userId });
      expect(queue).toEqual({
        id: expect.any(Number),
        status: 'WAITING',
      });
      await queueFacadeApp.activateWaitingRecords();
      await queueFacadeApp.expireToken({ userId });
    });

    it('이미 대기열이 존재하는 경우 등록 실패', async () => {
      const userId = 2;
      await queueFacadeApp.registerQueue({ userId });
      await expect(queueFacadeApp.registerQueue({ userId })).rejects.toThrow(
        BadRequestException,
      );

      await queueFacadeApp.activateWaitingRecords();
      await queueFacadeApp.expireToken({ userId });
    });
  });

  describe('대기열 조회', () => {
    it('대기열 조회 성공', async () => {
      const userId = 55;
      const queue = await queueFacadeApp.registerQueue({ userId });
      const findQueue = await queueFacadeApp.validToken({
        queueId: queue.id,
      });
      expect(findQueue).toEqual({
        id: expect.any(Number),
        status: 'WAITING',
        waitingPosition: expect.any(Number),
      });
      await queueFacadeApp.activateWaitingRecords();
      await queueFacadeApp.expireToken({ userId });
    });

    it('대기열 조회 실패', async () => {
      await expect(
        queueFacadeApp.validToken({
          queueId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('대기열 활성화', () => {
    it('대기열 활성화 성공', async () => {
      const userId = 2;
      await queueFacadeApp.registerQueue({ userId });
      await queueFacadeApp.activateWaitingRecords();
      const activeQueue = await queueFacadeApp.validToken({
        queueId: userId,
      });
      expect(activeQueue).toEqual({
        id: expect.any(Number),
        status: 'IN_PROGRESS',
      });
      await queueFacadeApp.expireToken({ userId });
    });
  });

  describe('대기열 만료', () => {
    it('대기열 만료 성공', async () => {
      const userId = 2;
      await queueFacadeApp.registerQueue({ userId });
      await queueFacadeApp.activateWaitingRecords();
      await queueFacadeApp.expireToken({ userId });
      await expect(
        queueFacadeApp.validToken({
          queueId: userId,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
