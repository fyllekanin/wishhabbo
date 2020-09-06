import { getConnection, Repository } from 'typeorm';
import { LogEntityAbstract } from '../entities/log/log-entity.abstract';
import { LogUserEntity } from '../entities/log/log-user.entity';
import { LogStaffEntity } from '../entities/log/log-staff.entity';
import { LogAdminEntity } from '../entities/log/log-admin.entity';

export class LogRepository {
    protected repository: Repository<LogEntityAbstract>;

    async save (entity: LogEntityAbstract): Promise<LogEntityAbstract> {
        return await this.getRepository(entity).save(entity);
    }

    protected getRepository (entity: LogEntityAbstract): Repository<LogEntityAbstract> {
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
