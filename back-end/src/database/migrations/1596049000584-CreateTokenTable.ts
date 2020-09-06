import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTokenTable1596049000584 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'tokens',
            indices: [
                {
                    columnNames: [ 'createdAt' ]
                },
                {
                    columnNames: [ 'updatedAt' ]
                },
                {
                    columnNames: [ 'userId' ]
                }
            ],
            columns: [
                {
                    name: 'tokenId',
                    type: 'int',
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isPrimary: true
                },
                {
                    name: 'userId',
                    type: 'int'
                },
                {
                    name: 'access',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'refresh',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'createdAt',
                    type: 'int'
                },
                {
                    name: 'updatedAt',
                    type: 'int'
                }
            ]
        }), true);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tokens');
    }

}
