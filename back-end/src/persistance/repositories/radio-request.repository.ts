import { RadioRequestEntity } from './../entities/staff/radio-request.entity';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

export class RadioRequestRepository extends BaseRepository<RadioRequestEntity> {
    private repository: Repository<RadioRequestEntity>;


    protected getRepository (): Repository<RadioRequestEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(RadioRequestEntity);
        return this.repository;
    }
}
