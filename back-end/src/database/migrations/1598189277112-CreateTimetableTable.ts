import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGroupTable1598189277112 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'timetable',
            indices: [
                {
                    columnNames: [ 'createdAt' ]
                },
                {
                    columnNames: [ 'updatedAt' ]
                },
                {
                    columnNames: [ 'type' ]
                },
                {
                    columnNames: [ 'userId' ]
                },
                {
                    columnNames: [ 'day' ]
                },
                {
                    columnNames: [ 'hour' ]
                },
                {
                    columnNames: [ 'isArchived' ]
                }
            ],
            columns: [
                {
                    name: 'timetableId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'type',
                    type: 'int'
                },
                {
                    name: 'eventId',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'userId',
                    type: 'int'
                },
                {
                    name: 'day',
                    type: 'int'
                },
                {
                    name: 'hour',
                    type: 'int'
                },
                {
                    name: 'isArchived',
                    type: 'int',
                    default: 0
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
        await queryRunner.dropTable('timetable');
    }
}
