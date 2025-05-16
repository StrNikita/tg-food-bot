import { Catch, ExceptionFilter, Injectable, Logger } from '@nestjs/common';
import { TelegrafException } from 'nestjs-telegraf';

@Injectable()
@Catch(Error)
export class TelegramExceptionFilter implements ExceptionFilter {
  constructor() {}
  async catch(exception: Error | TelegrafException) {
    Logger.error(`Ошибка: ${exception.message}`, exception.message);
  }
}
