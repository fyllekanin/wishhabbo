import { arrayOf, ClassHelper, primitiveOf } from '../../../../../../shared/helpers/class.helper';

export class SlimUserGroup {
    @primitiveOf(String)
    name: string;
    @primitiveOf(Number)
    groupId: number;
    @primitiveOf(Boolean)
    isSelected: boolean;

    constructor (source?: Partial<SlimUserGroup>) {
        ClassHelper.assign(this, source);
    }
}

export class UserGroupsModel {
    @primitiveOf(String)
    username: string;
    @primitiveOf(Number)
    userId: number;
    @arrayOf(SlimUserGroup)
    groups: Array<SlimUserGroup> = [];
    @primitiveOf(Number)
    displayGroupId: number;

    constructor (source?: Partial<UserGroupsModel>) {
        ClassHelper.assign(this, source);
    }
}
