import { InternalRequest } from '../utilities/internal.request';
import { Log } from './log.interface';
import { LogUserEntity } from '../persistance/entities/log/log-user.entity';
import { LogBuilder } from '../persistance/entities/log/log-entity.abstract';
import { LogAdminEntity } from '../persistance/entities/log/log-admin.entity';
import { LogStaffEntity } from '../persistance/entities/log/log-staff.entity';
import { LogRepository } from '../persistance/repositories/log.repository';

export class Logger {

    static async createUserLog (req: InternalRequest, log: Log): Promise<void> {
        const entity = Logger.getEntity(LogUserEntity.newBuilder(), log, req);
        const logRepository = new LogRepository(entity);

        await logRepository.save(entity);
    }

    static async createStaffLog (req: InternalRequest, log: Log): Promise<void> {
        const entity = Logger.getEntity(LogStaffEntity.newBuilder(), log, req);
        const logRepository = new LogRepository(entity);

        await logRepository.save(entity);
    }

    static async createAdminLog (req: InternalRequest, log: Log): Promise<void> {
        const entity = Logger.getEntity(LogAdminEntity.newBuilder(), log, req);
        const logRepository = new LogRepository(entity);

        await logRepository.save(entity);
    }

    private static getEntity<T> (builder: LogBuilder<T>, log: Log, req: InternalRequest): T {
        return builder
            .withUserId(log.userId)
            .withId(log.id)
            .withContentId(log.contentId)
            .withBeforeChange(log.beforeChange)
            .withAfterChange(log.afterChange)
            .withIp(req.ip)
            .build();
    }
}

