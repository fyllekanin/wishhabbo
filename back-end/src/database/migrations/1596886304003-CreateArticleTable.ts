import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArticleTable1596886304003 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'articles',
            columns: [
                {
                    name: 'articleId',
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
                    name: 'title',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'content',
                    type: 'longtext',
                },
                {
                    name: 'badges',
                    type: 'varchar'
                },
                {
                    name: 'room',
                    type: 'varchar'
                },
                {
                    name: 'difficulty',
                    type: 'int',
                },
                {
                    name: 'type',
                    type: 'int',
                },
                {
                    name: 'isApproved',
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
        await queryRunner.dropTable('articles');
    }
}
