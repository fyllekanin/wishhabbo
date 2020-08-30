import { ClassHelper, objectOf, primitiveOf } from '../../helpers/class.helper';
import { AdminPermissions, StaffPermissions } from '../../../core/auth/auth-user.model';

export class GroupClass {
    @primitiveOf(Number)
    groupId: number;
    @primitiveOf(String)
    name: string;
    @primitiveOf(Number)
    immunity: number;
    @primitiveOf(String)
    displayName: string;
    @primitiveOf(String)
    description: string;
    @objectOf(StaffPermissions)
    staffPermissions = new StaffPermissions(null);
    @objectOf(AdminPermissions)
    adminPermissions = new AdminPermissions(null);
    @primitiveOf(Number)
    createdAt: number;
    @primitiveOf(Number)
    updatedAt: number;

    constructor (source: Partial<GroupClass>) {
        ClassHelper.assign(this, source);
    }
}
