import { arrayOf, ClassHelper, primitiveOf } from '../../../../../../shared/helpers/class.helper';

export class UserGroupsModel {
    @primitiveOf(String)
    username: string;
    @primitiveOf(Number)
    userId: number;
    @arrayOf(Number)
    groups: Array<{ name: string, groupId: number }> = [];
    @primitiveOf(Number)
    displayGroupId: number;

    constructor (source?: Partial<UserGroupsModel>) {
        ClassHelper.assign(this, source);
    }
}
