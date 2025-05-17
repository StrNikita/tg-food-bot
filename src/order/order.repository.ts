import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatusEnum } from 'src/order/enum/order-status.enum';
import { OrderEntity } from 'src/order/order.entity';
import { DishEntity } from 'src/dish/dish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntity: Repository<OrderEntity>,
  ) {}

  public async find(): Promise<OrderEntity[]> {
    return this.orderEntity.find();
  }

  public async findAllByStatus(orderStatus: OrderStatusEnum): Promise<OrderEntity[]> {
    return this.orderEntity.find({
      where: { status: orderStatus },
    });
  }

  public async findDraftOrderByTgId(tgId: number): Promise<OrderEntity | null> {
    return this.orderEntity.findOne({
      where: { creator_tg_id: tgId, status: OrderStatusEnum.DRAFT },
      relations: ['dishes'],
    });
  }

  public async findByCreatorTgId(tgId: number): Promise<OrderEntity[]> {
    return this.orderEntity.find({
      where: { creator_tg_id: tgId },
    });
  }

  public async findOneByUuid(uuid: string): Promise<OrderEntity | null> {
    const dish = await this.orderEntity.findOne({
      where: { uuid },
      relations: ['dishes'],
    });

    return dish;
  }

  public async createOrderWithDish(orderData: Partial<OrderEntity>, dish: DishEntity): Promise<OrderEntity> {
    const order = this.orderEntity.create({ ...orderData, status: OrderStatusEnum.DRAFT });
    order.dishes = [dish];
    return this.orderEntity.save(order);
  }

  public async addDishToOrder(orderId: string, dish: DishEntity): Promise<OrderEntity> {
    const order = await this.orderEntity.findOne({
      where: { uuid: orderId },
      relations: ['dishes'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.dishes.push(dish);
    return this.orderEntity.save(order);
  }

  public async updateStatus(orderId: string, status: OrderStatusEnum): Promise<void> {
    const order = await this.findOneByUuid(orderId);
    if (!order) {
      return;
    }

    await this.orderEntity.update(orderId, { status });

    if (status === OrderStatusEnum.PENDING) {
      console.log('notify nikita with ', order.uuid);
    }
  }
}
