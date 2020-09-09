import { getConnection, Repository } from 'typeorm';
import { SettingEntity } from '../entities/setting.entity';

export class SettingRepository {
    private repository: Repository<SettingEntity<unknown>>;


    private getRepository (): Repository<SettingEntity<unknown>> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(SettingEntity);
        return this.repository;
    }
}
