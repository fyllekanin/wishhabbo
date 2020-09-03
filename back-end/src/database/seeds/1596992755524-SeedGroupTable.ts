import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { GroupEntity } from '../../persistance/entities/group/group.entity';

export class SeedGroupTable1596992755524 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(GroupEntity).save([
            await this.getEntity('Ownership', 'Ownership', 127, 63),
            await this.getEntity('Radio DJ', 'Radio DJ', 1, 0),
            await this.getEntity('Events Host', 'Events Host', 2, 0)
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }

    private async getEntity (name: string, displayName: string,
                             staffPermissions: number, adminPermissions: number): Promise<GroupEntity> {
        return GroupEntity
            .newBuilder()
            .withName(name)
            .withDisplayName(displayName)
            .withStaffPermissions(staffPermissions)
            .withAdminPermissions(adminPermissions)
            .build();
    }
}
