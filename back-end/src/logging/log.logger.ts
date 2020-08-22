import { InternalRequest } from '../utilities/internal.request';
import { Log } from './log.interface';
import { LogUserEntity } from '../persistance/entities/log/log-user.entity';
import { LogEntityAbstract } from '../persistance/entities/log/log-entity.abstract';
import { LogAdminEntity } from '../persistance/entities/log/log-admin.entity';
import { LogStaffEntity } from '../persistance/entities/log/log-staff.entity';

export class Logger {

    static async createUserLog (req: InternalRequest, log: Log): Promise<void> {
        const entity = Logger.getEntity(new LogUserEntity(), log);
        await req.serviceConfig.logRepository.save(entity);
    }

    static async createStaffLog (req: InternalRequest, log: Log): Promise<void> {
        const entity = Logger.getEntity(new LogStaffEntity(), log);
        await req.serviceConfig.logRepository.save(entity);
    }

    static async createAdminLog (req: InternalRequest, log: Log): Promise<void> {
        const entity = Logger.getEntity(new LogAdminEntity(), log);
        await req.serviceConfig.logRepository.save(entity);
    }

    private static getEntity (entity: LogEntityAbstract, log: Log): LogEntityAbstract {
        entity.userId = log.userId;
        entity.id = log.id;
        entity.contentId = log.contentId;
        entity.beforeChange = log.beforeChange;
        entity.afterChange = log.afterChange;
        return entity;
    }
}

