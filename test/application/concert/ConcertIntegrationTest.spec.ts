import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { ConcertFacadeApp } from 'src/application/concert/concert.facade';
import { ConcertModule } from 'src/modules/concert.module';
import { SeederService } from 'src/seed/seeder.service';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

describe('ConcertFacade Integration Test', () => {
  let app: INestApplication;
  let concertFacade: ConcertFacadeApp;
  let container: StartedTestContainer;
  let seederService: SeederService;

  beforeAll(async () => {
    // MySQL 컨테이너 실행)
    container = await new GenericContainer('mysql:8.0')
      .withEnvironment({
        MYSQL_ROOT_PASSWORD: 'root',
        MYSQL_DATABASE: 'concert',
      }) // MYSQL_DATABASE 설정 추가
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
            // logging: true,
          }),
        }),

        ConcertModule,
      ],
      providers: [SeederService],
    }).compile();

    app = module.createNestApplication();

    concertFacade = module.get<ConcertFacadeApp>(ConcertFacadeApp);
    seederService = module.get<SeederService>(SeederService);

    await app.init();
    await seederService.seed();
  }, 30000);

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  describe('예약 가능 스케쥴 조회', () => {
    it('예약 가능 스케쥴 조회 성공', async () => {
      const concertId = 1;
      const concert = await concertFacade.findAvailableDate({ concertId });
      expect(concert).toEqual({
        id: 1,
        name: expect.any(String),
        concertSchedules: expect.any(Array),
      });
    });

    it('예약 가능 스케쥴 조회 실패', async () => {
      await expect(
        concertFacade.findAvailableDate({
          concertId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('예약 가능 좌석 조회', () => {
    it('예약 가능 좌석 조회 성공', async () => {
      const concertScheduleId = 1;
      const concert = await concertFacade.findAvailableSeats({
        concertScheduleId,
      });
      expect(concert).toEqual({
        id: 1,
        name: expect.any(String),
        concertSchedules: expect.any(Array),
      });
    });

    it('예약 가능 좌석 조회 실패', async () => {
      await expect(
        concertFacade.findAvailableSeats({
          concertScheduleId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
