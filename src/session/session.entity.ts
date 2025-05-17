import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base-entity';
import { SessionRoleEnum } from 'src/session/enum/session-role.enum';

@Entity('sessions')
export class SessionEntity extends BaseEntity {
  @Column({ nullable: false, type: 'bigint' })
  tg_id: number;

  @Column({ nullable: false, default: SessionRoleEnum.VISITOR, type: 'enum', enum: SessionRoleEnum })
  role: SessionRoleEnum;
}
