import { BaseEntity } from 'src/common/entity/base-entity';
import { UserRoleEnum } from 'src/shared/api/openapi';

import { Column, Entity } from 'typeorm';

@Entity('training_report_notifications')
export class TrainingReportNotificationEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  training_uuid: string;

  @Column({ nullable: false, type: 'text' })
  role: UserRoleEnum;

  @Column({ type: 'uuid', nullable: false })
  team_uuid: string;
}
