import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserdataTable1600274240411 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'userdata',
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
                    name: 'userdataId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'userId',
                    type: 'int',
                    isUnique: true
                },
                {
                    name: 'role',
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
        await queryRunner.dropTable('users');
    }
}
