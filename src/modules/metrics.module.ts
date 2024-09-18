import { Module } from '@nestjs/common';
import { makeHistogramProvider } from '@willsoto/nestjs-prometheus';

@Module({
  providers: [
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'path'],
      buckets: [0.1, 0.5, 1, 1.5, 2, 2.5, 3, 5, 10, 20, 30, 60],
    }),
  ],
  exports: [
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'path'],
      buckets: [0.1, 0.5, 1, 1.5, 2, 2.5, 3, 5, 10, 20, 30, 60],
    }),
  ],
})
export class MetricsModule {}
