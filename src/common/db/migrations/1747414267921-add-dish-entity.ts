import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDishEntity1747414267921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."dishes_dish_type_enum" AS ENUM('drink', 'dessert', 'main')
        `);
    await queryRunner.query(`
            CREATE TABLE "dishes" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "photo_url" text NOT NULL,
                "name" text NOT NULL,
                "description" text NOT NULL,
                "dish_type" "public"."dishes_dish_type_enum" NOT NULL,
                CONSTRAINT "PK_2e8d885738a1f99b21e45ebc8a2" PRIMARY KEY ("uuid")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "dishes"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."dishes_dish_type_enum"
        `);
  }
}
