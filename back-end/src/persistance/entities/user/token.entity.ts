import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface ITokenEntity {
    tokenId: string;
    userId: number;
    access: string;
    refresh: string;
}

@Entity('tokens')
export class TokenEntity extends CreatedUpdatedAtEntity implements ITokenEntity {
    @PrimaryGeneratedColumn('uuid')
    tokenId: string;
    @Column()
    @Index()
    userId: number;
    @Column({ unique: true })
    access: string;
    @Column({ unique: true })
    refresh: string;

    constructor (builder: ITokenEntity) {
        super();
        if (!builder) {
            return;
        }

        this.tokenId = builder.tokenId;
        this.userId = builder.userId;
        this.access = builder.access;
        this.refresh = builder.refresh;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: ITokenEntity = {
        tokenId: undefined,
        userId: undefined,
        access: undefined,
        refresh: undefined
    };

    constructor (entity?: TokenEntity) {
        Object.assign(this.myData, entity);
    }

    withTokenId (tokenId: string): Builder {
        this.myData.tokenId = tokenId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withAccess (access: string): Builder {
        this.myData.access = access;
        return this;
    }

    withRefresh (refresh: string): Builder {
        this.myData.refresh = refresh;
        return this;
    }

    build (): TokenEntity {
        return new TokenEntity(this.myData);
    }
}
