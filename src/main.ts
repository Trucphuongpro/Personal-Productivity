import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/http-exception.filter';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: winstonLogger.transports,
    }),
  });

  winstonLogger.info('Application starting');

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // chỉ nhận field trong DTO
      forbidNonWhitelisted: true, // gửi field lạ sẽ báo lỗi
      transform: true, // tự convert kiểu dữ liệu
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('STAGE =', process.env.STAGE);
  console.log('STAGE =', process.env.DB_DATABASE);
}
import { winstonLogger } from './logger/winstone.logger';
bootstrap();
