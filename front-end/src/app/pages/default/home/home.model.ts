import { arrayOf, ClassHelper, objectOf } from '../../../shared/helpers/class.helper';
import { ArticleClass } from '../../../shared/classes/media/article.class';
import { HabboBadgeClass } from '../../../shared/classes/habbo-badge.class';
import { Slot } from '../../../shared/components/timetable/timetable.interface';
import { HomePageBannerEntry, HomePageStarLight } from '../../../shared/classes/home-page.class';

export class HomeModel {
    @arrayOf(HabboBadgeClass)
    badges: Array<HabboBadgeClass> = [];
    @arrayOf(ArticleClass)
    guides: Array<ArticleClass> = [];
    @arrayOf(ArticleClass)
    habboNews: Array<ArticleClass> = [];
    @arrayOf(ArticleClass)
    siteNews: Array<ArticleClass> = [];
    @arrayOf(Slot)
    todayEvents: Array<Slot> = [];
    @objectOf(HomePageStarLight)
    starLight: HomePageStarLight;
    @arrayOf(HomePageBannerEntry)
    bannerEntries: Array<HomePageBannerEntry> = [];

    constructor (source?: Partial<HomeModel>) {
        ClassHelper.assign(this, source);
    }
}
