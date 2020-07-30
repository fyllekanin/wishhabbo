import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1595879603141 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'userId',
                    type: 'int',
                    isPrimary: true
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
                    name: 'habbo',
                    type: 'varchar',
                    isUnique: true
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
