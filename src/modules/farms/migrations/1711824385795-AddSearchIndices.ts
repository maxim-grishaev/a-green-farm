import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchIndices1711824385795 implements MigrationInterface {
  public name = "AddSearchIndices1711824385795";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "name-idx" ON "farm" ("name") `);
    await queryRunner.query(`CREATE INDEX "yield-idx" ON "farm" ("yield") `);
    await queryRunner.query(`CREATE INDEX "date-idx" ON "farm" ("updatedAt") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."date-idx"`);
    await queryRunner.query(`DROP INDEX "public"."yield-idx"`);
    await queryRunner.query(`DROP INDEX "public"."name-idx"`);
  }
}
