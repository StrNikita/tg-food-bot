import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentVariables } from './types/env';
import { TelegramModule } from './telegram/telegram.module';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { typeormConfig } from './common/db/migration.config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './common/modules/cron/cron.module';
import { TelegramExceptionFilter } from './common/exception-filter/telegram-exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from 'src/session/session.module';

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
    TelegramModule,
    CronModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramExceptionFilter],
})
export class AppModule {}
