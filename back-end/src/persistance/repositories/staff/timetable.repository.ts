import { BaseRepository } from '../base.repository';
import { getConnection, Repository } from 'typeorm';
import { TimetableEntity, TimetableType } from '../../entities/staff/timetable.entity';

export class TimetableRepository extends BaseRepository<TimetableEntity> {
    protected repository: Repository<TimetableEntity>;

    constructor () {
        super();
        this.repository = getConnection().getRepository(TimetableEntity);
    }

    getSlots (type: TimetableType): Promise<Array<TimetableEntity>> {
        return this.repository.find({
            where: [ { isArchived: false }, { type: type } ]
        });
    }
}
