import { Injectable } from '@nestjs/common';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
@Update()
export class TelegramCommandController {
  constructor() {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    ctx.reply('Welcome to the bot!');
  }

  @Command('stop')
  async logout(@Ctx() ctx: Context) {
    ctx.reply('You have logged out');
  }
}
