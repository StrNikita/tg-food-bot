import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/session/session.entity';
import { SessionRepository } from 'src/session/session.repository';
import { SessionService } from 'src/session/session.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
