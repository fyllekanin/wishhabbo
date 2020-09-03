import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IUserEntity {
    userId: number;
    username: string;
    password: string;
    displayGroupId: number;
    habbo: string;
}

@Entity('users')
export class UserEntity extends CreatedUpdatedAtEntity implements IUserEntity {
    @PrimaryGeneratedColumn()
    userId: number;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column({ default: 0 })
    displayGroupId: number;
    @Column()
    habbo: string;

    constructor (builder: IUserEntity) {
        super();
        if (!builder) {
            return;
        }

        this.userId = builder.userId;
        this.username = builder.username;
        this.password = builder.password;
        this.displayGroupId = builder.displayGroupId;
        this.habbo = builder.habbo;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IUserEntity = {
        userId: undefined,
        username: undefined,
        password: undefined,
        habbo: undefined,
        displayGroupId: undefined
    };

    constructor (entity?: UserEntity) {
        Object.assign(this, entity);
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withUsername (username: string): Builder {
        this.myData.username = username;
        return this;
    }

    withPassword (password: string): Builder {
        this.myData.password = password;
        return this;
    }

    withHabbo (habbo: string): Builder {
        this.myData.habbo = habbo;
        return this;
    }

    withDisplayGroupId (groupId: number): Builder {
        this.myData.displayGroupId = groupId;
        return this;
    }

    build (): UserEntity {
        return new UserEntity(this.myData);
    }
}
