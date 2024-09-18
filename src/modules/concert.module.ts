import { Module } from '@nestjs/common';
import { ConcertFacadeApp } from 'src/application/concert/concert.facade';
import { ConcertService } from 'src/domain/concert/concert.service';
import { ConcertRepositoryImpl } from 'src/infrastructure/core/concert/concert.repository';
import { SeatRepositoryImpl } from 'src/infrastructure/core/concert/seat.repository';
import { ConcertController } from 'src/presentation/concert/concert.constroller';
import { RedisModule } from './redis.module';
@Module({
  imports: [RedisModule],
  controllers: [ConcertController],
  providers: [
    ConcertService,
    ConcertFacadeApp,
    {
      provide: 'IConcertRepository',
      useClass: ConcertRepositoryImpl,
    },
    {
      provide: 'ISeatRepository',
      useClass: SeatRepositoryImpl,
    },
  ],
  exports: [ConcertService],
})
export class ConcertModule {}
