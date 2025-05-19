import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/types/env';
import { Telegraf } from 'telegraf';
import { OrderService } from 'src/order/order.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SessionService } from 'src/session/session.service';
import {
  chefAcceptedOrderMessage,
  chefCompletedOrderMessage,
  chefOrderDoneMessage,
  chefOrderMessage,
  chefOrderRatedMessage,
} from 'src/telegram/message/bot-messages';

@Injectable()
export class TelegramSenderService {
  private bot: Telegraf;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly orderService: OrderService,
    private readonly sessionService: SessionService,
  ) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(botToken);
  }

  @OnEvent('order.rated')
  public async sendOrderRatedNotificationToChef({ orderId }: { orderId: string }) {
    const order = await this.orderService.findOneByUuid(orderId);
    const chefSession = await this.sessionService.getOneChef();
    if (!chefSession || !order) {
      return;
    }

    try {
      await this.bot.telegram.sendMessage(chefSession.tg_id, chefOrderRatedMessage(order.rate), {
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения пользователю:', error);
    }
  }

  @OnEvent('order.pending')
  public async sendNewOrderNotificationToChef({ orderId }: { orderId: string }) {
    const order = await this.orderService.findOneByUuid(orderId);
    const chefSession = await this.sessionService.getOneChef();
    if (!chefSession || !order) {
      return;
    }

    try {
      await this.bot.telegram.sendMessage(chefSession.tg_id, chefOrderMessage(order.dishes), {
        reply_markup: {
          inline_keyboard: [[{ text: 'Принять', callback_data: `accept_order:${order.uuid}` }]],
        },
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения пользователю:', error);
    }
  }

  @OnEvent('order.in_progress')
  public async sendOrderInProgressNotificationToVisitor({ orderId }: { orderId: string }) {
    const order = await this.orderService.findOneByUuid(orderId);
    if (!order) {
      return;
    }
    const visitorSession = await this.sessionService.getOneByTgId(order?.creator_tg_id);
    if (!visitorSession) {
      return;
    }

    try {
      await this.bot.telegram.sendMessage(visitorSession.tg_id, chefAcceptedOrderMessage(), {
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения пользователю:', error);
    }
  }

  @OnEvent('order.completed')
  public async sendOrderCompleteNotificationToVisitor({ orderId }: { orderId: string }) {
    const order = await this.orderService.findOneByUuid(orderId);
    if (!order) {
      return;
    }
    const visitorSession = await this.sessionService.getOneByTgId(order?.creator_tg_id);
    if (!visitorSession) {
      return;
    }

    try {
      await this.bot.telegram.sendMessage(visitorSession.tg_id, chefCompletedOrderMessage(), {
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения пользователю:', error);
    }
  }

  @OnEvent('order.delivered')
  public async sendOrderDeliveredNotificationToVisitor({ orderId }: { orderId: string }) {
    const order = await this.orderService.findOneByUuid(orderId);
    if (!order) {
      return;
    }

    const visitorSession = await this.sessionService.getOneByTgId(order?.creator_tg_id);
    if (!visitorSession) {
      return;
    }

    try {
      await this.bot.telegram.sendMessage(visitorSession.tg_id, chefOrderDoneMessage(), {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '1',
                callback_data: `order_rated:${order.uuid}:1`,
              },
              {
                text: '2',
                callback_data: `order_rated:${order.uuid}:2`,
              },
              {
                text: '3',
                callback_data: `order_rated:${order.uuid}:3`,
              },
              {
                text: '4',
                callback_data: `order_rated:${order.uuid}:4`,
              },
              {
                text: '5',
                callback_data: `order_rated:${order.uuid}:5`,
              },
            ],
          ],
        },
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения пользователю:', error);
    }
  }
}
