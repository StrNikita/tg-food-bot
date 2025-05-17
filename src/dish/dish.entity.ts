import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base-entity';
import { DishType } from 'src/dish/enum/dish-type.enum';
import { OrderEntity } from 'src/order/order.entity';

@Entity('dishes')
export class DishEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' })
  photo_url: string;

  @Column({ nullable: false, type: 'text' })
  name: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'enum', enum: DishType })
  dish_type: DishType;

  @ManyToMany(() => OrderEntity, order => order.dishes)
  orders: OrderEntity[];
}
