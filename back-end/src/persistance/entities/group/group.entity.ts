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
    @Column()
    description: string;
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
    description: string;
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

    withDescription (description: string): GroupEntityBuilder {
        this.description = description;
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
        entity.description = this.description;
        entity.staffPermissions = this.staffPermissions;
        entity.adminPermissions = this.adminPermissions;
        return entity;
    }
}
