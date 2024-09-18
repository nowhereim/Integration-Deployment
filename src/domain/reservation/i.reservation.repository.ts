import { EntityManager } from 'typeorm';
import { SeatReservation } from './seat.reservation';

export interface IReservationRepository {
  save(
    args: SeatReservation,
    transactionalEntityManager?: EntityManager,
  ): Promise<SeatReservation>;
  saveAll(
    args: SeatReservation[],
    transactionalEntityManager?: EntityManager,
  ): Promise<SeatReservation[]>;
  findByUserId(args: { userId: number }): Promise<SeatReservation>;
  findAllByUserIdOrSeatId(args: {
    userId: number;
    seatId: number;
  }): Promise<SeatReservation[]>;
  findBySeatId(args: { seatId: number }): Promise<SeatReservation>;
  findExpired(someTime: Date): Promise<SeatReservation[]>;
}
