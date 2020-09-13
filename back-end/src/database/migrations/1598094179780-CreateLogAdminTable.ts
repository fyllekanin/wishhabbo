import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLogAdminTable1598094179780 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'log_admin',
            indices: [
                {
                    columnNames: [ 'id' ]
                },
                {
                    columnNames: [ 'contentId' ]
                },
                {
                    columnNames: [ 'userId' ]
                },
                {
                    columnNames: [ 'beforeChange' ],
                    isFulltext: true
                },
                {
                    columnNames: [ 'afterChange' ],
                    isFulltext: true
                },
                {
                    columnNames: [ 'ip' ]
                },
                {
                    columnNames: [ 'createdAt' ]
                },
                {
                    columnNames: [ 'updatedAt' ]
                }
            ],
            columns: [
                {
                    name: 'logId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'id',
                    type: 'int'
                },
                {
                    name: 'contentId',
                    type: 'int'
                },
                {
                    name: 'userId',
                    type: 'int'
                },
                {
                    name: 'beforeChange',
                    type: 'longtext',
                    isNullable: true,
                    default: null
                },
                {
                    name: 'afterChange',
                    type: 'longtext',
                    isNullable: true,
                    default: null
                },
                {
                    name: 'ip',
                    type: 'varchar'
                },
                {
                    name: 'createdAt',
                    type: 'int',
                },
                {
                    name: 'updatedAt',
                    type: 'int'
                }
            ]
        }), true);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('log_admin');
    }
}
