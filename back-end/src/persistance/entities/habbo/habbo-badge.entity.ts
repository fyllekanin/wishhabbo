import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

@Entity('habbo_badges')
export class HabboBadgeEntity extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    habboBadgeId: number;
    @Column()
    badgeId: string;
    @Column()
    description: string;

    static newBuilder (): HabboBadgeEntityBuilder {
        return new HabboBadgeEntityBuilder();
    }
}

class HabboBadgeEntityBuilder {
    badgeId: string;
    description: string;

    withBadgeId (badgeId: string): HabboBadgeEntityBuilder {
        this.badgeId = badgeId;
        return this;
    }

    withDescription (description: string): HabboBadgeEntityBuilder {
        this.description = description;
        return this;
    }

    build (): HabboBadgeEntity {
        const entity = new HabboBadgeEntity();
        entity.badgeId = this.badgeId;
        entity.description = this.description;
        return entity;
    }
}
