import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../../persistance/entities/user/user.entity';
import { HasherUtility } from '../../utilities/hasher.utility';

export class SeedUserTable1596650075805 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(UserEntity).save([
            await this.getEntity('admin', 'test1234', 'bear94'),
            await this.getEntity('radio', 'test1234', 'radiodj')
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }

    private async getEntity (username: string, password: string, habbo: string): Promise<UserEntity> {
        const entity = new UserEntity();
        entity.username = username;
        entity.password = await HasherUtility.hash(password);
        entity.habbo = habbo;
        return entity;
    }
}
