import { arrayOf, ClassHelper, objectOf } from '../../../shared/helpers/class.helper';
import { ArticleClass } from '../../../shared/classes/media/article.class';
import { HabboBadgeClass } from '../../../shared/classes/habbo-badge.class';

export class ArticlePage {
    @objectOf(ArticleClass)
    article: ArticleClass = new ArticleClass(null);
    @arrayOf(HabboBadgeClass)
    badges: Array<HabboBadgeClass> = [];

    constructor (source: Partial<ArticlePage>) {
        ClassHelper.assign(this, source);
    }
}
