import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateJobApplicationTable1603989580930 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'job_applications',
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
                    columnNames: ['content']
                },
                {
                    columnNames: ['resolved']
                }
            ],
            columns: [
                {
                    name: 'jobApplicationId',
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
                    name: 'discord',
                    type: 'varchar'
                },
                {
                    name: 'roles',
                    type: 'varchar'
                },
                {
                    name: 'content',
                    type: 'longtext'
                },
                {
                    name: 'resolved',
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
        await queryRunner.dropTable('badge_complete');
    }
}
