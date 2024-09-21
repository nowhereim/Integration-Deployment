import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { PaymentFacadeApp } from 'src/application/payment/payment.facade';
// import { QueueFacadeApp } from 'src/application/queue/queue.facade';
import { ReservationFacadeApp } from 'src/application/reservation/reservation.facade';
// import { UserFacadeApp } from 'src/application/user/user.facade';
import { PaymentModule } from 'src/modules/payment.module';
import { ReservationModule } from 'src/modules/reservation.module';
import { SeederService } from 'src/seed/seeder.service';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

describe('PaymentFacade Integration Test', () => {
  let app: INestApplication;
  let paymentFacade: PaymentFacadeApp;
  let reservationFacade: ReservationFacadeApp;
  // let userFacadeApp: UserFacadeApp;
  // let queueFacadeApp: QueueFacadeApp;
  let seederService: SeederService;
  let container: StartedTestContainer;

  beforeAll(async () => {
    // MySQL 컨테이너 실행)
    container = await new GenericContainer('mysql:8.0')
      .withEnvironment({
        MYSQL_ROOT_PASSWORD: 'root',
        MYSQL_DATABASE: 'concert',
      }) // MYSQL_DATABASE 설정 추가
      .withExposedPorts(3306)
      .withWaitStrategy(Wait.forLogMessage('mysqld: ready for connections'))
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
            // logging: true,
          }),
        }),

        PaymentModule,
        ReservationModule,
      ],
      providers: [SeederService],
    }).compile();

    app = module.createNestApplication();

    paymentFacade = module.get<PaymentFacadeApp>(PaymentFacadeApp);
    reservationFacade = module.get<ReservationFacadeApp>(ReservationFacadeApp);
    seederService = module.get<SeederService>(SeederService);

    await app.init();
    await seederService.seed();
  }, 60000);

  afterAll(async () => {
    await app.close();
    await container.stop();
  });
  describe('결제 생성', () => {
    it('결제 생성 성공', async () => {
      const userId = 1;
      const seatId = 1;
      const concertId = 1;
      await reservationFacade.registerReservation({
        userId,
        seatId,
        concertId,
      });
      const payment = await paymentFacade.pay({
        userId,
        seatId,
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
    it('이미 결제된 좌석에 대한 결제 시도 실패', async () => {
      const userId = 1;
      const seatId = 1;

      await expect(
        paymentFacade.pay({
          userId,
          seatId,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('대기열에 등록되지 않은 사용자 결제 시도 실패', async () => {
      const userId = 100;
      const seatId = 1;

      await expect(
        paymentFacade.pay({
          userId,
          seatId,
        }),
      ).rejects.toThrow(NotFoundException);
    }, 60000);

    //완료, 실패 추가
  });
});
