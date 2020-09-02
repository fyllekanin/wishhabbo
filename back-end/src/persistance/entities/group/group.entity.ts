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

    static newBuilder (): GroupEntityBuilder {
        return new GroupEntityBuilder();
    }
}

class GroupEntityBuilder {
    groupId: number;
    name: string;
    immunity: number;
    displayName: string;
    barStyle: string;
    nameColor: string;
    staffPermissions: number;
    adminPermissions: number;

    withGroupId (groupId: number): GroupEntityBuilder {
        this.groupId = groupId;
        return this;
    }

    withName (name: string): GroupEntityBuilder {
        this.name = name;
        return this;
    }

    withImmunity (immunity: number): GroupEntityBuilder {
        this.immunity = immunity;
        return this;
    }

    withDisplayName (displayName: string): GroupEntityBuilder {
        this.displayName = displayName;
        return this;
    }

    withBarStyle (barStyle: string): GroupEntityBuilder {
        this.barStyle = barStyle;
        return this;
    }

    withNameColor (nameColor: string): GroupEntityBuilder {
        this.nameColor = nameColor;
        return this;
    }

    withStaffPermissions (staffPermissions: number): GroupEntityBuilder {
        this.staffPermissions = staffPermissions;
        return this;
    }

    withAdminPermissions (adminPermissions: number): GroupEntityBuilder {
        this.adminPermissions = adminPermissions;
        return this;
    }

    build (): GroupEntity {
        const entity = new GroupEntity();
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
