import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base-entity';

@Entity('sessions')
export class SessionEntity extends BaseEntity {
  @Column({ nullable: false, type: 'bigint' })
  tg_id: number;
}
