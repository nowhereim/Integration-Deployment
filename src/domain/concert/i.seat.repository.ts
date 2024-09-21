import { UpdateResult } from 'typeorm';
import { Concert } from './models/concert';

export interface ISeatRepository {
  updateIsActiveWithOptimisticLock(
    args: { concert: Concert; seatId: number },
    transactionalEntityManager?: any,
  ): Promise<UpdateResult>;
}
