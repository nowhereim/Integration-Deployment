import {
  BadRequestException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFacadeApp } from 'src/application/user/user.facade';
import { SeederService } from 'src/seed/seeder.service';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import * as path from 'path';
import { UserModule } from 'src/modules/user.module';
describe('UserFacade Integration Test', () => {
  let app: INestApplication;
  let userFacadeApp: UserFacadeApp;
  let seederService: SeederService;
  let container: StartedTestContainer;
  beforeEach(async () => {
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
            logging: true,
          }),
        }),

        UserModule,
      ],
      providers: [SeederService],
    }).compile();

    app = module.createNestApplication();

    userFacadeApp = module.get<UserFacadeApp>(UserFacadeApp);
    seederService = module.get<SeederService>(SeederService);

    await app.init();
    await seederService.seed();
  }, 60000);

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  describe('캐시 충전', () => {
    it('유저 포인트 충전', async () => {
      const user = await userFacadeApp.cashCharge({
        userId: 1,
        amount: 1000,
      });
      expect(user).toEqual({
        id: 1,
        balance: 11000,
        version: expect.any(Number),
        userId: expect.any(Number),
      });
    });

    it('잘못된 값 충전 실패', async () => {
      await expect(
        userFacadeApp.cashCharge({
          userId: 1,
          amount: -1000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('유저 없음 충전 실패', async () => {
      await expect(
        userFacadeApp.cashCharge({
          userId: 0,
          amount: 1000,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('캐시 사용', () => {
    it('잘못된 값 사용 실패', async () => {
      await expect(
        userFacadeApp.cashUse({
          userId: 1,
          amount: -1000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('유저 포인트 사용', async () => {
      const user = await userFacadeApp.cashUse({
        userId: 1,
        amount: 1000,
      });
      expect(user).toEqual({
        id: 1,
        name: expect.any(String),
        cash: {
          balance: 9000,
          id: expect.any(Number),
          userId: 1,
          version: expect.any(Number),
        },
      });
    });

    it('잔액 초과 실패', async () => {
      await expect(
        userFacadeApp.cashUse({
          userId: 1,
          amount: 1000000000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('유저 없음 사용 실패', async () => {
      await expect(
        userFacadeApp.cashUse({
          userId: 0,
          amount: 1000,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('캐시 조회', () => {
    it('유저 포인트 조회', async () => {
      const user = await userFacadeApp.cashRead({
        userId: 1,
      });
      expect(user).toEqual({
        id: 1,
        name: expect.any(String),
        cash: {
          balance: expect.any(Number),
          id: expect.any(Number),
          userId: 1,
          version: expect.any(Number),
        },
      });
    });

    it('유저 없음 조회 실패', async () => {
      await expect(
        userFacadeApp.cashRead({
          userId: 0,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('유저 캐시 충전 동시성 테스트', () => {
    it('유저가 동시에 다수의 충전 요청을 할 경우 누락없이 모두 반영한다.', async () => {
      const promises = Array.from({ length: 10 }, () =>
        userFacadeApp.cashCharge({
          userId: 1,
          amount: 1000,
        }),
      );

      await Promise.all(promises);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const getUserCash = await userFacadeApp.cashRead({
        userId: 1,
      });
      expect(getUserCash.cash.getBalance()).toBe(20000); //초기 시딩 값이 10000
    });
  });

  describe('유저 캐시 사용 동시성 테스트', () => {
    it('유저가 동시에 다수의 캐시 사용 요청을 할 경우 낙관락을 활용하여 동시성 제어 한다.', async () => {
      const promises = Array.from({ length: 1 }, () =>
        userFacadeApp.cashUse({
          userId: 1,
          amount: 1000,
        }),
      );

      await Promise.all(promises);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const getUserCash = await userFacadeApp.cashRead({
        userId: 1,
      });
      expect(getUserCash.cash.getBalance()).toBe(9000); //초기 시딩 값이 10000
    });
  });
});
