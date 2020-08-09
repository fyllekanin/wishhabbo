import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { GroupEntity } from '../../persistance/entities/group/group.entity';

export class SeedGroupTable1596992755524 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(GroupEntity).save([
            {
                name: 'Ownership',
                displayName: 'Ownership',
                description: 'Owners of the site',
                staffPermissions: 127,
                adminPermissions: 63
            },
            {
                name: 'Radio DJ',
                displayName: 'RadioDJ',
                description: 'Radio DJ on the site',
                staffPermissions: 1,
                adminPermissions: 0
            },
            {
                name: 'Events Host',
                displayName: 'Events Host',
                description: 'Hosts events on the client for the site',
                staffPermissions: 2,
                adminPermissions: 0
            }
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }
}
