import { arrayOf, ClassHelper, primitiveOf } from '../../../shared/helpers/class.helper';

export class JobApplicationModel {
    @primitiveOf(String)
    discord: string;
    @primitiveOf(String)
    content: string;
    @arrayOf(Number)
    roles: Array<number> = [];

    constructor (source: Partial<JobApplicationModel>) {
        ClassHelper.assign(this, source);
    }
}
