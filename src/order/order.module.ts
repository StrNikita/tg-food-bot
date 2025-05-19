import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishModule } from 'src/dish/dish.module';
import { OrderEntity } from 'src/order/order.entity';
import { OrderRepository } from 'src/order/order.repository';
import { OrderService } from 'src/order/order.service';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), DishModule, SessionModule],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
