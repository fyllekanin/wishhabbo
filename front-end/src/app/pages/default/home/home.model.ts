import { arrayOf, ClassHelper } from '../../../shared/helpers/class.helper';
import { ArticleClass } from '../../../shared/classes/media/article.class';
import { HabboBadgeClass } from '../../../shared/classes/habbo-badge.class';
import { Slot } from '../../../shared/components/timetable/timetable.interface';

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

    constructor (source?: Partial<HomeModel>) {
        ClassHelper.assign(this, source);
    }
}
