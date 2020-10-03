import { ClassHelper, primitiveOf } from '../../../../shared/helpers/class.helper';

export class DashboardPage {
    @primitiveOf(Number)
    eventSlotCount: number;
    @primitiveOf(Number)
    radioSlotCount: number;
    @primitiveOf(Number)
    staffCount: number;
    @primitiveOf(Number)
    userCount: number;

    constructor (source: Partial<DashboardPage>) {
        ClassHelper.assign(this, source);
    }
}
