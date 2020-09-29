import { ClassHelper, dateAndTime, primitiveOf } from '../helpers/class.helper';

export class SlimUser {
    @primitiveOf(Number)
    userId: number;
    @primitiveOf(String)
    username: string;
    @primitiveOf(String)
    habbo: string;
    @primitiveOf(Number)
    likes: number;
    @dateAndTime()
    updatedAt: string;

    constructor (source: Partial<SlimUser>) {
        ClassHelper.assign(this, source);
    }
}
