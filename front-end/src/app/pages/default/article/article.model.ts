import { arrayOf, ClassHelper, objectOf, primitiveOf } from '../../../shared/helpers/class.helper';
import { ArticleClass } from '../../../shared/classes/media/article.class';
import { HabboBadgeClass } from '../../../shared/classes/habbo-badge.class';
import { SlimUser } from '../../../shared/classes/slim-user.class';

export class ArticleComment {
    @primitiveOf(Number)
    articleCommentId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitiveOf(String)
    content: string;

    constructor (source: Partial<ArticleComment>) {
        ClassHelper.assign(this, source);
    }
}

export class ArticlePage {
    @objectOf(ArticleClass)
    article: ArticleClass = new ArticleClass(null);
    @arrayOf(HabboBadgeClass)
    badges: Array<HabboBadgeClass> = [];
    @primitiveOf(Boolean)
    isCompleted: boolean;
    @arrayOf(ArticleComment)
    comments: Array<ArticleComment> = [];

    constructor (source: Partial<ArticlePage>) {
        ClassHelper.assign(this, source);
    }
}
