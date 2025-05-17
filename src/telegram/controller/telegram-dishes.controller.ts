import { Injectable } from '@nestjs/common';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { DishService } from 'src/dish/dish.service';
import { dishDetailMessage } from 'src/telegram/message/bot-messages';
import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

@Injectable()
@Update()
export class TelegramDishController {
  constructor(private readonly dishService: DishService) {}

  @Action(/^dish.+$/)
  async showDishDetail(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const dishId = callbackQuery.data.split(':')[1] as string;
    const dish = await this.dishService.findOneByUuid(dishId);
    if (!dish) {
      ctx.editMessageText('Упс, кажется это блюдо пропало из меню!', {
        reply_markup: { inline_keyboard: [[{ text: 'К меню', callback_data: 'back_to_main' }]] },
      });
      return;
    }

    await ctx.editMessageText(dishDetailMessage(dish), {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Добавляем! 👍', callback_data: `add_dish:${dish.uuid}` }],
          [{ text: 'Давай что-то другое! 😪', callback_data: 'back_to_main' }],
        ],
      },
    });
  }
}
