import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IUserGroupEntity {
    userGroupId: number;
    userId: number;
    groupId: number;
}

@Entity('user_group')
export class UserGroupEntity extends CreatedUpdatedAtEntity implements IUserGroupEntity {
    @PrimaryGeneratedColumn()
    userGroupId: number;
    @Column()
    userId: number;
    @Column()
    groupId: number;

    constructor (builder: IUserGroupEntity) {
        super();
        if (!builder) {
            return;
        }

        this.userGroupId = builder.userGroupId;
        this.userId = builder.userId;
        this.groupId = builder.groupId;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IUserGroupEntity = {
        userGroupId: undefined,
        userId: undefined,
        groupId: undefined
    };

    constructor (entity?: UserGroupEntity) {
        Object.assign(this.myData, entity);
    }

    withUserGroupId (userGroupId: number): Builder {
        this.myData.userGroupId = userGroupId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withGroupId (groupId: number): Builder {
        this.myData.groupId = groupId;
        return this;
    }

    build (): UserGroupEntity {
        return new UserGroupEntity(this.myData);
    }
}
