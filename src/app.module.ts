import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database.module';
import { ConcertModule } from './modules/concert.module';
import { PaymentModule } from './modules/payment.module';
import { QueueModule } from './modules/queue.module';
import { ReservationModule } from './modules/reservation.module';
import { UserModule } from './modules/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './presentation/shared/middleware/http-log.middleware';
import { CustomLogger } from './common/logger/logger';
import { RedisModule } from './modules/redis.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsModule } from 'src/modules/metrics.module';
import { MetricsMiddleware } from './presentation/shared/middleware/metrics';
import { SeederService } from './seed/seeder.service';
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
    }),
    MetricsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    ConcertModule,
    PaymentModule,
    QueueModule,
    ReservationModule,
    UserModule,
    RedisModule,
  ],
  controllers: [],
  providers: [CustomLogger, SeederService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
