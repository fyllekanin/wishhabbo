import { BaseRepository } from '../base.repository';
import { getConnection, Repository } from 'typeorm';
import { EventEntity } from '../../entities/staff/event.entity';

export class EventsRepository extends BaseRepository<EventEntity> {
    protected repository: Repository<EventEntity>;

    async all (): Promise<Array<EventEntity>> {
        return this.getRepository().find();
    }

    protected getRepository (): Repository<EventEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(EventEntity);
        return this.repository;
    }
}
