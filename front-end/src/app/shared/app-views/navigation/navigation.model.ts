import { arrayOf, ClassHelper, primitiveOf } from '../../helpers/class.helper';

export class NavigationItem {
    @primitiveOf(String)
    title: string;
    @primitiveOf(String)
    path: string;
    @primitiveOf(String)
    icon: string;
    @arrayOf(NavigationItem)
    children: Array<NavigationItem> = [];

    constructor (source: Partial<NavigationItem>) {
        ClassHelper.assign(this, source);
    }
}
