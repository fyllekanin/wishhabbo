import { arrayOf, ClassHelper, primitiveOf } from '../../../shared/helpers/class.helper';
import { SlimUser } from '../../../shared/classes/slim-user.class';

export class StaffListRow {
    @primitiveOf(Number)
    groupId: number;
    @primitiveOf(String)
    name: string;
    @primitiveOf(String)
    nameColor: string;
    @primitiveOf(Number)
    displayOrder: number;
    @arrayOf(SlimUser)
    users: Array<SlimUser> = [];

    constructor (source: Partial<StaffListRow>) {
        ClassHelper.assign(this, source);
    }
}

export class StaffListModel {
    @arrayOf(StaffListRow)
    rows: Array<StaffListRow> = [];

    constructor (source?: Partial<StaffListModel>) {
        ClassHelper.assign(this, source);
    }
}
