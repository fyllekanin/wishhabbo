import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IGroupEntity {
    groupId: number;
    name: string;
    immunity: number;
    displayName: string;
    barStyle: string;
    nameColor: string;
    staffPermissions: number;
    adminPermissions: number;
}

@Entity('groups')
export class GroupEntity extends CreatedUpdatedAtEntity implements IGroupEntity {
    @PrimaryGeneratedColumn()
    groupId: number;
    @Column({ unique: true })
    name: string;
    @Column({ default: 0 })
    @Index()
    immunity: number;
    @Column({ unique: true })
    displayName: string;
    @Column({ type: 'text', nullable: true })
    barStyle: string;
    @Column({ nullable: true })
    nameColor: string;
    @Column({ default: 0 })
    @Index()
    staffPermissions: number;
    @Column({ default: 0 })
    @Index()
    adminPermissions: number;

    constructor (builder: IGroupEntity) {
        super();
        if (!builder) {
            return;
        }

        this.groupId = builder.groupId;
        this.name = builder.name;
        this.immunity = builder.immunity;
        this.displayName = builder.displayName;
        this.barStyle = builder.barStyle;
        this.nameColor = builder.nameColor;
        this.staffPermissions = builder.staffPermissions;
        this.adminPermissions = builder.adminPermissions;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IGroupEntity = {
        groupId: undefined,
        name: undefined,
        immunity: undefined,
        displayName: undefined,
        barStyle: undefined,
        nameColor: undefined,
        staffPermissions: undefined,
        adminPermissions: undefined
    };

    constructor (entity?: GroupEntity) {
        Object.assign(this.myData, entity);
    }

    withGroupId (groupId: number): Builder {
        this.myData.groupId = groupId;
        return this;
    }

    withName (name: string): Builder {
        this.myData.name = name;
        return this;
    }

    withImmunity (immunity: number): Builder {
        this.myData.immunity = immunity;
        return this;
    }

    withDisplayName (displayName: string): Builder {
        this.myData.displayName = displayName;
        return this;
    }

    withBarStyle (barStyle: string): Builder {
        this.myData.barStyle = barStyle;
        return this;
    }

    withNameColor (nameColor: string): Builder {
        this.myData.nameColor = nameColor;
        return this;
    }

    withStaffPermissions (staffPermissions: number): Builder {
        this.myData.staffPermissions = staffPermissions;
        return this;
    }

    withAdminPermissions (adminPermissions: number): Builder {
        this.myData.adminPermissions = adminPermissions;
        return this;
    }

    build (): GroupEntity {
        return new GroupEntity(this.myData);
    }
}
