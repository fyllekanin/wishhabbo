import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

@Entity('users')
export class UserEntity extends CreatedUpdatedAtEntity {
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

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    userId: number;
    username: string;
    password: string;
    habbo: string;
    displayGroupId: number;

    constructor (entity?: UserEntity) {
        Object.assign(this, entity);
    }

    withUserId (userId: number): Builder {
        this.userId = userId;
        return this;
    }

    withUsername (username: string): Builder {
        this.username = username;
        return this;
    }

    withPassword (password: string): Builder {
        this.password = password;
        return this;
    }

    withHabbo (habbo: string): Builder {
        this.habbo = habbo;
        return this;
    }

    withDisplayGroupId (groupId: number): Builder {
        this.displayGroupId = groupId;
        return this;
    }

    build (): UserEntity {
        const entity = new UserEntity();
        entity.userId = this.userId;
        entity.username = this.username;
        entity.password = this.password;
        entity.habbo = this.habbo;
        entity.displayGroupId = this.displayGroupId;
        return entity;
    }
}
