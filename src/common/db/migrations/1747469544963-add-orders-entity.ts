import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrdersEntity1747469544963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."orders_status_enum" AS ENUM(
                'draft',
                'pending',
                'confirmed',
                'in_progress',
                'completed'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "creator_tg_id" bigint NOT NULL,
                "status" "public"."orders_status_enum" NOT NULL DEFAULT 'draft',
                CONSTRAINT "PK_04a64e7c04376e27182f8c0fa17" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "orders_dishes_dishes" (
                "ordersUuid" uuid NOT NULL,
                "dishesUuid" uuid NOT NULL,
                CONSTRAINT "PK_74a0d8c0fb54ff63d94c2b9366e" PRIMARY KEY ("ordersUuid", "dishesUuid")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_75361b6eb34420c8849468f45c" ON "orders_dishes_dishes" ("ordersUuid")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_72101ad55fe557091885f23c3d" ON "orders_dishes_dishes" ("dishesUuid")
        `);
    await queryRunner.query(`
            ALTER TABLE "orders_dishes_dishes"
            ADD CONSTRAINT "FK_75361b6eb34420c8849468f45c3" FOREIGN KEY ("ordersUuid") REFERENCES "orders"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "orders_dishes_dishes"
            ADD CONSTRAINT "FK_72101ad55fe557091885f23c3da" FOREIGN KEY ("dishesUuid") REFERENCES "dishes"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders_dishes_dishes" DROP CONSTRAINT "FK_72101ad55fe557091885f23c3da"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders_dishes_dishes" DROP CONSTRAINT "FK_75361b6eb34420c8849468f45c3"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_72101ad55fe557091885f23c3d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_75361b6eb34420c8849468f45c"
        `);
    await queryRunner.query(`
            DROP TABLE "orders_dishes_dishes"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."orders_status_enum"
        `);
  }
}
