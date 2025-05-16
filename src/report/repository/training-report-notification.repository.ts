import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TrainingReportNotificationEntity } from '../entity/training-report-notification.entity';

@Injectable()
export class TrainingReportNotificationRepository {
  constructor(
    @InjectRepository(TrainingReportNotificationEntity)
    private readonly trainingReportNotificationEntity: Repository<TrainingReportNotificationEntity>,
  ) {}

  public async getByUuid(uuid: string): Promise<TrainingReportNotificationEntity | null> {
    return this.trainingReportNotificationEntity.findOne({
      where: { uuid },
    });
  }

  public async getPlayerNotificationByUuid(
    training_uuid: string,
    team_uuid: string,
  ): Promise<TrainingReportNotificationEntity | null> {
    return this.trainingReportNotificationEntity.findOne({
      where: { training_uuid, team_uuid, role: 'player' },
    });
  }

  public async findDuplicateCoachTrainingEventsUuids(trainingEventUuids: string[]): Promise<string[]> {
    const trainingEvents = await this.trainingReportNotificationEntity.find({
      where: { training_uuid: In(trainingEventUuids), role: 'coach' },
    });

    return trainingEvents.map(trainingEvent => trainingEvent.training_uuid);
  }

  public async getNotificationDataByTrainingEventUuid(trainingEventUuid: string) {
    return this.trainingReportNotificationEntity.findOne({
      where: {
        training_uuid: trainingEventUuid,
      },
    });
  }
}
