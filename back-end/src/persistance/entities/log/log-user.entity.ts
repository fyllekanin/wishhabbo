import { Entity } from 'typeorm';
import { LogBuilder, LogEntityAbstract } from './log-entity.abstract';

@Entity('log_user')
export class LogUserEntity extends LogEntityAbstract {

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder extends LogBuilder<LogUserEntity> {
    build (): LogUserEntity {
        return new LogUserEntity(this.myData);
    }
}
