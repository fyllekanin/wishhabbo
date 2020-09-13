import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';
import { InternalRequest } from '../../../utilities/internal.request';
import { IEntity } from '../entity.interface';

interface IRadioRequestEntity extends IEntity {
    radioRequestId: number;
    userId: number;
    request: string;
}

@Entity('radio_requests')
export class RadioRequestEntity extends CreatedUpdatedAtEntity implements IRadioRequestEntity {
    @PrimaryGeneratedColumn()
    radioRequestId: number;
    @Column()
    @Index()
    userId: number;
    @Column()
    request: string;

    constructor (builder: IRadioRequestEntity) {
        super();
        if (!builder) {
            return;
        }

        this.radioRequestId = builder.radioRequestId;
        this.userId = builder.userId;
        this.request = builder.request;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }

    static of (req: InternalRequest): RadioRequestEntity {
        return RadioRequestEntity.newBuilder()
            .withUserId(req.user.userId)
            .withRequest(req.body.request)
            .build();
    }
}

class Builder {
    private myData: IRadioRequestEntity = {
        radioRequestId: undefined,
        userId: undefined,
        request: undefined
    };

    constructor (entity?: RadioRequestEntity) {
        Object.assign(this.myData, entity);
    }

    withRadioRequestId (radioRequestId: number): Builder {
        this.myData.radioRequestId = radioRequestId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withRequest (request: string): Builder {
        this.myData.request = request;
        return this;
    }

    build (): RadioRequestEntity {
        return new RadioRequestEntity(this.myData);
    }
}
