import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSettingsTable1599661304714 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'settings',
            indices: [
                {
                    columnNames: [ 'createdAt' ]
                },
                {
                    columnNames: [ 'updatedAt' ]
                }
            ],
            columns: [
                {
                    name: 'settingId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'key',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'value',
                    type: 'longtext'
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
        await queryRunner.dropTable('settings');
    }
}
