import { ClassHelper, primitiveOf } from '../../../../shared/helpers/class.helper';

export class DashboardPage {
    @primitiveOf(Number)
    radioSlotCount: number;
    @primitiveOf(Number)
    eventSlotCount: number;
    @primitiveOf(Number)
    articleCount: number;

    constructor (source: Partial<DashboardPage>) {
        ClassHelper.assign(this, source);
    }
}
