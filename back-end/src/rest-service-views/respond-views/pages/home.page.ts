import { HabboBadgeEntity } from '../../../persistance/entities/habbo/habbo-badge.entity';

export class HomePage {
    private readonly badges: Array<HabboBadgeEntity>;

    constructor (builder: Builder) {
        this.badges = [ ...builder.badges ];
    }

    getBadges (): Array<HabboBadgeEntity> {
        return [ ...this.badges ];
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    badges: Array<HabboBadgeEntity>;

    withBadges (badges: Array<HabboBadgeEntity>): Builder {
        this.badges = [ ...badges ];
        return this;
    }

    build (): HomePage {
        return new HomePage(this);
    }
}
