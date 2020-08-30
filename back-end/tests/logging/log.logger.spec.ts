import { Log } from '../../src/logging/log.interface';
import { Logger } from '../../src/logging/log.logger';
import { LogRepository } from '../../src/persistance/repositories/log.repository';
import { InternalRequest } from '../../src/utilities/internal.request';
import { LogUserEntity } from '../../src/persistance/entities/log/log-user.entity';
import { LogStaffEntity } from '../../src/persistance/entities/log/log-staff.entity';
import { LogAdminEntity } from '../../src/persistance/entities/log/log-admin.entity';
import { LogEntityAbstract } from '../../src/persistance/entities/log/log-entity.abstract';

describe('Logger', () => {
    let logRepository: LogRepository;
    let req: InternalRequest;


    beforeEach(() => {
        logRepository = <LogRepository><unknown>{
            save: (_entity: LogEntityAbstract) => Promise.resolve()
        };

        req = <InternalRequest><unknown>{
            serviceConfig: {
                logRepository: logRepository
            }
        };
    });

    it('createUserLog should create LogUserEntity based on the log', done => {
        // Given
        const log = <Log><unknown>{};
        spyOn(logRepository, 'save').and.callFake(entity => {
            expect(entity instanceof LogUserEntity).toBeTrue();
            done();
            return Promise.resolve(null);
        });

        // When
        Logger.createUserLog(req, log);
    });

    it('createStaffLog should create LogStaffEntity based on the log', done => {
        // Given
        const log = <Log><unknown>{};
        spyOn(logRepository, 'save').and.callFake(entity => {
            expect(entity instanceof LogStaffEntity).toBeTrue();
            done();
            return Promise.resolve(null);
        });

        // When
        Logger.createStaffLog(req, log);
    });

    it('createAdminLog should create LogAdminEntity based on the log', done => {
        // Given
        const log = <Log><unknown>{};
        spyOn(logRepository, 'save').and.callFake(entity => {
            expect(entity instanceof LogAdminEntity).toBeTrue();
            done();
            return Promise.resolve(null);
        });

        // When
        Logger.createAdminLog(req, log);
    });
});
