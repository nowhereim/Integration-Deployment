import { Inject, Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from './payment';
import { IPaymentRepository } from './i.payment.repository';
import { EntityManager } from 'typeorm';
import { notFound } from '../exception/exceptions';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async pay(
    args: {
      userId: number;
      seatNumber: number;
      concertName: string;
      openAt: Date;
      closeAt: Date;
      totalAmount: number;
    },
    transactionalEntityManager?: EntityManager,
  ): Promise<Payment> {
    const payment = new Payment({
      status: PaymentStatus.PENDING,
      ...args,
    });

    const savedPayment = await this.paymentRepository.save(
      payment,
      transactionalEntityManager,
    );

    return savedPayment;
  }

  async completePayment(
    args: { paymentId: number },
    transactionalEntityManager?: EntityManager,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findByPaymentId(
      args,
      transactionalEntityManager,
    );
    if (!payment)
      throw notFound('결제를 찾을 수 없습니다.', {
        cause: `paymentId: ${args.paymentId} not found`,
      });
    payment.complete();
    return await this.paymentRepository.save(
      payment,
      transactionalEntityManager,
    );
  }

  async failPayment(args: { paymentId: number }): Promise<Payment> {
    const payment = await this.paymentRepository.findByPaymentId(args);
    if (!payment)
      throw notFound('결제를 찾을 수 없습니다.', {
        cause: `paymentId: ${args.paymentId} not found`,
      });
    payment.fail();
    return await this.paymentRepository.save(payment);
  }
}
