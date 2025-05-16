import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './types/env';
import { TelegramExceptionFilter } from './common/exception-filter/telegram-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  app.useGlobalFilters(app.get(TelegramExceptionFilter));

  await app.listen(configService.get('SERVER_PORT', { infer: true }));
}

bootstrap();
