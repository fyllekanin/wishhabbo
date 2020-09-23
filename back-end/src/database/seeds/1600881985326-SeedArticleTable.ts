import { ArticleEntity } from './../../persistance/entities/staff/media/article.entity';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class SeedArticleTable1600881985326 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(ArticleEntity).save([
            ArticleEntity.newBuilder()
                .withUserId(1)
                .withTitle('test')
                .withContent('[b]This is my bold text hehe[/b]')
                .withBadges(['FR52A', 'FR5'])
                .withRoom('https://www.habbo.com/hotel?room=77165565')
                .withRoomOwner('bear94')
                .withDifficulty(1)
                .withType(0)
                .withIsApproved(true)
                .withIsAvailable(true)
                .build()
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }
}
