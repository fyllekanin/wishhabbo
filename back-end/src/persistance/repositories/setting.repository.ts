import { getConnection, Repository } from 'typeorm';
import { SettingEntity, SettingKey } from '../entities/settings/setting.entity';
import { BaseRepository } from './base.repository';

export class SettingRepository extends BaseRepository<SettingEntity<unknown>> {
    protected repository: Repository<SettingEntity<unknown>>;

    async getKeyValue<T> (key: SettingKey): Promise<T> {
        const entity = await this.repository.findOne({ key: key });
        if (!entity) {
            return null;
        }
        return entity.getParsedValue() as T;
    }

    async getSetting<T> (key: SettingKey): Promise<SettingEntity<T>> {
        const entity = await this.repository.findOne({ key: key });
        if (!entity) {
            return new SettingEntity<T>();
        }
        return entity as SettingEntity<T>;
    }

    protected getRepository (): Repository<SettingEntity<unknown>> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(SettingEntity);
        return this.repository;
    }
}
