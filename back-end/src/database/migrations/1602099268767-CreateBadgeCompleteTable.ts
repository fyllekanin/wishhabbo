import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBadgeCompleteTable1602099268767 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'badge_complete',
            indices: [
                {
                    columnNames: ['createdAt']
                },
                {
                    columnNames: ['updatedAt']
                },
                {
                    columnNames: ['userId']
                },
                {
                    columnNames: ['badgeId']
                }
            ],
            columns: [
                {
                    name: 'badgeCompleteId',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: 'userId',
                    type: 'int'
                },
                {
                    name: 'badgeId',
                    type: 'varchar'
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
        await queryRunner.dropTable('bbcodes');
    }
}
