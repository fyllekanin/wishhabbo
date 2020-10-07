import { ClassHelper, primitiveOf } from '../helpers/class.helper';

export class HabboBadgeClass {
    @primitiveOf(Number)
    habboBadgeId: number;
    @primitiveOf(String)
    badgeId: string;
    @primitiveOf(String)
    description: string;
    @primitiveOf(Number)
    articleId: number;
    @primitiveOf(Boolean)
    isCompleted: boolean;
    @primitiveOf(Number)
    createdAt: number;

    constructor (source: Partial<HabboBadgeClass>) {
        ClassHelper.assign(this, source);
    }
}
