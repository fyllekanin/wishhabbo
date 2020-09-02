import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IHabboBadgeEntity {
    habboBadgeId: number;
    badgeId: string;
    description: string;
}

@Entity('habbo_badges')
export class HabboBadgeEntity extends CreatedUpdatedAtEntity implements IHabboBadgeEntity {
    @PrimaryGeneratedColumn()
    habboBadgeId: number;
    @Column()
    badgeId: string;
    @Column()
    description: string;

    constructor (builder: IHabboBadgeEntity) {
        super();
        this.habboBadgeId = builder.habboBadgeId;
        this.badgeId = builder.badgeId;
        this.description = builder.description;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IHabboBadgeEntity = {
        habboBadgeId: null,
        badgeId: null,
        description: null
    };

    constructor (entity?: HabboBadgeEntity) {
        Object.assign(this.myData, entity);
    }

    withHabboBadgeId (habboBadgeId: null): Builder {
        this.myData.habboBadgeId = habboBadgeId;
        return this;
    }

    withBadgeId (badgeId: string): Builder {
        this.myData.badgeId = badgeId;
        return this;
    }

    withDescription (description: string): Builder {
        this.myData.description = description;
        return this;
    }

    build (): HabboBadgeEntity {
        return new HabboBadgeEntity(this.myData);
    }
}
