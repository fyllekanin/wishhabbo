import { AdminPermissions, StaffPermissions } from '../respond-views/user/auth-user.view';
import { InternalRequest } from '../../utilities/internal.request';

export class GroupView {
    private readonly groupId: number;
    private readonly name: string;
    private readonly immunity: number;
    private readonly displayName: string;
    private readonly barStyle: string;
    private readonly nameColor: string;
    private readonly staffPermissions: StaffPermissions;
    private readonly adminPermissions: AdminPermissions;
    private readonly createdAt: number;
    private readonly updatedAt: number;

    constructor (builder: GroupViewBuilder) {
        this.groupId = builder.groupId;
        this.name = builder.name;
        this.immunity = builder.immunity;
        this.displayName = builder.displayName;
        this.barStyle = builder.barStyle;
        this.nameColor = builder.nameColor;
        this.staffPermissions = { ...builder.staffPermissions };
        this.adminPermissions = { ...builder.adminPermissions };
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    getGroupId (): number {
        return this.groupId;
    }

    getName (): string {
        return this.name;
    }

    getImmunity (): number {
        return this.immunity;
    }

    getDisplayName (): string {
        return this.displayName;
    }

    getBarStyle (): string {
        return this.barStyle;
    }

    getNameColor (): string {
        return this.nameColor;
    }

    getStaffPermissions (): StaffPermissions {
        return { ...this.staffPermissions };
    }

    getAdminPermissions (): AdminPermissions {
        return { ...this.adminPermissions };
    }

    getCreatedAt (): number {
        return this.createdAt;
    }

    getUpdatedAt (): number {
        return this.updatedAt;
    }

    static of (req: InternalRequest): GroupView {
        return this.newBuilder()
            .withGroupId(req.body.groupId)
            .withName(req.body.name)
            .withImmunity(req.body.immunity)
            .withDisplayName(req.body.displayName)
            .withBarStyle(req.body.barStyle)
            .withNameColor(req.body.nameColor)
            .withStaffPermissions(req.body.staffPermissions)
            .withAdminPermissions(req.body.adminPermissions)
            .build();
    }

    static newBuilder (): GroupViewBuilder {
        return new GroupViewBuilder();
    }
}

class GroupViewBuilder {
    groupId: number;
    name: string;
    immunity: number;
    displayName: string;
    barStyle: string;
    nameColor: string;
    staffPermissions: StaffPermissions;
    adminPermissions: AdminPermissions;
    createdAt: number;
    updatedAt: number;

    withGroupId (groupId: number): GroupViewBuilder {
        this.groupId = groupId;
        return this;
    }

    withName (name: string): GroupViewBuilder {
        this.name = name;
        return this;
    }

    withImmunity (immunity: number): GroupViewBuilder {
        this.immunity = immunity;
        return this;
    }

    withDisplayName (displayName: string): GroupViewBuilder {
        this.displayName = displayName;
        return this;
    }

    withBarStyle (barStyle: string): GroupViewBuilder {
        this.barStyle = barStyle;
        return this;
    }

    withNameColor (nameColor: string): GroupViewBuilder {
        this.nameColor = nameColor;
        return this;
    }

    withStaffPermissions (staffPermissions: StaffPermissions): GroupViewBuilder {
        this.staffPermissions = staffPermissions;
        return this;
    }

    withAdminPermissions (adminPermissions: AdminPermissions): GroupViewBuilder {
        this.adminPermissions = adminPermissions;
        return this;
    }

    withCreatedAt (createdAt: number): GroupViewBuilder {
        this.createdAt = createdAt;
        return this;
    }

    withUpdatedAt (updatedAt: number): GroupViewBuilder {
        this.updatedAt = updatedAt;
        return this;
    }

    build (): GroupView {
        return new GroupView(this);
    }
}
