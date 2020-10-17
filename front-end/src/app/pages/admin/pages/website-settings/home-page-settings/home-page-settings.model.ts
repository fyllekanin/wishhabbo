import { arrayOf, ClassHelper, objectOf } from '../../../../../shared/helpers/class.helper';
import { HomePageBannerEntry, HomePageStarLight } from '../../../../../shared/classes/home-page.class';

export class HomePageSettingsModel {
    @objectOf(HomePageStarLight)
    starLight: HomePageStarLight;
    @arrayOf(HomePageBannerEntry)
    bannerEntries: Array<HomePageBannerEntry> = [];

    constructor (source: Partial<HomePageSettingsModel>) {
        ClassHelper.assign(this, source);
    }
}
