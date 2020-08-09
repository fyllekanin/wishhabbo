import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { UserGroupEntity } from '../../persistance/entities/group/user-group.entity';

export class SeedUserGroupTable1596992770197 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(UserGroupEntity).save([
            {
                groupId: 1,
                userId: 1
            }
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }
}
