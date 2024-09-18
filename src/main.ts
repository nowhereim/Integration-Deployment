import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from 'src/presentation/shared/config/swaggerconfig';
import { AllExceptionsFilter } from './presentation/shared/filter/exception.filter';
import { CustomLogger } from './common/logger/logger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    await app.startAllMicroservices();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get('Reflector')),
    );
    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(app, swaggerConfig),
    );
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(2323);
  } catch (e) {
    const logger = new CustomLogger();
    logger.logError({ message: e.message, stack: e.stack });
  }
}
bootstrap();
