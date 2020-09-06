import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

export enum TimetableType {
    RADIO = 0,
    EVENTS = 1
}

interface ITimetableEntity {
    timetableId: number;
    type: number;
    eventId: number;
    userId: number;
    day: number;
    hour: number;
    isArchived: boolean;
}

@Entity('timetable')
export class TimetableEntity extends CreatedUpdatedAtEntity implements ITimetableEntity {
    @PrimaryGeneratedColumn()
    timetableId: number;
    @Column()
    @Index()
    type: number;
    @Column({ nullable: true })
    eventId: number;
    @Column()
    @Index()
    userId: number;
    @Column()
    @Index()
    day: number;
    @Column()
    @Index()
    hour: number;
    @Column()
    @Index()
    isArchived: boolean;

    constructor (builder: ITimetableEntity) {
        super();
        if (!builder) {
            return;
        }

        this.timetableId = builder.timetableId;
        this.type = builder.type;
        this.eventId = builder.eventId;
        this.userId = builder.userId;
        this.day = builder.day;
        this.hour = builder.hour;
        this.isArchived = builder.isArchived;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: ITimetableEntity = {
        timetableId: undefined,
        type: undefined,
        eventId: undefined,
        userId: undefined,
        day: undefined,
        hour: undefined,
        isArchived: undefined
    };

    constructor (entity?: TimetableEntity) {
        Object.assign(this.myData, entity);
    }


    withTimetableId (timetableId: number): Builder {
        this.myData.timetableId = timetableId;
        return this;
    }

    withType (type: number): Builder {
        this.myData.type = type;
        return this;
    }

    withEventId (eventId: number): Builder {
        this.myData.eventId = eventId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withDay (day: number): Builder {
        this.myData.day = day;
        return this;
    }

    withHour (hour: number): Builder {
        this.myData.hour = hour;
        return this;
    }

    withIsArchived (isArchived: boolean): Builder {
        this.myData.isArchived = isArchived;
        return this;
    }

    build (): TimetableEntity {
        return new TimetableEntity(this.myData);
    }
}
