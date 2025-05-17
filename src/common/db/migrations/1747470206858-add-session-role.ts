import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionsRole1747470206858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."sessions_role_enum" AS ENUM('chef', 'visitor')
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD "role" "public"."sessions_role_enum" NOT NULL DEFAULT 'visitor'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP COLUMN "role"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."sessions_role_enum"
        `);
  }
}
