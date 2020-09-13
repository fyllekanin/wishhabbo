import { getConnection, Repository } from 'typeorm';
import { LogEntityAbstract } from '../entities/log/log-entity.abstract';
import { LogUserEntity } from '../entities/log/log-user.entity';
import { LogStaffEntity } from '../entities/log/log-staff.entity';
import { LogAdminEntity } from '../entities/log/log-admin.entity';
import { BaseRepository } from './base.repository';

export class LogRepository extends BaseRepository <LogEntityAbstract> {
    private readonly entity: LogEntityAbstract;
    protected repository: Repository<LogEntityAbstract>;

    constructor (entity: LogEntityAbstract) {
        super();
        this.entity = entity;
    }

    static getRepositoryForUser (): LogRepository {
        return new LogRepository(LogUserEntity.newBuilder().build());
    }

    static getRepositoryForAdmin (): LogRepository {
        return new LogRepository(LogAdminEntity.newBuilder().build());
    }

    static getRepositoryForStaff (): LogRepository {
        return new LogRepository(LogStaffEntity.newBuilder().build());
    }

    protected getRepository (): Repository<LogEntityAbstract> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = this.getLogRepository(this.entity);
        return this.repository;
    }

    protected getLogRepository (entity: LogEntityAbstract): Repository<LogEntityAbstract> {
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
