import { BaseRepository } from '../base.repository';
import { getConnection, Repository } from 'typeorm';
import { EventEntity } from '../../entities/staff/event.entity';

export class EventsRepository extends BaseRepository<EventEntity> {
    protected repository: Repository<EventEntity>;

    constructor () {
        super();
        this.repository = getConnection().getRepository(EventEntity);
    }

    async all (): Promise<Array<EventEntity>> {
        return this.repository.find();
    }
}
