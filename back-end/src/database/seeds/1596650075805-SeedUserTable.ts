import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../../persistance/entities/user/user.entity';
import { HasherUtility } from '../../utilities/hasher.utility';

export class SeedUserTable1596650075805 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(UserEntity).save([
            {
                username: 'admin',
                password: await HasherUtility.hash('test1234'),
                habbo: 'bear94'
            }
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }
}
