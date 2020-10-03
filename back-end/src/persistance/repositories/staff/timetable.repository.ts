import { BaseRepository } from '../base.repository';
import { getConnection, Repository } from 'typeorm';
import { TimetableEntity, TimetableType } from '../../entities/staff/timetable.entity';

export class TimetableRepository extends BaseRepository<TimetableEntity> {
    protected repository: Repository<TimetableEntity>;

    async getAmountOfTotalSlots (type: TimetableType): Promise<number> {
        return await this.getRepository().count({
            type: type
        });
    }

    async getSlotCount (type: TimetableType, userId: number): Promise<number> {
        return await this.getRepository().count({
            userId: userId,
            type: type
        });
    }

    async getSlots (type: TimetableType): Promise<Array<TimetableEntity>> {
        return await this.getRepository().createQueryBuilder()
            .where('isArchived = :isArchived', { isArchived: 0 })
            .andWhere('type = :type', { type: type })
            .getMany();
    }

    async getSlotsFrom (type: TimetableType, day: number, hour: number): Promise<Array<TimetableEntity>> {
        return await this.getRepository().createQueryBuilder()
            .where('isArchived = :isArchived', { isArchived: 0 })
            .andWhere('type = :type', { type: type })
            .andWhere('day >= :day', { day: day })
            .andWhere('hour >= :hour', { hour: hour })
            .getMany();
    }

    async getSlotForTime (day: number, hour: number, type: TimetableType): Promise<TimetableEntity> {
        return await this.getRepository().createQueryBuilder()
            .where('isArchived = :isArchived', { isArchived: 0 })
            .andWhere('type = :type', { type: type })
            .andWhere('hour = :hour', { hour: hour })
            .andWhere('day = :day', { day: day })
            .getOne();
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
