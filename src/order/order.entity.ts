import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base-entity';
import { DishEntity } from 'src/dish/dish.entity';
import { OrderStatusEnum } from 'src/order/enum/order-status.enum';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @Column({ nullable: false, type: 'bigint' })
  creator_tg_id: number;

  @Column({ nullable: false, type: 'enum', default: OrderStatusEnum.DRAFT, enum: OrderStatusEnum })
  status: OrderStatusEnum;

  @Column({ nullable: true, type: 'text' })
  rate: string;

  @ManyToMany(() => DishEntity, dish => dish.orders)
  @JoinTable()
  dishes: DishEntity[];
}
