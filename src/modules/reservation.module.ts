import { Module } from '@nestjs/common';
import { ReservationFacadeApp } from 'src/application/reservation/reservation.facade';
import { ReservationService } from 'src/domain/reservation/reservation.service';
import { ReservationRepositoryImpl } from 'src/infrastructure/core/reservation/reservation.repository';
import { ReservationController } from 'src/presentation/reservation/reservation.controller';
import { ConcertModule } from './concert.module';
import { ReservationScheduler } from 'src/presentation/reservation/scheduler/expire.reservation.scheduler';
import { RedisModule } from './redis.module';
import { CqrsModule } from '@nestjs/cqrs';
@Module({
  imports: [ConcertModule, RedisModule, CqrsModule],
  controllers: [ReservationController],
  providers: [
    ReservationScheduler,
    ReservationService,
    ReservationFacadeApp,
    {
      provide: 'IReservationRepository',
      useClass: ReservationRepositoryImpl,
    },
  ],
  exports: [ReservationService],
})
export class ReservationModule {}
