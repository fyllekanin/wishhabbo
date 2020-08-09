import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { UserGroupEntity } from '../../persistance/entities/group/user-group.entity';

export class SeedUserGroupTable1596992770197 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(UserGroupEntity).save([
            await this.getEntity(1, 1),
            await this.getEntity(2, 2)
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }

    private async getEntity (groupId: number, userId: number): Promise<UserGroupEntity> {
        const entity = new UserGroupEntity();
        entity.groupId = groupId;
        entity.userId = userId;
        return entity;
    }
}
