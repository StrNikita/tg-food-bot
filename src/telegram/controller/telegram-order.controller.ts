import { Injectable } from '@nestjs/common';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { OrderStatusEnum } from 'src/order/enum/order-status.enum';
import { OrderService } from 'src/order/order.service';
import { approvedOrderMessage, dishAddedToOrderMessage, orderMessage } from 'src/telegram/message/bot-messages';
import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

@Injectable()
@Update()
export class TelegramOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Action(/^add_dish.+$/)
  async addDishToOrder(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const dishId = callbackQuery.data.split(':')[1] as string;
    const existedOrder = await this.orderService.findDraftOrderByTgId(ctx.from.id);
    if (!existedOrder) {
      await this.orderService.createOrderWithDish({ creator_tg_id: ctx.from.id }, dishId);
    } else {
      await this.orderService.addDishToOrder(existedOrder.uuid, dishId);
    }

    await ctx.editMessageText(dishAddedToOrderMessage(), {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Покажи-ка ещё раз меню', callback_data: 'back_to_main' }],
          [{ text: 'Это всё!', callback_data: 'show_order' }],
        ],
      },
    });
  }

  @Action('show_order')
  async showOrder(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const existedOrder = await this.orderService.findDraftOrderByTgId(ctx.from.id);
    if (!existedOrder || !existedOrder.dishes.length) {
      await ctx.editMessageText('Кажется, пока ничего нет', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'back_to_main' }]],
        },
      });

      return;
    }

    await ctx.editMessageText(orderMessage(existedOrder.dishes), {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Готовим! Жду заказ ☺️', callback_data: `approve_order` }],
          [{ text: 'Дай-ка ещё посмотрю меню', callback_data: 'back_to_main' }],
        ],
      },
    });
  }

  @Action('approve_order')
  async approveOrder(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const existedOrder = await this.orderService.findDraftOrderByTgId(ctx.from.id);
    if (!existedOrder || !existedOrder.dishes.length) {
      await ctx.editMessageText('Кажется, пока ничего нет', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'back_to_main' }]],
        },
      });

      return;
    }

    await ctx.editMessageText(approvedOrderMessage());
    await this.orderService.updateStatus(existedOrder.uuid, OrderStatusEnum.IN_PROGRESS);
  }
}
