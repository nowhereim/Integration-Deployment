import { Module } from '@nestjs/common';
import { UserFacadeApp } from 'src/application/user/user.facade';
import { CashHistoryService } from 'src/domain/user/cash-history.service';
import { UserService } from 'src/domain/user/user.service';
import { CashHistoryRepositoryImpl } from 'src/infrastructure/core/user/cash-history.repository';
import { UserRepositoryImpl } from 'src/infrastructure/core/user/user.respository';
import { UserController } from 'src/presentation/user/user.controller';
import { RedisModule } from 'src/modules/redis.module';
import { CashRepositoryImpl } from 'src/infrastructure/core/user/cash.repository';

@Module({
  imports: [RedisModule],
  controllers: [UserController],
  providers: [
    UserFacadeApp,
    UserService,
    CashHistoryService,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'ICashHistoryRepository',
      useClass: CashHistoryRepositoryImpl,
    },
    {
      provide: 'ICashRepository',
      useClass: CashRepositoryImpl,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
