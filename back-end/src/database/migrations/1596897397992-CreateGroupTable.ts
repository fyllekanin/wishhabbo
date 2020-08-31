import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGroupTable1596897397992 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'groups',
            columns: [
                {
                    name: 'groupId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'immunity',
                    type: 'int',
                    default: 0
                },
                {
                    name: 'displayName',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'barStyle',
                    type: 'text',
                    isUnique: false,
                    default: ''
                },
                {
                    name: 'staffPermissions',
                    type: 'int',
                    default: 0
                },
                {
                    name: 'adminPermissions',
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
        await queryRunner.dropTable('groups');
    }
}
