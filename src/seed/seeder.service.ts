import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

/**
 * @Note 테스트용 시드 데이터
 * */
@Injectable()
export class SeederService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed() {
    await this.entityManager.query('SET FOREIGN_KEY_CHECKS = 0');
    await this.entityManager.query('UPDATE cash_entity SET balance = 10000');
    await this.entityManager.query('UPDATE seat_entity SET isActive = 1');
    await this.entityManager.query('DELETE FROM reservation_entity');
    await this.entityManager.query('DELETE FROM payment_entity');
  }
}
