import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1689405338661 implements MigrationInterface {
    name = 'Migration1689405338661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`todo\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`content\` varchar(255) NOT NULL COMMENT 'TODO 내용', \`started_at\` datetime NULL COMMENT 'TODO 시작 시간', \`finished_at\` datetime NULL COMMENT 'TODO 완료 시간', \`completed_at\` datetime NULL COMMENT 'TODO 완료 시간', \`user_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`auth0_id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`profile_image_url\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_5222bec366027bdf8b11212001\` (\`auth0_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`content\` varchar(255) NOT NULL COMMENT '리뷰 내용', \`started_at\` datetime NULL COMMENT '시작일', \`finished_at\` datetime NULL COMMENT '종료일', \`user_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`todo\` ADD CONSTRAINT \`FK_9cb7989853c4cb7fe427db4b260\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_81446f2ee100305f42645d4d6c2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_81446f2ee100305f42645d4d6c2\``);
        await queryRunner.query(`ALTER TABLE \`todo\` DROP FOREIGN KEY \`FK_9cb7989853c4cb7fe427db4b260\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP INDEX \`IDX_5222bec366027bdf8b11212001\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`todo\``);
    }

}
