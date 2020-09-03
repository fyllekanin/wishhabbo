import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';
import { InternalRequest } from '../../../utilities/internal.request';

interface IEventEntity {
    eventId: number;
    name: string;
}

@Entity('events')
export class EventEntity extends CreatedUpdatedAtEntity implements IEventEntity {
    @PrimaryGeneratedColumn()
    eventId: number;
    @Column()
    name: string;

    constructor (builder: IEventEntity) {
        super();
        if (!builder) {
            return;
        }

        this.eventId = builder.eventId;
        this.name = builder.name;
    }


    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }

    static of (req: InternalRequest): EventEntity {
        return EventEntity.newBuilder()
            .withName(req.body.name)
            .build();
    }
}

class Builder {
    private myData: IEventEntity = {
        eventId: undefined,
        name: undefined
    };

    constructor (entity?: EventEntity) {
        Object.assign(this.myData, entity);
    }

    withEventId (eventId: number): Builder {
        this.myData.eventId = eventId;
        return this;
    }

    withName (name: string): Builder {
        this.myData.name = name;
        return this;
    }

    build (): EventEntity {
        return new EventEntity(this.myData);
    }
}
