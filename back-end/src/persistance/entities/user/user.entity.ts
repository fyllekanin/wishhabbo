import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IUserEntity {
    userId: number;
    username: string;
    password: string;
    displayGroupId: number;
    habbo: string;
    likes: number;
}

@Entity('users')
export class UserEntity extends CreatedUpdatedAtEntity implements IUserEntity {
    @PrimaryGeneratedColumn()
    userId: number;
    @Column({ unique: true })
    username: string;
    @Column()
    password: string;
    @Column({ default: 0 })
    displayGroupId: number;
    @Column({ unique: true })
    habbo: string;
    @Column({ default: 0 })
    @Index()
    likes: number;

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
        this.likes = builder.likes;
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
        displayGroupId: undefined,
        likes: undefined
    };

    constructor (entity?: UserEntity) {
        Object.assign(this.myData, entity);
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

    withLikes (likes: number): Builder {
        this.myData.likes = likes;
        return this;
    }

    build (): UserEntity {
        return new UserEntity(this.myData);
    }
}
