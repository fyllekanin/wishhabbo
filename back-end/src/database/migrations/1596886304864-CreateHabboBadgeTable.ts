import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBadgesTable1596886304003 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'habbo_badges',
            columns: [
                {
                    name: 'habboBadgeId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'badgeId',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'description',
                    type: 'longtext',
                },
                {
                    name: 'createdAt',
                    type: 'int',
                },
                {
                    name: 'updatedAt',
                    type: 'int',
                }
            ]
        }), true);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('habbo_badges');
    }
}
