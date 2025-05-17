import { Injectable } from '@nestjs/common';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { SessionService } from 'src/session/session.service';
import { greetingsMessage } from 'src/telegram/message/bot-messages';
import { Context } from 'telegraf';

@Injectable()
@Update()
export class TelegramCommandController {
  constructor(private readonly sessionService: SessionService) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }
    const existedSession = await this.sessionService.getOneByTgId(ctx.from.id);
    if (existedSession) {
      await ctx.reply('Ещё раз здравствуйте!', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🍽 Основное Меню', callback_data: 'show_menu' }],
            [{ text: '☕️ Барное меню', callback_data: 'show_drinks' }],
            [{ text: '📄 Заказ', callback_data: 'show_order' }],
          ],
        },
      });
      return;
    }

    await this.sessionService.create(ctx.from.id);
    await ctx.reply(greetingsMessage(), {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🍽 Основное Меню', callback_data: 'show_menu' }],
          [{ text: '☕️ Барное меню', callback_data: 'show_drinks' }],
          [{ text: '📄 Заказ', callback_data: 'show_order' }],
        ],
      },
    });
  }

  @Command('stop')
  async logout(@Ctx() ctx: Context) {
    ctx.reply('You have logged out');
  }
}
