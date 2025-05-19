import { Injectable } from '@nestjs/common';
import { SessionEntity } from 'src/session/session.entity';
import { SessionRepository } from 'src/session/session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  public async getOneByTgId(tg_id: number): Promise<SessionEntity | null> {
    return this.sessionRepository.findOneByTgId(tg_id);
  }

  public async getOneChef(): Promise<SessionEntity | null> {
    return this.sessionRepository.findOneChef();
  }

  public async create(tg_id: number): Promise<void> {
    await this.sessionRepository.create(tg_id);
  }
}
