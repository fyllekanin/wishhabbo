import { BaseRepository } from '../base.repository';
import { getConnection, Repository } from 'typeorm';
import { TimetableEntity, TimetableType } from '../../entities/staff/timetable.entity';

export class TimetableRepository extends BaseRepository<TimetableEntity> {
    protected repository: Repository<TimetableEntity>;

    async getSlots (type: TimetableType): Promise<Array<TimetableEntity>> {
        const query = this.getRepository().createQueryBuilder();
        query.where('isArchived = :isArchived', { isArchived: 0 });
        query.andWhere('type = :type', { type: type });
        return await query.getMany();
    }

    async doArchiveWeekSlots (): Promise<void> {
        const query = this.getRepository().createQueryBuilder();
        query.where('isArchived = :isArchived', { isArchived: 0 });
        query.andWhere('day > :lowDay', { lowDay: 0 });
        query.andWhere('day < :highDay', { highDay: 6 });
        await query.update({ isArchived: true });
    }

    async doArchiveWeekendSlots (): Promise<void> {
        const query = this.getRepository().createQueryBuilder();
        query.where('isArchived = :isArchived', { isArchived: 0 });
        query.andWhere('day > :lowDay', { lowDay: 5 });
        await query.update({ isArchived: true });
    }

    protected getRepository (): Repository<TimetableEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(TimetableEntity);
        return this.repository;
    }
}
