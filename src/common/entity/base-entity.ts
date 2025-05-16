import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly uuid: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  readonly created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  readonly updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  readonly deleted_at: Date | null;
}
