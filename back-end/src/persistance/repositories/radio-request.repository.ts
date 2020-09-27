import { TimeUtility } from './../../utilities/time.utility';
import { RadioRequestEntity } from './../entities/staff/radio-request.entity';
import { getConnection, Repository, MoreThanOrEqual } from 'typeorm';
import { BaseRepository } from './base.repository';

export class RadioRequestRepository extends BaseRepository<RadioRequestEntity> {
    private static readonly TWO_HOURS = 7200;
    private repository: Repository<RadioRequestEntity>;

    async getRequestsWithinTwoHours(): Promise<Array<RadioRequestEntity>> {
        return this.getRepository()
        .find({
            where: [
                { createdAt: MoreThanOrEqual(TimeUtility.getCurrent() - RadioRequestRepository.TWO_HOURS) }
            ],
            order: {
                createdAt: 'DESC'
            }
        });
    }

    protected getRepository (): Repository<RadioRequestEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(RadioRequestEntity);
        return this.repository;
    }
}
