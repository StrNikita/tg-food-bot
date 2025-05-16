import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from 'src/session/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionEntity: Repository<SessionEntity>,
  ) {}

  public async findOneByTgId(tg_id: number): Promise<SessionEntity | null> {
    const session = await this.sessionEntity.findOne({
      where: { tg_id },
    });

    return session;
  }

  public async create(tg_id: number): Promise<SessionEntity> {
    const session = this.sessionEntity.create({ tg_id });

    return this.sessionEntity.save(session);
  }
}
