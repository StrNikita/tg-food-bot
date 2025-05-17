import { Injectable } from '@nestjs/common';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { DishService } from 'src/dish/dish.service';
import { DishType } from 'src/dish/enum/dish-type.enum';
import { DishButtons } from 'src/telegram/helper/buttons';
import { drinksMenuMessage, mainMenuMessage } from 'src/telegram/message/bot-messages';
import { Context } from 'telegraf';

@Injectable()
@Update()
export class TelegramActionController {
  constructor(private readonly dishService: DishService) {}

  @Action('show_menu')
  async showMenu(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const dishes = await this.dishService.findAllByType(DishType.MAIN);
    await ctx.editMessageText(mainMenuMessage(), {
      reply_markup: {
        inline_keyboard: [...DishButtons(dishes), [{ text: '🔙 Вернутся', callback_data: 'back_to_main' }]],
      },
    });
  }

  @Action('show_drinks')
  async showDrinks(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const dishes = await this.dishService.findAllByType(DishType.DRINK);
    await ctx.editMessageText(drinksMenuMessage(), {
      reply_markup: {
        inline_keyboard: [...DishButtons(dishes), [{ text: '🔙 Вернутся', callback_data: 'back_to_main' }]],
      },
    });
  }

  @Action('back_to_main')
  async backToMainMenu(@Ctx() ctx: Context) {
    await ctx.editMessageText('Что нибудь ещё или посмотрим заказ?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🍽 Основное Меню', callback_data: 'show_menu' }],
          [{ text: '☕️ Барное меню', callback_data: 'show_drinks' }],
          [{ text: '📄 Заказ', callback_data: 'show_order' }],
        ],
      },
    });
  }
}
