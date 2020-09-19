import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBbcodeTable1600500723038 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'bbcodes',
            indices: [
                {
                    columnNames: [ 'createdAt' ]
                },
                {
                    columnNames: [ 'updatedAt' ]
                },
                {
                    columnNames: [ 'isSystem' ]
                }
            ],
            columns: [
                {
                    name: 'bbcodeId',
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
                    name: 'example',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'pattern',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'replacement',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'editorPattern',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'editorReplacement',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'isSystem',
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
        await queryRunner.dropTable('bbcodes');
    }
}
