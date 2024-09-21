import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { PaymentStatus } from 'src/domain/payment/payment';
import { PaymentService } from 'src/domain/payment/payment.service';
import { PaymentModule } from 'src/modules/payment.module';
import { SeederService } from 'src/seed/seeder.service';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

describe('PaymentFacade Integration Test', () => {
  let app: INestApplication;
  let seederService: SeederService;
  let container: StartedTestContainer;
  let paymentService: PaymentService;

  beforeAll(async () => {
    // MySQL 컨테이너 실행)
    container = await new GenericContainer('mysql:8.0')
      .withEnvironment({
        MYSQL_ROOT_PASSWORD: 'root',
        MYSQL_DATABASE: 'concert',
      })
      .withExposedPorts(3306)
      .start();

    const port = container.getMappedPort(3306);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            host: container.getHost(),
            type: 'mysql',
            port: port,
            username: 'root',
            password: 'root',
            database: 'concert',
            entities: [path.join(__dirname, '../../../**/*.entity.ts')],
            synchronize: true,
          }),
        }),

        PaymentModule,
      ],
      providers: [SeederService],
    }).compile();

    app = module.createNestApplication();

    seederService = module.get<SeederService>(SeederService);
    paymentService = module.get<PaymentService>(PaymentService);

    await app.init();
    await seederService.seed();
  }, 30000);

  afterAll(async () => {
    await app.close();
    await container.stop();
  });
  describe('결제 생성', () => {
    it('결제 생성 성공', async () => {
      const userId = 1;
      const seatNumber = 1;
      const payment = await paymentService.pay({
        userId,
        seatNumber,
        concertName: '박효신 콘서트',
        openAt: new Date(new Date().getTime() - 1000 * 60),
        closeAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 60 * 60),
        totalAmount: 10000,
      });
      expect(payment).toEqual({
        id: expect.any(Number),
        userId,
        status: 'PENDING',
        seatNumber: expect.any(Number),
        openAt: expect.any(Date),
        concertName: expect.any(String),
        closeAt: expect.any(Date),
        totalAmount: expect.any(Number),
      });
    }, 60000);
  });

  describe('결제 상태 변경', () => {
    it('결제 상태 완료로 변경', async () => {
      const userId = 1;
      const seatNumber = 1;
      const payment = await paymentService.pay({
        userId,
        seatNumber,
        concertName: '박효신 콘서트',
        openAt: new Date(new Date().getTime() - 1000 * 60),
        closeAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 60 * 60),
        totalAmount: 10000,
      });

      const completedPayment = await paymentService.completePayment({
        paymentId: payment.id,
      });

      expect(completedPayment).toEqual({
        id: expect.any(Number),
        userId,
        status: PaymentStatus.COMPLETED,
        seatNumber: expect.any(Number),
        openAt: expect.any(Date),
        concertName: expect.any(String),
        closeAt: expect.any(Date),
        totalAmount: expect.any(Number),
      });
    });

    it('결제 상태 실패로 변경', async () => {
      const userId = 1;
      const seatNumber = 1;
      const payment = await paymentService.pay({
        userId,
        seatNumber,
        concertName: '박효신 콘서트',
        openAt: new Date(new Date().getTime() - 1000 * 60),
        closeAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 60 * 60),
        totalAmount: 10000,
      });

      const failedPayment = await paymentService.failPayment({
        paymentId: payment.id,
      });

      expect(failedPayment).toEqual({
        id: expect.any(Number),
        userId,
        status: PaymentStatus.FAILED,
        seatNumber: expect.any(Number),
        openAt: expect.any(Date),
        concertName: expect.any(String),
        closeAt: expect.any(Date),
        totalAmount: expect.any(Number),
      });
    });

    it('존재하지 않는 결제 상태 완료로 변경 실패', async () => {
      await expect(
        paymentService.completePayment({
          paymentId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('존재하지 않는 결제 상태 실패로 변경 실패', async () => {
      await expect(
        paymentService.failPayment({
          paymentId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
