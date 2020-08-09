import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { GroupEntity } from '../../persistance/entities/group/group.entity';

export class SeedGroupTable1596992755524 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(GroupEntity).save([
            await this.getEntity('Ownership', 'Ownership', 'Owners', 127, 63),
            await this.getEntity('Radio DJ', 'Radio DJ', 'Radio DJ on the site', 1, 0),
            await this.getEntity('Events Host', 'Events Host', 'Hosts events on the client for the site', 2, 0)
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }

    private async getEntity (name: string, displayName: string, description: string,
                             staffPermissions: number, adminPermissions: number): Promise<GroupEntity> {
        const entity = new GroupEntity();
        entity.name = name;
        entity.displayName = displayName;
        entity.description = description;
        entity.staffPermissions = staffPermissions;
        entity.adminPermissions = adminPermissions;
        return entity;
    }
}
