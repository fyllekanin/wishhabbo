import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

@Entity('timetable')
export class TimetableEntity extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    timetableId: number;
    @Column()
    type: number;
    @Column({ nullable: true })
    eventId: number;
    @Column()
    userId: number;
    @Column()
    day: number;
    @Column()
    hour: number;
    @Column()
    isArchived: boolean;

    static newBuilder (): TimetableEntityBuilder {
        return new TimetableEntityBuilder();
    }
}

class TimetableEntityBuilder {
    timetableId: number;
    type: number;
    eventId: number;
    userId: number;
    day: number;
    hour: number;
    isArchived: boolean;

    withTimetableId (timetableId: number): TimetableEntityBuilder {
        this.timetableId = timetableId;
        return this;
    }

    withType (type: number): TimetableEntityBuilder {
        this.type = type;
        return this;
    }

    withEventId (eventId: number): TimetableEntityBuilder {
        this.eventId = eventId;
        return this;
    }

    withUserId (userId: number): TimetableEntityBuilder {
        this.userId = userId;
        return this;
    }

    withDay (day: number): TimetableEntityBuilder {
        this.day = day;
        return this;
    }

    withHour (hour: number): TimetableEntityBuilder {
        this.hour = hour;
        return this;
    }

    withIsArchived (isArchived: boolean): TimetableEntityBuilder {
        this.isArchived = isArchived;
        return this;
    }

    build (): TimetableEntity {
        const entity = new TimetableEntity();
        entity.timetableId = this.timetableId;
        entity.type = this.type;
        entity.eventId = this.eventId;
        entity.userId = this.userId;
        entity.day = this.day;
        entity.hour = this.hour;
        entity.isArchived = this.isArchived;
        return entity;
    }
}
