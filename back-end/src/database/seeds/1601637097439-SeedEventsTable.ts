import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { EventEntity } from '../../persistance/entities/staff/event.entity';

export class SeedEventsTable1601637097439 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(EventEntity).save([
            EventEntity.newBuilder()
                .withName('Dangezone')
                .build(),
            EventEntity.newBuilder()
                .withName('Dangerpod')
                .build(),
            EventEntity.newBuilder()
                .withName('Heaven or hell')
                .build(),
            EventEntity.newBuilder()
                .withName('Floor is lava')
                .build()
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }
}
