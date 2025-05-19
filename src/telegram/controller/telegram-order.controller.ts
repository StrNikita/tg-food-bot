import { Injectable } from '@nestjs/common';
import EventEmitter2 from 'eventemitter2';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { OrderStatusEnum } from 'src/order/enum/order-status.enum';
import { OrderService } from 'src/order/order.service';
import {
  approvedOrderMessage,
  chefAcceptOrderMessage,
  chefCompleteOrderMessage,
  chefDoneOrderMessage,
  dishAddedToOrderMessage,
  orderMessage,
  orderRatedMessage,
} from 'src/telegram/message/bot-messages';
import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

@Injectable()
@Update()
export class TelegramOrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
    await this.orderService.updateStatus(existedOrder.uuid, OrderStatusEnum.PENDING);
  }

  @Action(/^order_rated.+$/)
  async orderRated(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const orderId = callbackQuery.data.split(':')[1] as string;
    const rate = callbackQuery.data.split(':')[2] as string;

    const existedOrder = await this.orderService.findOneByUuid(orderId);
    if (existedOrder?.status !== OrderStatusEnum.COMPLETED) {
      await ctx.editMessageText('Что-то явно пошло не так', {
        reply_markup: { inline_keyboard: [[{ text: 'Назад', callback_data: 'back_to_main' }]] },
      });
      return;
    }

    await ctx.editMessageText(orderRatedMessage(), {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🍽 Основное Меню', callback_data: 'show_menu' }],
          [{ text: '☕️ Барное меню', callback_data: 'show_drinks' }],
          [{ text: '📄 Заказ', callback_data: 'show_order' }],
        ],
      },
    });
    await this.orderService.updateRate(existedOrder.uuid, rate);
  }

  @Action(/^accept_order.+$/)
  async acceptOrder(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const orderId = callbackQuery.data.split(':')[1] as string;

    const existedOrder = await this.orderService.findOneByUuid(orderId);
    if (!existedOrder || !existedOrder.dishes.length) {
      await ctx.editMessageText('Кажется, пока ничего нет', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'back_to_main' }]],
        },
      });

      return;
    }

    await ctx.editMessageText(chefAcceptOrderMessage(), {
      reply_markup: { inline_keyboard: [[{ text: 'Готово', callback_data: `order_done:${orderId}` }]] },
    });
    await this.orderService.updateStatus(existedOrder.uuid, OrderStatusEnum.IN_PROGRESS);
  }

  @Action(/^order_done.+$/)
  async orderDoneOrder(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const orderId = callbackQuery.data.split(':')[1] as string;

    const existedOrder = await this.orderService.findOneByUuid(orderId);
    if (!existedOrder || !existedOrder.dishes.length) {
      await ctx.editMessageText('Кажется, пока ничего нет', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'back_to_main' }]],
        },
      });

      return;
    }

    await ctx.editMessageText(chefCompleteOrderMessage(), {
      reply_markup: { inline_keyboard: [[{ text: 'Готово', callback_data: `order_delivered:${orderId}` }]] },
    });

    await this.orderService.updateStatus(existedOrder.uuid, OrderStatusEnum.COMPLETED);
  }

  @Action(/^order_delivered.+$/)
  async orderDeliveredOrder(@Ctx() ctx: Context) {
    if (!ctx.from) {
      return;
    }

    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const orderId = callbackQuery.data.split(':')[1] as string;

    const existedOrder = await this.orderService.findOneByUuid(orderId);
    if (!existedOrder || !existedOrder.dishes.length) {
      await ctx.editMessageText('Кажется, пока ничего нет', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'back_to_main' }]],
        },
      });

      return;
    }

    await ctx.editMessageText(chefDoneOrderMessage());
    this.eventEmitter.emit('order.delivered', { orderId });
  }
}
