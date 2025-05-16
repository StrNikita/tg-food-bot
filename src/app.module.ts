import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentVariables } from './types/env';
import { TelegramModule } from './telegram/telegram.module';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { typeormConfig } from './common/db/migration.config';
import { ReportModule } from './report/report.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './common/modules/cron/cron.module';
import { TelegramExceptionFilter } from './common/exception-filter/telegram-exception.filter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.register({}),
    TypeOrmModule.forRoot(typeormConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: config => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
        const errors = validateSync(validatedConfig, { skipMissingProperties: false });
        if (errors.length > 0) {
          throw new Error(errors.toString());
        }

        return validatedConfig;
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src/i18n'),
        watch: true,
      },
      resolvers: [new QueryResolver(['lang', 'l'])],
    }),
    TelegramModule,
    ReportModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramExceptionFilter],
})
export class AppModule {}
