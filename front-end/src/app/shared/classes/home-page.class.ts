import { ClassHelper, objectOf, primitiveOf } from '../helpers/class.helper';
import { SlimUser } from './slim-user.class';

export class HomePageStarLight {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitiveOf(String)
    text: string;

    constructor (source: Partial<HomePageStarLight>) {
        ClassHelper.assign(this, source);
    }
}

export class HomePageBannerEntry {
    @primitiveOf(String)
    id: string;
    @primitiveOf(String)
    caption: string;
    @primitiveOf(Boolean)
    isDeleted: boolean;
    @primitiveOf(Boolean)
    isUpdated: boolean;
    @primitiveOf(Boolean)
    isNew: boolean;

    constructor (source: Partial<HomePageBannerEntry>) {
        ClassHelper.assign(this, source);
    }
}
