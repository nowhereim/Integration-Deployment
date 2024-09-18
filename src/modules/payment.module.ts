import { Module } from '@nestjs/common';
import { PaymentFacadeApp } from 'src/application/payment/payment.facade';
import { PaymentService } from 'src/domain/payment/payment.service';
import { PaymentRepositoryImpl } from 'src/infrastructure/core/payment/payment.repository';
import { PaymentController } from 'src/presentation/payment/payment.controller';
import { ConcertModule } from './concert.module';
import { ReservationModule } from './reservation.module';
import { UserModule } from './user.module';
import { QueueModule } from './queue.module';
import { CqrsModule } from '@nestjs/cqrs';
@Module({
  imports: [
    ConcertModule,
    ReservationModule,
    UserModule,
    QueueModule,
    CqrsModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentFacadeApp,
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepositoryImpl,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
