import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ConcertEntity } from 'src/infrastructure/core/concert/entities/concert.entity';
import { ConcertScheduleEntity } from 'src/infrastructure/core/concert/entities/concert-schedule.entity';
import { SeatEntity } from 'src/infrastructure/core/concert/entities/seat.entity';
import { UserEntity } from 'src/infrastructure/core/user/entities/user.entity';
import { CashEntity } from 'src/infrastructure/core/user/entities/cash.entity';

/**
 * @Note 테스트용 시드 데이터
 * */
@Injectable()
export class SeederService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed() {
    // await this.entityManager.query('SET FOREIGN_KEY_CHECKS = 0');
    // await this.entityManager.query('UPDATE cash_entity SET balance = 10000');
    // await this.entityManager.query('UPDATE seat_entity SET isActive = 1');
    // await this.entityManager.query('DELETE FROM reservation_entity');
    // await this.entityManager.query('DELETE FROM payment_entity');
    // await this.entityManager.query('SET FOREIGN_KEY_CHECKS = 0');
    // await this.entityManager.query('SET FOREIGN_KEY_CHECKS = 1');

    const concertScheduleDate = [
      {
        concert: { id: 1 },
        totalSeats: 50,
        openAt: new Date(new Date().getTime() - 1000 * 60),
        closeAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 60 * 60),
        bookingStartAt: new Date(),
        bookingEndAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 60 * 60),
      },
    ];
    const concert = new ConcertEntity({
      name: '박효신 콘서트',
      concertSchedules: concertScheduleDate.map((el) => {
        return new ConcertScheduleEntity({
          concertId: el.concert.id,
          totalSeats: el.totalSeats,
          openAt: el.openAt,
          closeAt: el.closeAt,
          bookingStartAt: el.bookingStartAt,
          bookingEndAt: el.bookingEndAt,
          seats: Array.from({ length: el.totalSeats }).map((_, idx) => {
            return new SeatEntity({
              concertScheduleId: 1,
              isActive: true,
              seatNumber: idx + 1,
              price: 10000,
            });
          }),
        });
      }),
    });

    const users = Array.from({ length: 100 }).map((_______, idx) => {
      return new UserEntity({
        name: `user${idx + 1}`,
        cash: new CashEntity({
          userId: idx + 1,
          balance: 10000,
        }),
      });
    });

    await this.entityManager.save(concert);
    await this.entityManager.save(users);
  }
}
