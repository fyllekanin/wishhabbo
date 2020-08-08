import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

@Entity('user_group')
export class UserGroupEntity extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    userGroupId: number;
    @Column()
    userId: number;
    @Column()
    groupId: number;

    static newBuilder (): UserGroupEntityBuilder {
        return new UserGroupEntityBuilder();
    }
}

class UserGroupEntityBuilder {
    userId: number;
    groupId: number;

    withUserId (userId: number): UserGroupEntityBuilder {
        this.userId = userId;
        return this;
    }

    withGroupId (groupId: number): UserGroupEntityBuilder {
        this.groupId = groupId;
        return this;
    }

    build (): UserGroupEntity {
        const entity = new UserGroupEntity();
        entity.userId = this.userId;
        entity.groupId = this.groupId;
        return entity;
    }
}
