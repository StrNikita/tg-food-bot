import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRateToOrder1747473094938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "rate" text
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "rate"
        `);
  }
}
