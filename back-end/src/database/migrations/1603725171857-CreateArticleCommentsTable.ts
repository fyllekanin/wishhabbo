import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArticleCommentsTable1603725171857 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'article_comments',
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
                    columnNames: ['content'],
                    isFulltext: true
                },
                {
                    columnNames: ['articleId']
                }
            ],
            columns: [
                {
                    name: 'articleCommentId',
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
                    name: 'articleId',
                    type: 'int'
                },
                {
                    name: 'content',
                    type: 'longtext',
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
        await queryRunner.dropTable('article_comments');
    }
}
