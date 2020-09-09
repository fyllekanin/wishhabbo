import { arrayOf, ClassHelper, primitiveOf } from '../../../../../shared/helpers/class.helper';

export class StaffListGroup {
    @primitiveOf(Number)
    groupId: number;
    @primitiveOf(String)
    name: string;
    @primitiveOf(Number)
    displayOrder: number;
    @primitiveOf(String)
    nameColor: string;
    @primitiveOf(Boolean)
    isSelected: boolean;

    constructor (source: Partial<StaffListGroup>) {
        ClassHelper.assign(this, source);
    }
}

export class StaffListModel {
    @arrayOf(StaffListGroup)
    groups: Array<StaffListGroup> = [];

    constructor (source: Partial<StaffListModel>) {
        ClassHelper.assign(this, source);
    }
}
