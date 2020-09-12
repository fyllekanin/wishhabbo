import { ClassHelper, objectOf, primitiveOf } from '../helpers/class.helper';
import { SlimUser } from './slim-user.class';

export class RadioStats {
    @primitiveOf(Number)
    listeners: number;
    @primitiveOf(String)
    song: string;
    @objectOf(SlimUser)
    currentDj: SlimUser;
    @objectOf(SlimUser)
    nextDj: SlimUser;

    constructor (source: Partial<RadioStats>) {
        ClassHelper.assign(this, source);
    }
}

export class ContinuesInformationModel {
    @objectOf(RadioStats)
    radioStats: RadioStats;

    constructor (source: Partial<ContinuesInformationModel>) {
        ClassHelper.assign(this, source);
    }
}
