import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

@Entity('groups')
export class GroupEntity extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    groupId: number;
    @Column({ unique: true })
    name: string;
    @Column({ default: 0 })
    immunity: number;
    @Column({ unique: true })
    displayName: string;
    @Column({ type: 'text' })
    barStyle: string;
    @Column({ nullable: true })
    nameColor: string;
    @Column({ default: 0 })
    staffPermissions: number;
    @Column({ default: 0 })
    adminPermissions: number;

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    groupId: number;
    name: string;
    immunity: number;
    displayName: string;
    barStyle: string;
    nameColor: string;
    staffPermissions: number;
    adminPermissions: number;

    constructor (entity?: GroupEntity) {
        Object.assign(this, entity);
    }

    withGroupId (groupId: number): Builder {
        this.groupId = groupId;
        return this;
    }

    withName (name: string): Builder {
        this.name = name;
        return this;
    }

    withImmunity (immunity: number): Builder {
        this.immunity = immunity;
        return this;
    }

    withDisplayName (displayName: string): Builder {
        this.displayName = displayName;
        return this;
    }

    withBarStyle (barStyle: string): Builder {
        this.barStyle = barStyle;
        return this;
    }

    withNameColor (nameColor: string): Builder {
        this.nameColor = nameColor;
        return this;
    }

    withStaffPermissions (staffPermissions: number): Builder {
        this.staffPermissions = staffPermissions;
        return this;
    }

    withAdminPermissions (adminPermissions: number): Builder {
        this.adminPermissions = adminPermissions;
        return this;
    }

    build (): GroupEntity {
        const entity = new GroupEntity();
        entity.groupId = this.groupId;
        entity.name = this.name;
        entity.immunity = this.immunity;
        entity.displayName = this.displayName;
        entity.barStyle = this.barStyle;
        entity.nameColor = this.nameColor;
        entity.staffPermissions = this.staffPermissions;
        entity.adminPermissions = this.adminPermissions;
        return entity;
    }
}
