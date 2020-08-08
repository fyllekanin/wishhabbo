import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserGroupTable1596897378455 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user_group',
            columns: [
                {
                    name: 'userGroupId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'userId',
                    type: 'int'
                },
                {
                    name: 'groupId',
                    type: 'int'
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
        await queryRunner.dropTable('user_group');
    }
}
