import { Entity } from 'typeorm';
import { LogBuilder, LogEntityAbstract } from './log-entity.abstract';

@Entity('log_staff')
export class LogStaffEntity extends LogEntityAbstract {

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder extends LogBuilder<LogStaffEntity> {
    build (): LogStaffEntity {
        return new LogStaffEntity(this.myData);
    }
}
