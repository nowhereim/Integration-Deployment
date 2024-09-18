import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('콘서트 예약 서비스 API 목록 입니다.')
  .setDescription(
    '콘서트 예약 서비스 API 목록 입니다. 문의사항은 태환이에게 주세요.',
  )
  .setVersion('0.1')
  .build();
