import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

@Entity('events')
export class EventEntity extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    eventId: number;
    @Column()
    name: string;

    static newBuilder (): EventEntityBuilder {
        return new EventEntityBuilder();
    }
}

class EventEntityBuilder {
    eventId: number;
    name: string;

    withEventId (eventId: number): EventEntityBuilder {
        this.eventId = eventId;
        return this;
    }

    withName (name: string): EventEntityBuilder {
        this.name = name;
        return this;
    }

    build (): EventEntity {
        const entity = new EventEntity();
        entity.eventId = this.eventId;
        entity.name = this.name;
        return entity;
    }
}
