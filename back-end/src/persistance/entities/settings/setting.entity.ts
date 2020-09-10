import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

export enum SettingKey {
    STAFF_LIST = 'staff-list',
    RADIO_SETTINGS = 'radio-settings',
    RADIO_STATS = 'radio-stats'
}

interface ISettingEntity {
    settingId: number;
    key: SettingKey;
    value: string;
}

@Entity('settings')
export class SettingEntity<T> extends CreatedUpdatedAtEntity implements ISettingEntity {
    private parsedValue: T;
    @PrimaryGeneratedColumn()
    settingId: number;
    @Column({ unique: true })
    key: SettingKey;
    @Column({ type: 'longtext' })
    value: string;

    constructor (builder?: ISettingEntity) {
        super();
        if (!builder) {
            return;
        }

        this.settingId = builder.settingId;
        this.key = builder.key;
        this.value = builder.value;
    }

    getParsedValue (): T {
        if (this.parsedValue) {
            return this.parsedValue;
        }
        this.parsedValue = JSON.parse(this.value);
        return this.parsedValue;
    }

    newBuilderFromCurrent (): Builder<T> {
        return new Builder(this);
    }

    static newBuilder<T> (): Builder<T> {
        return new Builder();
    }
}

class Builder<T> {
    private myData: ISettingEntity = {
        settingId: undefined,
        key: undefined,
        value: undefined
    };

    constructor (entity?: SettingEntity<T>) {
        Object.assign(this.myData, entity);
    }

    withSettingId (settingKey: number): Builder<T> {
        this.myData.settingId = settingKey;
        return this;
    }

    withKey (key: SettingKey): Builder<T> {
        this.myData.key = key;
        return this;
    }

    withValue (value: T): Builder<T> {
        this.myData.value = JSON.stringify(value);
        return this;
    }

    build (): SettingEntity<T> {
        return new SettingEntity(this.myData);
    }
}
