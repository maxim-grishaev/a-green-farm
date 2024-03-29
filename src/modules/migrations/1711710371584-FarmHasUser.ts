import { MigrationInterface, QueryRunner } from "typeorm";

export class FarmHasUser1711710371584 implements MigrationInterface {
    name = 'FarmHasUser1711710371584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "UQ_11527b5b142bb3e07f87d459802"`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "UQ_4b927070448c8725f6352eef804" UNIQUE ("name", "userId")`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_fe2fe67c9ca2dc03fff76cd04a9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_fe2fe67c9ca2dc03fff76cd04a9"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "UQ_4b927070448c8725f6352eef804"`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "UQ_11527b5b142bb3e07f87d459802" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "userId"`);
    }

}
