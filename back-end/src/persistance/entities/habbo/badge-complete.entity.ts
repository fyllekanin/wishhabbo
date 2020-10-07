import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IBadgeComplete {
    badgeCompleteId: string;
    userId: number;
    badgeId: string;
}

@Entity('badge_complete')
export class BadgeCompleteEntity extends CreatedUpdatedAtEntity implements IBadgeComplete {
    @PrimaryGeneratedColumn('uuid')
    badgeCompleteId: string;
    @Column()
    userId: number;
    @Column()
    badgeId: string;

    constructor (builder: IBadgeComplete) {
        super();
        if (!builder) {
            return;
        }

        this.badgeCompleteId = builder.badgeCompleteId;
        this.userId = builder.userId;
        this.badgeId = builder.badgeId;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IBadgeComplete = {
        badgeCompleteId: undefined,
        userId: undefined,
        badgeId: undefined
    };

    constructor (entity?: BadgeCompleteEntity) {
        Object.assign(this.myData, entity);
    }

    withBadgeCompleteId (badgeCompleteId: string): Builder {
        this.myData.badgeCompleteId = badgeCompleteId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withBadgeId (badgeId: string): Builder {
        this.myData.badgeId = badgeId;
        return this;
    }

    build (): BadgeCompleteEntity {
        return new BadgeCompleteEntity(this.myData);
    }
}
