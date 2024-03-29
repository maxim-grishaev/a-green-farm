import { MigrationInterface, QueryRunner } from "typeorm";

export class WithLocation1711731016105 implements MigrationInterface {
    name = 'WithLocation1711731016105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" ADD "lat" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "lng" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lat" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lng" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "lat"`);
    }

}
