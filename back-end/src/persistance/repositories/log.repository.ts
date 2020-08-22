import { getConnection, Repository } from 'typeorm';
import { LogEntityAbstract } from '../entities/log/log-entity.abstract';
import { BaseRepository } from './base.repository';
import { LogUserEntity } from '../entities/log/log-user.entity';
import { LogStaffEntity } from '../entities/log/log-staff.entity';
import { LogAdminEntity } from '../entities/log/log-admin.entity';

export class LogRepository extends BaseRepository<LogEntityAbstract> {
    protected repository: Repository<LogEntityAbstract>;

    async save (entity: LogEntityAbstract): Promise<LogEntityAbstract> {
        this.repository = this.getRepository(entity);
        return await super.save(entity);
    }

    private getRepository (entity: LogEntityAbstract): Repository<LogEntityAbstract> {
        if (entity instanceof LogUserEntity) {
            return getConnection().getRepository(LogUserEntity);
        }
        if (entity instanceof LogStaffEntity) {
            return getConnection().getRepository(LogStaffEntity);
        }
        if (entity instanceof LogAdminEntity) {
            return getConnection().getRepository(LogAdminEntity);
        }
        throw new Error('Invalid log entity');
    }
}
