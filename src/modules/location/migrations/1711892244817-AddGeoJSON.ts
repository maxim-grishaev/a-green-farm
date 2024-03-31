import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGeoJSON1711892244817 implements MigrationInterface {
  public name = "AddGeoJSON1711892244817";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lat"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lng"`);
    await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "lat"`);
    await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "lng"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "coord" geography(Point,4326) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "farm" ADD "coord" geography(Point,4326) NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_0808a9f6dd1e1689ae7cca42e2" ON "user" USING GiST ("coord") `);
    await queryRunner.query(`CREATE INDEX "IDX_f44696235c5898ac1e0ff72573" ON "farm" USING GiST ("coord") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_f44696235c5898ac1e0ff72573"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0808a9f6dd1e1689ae7cca42e2"`);
    await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "coord"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coord"`);
    await queryRunner.query(`ALTER TABLE "farm" ADD "lng" double precision NOT NULL`);
    await queryRunner.query(`ALTER TABLE "farm" ADD "lat" double precision NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "lng" double precision NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "lat" double precision NOT NULL`);
  }
}
