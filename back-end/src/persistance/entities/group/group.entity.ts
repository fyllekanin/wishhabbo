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
    @Column({ type: 'text', default: '' })
    barStyle: string;
    @Column()
    staffPermissions: number;
    @Column()
    adminPermissions: number;

    static newBuilder (): GroupEntityBuilder {
        return new GroupEntityBuilder();
    }
}

class GroupEntityBuilder {
    name: string;
    displayName: string;
    barStyle: string;
    staffPermissions: number;
    adminPermissions: number;

    withName (name: string): GroupEntityBuilder {
        this.name = name;
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
        entity.displayName = this.displayName;
        entity.barStyle = this.barStyle;
        entity.staffPermissions = this.staffPermissions;
        entity.adminPermissions = this.adminPermissions;
        return entity;
    }
}
