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

    static newBuilder (): UserEntityBuilder {
        return new UserEntityBuilder();
    }
}

class UserEntityBuilder {
    username: string;
    password: string;
    habbo: string;
    displayGroupId: number;
:

    withUsername (username: string): UserEntityBuilder {
        this.username = username;
        return this;
    }

    withPassword (password: string): UserEntityBuilder {
        this.password = password;
        return this;
    }

    withHabbo (habbo: string): UserEntityBuilder {
        this.habbo = habbo;
        return this;
    }

    withDisplayGroupId (groupId: number): UserEntityBuilder {
        this.displayGroupId = groupId;
        return this;
    }

    build (): UserEntity {
        const entity = new UserEntity();
        entity.username = this.username;
        entity.password = this.password;
        entity.habbo = this.habbo;
        entity.displayGroupId = this.displayGroupId;
        return entity;
    }
}
