import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { EnvironmentVariables } from 'src/types/env';
import { TelegramCommandController } from './controller/telegram-command.controller';
import { SessionModule } from 'src/session/session.module';
import { TelegramActionController } from 'src/telegram/controller/telegram-action.controller';
import { DishModule } from 'src/dish/dish.module';

@Module({
  imports: [
    ConfigModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        middlewares: [session()],
      }),
    }),
    SessionModule,
    DishModule,
  ],
  providers: [TelegramCommandController, TelegramActionController],
  exports: [],
})
export class TelegramModule {}
