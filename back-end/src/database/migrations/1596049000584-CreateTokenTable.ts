import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTokenTable1596049000584 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'tokens',
            columns: [
                {
                    name: 'tokenId',
                    type: 'int',
                    isPrimary: true
                },
                {
                    name: 'userId',
                    type: 'int'
                },
                {
                    name: 'ip',
                    type: 'varchar'
                },
                {
                    name: 'access',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'refresh',
                    type: 'int',
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
