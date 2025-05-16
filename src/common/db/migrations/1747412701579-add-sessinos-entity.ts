import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionsEntity1747412701579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "tg_id" bigint NOT NULL,
                CONSTRAINT "PK_faf29798ea59ac7f07b1be6f79b" PRIMARY KEY ("uuid")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
  }
}
