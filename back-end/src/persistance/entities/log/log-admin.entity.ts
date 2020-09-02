import { LogBuilder, LogEntityAbstract } from './log-entity.abstract';
import { Entity } from 'typeorm';

@Entity('log_admin')
export class LogAdminEntity extends LogEntityAbstract {

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder extends LogBuilder<LogAdminEntity> {
    build (): LogAdminEntity {
        return new LogAdminEntity(this.myData);
    }
}
