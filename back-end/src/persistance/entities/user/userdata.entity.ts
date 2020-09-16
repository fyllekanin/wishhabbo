import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IUserdataEntity {
    userdataId: number;
    userId: number;
    role: string;
}

@Entity('userdata')
export class UserdataEntity extends CreatedUpdatedAtEntity implements IUserdataEntity {
    @PrimaryGeneratedColumn()
    userdataId: number;
    @Column({ unique: true })
    userId: number;
    @Column()
    role: string;

    constructor (builder: IUserdataEntity) {
        super();
        if (!builder) {
            return;
        }

        this.userdataId = builder.userdataId;
        this.userId = builder.userId;
        this.role = builder.role;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IUserdataEntity = {
        userdataId: undefined,
        userId: undefined,
        role: undefined
    };

    constructor (entity?: IUserdataEntity) {
        Object.assign(this.myData, entity);
    }

    withUserdataId (userdataId: number): Builder {
        this.myData.userdataId = userdataId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withRole (role: string): Builder {
        this.myData.role = role;
        return this;
    }

    build (): UserdataEntity {
        return new UserdataEntity(this.myData);
    }
}
