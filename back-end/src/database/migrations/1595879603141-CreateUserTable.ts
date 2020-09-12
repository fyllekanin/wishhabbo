import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1595879603141 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
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
                    name: 'userId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'username',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'displayGroupId',
                    type: 'int',
                    default: 0
                },
                {
                    name: 'habbo',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'likes',
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
        await queryRunner.dropTable('users');
    }
}
