import { ArticleView } from '../staff/media/article.view';
import { BadgeView } from '../badge.view';

export class ArticlePage {
    private readonly article: ArticleView;
    private readonly badges: Array<BadgeView>;
    private readonly isCompleted: boolean;

    constructor (builder: Builder) {
        this.article = builder.article;
        this.badges = [...builder.badges];
        this.isCompleted = builder.isCompleted;
    }

    getArticle (): ArticleView {
        return this.article;
    }

    getBadges (): Array<BadgeView> {
        return [...this.badges];
    }

    getIsCompleted (): boolean {
        return this.isCompleted;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    article: ArticleView;
    badges: Array<BadgeView>;
    isCompleted: boolean;

    withArticle (article: ArticleView): Builder {
        this.article = article;
        return this;
    }

    withBadges (badges: Array<BadgeView>): Builder {
        this.badges = [...badges];
        return this;
    }

    withIsCompleted (isCompleted: boolean): Builder {
        this.isCompleted = isCompleted;
        return this;
    }

    build (): ArticlePage {
        return new ArticlePage(this);
    }
}
