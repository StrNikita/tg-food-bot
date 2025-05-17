import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishModule } from 'src/dish/dish.module';
import { OrderEntity } from 'src/order/order.entity';
import { OrderRepository } from 'src/order/order.repository';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), DishModule],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
