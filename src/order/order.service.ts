import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/order/order.repository';
import { OrderEntity } from 'src/order/order.entity';
import { OrderStatusEnum } from 'src/order/enum/order-status.enum';
import { DishService } from 'src/dish/dish.service';
import EventEmitter2 from 'eventemitter2';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly dishService: DishService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async find(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  public async findAllByType(status: OrderStatusEnum): Promise<OrderEntity[]> {
    return this.orderRepository.findAllByStatus(status);
  }

  public async findDraftOrderByTgId(tgId: number): Promise<OrderEntity | null> {
    return this.orderRepository.findDraftOrderByTgId(tgId);
  }

  public async findOneByUuid(uuid: string): Promise<OrderEntity | null> {
    return this.orderRepository.findOneByUuid(uuid);
  }

  public async createOrderWithDish(orderData: Partial<OrderEntity>, dishId: string): Promise<OrderEntity> {
    const dish = await this.dishService.findOneByUuid(dishId);
    if (!dish) {
      throw new Error('Dish not found');
    }

    return this.orderRepository.createOrderWithDish(orderData, dish);
  }

  public async addDishToOrder(orderId: string, dishId: string): Promise<OrderEntity> {
    const dish = await this.dishService.findOneByUuid(dishId);
    if (!dish) {
      throw new Error('Dish not found');
    }

    return this.orderRepository.addDishToOrder(orderId, dish);
  }

  public async updateStatus(orderId: string, status: OrderStatusEnum): Promise<void> {
    await this.orderRepository.updateStatus(orderId, status);

    if (status === OrderStatusEnum.PENDING) {
      this.eventEmitter.emit('order.pending', { orderId });
    } else if (status === OrderStatusEnum.IN_PROGRESS) {
      this.eventEmitter.emit('order.in_progress', { orderId });
    } else if (status === OrderStatusEnum.COMPLETED) {
      this.eventEmitter.emit('order.completed', { orderId });
    }
  }

  public async updateRate(orderId: string, rate: string): Promise<void> {
    await this.orderRepository.updateRate(orderId, rate);

    this.eventEmitter.emit('order.rated', { orderId });
  }
}
